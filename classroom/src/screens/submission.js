
import React from "react";
import { useParams,useNavigate } from "react-router-dom";
import { useState ,useEffect} from "react";
import { db, listFilesAndDirectories } from "../components/firebase";
import "./styles/Class1.css";
import { getDoc, doc,onSnapshot } from "firebase/firestore";


function Submission() {
    const {id, authorId } = useParams();
  const [ClassData, setClassData] = useState({});
  const navigate=useNavigate();

  useEffect(() => {
    onSnapshot(doc(db, "classes", id),
      ((snapshot) => {
        const data = snapshot.data();
        if (!data) navigate("/class/${id}");
        //console.log(data);
        setClassData(data);
      }
      ));
  }, []);

//   const listallfiles = async () => {
//     console.log(await listFilesAndDirectories("files"));
//   }

  return (
    <div className="class">
      <div className="class__nameBox">
        <div className="class__name">
            {ClassData?.name}
            <p> 
          {ClassData?.creatorName}
        </p>
            </div>
        <div className="class_id">
        <div> 
          Class Id: {id}
        </div>
          Announcement Id: {authorId}</div>
      </div>
        


    </div>
  );
}

export default Submission;
