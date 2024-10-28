import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DataDisplay from './components/DataDisplay';
import LineGraph from './components/LineGraph';
import CustomUploader from './components/CustomUploader';

function App() {
  const [uploadedData, setUploadedData] = useState(null);

  const handleUpload = (data) => {
    setUploadedData(data.data);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <h1>Survey Responses</h1>
              <CustomUploader onUpload={handleUpload} />
              <DataDisplay view="single" data={uploadedData} />
              <LineGraph data={uploadedData} />
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