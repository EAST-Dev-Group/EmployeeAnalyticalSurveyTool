//Used to build Graphs Axis & Series, then return those arr vals.
//Imports Here
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Functions & Vars Here
export function FilterDataGrid(){
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
            rating: Number(rating),
            count: count
          }))
          .sort((a, b) => a.rating - b.rating);  // Sort by rating

          setChartData(processedData);
      }
    };

    if(chartData && chartData.length <= 0){
        fetchAllData();
    }
    //outputData(chartData);
    return chartData;
}

//GraphTypes: 0 = BarGraph, 1 = LineGraph, 2 = TestCase, Any other val is null.
//Builds xAxis for a graph, will need configged for yAxis implementations.
//
export function buildAxis(graphType, userArgs){
    let inputAxisGrid = [];
    //let scaleStr = "";
    //let dataArr = [];

    switch (graphType) {
        case 0:
            //Make BarGraph axis data
            break;
        case 1:
            //Make LineGraph axis data
            break;
        case 2:
            //Make TestCase axis data for other Charts.
            //If other axis data for other graphs is needed,
            //A new case can be made accordingly.
            break;
        default:
            //Return invalid.
            break;
    }
}

//GraphTypes: 0 = BarGraph, 1 = LineGraph, 2 = PieGraph, 3 = TestCase, Any other val is null.
//Builds Series for a graph, will need configged for other implementations.
export function buildSeries(graphType, userArgs){
    let inputSeriesGrid = [];
    let idCount = 0;
    //let valueArr = [];
    //let labelArr = [];
    //let dataArr = [];

    switch (graphType) {
        case 0:
            //Make BarGraph series data
            break;
        case 1:
            //Make LineGraph series data
            break;

        case 2:
            //Make PieGraph series data
            break;
        case 3:
            //Make TestCase series data for other Charts.
            //If other series data for other graphs is needed,
            //A new case can be made accordingly.
            break;
        default:

            break;
    }
}