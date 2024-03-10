import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, getAllDownloadURLs } from "../components/firebase";
import "./styles/Class1.css";
import { doc, onSnapshot } from "firebase/firestore";
import axios from "axios";

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
  }, [loading, user, navigate]);

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
  }, [authorId]); 
  
  useEffect(() => {
    onSnapshot(doc(db, "classes", id), (snapshot) => {
      const data = snapshot.data();
      if (!data) navigate(`/class/${id}`);
      setClassData(data);
    });
  }, [id, navigate]);

  const handleCheck = async () => {
    try {
      const response = await axios.post("http://localhost:5000/submit-pdfs", {
        downloadLinks,
      });
      console.log(response.data);
      const list_of_groups_of_plagiarized = response.data.data;
      setListOfGroups(list_of_groups_of_plagiarized);
    } catch (error) {
      console.error("Error submitting PDF links:", error);
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
      <button onClick={handleCheck} className="check_plag_button">
        check Plagiarism
      </button>
      <div className="donwload_container">
        <p className="group_list">List of groups of plagiarized</p>
        <ol className="file_list">
        {listOfGroups.map((group, index) => (
    <div key={index} className="grouplist_container">
        <ul className="download_container">
            {group.map((item, idx) => (
                <p key={idx}>{item}</p>
            ))}
        <button className="list__button">View pdfs</button>
        </ul>
    </div>

))
}

        </ol>
      </div>
      <div className="file_list">
        <ol className="file_list_ol">
          {downloadLinks.map((linkObj, index) => (
            <div key={index} className="download_container">
              <p>Filename: {linkObj.filename}</p>
              <a href={linkObj.downloadURL} target="_blank" rel="noreferrer">
                View submission
              </a>
            </div>
          ))}
        </ol>
      </div>
    </div>
  );
}

export default Submission;
