import { Navigate } from "react-router-dom";
import { getRole, getToken } from "../utils/auth";

export default function ProtectedRoute({ children, allowedRoles }) {

  const token = getToken();
  const role = getRole();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/access-denied" replace />;
  }

  return children;
}