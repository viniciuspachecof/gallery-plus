import { useQuery } from '@tanstack/react-query';
import type { Photo } from '../models/photo';
import { fetcher } from '../../../helpers/api';
import { useQueryState } from 'nuqs';

export default function usePhotos() {
  const [albumId, setAlbumId] = useQueryState('albumId');

  const { data, isLoading } = useQuery<Photo[]>({
    queryKey: ['photos'],
    queryFn: () => fetcher('/photos'),
  });

  return {
    photos: data || [],
    isLoadingPhotos: isLoading,
    filters: {
      albumId,
      setAlbumId,
    },
  };
}
