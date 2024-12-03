import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Link from '@mui/material/Link';
import DateRange from './daterange.js';

export function ExpandableCell({ value }) {
  const [expanded, setExpanded] = useState(false);

  // Function to format text with line breaks
  const formatText = (text) => {
    if (!text) return '';
    return text.split('\n').map((line, index) => (
      <React.Fragment key={index}>
        {line.replace(/\s/g, '\u00A0')}
        {index !== text.split('\n').length - 1 && <br />}
      </React.Fragment>
    ));
  };

  return (
    <div style={{ 
      whiteSpace: expanded ? 'pre-wrap' : 'normal',
      wordBreak: 'break-word',
    }}>
      {expanded ? formatText(value) : value.slice(0, 200)}&nbsp;
      {value && value.length > 200 && (
        <Link
          component="button"
          sx={{ 
            fontSize: 'inherit', 
            letterSpacing: 'inherit',
            verticalAlign: 'baseline',
            marginLeft: '4px'
          }}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'view less' : 'view more'}
        </Link>
      )}
    </div>
  );
}

export function DataDisplay({ view, data: initialData, onDataFiltered }) {
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
    } 
  }, [view, initialData]);

  useEffect(() => {
    if (dateRange[0] && dateRange[1]) {
      const [start, end] = dateRange;
      const newFilteredData = displayData.filter(row => {
        const date = new Date(row['Recorded Date']);
        return date >= start.toDate() && date <= end.toDate();
      });
      setFilteredData(newFilteredData);
      if (onDataFiltered) {  // Add check in case onDataFiltered is not provided
        onDataFiltered(newFilteredData);
      }
    } else {
      setFilteredData(displayData);
      if (onDataFiltered) {  // Add check in case onDataFiltered is not provided
        onDataFiltered(displayData);
      }
    }
  }, [dateRange, displayData], onDataFiltered);

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
      
      //show id field
      //cols.unshift({ field: 'id', headerName: 'ID', width: 70 });
      
      setColumns(cols);

      const rowsWithId = data.map((row, index) => ({
        id: /*row.id ||*/ index + 1,
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

  return (
    <div className="data-container">
      <div style={{ marginBottom: '20px' }}>
        <DateRange dateRange={dateRange} setDateRange={setDateRange} />
      </div>
      <div style={{ height: 400, width: '100%', marginBottom: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.05)' }}>
        <DataGrid
          rows={filteredData}
          columns={columns}
          pageSize={pageSize}
          onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          rowsPerPageOptions={[5, 10, 20]}
          getRowHeight={() => 'auto'}
          getEstimatedRowHeight={() => 100}
          sx={{
            '&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell': { py: 1 },
            '&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell': { py: '15px' },
            '&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell': { py: '22px' },
          }}
        />
      </div>
      
      <div className="button-container" style={{ marginTop: '20px' }}>
        {view === 'single' ? (
          <RouterLink to="/all-data" className="view-all-btn">View All Data<i className="bi bi-arrow-right"></i></RouterLink>
        ) : (
          <RouterLink to="/" className="view-single-btn"><i className="bi bi-arrow-left"></i>View File</RouterLink>
        )}
      </div>
    </div>
  );
}