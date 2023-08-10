import React from 'react';
import { copy } from '../consts/copy';

const Header = () => {
  return (
    <header className="header">
      <h1 className="title">{copy.title}</h1>
    </header>
  );
};

export default Header;
