import React from "react";

import { NavLink } from "react-router-dom";

import "./navbar.css";

import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import PostAddSharpIcon from "@mui/icons-material/PostAddSharp";
import AccountCircleSharpIcon from "@mui/icons-material/AccountCircleSharp";
import ExitToAppSharpIcon from "@mui/icons-material/ExitToAppSharp";

function Navbar() {
  return (
    <div className="nav">
      <NavLink to="/feed">
        {<HomeSharpIcon style={{ color: `rgb(252, 216, 17)` }} />}
      </NavLink>
      <NavLink to="/posting">
        {<PostAddSharpIcon style={{ color: `rgb(252, 216, 17)` }} />}
      </NavLink>
      <NavLink to="/myprofile">
        {<AccountCircleSharpIcon style={{ color: `rgb(252, 216, 17)` }} />}
      </NavLink>
      <NavLink to="/signOut">
        {<ExitToAppSharpIcon style={{ color: `rgb(252, 216, 17)` }} />}
      </NavLink>
    </div>
  );
}

export default Navbar;
