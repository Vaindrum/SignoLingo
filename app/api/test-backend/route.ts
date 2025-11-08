import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";

export async function GET(request: NextRequest) {
  const results = {
    backendUrl: BACKEND_URL,
    tests: [] as any[]
  };

  // Test alphabet endpoint
  try {
    const alphabetResponse = await fetch(`${BACKEND_URL}/api/alphabets/a`);
    results.tests.push({
      endpoint: "/api/alphabets/a",
      status: alphabetResponse.status,
      ok: alphabetResponse.ok,
      data: alphabetResponse.ok ? await alphabetResponse.json() : null
    });
  } catch (error) {
    results.tests.push({
      endpoint: "/api/alphabets/a",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  // Test numbers endpoint
  try {
    const numberResponse = await fetch(`${BACKEND_URL}/api/numbers/1`);
    results.tests.push({
      endpoint: "/api/numbers/1",
      status: numberResponse.status,
      ok: numberResponse.ok,
      data: numberResponse.ok ? await numberResponse.json() : null
    });
  } catch (error) {
    results.tests.push({
      endpoint: "/api/numbers/1",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  // Test words endpoint
  try {
    const wordResponse = await fetch(`${BACKEND_URL}/api/words/hello`);
    results.tests.push({
      endpoint: "/api/words/hello",
      status: wordResponse.status,
      ok: wordResponse.ok,
      data: wordResponse.ok ? await wordResponse.json() : null
    });
  } catch (error) {
    results.tests.push({
      endpoint: "/api/words/hello",
      error: error instanceof Error ? error.message : "Unknown error"
    });
  }

  return NextResponse.json(results, { status: 200 });
}
