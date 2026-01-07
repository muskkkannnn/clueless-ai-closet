'use client';

import { useState } from 'react';
import ClosetGrid from '@/components/ClosetGrid';
import OutfitCanvas from '@/components/OutfitCanvas';
import { Item } from '@/types/item';

interface ClosetProps {
  items: Item[];
}

export default function Closet({ items }: ClosetProps) {
  const [selectedItems, setSelectedItems] = useState<Item[]>([]);
  const [generatedOutfit, setGeneratedOutfit] = useState<string | null>(null);

  const handleSelectItem = (item: Item) => {
    setSelectedItems((prev) =>
      prev.some((i) => i.id === item.id)
        ? prev.filter((i) => i.id !== item.id)
        : [...prev, item]
    );
  };

  const handleOutfitGenerated = (outfitUrl: string) => {
    setGeneratedOutfit(outfitUrl);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">Closet</h2>
        <ClosetGrid
          items={items}
          onSelectItem={handleSelectItem}
          selectedItems={selectedItems.map((i) => i.processed_url)}
        />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Outfit Canvas</h2>
        <OutfitCanvas
          selectedItems={selectedItems}
          onOutfitGenerated={handleOutfitGenerated}
        />
      </div>
    </div>
  );
}
