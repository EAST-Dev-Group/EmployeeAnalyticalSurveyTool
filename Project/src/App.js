import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FileUpload from './components/FileUpload';
import DataDisplay from './components/DataDisplay';
import LineGraph from './components/LineGraph';

function App() {
  return (
    <Router>
      <div className="App">
        {/*<nav>
          <ul>
            <li><Link to="/">Single File View</Link></li>
            <li><Link to="/all-data">All Data View</Link></li>
          </ul>
        </nav>*/}

        <Routes>
          <Route path="/" element={
            <>
              <h1>Survey Responses</h1>
              <FileUpload />
              <DataDisplay view="single" />
              <LineGraph />
            </>
          } />
          <Route path="/all-data" element={
            <>
              <h1>All Survey Responses</h1>
              <DataDisplay view="all" />
              <LineGraph />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;