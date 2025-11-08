"use client";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";

interface Phase2Props {
  letter: string;
  imageUrl?: string;
  isVideo?: boolean;
  lessonType?: string;
  onComplete: () => void;
}

export default function Phase2({ letter, imageUrl, isVideo, lessonType, onComplete }: Phase2Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [mediaUrl, setMediaUrl] = useState(imageUrl || "");
  const [isVideoMedia, setIsVideoMedia] = useState(isVideo || false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (lessonType === "alphabet") {
          const { data } = await axiosInstance.get(`/alphabet/${letter}`);
          if (data.success) {
            setMediaUrl(data.data.demoImage);
            setIsVideoMedia(false);
          } else {
            setFetchError(data.message || "Alphabet not found");
          }
        } else if (lessonType === "words") {
          const { data } = await axiosInstance.get(`/word/${letter.toLowerCase()}`);
          if (data.success) {
            setMediaUrl(data.data.video);
            setIsVideoMedia(true);
          } else {
            setFetchError(data.message || "Word not found");
          }
        } else if (lessonType === "numbers") {
          setMediaUrl(imageUrl || "");
          setIsVideoMedia(false);
        }
      } catch (err: any) {
        setFetchError(err.response?.data?.message || err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [letter, lessonType, imageUrl]);

  const handleSubmit = () => {
    const normalizedInput = input.trim().toLowerCase();
    const normalizedTarget = letter.toLowerCase();

    if (normalizedInput === normalizedTarget) {
      setError("");
      onComplete();
    } else {
      setError("Incorrect! Try again.");
      setInput("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (loading) return <p>Loading...</p>;
  if (fetchError) return <p className="text-red-500">{fetchError}</p>;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">
        Type the {lessonType === "alphabet" ? "letter" : lessonType === "numbers" ? "number" : "word"} you see:
      </h2>

      {mediaUrl && (
        <div className="w-80 h-80 mb-6 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
          {isVideoMedia ? (
            <video
              src={mediaUrl}
              className="w-full h-full object-contain"
              controls
              autoPlay
              loop
              muted
            />
          ) : (
            <img
              src={mediaUrl}
              alt="Sign"
              className="w-full h-full object-contain"
            />
          )}
        </div>
      )}

      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyPress={handleKeyPress}
        placeholder={lessonType === "alphabet" ? "Type letter..." : lessonType === "numbers" ? "Type number..." : "Type word..."}
        maxLength={lessonType === "alphabet" || lessonType === "numbers" ? 1 : 50}
        className="border border-muted px-4 py-2 rounded-lg mb-2 text-center text-xl w-64 focus:outline-none focus:ring-2 focus:ring-primary"
        autoFocus
      />

      {error && <p className="text-red-500 mb-2 text-sm">{error}</p>}

      <button
        onClick={handleSubmit}
        className="px-6 py-3 mt-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all"
      >
        Check Answer
      </button>
    </div>
  );
}