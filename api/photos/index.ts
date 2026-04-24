import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase, toPhoto } from '../_lib/supabase.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { albumId, q } = req.query

    let query = supabase
      .from('photos')
      .select('id, title, image_id, albums:photos_on_albums(album:albums(id, title))')
      .order('created_at', { ascending: false })

    if (q) {
      query = query.ilike('title', `%${q}%`)
    }

    if (albumId) {
      const { data: relations } = await supabase
        .from('photos_on_albums')
        .select('photo_id')
        .eq('album_id', albumId)

      const photoIds = (relations ?? []).map((r) => r.photo_id)
      if (photoIds.length === 0) return res.json([])
      query = query.in('id', photoIds)
    }

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })

    return res.json((data ?? []).map(toPhoto))
  }

  if (req.method === 'POST') {
    const { title } = req.body as { title: string }
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' })

    const { data, error } = await supabase
      .from('photos')
      .insert({ title: title.trim() })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })

    return res.status(201).json(toPhoto({ ...data, albums: [] }))
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
