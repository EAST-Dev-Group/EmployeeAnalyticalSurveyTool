//Filters Datamaps for LineGraphs
//Imports Here
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Functions & Vars Here
//Will work here later, will display the change in average ratings for each CSIT org over time. Will need a lot of work.
export function DefaultCSITGraph(){
    const [chartData, setChartData] = useState([]);

    //Fetches excel data from Server
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        processData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    // Process Data for average weekly rating for each CSIT Org for Line Graph.
    const processData = (data) => {
      if (data && data.length > 0) {
        // Group and fetch CSIT Orgs
        const csitCounts = data.reduce((acc, row) => {
          const csit = row['CSIT Org'];
          acc[csit] = (acc[csit] || 0) + 1;
  
          return acc;
        }, {});

        // Group and fetch ratings
        const satisfactionCounts = data.reduce((acc, row) => {
          const rating = row['Satisfaction Rating'];
          acc[rating] = (acc[rating] || 0) + 1;

          return acc;
        }, {});
        
        // Group and fetch dates
        const dates = data.reduce((acc, row) => {
          const date = row['Recorded Date'];
          acc[date] = (acc[date] || 0) + 1;

          return acc;
        }, {});

        const allData = csitCounts.join(satisfactionCounts).join(dates);
        console.log(allData);

          // Convert to array format for chart
        const processedData = Object.entries(csitCounts, satisfactionCounts, dates)
        .map(([csit]) => ({
          label: csit
        }));

        setChartData(processedData);
      }
    };

    //Used to break infinite loops.
    if(chartData && chartData.length <= 0){
      fetchData();
    }
    console.log(chartData);
    return chartData;
}
//For future iterations or additions all that would need done is adding another function following the above function as a template.
//fetchData currently fetches data from the currently uploaded datasheet, but can be replaced with fetchAllData as seen in DataDisplay.js, line 104-111