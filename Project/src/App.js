import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { DataDisplay } from './components/DataDisplay';
import { LineGraph } from './components/LineGraph';
import { BarGraph } from './components/BarGraph';
import { PieGraph } from './components/PieGraph';
import { CustomUploader } from './components/CustomUploader';
import { Header }  from './components/Header';

function App() {
  const [uploadedData, setUploadedData] = useState(null);
  // Pass data from DataDisplay.js
  const [singleFilteredData, setSingleFilteredData] = useState(null);
  const [allFilteredData, setAllFilteredData] = useState(null);
  // Add this new state for color mapping
  const [globalOrgColorMap, setGlobalOrgColorMap] = useState({});

  /* Adding color mapping in app.js will ensure that flipping between
  single or all data viewing modes will retain the orgs color value 
  for each viewing mode. For example, if this was kept in lineGraphConfig.js, 
  The color values would reset when you switch back to View Single File mode
  from View All Data mode*/
  // Add handler for color map updates
  const handleColorMapUpdate = (colorMap) => {
    setGlobalOrgColorMap(prev => ({...prev, ...colorMap}));
  };

  const handleUpload = (data) => {
    setUploadedData(data.data);
  };

  // Separate handlers for single and all view
  const handleSingleFilteredData = (data) => {
    setSingleFilteredData(data);
  };

  const handleAllFilteredData = (data) => {
    setAllFilteredData(data);
  };

  // Separate graph components for each view
  const singleViewGraphs = (
    <>
      <LineGraph 
        data={singleFilteredData} 
        orgColorMap={globalOrgColorMap}
        onColorMapUpdate={handleColorMapUpdate}
      />
      <BarGraph data={uploadedData} />
      <PieGraph data={uploadedData} />
    </>
  );

  const allViewGraphs = (
    <>
      <LineGraph 
        data={allFilteredData} 
        orgColorMap={globalOrgColorMap}
        onColorMapUpdate={handleColorMapUpdate}
      />
      <BarGraph data={uploadedData} />
      <PieGraph data={uploadedData} />
    </>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Header />
              <CustomUploader onUpload={handleUpload} />
              <DataDisplay 
                view="single" 
                data={uploadedData} 
                onDataFiltered={handleSingleFilteredData}
              />
              {singleViewGraphs}
            </>
          } />
          <Route path="/all-data" element={
            <>
              <Header />
              <DataDisplay 
                view="all" 
                onDataFiltered={handleAllFilteredData}
              />
              {allViewGraphs}
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;