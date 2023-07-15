import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { Map } from "./components/Map";

const container = document.getElementById("app-root")!;
const root = createRoot(container);
root.render(<Map />);
