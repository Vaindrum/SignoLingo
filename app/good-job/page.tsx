import Link from "next/link";

export default function GoodJobPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground">
      <h1 className="text-4xl font-bold text-primary mb-4">Good job!</h1>
      <p className="text-xl mb-6">You completed this stage successfully.</p>
      <Link
        href="/lessons/alphabet"
        className="px-6 py-2 bg-primary text-background rounded-lg font-semibold hover:bg-secondary transition"
      >
        Learn More
      </Link>
    </div>
  );
}
