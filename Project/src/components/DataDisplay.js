import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link as RouterLink } from 'react-router-dom';
import { DataGrid } from '@mui/x-data-grid';
import Link from '@mui/material/Link';

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

function DataDisplay({ view, data: initialData }) {
  const [displayData, setDisplayData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    if (view === 'single' && initialData) {
      processData(initialData);
    } else if (view === 'all') {
      fetchAllData();
    } else if (view === 'single' && !initialData) {
      fetchData();
    }
  }, [view, initialData]);

  const processData = (data) => {
    if (data && data.length > 0) {
      const cols = [
        ...Object.keys(data[0])
          .filter(key => !['UploadedAt', 'LastUpdatedAt', 'UploadID', 'id'].includes(key))  // Add 'id' to filtered keys
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
      
      // Add ID column at the beginning
      cols.unshift({ field: 'id', headerName: 'ID', width: 70 });
      
      setColumns(cols);

      const rowsWithId = data.map((row, index) => ({
        id: row.id || index + 1,
        ...row,
        'Recorded Date': formatDate(row['Recorded Date'])
      }));

      setDisplayData(rowsWithId);
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
      <div style={{ height: 400, width: '100%', marginBottom: '20px' }}>
        <DataGrid
          rows={displayData}
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
          <RouterLink to="/" className="view-single-btn"><i className="bi bi-arrow-left"></i>View Single File</RouterLink>
        )}
      </div>
    </div>
  );
}

export default DataDisplay;