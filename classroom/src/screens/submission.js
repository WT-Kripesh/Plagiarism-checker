import React, { useState, useEffect } from "react";
import { useParams, useNavigate, redirect } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { db, auth, getAllDownloadURLs } from "../components/firebase";
import "./styles/submission.css";
import { doc, onSnapshot } from "firebase/firestore";
import axios from "axios";

function Submission() {
  const { id, authorId } = useParams();
  const [ClassData, setClassData] = useState({});
  const [user, loading] = useAuthState(auth);
  const [downloadLinks, setDownloadLinks] = useState([]);
  const [listOfGroups, setListOfGroups] = useState([]);
  const navigate = useNavigate();
  const [pdfSelected,setPdfselected] = useState(null);

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
  const handleSelectPdf = (index) => {
    setPdfselected(index);
  }
  const handleClosePdf = () => {
    setPdfselected(null);
  };

  const handleNextPdf = () => {
    setPdfselected((prevIndex) => (prevIndex < downloadLinks.length - 1 ? prevIndex + 1 : prevIndex));
  };

  const handlePreviousPdf = () => {
    setPdfselected((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  return (
    <div className="class">
      <div className="class__nameBox">
        <div className="class__name">
          {ClassData?.name}
          <p style={{fontSize: '24px' ,fontWeight: '400' }}>{ClassData?.creatorName}</p>
        </div>
        <div className="class_id">
          <p>Class Id: {id}</p>
          Announcement Id: {authorId}
        </div>
      </div>

      <button onClick={handleCheck} className="check_plag_button">
          check Plagiarism
        </button>

      <div className="grouplist_container">
        <div className="inside_container" style={{justifyContent:'center'}}>
        <img src="https://1000logos.net/wp-content/uploads/2024/02/Alert-Emoji.png" alt="!!" className="image"/>
        <p className="group_list">Plagiarism found</p>
        </div>
        <ol className="file_list">                {/* list of files */}
        {listOfGroups.map((group, index) => (

        <div key={index} className="inside_container">
        <div className="inside_container" style={{justifyContent:'center'}}>
        <img src="https://1000logos.net/wp-content/uploads/2024/02/Two-Exclamation-Marks-Emoji.png" alt="Caution" className="image"/>
        <ul >
            {group.map((item, idx) => (
                <p key={idx}>{item}</p>           //each file
            ))}
        </ul>
        </div>
        <button className="list_button group_button">View pdfs</button>
        </div>
        ))
        }
        </ol>
      </div>

      <div className="file_list">
        <ol className="file_list_ol">
        {downloadLinks.map((linkObj, index) => (
  <div key={index} className="grouplist_container">
    <div className="inside_container">
    <p>{linkObj.filename}</p>
    
    {pdfSelected !== index && (<button className="list_button" onClick={() => handleSelectPdf(index)}>View pdf</button>)}
    </div>
    {pdfSelected === index && (
      <div>
        <div className="pdf__navigate">
        {index > 0 && <button onClick={handlePreviousPdf}>{"◄--  "}Previous</button>}
          {index < downloadLinks.length - 1 && <button onClick={handleNextPdf}>Next{"   --►"}</button>}
          <button style={{color: 'rgb(94, 19, 23)'}} onClick={handleClosePdf}>Close  X</button>
        </div>
        <object
          data={linkObj.downloadURL}
          type="application/pdf"
          width="100%"
          height="1000px"
        >
          <p>
            Unable to load. You can{' '}
            <a href={linkObj.downloadURL}>download the PDF file</a> instead.
          </p>
        </object>

      </div>
    )}
  </div>
))}

        </ol>
      </div>
    </div>
  );
}

export default Submission;
