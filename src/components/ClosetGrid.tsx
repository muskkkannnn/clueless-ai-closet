'use client'

import { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

interface ClothingItem {
    id: string;
    image_url: string;
}

interface ClosetGridProps {
    initialClothingItems: ClothingItem[];
}

export default function ClosetGrid({ initialClothingItems }: ClosetGridProps) {
    const [clothingItems, setClothingItems] = useState(initialClothingItems);
    const router = useRouter();

    const handleDelete = async (id: string) => {
        const res = await fetch(`/api/closet/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setClothingItems(clothingItems.filter(item => item.id !== id));
        } else {
            const { error } = await res.json();
            alert(`Error deleting item: ${error}`);
        }
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {clothingItems.map((item) => (
                <div key={item.id}>
                    <Image src={item.image_url} alt="Clothing item" width={200} height={200} />
                    <button onClick={() => handleDelete(item.id)}>Delete</button>
                </div>
            ))}
        </div>
    );
}
