from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from deepface import DeepFace
import cv2
import numpy as np

app = FastAPI()

# Enable CORS for requests from Node backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/analyze")
async def analyze_face(frame: UploadFile = File(...)):
    try:
        contents = await frame.read()
        np_img = np.frombuffer(contents, np.uint8)
        img = cv2.imdecode(np_img, cv2.IMREAD_COLOR)
        
        result = DeepFace.analyze(
            img,
            actions=["emotion"],
            enforce_detection=False
        )
        
        emotion = result[0]["dominant_emotion"]
        emotion_score = {
            "happy": 0.9,
            "neutral": 0.7,
            "surprise": 0.8,
            "sad": 0.3,
            "angry": 0.2,
            "fear": 0.2,
            "disgust": 0.2
        }.get(emotion, 0.5)
        
        return {
            "emotion": emotion,
            "engagement_score": emotion_score
        }
    except Exception as e:
        print(f"Error analyzing frame: {e}")
        return {
            "emotion": "unknown",
            "engagement_score": 0.5
        }

@app.get("/health")
async def health_check():
    return {"status": "AI service is running"}
