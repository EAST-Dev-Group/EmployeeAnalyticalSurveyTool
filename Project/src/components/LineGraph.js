import React from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { DefaultSatisfactionGraph } from '../utils/LineGraphConfig';

const LineGraph = () => {
  const chartData = DefaultSatisfactionGraph();

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

  if (!chartData.dates.length) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
      <LineChart
        xAxis={[{
          data: chartData.dates,
          scaleType: 'time',
          valueFormatter: (date) => {
            return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
              .toLocaleDateString();
          },
        }]}
        yAxis={[{
          label: 'Satisfaction Rating',
          min: 0,
          max: 5,
        }]}

        series={chartData.series.map((series, index) => ({
          data: series.data,
          label: series.name,
          showMark: true,
          connectNulls: true,
          color: colors[index % colors.length], // Cycle through colors if more orgs than colors
          valueFormatter: (value) => value !== null ? value.toFixed(2) : undefined,
        }))}
        tooltip={{
          selector: true,
        }}
        legend={{ 
          hidden: false,
          position: 'top',
          padding: { top: 0, bottom: 20 }
        }}
        sx={{
          '.MuiLineElement-root': {
            strokeWidth: 2,
          },
        }}
      />
    </div>
  );
};

export default LineGraph;