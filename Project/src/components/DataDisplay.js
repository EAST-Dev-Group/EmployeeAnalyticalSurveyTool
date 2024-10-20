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
      {value.length > 200 && (
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

function DataDisplay({ view }) {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [pageSize, setPageSize] = useState(5);

  useEffect(() => {
    fetchData();
  }, [view]);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return date.toISOString().split('T')[0];
  };

  const fetchData = async () => {
    try {
      const url = view === 'all' ? '/api/allData' : '/api/data';
      const response = await axios.get(url);
      const responseData = response.data;
      
      if (responseData.length > 0) {
        const cols = [
          { field: 'id', headerName: 'ID', width: 70 },
          ...Object.keys(responseData[0])
          .filter(key => !['UploadedAt', 'LastUpdatedAt', 'UploadID'].includes(key))
          .map(key => ({
            field: key,
            headerName: key,
            width: key === 'Comments' ? 400 : 150,
            editable: true,
            renderCell: key === 'Comments' 
              ? (params) => <ExpandableCell {...params} />
              : undefined
          }))
        ];
        setColumns(cols);
      }

      const rowsWithId = responseData.map((row, index) => {
        const { UploadedAt, LastUpdatedAt, UploadID, ...rest } = row;
        return {
          id: index + 1,
          ...rest,
          'Recorded Date': formatDate(rest['Recorded Date'])
        };
      });

      setData(rowsWithId);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="data-container">
      <div style={{ height: 400, width: '100%', marginBottom: '20px' }}>
        <DataGrid
          rows={data}
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
