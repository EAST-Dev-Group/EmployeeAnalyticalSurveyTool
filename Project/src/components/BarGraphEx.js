import React, { useEffect, useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from '@mui/x-charts';

//Look here for Filter Data Grid Func.
function BarGraphEx({ data }) {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (data && data.length > 0) {
      // Process data for Bar Chart
      // Group by Satisfaction Rating
      const satisfactionCounts = data.reduce((acc, row) => {
        const rating = row['Satisfaction Rating'];
        acc[rating] = (acc[rating] || 0) + 1;
        return acc;
      }, {});

      // Convert to array format for chart
      const processedData = Object.entries(satisfactionCounts)
        .map(([rating, count]) => ({
          rating: Number(rating),
          count: count
        }))
        .sort((a, b) => a.rating - b.rating);  // Sort by rating

      setChartData(processedData);
    }
  }, [data]);
//Look here for Filter Data Grid Func.

  return (
    <div style={{ width: '100%', height: 400, marginTop: '20px' }}>
      {chartData.length > 0 && (
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <XAxis 
            dataKey="rating" 
            label={{ value: 'Satisfaction Rating', position: 'bottom' }}
          />
          <YAxis 
            label={{ value: 'Number of Responses', angle: -90, position: 'insideLeft' }}
          />
          <Tooltip />
          <Legend />
          <Bar 
            dataKey="count" 
            fill="#8884d8" 
            name="Number of Responses"
          />
        </BarChart>
      )}
    </div>
  );
}

export default BarGraphEx;