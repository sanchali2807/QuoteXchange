import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const { token,role } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }
    if (
      allowedRoles.length > 0 &&
      !allowedRoles.includes(role)
    ) {
      return <Navigate to="/" replace />;
    }

    return (
      <>
        <Navbar />
        {children}
      </>
    );
}