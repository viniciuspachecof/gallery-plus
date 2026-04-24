-- Cole este SQL no Supabase > SQL Editor e execute

CREATE TABLE IF NOT EXISTS public.photos (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(255) NOT NULL,
  image_id    VARCHAR(255),
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.albums (
  id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  title       VARCHAR(100) NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.photos_on_albums (
  photo_id UUID NOT NULL REFERENCES public.photos(id) ON DELETE CASCADE,
  album_id UUID NOT NULL REFERENCES public.albums(id) ON DELETE CASCADE,
  PRIMARY KEY (photo_id, album_id)
);

CREATE INDEX IF NOT EXISTS idx_photos_title             ON public.photos(title);
CREATE INDEX IF NOT EXISTS idx_poa_photo_id             ON public.photos_on_albums(photo_id);
CREATE INDEX IF NOT EXISTS idx_poa_album_id             ON public.photos_on_albums(album_id);
