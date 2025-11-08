"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function IdGrid() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [items, setItems] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

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
          // Fetch words from backend
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/"}word/all?limit=50&sort=rank`
          );
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
  }, [id]);

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

      {items.length === 0 ? (
        <p className="text-center text-muted-foreground mt-10">
          No {id} available at the moment.
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
    </div>
  );
}