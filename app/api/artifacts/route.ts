import { NextRequest, NextResponse } from "next/server";
import { generateImage } from "@/lib/openai/image";

export async function POST(request: NextRequest) {
  try {
    const { prompt, size, quality, style } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const image = await generateImage({
      prompt,
      size,
      quality,
      style,
      model: "gpt-image-1", // This will fallback to dall-e-3 in the implementation
    });

    return NextResponse.json({
      success: true,
      image,
    });
  } catch (error: any) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate image" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  // Get artifact by ID implementation
  // This would typically fetch from a database
  return NextResponse.json(
    { message: "Artifact retrieval not implemented yet" },
    { status: 501 }
  );
}