'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@clerk/nextjs';
import { Item } from '@/types/item';

interface OutfitCanvasProps {
  selectedItems: Item[];
  onOutfitGenerated: (outfitUrl: string) => void;
}

const OutfitCanvas: React.FC<OutfitCanvasProps> = ({ selectedItems, onOutfitGenerated }) => {
  const { userId } = useAuth();
  const [generatedOutfit, setGeneratedOutfit] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const generateOutfit = async () => {
    setIsLoading(true);
    const response = await fetch('/api/visualize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemIds: selectedItems.map((item) => item.id),
      }),
    });

    if (response.ok) {
      const data = await response.json();
      setGeneratedOutfit(data.imageUrl);
      onOutfitGenerated(data.imageUrl);
    } else {
      console.error('Failed to generate outfit');
    }
    setIsLoading(false);
  };

  const saveOutfit = async () => {
    if (!generatedOutfit || !userId) return;

    const { error } = await supabase.from('visualizations').insert([
      {
        user_id: userId,
        image_url: generatedOutfit,
        item_ids: selectedItems.map((item) => item.id),
      },
    ]);

    if (error) {
      console.error('Error saving outfit:', error);
    } else {
      alert('Outfit saved!');
    }
  };

  const downloadOutfit = () => {
    if (!generatedOutfit) return;

    const a = document.createElement('a');
    a.href = generatedOutfit;
    a.download = 'outfit.png';
    a.click();
  };

  return (
    <div className="bg-gray-200 p-4 rounded-lg">
      <div className="grid grid-cols-3 gap-4 mb-4">
        {selectedItems.map((item, index) => (
          <div key={index} className="bg-white p-2 rounded-lg">
            <img src={item.processed_url} alt={`Selected item ${index + 1}`} className="w-full h-full object-cover" />
          </div>
        ))}
      </div>
      <button
        onClick={() => generateOutfit()}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
        disabled={selectedItems.length === 0 || isLoading}
      >
        {isLoading ? 'Generating...' : 'Generate Outfit'}
      </button>
      <div className="bg-white p-4 rounded-lg text-center h-64 flex items-center justify-center mt-4">
        {generatedOutfit ? (
          <img src={generatedOutfit} alt="Generated Outfit" className="max-h-full max-w-full" />
        ) : (
          <p>AI-generated outfit will appear here</p>
        )}
      </div>
      {generatedOutfit && (
        <div className="flex justify-center mt-4 space-x-4">
          <button
            onClick={saveOutfit}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Save Outfit
          </button>
          <button
            onClick={downloadOutfit}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Download Outfit
          </button>
        </div>
      )}
    </div>
  );
};

export default OutfitCanvas;
