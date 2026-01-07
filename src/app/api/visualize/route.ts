import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'
import { createServerSupabaseClient } from '@/lib/supabase.server'
import { generateOutfitImage } from '@/lib/ai/nanobanana'

export async function POST(req: Request) {
  const { userId } = await auth()

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { itemIds } = await req.json()

    if (!Array.isArray(itemIds) || itemIds.length < 2) {
      return NextResponse.json(
        { error: 'Select at least 2 clothing items' },
        { status: 400 }
      )
    }

    const supabase = await createServerSupabaseClient()

    // 1. Fetch clothing images
    const { data: items, error } = await supabase
      .from('items')
      .select('id, processed_url')
      .in('id', itemIds)
      .eq('user_id', userId)

    if (error || !items || items.length === 0) {
      throw new Error('Failed to fetch items')
    }

    const imageUrls = items.map(item => item.processed_url)

    // 2. Call Gemini NanoBanana (single step)
    const generatedImage = await generateOutfitImage(imageUrls)

    // 3. Upload result to Supabase Storage
    const filePath = `${userId}/${Date.now()}-visualization.png`

    const { error: uploadError } = await supabase
      .storage
      .from('visualizations')
      .upload(filePath, generatedImage, {
        contentType: 'image/png',
      })

    if (uploadError) throw uploadError

    const { data: urlData } = supabase
      .storage
      .from('visualizations')
      .getPublicUrl(filePath)

    // 4. Save DB record
    const { data: visualization, error: dbError } = await supabase
      .from('visualizations')
      .insert({
        user_id: userId,
        item_ids: itemIds,
        image_url: urlData.publicUrl,
      })
      .select()
      .single()

    if (dbError) throw dbError

    return NextResponse.json({
      imageUrl: urlData.publicUrl,
      visualizationId: visualization.id,
    })

  } catch (err) {
    console.error('Visualization error:', err)
    return NextResponse.json(
      { error: 'Failed to generate visualization' },
      { status: 500 }
    )
  }
}

export const maxDuration = 60
