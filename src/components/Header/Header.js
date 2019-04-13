import React from "react";

import Navigation from "../Navigation/Navigation";
import "./Header.css";

import skLogo from "../../images/songkick_badge_pink.png";

const Header = ({ user }) => {
  return (
    <header className="header">
      <div className="branding">
        <img src={skLogo} alt="Songkick logo" className="logo" />
        <p className="text">Songkick Shoutouts</p>
      </div>
      <div className="nav-links">
        <Navigation />
      </div>
    </header>
  );
};

export default Header;
