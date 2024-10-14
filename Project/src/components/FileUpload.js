import React, { useState } from 'react';
import axios from 'axios';

function FileUpload({ onUploadSuccess }) {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      alert('Please select a file to upload.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('/upload', formData);
      alert('File uploaded successfully.');
      if (onUploadSuccess) {
        onUploadSuccess();
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while uploading the file.');
    }
  };

  return (
    <div className="upload-container">
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label htmlFor="fileInput" className="custom-file-upload">
        Choose File
      </label>
      <span id="fileNameDisplay">{file ? file.name : ''}</span>
      <button onClick={handleUpload} className="upload-button">
        Upload
      </button>
    </div>
  );
}

export default FileUpload;