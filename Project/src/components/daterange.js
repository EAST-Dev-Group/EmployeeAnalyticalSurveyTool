// daterange.js
import * as React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Box, TextField, Button } from '@mui/material';

export default function DateRange({ dateRange, setDateRange }) {
  const [startDate, endDate] = dateRange;

  const handleStartDateChange = (newStartDate) => {
    setDateRange([newStartDate, endDate]);
  };

  const handleEndDateChange = (newEndDate) => {
    setDateRange([startDate, newEndDate]);
  };

  const handleClear = () => {
    setDateRange([null, null]);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box display="flex" alignItems="center" gap={2}>
        <DatePicker
          label="Check-in"
          value={startDate}
          onChange={handleStartDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <span>-</span>
        <DatePicker
          label="Check-out"
          value={endDate}
          onChange={handleEndDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <Button variant="outlined" onClick={handleClear}>
          Clear
        </Button>
      </Box>
    </LocalizationProvider>
  );
}
