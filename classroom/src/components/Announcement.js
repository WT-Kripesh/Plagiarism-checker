import { useState } from "react";
import { IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { uploadFileToStorage } from "./firebase"; 
import "./styles/Announcement.css";

function Announcement({ image, name, date, content, authorId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadError, setUploadError] = useState(null);
  const [uploaded, setuploaded] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
    if (selectedFile) {
      // Upload the selected file to Firebase Storage
      const uploadTask = uploadFileToStorage(selectedFile, authorId);

      // Monitor the upload progress
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
          console.log(`Upload of ${selectedFile.name} is ${progress}% done`);
        },
        (error) => {
          setUploadError(error.message);
          console.error(`Error uploading ${selectedFile.name}:`, error);
        },
        () => {
          setuploaded(true);
          console.log(`${selectedFile.name} uploaded successfully`);
        }
      );
    } else {
      console.log("No file selected");
    }
  };

  return (
    <div className="announcement">
      <div className="announcement__informationContainer">
        <div className="announcement__infoSection">
          <div className="announcement__imageContainer">
            <img src={image} alt="Profile" />
          </div>
          <div className="announcement__nameAndDate">
            <div className="announcement__name">{name}</div>
            <div className="announcement__date">{date}</div>
          </div>
        </div>
        <div className="announcement__infoSection">
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="announcement__content">{content}</div>
      <div className="buttonContainer">
        <input type="file" onChange={handleFileChange} />
        <button className="assignment__upload" onClick={handleUpload}>
          Upload your work
        </button>
      </div>
      {uploadProgress > 0 && uploadProgress < 100 && <div>Upload Progress: ${uploadProgress}%</div>}
      {uploaded && <div >{selectedFile.name} uploaded successfully</div>}
      {uploadError && <div >Error: {uploadError}</div>}
    </div>
  );
}

export default Announcement;

