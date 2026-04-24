import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase, toPhoto } from '../../_lib/supabase'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }

  if (req.method === 'GET') {
    const { data: photo, error } = await supabase
      .from('photos')
      .select('id, title, image_id, created_at, albums:photos_on_albums(album:albums(id, title))')
      .eq('id', id)
      .single()

    if (error || !photo) return res.status(404).json({ error: 'Photo not found' })

    const { data: allPhotos } = await supabase
      .from('photos')
      .select('id')
      .order('created_at', { ascending: false })

    const ids = (allPhotos ?? []).map((p) => p.id)
    const idx = ids.indexOf(id)

    return res.json({
      ...toPhoto(photo),
      nextPhotoId: idx < ids.length - 1 ? ids[idx + 1] : null,
      previousPhotoId: idx > 0 ? ids[idx - 1] : null,
    })
  }

  if (req.method === 'PATCH') {
    const { title } = req.body as { title: string }
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' })

    const { data, error } = await supabase
      .from('photos')
      .update({ title: title.trim() })
      .eq('id', id)
      .select('id, title, image_id')
      .single()

    if (error) return res.status(500).json({ error: error.message })

    return res.json(toPhoto({ ...data, albums: [] }))
  }

  if (req.method === 'DELETE') {
    const { data: photo } = await supabase
      .from('photos')
      .select('image_id')
      .eq('id', id)
      .single()

    if (photo?.image_id) {
      await supabase.storage.from('images').remove([photo.image_id])
    }

    const { error } = await supabase.from('photos').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })

    return res.status(204).end()
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
