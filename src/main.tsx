import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import RequiresAuth from "./utils/RequiresAuth";
import Home from "./pages/Home/Home";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RequiresAuth>
      <Home />
    </RequiresAuth>
  </StrictMode>,
);
