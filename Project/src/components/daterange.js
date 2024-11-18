import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, Button, TextField } from '@mui/material';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc); // Enable UTC plugin

export default function DateRange({ dateRange, setDateRange }) {
  const [startDate, endDate] = dateRange;

  const handleStartDateChange = (newStartDate) => {
    const normalizedStartDate = dayjs.utc(newStartDate).startOf('day');
    setDateRange([normalizedStartDate, endDate]);
  };

  const handleEndDateChange = (newEndDate) => {
    const normalizedEndDate = dayjs.utc(newEndDate).endOf('day');
    setDateRange([startDate, normalizedEndDate]);
  };

  const handleClear = () => {
    setDateRange([null, null]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box 
        display="flex" 
        alignItems="center" 
        gap={2} 
        sx={{ width: '100%', flexWrap: 'wrap', mt: 2 }} // Add top margin to lower the entire box
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <DatePicker
            label="Start Date"
            value={startDate ? dayjs.utc(startDate) : null}
            onChange={handleStartDateChange}
            renderInput={(params) => (
              <TextField {...params} sx={{ flexGrow: 1, mb: 1 }} /> // Adjust margin below this TextField
            )}
          />
        </Box>
        <span>-</span>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          <DatePicker
            label="End Date"
            value={endDate ? dayjs.utc(endDate) : null}
            onChange={handleEndDateChange}
            renderInput={(params) => (
              <TextField {...params} sx={{ flexGrow: 1, mb: 1 }} /> // Adjust margin below this TextField
            )}
          />
        </Box>
        <Button variant="outlined" onClick={handleClear} sx={{ mt: 2 }}>
          Clear
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
