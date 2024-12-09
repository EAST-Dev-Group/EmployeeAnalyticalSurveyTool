import React, { useRef } from 'react';
import html2canvas from 'html2canvas';
import { Paper, Button } from '@mui/material';

const GraphWrapper = ({ children, title }) => {
  const graphRef = useRef();

  const handleDownload = async () => {
    if (graphRef.current) {
      const canvas = await html2canvas(graphRef.current);
      const link = document.createElement('a');
      link.download = `${title || 'graph'}.png`;
      link.href = canvas.toDataURL();
      link.click();
    }
  };

  return (
    <Paper variant="outlined" style={{ margin: '20px', padding: '20px', textAlign: 'center' , backgroundColor: '#f5f5f5'}}>
      <div ref={graphRef} style={{ border: '1px solid #ddd', padding: '10px' }}>
        {children}
      </div>
      <Button
        variant="contained"
        color="primary"
        onClick={handleDownload}
        style={{ marginTop: '10px' , textTransform: 'none' }}
      >
        Download as PNG
      </Button>
    </Paper>
  );
};

export default GraphWrapper;
