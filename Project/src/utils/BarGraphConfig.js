//Filters Datamaps for BarGraphs
//Imports Here
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Functions & Vars Here
export function DefaultSatisfactionGraph(){
  const [chartData, setChartData] = useState({
    series: []
  });

  //Fetches excel data from Server
  const fetchData = async () => {
      try {
        const response = await axios.get('/api/data');
        processData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
  }
    
  // Process data for whole Bar Chart
  const processData = (data) => {
    if(data && data.length > 0){
      const validData = data.filter(item => 
        item["Satisfaction Rating"] && 
        item["CSIT Org"]
      );

       // Group data by organization and Satisfaction Ratings
      const orgMap = {};
      validData.forEach(item => {
        const org = item["CSIT Org"];
        const rating = parseFloat(item["Satisfaction Rating"]);
        if (!orgMap[org]) {
          orgMap[org] = {};
        }
        if (!orgMap[org][rating]) {
          orgMap[org][rating] = {
            count: 0
          };
        }

        // Count up the ratings for each organization
        orgMap[org][rating].count += 1;
      });

      // Get all unique ratings
      const allRatings = [...new Set(validData.map(item => item["Satisfaction Rating"]
      ))].sort();
      

      // Create series data with counted ratings for each CSIT Org
      const series = Object.keys(orgMap).map(org => {
        const data = allRatings.map(rating => {
          const ratingCountData = orgMap[org][rating];
          if (!ratingCountData) return null;
          // Return counts for current rating
          return Number(ratingCountData.count);
        });

        return {
          name: org,
          data: data,
        };
      });

      setChartData({
        series: series,
      })
    }
  }
  //Used to break infinite loops.
  useEffect(() => {
    fetchData();
  }, []);
  //console.log(chartData);
  return chartData;
  //return null;
}
//For future iterations or additions all that would need done is adding another function following the above function as a template.
//fetchData currently fetches data from the currently uploaded datasheet, but can be replaced with fetchAllData as seen in DataDisplay.js, line 104-111