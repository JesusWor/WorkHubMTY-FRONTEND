import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";

function isAuthenticated() {
  return true;
}

export default function RequiresAuth({ children }: { children: ReactNode }) {
  if (isAuthenticated()) {
    return children;
  } else {
    <Navigate to="/login" />;
  }
}
