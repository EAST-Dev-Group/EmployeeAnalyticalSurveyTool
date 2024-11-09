// src/components/BarGraph.js
import * as React from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { DefaultPieGraph } from '../utils/PieGraphConfig';

const PieGraph = () => {
  const data = DefaultPieGraph();

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <PieChart
      series={[
        {
          data: [
            { id: 0, value: 10, label: 'series A' },
            { id: 1, value: 15, label: 'series B' },
            { id: 2, value: 20, label: 'series C' },
          ],
        },
      ]}
      width={400}
      height={200}
    />
    </div>
  );
};

export default PieGraph;

//data: data.map(item => item.count),
//            label: data.map(item => item.csit)
//            area: true,