"use client";
import { useState, useEffect } from "react";
import { axiosInstance } from "@/lib/axios";

interface AlphabetData {
  letter: string;
  demoImage: string;
  description?: string;
}

interface Phase2Props {
  letter: string;
  onComplete: () => void;
}

export default function Phase2({ letter, onComplete }: Phase2Props) {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [alphabet, setAlphabet] = useState<AlphabetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchAlphabet = async () => {
      try {
        const { data } = await axiosInstance.get(`/alphabet/${letter}`);
        if (data.success) {
          setAlphabet(data.data);
        } else {
          setFetchError(data.message || "Alphabet not found");
        }
      } catch (err: any) {
        setFetchError(err.response?.data?.message || err.message || "Failed to fetch");
      } finally {
        setLoading(false);
      }
    };

    fetchAlphabet();
  }, [letter]);

  const handleSubmit = () => {
    if (input.toUpperCase() === letter.toUpperCase()) {
      setError("");
      onComplete();
    } else {
      setError("Incorrect! Try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (fetchError) return <p className="text-red-500">{fetchError}</p>;
  if (!alphabet) return null;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">Type the letter you see:</h2>
      {alphabet.demoImage && (
        <img src={alphabet.demoImage} alt={alphabet.letter} className="w-40 h-40 mb-4" />
      )}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        maxLength={1}
        className="border border-[var(--muted)] px-4 py-2 rounded mb-2 text-center text-xl w-20"
      />
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded hover:scale-105 transition"
      >
        Next
      </button>
    </div>
  );
}