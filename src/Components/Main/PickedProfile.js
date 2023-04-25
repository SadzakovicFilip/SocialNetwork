import React, { useEffect } from "react";
import { useContext, useState } from "react";

import { doc, updateDoc, getDocs } from "firebase/firestore";

import { useParams } from "react-router-dom";

import { PostsContext } from "../Context/context";

import { db } from "../firebase/firebase-config";

import Navbar from "../navbar/Navbar";

import "./main.css";

import FavoriteBorderSharpIcon from "@mui/icons-material/FavoriteBorderSharp";
import FavoriteSharpIcon from "@mui/icons-material/FavoriteSharp";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCommentIcon from "@mui/icons-material/AddComment";
import CommentIcon from "@mui/icons-material/Comment";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  CardMedia,
} from "@mui/material";

import { userCollectionRef } from "../../App";

function PickedProfile() {
  const [commentar, setComment] = useState(``);
  const { posts, profile, setAdd } = useContext(PostsContext);
  const { profileID } = useParams();
  const [pickedProfile, setPickedProfile] = useState(``);

  useEffect(() => {
    const fetchUser = async () => {
      const data = await getDocs(userCollectionRef);
      setPickedProfile(
        data.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .find((item) => item.id === profileID)
      );
    };
    fetchUser();
  }, [profileID]);


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

  const profilePosts = posts.map((post, key) => {
    let isLiked = post.likes.find((item) => profile?.id === item.id);

    return (
      post.uid === profileID && (
        <Grid item xs={12} sm={6} md={4} key={key}>
          <Card
            sx={{
              display: "flex",
              boxShadow:
                "0px 2px 1px -1px rgba(25, 118, 210,0.4), 0px 1px 1px 0px rgba(25, 118, 210,0.24), 0px 1px 3px 0px rgba(25, 118, 210,0.22)",
              justifyContent: "center",
              height: "500px",
              
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
                <Typography
                  variant="h6"
                  margin="14px 0"
                  color="primary"
                  height="10px"
                >
                  {post.description}
                </Typography>
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
                      <Button type="submit">
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
        <Card
          sx={{
            boxShadow:
              "0px 2px 1px -1px rgba(25, 118, 210,0.3), 0px 1px 1px 0px rgba(25, 118, 210,0.24), 0px 1px 3px 0px rgba(25, 118, 210,0.22)",
          }}
        >
          <CardContent sx={{ display: "flex", justifyContent: "center" }}>
            <Box className="info">
              <Box className="profileImg">
                <label htmlFor="profilePic">
                  <img alt="profilePicture" src={pickedProfile?.avatar} />
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
                        {pickedProfile?.lastName} {pickedProfile?.firstName}
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
                        {pickedProfile?.dateOfBirth}
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
                        <i>{pickedProfile?.country}</i>{" "}
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
                        <i>{pickedProfile?.education}</i>
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
                          <a href={`tel:${pickedProfile?.telephone}`}>
                            {" "}
                            {pickedProfile?.telephone}
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
                          <a href={`mailto:${pickedProfile?.email}`}>
                            {" "}
                            {pickedProfile?.email}
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
      <Typography
        variant="h3"
        color="primary"
        marginTop="50px"
        textAlign="center"
        gutterBottom
      >{`${pickedProfile?.firstName}s POSTS`}</Typography>
      <Grid container spacing={3} padding="10px">
        {profilePosts}
      </Grid>
    </div>
  );
}

export default PickedProfile;
