import React from "react";
import { render } from "react-dom";

const App = () => {
  return (
    <div>
      <h1>React App Running! This is cool</h1>
    </div>
  );
};

render(<App />, document.getElementById("root"));
