import { IconButton } from "@material-ui/core";
import { SendOutlined } from "@material-ui/icons";
import moment from "moment";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate, useParams } from "react-router-dom";
import Announcement from "../components/Announcement";
import { auth, db } from "../components/firebase";
import "./styles/Class.css";
import { getDoc ,setDoc,doc,onSnapshot} from "firebase/firestore";

function Class() {
  const [classData, setClassData] = useState({});
  const [announcementContent, setAnnouncementContent] = useState("");
  const [posts, setPosts] = useState([]);
  const [user, loading, error] = useAuthState(auth);
  const { id } = useParams();
  const navigate = useNavigate();

  /*
    PLAN: Create a snapshot listener and fill in the data into classData, 
    and then map through it during render
  */

  useEffect(() => {
    // reverse the array
    let reversedArray = classData?.posts?.reverse();
    setPosts(reversedArray);
  }, [classData]);

  const createPost = async () => {
    try {
      const myClassRef = doc(db, "classes", id);
      const myClassSnap = await getDoc(myClassRef);
  
      if (myClassSnap.exists()) {
        const myClassData = myClassSnap.data();
        console.log(myClassData);
  
        let tempPosts = myClassData.posts || []; // Ensure tempPosts is initialized
  
        tempPosts.push({
          authorId: user.uid,
          content: announcementContent,
          date: moment().format("MMM Do YY"),
          image: user.photoURL,
          name: user.displayName,
        });
  
        await setDoc(myClassRef, { posts: tempPosts }, { merge: true });
  
        console.log("Posts updated successfully!");
      } else {
        console.log("Class document not found!");
      }
    } catch (error) {
      console.error(error);
      alert(`There was an error posting the announcement, please try again!`);
    }
  };
  

  useEffect(() => {
    onSnapshot(doc(db,"classes",id),
      ((snapshot) => {
        const data = snapshot.data();
        if (!data) navigate("/");
        console.log(data);
        setClassData(data);
      }
      ));
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [loading, user]);

  return (
    <div className="class">
      <div className="class__nameBox">
        <div className="class__name">{classData?.name}</div>
      </div>
      <div className="class__announce">
        <img src={user?.photoURL} alt=" " />
        <input
          type="text"
          value={announcementContent}
          onChange={(e) => setAnnouncementContent(e.target.value)}
          placeholder="Announce something to the class"
        />
        <IconButton onClick={createPost} tilte="Announce">
          <SendOutlined />
        </IconButton>
      </div>
      {posts?.map((post) => (
        <Announcement
          authorId={post.authorId}
          content={post.content}
          date={post.date}
          image={post.image}
          name={post.name}
        />
      ))}
    </div>
  );
}

export default Class;