import React, { useState, useEffect } from "react";
import { compose } from "recompose";
import Select from "react-select";
import useInput from "../../../hooks/useInput";

import "./Sidebar.css";
import shoutoutIcon from "../../../images/icon-megaphone.png";

import { withFirebase } from "../../Firebase";
import { withAuthentication } from "../../Session";

const SidebarContainer = props => {
  const [usersList, setUserList] = useState([]);
  const [recipient, setRecipient] = useState("");
  const { value: message, bind: bindMessage, reset: resetMessage } = useInput("");

  useEffect(() => {
    const formatUsers = usersData => {
      if (!usersData) return [];
      const usersIds = Object.keys(usersData);
      return usersIds.map(id => {
        return {
          value: usersData[id].displayName,
          label: usersData[id].displayName
        };
      });
    };

    props.firebase
      .users()
      .once("value")
      .then(snapshot => {
        const users = formatUsers(snapshot.val());
        const selectableUsers = users.filter(
          user => user.value !== props.authUser.displayName
        );
        setUserList(selectableUsers);
      });
  }, []);

  const saveShoutout = () => {
    event.preventDefault();

    const newRef = props.firebase.shoutoutsDb().push();
    const shoutOut = {
      id: newRef.key,
      recipient: recipient,
      message: message,
      shouter: props.authUser.displayName,
      createdAt: props.firebase.databaseTimeStamp()
    };

    newRef.set(shoutOut, error => {
      if (error) {
        console.log(error);
      } else {
        setRecipient("");
        resetMessage();
      }
    });
  };

  const closeSideBar = () => {
    props.showSideBar(false);
  };

  return (
    <div className="sidebar">
      <input
        className="megaphone-icon"
        type="image"
        src={shoutoutIcon}
        alt="Close sidebar"
        onClick={closeSideBar}
      />
      <div>
        <h1>Got a Shoutout for someone?</h1>
        <form onSubmit={saveShoutout} className="form">
          <Select
            options={usersList}
            name="recipient"
            className="form-item recipient"
            placeholder="For who?"
            isClearable
            onChange={option => {
              const rec = option ? option.value : ""
              setRecipient(rec);
            }}
          />
          <textarea
            type="text"
            className="form-item message"
            name="message"
            placeholder="What's your shoutout?"
            {...bindMessage}
          />
          <input type="submit" className="form-item submit" value="Shout it!" />
        </form>
      </div>
    </div>
  );
};

export default compose(withAuthentication, withFirebase)(SidebarContainer);
