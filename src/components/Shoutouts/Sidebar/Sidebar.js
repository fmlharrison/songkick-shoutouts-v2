import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "react-select";

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      usersList: this.props.usersList
    };
  }

  handleUserSelect = selectedOption => {
    const userName = selectedOption ? selectedOption.value : "" 
    this.props.handleFormInput("recipient", userName)
  }

  handleChange = event => {
    const target = event.currentTarget;
    const inputType = target.name;
    this.props.handleFormInput(inputType, target.value);
  };

  handleSubmit = event => {
    event.preventDefault();

    const shoutOut = {
      recipient: this.props.recipient,
      message: this.props.message
    };

    this.props.submitNewShoutout(shoutOut);
  };

  render() {
    return (
      <div>
        <h1>Got a Shoutout for someone?</h1>
        <form onSubmit={this.handleSubmit} className="form">
          <Select
            options={this.props.usersList}
            name="recipient"
            className="form-item recipient"
            placeholder="For who?"
            onChange={this.handleUserSelect}
            isClearable
          />
          <textarea
            type="text"
            className="form-item message"
            value={this.props.message}
            onChange={this.handleChange}
            name="message"
            placeholder="What's your shoutout?"
          />
          <input type="submit" className="form-item submit" value="Shout it!" />
        </form>
      </div>
    );
  }
}

Sidebar.propTypes = {
  usersList: PropTypes.array.isRequired,
  submitNewShoutout: PropTypes.func.isRequired,
  handleFormInput: PropTypes.func.isRequired,
  recipient: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired
};

export default Sidebar;
