import React, { useState } from "react";

import "./signUp.css";

import { useNavigate } from "react-router-dom";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";

import { auth, db } from "../../firebase/firebase-config";

function SignUp() {
  const [createUser, setCreateUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
  });
  const [error, setError] = useState(false);

  const navigate = useNavigate();

  const handleLogIn = (e) => {
    e.preventDefault();
    navigate("/");
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        createUser.email,
        createUser.password
      );

      await setDoc(doc(db, `users`, res.user.uid), {
        firstName: createUser.firstName,
        lastName: createUser.lastName,
        email: createUser.email,
        password: createUser.password,
        dateOfBirth: createUser.dateOfBirth,
        Timestamp: serverTimestamp(),
      });
    } catch (error) {
      setError(error.message);
    }
  };
  return (
    <div className="signUpDiv">
      <form className="signUp" onSubmit={handleSignUp}>
        <input
          placeholder="First Name"
          type="text"
          onChange={(e) =>
            setCreateUser((prev) => ({ ...prev, firstName: e.target.value }))
          }
          required
        />
        <input
          placeholder="Last Name"
          type="text"
          onChange={(e) =>
            setCreateUser((prev) => ({ ...prev, lastName: e.target.value }))
          }
          required
        />
        <input
          type="email"
          onChange={(e) =>
            setCreateUser((prev) => ({ ...prev, email: e.target.value }))
          }
          placeholder="E-mail"
          required
        />
        <input
          placeholder="Password"
          onChange={(e) =>
            setCreateUser((prev) => ({ ...prev, password: e.target.value }))
          }
          type="text"
          required
        />
        <input
          type="date"
          onChange={(e) =>
            setCreateUser((prev) => ({ ...prev, dateOfBirth: e.target.value }))
          }
          placeholder="Date of Birth"
          required
        />
        <button>Sign Up</button>
        <button onClick={handleLogIn}>Back to Log In Page</button>
        {error && <span style={{ color: `red` }}>{error}</span>}
      </form>
    </div>
  );
}

export default SignUp;
