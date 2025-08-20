import {
    GoogleGenAI,
} from '@google/genai';
import {
    NextRequest,
    NextResponse
} from 'next/server';

function isAboutHoliday(prompt: string): boolean {
    const holidayKeywords = ['liburan', 'travel', 'wisata', 'destinasi', 'jalan-jalan', 'tour', 'vacation', 'trip'];
    const lowerCasePrompt = prompt.toLowerCase();

    for (const keyword of holidayKeywords) {
        if (lowerCasePrompt.includes(keyword)) {
            return true;
        }
    }
    return false;
}

export async function POST(req: NextRequest) {
    try {
        const body: { prompt: string } = await req.json();
        const { prompt } = body;

        if (!prompt) {
            return NextResponse.json({
                error: 'Prompt is required!'
            }, {
                status: 400
            });
        }
        if (!isAboutHoliday(prompt)) {
            return NextResponse.json({
                response: 'Maaf, saya hanya bisa membantu dengan topik seputar liburan. 🏖️'
            });
        }

        const ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY as string,
        });

        const tools = [{ googleSearch: {} }];

        const config = {
            thinkingConfig: {
                thinkingBudget: -1,
            },
            tools,
        };

        const model = 'gemini-2.5-pro';
        const contents = [{
            role: 'user',
            parts: [{
                text: prompt,
            }],
        },];

        const streamResponse = await ai.models.generateContentStream({
            model,
            config,
            contents,
        });

        let fullTextResponse = '';
        for await (const chunk of streamResponse) {
            const text = chunk.text;
            if (text) {
                fullTextResponse += text;
            }
        }

        return NextResponse.json({
            response: fullTextResponse
        });

    } catch (error) {
        console.error(error);
        return NextResponse.json({
            error: 'Failed to generate content'
        }, {
            status: 500
        });
    }
}