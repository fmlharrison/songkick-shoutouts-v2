import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../../Firebase";
import * as routes from "../../../constants/routes";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null
};

const SignInForm = props => {
  const [email, setEmail] = useState(INITIAL_STATE.email);
  const [password, setPassword] = useState(INITIAL_STATE.password);
  const [error, setError] = useState(INITIAL_STATE.error);

  const onSubmit = event => {
    event.preventDefault();

    props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(authUser => {
        props.firebase.user(authUser.user.uid).once("value", snapshot => {
          const user = snapshot.val();
          console.log(user);
        });
      })
      .then(user => {
        setEmail(INITIAL_STATE.email);
        setPassword(INITIAL_STATE.password);
        setError(INITIAL_STATE.error);
        props.history.push(routes.LANDING);
      })
      .catch(error => {
        setError(error);
      });
  };

  const isInvalid = password === "" || email === "";

  return (
    <div>
      <form onSubmit={onSubmit} className="sign-in-form">
        <input
          type="email"
          name="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="Enter a email"
          className="form-input"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
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
};

export default compose(
  withRouter,
  withFirebase
)(SignInForm);
