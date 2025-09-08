"use client";

import { lessons } from "@/data/lessons";
import Link from "next/link";

export default function LessonsPage() {
  return (
    <div className="min-h-screen p-6 bg-background text-foreground">
      <h1 className="text-3xl font-bold mb-6">Lessons</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Link
            key={lesson.id}
            href={`/lessons/${lesson.id}`}
            className="p-6 rounded-2xl border border-gray-700 bg-gray-800 hover:bg-gray-700 transition flex flex-col"
          >
            <h2 className="text-xl font-semibold mb-2">{lesson.title}</h2>
            <p className="text-sm text-muted mb-3">{lesson.description}</p>
            <span className="text-primary font-medium">+{lesson.xp} XP</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
