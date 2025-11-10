"use client";
import { useRef, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";

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

  // Socket.IO states
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [prediction, setPrediction] = useState({ label: 'none', score: 0 });
  const [isCorrect, setIsCorrect] = useState(false);

  // Refs for frame capture and interval
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

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

  // Socket.IO initialization - connect immediately on mount
  useEffect(() => {
    // Choose URL based on lessonType
    let socketUrl: string | undefined;
    if (lessonType === 'alphabet') {
      socketUrl = process.env.NEXT_PUBLIC_SOCKETIO_ALPHABET_URL;
    } else {
      socketUrl = process.env.NEXT_PUBLIC_SOCKETIO_URL;
    }

    if (!socketUrl) {
      console.error("Socket.IO URL not configured for lessonType:", lessonType);
      return;
    }

    console.log('Connecting to Socket.IO:', socketUrl, 'for lessonType:', lessonType);

    // Prevent duplicate connections
    if (socket?.connected) {
      console.log('Socket already connected, reusing existing connection');
      return;
    }

    const socketInstance = io(socketUrl);

    socketInstance.on('connect', () => {
      console.log('Socket.IO connected with SID:', socketInstance.id);
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      console.log('Socket.IO disconnected');
      setIsConnected(false);
    });

    socketInstance.on('status', (data: any) => {
      console.log('Status:', data);
    });

    socketInstance.on('prediction', (data: { label: string; score: number }) => {
      setPrediction(data);

      // Check if prediction matches the target letter
      if (data.label.toLowerCase() === letter.toLowerCase() && data.score >= 0) {
        setIsCorrect(true);
        // Stop sending frames
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        // Disconnect socket
        socketInstance.disconnect();
      }
    });

    setSocket(socketInstance);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (socketInstance.connected) {
        socketInstance.disconnect();
      }
    };
  }, [letter, lessonType]);

  // Auto-start frame sending when camera is ready
  useEffect(() => {
    if (!socket || !isConnected || isCorrect) {
      console.log('Frame sending blocked:', { socket: !!socket, isConnected, isCorrect });
      return;
    }

    // Check if video is ready before starting
    const checkAndStartSending = () => {
      const video = videoRef.current;
      if (!video || !streamRef.current) {
        console.log('Video or stream not ready yet');
        return;
      }

      // Wait for video to be ready
      if (video.readyState < 2) {
        console.log('Waiting for video readyState...');
        video.addEventListener('loadeddata', checkAndStartSending, { once: true });
        return;
      }

      console.log('Starting frame sending at 25 FPS');
      
      // Start sending frames automatically
      const interval = setInterval(() => {
        captureFrame();
      }, 40); // 25 FPS

      intervalRef.current = interval;
    };

    // Small delay to ensure camera stream is fully initialized
    const timeoutId = setTimeout(checkAndStartSending, 500);

    return () => {
      clearTimeout(timeoutId);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
        console.log('Frame sending stopped');
      }
    };
  }, [socket, isConnected, isCorrect]);

  // Frame capture function
  const captureFrame = () => {
    if (!videoRef.current || !canvasRef.current || !socket) {
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Check if video is ready
    if (video.readyState < 2) {
      return;
    }

    // Check if socket is still connected
    if (!socket.connected) {
      console.log('Socket disconnected, stopping frame capture');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }
    
    const ctx = canvas.getContext('2d');
    if (!ctx){ 
      console.log("canva error");
      return;
    }

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    ctx.drawImage(video, 0, 0);

    try {
      const base64 = canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
      socket.emit('frame', { image: base64 });
      console.log("frame sent");
    } catch (error) {
      console.error('Error capturing frame:', error);
    }
  };

  const handleFinish = () => {
    // Stop interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    // Disconnect socket
    if (socket) {
      socket.disconnect();
    }

    // Stop camera
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }

    // Route to good-job page with lesson type
    router.push(`/good-job?type=${lessonType || "alphabet"}`);
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

          {/* Prediction display below user's camera */}
          {prediction.label !== 'none' && !isCorrect && (
            <p className="text-lg text-muted-foreground mt-2">
              Detected: {prediction.label.toUpperCase()}
            </p>
          )}
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

      {/* Success message - big, center, above buttons */}
      {isCorrect && (
        <div className="my-6">
          <h1 className="text-5xl font-bold text-green-500">Correct!!</h1>
        </div>
      )}

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

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}