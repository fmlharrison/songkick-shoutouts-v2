import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { compose } from "recompose";

import { withFirebase } from "../../Firebase";
import * as routes from "../../../constants/routes";

const INITIAL_STATE = {
  displayName: "",
  username: "",
  email: "",
  password: "",
  repeatedPassword: "",
  error: null
};

const SignUpForm = props => {
  const [displayName, setDisplayName] = useState(INITIAL_STATE.displayName);
  const [username, setUsername] = useState(INITIAL_STATE.username);
  const [email, setEmail] = useState(INITIAL_STATE.email);
  const [password, setPassword] = useState(INITIAL_STATE.password);
  const [repeatedPassword, setRepeatedPassword] = useState(
    INITIAL_STATE.repeatedPassword
  );
  const [error, setError] = useState(INITIAL_STATE.error);

  const onSubmit = event => {
    event.preventDefault();
    const { displayName, username, email, password } = this.state;

    if (email.split("@")[1] !== "songkick.com") {
      return this.setState({
        error: { message: "Email must be a '@songkick.com' email." }
      });
    }

    props.firebase
      .doCreateUserWithEmailAndPassword(email, password)
      .then(authUser => {
        authUser.user.updateProfile({ displayName: displayName });
        return authUser;
      })
      .then(user => {
        const id = user.user.uid;
        return props.firebase.user(id).set({
          id,
          displayName,
          username,
          email
        });
      })
      .then(() => {
        setDisplayName(INITIAL_STATE.displayName);
        setUsername(INITIAL_STATE.username);
        setEmail(INITIAL_STATE.email);
        setPassword(INITIAL_STATE.password);
        setRepeatedPassword(INITIAL_STATE.repeatedPassword);
        setError(INITIAL_STATE.error);
        props.history.push(routes.LANDING);
      })
      .catch(error => {
        setError(error);
      });
  };

  const isInvalid =
    password !== repeatedPassword ||
    password === "" ||
    displayName === "" ||
    username === "" ||
    email === "";

  return (
    <div>
      <form onSubmit={onSubmit} className="sign-up-form">
        <input
          type="text"
          name="displayName"
          value={displayName}
          onChange={event => setDisplayName(event.target.value)}
          placeholder="Enter a display name."
          className="form-input"
          required
        />
        <input
          type="text"
          name="username"
          value={username}
          onChange={event => setUsername(event.target.value)}
          placeholder="Enter a username."
          className="form-input"
          required
        />
        <input
          type="email"
          name="email"
          value={email}
          onChange={event => setEmail(event.target.value)}
          placeholder="Enter a email."
          className="form-input"
          required
        />
        <input
          type="password"
          name="password"
          value={password}
          onChange={event => setPassword(event.target.value)}
          placeholder="Enter a password."
          className="form-input"
          required
        />
        <input
          type="password"
          name="repeatedPassword"
          value={repeatedPassword}
          onChange={event => setRepeatedPassword(event.target.value)}
          placeholder="Re-enter your password."
          className="form-input"
          required
        />
        <button type="submit" disabled={isInvalid} className="sign-up-button">
          Sign Up
        </button>

        {error && <p className="error-message">{error.message}</p>}
      </form>
      <div className="sign-in-link">
        Already have an account? <Link to={routes.SIGN_IN}>Sign In</Link>
      </div>
    </div>
  );
};

export default compose(
  withRouter,
  withFirebase
)(SignUpForm);
