import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import Announcement from "../components/Announcement";
import { auth, db,  } from "../components/firebase";
import "./styles/Class.css";
import {  doc, onSnapshot } from "firebase/firestore";

function Class() {
  const [classData, setClassData] = useState({});
  const [posts, setPosts] = useState([]);
  const [user, loading] = useAuthState(auth);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // reverse the array
    let reversedArray = classData?.posts?.reverse();
    setPosts(reversedArray);
  }, [classData]);


  useEffect(() => {
    onSnapshot(doc(db, "classes", id),
      ((snapshot) => {
        const data = snapshot.data();
        if (!data) navigate("/");
        //console.log(data);
        setClassData(data);
      }
      ));
  }, [id,navigate]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [loading, user,navigate]);

  return (
    <div className="class">
      <div className="class__Container">
      <div className="class__nameBox">
        <div className="class__name">{classData?.name}</div>
        <div className="class_id">
        <p> 
          {classData?.creatorName}
        </p>
          Class Id: {id}</div>
      </div>

      {posts && posts.length > 0 ? (
    posts.map((post,index) => (
    <Announcement
      key={index} 
      authorId={post.authorId}
      content={post.content}
      date={post.date}
      image={post.image}
      name={post.name}
      style={{ marginTop: 30 }}
    />
    ))
  ) : (
    <div className="noPost">No post yet.</div>
  )}
  </div>
    </div>
  );
}

export default Class;
