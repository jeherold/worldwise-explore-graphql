# Worldwise - React app with some GraphQL to get github username and avatar

## NOTE - there is a file purposely not in the repo that holds the user's github creds since this is just a personal project to practice react concepts and adding in some graphQL

- after cloning the repo need to create a gqldb.js file with the following in the src folder
- generate a token in settings > developer settings in your personal github
- replace these 2 in the const github setup with your info
- <your-github-username>
- <your-personal-github-generated-token>

#### dont push this file to your repo if forked. note that if named as instructed here - this file is in the .gitignore file. if named differently - add it to your gitignore

- src/gqldb.js

```jsx
/** req with authentication to allow access to github graphql */
const github = {
  baseUrl: "https://api.github.com/graphql",
  username: "<your-github-username>",
  headers: {
    "Content-type": "application/json",
    Authorization: "bearer <your-personal-github-generated-token>",
  },
};

export default github;
```

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

# How to start project with Vite

#### This will walk you through which application and allow you to choose React, Vue etc and whch template

```
npm create vite@latest
```

#### vite by default runs on port 5173

```
npm i
npm run dev
```

## configure eslint

```
npm i eslint vite-plugin-eslint eslint-config-react-app --sav-dev
```

Create a file called the following to extend vite eslint to work with react eslint
.eslintrc.json

```json
{
  "extends": "react-app"
}
```

In vite.config.js - vslint plugin to the array of plugins

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import eslint from "vite-plugin-eslint";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), eslint()],
});
```

# Add React Router

```
npm i react-router-dom
```

### How to set up BrowserRouter with routes

```js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

#### BrowserRouter works a little like Routeroutlet in Angular

- if content above the router outlet - the above content will always display on the page above the components displayed in the BrowserRouter section

```js
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <div>
      <h2>Above browser Router - displays on all routes</h2>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="product" element={<Product />} />
          <Route path="pricing" element={<Pricing />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
```

#### And proper way to set up a link with the Router Link comp

```js
<Link to="/pricing">Pricing</Link>
```

#### to take advantage of the built in NavLink features of React Router - it will add active class to active page

```js
import { NavLink } from "react-router-dom";

function PageNav() {
  return (
    <nav>
      <ul>
        <li>
          <NavLink to="/">Home</NavLink>
        </li>
        <li>
          <NavLink to="/pricing">Pricing</NavLink>
        </li>
        <li>
          <NavLink to="/product">Product</NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default PageNav;
```

#### In general - the App will handle the Routing only and let other components handle what should be displayed on each route.

# CSS Module

```css
/* to create a global class with no ui unique suffix use :global
 now you can just add className="test" and it will apply the class 
 - even though this is in the Pagenav module css - test class will work anywhere in the app now */
:global(.test) {
  background-color: chartreuse;
}
```

### Perfect Use case is Router NavLink that attaches active class to the current route.

- css module would add unique suffix to .active if we tried to style the active class with:
  .nav .active
- using the :global will leave the .active class without the suffix

```css
.nav :global(.active) {
  color: goldenrod;
}
```

#### Normally, of course, truly global styles would go in the global .css file

## Nested Routes

- any routes nested inside <Route> will be nested
- use index to let the React Router know what to display when no child routes match
- Example - app/cities will show cities - app/counties will show countries - app.form will show the form
  app/ with no matching children will display the index element

```jsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Product from "./pages/Product";
import Pricing from "./pages/Pricing";
import HomePage from "./pages/Homepage";
import PageNotFound from "./pages/PageNotFound";
import AppLayout from "./pages/AppLayout";
import Login from "./pages/Login";
import CityList from "./components/CityList";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomePage />} />
        <Route path="product" element={<Product />} />
        <Route path="pricing" element={<Pricing />} />
        <Route path="login" element={<Login />} />
        <Route path="app" element={<AppLayout />}>
          <Route index element={<CityList />} />
          <Route path="cities" element={<CityList />} />
          <Route path="countries" element={<p>Countries</p>} />
          <Route path="form" element={<p>Form</p>} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
```

