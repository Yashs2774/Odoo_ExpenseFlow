"use client";
import Login from "./auth/login/page";
import React, { useEffect } from "react";
import RegisterPage from "./auth/register/page";

export default function Home() {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/service-worker.js")
        .then((registration) => {
          // console.log("Service Worker Registered", registration);
        })
        .catch((error) => {
          console.error("Service Worker registration failed", error);
        });
    }
  }, []);

  return (
    <>
      <RegisterPage />
    </>
  );
}
