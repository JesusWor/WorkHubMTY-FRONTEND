import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./useAuth";
import type { ReactNode } from "react";

//export default function PrivateRoute({ children }: { children: ReactNode })  YA NO ES NECESARIO PORQUE NO REGRESA EL CHILDREN, SOLO REDIRIGE A LA RUTA QUE ENVUELVE
export default function PrivateRoute() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
