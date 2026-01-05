import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'

const HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/briaai/RMBG-1.4'

export async function POST(req: Request) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { imageUrl } = await req.json()

  if (!imageUrl) {
    return Response.json({ error: "Image URL is required" }, { status: 400 })
  }

  try {
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
        throw new Error("Failed to fetch the image from the URL");
    }
    const imageBlob = await imageResponse.blob();


    const response = await fetch(HUGGING_FACE_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        'Content-Type': imageBlob.type,
      },
      body: imageBlob,
    })

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Hugging Face API Error:', errorBody);
        return Response.json({ error: 'Failed to remove background from image.', details: errorBody }, { status: response.status });
    }

    const resultBlob = await response.blob()
    const supabase = createClient()
    const filename = `bg-removed-${Date.now()}.png`

    const { data, error } = await supabase.storage
      .from('clothing-items')
      .upload(filename, resultBlob)

    if (error) {
      return Response.json({ error: error.message }, { status: 500 })
    }

    const { data: { publicUrl } } = supabase.storage.from('clothing-items').getPublicUrl(data.path)

    const { error: insertError } = await supabase
      .from('clothing_items')
      .insert([{ user_id: userId, image_url: publicUrl }])

    if (insertError) {
        return Response.json({ error: insertError.message }, { status: 500 })
    }

    return Response.json({ publicUrl })
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}
