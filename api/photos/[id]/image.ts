import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase, toPhoto } from '../../_lib/supabase.js'
import busboy from 'busboy'
import { randomUUID } from 'crypto'
import path from 'path'

export const config = { api: { bodyParser: false } }

const MIME_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
}

function parseMultipart(req: VercelRequest): Promise<{ buffer: Buffer; filename: string }> {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers as Record<string, string> })
    let fileBuffer: Buffer | null = null
    let filename = 'image'

    bb.on('file', (_field, file, info) => {
      filename = info.filename
      const chunks: Buffer[] = []
      file.on('data', (chunk: Buffer) => chunks.push(chunk))
      file.on('end', () => { fileBuffer = Buffer.concat(chunks) })
    })

    bb.on('finish', () => {
      if (!fileBuffer) return reject(new Error('No file received'))
      resolve({ buffer: fileBuffer, filename })
    })

    bb.on('error', reject)
    req.pipe(bb)
  })
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  try {
    const { buffer, filename } = await parseMultipart(req)
    const ext = path.extname(filename).toLowerCase()
    const imageId = `${randomUUID()}${ext}`

    const { data: existing } = await supabase
      .from('photos')
      .select('image_id')
      .eq('id', id)
      .single()

    if (existing?.image_id) {
      await supabase.storage.from('images').remove([existing.image_id])
    }

    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(imageId, buffer, {
        contentType: MIME_TYPES[ext] ?? 'application/octet-stream',
        upsert: false,
      })

    if (uploadError) return res.status(500).json({ error: uploadError.message })

    const { data: photo, error } = await supabase
      .from('photos')
      .update({ image_id: imageId })
      .eq('id', id)
      .select('id, title, image_id, albums:photos_on_albums(album:albums(id, title))')
      .single()

    if (error) return res.status(500).json({ error: error.message })

    return res.json(toPhoto(photo))
  } catch (err) {
    return res.status(500).json({ error: 'Failed to upload image' })
  }
}
