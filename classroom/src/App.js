import React from 'react';
import Home from "./components/home";
import { BrowserRouter as 
  Router, Route, Routes} from "react-router-dom";


function App() {
  return <div className="app">
    <Router>
      <Routes>
        <Route exact path="/" element={<Home />}></Route>
        <Route path="test" element="hello" ></Route>
      </Routes>
    </Router>
  </div>;
}
export default App;
