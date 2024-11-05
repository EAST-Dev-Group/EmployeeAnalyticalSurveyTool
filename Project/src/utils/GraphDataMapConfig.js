//This will be used to filter out series and xaxes for graph datamaps.
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import DateRange from '../components/daterange';

function ExpandableCell({ value }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {expanded ? value : value.slice(0, 200)}&nbsp;
      {value && value.length > 200 && (
        <Link
          component="button"
          sx={{ fontSize: 'inherit', letterSpacing: 'inherit' }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'view less' : 'view more'}
        </Link>
      )}
    </div>
  );
}

export function DataMapFilter ({ view, data: initialData }) {
  const [displayData, setDisplayData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(5);
  const [dateRange, setDateRange] = useState([null, null]);

  useEffect(() => {
    if (view === 'single' && initialData) {
      processData(initialData);
    } else if (view === 'all') {
      fetchAllData();
    } else if (view === 'single' && !initialData) {
      fetchData();
    }
  }, [view, initialData]);

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

  const processData = (data) => {
    if (data && data.length > 0) {
      const cols = [
        ...Object.keys(data[0])
          .filter(key => !['UploadedAt', 'LastUpdatedAt', 'UploadID', 'id'].includes(key))  
          .map(key => ({
            field: key,
            headerName: key === 'id' ? 'ID' : key,
            width: key === 'Comments' ? 400 : 150,
            editable: true,
            renderCell: key === 'Comments' 
              ? (params) => <ExpandableCell {...params} />
              : undefined
          }))
      ];
      
      cols.unshift({ field: 'id', headerName: 'ID', width: 70 });
      
      setColumns(cols);

      const rowsWithId = data.map((row, index) => ({
        id: row.id || index + 1,
        ...row,
        'Recorded Date': formatDate(row['Recorded Date'])
      }));

      setDisplayData(rowsWithId);
      setFilteredData(rowsWithId);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
  };

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

  console.log(filteredData);
}