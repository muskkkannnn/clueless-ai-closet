import { createServerSupabaseClient } from '@/lib/supabase.server';
import { auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import UploadButton from '@/components/UploadButton';
import Closet from './Closet';

export default async function Home() {
  const { userId } = await auth();
  if (!userId) {
    redirect('/sign-in');
  }

  const supabase = await createServerSupabaseClient();
  const { data: items, error } = await supabase
    .from('items')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to fetch items:', error);
    // Handle the error appropriately
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">My Closet</h1>
        <UploadButton />
      </div>
      <Closet items={items || []} />
    </div>
  );
}