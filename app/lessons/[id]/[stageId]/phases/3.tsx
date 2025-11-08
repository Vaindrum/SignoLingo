"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Phase3Props {
  letter: string;
  imageUrl?: string;
  isVideo?: boolean;
  lessonType?: string;
}

export default function Phase3({ letter, imageUrl, isVideo, lessonType }: Phase3Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const router = useRouter();
  const streamRef = useRef<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState("");
  const [showReference, setShowReference] = useState(false);

  useEffect(() => {
    async function enableCamera() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err: any) {
        setCameraError("Unable to access camera. Please grant camera permissions.");
        console.error("Camera error:", err);
      }
    }
    enableCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleFinish = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    router.push("/good-job");
  };

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-2xl font-bold mb-4">
        Show the sign for: <span className="text-primary">{letter.toUpperCase()}</span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl mb-6">
        {/* User's Camera */}
        <div className="flex flex-col items-center">
          <h3 className="text-lg font-semibold mb-2">Your Sign</h3>
          <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
            {cameraError ? (
              <div className="w-full h-full flex items-center justify-center p-4 text-center text-red-500">
                {cameraError}
              </div>
            ) : (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            )}
          </div>
        </div>

        {/* Reference Image/Video */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-lg font-semibold">Reference</h3>
            <button
              onClick={() => setShowReference(!showReference)}
              className="text-sm text-primary hover:underline"
            >
              {showReference ? "Hide" : "Show"}
            </button>
          </div>
          
          {showReference && imageUrl && (
            <div className="w-full aspect-video bg-muted rounded-lg overflow-hidden">
              {isVideo ? (
                <video 
                  src={imageUrl} 
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                  loop
                  muted
                />
              ) : (
                <img 
                  src={imageUrl} 
                  alt={letter} 
                  className="w-full h-full object-contain" 
                />
              )}
            </div>
          )}
          
          {!showReference && (
            <div className="w-full aspect-video bg-muted/30 rounded-lg flex items-center justify-center">
              <p className="text-muted-foreground">Click "Show" to see reference</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4">
        <button
          onClick={() => setShowReference(!showReference)}
          className="px-6 py-3 bg-secondary text-foreground rounded-lg hover:bg-secondary/90 transition-all"
        >
          {showReference ? "Hide Reference" : "Show Reference"}
        </button>
        
        <button
          onClick={handleFinish}
          className="px-6 py-3 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all"
        >
          Finish Lesson
        </button>
      </div>
    </div>
  );
}