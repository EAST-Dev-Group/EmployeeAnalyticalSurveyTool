// src/components/BarGraph.js
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { DefaultSatisfactionGraph } from '../utils/BarGraphConfig';

const BarGraph = () => {
  const data = DefaultSatisfactionGraph();

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <BarChart
        xAxis={[{ 
          data: [1,2,4,5,9],
          scaleType: 'band',
        }]}
        series={[
          {
            data: [1,2,3,4,5],
            area: true,
          },
        ]}
      />
    </div>
  );
};
//Need to make this display each CSIT org.
//Can make a dataset for each and go from there
//https://mui.com/x/react-charts/bars/
export default BarGraph;