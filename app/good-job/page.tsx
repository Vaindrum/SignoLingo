"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function GoodJobContent() {
  const searchParams = useSearchParams();
  const lessonType = searchParams.get("type") || "alphabet";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold text-primary mb-4">Good job!</h1>
      <p className="text-xl mb-6">You completed this stage successfully.</p>
      <Link
        href={`/lessons/${lessonType}`}
        className="px-6 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-secondary transition"
      >
        Learn More
      </Link>
    </div>
  );
}

export default function GoodJobPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading...</div>}>
      <GoodJobContent />
    </Suspense>
  );
}
