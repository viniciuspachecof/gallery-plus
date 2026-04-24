import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../../_lib/supabase.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }

  if (req.method !== 'PUT') return res.status(405).json({ error: 'Method not allowed' })

  const { albumsIds } = req.body as { albumsIds: string[] }

  const { error: deleteError } = await supabase
    .from('photos_on_albums')
    .delete()
    .eq('photo_id', id)

  if (deleteError) return res.status(500).json({ error: deleteError.message })

  if (albumsIds?.length > 0) {
    const { error } = await supabase
      .from('photos_on_albums')
      .insert(albumsIds.map((albumId) => ({ photo_id: id, album_id: albumId })))

    if (error) return res.status(500).json({ error: error.message })
  }

  return res.json({ success: true })
}
