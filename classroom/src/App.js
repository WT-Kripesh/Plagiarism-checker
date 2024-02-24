import React from 'react';
import Home from "./components/home";
import Login from "./components/login"
import { BrowserRouter as 
  Router, Route, Routes} from "react-router-dom";

function App() {
  return <div className="app">
    <Router>
      <Routes>
        <Route exact path="/test" element={<Home />}></Route>
        <Route exact path="/" element={<Login />} ></Route>
      </Routes>
    </Router>
  </div>;
}
export default App;
