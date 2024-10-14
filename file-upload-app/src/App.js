import * as React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { LineChart } from '@mui/x-charts/LineChart';


import logo from './logo.svg';
import './App.css';



function App() {
  return (
    <div>
    <div><BarChart
    xAxis={[
      {
        id: 'barCategories',
        data: ['1 Star', '2 Star', '3 Stars', '4 Stars', '5 Stars'],
        scaleType: 'band',
      },
      ]}
    series={[
      {
        //This will need updated to fetch a total count of each satisfaction rating
        //TODO: Look into only fetching queried data by the user then plotting that data.
        data: [2, 5, 3, 7, 8],
      },
      ]}
      width={500}
      height={300}
    /></div>
    <div>
      <LineChart
        //x-axis will be dates
        xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
        //Can have multiple series, but they will need dynamically generated based on the ORG. Could make the array then append it?
        //This will generate each its own line.
        series={[
          {
            //y-axis will be employee satisfaction ratings per organization. 
            data: [2, 5.5, 2, 8.5, 1.5, 5],
          },
        ]}
        width={500}
        height={300}
      />
    </div>
    </div>
  );
}

export default App;
