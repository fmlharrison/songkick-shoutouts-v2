import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../../Firebase";
import * as routes from "../../../constants/routes";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

class SignInForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  onChange = event => {
    const targetEvent = event.target;
    this.setState({ [targetEvent.name]: targetEvent.value });
  };

  onSubmit = event => {
    event.preventDefault();
    const { email, password } = this.state;

    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        this.props.firebase.user(authUser.user.uid).once("value", snapshot => {
          const user = snapshot.val();
          console.log(user);
        });
      })
      .then(user => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(routes.LANDING);
      })
      .catch(error => {
        this.setState({ error });
      });
  };

  render() {
    const { email, password, error } = this.state;

    const isInvalid = password === "" || email === "";

    return (
      <div>
        <form onSubmit={this.onSubmit} className="sign-in-form">
          <input
            type="email"
            name="email"
            value={email}
            onChange={this.onChange}
            placeholder="Enter a email"
            className="form-input"
            required
          />
          <input
            type="password"
            name="password"
            value={password}
            onChange={this.onChange}
            placeholder="Enter a password"
            className="form-input"
            required
          />
          <button type="submit" disabled={isInvalid} className="sign-in-button">
            Sign In
          </button>

          {error && <p className="error-message">{error.message}</p>}
        </form>
        <div className="sign-up-link">
          Don't have an account? <Link to={routes.SIGN_UP}>Sign Up</Link>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  withFirebase
)(SignInForm);
