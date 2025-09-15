"use client";
import { useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

interface Phase3Props {
  letter: string;
}

export default function Phase3({ letter }: Phase3Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();

  // Store stream for cleanup
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        // Optionally handle error
      }
    }
    enableCamera();

    // Cleanup: stop camera when component unmounts
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFinish = () => {
    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    // Route to good job page
    router.push("/good-job");
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">
        Show the sign for: <span className="text-primary">{letter.toUpperCase()}</span>
      </h2>
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="w-107 h-80 bg-muted rounded mb-4"
      />
      <button
        onClick={handleFinish}
        className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded hover:scale-105 transition"
      >
        Finish
      </button>
    </div>
  );
}