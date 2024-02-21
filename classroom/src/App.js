import React from 'react';
import { BrowserRouter as 
  Router, Route, Routes} from "react-router-dom";

function App() {
  return <div className="app">
    <Router>
      <Routes>
        <Route exact path="/test">
          Hello
        </Route>
      </Routes>
    </Router>
  </div>;
}
export default App;
