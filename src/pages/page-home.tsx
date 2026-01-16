import Container from '../components/container';
import AlbumsFilter from '../contexts/albums/components/albums-filter';
import PhotosList from '../contexts/photos/components/photos.list';

export default function PageHome() {
  return (
    <Container>
      <AlbumsFilter
        albums={[
          { id: '111', title: 'Album 1' },
          { id: '222', title: 'Album 2' },
          { id: '333', title: 'Album 3' },
        ]}
        loading
        className="mb-9"
      />

      <PhotosList
        photos={[
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
        ]}
      />
    </Container>
  );
}
