import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "recompose";

import "./Sidebar.css";
import Sidebar from "./Sidebar";

import { withFirebase } from "../../Firebase";
import { withAuthentication } from "../../Session";

export class SidebarContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: [],
      recipient: "",
      message: ""
    };
  }

  componentDidMount() {
    this.props.firebase
      .users()
      .once("value")
      .then(snapshot => {
        const usersList = this.formatUsers(snapshot.val());
        return this.setState({ usersList });
      });
  }

  formatUsers = usersData => {
    if (!usersData) return [];

    const usersIds = Object.keys(usersData);
    return usersIds.map(id => {
      return {
        value: usersData[id].displayName,
        label: usersData[id].displayName
      };
    });
  };

  updateForm = (type, value) => {
    this.setState({ [type]: value });
  };

  saveShoutout = data => {
    const newRef = this.props.firebase.shoutoutsDb().push();
    data.createdAt = this.props.firebase.databaseTimeStamp();
    data.id = newRef.key;

    newRef.set(data, error => {
      if (error) {
        console.log(error);
      } else {
        this.setState({
          recipient: "",
          message: ""
        });
      }
    });
  };

  saveSubmittedShoutout = shoutOut => {
    shoutOut.shouter = this.props.authUser.displayName;
    this.saveShoutout(shoutOut);
  };

  render() {
    return (
      <div className="sidebar">
        <Sidebar
          usersList={this.state.usersList}
          submitNewShoutout={this.saveSubmittedShoutout}
          handleFormInput={this.updateForm}
          recipient={this.state.recipient}
          message={this.state.message}
        />
      </div>
    );
  }
}

SidebarContainer.propTypes = {
  updateShoutouts: PropTypes.func.isRequired
};

export default compose(
  withAuthentication,
  withFirebase
)(SidebarContainer);
