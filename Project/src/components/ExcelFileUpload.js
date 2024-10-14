import React, { useState, useCallback } from 'react';

const ExcelFileUpload = ({ onFileUpload }) => {
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFile = (selectedFile) => {
    if (selectedFile) {
      const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
      if (['xlsx', 'xls', 'csv'].includes(fileExtension)) {
        setFile(selectedFile);
        if (onFileUpload) {
          onFileUpload(selectedFile);
        }
      } else {
        alert('Please upload only Excel files (.xlsx, .xls) or CSV files.');
      }
    }
  };

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div
      style={{
        border: `2px dashed ${dragActive ? '#000' : '#ccc'}`,
        borderRadius: '4px',
        padding: '20px',
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backgroundColor: dragActive ? '#f0f0f0' : 'white',
      }}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <input
        type="file"
        accept=".xlsx,.xls,.csv"
        onChange={handleChange}
        style={{ display: 'none' }}
        id="file-upload"
      />
      <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
        <p>Drag and drop an Excel file here, or click to select a file</p>
      </label>
      {file && (
        <p>Selected file: {file.name}</p>
      )}
    </div>
  );
};

export default ExcelFileUpload;