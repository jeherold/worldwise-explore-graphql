import { useNavigate } from "react-router-dom";

import { useAuth } from "../contexts/FakeAuthContext";
import { useEffect } from "react";

/** Keep user from accessing pages when not authenticated */
function ProtectedRoute({ children }) {
  // this comp needs to know if user is authenticated
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // we should not call navigate function from toplevel code - it is basically an effect
  // effects belong in useeffect thus:
  useEffect(() => {
    if (!isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  /** Important to remember that useEffect runs after the initial render
   *  - the chiildren will render and then  useEffect here will run
   *  - so check for authentication before initial rendering
   */
  return isAuthenticated ? children : null;
}

export default ProtectedRoute;
