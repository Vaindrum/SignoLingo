"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Phase1 from "./phases/1";
import Phase2 from "./phases/2";
import Phase3 from "./phases/3";

interface LessonData {
  letter?: string;
  digit?: string;
  word?: string;
  demoImage?: string;
  video?: string;
  alternatives?: string[];
  description?: string;
  difficulty_level?: string;
  rank?: number;
}

export default function StagePage() {
  const params = useParams();
  const id = typeof params.id === "string" ? params.id : Array.isArray(params.id) ? params.id[0] : undefined;
  const stageId = typeof params.stageId === "string"
    ? params.stageId
    : Array.isArray(params.stageId) && params.stageId.length > 0
      ? params.stageId[0]
      : undefined;

  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [phase, setPhase] = useState(1);

  useEffect(() => {
    async function fetchLessonData() {
      if (!id || !stageId) return;

      console.log("🎯 Frontend - Fetching lesson data:");
      console.log("  - Lesson type (id):", id);
      console.log("  - Stage ID:", stageId);

      try {
        setLoading(true);
        setError(null);
        
        const apiUrl = `/api/lessons/${id}/${stageId}`;
        console.log("🔗 Calling API:", apiUrl);
        
        const response = await fetch(apiUrl);
        
        console.log("📡 API Response status:", response.status);
        
        if (!response.ok) {
          throw new Error("Failed to fetch lesson data");
        }

        const data = await response.json();
        
        console.log("📦 Received data from API:", JSON.stringify(data, null, 2));
        
        if (data.success) {
          console.log("✅ Setting lesson data:", data.data);
          setLessonData(data.data);
        } else {
          console.error("❌ API returned error:", data.message);
          setError(data.message || "Failed to load lesson");
        }
      } catch (err) {
        console.error("💥 Error fetching lesson data:", err);
        setError("Unable to load lesson. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchLessonData();
  }, [id, stageId]);

  const handleNextPhase = () => {
    setPhase((prev) => (prev < 3 ? prev + 1 : prev));
  };

  if (!stageId || !id) {
    return <div className="text-red-500 mt-10 text-center">Stage not found.</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading lesson...</p>
        </div>
      </div>
    );
  }

  if (error || !lessonData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center text-red-500">
          <p className="text-xl mb-4">{error || "Lesson data not found."}</p>
          <button 
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-primary text-background rounded-lg hover:bg-primary/90"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Determine the display value and media based on lesson type
  const displayValue = lessonData.letter || lessonData.digit || lessonData.word || stageId;
  const mediaUrl = lessonData.demoImage || lessonData.video;
  const isVideo = id === "words";

  console.log("🎬 Rendering with:");
  console.log("  - Display value:", displayValue);
  console.log("  - Media URL:", mediaUrl);
  console.log("  - Is video:", isVideo);
  console.log("  - Current phase:", phase);

  return (
    <div className="p-6 flex flex-col items-center min-h-screen bg-background">
      <div className="w-full max-w-4xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-foreground">
          {/* {id === "alphabet" && "Letter"}  */}
          {/* {id === "numbers" && "Number"}  */}
          {/* {id === "words" && "Word"}: {displayValue.toUpperCase()} */}
        </h2>

        {phase === 1 && (
          <Phase1 
            letter={displayValue} 
            imageUrl={mediaUrl}
            isVideo={isVideo}
            lessonType={id}
            onComplete={handleNextPhase} 
          />
        )}
        {phase === 2 && (
          <Phase2 
            letter={displayValue} 
            imageUrl={mediaUrl}
            isVideo={isVideo}
            lessonType={id}
            onComplete={handleNextPhase} 
          />
        )}
        {phase === 3 && (
          <Phase3 
            letter={displayValue}
            imageUrl={mediaUrl}
            isVideo={isVideo}
            lessonType={id}
          />
        )}
      </div>
    </div>
  );
}