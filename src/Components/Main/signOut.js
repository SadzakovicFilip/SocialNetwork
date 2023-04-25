import React from "react";
import { useContext } from "react";

import "./main.css";

import { AuthContext } from "../Context/AuthContext";
import { Box } from "@mui/material";
import Button from "@mui/material/Button";
import Navbar from "../navbar/Navbar";

function SignOut() {
  const { dispatch } = useContext(AuthContext);

  const handleSignOut = () => {
    dispatch({ type: `LOGIN`, payload: null });
  };

  return (
    <Box display="flex" justifyContent="center" flexDirection="column">
      <Navbar />
      <Button sx={{marginTop:20, width:`auto`}}  variant="contained"  onClick={handleSignOut}>Sign Out</Button>
    </Box>
  );
}

export default SignOut;
