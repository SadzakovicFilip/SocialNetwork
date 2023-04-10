import React from "react";
import { useContext, useState } from "react";

import "./logIn.css";

import { useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { AuthContext } from "../../Context/AuthContext";

function LogIn() {
  const [logInData, setLogInData] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const auth = getAuth();

    signInWithEmailAndPassword(auth, logInData.email, logInData.password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({ type: `LOGIN`, payload: user });
        navigate("/feed");
      })
      .catch((error) => {
        setError(true);
      });
  };

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate("/signUp");
  };
  return (
    <div className="logInDiv">
      <form onSubmit={handleSubmit} className="logIn">
        <input
          type="email"
          onChange={(e) =>
            setLogInData((prev) => ({ ...prev, email: e.target.value }))
          }
          required
          placeholder="E-mail"
        />
        <input
          type="password"
          onChange={(e) =>
            setLogInData((prev) => ({ ...prev, password: e.target.value }))
          }
          required
          placeholder="Password"
        />
        <div className="buttons">
          <button>Log In</button>
          <button onClick={handleSignUp}>SignUp</button>
        </div>
        {error && (
          <span style={{ color: `red`, marginTop: `10px` }}>
            Wrong Passwrod or Email !
          </span>
        )}
      </form>
    </div>
  );
}

export default LogIn;
