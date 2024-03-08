import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  auth,
  logInWithEmailAndPassword,
  signInWithGoogle,
} from "../components/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import "./styles/login.css";
// import classroomlogo from '../components/logo.png';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, loading] = useAuthState(auth);
  const [loginError, setLoginError] = useState(null); // Add state for login error
  const navigate = useNavigate();
  useEffect(() => {
    if (loading) {
      // maybe trigger a loading screen
      return;
    }
    if (user) navigate("/dashboard");
  }, [user, loading,navigate]);
  useEffect(() => {
    let timer;
    if (loginError) {
      // Set a timer to clear the error message after 5 seconds
      timer = setTimeout(() => {
        setLoginError(""); // Clear the loginError after 5 seconds
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [loginError]);

  const handleLogin = async () => {
    try {
      await logInWithEmailAndPassword(email, password, setLoginError);
    } catch (err) {
      console.error(err);
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="login">
      <div className="login__container">
        <img
          src="https://1000logos.net/wp-content/uploads/2020/10/Duolingo-Logo-2013.png"
          alt="Classroom"
          className="image"
        />
        <input
          type="text"
          className="login__textBox"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-mail Address"
        />
        <input
          type="password"
          className="login__textBox"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        {/* Conditionally render the error message */}
        {loginError && (
          <div className="login_textBox login_errorMessage">{loginError}</div>
        )}
        <button className="login__btn" onClick={handleLogin}>
          Login
        </button>

        <button className="login__btn login__google" onClick={signInWithGoogle}>
          Login with Google
        </button>
        <div style={{ fontSize: "16px" }}>
          Don't have an account? <Link to="/register">Register</Link> now.
        </div>
      </div>
    </div>
  );
}
export default Login;
