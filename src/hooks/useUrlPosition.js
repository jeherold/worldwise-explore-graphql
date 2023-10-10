import { useSearchParams } from 'react-router-dom';

/** need to create our own custom hook when we want to return logic
 *  used from a react provided hook */
export function useUrlPosition() {
  const [searchParams] = useSearchParams();
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');

  return [lat, lng];
}
