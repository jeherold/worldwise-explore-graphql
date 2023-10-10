import { useParams } from 'react-router-dom';
import { useEffect } from 'react';

import styles from './City.module.css';
import { useCities } from '../contexts/CitiesContext';
import Spinner from '../components/Spinner';
import BackButton from './BackButton';

/** format date helper */
const formatDate = (date) =>
  new Intl.DateTimeFormat('en', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    weekday: 'long',
  }).format(new Date(date));

function City() {
  /** get the id from the url */
  const { id } = useParams();
  const { getCity, currentCity, isLoading } = useCities();

  /** useEffect to get the city from our context when the comp mounts */
  useEffect(
    function () {
      getCity(id);
    },
    /** getCity actually updates the state and will cause infinite loop in this use-case if not stablized
     *  - cant remove from dependency arr so solution is to make this function stable with useCallback in context file
     */
    [id, getCity]
  );

  const { cityName, emoji, date, notes } = currentCity;

  if (isLoading) return <Spinner />;

  return (
    <div className={styles.city}>
      <div className={styles.row}>
        <h6>City name</h6>
        <h3>
          <span>{emoji}</span> {cityName}
        </h3>
      </div>

      <div className={styles.row}>
        <h6>You went to {cityName} on</h6>
        <p>{formatDate(date || null)}</p>
      </div>

      {notes && (
        <div className={styles.row}>
          <h6>Your notes</h6>
          <p>{notes}</p>
        </div>
      )}

      <div className={styles.row}>
        <h6>Learn more</h6>
        <a
          href={`https://en.wikipedia.org/wiki/${cityName}`}
          target="_blank"
          rel="noreferrer"
        >
          Check out {cityName} on Wikipedia &rarr;
        </a>
      </div>

      <div>
        <BackButton />
      </div>
    </div>
  );
}

export default City;
