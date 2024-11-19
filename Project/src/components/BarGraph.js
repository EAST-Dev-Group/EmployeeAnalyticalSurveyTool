// src/components/BarGraph.js
import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { DefaultSatisfactionGraph } from '../utils/BarGraphConfig';

const BarGraph = () => {
  const chartData = DefaultSatisfactionGraph();

  console.log(chartData);

  // Extended color palette (15 distinct colors)
  const colors = [
    '#FF0000',   // Red
    '#FFA500',   // Orange
    '#FFD700',   // Gold
    '#32CD32',   // Lime Green
    '#0000FF',   // Blue
    '#8A2BE2',   // Blue Violet
    '#FF1493',   // Deep Pink
    '#00CED1',   // Dark Turquoise
    '#FF8C00',   // Dark Orange
    '#4B0082',   // Indigo
    '#008000',   // Green
    '#BA55D3',   // Medium Orchid
    '#CD853F',   // Peru
    '#00FF7F',   // Spring Green
    '#FF69B4',   // Hot Pink
  ];

  return (
    <div style={{ width: '100%', height: 300, marginTop: '20px' }}>
      <BarChart
        xAxis={[{ 
          data: ["1 Star","2 Star", "3 Star","4 Star", "5 Star"],
          scaleType: 'band',
        }]}
        yAxis={[{
          label: 'Satisfaction Ratings',
        }]}
        series={chartData.series.map((series, index) => ({
          data: series.data,
          label: series.name,
          color: colors[index % colors.length],
        }))}
      />
    </div>
  );
};
//Need to make this display each CSIT org.
//Can make a dataset for each and go from there
//https://mui.com/x/react-charts/bars/
export default BarGraph;