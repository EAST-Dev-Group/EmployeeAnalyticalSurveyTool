// src/components/BarGraph.js
import React, { useRef } from 'react';
import { BarChart } from '@mui/x-charts/BarChart';
import { DefaultSatisfactionGraph } from '../utils/BarGraphConfig';
import html2canvas from 'html2canvas';
import { Button } from '@mui/material';

export const BarGraph = ({ data, orgColorMap }) => {
  const chartData = DefaultSatisfactionGraph(data);
  const chartRef = useRef(null);

  console.log(chartData);

  const baseColors = [
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

  // Function to shift color
  const shiftColor = (hex, offset) => {
    // Convert hex to RGB
    const r = parseInt(hex.slice(1,3), 16);
    const g = parseInt(hex.slice(3,5), 16);
    const b = parseInt(hex.slice(5,7), 16);
    
    // Apply offset to RGB values cyclically
    const shift = (value, offset) => {
        // Use modulo to cycle through values
        let newVal = (value + offset) % 256;
        // If value goes negative, wrap around to positive
        if (newVal < 0) newVal += 256;
        return newVal;
    };

    // Shift differently for each component to create color variation
    const rr = shift(r, offset).toString(16).padStart(2, '0');
    const gg = shift(g, offset * 2).toString(16).padStart(2, '0');  // Double shift for green
    const bb = shift(b, offset * 3).toString(16).padStart(2, '0');  // Triple shift for blue
    
    return `#${rr}${gg}${bb}`;
  };

  // Function to generate color palette based on number of organizations
  const generateColorPalette = (organizations) => {
    const colorMap = {};
    let offset = 0;
    const offsetStep = 25; // Adjust this value to control how much colors shift
    
    organizations.forEach((org, index) => {
        if (index < baseColors.length) {
            // Use base colors first
            colorMap[org] = baseColors[index];
        } else {
            // Generate shifted colors when we run out of base colors
            const baseColorIndex = index % baseColors.length;
            offset = Math.floor(index / baseColors.length) * offsetStep;
            colorMap[org] = shiftColor(baseColors[baseColorIndex], offset);
        }
    });
    
    return colorMap;
  };

  // Get color for organization
  const getOrgColor = (orgName, index) => {
    if (orgColorMap && orgColorMap[orgName]) {
      return orgColorMap[orgName];
    }
    
    const organizations = chartData.series.map(s => s.name).sort();
    const generatedColors = generateColorPalette(organizations);
    return generatedColors[orgName] || baseColors[index % baseColors.length];
  };

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
            color: getOrgColor(series.name, index),
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