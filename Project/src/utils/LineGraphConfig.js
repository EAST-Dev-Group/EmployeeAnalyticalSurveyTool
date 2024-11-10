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
      console.log(data);
      if (data && data.length > 0) {
        // Group and fetch CSIT Orgs, ratings, and dates
        let rawDataArr = Array.from(data);
        let dataArr = [];

        for(let i = 0; i < rawDataArr.length; ++i){
          dataArr.push({csit: rawDataArr[i]["CSIT Org"], rating: rawDataArr[i]["Satisfaction Rating"], date: rawDataArr[i]["Recorded Date"]});
        }

        dataArr.sort((a, b) => new Date(a.date) - new Date(b.date)); // Sort by date
        const processedData = Object.assign(dataArr);

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