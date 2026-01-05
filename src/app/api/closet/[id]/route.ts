import { auth } from '@clerk/nextjs/server'
import { createClient } from '@/lib/supabase/server'
import { type NextRequest } from 'next/server'

export async function DELETE(
  req: NextRequest,
  { params }: any
) {
  const { userId } = await auth()
  if (!userId) {
    return Response.json({ error: "Unauthorized" }, { status: 401 })
  }

  const id = params.id

  if (!id) {
    return Response.json({ error: "Item ID is required" }, { status: 400 })
  }

  try {
    const supabase = createClient()

    // First, get the image_url to be able to delete the file from storage
    const { data: item, error: selectError } = await supabase
        .from('clothing_items')
        .select('image_url')
        .eq('id', id)
        .single();

    if (selectError) {
        return Response.json({ error: selectError.message }, { status: 500 });
    }

    if (!item) {
        return Response.json({ error: 'Item not found' }, { status: 404 });
    }

    const imageUrl = item.image_url;
    const filename = imageUrl.split('/').pop();


    // Delete from storage
    if(filename) {
        const { error: storageError } = await supabase.storage
            .from('clothing-items')
            .remove([filename]);
        
        if (storageError) {
            return Response.json({ error: storageError.message }, { status: 500 });
        }
    }


    // Delete from database
    const { error: deleteError } = await supabase
      .from('clothing_items')
      .delete()
      .eq('id', id)

    if (deleteError) {
      return Response.json({ error: deleteError.message }, { status: 500 })
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: (error as Error).message }, { status: 500 })
  }
}
