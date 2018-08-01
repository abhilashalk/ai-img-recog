import React from "react";
import "./Jumbotron.css";
import LogInBtn from "../LogInBtn";
import SignUpBtn from "../SignUpBtn";

const Jumbotron = props => (

    <div className="jumbotron">
        <h1 className="display-4">Discovery: From Leaf to Tree!</h1>

      <p className="lead">This is an explanation of our app.</p>

      <hr className="my-4" />

      <p>Here are some directions.</p>

      < LogInBtn >
        Log
      </ LogInBtn>

      < SignUpBtn >
        Sign In
      </ SignUpBtn>
    </div>
);

export default Jumbotron;
