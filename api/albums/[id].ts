import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { id } = req.query as { id: string }

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('albums')
      .select('id, title')
      .eq('id', id)
      .single()

    if (error) return res.status(404).json({ error: 'Album not found' })

    return res.json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await supabase.from('albums').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })

    return res.status(204).end()
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
