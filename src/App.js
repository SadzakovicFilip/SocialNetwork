import { useState, useEffect, useContext } from "react";

import "./App.css";

import { db } from "./Components/firebase/firebase-config";
import { collection, getDocs } from "firebase/firestore";

import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./Components/Context/ProtectedRoute";
import { AuthContext } from "./Components/Context/AuthContext";
import { PostsContext } from "./Components/Context/context";

import LogIn from "./Components/LogIn/SignUp/LogIn";
import SignUp from "./Components/LogIn/SignUp/SignUp";
import Posting from "./Components/Main/Posting";
import Feed from "./Components/Main/Feed";
import MyProfile from "./Components/Main/MyProfile";
import PickedProfile from "./Components/Main/PickedProfile";


export const postCollectionRef = collection(db, `posts`);
export const userCollectionRef = collection(db, `users`);

function App() {
  const [posts, setPosts] = useState([]);
  const [add, setAdd] = useState(0);
  const { currentUser } = useContext(AuthContext);
  const [profile, setProfile] = useState();

  useEffect(() => {
    const getPosts = async () => {
      const data = await getDocs(postCollectionRef);
      setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };
    getPosts();
  }, [add]);

  useEffect(() => {
    const getAllUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setProfile(
        data.docs
          .map((doc) => ({ ...doc.data(), id: doc.id }))
          .find((item) => item.id === currentUser?.uid)
      );
    };
    getAllUsers();
  }, [currentUser, add]);

  const contextValue = { posts, setPosts, add, setAdd, profile };

  return (
    <div className="App">
      <PostsContext.Provider value={contextValue}>
        <BrowserRouter>
          <Routes>
            <Route>
              <Route index element={<LogIn />} />
              <Route path="signUp" element={<SignUp />}></Route>

              <Route
                path="/feed"
                element={
                  <ProtectedRoute>
                    <Feed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/posting"
                element={
                  <ProtectedRoute>
                    <Posting />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/myprofile"
                element={
                  <ProtectedRoute>
                    <MyProfile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="myprofile/:profileID"
                element={
                  <ProtectedRoute>
                    <PickedProfile />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </PostsContext.Provider>
    </div>
  );
}

export default App;
