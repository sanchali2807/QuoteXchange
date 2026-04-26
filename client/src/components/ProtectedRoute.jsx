import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";
import Navbar from "./Navbar";

export default function ProtectedRoute({
  children,
  allowedRoles = [],
}) {
  const { token } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const role = decoded.role;

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
  } catch (err) {
    return <Navigate to="/login" replace />;
  }
}