import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useReducer,
} from 'react';

const BASE_URL = 'http://localhost:9000';

const CitiesContext = createContext();

/** holds the initial useState values when separately assigned in useState */
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: '',
};

/** should handle all the business logic
 *  - put as much logic as possible inside the reducer
 *  - so we have a central place that handles all the business logic
 *  - and all the states transitions
 *  But reducers must be pure functions - cannot do api requests inside reducer so
 *    after the data has been received from fetch call we can then dispatch actions to the reducer
 */
function reducer(state, action) {
  /** model actions as events (and not setters) is convention like so */
  switch (action.type) {
    case 'loading':
      return {
        ...state,
        isLoading: true,
      };
    case 'cities/loaded':
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case 'city/loaded':
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case 'city/created':
      /** will handle update ui state to match server action with react query later
       *  - updating manually for now with -- cities: [...state.cities, action.payload],
       */
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case 'city/deleted':
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case 'rejected':
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error('unknown action type');
  }
}

function CitiesProvider({ children }) {
  /** [state, dispatch] equates to [state, setState] in useState() hook
   *  - dispatch will take the place of all the locations we used setState
   */
  /** destructure state immediately into the state vars */
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    initialState
  );
  /** going to combine these 3 states into a reducer */
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: 'cities/loaded', payload: data });
      } catch {
        /** just using this way to handle error for small app and demonstration */
        dispatch({
          type: 'rejected',
          payload: 'There was an error fetching cities...',
        });
      }
    }
    fetchCities();
  }, []);

  /** real world use case for using useCallback so not an infinite loop where this is used in City.jsx useEffect
   *  and is required in the dependency array there.
   */
  const getCity = useCallback(
    async function getCity(id) {
      /** check if current city id is same as the id of getCity
       *  - dont call the api if it is already the current city
       *  - remember that id is coming from url and url params will always be a string
       */
      if (Number(id) === currentCity.id) return;

      dispatch({ type: 'loading' });
      try {
        const res = await fetch(`${BASE_URL}/cities/${id}`);
        const data = await res.json();
        dispatch({ type: 'city/loaded', payload: data });
      } catch {
        /** just using this way to handle error for small app and demonstration */
        dispatch({
          type: 'rejected',
          payload: 'There was an error fetching city...',
        });
      }
    },
    [currentCity.id]
  );

  /** Specify options object since this will be a POST - mutate the remote/server state (db) */
  async function createCity(newCity) {
    dispatch({ type: 'loading' });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: 'POST',
        body: JSON.stringify(newCity),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      dispatch({ type: 'city/created', payload: data });
    } catch {
      /** just using this way to handle error for small app and demonstration */
      dispatch({
        type: 'rejected',
        payload: 'There was an error creating new city...',
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: 'loading' });
    try {
      /** dont need to store the res of a DELETE */
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: 'DELETE',
      });

      dispatch({ type: 'city/deleted', payload: id });
    } catch {
      /** just using this way to handle error for small app and demonstration */
      dispatch({
        type: 'rejected',
        payload: 'There was an error deleting city...',
      });
    }
  }

  /** no need to memoize this value since nonthing above in the comp tree that would cause re-render */
  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}

/** Custom hook for the consumers */
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined) {
    throw new Error('useCities used out of scope');
  }
  return context;
}

export { CitiesProvider, useCities };
