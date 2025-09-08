"use client";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function IdGrid() {
  const params = useParams();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  if (!id) {
    return <p className="text-center mt-10 text-red-500">Category not found</p>;
  }

  let items: string[] = [];

  if (id === "alphabet") {
    items = "abcdefghijklmnopqrstuvwxyz".split("");
  } else if (id === "numbers") {
    items = "0123456789".split("");
  }

  return (
    <div className="min-h-screen flex flex-col items-center bg-background p-6 text-foreground">
      <h1 className="text-3xl font-bold mb-6 text-foreground">
        {id.charAt(0).toUpperCase() + id.slice(1)} Lessons
      </h1>

      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
        {items.map((item) => (
          <Link key={item} href={`/lessons/${id}/${item}`}>
            <div className="flex items-center justify-center h-16 w-16 bg-background shadow-md rounded-lg cursor-pointer hover:bg-primary hover:text-background transition-colors duration-200 text-xl font-semibold text-foreground border border-muted">
              {item.toUpperCase()}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}