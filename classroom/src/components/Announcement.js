import { useState } from "react";
import { IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { uploadFileToStorage } from "./firebase"; 
import "./styles/Announcement.css";

function Announcement({ image, name, date, content, authorId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploaded, setuploaded] = useState(false);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = () => {
   if (selectedFile) {
      // Upload the selected file to Firebase Storage
      uploadFileToStorage(selectedFile, authorId);
          setuploaded(true);

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
      {uploaded && <div >{selectedFile.name} uploaded successfully</div>}
    </div>
  );
}

export default Announcement;

