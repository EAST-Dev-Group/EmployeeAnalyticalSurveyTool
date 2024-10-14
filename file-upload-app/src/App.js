import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <BarChart
    xAxis={[
      {
        id: 'barCategories',
        data: ['1 Star', '2 Star', '3 Stars', '4 Stars', '5 Stars'],
        scaleType: 'band',
      },
      ]}
    series={[
      {
        data: [2, 5, 3, 7, 8],
      },
      ]}
      width={500}
      height={300}
    />
  );
}

export default App;
