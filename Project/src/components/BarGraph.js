// src/components/BarGraph.js
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { filterDataGrid } from '../utils/GraphConfig';

const BarGraph = ({data}) => {
  const inputData = filterDataGrid(data);

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <BarChart
        xAxis={[{ 
          data: inputData.map(item => item.rating),
          scaleType: 'band',
        }]}
        series={[
          {
            data: inputData.map(item => item.value),
            area: true,
          },
        ]}
      />
    </div>
  );
};

export default BarGraph;