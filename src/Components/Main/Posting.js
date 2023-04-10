import React, { useState, useContext } from "react";

import { useNavigate } from "react-router-dom";

import { doc, setDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { v4 } from "uuid";

import { db } from "../firebase/firebase-config";
import { storage } from "../firebase/firebase-config";

import Navbar from "../navbar/Navbar";

import { PostsContext } from "../Context/context";
import { AuthContext } from "../Context/AuthContext";

import "./main.css";

function Posting() {
  const [postData, setPostData] = useState({url: "", description: ""});
  const [imgId, setImgId] = useState(``);

  const { setAdd, profile } = useContext(PostsContext);
  const { currentUser } = useContext(AuthContext);

  const date = new Date().toString();
  const navigate = useNavigate();
  const imageListRef = ref(storage, "images/");

  const uploadedFile = (file) => {
    if (file == null) return;
    const imageId = v4();
    setImgId(imageId);
    const imageRef = ref(storage, `images/${imageId}`);
    uploadBytes(imageRef, file);
  };

  const handlePost = async (e) => {
    const date = new Date().toString();
    e.preventDefault();
    listAll(imageListRef).then((res) => {
      res.items.forEach(
        (item) =>
          item.name == imgId &&
          getDownloadURL(item).then(async (url) => {
            await setDoc(doc(db, `posts`, date), {
              url: url,
              description: postData.description,
              likes: [],
              comments: [],
              timeStamp: new Date(),
              uid: currentUser.uid,
              profile: `${profile.firstName} ${profile.lastName}`,
              likeList: false,
              commentList: false,
            });
            setAdd((prev) => prev + 1);
            navigate(`/feed`);
          })
      );
    });
  };

  return (
    <div>
      <Navbar />
      <div className="post">
        <form onSubmit={handlePost}>
          <input
            className="inputFile"
            onChange={(e) => uploadedFile(e.target.files[0])}
            placeholder="Image URL"
            type="file"
          />
          <input
            className="description"
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description"
            type="text"
          />
          <button>POST</button>
        </form>
      </div>
    </div>
  );
}

export default Posting;
