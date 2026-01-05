'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Image from 'next/image'

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<string | null>(null)
  const [bgRemovedImage, setBgRemovedImage] = useState<string | null>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!file) {
      setError('Please select a file to upload.')
      return
    }

    setUploading(true)
    setError(null)
    setResult(null)
    setBgRemovedImage(null)

    const supabase = createClient()
    const filename = `${Date.now()}-${file.name}`

    const { data, error: uploadError } = await supabase.storage
      .from('clothing-items')
      .upload(filename, file)

    if (uploadError) {
      setError(uploadError.message)
      setUploading(false)
      return
    }
    
    setResult(`Successfully uploaded: ${data.path}`)

    const { data: { publicUrl } } = supabase.storage.from('clothing-items').getPublicUrl(data.path)

    const res = await fetch('/api/remove-background', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl: publicUrl }),
    })

    if (!res.ok) {
        const { error } = await res.json()
        setError(error)
        setUploading(false)
        return
    }

    const { publicUrl: bgRemovedPublicUrl } = await res.json()

    setBgRemovedImage(bgRemovedPublicUrl)
    setUploading(false)
  }

  return (
    <div>
      <h1>Upload Clothing Item</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button type="submit" disabled={uploading}>
          {uploading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {result && <p>{result}</p>}
      {bgRemovedImage && (
        <div>
            <h2>Background Removed Image</h2>
            <Image src={bgRemovedImage} alt="Background removed" width={200} height={200} />
        </div>
      )}
    </div>
  )
}
