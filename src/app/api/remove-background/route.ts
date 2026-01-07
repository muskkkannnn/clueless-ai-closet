import { NextResponse } from 'next/server';
import { removeBackground } from '@/lib/ai/backgroundRemoval';

export async function POST(req: Request) {
  try {
    const { imageUrl } = await req.json();

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL is required' }, { status: 400 });
    }

    // Fetch the image from the URL
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image from URL' }, { status: 500 });
    }
    const imageBlob = await imageResponse.blob();
    const imageFile = new File([imageBlob], 'image');


    // 1. Remove background using BRIA RMBG-1.4
    const processedImage = await removeBackground(imageFile);

    return new NextResponse(processedImage, {
        headers: {
            'Content-Type': 'image/png'
        }
    })
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed' },
      { status: 500 }
    );
  }
}
