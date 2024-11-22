import React, { useState, useEffect } from 'react';
import { LineChart } from '@mui/x-charts/LineChart';
import { DefaultSatisfactionGraph, timeFrameOptions, processSelectedOrgs } from '../utils/LineGraphConfig';
import { 
  Stack, 
  TextField, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  Select, 
  Checkbox, 
  ListItemText,
  Divider 
} from '@mui/material';

const LineGraph = ({ data, orgColorMap: existingColorMap, onColorMapUpdate }) => {

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

  const [timeFrame, setTimeFrame] = useState('daily');
  const [customDays, setCustomDays] = useState('');
  // Pass data to DefaultSatisfactionGraph
  const chartData = DefaultSatisfactionGraph(timeFrame, customDays, data);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [localOrgColorMap, setLocalOrgColorMap] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const filteredChartData = processSelectedOrgs(chartData, selectedOrgs);

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

  // Create and maintain color mapping
  useEffect(() => {
    if (chartData.organizations && chartData.organizations.length > 0) {
      const sortedOrgs = [...chartData.organizations].sort((a, b) => a.localeCompare(b));
      const newColorMap = {};
      sortedOrgs.forEach((org) => {
        // Use existing color if available, otherwise assign new color
        if (!existingColorMap[org] && !localOrgColorMap[org]) {
          const generatedColors = generateColorPalette(sortedOrgs);
          newColorMap[org] = generatedColors[org];
        }
      });

      // Only update if we have new organizations
      if (Object.keys(newColorMap).length > 0) {
        setLocalOrgColorMap(prev => ({...prev, ...newColorMap}));
        onColorMapUpdate(newColorMap);
      }
    }
  }, [chartData.organizations, existingColorMap]);

  // Use combined color maps for rendering
  const combinedColorMap = {...existingColorMap, ...localOrgColorMap};

  // Select all orgs by default only on initial load
  useEffect(() => {
    if (isInitialLoad && chartData.organizations && chartData.organizations.length > 0) {
      setSelectedOrgs(chartData.organizations);
      setIsInitialLoad(false);
    }
  }, [chartData.organizations, isInitialLoad]);

  // Handle org selection/deselection
  const handleOrgChange = (event) => {
    const value = event.target.value;
    if (value.includes('select-all')) {
      if (selectedOrgs.length === chartData.organizations.length) {
        setSelectedOrgs([]);
      } else {
        setSelectedOrgs([...chartData.organizations]);
      }
    } else {
      setSelectedOrgs(value);
    }
  };

  return (
    //Gray box
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
      <Stack direction="row" spacing={2} sx={{ marginBottom: '20px' }}>
        {/* Time frame selection dropdown */}
        <TextField
          select
          label="Sort by Time"
          value={timeFrame}
          onChange={(e) => setTimeFrame(e.target.value)}
          sx={{ minWidth: 200, backgroundColor: 'white'}}
        >
          {timeFrameOptions.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        {/* Custom days input field - only shown when custom timeframe selected */}
        {timeFrame === 'custom' && (
          <TextField
            label="Number of Days"
            type="number"
            value={customDays}
            onChange={(e) => setCustomDays(e.target.value)}
            sx={{ width: 150, backgroundColor: 'white'}}
          />
        )}
        {/* Organization selection dropdown with "Select All" option */}
        <FormControl sx={{ 
          width: 200, 
          backgroundColor: 'white' 
        }}>
          <InputLabel>Select Organizations</InputLabel>
          <Select
            multiple
            value={selectedOrgs}
            onChange={handleOrgChange}
            renderValue={(selected) => {
              if (selected.length === chartData.organizations.length) {
                return "All Organizations";
              }
              return selected.length > 1 
                ? `${selected.length} Organizations Selected`
                : selected.join(', ');
            }}
            label="Select Organizations"
            sx={{
              '& .MuiSelect-select': {
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  width: 200
                }
              }
            }}
          >
            <MenuItem 
              value="select-all" 
              sx={{ borderBottom: '1px solid #e0e0e0' }}
            >
              <Checkbox 
                checked={selectedOrgs.length === chartData.organizations.length}
                indeterminate={selectedOrgs.length > 0 && selectedOrgs.length < chartData.organizations.length}
              />
              <ListItemText primary="Select All" />
            </MenuItem>
            <Divider />
            {chartData.organizations.sort((a, b) => a.localeCompare(b)).map((org) => (
              <MenuItem key={org} value={org}>
                <Checkbox checked={selectedOrgs.includes(org)} />
                <ListItemText primary={org} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      
      {/*White box*/}
      <div style={{ 
        width: '100%', 
        height: 450,
        backgroundColor: 'white',
        borderRadius: '10px',
        border: '1px solid #e0e0e0',
        padding: '20px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
        boxSizing: 'border-box',
        overflow: 'hidden',
      }}>
        <LineChart
          margin={{ left: 50, top: 20, bottom: 80 }}
          xAxis={[{
            data: filteredChartData.dates,
            scaleType: 'time',
            valueFormatter: (date) => {
              return new Date(date.getTime() + date.getTimezoneOffset() * 60000)
                .toLocaleDateString();
            },
            tickLabelStyle: {
              angle: 0,
              textAnchor: 'middle',
            },
          }]}
          yAxis={[{
            label: 'Satisfaction Rating',
            min: 0,
            max: 5,
          }]}
          series={filteredChartData.series.map((series) => ({
            data: series.data,
            label: series.name,
            showMark: true,
            connectNulls: true,
            color: combinedColorMap[series.name],
            valueFormatter: (value) => value !== null ? value.toFixed(2) : undefined,
          }))}
          tooltip={{
            selector: true,
          }}
          slotProps={{
            legend: {
              direction: 'row',
              position: { vertical: 'bottom', horizontal: 'middle' },
              padding: { top: 30, bottom: 0, left: 0, right: 0 },
            },
          }}
          sx={{
            '.MuiLineElement-root': {
              strokeWidth: 2,
            },
          }}
        />
      </div>
    </div>
  );
};

export default LineGraph;