## Router Outlet

- use Router Outlet component for positioning nested routes on the parent component

```js
import AppNav from "./AppNav";
import Logo from "../components/Logo";
import styles from "./Sidebar.module.css";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

function Sidebar() {
  return (
    <div className={styles.sidebar}>
      <Logo />
      <AppNav />

      <Outlet />

      <Footer />
    </div>
  );
}

export default Sidebar;
```

### useNavigate() in earlier versions was called useHistory

- you can pass in a param to set back how many
- define the number of steps you want to go forward in the browsers historyusing integer

```jsx
<div className={styles.buttons}>
  <Button type="primary">Add</Button>
  <Button type="back" onClick={navigate(1)}>
    &larr; Forward in history 1
  </Button>
  <Button type="back" onClick={navigate(2)}>
    &larr; Forward in history 2
  </Button>
</div>
```

- define the number of steps you want to go back in the browsers history with -integer

```jsx
<div className={styles.buttons}>
  <Button type="primary">Add</Button>
  <Button type="back" onClick={navigate(-1)}>
    &larr; Back in history 1
  </Button>
  <Button type="back" onClick={navigate(-2)}>
    &larr; Back in history 2
  </Button>
</div>
```

- if inside a form - e.preventDefault() to prevent form submission

```jsx
<div className={styles.buttons}>
  <Button
    type="back"
    onClick={(e) => {
      e.preventDefault();
      navigate(-1);
    }}
  >
    &larr; Back in history 1
  </Button>
</div>
```

### useNavigate() hook is an imperative approach

### Import Navigate Component - declarative approach (that React Router Dom gives us) use case in nested routes

#### More decalrative way of using <Navigate /> when useNavigate() hook wont really work

- see following example

#### Navigate component is not in use much anymore since useNavigate() hook

- example when the index route and one of the child routes point to same component

So instead of this setup that the index route takes to here: http://localhost:5173/app

```jsx
<Route path="app" element={<AppLayout />}>
  <Route index element={<CityList cities={cities} isLoading={isLoading} />} />
  <Route
    path="cities"
    element={<CityList cities={cities} isLoading={isLoading} />}
  />
  <Route path="cities/:id" element={<City />} />
  <Route
    path="countries"
    element={<CountryList cities={cities} isLoading={isLoading} />}
  />
  <Route path="form" element={<Form />} />
</Route>
```

Do this in the indexed route to do more of a redirect so we get this: http://localhost:5173/app/cities

- declaring where we want this to navigate/redirect to
- which is what we wanted to have focus when landing on AppLayout initially
- use replace to replace the current element in the history stack so the back button still works as expected

```jsx
<Route path="app" element={<AppLayout />}>
  <Route index element={<Navigate replace to="cities" />} />
  <Route
    path="cities"
    element={<CityList cities={cities} isLoading={isLoading} />}
  />
  <Route path="cities/:id" element={<City />} />
  <Route
    path="countries"
    element={<CountryList cities={cities} isLoading={isLoading} />}
  />
  <Route path="form" element={<Form />} />
</Route>
```

# useEffect - see slides for perfect explanation of useEffect

- used to synchronize 2 systems
- it is used to communicate with Apis etc and is mostly considered a synchronization mechanism
- typical use cases
- fetch data from an external source (api graphQl etc)
- synchronize map data as we used with leaflet setting position on component mounting or updates to lat/lng

# useReducer to handle all business logic for managing state setup

/\*\* should handle all the business logic

- - put as much logic as possible inside the reducer
- - so we have a central place that handles all the business logic
- - and all the states transitions
- But reducers must be pure functions - cannot do api requests inside reducer so
- after the data has been received from fetch call we can then dispatch actions to the reducer
  \*/

  - when 2 state variables will always be updated at the same time is another good use case like handling authentication for user and isAuthenicated
  - i.e - const [{user, isAuthenticated}, dispatch] = useReducer(reducer, initialState)

### NOTES

