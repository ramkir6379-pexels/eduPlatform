"use client";

import { Suspense } from "react";
import { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";
import { Phone, Mic, MicOff, Video, VideoOff, X } from "lucide-react";
import { API_URL, SOCKET_URL } from "@/config";

interface RemoteUser {
  id: string;
  stream: MediaStream | null;
}

interface Participant {
  id: string;
  role: "teacher" | "student";
  name?: string;
}

function LiveClassContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const classId = searchParams.get("classId") || "class-1";
  const userRole = searchParams.get("role") || "student";

  console.log("URL Params - classId:", classId, "role:", userRole);

  const myVideoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const peersRef = useRef<Map<string, any>>(new Map());
  const streamRef = useRef<MediaStream | null>(null);
  const sessionIdRef = useRef<string>("");

  const [remoteUsers, setRemoteUsers] = useState<RemoteUser[]>([]);
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Generate session ID on component mount
  useEffect(() => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0].replace(/-/g, "");
    const timeStr = now.toTimeString().split(" ")[0].replace(/:/g, "");
    sessionIdRef.current = `class-${classId}-${dateStr}-${timeStr}`;
    console.log("Session ID:", sessionIdRef.current);
  }, [classId]);

  // Initialize camera and socket
  useEffect(() => {
    const initializeCall = async () => {
      try {
        console.log("Starting camera initialization...");

        // Get user media
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: true,
        });

        console.log("Camera stream obtained:", stream);
        streamRef.current = stream;

        // Attach to video element
        const video = myVideoRef.current;
        if (video) {
          console.log("Attaching stream to video element");
          video.srcObject = stream;
        } else {
          console.error("Video element not found!");
          setError("Video element failed to mount");
          return;
        }

        // Initialize socket
        console.log("Connecting to socket...");
        socketRef.current = io(SOCKET_URL);

        socketRef.current.on("connect", () => {
          console.log("Socket connected:", socketRef.current?.id);
          socketRef.current?.emit("join-room", { classId, role: userRole });
        });

        socketRef.current.on("user-joined", (data: any) => {
          console.log("User joined:", data);
          const userId = typeof data === "string" ? data : data.id;
          const role = typeof data === "string" ? "student" : data.role;

          // Add to participants list
          setParticipants((prev) => [
            ...prev,
            { id: userId, role: role || "student" },
          ]);

          // Create peer connection
          createPeerConnection(userId, true, stream);
        });

        socketRef.current.on("signal", ({ from, data }: any) => {
          console.log("Signal received from:", from);
          if (!peersRef.current.has(from)) {
            createPeerConnection(from, false, stream);
          }
          peersRef.current.get(from)?.signal(data);
        });

        socketRef.current.on("user-left", (userId: string) => {
          console.log("User left:", userId);
          if (peersRef.current.has(userId)) {
            peersRef.current.get(userId).destroy();
            peersRef.current.delete(userId);
          }
          setRemoteUsers((prev) => prev.filter((u) => u.id !== userId));
          setParticipants((prev) => prev.filter((p) => p.id !== userId));
        });

        socketRef.current.on("class-ended", () => {
          console.log("Class ended by teacher");
          alert("Class ended by teacher");
          leaveClass();
        });

        // Add self to participants
        setParticipants([{ id: socketRef.current?.id || "you", role: userRole as "teacher" | "student" }]);
        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing call:", err);
        setError(
          err instanceof Error ? err.message : "Failed to access camera/microphone"
        );
        setIsLoading(false);
      }
    };

    initializeCall();

    return () => {
      console.log("Cleaning up...");
      streamRef.current?.getTracks().forEach((track) => track.stop());
      peersRef.current.forEach((peer) => peer.destroy());
      socketRef.current?.disconnect();
    };
  }, [classId, userRole]);

  // Frame capture interval (only for students)
  useEffect(() => {
    if (userRole !== "student") return;
    
    const interval = setInterval(() => {
      if (myVideoRef.current && isVideoOn) {
        captureFrame(myVideoRef.current);
      }
    }, 10000);
    return () => clearInterval(interval);
  }, [isVideoOn, userRole]);

  const createPeerConnection = (
    userId: string,
    initiator: boolean,
    stream: MediaStream
  ) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream,
      config: {
        iceServers: [
          { urls: "stun:stun.l.google.com:19302" },
          { urls: "stun:stun1.l.google.com:19302" },
        ],
      },
    });

    peer.on("signal", (data) => {
      socketRef.current?.emit("signal", { target: userId, data });
    });

    peer.on("stream", (remoteStream: MediaStream) => {
      console.log("Received remote stream from:", userId);
      setRemoteUsers((prev) => {
        const existing = prev.find((u) => u.id === userId);
        if (existing) {
          return prev.map((u) =>
            u.id === userId ? { ...u, stream: remoteStream } : u
          );
        }
        return [...prev, { id: userId, stream: remoteStream }];
      });
    });

    peer.on("error", (err) => {
      console.error("Peer error:", err);
    });

    peersRef.current.set(userId, peer);
  };

  const toggleAudio = () => {
    if (streamRef.current) {
      const audioTrack = streamRef.current.getAudioTracks()[0];
      const newState = !isAudioOn;
      audioTrack.enabled = newState;
      setIsAudioOn(newState);
    }
  };

  const toggleVideo = () => {
    if (streamRef.current) {
      const videoTrack = streamRef.current.getVideoTracks()[0];
      const newState = !isVideoOn;
      videoTrack.enabled = newState;
      setIsVideoOn(newState);

      // Reassign stream to video element to force refresh
      if (newState && myVideoRef.current) {
        myVideoRef.current.srcObject = streamRef.current;
      }
    }
  };

  const endClass = () => {
    if (userRole === "teacher") {
      socketRef.current?.emit("class-ended", classId);
      alert("Class ended");
    }
    leaveClass();
  };

  const captureFrame = (videoElement: HTMLVideoElement) => {
    if (!videoElement) return;
    
    const studentId = localStorage.getItem("userId");
    if (!studentId) {
      console.error("No student ID found in localStorage");
      return;
    }

    console.log("Student ID:", studentId);

    const canvas = document.createElement("canvas");
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.drawImage(videoElement, 0, 0);
    canvas.toBlob((blob) => {
      if (!blob) return;
      const formData = new FormData();
      formData.append("frame", blob);
      formData.append("class_id", classId);
      formData.append("student_id", studentId);
      formData.append("session_id", sessionIdRef.current);
      fetch(`${API_URL}/api/engagement/frame`, {
        method: "POST",
        body: formData,
      });
    }, "image/jpeg", 0.7);
  };

  const leaveClass = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    peersRef.current.forEach((peer) => peer.destroy());
    socketRef.current?.disconnect();
    router.back();
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-900">
        <div className="text-white text-center">
          <p className="text-xl mb-4">Error: {error}</p>
          <button
            onClick={() => router.back()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-white text-2xl font-bold">Live Class - {classId}</h1>
          {isLoading && (
            <p className="text-gray-400 text-sm mt-2">Initializing camera...</p>
          )}
        </div>
        <div className="text-white text-lg font-semibold">
          Participants: {participants.length}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Video Grid */}
        <div className="flex-1 p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {/* My Video */}
            <div className="bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
              {isVideoOn ? (
                <video
                  ref={myVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800">
                  <div className="text-gray-400 text-lg font-semibold">📹 Camera Off</div>
                  <div className="text-gray-500 text-sm mt-2">You turned off camera</div>
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-semibold">
                {userRole === "teacher" ? "👨‍🏫 Teacher" : "👨‍🎓 You"}
              </div>
            </div>

            {/* Remote Users */}
            {remoteUsers.map((user) => {
              const participant = participants.find((p) => p.id === user.id);
              return (
                <RemoteVideoStream
                  key={user.id}
                  user={user}
                  role={participant?.role || "student"}
                />
              );
            })}
          </div>
        </div>

        {/* Participants Sidebar */}
        <div className="w-64 bg-gray-800 border-l border-gray-700 p-4 overflow-y-auto">
          <h3 className="text-white font-bold text-lg mb-4">Participants</h3>
          <div className="space-y-2">
            {participants.map((participant) => (
              <div
                key={participant.id}
                className="bg-gray-700 rounded p-3 text-white text-sm flex items-center gap-2"
              >
                <span className="text-lg">
                  {participant.role === "teacher" ? "👨‍🏫" : "👨‍🎓"}
                </span>
                <span className="font-semibold">
                  {participant.role === "teacher" ? "Teacher" : "Student"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 border-t border-gray-700 px-6 py-4 flex justify-center gap-4">
        <button
          onClick={toggleAudio}
          className={`p-3 rounded-full transition ${
            isAudioOn
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-600 hover:bg-red-700"
          }`}
          title={isAudioOn ? "Mute" : "Unmute"}
        >
          {isAudioOn ? (
            <Mic className="text-white" size={24} />
          ) : (
            <MicOff className="text-white" size={24} />
          )}
        </button>

        <button
          onClick={toggleVideo}
          className={`p-3 rounded-full transition ${
            isVideoOn
              ? "bg-gray-700 hover:bg-gray-600"
              : "bg-red-600 hover:bg-red-700"
          }`}
          title={isVideoOn ? "Stop Video" : "Start Video"}
        >
          {isVideoOn ? (
            <Video className="text-white" size={24} />
          ) : (
            <VideoOff className="text-white" size={24} />
          )}
        </button>

        <button
          onClick={leaveClass}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition"
        >
          <Phone size={24} />
          Leave Class
        </button>

        {userRole === "teacher" && (
          <button
            onClick={endClass}
            className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-full flex items-center gap-2 transition"
          >
            <X size={24} />
            End Class
          </button>
        )}
      </div>
    </div>
  );
}

function RemoteVideoStream({
  user,
  role,
}: {
  user: RemoteUser;
  role: "teacher" | "student";
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hasStream, setHasStream] = useState(false);

  useEffect(() => {
    if (videoRef.current && user.stream) {
      console.log("Attaching remote stream:", user.id);
      videoRef.current.srcObject = user.stream;
      setHasStream(true);
    } else {
      setHasStream(false);
    }
  }, [user.stream]);

  return (
    <div className="bg-black rounded-lg overflow-hidden relative flex items-center justify-center">
      {hasStream ? (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-full bg-gray-800">
          <div className="text-gray-400 text-lg font-semibold">📹 Camera Off</div>
          <div className="text-gray-500 text-sm mt-2">
            {role === "teacher" ? "Teacher" : "Student"} turned off camera
          </div>
        </div>
      )}
      <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-3 py-1 rounded text-sm font-semibold">
        {role === "teacher" ? "👨‍🏫 Teacher" : "👨‍🎓 Student"}
      </div>
    </div>
  );
}

export default function LiveClass() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center h-screen bg-gray-900"><div className="text-white">Loading...</div></div>}>
      <LiveClassContent />
    </Suspense>
  );
}
