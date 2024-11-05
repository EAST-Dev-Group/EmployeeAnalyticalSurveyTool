//Filters Datamaps for BarGraphs
//Imports Here
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Functions & Vars Here
export function DefaultSatisfactionGraph(){
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
    
    // Process data for whole Bar Chart
    const processData = (data) => {
      if (data && data.length > 0) {
        // Group by Satisfaction Rating
        const satisfactionCounts = data.reduce((acc, row) => {
          const rating = row['Satisfaction Rating'];
          acc[rating] = (acc[rating] || 0) + 1;
  
          return acc;
        }, {});
  
        // Convert to array format for chart
        const processedData = Object.entries(satisfactionCounts)
          .map(([rating, count]) => ({
            rating: Number(rating) + " Star",
            count: count
          }))
          .sort((a, b) => a.rating - b.rating);  // Sort by rating

          setChartData(processedData);
      }
    };

    //Used to break infinite loops.
    if(chartData && chartData.length <= 0){
        fetchAllData();
    }
    //outputData(chartData);
    return chartData;
}