"use client";

import { useEffect } from "react";

export default function AuthGuard({ children }: any) {
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      window.location.href = "/login";
    }
  }, []);

  return children;
}
