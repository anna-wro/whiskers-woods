import React from 'react';
import { createRoot } from 'react-dom/client';
import Map2D from './components/Map2D';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import styles from './index.css';

const container = document.getElementById('app-root');
const root = createRoot(container);
root.render(<Map2D />);
