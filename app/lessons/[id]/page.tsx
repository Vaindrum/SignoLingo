"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

const DIFFICULTY_LEVELS = ["Very easy", "Easy", "Moderate", "Hard", "Very hard","Tested"];

export default function IdGrid() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("Very easy");

  useEffect(() => {
    async function fetchItems() {
      if (!id) return;

      try {
        setLoading(true);

        // For alphabet and numbers, generate locally
        if (id === "alphabet") {
          setItems("abcdefghijklmnopqrstuvwxyz".split(""));
        } else if (id === "numbers") {
          setItems("0123456789".split(""));
        } else if (id === "words") {
          // Fetch words from backend by difficulty level
          const endpoint = selectedDifficulty === "Tested" 
            ? `${process.env.NEXT_PUBLIC_API_URL}word/test?page=1&limit=100&sort=rank`
            : `${process.env.NEXT_PUBLIC_API_URL}word/difficulty/${selectedDifficulty}?limit=1000&sort=rank`;
          
          const response = await fetch(endpoint);
          // const response = await fetch(
          //   `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/"}word/difficulty/${selectedDifficulty}?limit=100&sort=rank`
          // );
          if (response.ok) {
            const data = await response.json();
            setItems(data.data.map((item: any) => item.word));
          } else {
            console.error("Failed to fetch words:", response.status);
            setItems([]);
          }
        }
      } catch (error) {
        console.error("Error fetching items:", error);
        setItems([]);
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, [id, selectedDifficulty]);

  if (!id) {
    return <p className="text-center mt-10 text-red-500">Category not found</p>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-background p-6 text-foreground">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        {id.charAt(0).toUpperCase() + id.slice(1)} Lessons
      </h1>

      {/* Difficulty Level Filter - Only show for words */}
      {id === "words" && (
        <div className="mb-6 flex flex-wrap gap-2 justify-center">
          {DIFFICULTY_LEVELS.map((level) => (
            <button
              key={level}
              onClick={() => setSelectedDifficulty(level)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedDifficulty === level
                  ? "bg-primary text-background shadow-lg scale-105"
                  : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      )}

      {items.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No {id} available{id === "words" ? ` for ${selectedDifficulty} difficulty` : ""} at the moment.
        </p>
      ) : (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
          {items.map((item) => (
            <Link key={item} href={`/lessons/${id}/${item}`}>
              <div className="flex items-center justify-center h-26 w-30 bg-background shadow-md rounded-lg cursor-pointer hover:bg-primary hover:text-background transition-colors duration-200 text-xl font-semibold text-foreground border border-muted">
                {item.toUpperCase()}
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Go Back Button */}
      <Link href="/lessons" className="mt-8">
        <button className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-all">
          Go Back
        </button>
      </Link>
    </div>
  );
}