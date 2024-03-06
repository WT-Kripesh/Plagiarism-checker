import React, { useEffect } from "react";
import "./styles/Dashboard.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../components/firebase";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import ClassCard from "../components/Classcard";
import {collection,where,getDocs,query} from "firebase/firestore"

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const [classes, setClasses] = useState([]);
  const navigate = useNavigate();

  const fetchClasses = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
      const userData = querySnapshot.docs[0]?.data();
      if (userData) {
        const enrolledClassrooms = userData.enrolledClassrooms;
        if (enrolledClassrooms) {
          //console.log("Classes fetched", enrolledClassrooms);
          setClasses(enrolledClassrooms);
        } else {
          console.log("No classes found for the user");
          setClasses([]);
        }
      } else {
        console.log("User data not found");
        setClasses([]);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
      setClasses([]);
    }
  };
  
  
  
  useEffect(() => {
    if (loading) return;
    if (!user) navigate("/");
  }, [user, loading]);
  useEffect(() => {
    if (loading) return;
    fetchClasses();
  }, [user, loading]);
  return (
    <div className="dashboard__body">
      {(classes === null || classes === undefined || classes.length === 0 )? (
        <div className="dashboard__404">
          No classes found! Join or create one!
        </div>
      ) : (
        <div className="dashboard__classContainer">
          {classes.map((individualClass,index) => (
            <ClassCard
              key={index} 
              creatorName={individualClass.creatorName}
              creatorPhoto={individualClass.creatorPhoto}
              name={individualClass.name}
              id={individualClass.id}
              style={{ marginRight: 30, marginBottom: 30 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
export default Dashboard;