import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { title, description, content, tags, coverImage } = await req.json();

    // Validate required fields
    if (!title || !description || !content || !tags || !coverImage) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Make request to your backend API
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/blog/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // Get the token from cookies
        "Authorization": `Bearer ${req.cookies.get("token")?.value}`,
      },
      body: JSON.stringify({
        title,
        description,
        content,
        tags,
        coverImage,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json(
        { error: error.message || "Failed to create blog post" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
