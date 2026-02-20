import { NextResponse } from 'next/server';
import { callAI, extractJSON, calculateThesisMatch } from '@/lib/gemini';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { website, company } = body;

        // Validate URL
        if (!website || typeof website !== 'string') {
            return NextResponse.json({ error: 'Website URL is required' }, { status: 400 });
        }

        try {
            new URL(website);
        } catch {
            return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });
        }

        // Step 1: Scrape with Jina Reader
        let scrapedContent: string;
        try {
            const controller = new AbortController();
            const timeout = setTimeout(() => controller.abort(), 15000);

            const jinaUrl = `https://r.jina.ai/${website}`;
            const jinaRes = await fetch(jinaUrl, {
                headers: { Accept: 'text/plain' },
                signal: controller.signal,
            });

            clearTimeout(timeout);

            if (!jinaRes.ok) {
                throw new Error(`Jina returned ${jinaRes.status}`);
            }

            scrapedContent = await jinaRes.text();
        } catch (err) {
            console.error('[Enrich] Jina scrape failed:', err);
            const message = err instanceof Error && err.name === 'AbortError'
                ? 'Website fetch timed out (15s)'
                : 'Could not fetch website';
            return NextResponse.json({ error: message }, { status: 500 });
        }

        // Truncate to ~8000 characters for Gemini context safety
        const truncated = scrapedContent.slice(0, 8000);

        // Step 2: Call Gemini for AI extraction
        const prompt = `You are a VC analyst assistant. Analyze this company website content and extract structured information.

Return ONLY a valid JSON object. No markdown, no explanation, no code blocks. Just raw JSON.

Format:
{
  "summary": "1-2 sentence description of what the company does and who it serves",
  "whatTheyDo": ["bullet 1", "bullet 2", "bullet 3"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5"],
  "signals": [
    { "text": "Short signal description", "type": "positive", "reasoning": "why this matters to a VC" }
  ]
}

For signals, extract 3-5 signals that a venture capitalist would care about. Examples of good signals: "Careers page detected with 12+ open engineering roles" (positive, hiring signal), "Pricing page present suggesting commercial traction", "Active blog — most recent post within 30 days", "Changelog/release notes page found indicating active product development", "Enterprise sales motion — 'Contact Sales' CTA prominent", "API documentation exists suggesting developer-first product", "No public pricing — likely enterprise/sales-led". 
Never include generic signals about contact forms, login pages, or standard website elements. Assign type as "positive" (growth, hiring, traction), "neutral", or "risk".

Website content:
${truncated}`;

        try {
            console.log('[Enrich] Calling Gemini API...');
            const geminiResponse = await callAI(prompt);
            console.log('[Enrich] Gemini raw response (first 500 chars):', geminiResponse.slice(0, 500));
            const parsed = extractJSON(geminiResponse);

            if (!parsed) {
                console.error('[Enrich] Could not parse JSON from Gemini response');
                return NextResponse.json({ error: 'AI extraction failed — could not parse response' }, { status: 500 });
            }

            const result: any = {
                summary: (parsed.summary as string) || '',
                whatTheyDo: (parsed.whatTheyDo as string[]) || [],
                keywords: (parsed.keywords as string[]) || [],
                signals: (parsed.signals as any[]) || [],
                source: `https://r.jina.ai/${website}`.replace('https://r.jina.ai/', ''),
                scrapedAt: new Date().toISOString(),
            };

            // Step 3: Thesis Match
            const thesis = 'B2B SaaS companies with technical founders, building developer tools or AI infrastructure, Series A or earlier.';
            if (company) {
                const thesisMatch = await calculateThesisMatch(company, result, thesis);
                result.thesisMatch = thesisMatch;
            }

            return NextResponse.json(result);
        } catch (err) {
            console.error('[Enrich] Gemini extraction failed:', err);
            const errorMessage = err instanceof Error ? err.message : 'AI extraction failed';
            return NextResponse.json({ error: errorMessage }, { status: 500 });
        }
    } catch {
        return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }
}
