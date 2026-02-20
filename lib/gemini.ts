const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export async function callAI(prompt: string): Promise<string> {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
        throw new Error('GROQ_API_KEY is not configured. Get a free key at https://console.groq.com/keys');
    }

    const response = await fetch(GROQ_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [
                { role: 'user', content: prompt },
            ],
            temperature: 0.2,
            max_tokens: 2048,
        }),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Groq API error: ${response.status} - ${error}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content;

    if (!text) {
        throw new Error('No content returned from Groq');
    }

    return text;
}

export function extractJSON(text: string): Record<string, unknown> | null {
    try {
        return JSON.parse(text);
    } catch {
        // noop
    }

    const codeBlockMatch = text.match(/```(?:json)?\s*\n?([\s\S]*?)\n?\s*```/);
    if (codeBlockMatch) {
        try {
            return JSON.parse(codeBlockMatch[1]);
        } catch {
            // noop
        }
    }

    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
        try {
            return JSON.parse(jsonMatch[0]);
        } catch {
            // noop
        }
    }

    return null;
}

export async function calculateThesisMatch(company: any, enrichmentData: any, thesis: string): Promise<{ score: number, reasoning: string }> {
    const prompt = `Score this company from 0 to 100 on how well it matches this investment thesis: "${thesis}".
    
Company Name: ${company.name}
Description: ${company.description}
Enriched Data: ${JSON.stringify(enrichmentData)}

Return ONLY a JSON object exactly like this: {"score": 85, "reasoning": "Your reasoning here..."}
Do not use markdown blocks.`;

    try {
        const responseText = await callAI(prompt);
        const result = extractJSON(responseText);
        if (result && typeof result.score === 'number' && typeof result.reasoning === 'string') {
            return { score: result.score, reasoning: result.reasoning };
        }
    } catch (e) {
        console.error("Thesis match calculation failed", e);
    }

    return { score: 0, reasoning: "Evaluation failed or data unavailable." };
}
