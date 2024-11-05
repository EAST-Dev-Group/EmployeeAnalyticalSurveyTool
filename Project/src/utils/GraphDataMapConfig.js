//This will be used to filter out series and xaxes for graph datamaps.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Link from '@mui/material/Link';
import DateRange from '../components/daterange';

/*
const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Process data for Bar Chart
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
  }, [data]);
*/

export function DataMapFilter ({ view, data: initialData }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (view === 'single' && initialData) {
      processData(initialData);
    } else if (view === 'all') {
      fetchAllData();
    } else if (view === 'single' && !initialData) {
      fetchData();
    }
  }, [view, initialData]);

  /*
  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      setFilteredData(displayData.filter(row => {
        const date = new Date(row['Recorded Date']);
        return date >= start.toDate() && date <= end.toDate();
      }));
    } else {
      setFilteredData(displayData);
    }
  }, [dateRange, displayData]);

  //const rowsWithId = data.map((row, index) => ({
  //  id: row.id || index + 1,
  //  ...row,
  //  'Recorded Date': formatDate(row['Recorded Date'])
  //}));
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
  };*/

  
  const fetchData = async () => {
    try {
      const response = await axios.get('/api/data');
      processData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //new
  const fetchAllData = async () => {
    try {
      const response = await axios.get('/api/allData');
      processData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  //console.log(filteredData);
}