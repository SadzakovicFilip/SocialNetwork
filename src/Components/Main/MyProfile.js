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
import { Avatar } from "@mui/material";

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
            <div className="deletePost">
              {profile?.id === post.uid && (
                <button
                  className="deleteButton"
                  onClick={() => deletePost(post.id, post.imagesId)}
                >
                  {<DeleteIcon style={{ fontSize: `medium` }} />}
                </button>
              )}
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
    <div className="myProfile">
      <Navbar />
      <hr></hr>
      <div className="info">
        <div className="profileImg">
      <label htmlFor="profilePic"><img alt="profilePicture" src={profile?.avatar} /></label>
        </div>
        <div>
          <ul>
            <li>
              Full Name : <i>{profile?.lastName} {profile?.firstName}</i>
            </li>
            <li>Born : <i>{profile?.dateOfBirth}</i></li>
            <li>Country : <i>{profile?.country}</i> </li>
            <li>Education : <i>{profile?.education}</i></li>
            <li>
              Telephone : <i><a href={`tel:${profile?.telephone}`}> {profile?.telephone}</a></i>
            </li>
            <li>
              E-mail : <i><a href={`mailto:${profile?.email}`}> {profile?.email}</a></i>
            </li>
          </ul>
        </div>
      </div>
      <hr></hr>

      <div>
        {profilePicUrl && (
          <div className="profilePicturePreview">
            <img src={profilePicUrl} alt="profilePicPreview" />{" "}
            <button onClick={addProfilePic}>Change Profile Picture</button>
          </div>
        )}
      </div>

      <form className="addAProfilePicture">
        <input
          id="profilePic"
          type="file"
          onChange={(e) => profilePicPreview(e.target.files[0])}
        />
      </form>
      <div>{myPosts}</div>
      
    </div>
  );
}

export default MyProfile;
