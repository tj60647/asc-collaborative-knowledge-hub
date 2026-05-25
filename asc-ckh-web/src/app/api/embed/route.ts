import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, type, short_description, long_description, location } = body;

    // Concatenate metadata into a single rich string for embedding
    const contentToEmbed = `Title: ${title || ''} | Type: ${type || ''} | Summary: ${short_description || ''} | Details: ${long_description || ''} | Location: ${location || ''}`.trim();

    if (!process.env.OPENROUTER_API_KEY) {
      return NextResponse.json({ error: "Missing OPENROUTER_API_KEY" }, { status: 500 });
    }

    // Call OpenRouter API for embeddings using the OpenAI SDK format
    // Model: openai/text-embedding-3-small yields a 1536-dimensional vector
    const response = await fetch('https://openrouter.ai/api/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/text-embedding-3-small',
        input: contentToEmbed
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      console.error("OpenRouter Error:", errorData || response.statusText);
      return NextResponse.json({ error: "Failed to generate embedding" }, { status: response.status });
    }

    const data = await response.json();
    const embedding = data.data?.[0]?.embedding;

    if (!embedding) {
      return NextResponse.json({ error: "No embedding returned from OpenRouter" }, { status: 500 });
    }

    return NextResponse.json({ embedding });

  } catch (error) {
    console.error("Embedding generation failed:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
