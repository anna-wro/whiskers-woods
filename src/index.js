import React from "react";
import { createRoot } from "react-dom/client";
import { Game } from "./components/Game";
import styles from './index.css';

const container = document.getElementById("app-root");
const root = createRoot(container);
root.render(<Game />);
