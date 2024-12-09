import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function DefaultPieGraph(inputData = []) {
  const [chartData, setChartData] = useState([]);

  const processData = (data) => {
    if (data && data.length > 0) {
      const validData = data.filter(item => 
        item["CSIT Org"] && 
        item["Satisfaction Rating"]
      );

      // Group satisfaction ratings by organization
      const orgMap = {};
      validData.forEach(item => {
        const org = item["CSIT Org"];
        const rating = parseFloat(item["Satisfaction Rating"]);

        if (!orgMap[org]) {
          orgMap[org] = [];
        }

        orgMap[org].push(rating);
      });

      // Convert orgMap to an array suitable for pie chart display
      const processedData = Object.keys(orgMap).map(org => {
        const ratingsCount = orgMap[org].reduce((acc, rating) => {
          acc[rating] = (acc[rating] || 0) + 1;
          return acc;
        }, {});

        return {
          label: org,
          totalRatings: orgMap[org].length,
          ratingsBreakdown: Object.entries(ratingsCount).map(([rating, count]) => ({
            rating: parseInt(rating, 10),
            count
          }))
        };
      });

      setChartData(processedData);
    }
  };

  useEffect(() => {
    if (inputData && inputData.length > 0) {
      processData(inputData);
    }
  }, [inputData]);

  return chartData;
}
