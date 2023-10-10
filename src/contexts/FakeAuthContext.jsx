import { createContext, useContext, useReducer } from "react";

/** This is if course for fake authenticating demo purposes to learn the mechanics
 *  of authentication in isolation.
 */
const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "fakePasswordQuerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
};

const AuthContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  authError: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "login":
      /** While it might seem ...state is not needed here - important to always use this convention to future proof */
      return { ...state, user: action.payload, isAuthenticated: true };
    case "logout":
      return { ...state, user: null, isAuthenticated: false };
    default:
      return { ...state, authError: "Unknow action" };
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated, authError }, dispatch] = useReducer(
    reducer,
    initialState
  );

  /** typically this will happen in an api call */
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: "login", payload: FAKE_USER });
    }
  }

  function logout() {
    dispatch({ type: "logout" });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
        authError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error("AuthContext was used outside of AuthProvider");

  return context;
}

export { AuthProvider, useAuth };
