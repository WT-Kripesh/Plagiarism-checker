import { IconButton } from "@material-ui/core";
import { MoreVert } from "@material-ui/icons";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import "./styles/Announcement.css";

function Announcement1({ id,image, name, date, content, authorId }) {
  const navigate = useNavigate();
  const Submissions = () => {
    navigate(`/submissions/${id}/${authorId}`);
  };
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
      <div className="buttonContainer">
        <button className="assignment__upload assignment__view" onClick={Submissions}>
          View Submissions
        </button>
      </div>
    </div>
  );
}
export default Announcement1;
