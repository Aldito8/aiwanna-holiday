import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

if (!process.env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not defined");
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export async function POST(req: NextRequest) {
    try {
        const { prompt, location } = await req.json();

        if (!prompt) {
            return NextResponse.json(
                { error: "Prompt is required" },
                { status: 400 }
            );
        }

        const fullPrompt = `
        Anda adalah seorang ahli travel yang sangat membantu.
        Berikan saya 3 rekomendasi tempat liburan di ${location || 'Indonesia'} berdasarkan deskripsi berikut: "${prompt}".

        Berikan jawaban HANYA dalam format JSON yang valid.
        Struktur JSON harus berupa array dari objek, di mana setiap objek memiliki properti berikut:
        - "nama_tempat": string
        - "deskripsi": string (deskripsi singkat dan menarik, maksimal 30 kata)
        - "lokasi": string (contoh: "Kabupaten Badung, Bali")

        Contoh output JSON:
        [
            {
            "nama_tempat": "Pantai Kelingking",
            "deskripsi": "Sebuah pantai ikonik dengan tebing berbentuk T-Rex dan pemandangan laut biru yang menakjubkan. Populer untuk foto-foto Instagramable.",
            "lokasi": "Nusa Penida, Bali"
            }
        ]
    `;

        const result = await model.generateContent(fullPrompt);
        const responseText = result.response.text();

        const jsonString = responseText.replace(/```json/g, "").replace(/```/g, "").trim();

        const recommendations = JSON.parse(jsonString);

        return NextResponse.json({ recommendations });

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Gagal berkomunikasi dengan Gemini AI" },
            { status: 500 }
        );
    }
}