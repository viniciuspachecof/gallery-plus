import { useParams } from 'react-router';
import Text from '../components/text';

export default function PagePhotoDetails() {
  const { id } = useParams();

  return <Text variant="heading-medium">Página detalhe foto! id: {id}</Text>;
}
