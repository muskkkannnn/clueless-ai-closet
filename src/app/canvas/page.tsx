'use client'

import { useState, useEffect } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

// Simplified clothing item type
interface ClothingItem {
  id: string;
  image_url: string;
}

export default function CanvasPage() {
  const [closetItems, setClosetItems] = useState<ClothingItem[]>([])
  const [canvasItems, setCanvasItems] = useState<ClothingItem[]>([])
  const [visualizedImage, setVisualizedImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchClosetItems = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data, error } = await supabase
          .from('clothing_items')
          .select('id, image_url')
          .eq('user_id', user.id)

        if (error) {
          console.error('Error fetching closet items:', error)
        } else {
          setClosetItems(data as ClothingItem[])
        }
      }
    }
    fetchClosetItems()
  }, [])

  const onDragEnd = (result: any) => {
    const { source, destination } = result
    if (!destination) return

    const sourceList = source.droppableId === 'closet' ? [...closetItems] : [...canvasItems]
    const destList = destination.droppableId === 'closet' ? [...closetItems] : [...canvasItems]
    
    const [removed] = sourceList.splice(source.index, 1)

    if (source.droppableId === 'canvas' && destination.droppableId === 'closet') {
        // Item is being returned to the closet, no need to add it back to the canvas list.
    } else {
        destList.splice(destination.index, 0, removed)
    }

    if (source.droppableId === 'closet') {
        setCanvasItems(destList)
    } else {
        setCanvasItems(destList)
    }
  }

  const handleVisualize = async () => {
    if (canvasItems.length === 0) {
      setError('Please add items to the canvas to visualize.')
      return
    }

    setLoading(true)
    setError(null)
    setVisualizedImage(null)

    const imageUrls = canvasItems.map(item => item.image_url)

    const res = await fetch('/api/visualize', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        images: imageUrls,
        prompt: "A fashion model wearing the following items"
      }),
    })

    if (!res.ok) {
      const { error } = await res.json()
      setError(error)
      setLoading(false)
      return
    }

    const { publicUrl } = await res.json()
    setVisualizedImage(publicUrl)
    setLoading(false)
  }

  return (
    <div>
      <button onClick={handleVisualize} disabled={loading}>{loading ? 'Visualizing...' : 'Visualize'}</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ display: 'flex' }}>
          <Droppable droppableId="closet">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ width: '25%', border: '1px solid lightgrey', padding: '10px' }}>
                <h2>My Closet</h2>
                {closetItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Image src={item.image_url} alt="Clothing item" width={100} height={100} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
          <Droppable droppableId="canvas">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} style={{ width: '75%', border: '1px solid lightgrey', padding: '10px', minHeight: '500px' }}>
                <h2>Outfit Canvas</h2>
                {canvasItems.map((item, index) => (
                  <Draggable key={item.id} draggableId={item.id} index={index}>
                    {(provided) => (
                      <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                        <Image src={item.image_url} alt="Clothing item" width={150} height={150} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </div>
      </DragDropContext>
      {visualizedImage && (
        <div>
          <h2>Visualization</h2>
          <Image src={visualizedImage} alt="Outfit visualization" width={500} height={500} />
          <div>
            <button>Save</button>
            <a href={visualizedImage} download={`visualization-${Date.now()}.png`}>
              <button>Download</button>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
