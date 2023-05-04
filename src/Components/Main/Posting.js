import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

import { v4 } from "uuid";

import { db } from "../firebase/firebase-config";
import { storage } from "../firebase/firebase-config";

import Navbar from "../navbar/Navbar";

import { PostsContext } from "../Context/context";
import { AuthContext } from "../Context/AuthContext";

import PostAddSharpIcon from "@mui/icons-material/PostAddSharp";

import "./main.css";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Container,
  CssBaseline,
  Box,
  TextField,
  Snackbar,
  Alert,
} from "@mui/material";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

function Posting() {
  const [postData, setPostData] = useState({ url: "", description: "" });
  const [fileState, setFileState] = useState(``);
  const [imgURL, setImgURL] = useState(``);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const { setAdd, profile } = useContext(PostsContext);
  const { currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const imgPreview = (file) => {
    if (file == null) return setFileState(null);
    setFileState(file);
    setImgURL(URL.createObjectURL(file));
  };

  const handlePost = async (e) => {
    e.preventDefault();
    if (fileState === false) return;

    const date = new Date().toString();
    const imgId = v4();
    const imageRef = ref(storage, `images/${imgId}`);

    await uploadBytes(imageRef, fileState);

    const url = await getDownloadURL(imageRef);

    setDoc(doc(db, `posts`, date), {
      url: url,
      description: postData.description,
      likes: [],
      comments: [],
      timeStamp: new Date(),
      uid: currentUser.uid,
      profile: `${profile.firstName} ${profile.lastName}`,
      likeList: false,
      commentList: false,
      imagesId: imgId,
      userAvatar: profile.avatar,
    });
    setAdd((prev) => prev + 1);
    setOpenSnackbar(true);
  };

  const handleClose = () => {
    setOpenSnackbar(false);
    navigate("/feed");
  };

  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <Container
        sx={{
          display: `flex`,
          flexDirection: `column`,
          justifyContent: `center`,
          alignItems: `center`,
          marginTop: "10px",
        }}
        component="main"
        maxWidth="xs"
      >
        <CssBaseline />
        {!imgURL && (
          <Typography
            type="h2"
            variant="h2"
            color="primary.main"
            marginTop="150px"
          >
            Post a Photo
          </Typography>
        )}
        <Box
          sx={{
            justifyContent: `center`,
            marginTop: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              display: `flex`,
              flexDirection: `column`,
              justifyContent: `center`,
            }}
          >
            <Box>
              {imgURL && (
                <img
                  width="400px"
                  height="400px"
                  style={{ objectFit: `contain` }}
                  src={imgURL}
                  alt="preview"
                />
              )}
            </Box>
            <Box
              sx={{
                display: `flex`,
                flexDirection: `column`,
                justifyContent: "center",
                alignItems: `center`,
              }}
              component="form"
              onSubmit={handlePost}
            >
              <label htmlFor="inputFile">
                <PostAddSharpIcon
                  sx={{ color: `primary.main` }}
                  fontSize="large"
                />
              </label>
              <TextField
                sx={{ display: `none` }}
                id="inputFile"
                onChange={(e) => imgPreview(e.target.files[0])}
                placeholder="Image URL"
                type="file"
                name="inputFile"
              />
              {imgURL && (
                <TextField
                  style={{ color: `black` }}
                  name="description"
                  label="description"
                  onChange={(e) =>
                    setPostData((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  type="text"
                />
              )}
              {imgURL && (
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                >
                  POST
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert variant="filled" severity="success">
          <Typography variant="h6">
            {" "}
            You Have Successfully Posted a Photo!
          </Typography>
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}

export default Posting;
