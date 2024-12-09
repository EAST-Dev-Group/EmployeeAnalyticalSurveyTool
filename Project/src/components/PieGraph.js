import React, { useState, useEffect, useRef } from 'react';
import { PieChart } from '@mui/x-charts/PieChart';
import { Typography, MenuItem, Select, FormControl, InputLabel, Button } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import axios from 'axios';
import html2canvas from 'html2canvas';

export const PieGraph = ({ data: inputData, orgColorMap }) => {
  const [data, setData] = useState([]);
  const [selectedOrg1, setSelectedOrg1] = useState('');
  const [selectedOrg2, setSelectedOrg2] = useState('');
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData2, setFilteredData2] = useState([]);
  const [gridData, setGridData] = useState([]); // Data for DataGrid
  const chartRef = useRef(null); // Ref for capturing the chart

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
    
    const organizations = data.map(item => item.label.split(' (')[0]).sort();
    const generatedColors = generateColorPalette(organizations);
    return generatedColors[orgName] || baseColors[index % baseColors.length];
  };

  const processData = (data) => {
    if (data && data.length > 0) {
      const validData = data.filter(item => 
        item["CSIT Org"] && 
        item["Satisfaction Rating"]
      );

      const orgMap = {};
      validData.forEach(item => {
        const org = item["CSIT Org"];
        const rating = parseFloat(item["Satisfaction Rating"]);

        if (!orgMap[org]) {
          orgMap[org] = [];
        }

        orgMap[org].push({ ...item, rating }); // Keep full item for grid data
      });

      const totalRatingsAcrossOrgs = validData.length;

      // Sort organizations alphabetically
      const sortedOrgs = Object.keys(orgMap).sort((a, b) => a.localeCompare(b));

      const processedData = sortedOrgs.map(org => ({
        label: `${org} (${((orgMap[org].length / totalRatingsAcrossOrgs) * 100).toFixed(2)}%)`,
        totalRatings: orgMap[org].length,
        ratings: orgMap[org],
      }));

      setData(processedData);
    }
  };

  useEffect(() => {
    if (inputData && inputData.length > 0) {
      processData(inputData);
    }
  }, [inputData]);

  useEffect(() => {
    if (selectedOrg1) {
      setFilteredData1(processRatings(data, selectedOrg1));
    } else {
      setFilteredData1([]);
    }

    if (selectedOrg2) {
      setFilteredData2(processRatings(data, selectedOrg2));
    } else {
      setFilteredData2([]);
    }
  }, [selectedOrg1, selectedOrg2, data]);

  const processRatings = (data, org) => {
    const orgData = data.find(item => item.label === org);
    if (!orgData || !orgData.ratings) return [];

    const totalRatings = orgData.ratings.length;
    const ratingsCount = orgData.ratings.reduce((acc, item) => {
      acc[item.rating] = (acc[item.rating] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(ratingsCount).map(([rating, count]) => ({
      label: `Rating ${rating} (${((count / totalRatings) * 100).toFixed(2)}%)`,
      value: count,
    }));
  };

  const handlePieClick = (params) => {
    const orgData = data.find(org => org.label === params.label);
    if (orgData) {
      setGridData(orgData.ratings); // Populate the DataGrid with this org's data
    }
  };

  // For downloading graph as png
  const handleDownload = async () => {
    if (chartRef.current) {
      const canvas = await html2canvas(chartRef.current);
      const link = document.createElement('a');
      link.download = 'pie-graph.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handleOrg1Change = (event) => {
    setSelectedOrg1(event.target.value);
  };

  const handleOrg2Change = (event) => {
    setSelectedOrg2(event.target.value);
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
        height: 510,
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #e0e0e0',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        <Box display="flex" flexDirection="row" alignItems="center">
          <Box flexGrow={1}>
            <Typography># of Ratings from Each CSIT Org:</Typography>
            <PieChart
              series={[
                {
                  data: data.map((item, index) => ({
                    label: item.label,
                    value: item.totalRatings,
                    color: getOrgColor(item.label.split(' (')[0], index)
                  })),
                  labelPosition: 'outside',
                  onClick: handlePieClick,
                },
              ]}
              width={1100}
              height={450}
            />
          </Box>
        </Box>
      </div>
      <div style={{
        marginTop: '20px', // Adds space between the chart and the button
        textAlign: 'right', // Aligns the button to the right
      }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleDownload}
        >
          Download as PNG
        </Button>
      </div>

      {/* Comparison Section */}
      <Box mt={4}>
        <Typography variant="h5">Compare Organizations</Typography>
        <Box display="flex" flexDirection="row" justifyContent="space-between" mt={2}>
          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel>Organization 1</InputLabel>
            <Select value={selectedOrg1} onChange={handleOrg1Change} label="Organization 1">
              {data.map((org, index) => (
                <MenuItem key={index} value={org.label}>
                  {org.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl variant="outlined" style={{ minWidth: 200 }}>
            <InputLabel>Organization 2</InputLabel>
            <Select value={selectedOrg2} onChange={handleOrg2Change} label="Organization 2">
              {data.map((org, index) => (
                <MenuItem key={index} value={org.label}>
                  {org.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box display="flex" flexDirection="row" justifyContent="space-evenly" mt={4}>
          {selectedOrg1 && (
            <Box>
              <Typography variant="h6">{`Ratings Breakdown for ${selectedOrg1}`}</Typography>
              <PieChart
                colors={baseColors}
                series={[
                  {
                    data: filteredData1,
                    labelPosition: 'outside',
                  },
                ]}
                width={600}
                height={300}
              />
            </Box>
          )}

          {selectedOrg2 && (
            <Box>
              <Typography variant="h6">{`Ratings Breakdown for ${selectedOrg2}`}</Typography>
              <PieChart
                colors={baseColors}
                series={[
                  {
                    data: filteredData2,
                    labelPosition: 'outside',
                  },
                ]}
                width={600}
                height={300}
              />
            </Box>
          )}
        </Box>
      </Box>
    </div>
  );
};