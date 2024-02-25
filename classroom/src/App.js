import React from 'react';
import Login from "./screens/login";
import Dashboard from "./screens/Dashboard";
import Register from "./screens/register"
import Navbar from './components/navbar';
import Class from './screens/Class';
import Class1 from './screens/Class1'
import { BrowserRouter as 
  Router, Route, Routes} from "react-router-dom";

function App() {
  return <div className="app">
    <Router>
      <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/register" element={<Register />} />
      <Route excat path="/dashboard" element={
        <>
        <Navbar />
        <Dashboard />
        </>
      } />
      <Route excat path="/class/:id" element={
        <>
        <Navbar />
        <Class />
        </>
      } />
      <Route exact path="/teacher/:id" element={
        <>
        <Navbar />
        <Class1 />
        </>
      } />
      </Routes>
    </Router>
  </div>;
}
export default App;