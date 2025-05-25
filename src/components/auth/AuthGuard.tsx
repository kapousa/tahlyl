// src/components/AuthGuard.tsx
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/login" replace />;
};

export default AuthGuard;
