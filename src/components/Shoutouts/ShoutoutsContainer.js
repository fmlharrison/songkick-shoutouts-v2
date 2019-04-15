import React, { Component } from "react";
import { compose } from "recompose";

import Shoutouts from "./Shoutouts";
import Sidebar from "./Sidebar/SidebarContainer";

import { withFirebase } from "../Firebase";

import "./Shoutouts.css";
import shoutoutIcon from "../../images/icon-megaphone.png";

class ShoutoutsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      shoutOuts: [],
      showSideBar: false
    };
  }

  componentDidMount() {
    this.props.firebase.shoutoutsDb().on("value", snapshot => {
      const data = this.formatShoutouts(snapshot.val());
      this.setState({ shoutOuts: this.orderShoutouts(data) });
    });
  }

  formatShoutouts = data => {
    if (!data) return [];
    return Object.values(data);
  };

  updateShoutouts = shoutouts => {
    this.setState({ shoutOuts: this.orderShoutouts(shoutouts) });
  };

  orderShoutouts = data => {
    return data.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });
  };

  toggleSideBar = () => {
    const sideBarState = this.state.showSideBar
    this.setState({ showSideBar: !sideBarState })
  };

  render() {
    return (
      <div className="main">
        <div className="shout-outs">
          {this.state.shoutOuts.map(shout => {
            return <Shoutouts shoutout={shout} />;
          })}
          <input
            className="megaphone-icon"
            type="image"
            src={shoutoutIcon}
            alt="Send a shoutout"
            onClick={this.toggleSideBar}
          />
        </div>
        {this.state.showSideBar ? (
          <Sidebar />
        ) : null}
      </div>
    );
  }
}

export default compose(withFirebase)(ShoutoutsContainer);
