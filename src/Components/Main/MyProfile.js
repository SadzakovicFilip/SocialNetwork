import React from "react";
import { useContext, useState } from "react";

import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { deleteObject } from "firebase/storage";

import { PostsContext } from "../Context/context";
import { AuthContext } from "../Context/AuthContext";
import { db } from "../firebase/firebase-config";
import { storage } from "../firebase/firebase-config";

import { useNavigate } from "react-router-dom";

import Navbar from "../navbar/Navbar";

import "./main.css";

import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CommentIcon from "@mui/icons-material/Comment";
import { Box, Card, CardContent, Grid, Button, CardMedia, Typography } from "@mui/material";


function MyProfile() {
  const [commentar, setComment] = useState(``);
  const [profilePic, setProfilePic] = useState(``);
  const [profilePicUrl, setProfilePicUrl] = useState(``);
  const { currentUser } = useContext(AuthContext);
  const { posts, profile, setAdd } = useContext(PostsContext);

  const navigate = useNavigate();

  const handleLike = async (id) => {
    const singlePost = posts.find((item) => item.id === id);
    const isLiked = singlePost.likes.find(
      (item) => `${item.id}` === profile.id
    );

    if (!isLiked) {
      const postDoc = doc(db, "posts", id);
      await updateDoc(postDoc, {
        likes: [
          ...singlePost.likes,
          {
            id: profile.id,
            firstName: profile.firstName,
            lastName: profile.lastName,
          },
        ],
      });
    } else {
      const postDoc = doc(db, "posts", id);
      const deleteDoc = singlePost.likes.filter(
        (item) => item.id !== profile.id
      );
      await updateDoc(postDoc, { likes: [...deleteDoc] });
    }
    setAdd((prev) => prev + 1);
  };

  const handleLikeList = async (id) => {
    const singlePost = posts.find((item) => item.id === id);
    const postDoc = doc(db, "posts", id);
    await updateDoc(postDoc, {
      likeList: !singlePost.likeList,
    });
    setAdd((prev) => prev + 1);
  };

  const postComment = async (e, id) => {
    e.preventDefault();
    const singlePost = posts.find((item) => item.id === id);
    const postDoc = doc(db, "posts", id);
    await updateDoc(postDoc, {
      comments: [
        ...singlePost.comments,
        {
          uid: profile.id,
          firstName: profile.firstName,
          lastName: profile.lastName,
          comment: commentar,
          id: new Date().toString(),
        },
      ],
    });
    setAdd((prev) => prev + 1);
    setComment(``);
  };

  const handleCommentList = async (id) => {
    const singlePost = posts.find((item) => item.id === id);
    const postDoc = doc(db, "posts", id);
    await updateDoc(postDoc, {
      commentList: !singlePost.commentList,
    });
    setAdd((prev) => prev + 1);
  };

  const deleteComment = async (pId, cId) => {
    const singlePost = posts.find((item) => item.id === pId);
    const deleteComment = singlePost.comments.filter((item) => item.id !== cId);
    const postDoc = doc(db, "posts", pId);
    await updateDoc(postDoc, { comments: [...deleteComment] });
    setAdd((prev) => prev + 1);
  };

  const deletePost = async (postID, imgID) => {
    const imageRef = ref(storage, `images/${imgID}`);
    deleteObject(imageRef);
    const postDoc = doc(db, `posts`, postID);
    deleteDoc(postDoc);
    setAdd((prev) => prev + 1);
  };

  const profilePicPreview = (file) => {
    if (file == null) return setProfilePic(``);
    setProfilePicUrl(URL.createObjectURL(file));
    setProfilePic(file);
  };

  const addProfilePic = async () => {
    if (profilePic === false) return;
    const avatarsRef = ref(storage, `avatars/${currentUser.uid}`);

    await uploadBytes(avatarsRef, profilePic);
    const url = await getDownloadURL(avatarsRef);

    await updateDoc(doc(db, `users`, currentUser.uid), {
      avatar: url,
    });
    setAdd((prev) => prev + 1);
    alert(`You Have Changed your profile picture!`);
    navigate("/feed");
  };

  const myPosts = posts.map((post, key) => {
    let isLiked = post.likes.find((item) => profile?.id === item.id);
    return (
      post.uid === currentUser.uid && (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Card
            sx={{
              display: "flex",
              boxShadow:
                "0px 2px 1px -1px rgba(25, 118, 210,0.4), 0px 1px 1px 0px rgba(25, 118, 210,0.24), 0px 1px 3px 0px rgba(25, 118, 210,0.22)",
              justifyContent: "center",
              height: "500px",
              height: "auto",
            }}
          >
            <CardContent
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "top",
                alignItems: "center",
              }}
          
              height="700px"
              key={key}
            >
              <Card
                className="img"
                sx={{ boxShadow: "none" }}
                onDoubleClick={() => handleLike(post.id)}
              >
                <CardMedia
                  component="img"
                  src={post.url}
                  alt="post"
                  height="400px"
                />{" "}
              </Card>
              <Box sx={{ textAlign: "center", margin: "10px 0" }}>
              <Typography variant="h6" marginBottom="40px" marginTop="7px" color="primary" gutterBottom height="10px">{post.description}</Typography>
              </Box>
              <Box className="commentsAndLikes">
                <Box className="completeLike">
                  <Box className="likeDiv">
                    <Box
                      className="likeNumb"
                      onClick={() => handleLikeList(post.id)}
                    >
                      <Typography variant="body1" color="primary">
                        {" "}
                        {post.likes.length}{" "}
                      </Typography>
                    </Box>
                    <Box className="likes" onClick={() => handleLike(post.id)}>
                      {isLiked ? (
                        <FavoriteSharpIcon style={{ color: `red` }} />
                      ) : (
                        <FavoriteBorderSharpIcon color="primary" />
                      )}
                    </Box>
                  </Box>
                  <Box>
                    {post.likeList &&
                      post.likes.map((item, key) => {
                        return (
                          <Box className="listOfLikes" key={key}>
                            {item.firstName} {item.lastName}
                          </Box>
                        );
                      })}
                  </Box>
                </Box>
                <Box className="deletePost">
                  {profile?.id === post.uid && (
                    <Button
                      className="deleteButton"
                      onClick={() => deletePost(post.id, post.imagesId)}
                    >
                      {<DeleteIcon style={{ fontSize: `medium` }} />}
                    </Button>
                  )}
                </Box>

                <Box className="comment">
                  <Box className="commentTitle">
                    <b
                      style={{ cursor: `pointer` }}
                      onClick={() => handleCommentList(post.id)}
                    >
                      <CommentIcon color="primary" />
                    </b>
                    <Box className="numbOfComments">
                      <Typography variant="body1" color="primary">
                        {post.comments.length}
                      </Typography>
                    </Box>
                  </Box>
                  {post.commentList &&
                    post.comments.map((comment, key) => {
                      return (
                        <Box className="singleComment" key={key}>
                          <span>
                            <i>
                              {comment.firstName}
                              {` `}
                              {comment.lastName}
                            </i>{" "}
                            : {comment.comment}
                          </span>

                          {profile?.id === comment.uid && (
                            <Button
                              className="deleteButton"
                              onClick={() => deleteComment(post.id, comment.id)}
                            >
                              {<DeleteIcon style={{ fontSize: `medium` }} />}
                            </Button>
                          )}
                        </Box>
                      );
                    })}

                  {post.commentList && (
                    <form
                      className="inputForm"
                      onSubmit={(e) => {
                        postComment(e, post.id);
                      }}
                    >
                      <input
                        placeholder="write a comment..."
                        style={{ border: "none" }}
                        onChange={(e) => setComment(e.target.value)}
                        value={commentar}
                      />
                      <Button  type="submit">
                        {
                          <AddCommentIcon
                            style={{ fontSize: `medium` }}
                            color="primary"
                          />
                        }
                      </Button>
                    </form>
                  )}
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      )
    );
  });

  return (
    <div>
      <Navbar />

     <Box marginTop="20px" justifyContent="center" display="flex">
        <Card sx={{boxShadow:"0px 2px 1px -1px rgba(25, 118, 210,0.3), 0px 1px 1px 0px rgba(25, 118, 210,0.24), 0px 1px 3px 0px rgba(25, 118, 210,0.22)"}}>
          <CardContent sx={{ display: "flex", justifyContent: "center" }}>
            <Box className="info">
              <Box className="profileImg">
                <label htmlFor="profilePic">
                  <img alt="profilePicture" src={profile?.avatar} />
                </label>
              </Box>
              <Box>
                <ul>
                  <li style={{ width: "300px", display: `flex` }}>
                    <Typography
                      component="div"
                      alignItems="center"
                      width="auto"
                      variant="body2"
                      display="flex"
                      color="text.secondary"
                    >
                      Full Name :{" "}
                      <Typography variant="body1" color="text.primary">
                        {profile?.lastName} {profile?.firstName}
                      </Typography>
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      component="div"
                      alignItems="center"
                      width="auto"
                      variant="body2"
                      display="flex"
                      color="text.secondary"
                    >
                      Born :
                      <Typography variant="body1" color="text.primary">
                        {profile?.dateOfBirth}
                      </Typography>
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      component="div"
                      alignItems="center"
                      width="auto"
                      variant="body2"
                      display="flex"
                      color="text.secondary"
                    >
                      Country :
                      <Typography variant="body1" color="text.primary">
                        <i>{profile?.country}</i>{" "}
                      </Typography>
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      component="div"
                      alignItems="center"
                      width="350px"
                      variant="body2"
                      display="flex"
                      color="text.secondary"
                    >
                      Education :
                      <Typography variant="body1" color="text.primary">
                        <i>{profile?.education}</i>
                      </Typography>
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      component="div"
                      alignItems="center"
                      width="350px"
                      variant="body2"
                      display="flex"
                      color="text.secondary"
                    >
                      Telephone :{" "}
                      <Typography variant="body1" color="text.primary">
                        <i>
                          <a href={`tel:${profile?.telephone}`}>
                            {" "}
                            {profile?.telephone}
                          </a>
                        </i>
                      </Typography>
                    </Typography>
                  </li>
                  <li>
                    <Typography
                      component="div"
                      alignItems="center"
                      width="350px"
                      variant="body2"
                      display="flex"
                      color="text.secondary"
                    >
                      E-mail :{" "}
                      <Typography variant="body1" color="text.primary">
                        <i>
                          <a href={`mailto:${profile?.email}`}>
                            {" "}
                            {profile?.email}
                          </a>
                        </i>
                      </Typography>
                    </Typography>
                  </li>
                </ul>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Box>

      <Box>
        {profilePicUrl && (
          <Box className="profilePicturePreview">
            <img src={profilePicUrl} alt="profilePicPreview" />{" "}
            <Button onClick={addProfilePic}>Change Profile Picture</Button>
          </Box>
        )}
      </Box>

      <form className="addAProfilePicture">
        <input
          id="profilePic"
          type="file"
          onChange={(e) => profilePicPreview(e.target.files[0])}
        />
      </form>
      <Typography variant="h3" color="primary" marginTop="50px" textAlign="center" gutterBottom>{`${profile?.firstName}s POSTS`}</Typography>
      <Grid container spacing={3} padding="10px">
        {myPosts}
      </Grid>
    </div>
  );
}

export default MyProfile;
