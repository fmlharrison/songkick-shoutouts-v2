import React, { Component } from "react";
import { Link } from "react-router-dom";

import SignOut from "../Authentication/SignOut";
import { withAuthentication } from "../Session";

import * as routes from "../../constants/routes";

import "./Navigation.css";

class Navigation extends Component {
  renderNavLinks = () => {
    if (this.props.authUser) {
      return (
        <ul className="navigation-links">
          <li>
            <Link to={routes.LANDING}>Home</Link>
          </li>
          <li>
            <SignOut />
          </li>
        </ul>
      );
    } else {
      return (
        <ul className="navigation-links">
          <li>
            <Link to={routes.LANDING}>Home</Link>
          </li>
          <li>
            <Link to={routes.SIGN_IN}>Sign In</Link>
          </li>
        </ul>
      );
    }
  };

  render() {
    return (
      <div className="navigation">
        {this.renderNavLinks()}
      </div>
    );
  }
}

export default withAuthentication(Navigation);
