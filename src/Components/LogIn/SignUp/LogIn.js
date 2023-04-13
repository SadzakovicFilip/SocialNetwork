import React from "react";
import { useContext, useState } from "react";

import { useForm } from "react-hook-form";

import "./logIn.css";

import { useNavigate } from "react-router-dom";

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import { AuthContext } from "../../Context/AuthContext";

function LogIn() {
  const [error, setError] = useState(false);
  const { dispatch } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = (data) => {
    const auth = getAuth();
    signInWithEmailAndPassword(auth, data.eMail, data.password)
      .then((userCredential) => {
        const user = userCredential.user;
        dispatch({ type: `LOGIN`, payload: user });
        navigate("/feed");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const navigate = useNavigate();

  const handleSignUp = (e) => {
    e.preventDefault();
    navigate("/signUp");
  };
  return (
    <div className="logInDiv">
      <form onSubmit={handleSubmit(onSubmit)} className="logIn">
        <input
          type="email"
          {...register(`eMail`, {
            required: {
              value: true,
              message: `E-mail is required !`,
            },
          })}
          placeholder={errors.eMail ? errors.eMail.message : `E-mail`}
        />
        <input
          type="password"
          {...register(`password`, {
            required: {
              value: true,
              message: `Password is required !`,
            },
          })}
          placeholder={errors.password ? errors.password.message : `Password`}
        />
        <div className="buttons">
          <button>Log In</button>
          <button onClick={handleSignUp}>SignUp</button>
        </div>
        {error && (
          <span style={{ color: `white`, marginTop: `10px`, fontWeight: "700" }}>
            {error.slice(9, error.length)}
          </span>
        )}
      </form>
    </div>
  );
}

export default LogIn;
