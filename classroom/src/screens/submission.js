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
  const [listOfGroups, setListOfGroups] = useState([]);
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

  const handleCheck = async () => {
    try {
        const response = await axios.post('http://localhost:5000/submit-pdfs', { downloadLinks });
        console.log(response.data);
        const list_of_groups_of_plagiarized = response.data.data;
        setListOfGroups(list_of_groups_of_plagiarized);
    } catch (error) {
        console.error('Error submitting PDF links:', error);
    }
  };

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
      <div>
        <ol>
          {listOfGroups.map((group, index) => (
            <li key={index}>{group}</li>
          ))}
        </ol>
      </div>
      <div className="file_list">
        <ol>
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
