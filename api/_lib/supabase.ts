import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

export function toPhoto(row: Record<string, unknown>) {
  return {
    id: row.id,
    title: row.title,
    imageId: row.image_id ?? null,
    albums: Array.isArray(row.albums)
      ? (row.albums as Array<{ album: unknown }>).map((pa) => pa.album).filter(Boolean)
      : [],
  }
}
