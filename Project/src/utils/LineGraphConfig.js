//Filters Datamaps for LineGraphs
//Imports Here
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Functions & Vars Here
//Will work here later, will display the change in average ratings for each CSIT org over time. Will need a lot of work.
export function DefaultCSITGraph(){
    const [chartData, setChartData] = useState([]);
    let dataArr = [];
    //Fetches excel data from Server
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        processData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    }
    
    // Still does not work as intended. Will work here more.
    // Each CSIT org will need their own Label and Data array of ratings, but this is super close.
    // Process Data for average weekly rating for each CSIT Org for Line Graph.
    const processData = (data) => {
      if (data && data.length > 0) {
        // Group and fetch CSIT Orgs, ratings, and dates
        let rawDataArr = Array.from(data);

        for(let i = 0; i < rawDataArr.length; ++i){
          dataArr.push({label: rawDataArr[i]["CSIT Org"], date: rawDataArr[i]["Recorded Date"], value: rawDataArr[i]["Satisfaction Rating"], area: false});
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
    console.log(chartData)
    return chartData;
}
//For future iterations or additions all that would need done is adding another function following the above function as a template.
//fetchData currently fetches data from the currently uploaded datasheet, but can be replaced with fetchAllData as seen in DataDisplay.js, line 104-111