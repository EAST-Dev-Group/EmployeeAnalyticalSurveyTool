import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { DefaultPieGraph } from '../utils/PieGraphConfig';
import { Typography } from '@mui/material';
import Box from '@mui/material/Box';

const PieGraph = () => {
  const data = DefaultPieGraph();
  const totalRatings = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div style={{ width: '100%', marginTop: '20px' }}>
      <Box display="flex" flexDirection="row" alignItems="center">
        <Box flexGrow={1}>
          <Typography># of Ratings from Each CSIT Org:</Typography>
          <PieChart
            series={[
              {
                data: data,
              },
            ]}
            width={1100}
            height={450}
          />
        </Box>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="flex-start"
          justifyContent="center"
          padding={2}
          border="2px solid black"
          borderRadius="8px"
          marginLeft={0.5} // Reduce the margin for closer spacing
        >
          <Typography variant="h6" gutterBottom>
            Ratings:
          </Typography>
          {data.map((item, index) => (
            <Typography key={index}>
              {`Rating ${item.label}: ${item.value} (${((item.value / totalRatings) * 100).toFixed(2)}%)`}
            </Typography>
          ))}
        </Box>
      </Box>
    </div>
  );
};

export default PieGraph;
