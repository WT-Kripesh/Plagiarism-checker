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

  
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)));
        const userData = querySnapshot.docs[0]?.data();
        if (userData) {
          const enrolledClassrooms = userData.enrolledClassrooms;
          if (enrolledClassrooms) {
            console.log("Class fetched");
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
    if (loading) return;
    if (!loading && user) fetchClasses();
    else navigate("/");
  }, [user, loading,navigate]);

  return (
    <div className="dashboard__body">
      {(classes === null || classes === undefined || classes.length === 0 )? (
        <div className="dashboard__404">
          No classes found! Join or create one!
        </div>
      ) : (
        <div className="dashboard__classContainer">
          {classes.map((individualClass,index) => (
            <div key={index}>
              <ClassCard
                key={index}
                creatorName={individualClass.creatorName}
                name={individualClass.name}
                id={individualClass.id}
                creatorid={individualClass.creatorUid}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
export default Dashboard;