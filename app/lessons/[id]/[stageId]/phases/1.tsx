"use client";
import { useEffect, useState } from "react";
import { axiosInstance } from "@/lib/axios";

interface AlphabetData {
  letter: string;
  demoImage: string; // or whatever fields your backend returns
  description?: string;
}

interface Phase1Props {
  letter: string;
  onComplete: () => void;
}

export default function Phase1({ letter, onComplete }: Phase1Props) {
  const [alphabet, setAlphabet] = useState<AlphabetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

useEffect(() => {
  const fetchAlphabet = async () => {
    try {
      const { data } = await axiosInstance.get(`/alphabet/${letter}`);
      if (data.success) {
        setAlphabet(data.data);
      } else {
        setError(data.message || "Alphabet not found");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Failed to fetch");
    } finally {
      setLoading(false);
    }
  };

  fetchAlphabet();
}, [letter]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!alphabet) return null;

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-4">{alphabet.letter}</h2>
      {alphabet.demoImage && (
        <img src={alphabet.demoImage} alt={alphabet.letter} className="w-40 h-40 mb-4" />
      )}
      {alphabet.description && <p className="mb-4">{alphabet.description}</p>}

      <button
        className="px-4 py-2 bg-[var(--primary)] text-[var(--background)] rounded hover:scale-105 transition"
        onClick={onComplete}
      >
        Next
      </button>
    </div>
  );
}
