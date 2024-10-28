// src/components/LineGraph.js
import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';

const LineGraph = () => {
  const data = [
    { date: '2023-01-01', value: 10 },
    { date: '2023-02-01', value: 15 },
    { date: '2023-03-01', value: 20 },
    { date: '2023-04-01', value: 18 },
    { date: '2023-05-01', value: 25 },
  ];

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <LineChart
        xAxis={[{ 
          data: data.map(item => new Date(item.date)),
          scaleType: 'time',
        }]}
        series={[
          {
            data: data.map(item => item.value),
            area: true,
          },
        ]}
      />
    </div>
  );
};

export default LineGraph;