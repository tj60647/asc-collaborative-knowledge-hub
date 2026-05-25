import { NextResponse } from 'next/server';

export const runtime = 'edge';

const SYSTEM_PROMPT = `
You are the Editorial Assistant for the American Society for Cybernetics (ASC).
Your job is to draft an engaging, professional monthly newsletter based on recently published resources (glossary terms, publications, and events).
The newsletter should be formatted in clean Markdown so the human administrator can easily copy and paste it into their mailing software.

Guidelines:
1. Start with a warm, brief introduction about the society's recent activity.
2. Highlight the newly added glossary terms with short, intriguing summaries.
3. Mention any new publications or events.
4. Keep the tone academic, welcoming, and systemically focused.
5. End with a call to action inviting members to propose their own terms to the Collaborative Knowledge Hub.
`;

export async function POST(request: Request) {
  try {
    const { model } = await request.json();

    if (!model) {
      return NextResponse.json({ error: 'No model specified' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured on the server.' }, { status: 500 });
    }

    // Mock data for MVP: In production, this would query Supabase for resources where status = 'published' and created_at > last_month
    const mockRecentResources = [
      { type: 'glossary_term', title: 'Autopoiesis', content: 'A system capable of reproducing and maintaining itself.' },
      { type: 'glossary_term', title: 'Law of Requisite Variety', content: 'Only variety can absorb variety.' },
      { type: 'publication', title: 'Cybernetics of Cybernetics', content: 'Applying cybernetics to itself.' }
    ];

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000',
        'X-Title': 'ASC Collaborative Knowledge Hub',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Here are the recent publications to include in this month's draft:\n\n${JSON.stringify(mockRecentResources, null, 2)}` }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter Error:', errorText);
      return NextResponse.json({ error: `OpenRouter API error: ${response.statusText}` }, { status: response.status });
    }

    const json = await response.json();
    const draftContent = json.choices[0]?.message?.content || 'Failed to generate draft.';

    return NextResponse.json({ draftContent });
  } catch (error: any) {
    console.error('Newsletter Agent Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
