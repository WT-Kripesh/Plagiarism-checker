import React from 'react';
import './styles/home.css';
import { signInWithGoogle } from './firebase';
import classroomlogo from './logo.png';

function Home() {
  return (
    <div className="home">
      <div className="home__container">
        <img
          src={classroomlogo}
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