import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db,auth,  getAllDownloadURLs } from "../components/firebase";
import "./styles/Class1.css";
import {  doc, onSnapshot } from "firebase/firestore";
import axios from 'axios';
function Submission() {
  const { id, authorId } = useParams();
  const [ClassData, setClassData] = useState({});
  const [user, loading] = useAuthState(auth);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [loading, user,navigate]);
  
  useEffect(() => {
    async function fetchLinks() {
      try {
        const links = await getAllDownloadURLs(authorId);
        setDownloadLinks(links);
      } catch (error) {
        console.error("Error fetching download links:", error);
      }
    }
    fetchLinks();
  }, [authorId]); // Trigger fetch when authorId changes

  useEffect(() => {
    onSnapshot(doc(db, "classes", id), (snapshot) => {
      const data = snapshot.data();
      if (!data) navigate(`/class/${id}`);
      setClassData(data);
    });
  }, [id,navigate]);

  const handleCheck = () =>{
    console.log(downloadLinks, "jdvjn")
    axios.post('http://localhost:5000/submit-pdfs', { downloadLinks })
        .then(response => {
            console.log(response.data);
            // Handle response from backend if needed
        })
        .catch(error => {
            console.error('Error submitting PDF links:', error);
        });
  }

  return (
    <div className="class">
      <div className="class__nameBox">
        <div className="class__name">
          {ClassData?.name}
          <p>{ClassData?.creatorName}</p>
        </div>
        <div className="class_id">
          <div>Class Id: {id}</div>
          Announcement Id: {authorId}
        </div>
      </div>
      <button onClick={handleCheck}>check Plagarism</button>
      <div className="file_list">
        <ol>
          {/* {files.map(( filename,url) => (
            <li >{filename} {url}</li> */}
          {/* ))} */}
          {downloadLinks.map((linkObj, index) => (
        <div key={index}>
          <p>Filename: {linkObj.filename}</p>
          <a href={linkObj.downloadURL} target="_blank" rel="noreferrer">
            Download Link
          </a>
        </div>
      ))}
        </ol>
      </div>
    </div>
  );
}

export default Submission;
