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

const LineGraph = () => {

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

  const [timeFrame, setTimeFrame] = useState('daily');
  const [customDays, setCustomDays] = useState('');
  const chartData = DefaultSatisfactionGraph(timeFrame, customDays);
  const [selectedOrgs, setSelectedOrgs] = useState([]);
  const [orgColorMap, setOrgColorMap] = useState({});
  const [isInitialLoad, setIsInitialLoad] = useState(true);  // Add this state
  const filteredChartData = processSelectedOrgs(chartData, selectedOrgs);

  // Create and maintain color mapping
  useEffect(() => {
    if (chartData.organizations && chartData.organizations.length > 0 && Object.keys(orgColorMap).length === 0) {
      const newColorMap = {};
      chartData.organizations.forEach((org, index) => {
        // Cycle through colors if more orgs than colors 
        // (Will be changed with coloring algorithm)
        newColorMap[org] = colors[index % colors.length];
      });
      setOrgColorMap(newColorMap);
    }
  }, [chartData.organizations]);

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
    //Grey box
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
            {chartData.organizations.map((org) => (
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
            color: orgColorMap[series.name],
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