import React from "react";
import { useContext, useState } from "react";

import { doc, updateDoc } from "firebase/firestore";

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
import { Avatar } from "@mui/material";

function PickedProfile() {
  const [commentar, setComment] = useState(``);
  const { posts, profile, setAdd } = useContext(PostsContext);
  const { profileID } = useParams();

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
        <div className="completePost" key={key}>
          <div className="profile">
            <div>
              {
                <Avatar
                  src={profile.avatar}
                  alt={post.profile}
                  className="avatar"
                />
              }
            </div>
            <div>{post.profile}</div>
          </div>
          <div className="img" onDoubleClick={() => handleLike(post.id)}>
            <img src={post.url} alt="post" />{" "}
          </div>
          <div className="description">
            <p>{post.description}</p>
          </div>
          <div className="commentsAndLikes">
            <div className="completeLike">
              <div className="likeDiv">
                <div
                  className="likeNumb"
                  onClick={() => handleLikeList(post.id)}
                >
                  <b> {post.likes.length} </b>
                </div>
                <div className="likes" onClick={() => handleLike(post.id)}>
                  {isLiked ? (
                    <FavoriteSharpIcon style={{ color: `red` }} />
                  ) : (
                    <FavoriteBorderSharpIcon />
                  )}
                </div>
              </div>
              <div>
                {post.likeList &&
                  post.likes.map((item, key) => {
                    return (
                      <div className="listOfLikes" key={key}>
                        {item.firstName} {item.lastName}
                      </div>
                    );
                  })}
              </div>
            </div>

            <div className="comment">
              <div className="commentTitle">
                <b
                  style={{ cursor: `pointer` }}
                  onClick={() => handleCommentList(post.id)}
                >
                  <CommentIcon />
                </b>
                <div className="numbOfComments">
                  <b>{post.comments.length}</b>
                </div>
              </div>
              {post.commentList &&
                post.comments.map((comment, key) => {
                  return (
                    <div className="singleComment" key={key}>
                      <span>
                        <i>
                          {comment.firstName}
                          {` `}
                          {comment.lastName}
                        </i>{" "}
                        : {comment.comment}
                      </span>

                      {profile?.id === comment.uid && (
                        <button
                          className="deleteButton"
                          onClick={() => deleteComment(post.id, comment.id)}
                        >
                          {<DeleteIcon style={{ fontSize: `medium` }} />}
                        </button>
                      )}
                    </div>
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
                  <button>
                    {<AddCommentIcon style={{ fontSize: `medium` }} />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )
    );
  });

  return (
    <div>
      <Navbar />
      <div className="myProfile">{profilePosts}</div>
    </div>
  );
}

export default PickedProfile;
