import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, '');

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  console.log("📥 Fetching all items for category:", id);
  console.log("🔧 BACKEND_URL:", BACKEND_URL);

  try {
    let backendUrl = "";

    if (id === "alphabet") {
      backendUrl = `${BACKEND_URL}/alphabets/all`;
    } else if (id === "numbers") {
      backendUrl = `${BACKEND_URL}/numbers/all`;
    } else if (id === "words") {
      backendUrl = `${BACKEND_URL}/words/all?limit=100`;
    } else {
      console.error("❌ Invalid category:", id);
      return NextResponse.json(
        { success: false, message: `Invalid category: ${id}. Valid categories are: alphabet, numbers, words` },
        { status: 400 }
      );
    }

    console.log("🔗 Fetching all items from:", backendUrl);

    const response = await fetch(backendUrl);
    
    console.log("📡 Backend response status:", response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Backend error:", errorText);
      throw new Error(`Failed to fetch items: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Received data:", data);
    
    return NextResponse.json({
      success: true,
      data: data.data
    });

  } catch (error) {
    console.error("💥 Error fetching category items:", error);
    return NextResponse.json(
      { success: false, message: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    );
  }
}
