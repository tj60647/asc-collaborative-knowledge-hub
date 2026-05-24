import { NextResponse } from 'next/server';

export const runtime = 'edge';

// We want to return an array of mapped profiles based on the CSV data.
// We force the AI to return a JSON array.
const SYSTEM_PROMPT = `
You are an expert data migration engineer for the American Society for Cybernetics.
Your job is to map messy, raw CSV data (provided as JSON) into our strictly typed PostgreSQL schema.

The target schema for a "Profile" is a JSON object with the following exact keys:
- "first_name" (string): The member's first name.
- "last_name" (string): The member's last name.
- "email" (string): The member's email address.
- "role" (string): Must be exactly one of: "member", "moderator", "manager", "admin". Infer from the raw data. If unclear, default to "member".
- "bio" (string, optional): Any notes, organization, or biographical information provided.
- "discoverability_opt_in" (boolean): Must always be false for legacy imports due to GDPR compliance.

You will receive an array of raw row objects. You must respond ONLY with a valid JSON array of mapped objects. Do not include markdown code blocks like \`\`\`json. Do not include any conversational text. Return only the raw JSON array.
`;

export async function POST(request: Request) {
  try {
    const { csvData, model } = await request.json();

    if (!csvData || !Array.isArray(csvData) || csvData.length === 0) {
      return NextResponse.json({ error: 'No CSV data provided' }, { status: 400 });
    }

    if (!model) {
      return NextResponse.json({ error: 'No model specified' }, { status: 400 });
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'OPENROUTER_API_KEY is not configured on the server.' }, { status: 500 });
    }

    // Call OpenRouter API
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': 'http://localhost:3000', // Required by OpenRouter for ranking
        'X-Title': 'ASC Collaborative Knowledge Hub',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: model,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT },
          { role: 'user', content: `Please map this raw data to the schema:\n\n${JSON.stringify(csvData, null, 2)}` }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter Error:', errorText);
      return NextResponse.json({ error: `OpenRouter API error: ${response.statusText}` }, { status: response.status });
    }

    const json = await response.json();
    let content = json.choices[0]?.message?.content || '[]';

    // Strip markdown formatting if the model ignored the instruction
    if (content.startsWith('```json')) {
      content = content.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (content.startsWith('```')) {
      content = content.replace(/^```/, '').replace(/```$/, '').trim();
    }

    let mappedData;
    try {
      mappedData = JSON.parse(content);
    } catch (parseError) {
      console.error('Failed to parse AI response as JSON:', content);
      return NextResponse.json({ error: 'The AI model returned invalid JSON.' }, { status: 500 });
    }

    return NextResponse.json({ mappedData });
  } catch (error: any) {
    console.error('Data Mapping Error:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
