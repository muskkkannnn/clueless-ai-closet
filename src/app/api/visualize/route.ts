import { auth } from '@clerk/nextjs/server'
import { GoogleGenerativeAI } from '@google/generative-ai'
import { createClient } from '@/lib/supabase/server'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!)
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-image' })

async function urlToGenerativePart(url: string, mimeType: string) {
    const response = await fetch(url);
    const buffer = await response.arrayBuffer();
    return {
        inlineData: {
            data: Buffer.from(buffer).toString("base64"),
            mimeType
        },
    };
}

export async function POST(req: Request) {
    const { userId } = await auth()
    if (!userId) {
        return Response.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { images, prompt } = await req.json()

    if (!images || images.length === 0 || !prompt) {
        return Response.json({ error: "Images and prompt are required" }, { status: 400 })
    }

    try {
        const imageParts = await Promise.all(
            images.map((url: string) => urlToGenerativePart(url, 'image/png'))
        );

        const result = await model.generateContent([prompt, ...imageParts]);

        console.log(JSON.stringify(result, null, 2));

        return Response.json({ publicUrl: "placeholder" });

    } catch (error) {
        return Response.json({ error: (error as Error).message }, { status: 500 })
    }
}
