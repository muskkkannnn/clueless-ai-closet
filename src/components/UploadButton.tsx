'use client';

import React, { useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const UploadButton = () => {
  const { userId } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [itemType, setItemType] = useState('top');
  const router = useRouter();

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) {
      return;
    }

    setIsUploading(true);

    const file = event.target.files[0];
    const fileName = `${userId}/${file.name}`;

    // Upload the original image to Supabase
    const { error: uploadError } = await supabase.storage
      .from('clothing-items')
      .upload(fileName, file, {
        upsert: true,
      });

    if (uploadError) {
      console.error('Error uploading file:', uploadError);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl } } = supabase.storage.from('clothing-items').getPublicUrl(fileName);

    // Remove the background
    const response = await fetch('/api/remove-background', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imageUrl: publicUrl }),
    });

    if (!response.ok) {
      console.error('Error removing background');
      setIsUploading(false);
      return;
    }

    const imageBlob = await response.blob();
    const processedFileName = `${userId}/processed-${file.name}`;


    // Upload the new image with the background removed
    const { error: newUploadError } = await supabase.storage
      .from('clothing-items')
      .upload(processedFileName, imageBlob, {
        upsert: true,
      });

    if (newUploadError) {
      console.error('Error uploading file with background removed:', newUploadError);
      setIsUploading(false);
      return;
    }

    const { data: { publicUrl: processedPublicUrl } } = supabase.storage.from('clothing-items').getPublicUrl(processedFileName);


    // Save the item to the items table
    const { error: dbError } = await supabase.from('items').insert([
      {
        user_id: userId,
        image_url: publicUrl,
        processed_url: processedPublicUrl,
        type: itemType,
      },
    ]);

    if (dbError) {
      console.error('Error saving item to database:', dbError);
    }

    setIsUploading(false);
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-2">
      <select
        value={itemType}
        onChange={e => setItemType(e.target.value)}
        className="bg-gray-200 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
      >
        <option value="top">Top</option>
        <option value="bottom">Bottom</option>
        <option value="shoes">Shoes</option>
      </select>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleUpload}
        className="hidden"
        accept="image/*"
        disabled={isUploading}
      />
      <button
        onClick={() => fileInputRef.current?.click()}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        disabled={isUploading}
      >
        {isUploading ? 'Uploading...' : 'Upload Image'}
      </button>
    </div>
  );
};

export default UploadButton;


