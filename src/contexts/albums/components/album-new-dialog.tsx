import Button from '../../../components/button';
import {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
} from '../../../components/dialog';
import InputText from '../../../components/input-text';
import Text from '../../../components/text';
import type { Photo } from '../../photos/models/photo';
import SelectCheckboxIllustration from '../../../assets/images/select-checkbox.svg?react';
import Skeleton from '../../../components/skeleton';
import PhotoImageSelectable from '../../photos/components/photo-image-selectable';

interface AlbumNewDialogProps {
  trigger: React.ReactNode;
}

export default function AlbumNewDialog({ trigger }: AlbumNewDialogProps) {
  // Utilizar API quando estiver pronta
  const isLoadingPhotos = false;
  const photos: Photo[] = [
    {
      id: '123',
      title: 'Olá mundo',
      imageId: 'portrait-tower.png',
      albums: [
        { id: '111', title: 'Album 1' },
        { id: '222', title: 'Album 2' },
        { id: '333', title: 'Album 3' },
      ],
    },
  ];

  function handleTogglePhoto(selected: boolean, photoId: string) {
    console.log(selected, photoId);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>Criar álbum</DialogHeader>

        <DialogBody>
          <InputText placeholder="Adicione um título" />

          <div className="mt-9">
            <Text as="div" variant="label-small" className="mb-3">
              Fotos cadastradas
            </Text>

            {!isLoadingPhotos && photos.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {photos.map((photo) => (
                  <PhotoImageSelectable
                    key={photo.id}
                    src={`/images/${photo.imageId}`}
                    title={photo.title}
                    imageClassName="w-20 h-20"
                    onSelectedImage={(selected) => handleTogglePhoto(selected, photo.id)}
                  ></PhotoImageSelectable>
                ))}
              </div>
            )}

            {isLoadingPhotos && (
              <div className="flex flex-wrap gap-2">
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton key={`photo.loading-${index}`} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            )}

            {!isLoadingPhotos && photos.length === 0 && (
              <div className="w-full flex flex-col justify-center items-center gap-3">
                <SelectCheckboxIllustration />
                <Text variant="paragraph-medium">Nenhuma foto disponível para seleção</Text>
              </div>
            )}
          </div>
        </DialogBody>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancelar</Button>
          </DialogClose>

          <Button>Criar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
