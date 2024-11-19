import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import DataDisplay from './components/DataDisplay';
import LineGraph from './components/LineGraph';
import BarGraph from './components/BarGraph';
import PieGraph from './components/PieGraph';
import CustomUploader from './components/CustomUploader';
import Header from './components/Header';
import GraphWrapper from './components/GraphWrapper';


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
              <Header />
              <CustomUploader onUpload={handleUpload} />
              <DataDisplay view="single" data={uploadedData} />
              <GraphWrapper title="Line Graph">
                <LineGraph data={uploadedData} />
              </GraphWrapper>
              <GraphWrapper title="Bar Graph">
                <BarGraph data={uploadedData} />
              </GraphWrapper>
              <GraphWrapper title="Pie Graph">
                <PieGraph data={uploadedData} />
              </GraphWrapper>

            </>
          } />
          <Route path="/all-data" element={
            <>
              <Header />
              <DataDisplay view="all" />
              <LineGraph />
              <BarGraph />
              <PieGraph />
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;