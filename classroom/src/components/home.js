import React from 'react';
import './home.css';
import { signInWithGoogle } from './firebase';
import classroomgif from '../../public/gif.gif';

function Home() {
  return (
    <div className="home">
      <div className="home__container">
        <img
          src={classroomgif}
          alt="Google Classroom Image"
          className="home__image"
        />
        <button className="home__login" onClick={signInWithGoogle} >
          Login with Google
        </button>
      </div>
    </div>
  );
}

export default Home;