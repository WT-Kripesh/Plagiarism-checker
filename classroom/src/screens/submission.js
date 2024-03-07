import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { db, listFilesAndDirectories,downloadAll, getAllDownloadURLs } from "../components/firebase";
import "./styles/Class1.css";
import {  doc, onSnapshot } from "firebase/firestore";

function Submission() {
  const { id, authorId } = useParams();
  const [ClassData, setClassData] = useState({});
  const [downloadLinks, setDownloadLinks] = useState([]);
  const navigate = useNavigate();

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       // const files = await listFilesAndDirectories(authorId);
  //       const files = await getAllDownloadURLs(authorId);
  //       setFiles(files);
  //       // await downloadAll(authorId);
  //     } catch (error) {
  //       console.error("Error fetching files:", error);
  //     }
  //   };
  //   fetchData();
  //   console.log(files);
  // },
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
  }, []);

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
