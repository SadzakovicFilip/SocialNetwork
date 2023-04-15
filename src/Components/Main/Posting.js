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

function Posting() {
  const [postData, setPostData] = useState({ url: "", description: "" });
  const [fileState, setFileState] = useState(``);
  const [imgURL, setImgURL] = useState(``);

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
    if(fileState==false) return 

    const date = new Date().toString();
    const imageRef = ref(storage, `images/${v4()}`);

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
    });
    setAdd((prev) => prev + 1);
    navigate(`/feed`);
  };

  return (
    <div>
      <Navbar />
      <div className="post">
        <div className="imgPreview">
          {imgURL && <img src={imgURL} alt="preview" />}
        </div>
        <form onSubmit={handlePost}>
            <label htmlFor="inputFile" className="labelInput"><PostAddSharpIcon/></label>
          <input
            id="inputFile"
            onChange={(e) => imgPreview(e.target.files[0])}
            placeholder="Image URL"
            type="file"
          />
          <input
            style={{ color: `black` }}
            className="description"
            onChange={(e) =>
              setPostData((prev) => ({ ...prev, description: e.target.value }))
            }
            placeholder="Description"
            type="text"
          />
          <div className="formButtons">
            <button>POST</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Posting;
