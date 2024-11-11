// LineGraphConfig.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export function DefaultSatisfactionGraph() {
  const [chartData, setChartData] = useState({
    organizations: [],
    dates: [],
    series: []
  });

  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      processData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const processData = (data) => {
    if (data && data.length > 0) {
      const validData = data.filter(item => 
        item["Recorded Date"] && 
        item["Satisfaction Rating"] && 
        item["CSIT Org"]
      );

      // Group data by organization and date
      const orgMap = {};
      validData.forEach(item => {
        const org = item["CSIT Org"];
        const dateStr = item["Recorded Date"].split(' ')[0];
        const [year, month, day] = dateStr.split('-').map(Number);
        const date = new Date(year, month - 1, day);
        const rating = parseFloat(item["Satisfaction Rating"]);

        if (!orgMap[org]) {
          orgMap[org] = {};
        }

        const formattedDateStr = date.toISOString().split('T')[0];
        if (!orgMap[org][formattedDateStr]) {
          orgMap[org][formattedDateStr] = {
            sum: 0,
            count: 0
          };
        }
        
        // Sum ratings and count for averaging
        orgMap[org][formattedDateStr].sum += rating;
        orgMap[org][formattedDateStr].count += 1;
      });

      // Get all unique dates
      const allDates = [...new Set(validData.map(item => 
        item["Recorded Date"].split(' ')[0]
      ))].sort();

      // Create series data with averaged ratings rounded to 2 decimal places
      const series = Object.keys(orgMap).map(org => {
        const data = allDates.map(dateStr => {
          const dateData = orgMap[org][dateStr];
          if (!dateData) return null;
          // Calculate average rating and round to 2 decimal places
          return Number((dateData.sum / dateData.count).toFixed(2));
        });

        return {
          name: org,
          data: data
        };
      });

      setChartData({
        organizations: Object.keys(orgMap),
        dates: allDates.map(dateStr => {
          const [year, month, day] = dateStr.split('-').map(Number);
          return new Date(year, month - 1, day);
        }),
        series: series
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return chartData;
}