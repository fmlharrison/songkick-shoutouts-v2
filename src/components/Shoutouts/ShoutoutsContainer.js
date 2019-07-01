import React, { Component } from "react";
import { compose } from "recompose";

import Shoutouts from "./Shoutouts";
import Sidebar from "./Sidebar/SidebarContainer";

import { withFirebase } from "../Firebase";

import "./Shoutouts.css";
import shoutoutIcon from "../../images/icon-megaphone.png";
import pinkLogo from "../../images/songkick_badge_pink.png";

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

  componentDidUpdate(prevProps, prevState) {
    if (prevState.shoutOuts.length === 0) return;

    const isNewShoutout =
      this.state.shoutOuts.length > prevState.shoutOuts.length;
    const newShoutout = this.state.shoutOuts[0];

    if (isNewShoutout) {
      return this.notifyUser(newShoutout);
    }
  }

  notifyUser = shoutout => {
    const title = `${shoutout.recipient} got a shoutout from ${
      shoutout.shouter
    }!`;
    const notificationMessage = shoutout.message;
    const options = {
      body: notificationMessage,
      icon: pinkLogo
    };

    let notification;
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
      return;
    } else if (Notification.permission === "granted") {
      notification = new Notification(title, options);
    } else if (Notification.permission !== "denied") {
      Notification.requestPermission().then(function(permission) {
        if (permission === "granted") {
          notification = new Notification(title, options);
        } else {
          return;
        }
      });
    }

    notification.onclick = function(e) {
      window.focus();
      e.target.close();
    };
  };

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
    const sideBarState = this.state.showSideBar;
    this.setState({ showSideBar: !sideBarState });
  };

  showToggleIcon = () => {
    if (this.state.showSideBar) {
      return "megaphone-icon hidden";
    } else {
      return "megaphone-icon";
    }
  };

  render() {
    return (
      <div className="main">
        <div className="shout-outs">
          {this.state.shoutOuts.map(shout => {
            return <Shoutouts shoutout={shout} />;
          })}
          <input
            className={this.showToggleIcon()}
            type="image"
            src={shoutoutIcon}
            alt="Send a shoutout"
            onClick={this.toggleSideBar}
          />
        </div>
        {this.state.showSideBar ? (
          <Sidebar
            showSideBar={isShown => this.setState({ showSideBar: isShown })}
          />
        ) : null}
      </div>
    );
  }
}

export default compose(withFirebase)(ShoutoutsContainer);
