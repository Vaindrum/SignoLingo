"use client";

interface Phase1Props {
  letter: string;
  imageUrl?: string;
  isVideo?: boolean;
  lessonType?: string;
  onComplete: () => void;
}

export default function Phase1({ letter, imageUrl, isVideo, lessonType, onComplete }: Phase1Props) {
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-4xl font-bold mb-4">{letter.toUpperCase()}</h2>
      
      {imageUrl && (
        <div className="w-80 h-80 mb-4 flex items-center justify-center bg-muted rounded-lg overflow-hidden">
          {isVideo ? (
            <video 
              src={imageUrl} 
              className="w-full h-full object-contain"
              controls
              autoPlay
              loop
              muted
            />
          ) : (
            <img 
              src={imageUrl} 
              alt={letter} 
              className="w-full h-full object-contain" 
            />
          )}
        </div>
      )}

      <p className="text-lg mb-4 text-muted-foreground">
        {lessonType === "alphabet" && "Learn how to sign this letter"}
        {lessonType === "numbers" && "Learn how to sign this number"}
        {lessonType === "words" && "Learn how to sign this word"}
      </p>

      <button
        className="px-6 py-3 mt-2 bg-primary text-background rounded-lg hover:bg-primary/90 transition-all"
        onClick={onComplete}
      >
        Next
      </button>
    </div>
  );
}
