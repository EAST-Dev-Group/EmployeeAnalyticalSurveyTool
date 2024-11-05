//Filters Datamaps for PieGraphs
//Imports Here
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Functions & Vars Here
//Needs more Discussion.
export function DefaultPieGraph(){
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