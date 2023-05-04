import React, { useState } from "react";
import { useContext } from "react";

import { NavLink } from "react-router-dom";

import { PostsContext } from "../Context/context";
import { AuthContext } from "../Context/AuthContext";

import "./navbar.css";

import HomeSharpIcon from "@mui/icons-material/HomeSharp";
import PostAddSharpIcon from "@mui/icons-material/PostAddSharp";
import ExitToAppSharpIcon from "@mui/icons-material/ExitToAppSharp";
import {
  Avatar,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Tooltip,
} from "@mui/material";
import { AppBar, Toolbar, Stack } from "@mui/material";

function Navbar() {
  const { profile } = useContext(PostsContext);
  const [openDialog, setOpenDialog] = useState(false);

  const { dispatch } = useContext(AuthContext);

  const handleSignOut = () => {
    dispatch({ type: `LOGIN`, payload: null });
  };
  return (
    <>
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
          <Stack
            direction="row"
            spacing={2}
            color="inherit"
            alignItems="center"
          >
            <Tooltip title="Feed" arrow enterDelay={350} leaveDelay={200}>
              <NavLink to="/feed">
                {<HomeSharpIcon style={{ color: `white` }} />}
              </NavLink>
            </Tooltip>
            <Tooltip title="Post" arrow enterDelay={350} leaveDelay={200}>
              <NavLink to="/posting">
                {<PostAddSharpIcon style={{ color: `white` }} />}
              </NavLink>
            </Tooltip>
            <Tooltip title="Porfile" arrow enterDelay={350} leaveDelay={200}>
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
            </Tooltip>
            <Tooltip title="Sign out" arrow enterDelay={350} leaveDelay={200}>
              <Button onClick={() => setOpenDialog(true)}>
                {<ExitToAppSharpIcon style={{ color: `white` }} />}
              </Button>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Dialog onClose={() => setOpenDialog(false)} open={openDialog}>
        <DialogTitle> Confiramtion</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure that you want to sign out ?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleSignOut}>
            Yes
          </Button>
          <Button onClick={() => setOpenDialog(false)}>No</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Navbar;
