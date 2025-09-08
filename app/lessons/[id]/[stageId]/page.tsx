"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import Phase1 from "./phases/1";
import Phase2 from "./phases/2";
import Phase3 from "./phases/3";

export default function StagePage() {
  const params = useParams();
  const letter = typeof params.stageId === "string"
    ? params.stageId
    : Array.isArray(params.stageId) && params.stageId.length > 0
      ? params.stageId[0]
      : undefined;

//   const imageUrl = letter ? `/images/${letter}.png` : undefined;

  const [phase, setPhase] = useState(1);

  const handleNextPhase = () => {
    setPhase((prev) => (prev < 3 ? prev + 1 : prev));
  };

  if (!letter) {
    return <div className="text-red-500 mt-10">Stage not found.</div>;
  }

  return (
    <div className="p-6 flex flex-col items-center">
      {phase === 1 && <Phase1 letter={letter} onComplete={handleNextPhase} />}
      {phase === 2 && <Phase2 letter={letter} onComplete={handleNextPhase} />}
      {phase === 3 && <Phase3 letter={letter} />}
    </div>
  );
}