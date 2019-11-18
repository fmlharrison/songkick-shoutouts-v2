import React, { useState, useEffect, useRef } from "react";
import { compose } from "recompose";
import moment from "moment";

import Shoutouts from "./Shoutouts";
import Sidebar from "./Sidebar/SidebarContainer";

import { withFirebase } from "../Firebase";

import "./Shoutouts.css";
import shoutoutIcon from "../../images/icon-megaphone.png";
import pinkLogo from "../../images/songkick_badge_pink.png";

const ShoutoutsContainer = (props) => {
  const [shoutOuts, setShoutOuts] = useState([]);
  const [groupedShoutouts, setGroupedShoutouts] = useState({});
  const [showSideBar, setShowSideBar] = useState(false);
  const didMountRef = useRef(false)

  useEffect(() => {
    const formatShoutouts = data => {
      if (!data) return [];
      return Object.values(data);
    };

    const orderShoutouts = data => {
      return data.sort((a, b) => {
        return b.createdAt - a.createdAt;
      });
    };

    const dateOrderShoutouts = data => {
      let dateOrderedShoutouts = {};
      data.forEach(shoutout => {
        const date = moment(shoutout.createdAt);
        const formattedDate = date.format("L");
        dateOrderedShoutouts[formattedDate]
          ? dateOrderedShoutouts[formattedDate].push(shoutout)
          : (dateOrderedShoutouts[formattedDate] = [shoutout]);
      });
      return dateOrderedShoutouts;
    };

    props.firebase.shoutoutsDb().on("value", snapshot => {
      const data = formatShoutouts(snapshot.val());
      setShoutOuts(orderShoutouts(data));
      setGroupedShoutouts(dateOrderShoutouts(data));
    });

    return () => {
      props.firebase.shoutoutsDb().off();
    }
  }, [])

  useEffect(() => {
    if (shoutOuts.length === 0) return;
    if (didMountRef.current) {
      const notifyUser = shoutout => {
        const title = `${shoutout.recipient} got a shoutout from ${shoutout.shouter}!`;
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
  
      notifyUser(shoutOuts[0]);
    } else {
      didMountRef.current = true
    }
  }, [shoutOuts])

  const showToggleIcon = () => {
    if (showSideBar) {
      return "megaphone-icon hidden";
    } else {
      return "megaphone-icon";
    }
  };

  return (
    <div className="main">
      <div className="shout-outs">
        {Object.entries(groupedShoutouts).map(
          ([key, value]) => {
            return (
              <div key={key}>
                <h3>{key}</h3>
                {value.map(shout => {
                  return <Shoutouts shoutout={shout} key={shout.id} />;
                })}
              </div>
            );
          }
        )}
        <input
          className={showToggleIcon()}
          type="image"
          src={shoutoutIcon}
          alt="Send a shoutout"
          onClick={() => setShowSideBar(!showSideBar)}
        />
      </div>
      {showSideBar ? (
        <div className="sidebar-wrapper">
          <Sidebar
            showSideBar={isShown => setShowSideBar(isShown)}
          />
        </div>
      ) : null}
    </div>
  );
}

export default compose(withFirebase)(ShoutoutsContainer);
