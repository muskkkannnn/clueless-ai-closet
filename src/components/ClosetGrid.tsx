'use client';

import React from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Item } from '@/types/item';


interface ClosetGridProps {
  items: Item[];
  onSelectItem: (item: Item) => void;
  selectedItems: string[];
}

const ClosetGrid: React.FC<ClosetGridProps> = ({ items, onSelectItem, selectedItems }) => {
  const { userId } = useAuth();
  const router = useRouter();

  const handleDelete = async (item: Item) => {
    if (!userId) return;

    // First, delete the item from the database
    const { error: dbError } = await supabase.from('items').delete().eq('id', item.id);

    if (dbError) {
      console.error('Error deleting item from database:', dbError);
      return;
    }

    // Then, delete the images from storage
    const originalFileName = item.image_url.substring(item.image_url.lastIndexOf('/') + 1);
    const processedFileName = item.processed_url.substring(item.processed_url.lastIndexOf('/') + 1);

    const { error: storageError } = await supabase.storage.from('clothing-items').remove([`${userId}/${originalFileName}`, `${userId}/${processedFileName}`]);

    if (storageError) {
      console.error('Error deleting image from storage:', storageError);
    }

    router.refresh();
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="relative"
          >
            <div
              className={`bg-white p-4 rounded-lg cursor-pointer ${selectedItems.includes(item.processed_url) ? 'ring-2 ring-blue-500' : ''}`}
              onClick={() => onSelectItem(item)}
            >
              <img src={item.processed_url} alt={item.type} className="w-full h-full object-cover" />
              <p className="text-center mt-2">{item.type}</p>
            </div>
            <button
              onClick={() => handleDelete(item)}
              className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
            >
              X
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClosetGrid;

