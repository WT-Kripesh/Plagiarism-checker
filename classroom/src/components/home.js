import React from 'react'
import "./home.css";
import classroomgif from "./gif.gif"
import { signInWithGoogle} from "./firebase"

function home() {
  return (
    <div className="home">
  <div className="home__container">
    <img
      src= {classroomgif} //"https://upload.wikimedia.org/wikipedia/commons/5/59/Google_Classroom_Logo.png"
      alt="Google Classroom Image"
      className="home__image"
    />
    <button className="home__login" onClick={signInWithGoogle}>
      Login with Google
    </button>
  </div>
</div>
  )
}

export default home