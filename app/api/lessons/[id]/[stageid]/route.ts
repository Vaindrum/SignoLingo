import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, '');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string; stageid: string }> }
) {
  // Await params in Next.js 15
  const { id, stageid } = await context.params;

  // Log incoming request parameters
  console.log("📥 API Route - Received request:");
  console.log("  - id:", id);
  console.log("  - stageid:", stageid);
  console.log("  - BACKEND_URL:", BACKEND_URL);

  try {
    let backendUrl = "";
    const normalizedStageId = stageid.toLowerCase();

    // Route to appropriate backend endpoint based on lesson type
    if (id === "alphabet") {
      backendUrl = `${BACKEND_URL}/alphabet/${normalizedStageId}`;
    } else if (id === "numbers") {
      backendUrl = `${BACKEND_URL}/number/${normalizedStageId}`;
    } else if (id === "words") {
      backendUrl = `${BACKEND_URL}/word/${normalizedStageId}`;
    } else {
      console.error("❌ Invalid lesson category:", id);
      return NextResponse.json(
        { success: false, message: "Invalid lesson category" },
        { status: 400 }
      );
    }

    console.log("🔗 Fetching from backend:", backendUrl);
    
    const response = await fetch(backendUrl);
    
    console.log("📡 Backend response status:", response.status);
    
    if (!response.ok) {
      console.error("❌ Backend returned error:", response.status, response.statusText);
      return NextResponse.json(
        { success: false, message: "Lesson not found" },
        { status: 404 }
      );
    }

    const data = await response.json();
    
    // Log raw backend data
    console.log("📦 Raw backend data:", JSON.stringify(data, null, 2));
    
    // Normalize the response structure for consistent frontend handling
    let normalizedData;
    
    if (id === "alphabet") {
      normalizedData = {
        letter: data.data.letter,
        demoImage: data.data.demoImage,
        description: data.data.description,
        isActive: data.data.isActive
      };
      console.log("✅ Normalized alphabet data:", normalizedData);
    } else if (id === "numbers") {
      normalizedData = {
        digit: data.data.digit,
        demoImage: data.data.demoImage,
        description: data.data.description,
        isActive: data.data.isActive
      };
      console.log("✅ Normalized number data:", normalizedData);
    } else {
      // words
      normalizedData = {
        word: data.data.word,
        video: data.data.video,
        alternatives: data.data.alternatives || [],
        rank: data.data.rank,
        difficulty_level: data.data.difficulty_level,
        heuristic_score: data.data.heuristic_score
      };
      console.log("✅ Normalized word data:", normalizedData);
    }

    console.log("🎉 Sending normalized response to frontend");

    return NextResponse.json({
      success: true,
      message: "Lesson retrieved successfully",
      data: normalizedData
    });

  } catch (error) {
    console.error("💥 Error fetching lesson:", error);
    console.error("Error details:", {
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
