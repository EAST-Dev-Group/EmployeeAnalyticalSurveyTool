//Filters Datamaps for LineGraphs
//Imports Here
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Functions & Vars Here
//Will work here later, will display the change in average ratings for each CSIT org over time. Will need a lot of work.
export function DefaultCSITGraph(){
    const [chartData, setChartData] = useState([]);

    //Fetches All Data from Server
    const fetchAllData = async () => {
        try {
          const response = await axios.get('/api/allData');
          processData(response.data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      }
    
    // Process Data for average weekly rating for each CSIT Org for Line Graph.
    const processData = (data) => {
      if (data && data.length > 0) {
        
      }
    };

    //Used to break infinite loops.
    if(chartData && chartData.length <= 0){
        fetchAllData();
    }
    //outputData(chartData);
    return chartData;
}