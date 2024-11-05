// src/components/BarGraph.js
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { FilterDataGrid } from '../utils/GraphConfig';

const BarGraph = () => {
  const data = FilterDataGrid();
  //console.log(data);
  /*const data = [
    { rating: '1-Star', value: 10 },
    { rating: '2-Star', value: 15 },
    { rating: '3-Star', value: 25 },
    { rating: '4-Star', value: 15 },
    { rating: '5-Star', value: 20 },
  ];
  */

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <BarChart
        xAxis={[{ 
          data: data.map(item => item.rating),
          scaleType: 'band',
        }]}
        series={[
          {
            data: data.map(item => item.count),
            area: true,
          },
        ]}
      />
    </div>
  );
};

export default BarGraph;