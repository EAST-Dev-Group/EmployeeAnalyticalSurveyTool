//Filters Datamaps for BarGraphs
//Imports Here
import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Functions & Vars Here
export function DefaultSatisfactionGraph(inputData = []){
  const [chartData, setChartData] = useState({
    series: []
  });
    
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
      
      // Sort organizations alphabetically
      const sortedOrgs = Object.keys(orgMap).sort((a, b) => a.localeCompare(b));

      // Create series data with counted ratings for each CSIT Org
      const series = sortedOrgs.map(org => {
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

  useEffect(() => {
    if (inputData && inputData.length > 0) {
      processData(inputData);
    }
  }, [inputData]);

  return chartData;
}