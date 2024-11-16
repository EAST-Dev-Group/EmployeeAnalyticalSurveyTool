import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Define available time grouping options
export const timeFrameOptions = [
  { value: 'daily', label: 'Daily' },
  { value: 'weekly', label: 'Weekly' },
  { value: 'biweekly', label: 'Bi-weekly' },
  { value: 'triweekly', label: 'Tri-weekly' },
  { value: 'monthly', label: 'Monthly' },
  { value: 'custom', label: 'Custom' },
];

// Filter chart data based on selected organizations
export function processSelectedOrgs(chartData, selectedOrgs) {
  if (!chartData.series || !selectedOrgs) return chartData;

  return {
    ...chartData,
    series: chartData.series.filter(series => selectedOrgs.includes(series.name))
  };
}

// Main function to fetch and process satisfaction data
export function DefaultSatisfactionGraph(timeFrame = 'daily', customDays = '') {
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

  // Calculate number of days for time grouping
  const getDaysBetween = (timeFrame) => {
    switch(timeFrame) {
      case 'weekly': return 7;
      case 'biweekly': return 14;
      case 'triweekly': return 21;
      case 'monthly': return 30;
      case 'custom': return parseInt(customDays) || 1;
      default: return 1; // daily
    }
  };

  // Process raw data into chart-ready format
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
        
        orgMap[org][formattedDateStr].sum += rating;
        orgMap[org][formattedDateStr].count += 1;
      });

      // Get all unique dates and sort them
      const allDates = [...new Set(validData.map(item => 
        item["Recorded Date"].split(' ')[0]
      ))].sort();

      // Convert date strings to date objects
      let processedDates = allDates.map(dateStr => {
        const [year, month, day] = dateStr.split('-').map(Number);
        return new Date(year, month - 1, day);
      });

      // Create initial data series for each org
      let processedSeries = Object.keys(orgMap).map(org => {
        const data = allDates.map(dateStr => {
          const dateData = orgMap[org][dateStr];
          if (!dateData) return null;
          return Number((dateData.sum / dateData.count).toFixed(2));
        });

        return {
          name: org,
          data: data
        };
      });

      // Apply time-based averaging if not daily view
      // Averaging will only apply to days > 1; averaging 1 is useless
      if (timeFrame !== 'daily' && (timeFrame !== 'custom' || parseInt(customDays) > 1)) {
        const daysBetween = getDaysBetween(timeFrame);
        const newDates = [];
        const newSeries = processedSeries.map(series => ({
          name: series.name,
          data: []
        }));

        let currentGroup = {
          startIndex: 0,
          endIndex: 0
        };

        for (let i = 0; i < processedDates.length; i++) {
          if (i === 0) {
            currentGroup.startIndex = i;
            continue;
          }

          const daysDiff = Math.floor(
            (processedDates[i] - processedDates[currentGroup.startIndex]) / (1000 * 60 * 60 * 24)
          );

          if (daysDiff >= daysBetween || i === processedDates.length - 1) {
            currentGroup.endIndex = i;
            
            newDates.push(processedDates[currentGroup.startIndex]);

            processedSeries.forEach((series, seriesIndex) => {
              const values = series.data.slice(currentGroup.startIndex, currentGroup.endIndex + 1)
                .filter(val => val !== null);
              
              const average = values.length > 0
                ? Number((values.reduce((a, b) => a + b, 0) / values.length).toFixed(2))
                : null;
              
              newSeries[seriesIndex].data.push(average);
            });

            currentGroup.startIndex = i;
          }
        }

        processedDates = newDates;
        processedSeries = newSeries;
      }

      // Update chart data state
      setChartData({
        organizations: Object.keys(orgMap),
        dates: processedDates,
        series: processedSeries
      });
    }
  };

  // Fetch data when time frame changes
  useEffect(() => {
    fetchData();
  }, [timeFrame, customDays]);

  return chartData;
}