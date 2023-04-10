import React from "react";
import { useContext } from "react";

import "./main.css";

import { AuthContext } from "../Context/AuthContext";

import Navbar from "../navbar/Navbar";

function SignOut() {
  const { dispatch } = useContext(AuthContext);

  const handleSignOut = () => {
    dispatch({ type: `LOGIN`, payload: null });
  };

  return (
    <div className="signOut">
      <Navbar />
      <button onClick={handleSignOut}>Sign Out</button>
    </div>
  );
}

export default SignOut;
