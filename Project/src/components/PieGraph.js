// src/components/PieGraph.js
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { DefaultPieGraph } from '../utils/PieGraphConfig';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

const PieGraph = () => {
  const data = DefaultPieGraph();
  console.log(data);

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <Box flexGrow={1}>
        <Typography># of Ratings from Each CSIT Org:</Typography>
        <PieChart
        series={[
          {
            data: data,
          },
        ]}
        width={800}
        height={400}
      />
    </Box>
    </div>
  );
};

export default PieGraph;