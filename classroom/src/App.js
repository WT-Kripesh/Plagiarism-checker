import React from 'react';
import Home from "./components/home";
import Login from "./components/login";
import Register from "./components/register";
import Dashboard from "./components/dashboard";
import Navbar from './components/navbar';
import { BrowserRouter as 
  Router, Route, Routes} from "react-router-dom";

function App() {
  return <div className="app">
    <Router>
      <Routes>
        <Route exact path="/test" element={<Home />}></Route>
        <Route exact path="/" element={<Login />} ></Route>
        <Route exact path="/register" element={<Register />} ></Route>
        <Route exact path="/dashboard" element={<Dashboard />} Component={()=> <Navbar />} >
        </Route>

      </Routes>
    </Router>
  </div>;
}
export default App;