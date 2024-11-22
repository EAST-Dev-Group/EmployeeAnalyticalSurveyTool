// src/components/BarGraph.js
import React, { useRef } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { DefaultSatisfactionGraph } from '../utils/BarGraphConfig';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';

const BarGraph = () => {
  const chartData = DefaultSatisfactionGraph();
  const chartRef = useRef(null);

  console.log(chartData);

  const colors = [
    // Dutch Field color palette
    "#e60049", 
    "#0bb4ff", 
    "#50e991", 
    "#e6d800", 
    "#9b19f5", 
    "#ffa300", 
    "#dc0ab4", 
    "#b3d4ff", 
    "#00bfa0"
  ];

  // For downloading the graph as png
  const handleDownload = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'bar-graph.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  return (
    <div style={{
      width: '94%',
      backgroundColor: '#f5f5f5',
      borderRadius: '15px',
      border: '1px solid #e0e0e0',
      padding: '20px',
      marginTop: '20px',
      marginLeft: 'auto',
      marginRight: 'auto',
      boxSizing: 'border-box',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    }}>
      <div ref={chartRef} style={{
        width: '100%',
        height: 300,
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #e0e0e0',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
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
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
      >
        Download as PNG
      </Button>
      </div>
    </div>
  );
};
//Need to make this display each CSIT org.
//Can make a dataset for each and go from there
//https://mui.com/x/react-charts/bars/
export default BarGraph;