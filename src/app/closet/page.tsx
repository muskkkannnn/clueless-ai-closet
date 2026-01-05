import { createClient } from '@/lib/supabase/server'
import { auth } from '@clerk/nextjs/server'
import ClosetGrid from '@/components/ClosetGrid'

export default async function ClosetPage() {
  const { userId } = await auth()
  if (!userId) {
    return <div>You must be logged in to view your closet.</div>
  }

  const supabase = createClient()
  const { data: clothingItems, error } = await supabase
    .from('clothing_items')
    .select('id, image_url')
    .eq('user_id', userId)

  if (error) {
    return <div>Error loading clothing items: {error.message}</div>
  }

  return (
    <div>
      <h1>My Closet</h1>
      <ClosetGrid initialClothingItems={clothingItems} />
    </div>
  )
}
