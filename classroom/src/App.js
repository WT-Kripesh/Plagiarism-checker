import React from 'react';
import Login from "./components/login";
import Register from "./components/register";
import Home from "./components/home";
import Navbar from './components/navbar';
import dashboard from './utils/dashboard';
import { BrowserRouter as 
  Router, Route, Routes} from "react-router-dom";

function App() {
  return <div className="app">
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} ></Route>
        <Route exact path="/register" element={<Register />} ></Route>
        <Route exact path="/dashboard" element={<Home />} 
        Component={()=> <Navbar />} >
        </Route>

      </Routes>
    </Router>
  </div>;
}
export default App;