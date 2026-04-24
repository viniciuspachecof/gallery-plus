import type { VercelRequest, VercelResponse } from '@vercel/node'
import { supabase } from '../_lib/supabase.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('albums')
      .select('id, title')
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })

    return res.json(data ?? [])
  }

  if (req.method === 'POST') {
    const { title } = req.body as { title: string }
    if (!title?.trim()) return res.status(400).json({ error: 'Title is required' })

    const { data, error } = await supabase
      .from('albums')
      .insert({ title: title.trim() })
      .select('id, title')
      .single()

    if (error) return res.status(500).json({ error: error.message })

    return res.status(201).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
