"use client";

import { useEffect, useState } from "react";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/api/notifications/1")
      .then((res) => res.json())
      .then((data) => setNotifications(data));
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Notifications</h1>

      {notifications.map((n: any) => (
        <div key={n.id} style={{ marginTop: 20 }}>
          {n.message}
        </div>
      ))}
    </div>
  );
}
