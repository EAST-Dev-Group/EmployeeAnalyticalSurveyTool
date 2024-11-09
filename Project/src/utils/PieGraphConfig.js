//Filters Datamaps for PieGraphs
//Imports Here
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Functions & Vars Here
//Needs more Discussion.
export function DefaultPieGraph(){
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
    
    const processData = (data) => {
      if (data && data.length > 0) {
        
      }
    };

    //Used to break infinite loops.
    if(chartData && chartData.length <= 0){
      fetchData();
    }
    //outputData(chartData);
    return chartData;
}
//For future iterations or additions all that would need done is adding another function following the above function as a template.
//fetchData currently fetches data from the currently uploaded datasheet, but can be replaced with fetchAllData as seen in DataDisplay.js, line 104-111