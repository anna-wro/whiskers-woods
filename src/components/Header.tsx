import React from "react";
import { copy } from "../consts/copy";

const Header = () => {
  return (
    <div className="header">
      <h1 className="title">{copy.title}</h1>
    </div>
  );
};

export default Header;
