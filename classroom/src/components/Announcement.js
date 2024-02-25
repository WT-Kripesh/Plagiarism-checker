import { IconButton } from "@material-ui/core";
import { Menu, MoreVert } from "@material-ui/icons";
import React from "react";
import "./styles/Announcement.css";

function Announcement({ image, name, date, content, authorId }) {
  return (
    <div className="announcement">
      <div className="announcement__informationContainer">
        <div className="announcement__infoSection">
          <div className="announcement__imageContainer">
            <img src={image} alt="Profile photo" />
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
      <div ClassName="buttonContainer">
      <button className="assignment__upload " >
          Add your work
        </button> 
        <button className="assignment__upload assignment__handin">
          Turn-in
        </button>
        </div>
    </div>
  );
}

export default Announcement;
