// import { Navigate } from "react-router-dom";

// export default function PrivateRoute({ children }) {
//   const loggedInUser = localStorage.getItem("user"); // check login
//   return loggedInUser ? children : <Navigate to="/" />;
// }


// import { Navigate } from "react-router-dom";

// export default function PrivateRoute({ children }) {
//   const token = localStorage.getItem("token");
//   return token ? children : <Navigate to="/" replace />;
// }
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const loggedIn = !!localStorage.getItem("user");
  const location = useLocation();

  // If NOT logged in: block access (direct URL, back, forward, refresh... everything)
  if (!loggedIn) {
    return (
      <Navigate
        to="/"
        replace
        state={{ from: location }} // optional: so you know where they tried to go
      />
    );
  }

  // If logged in: allow all navigation (PUSH/POP, refresh, back/forward)
  return children;
}
