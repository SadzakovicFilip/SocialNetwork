import React from "react";
import { useContext } from "react";

import { NavLink } from "react-router-dom";

import { PostsContext } from "../Context/context";

import "./navbar.css";

import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import PostAddSharpIcon from "@mui/icons-material/PostAddSharp";
import ExitToAppSharpIcon from "@mui/icons-material/ExitToAppSharp";
import { Avatar } from "@mui/material";

function Navbar() {
  const { profile } = useContext(PostsContext);

  return (
    <div className="nav">
      <NavLink to="/feed">
        {<HomeSharpIcon style={{ color: `rgb(252, 216, 17)` }} />}
      </NavLink>
      <NavLink to="/posting">
        {<PostAddSharpIcon style={{ color: `rgb(252, 216, 17)` }} />}
      </NavLink>
      <NavLink to="/myprofile">
        {
          <Avatar
            alt="profile"
            src={profile?.avatar}
            sx={{ width: 25, height: 25 }}
            style={{ marginTop: "2px" }}
          />
        }
      </NavLink>
      <NavLink to="/signOut">
        {<ExitToAppSharpIcon style={{ color: `rgb(252, 216, 17)` }} />}
      </NavLink>
    </div>
  );
}

export default Navbar;