- 2 options we have for passing down the value into our context
- async data has 2 options

1.  pass in all the state plus the dispatch function into the value

- then we can use the dispatch function inside the components to update state
- however since we are working with asynchronous data we cannot have all the logic inside the reducer
- you could set up all the async function logic in the comp that will use it but that is not really what we want to keep the components clean.

2. 2nd option is to not pass the async function into the context but instead to use inside the event handler functions - this is the current setup we have in CitiesContext file

2b. IF we were NOT dealing with asyn functions would be better to pass the dispatch function in the value and let the components handle the dispatch themselves.

### Huge advantage of central place for state handling - With reducer structure in place makes it easy implement some more related state updates.

- for example - when a new city is created we can easily make it the active state in that switch case

```jsx
import { createContext, useContext, useEffect, useReducer } from "react";

const BASE_URL = "http://localhost:9000";

const CitiesContext = createContext();

/** holds the initial useState values when separately assigned in useState */
const initialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
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
    case "loading":
      return {
        ...state,
        isLoading: true,
      };
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      };
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      };
    case "city/created":
      /** will handle update ui state to match server action with react query later
       *  - updating manually for now with -- cities: [...state.cities, action.payload],
       */
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
      };
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      };
    default:
      throw new Error("unknown action type");
  }
}

function CitiesProvider({ children }) {
  /** [state, dispatch] equates to [state, setState] in useState() hook
   *  - dispatch will take the place of all the locations we used setState
   */
  /** destructure state immediately into the state vars */
  const [{ cities, isLoading, currentCity }, dispatch] = useReducer(
    reducer,
    initialState
  );
  /** going to combine these 3 states into a reducer */
  // const [cities, setCities] = useState([]);
  // const [isLoading, setIsLoading] = useState(false);
  // const [currentCity, setCurrentCity] = useState({});

  useEffect(function () {
    async function fetchCities() {
      dispatch({ type: "loading" });
      try {
        const res = await fetch(`${BASE_URL}/cities`);
        const data = await res.json();
        dispatch({ type: "cities/loaded", payload: data });
      } catch {
        /** just using this way to handle error for small app and demonstration */
        dispatch({
          type: "rejected",
          payload: "There was an error fetching cities...",
        });
      }
    }
    fetchCities();
  }, []);

  /** The following are event handlers setup in context to keep comp clean and all our fetch/mutation logic around a particular endpoint together - passed as provider value -
   *  getCity,
      createCity,
      deleteCity,
   */
  async function getCity(id) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities/${id}`);
      const data = await res.json();
      dispatch({ type: "city/loaded", payload: data });
    } catch {
      /** just using this way to handle error for small app and demonstration */
      dispatch({
        type: "rejected",
        payload: "There was an error fetching city...",
      });
    }
  }

  /** Specify options object since this will be a POST - mutate the remote/server state (db) */
  async function createCity(newCity) {
    dispatch({ type: "loading" });
    try {
      const res = await fetch(`${BASE_URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      dispatch({ type: "city/created", payload: data });
    } catch {
      /** just using this way to handle error for small app and demonstration */
      dispatch({
        type: "rejected",
        payload: "There was an error creating new city...",
      });
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      /** dont need to store the res of a DELETE */
      await fetch(`${BASE_URL}/cities/${id}`, {
        method: "DELETE",
      });

      dispatch({ type: "city/deleted", payload: id });
    } catch {
      /** just using this way to handle error for small app and demonstration */
      dispatch({
        type: "rejected",
        payload: "There was an error deleting city...",
      });
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
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
    throw new Error("useCities used out of scope");
  }
  return context;
}

export { CitiesProvider, useCities };
```

## FakeAuthContext.js

- Using Fake Authentication with one user for this project
- Will implement real authentication in a future lecture.

# useContext

### Basic boilerplate example that most all context will use

```jsx
import { createContext, useContext } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
  return <AuthContext.Provider>{children}</AuthContext.Provider>;
}

/** custom hook for consumers to use to get access to context */
function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside of AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
```
