import React, { useState } from "react";

import "./signUp.css";

import { useForm } from "react-hook-form";

import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../firebase/firebase-config";

function SignUp() {
  const [error, setError] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        data.eMail,
        data.password
      );

      await setDoc(doc(db, `users`, res.user.uid), {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.eMail,
        password: data.password,
        dateOfBirth: data.date,
        Timestamp: serverTimestamp(),
      });
    } catch (error) {
      return setError(error.message.slice(9, error.message.length));
    }
    alert(`You Signed Up!`);
    navigate("/");
  };


  const navigate = useNavigate();

  const handleLogIn = (e) => {
    e.preventDefault();
    navigate("/");
  };

  return (
    <div className="signUpDiv">
      <form className="signUp" onSubmit={handleSubmit(onSubmit)}>
        <input
          type="text"
          {...register(`firstName`, {
            required: {
              value: true,
              message: `First Name is required !`,
            },
          })}
          placeholder={
            errors.firstName ? errors.firstName.message : `First Name`
          }
        />
        <input
          type="text"
          {...register(`lastName`, {
            required: {
              value: true,
              message: `Last Name is required !`,
            },
          })}
          placeholder={errors.lastName ? errors.lastName.message : `Last Name`}
        />
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
          type="text"
          {...register(`password`, {
            required: {
              value: true,
              message: `Password is required !`,
            },
          })}
          placeholder={errors.password ? errors.password.message : `Password`}
        />
        <input
          type="date"
          {...register(`date`, {
            required: {
              value: true,
              message: `Date is required !`,
            },
          })}
          placeholder={errors.date ? errors.date.message : `Date`}
        />
        <button>Sign Up</button>
        <button onClick={handleLogIn}>Back to Log In Page</button>
        {error && (
          <span style={{ color: `white`, fontWeight: "700" }}>{error}</span>
        )}
      </form>
    </div>
  );
}

export default SignUp;
