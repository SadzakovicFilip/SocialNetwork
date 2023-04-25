import React from "react";
import { useContext } from "react";

import { NavLink } from "react-router-dom";

import { PostsContext } from "../Context/context";

import "./navbar.css";

import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import PostAddSharpIcon from "@mui/icons-material/PostAddSharp";
import ExitToAppSharpIcon from "@mui/icons-material/ExitToAppSharp";
import { Avatar, Typography } from "@mui/material";
import { AppBar, Toolbar, Stack } from "@mui/material";

function Navbar() {
  const { profile } = useContext(PostsContext);

  return (
    <AppBar position="static" className="nav">
      <Toolbar>
        <Typography
          variant="h5"
          color="inherit"
          component="div"
          sx={{ flexGrow: 1 }}
        >
          {
            <NavLink
              to="/feed"
              style={{ textDecoration: "none", color: "white" }}
            >
              SocialNetwork
            </NavLink>
          }
        </Typography>
        <Stack direction="row" spacing={2} color="inherit">
          <NavLink to="/feed">
            {<HomeSharpIcon style={{ color: `white` }} />}
          </NavLink>
          <NavLink to="/posting">
            {<PostAddSharpIcon style={{ color: `white` }} />}
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
            {<ExitToAppSharpIcon style={{ color: `white` }} />}
          </NavLink>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
