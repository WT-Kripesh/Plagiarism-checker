import React from 'react';
import Login from "./screens/login";
import Register from "./screens/register";
import Dashboard from "./screens/dashboard";
import Navbar from './components/navbar';
import { BrowserRouter as 
  Router, Route, Routes} from "react-router-dom";

function App() {
  return <div className="app">
    <Router>
      <Routes>
        <Route exact path="/" element={<Login />} ></Route>
        <Route exact path="/register" element={<Register />} ></Route>
        <Route exact path="/dashboard" element={<Dashboard />} Component={()=> <Navbar />} >
        </Route>

      </Routes>
    </Router>
  </div>;
}
export default App;