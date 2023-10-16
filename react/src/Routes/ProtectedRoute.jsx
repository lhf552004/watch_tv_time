import { Outlet, Navigate } from "react-router-dom";
import { useSigninCheck } from "reactfire";

function ProtectedRoute({ children }) {
  const { status, data: signInCheckResult } = useSigninCheck();

  // If the status is loading, you can show a loading spinner or similar
  if (status === "loading") {
    return <div>Loading...</div>;
  }

  // If user is signed in, render the children of this route (Outlet)
  if (signInCheckResult && signInCheckResult.signedIn) {
    return children;
  }

  // If user is not signed in, navigate to the login page
  return <Navigate to="/login" />;
}
export default ProtectedRoute;
