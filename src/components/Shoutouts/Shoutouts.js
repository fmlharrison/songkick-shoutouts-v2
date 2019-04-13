import React from "react";
import PropTypes from "prop-types";

const Shoutouts = ({ shoutout }) => {
  return (
    <div className="shoutout-container">
      <p className="recipient">For: {shoutout.recipient}</p>
      <p className="from">From: {shoutout.shouter}</p>
      <p className="message">{shoutout.message}</p>
    </div>
  );
};

Shoutouts.propTypes = {
  shoutout: PropTypes.shape({
    id: PropTypes.string,
    recipient: PropTypes.string,
    shouter: PropTypes.string,
    message: PropTypes.string
  })
};

export default Shoutouts;
