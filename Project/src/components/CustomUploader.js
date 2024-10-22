import React, { useState, useRef } from 'react';
import axios from 'axios';
import './CustomUploader.css';

const CustomUploader = ({ onUpload }) => {
  const [files, setFiles] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploadStatus, setUploadStatus] = useState({});
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (newFiles) => {
    setFiles(prevFiles => [...prevFiles, ...Array.from(newFiles)]);
  };

  const onButtonClick = (e) => {
    e.stopPropagation();
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    // Set all files to 'uploading' state
    setUploadStatus(prevStatus => {
      const newStatus = { ...prevStatus };
      files.forEach((file) => {
        newStatus[file.name] = { status: 'uploading', progress: 0 };
      });
      return newStatus;
    });

    try {
      const response = await axios.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadStatus(prevStatus => {
            const newStatus = { ...prevStatus };
            files.forEach((file) => {
              newStatus[file.name] = {
                status: 'uploading',
                progress: percentCompleted
              };
            });
            return newStatus;
          });
        }
      });

      if (response.status === 200) {
        console.log('Files uploaded successfully');
        console.log('Response data:', response.data);

        // Set all files to 'completed' state
        setUploadStatus(prevStatus => {
          const newStatus = { ...prevStatus };
          files.forEach((file) => {
            newStatus[file.name] = { status: 'completed', progress: 100 };
          });
          return newStatus;
        });

        if (onUpload) {
          onUpload(response.data);
        }
      }
    } catch (error) {
      console.error('Error uploading files:', error);

      // Set all files to 'error' state
      setUploadStatus(prevStatus => {
        const newStatus = { ...prevStatus };
        files.forEach((file) => {
          newStatus[file.name] = { status: 'error', progress: 0 };
        });
        return newStatus;
      });
    }
  };

  const removeFile = (fileToRemove) => {
    setFiles(files.filter(file => file !== fileToRemove));
    setUploadStatus(prevStatus => {
      const newStatus = { ...prevStatus };
      delete newStatus[fileToRemove.name];
      return newStatus;
    });
  };

  const handleClear = () => {
    setFiles([]);
    setUploadStatus({});
  };

  return (
    <div className="custom-uploader">
      <div className="uploader-content">
        <div 
          className={`drop-zone ${dragActive ? "drag-active" : ""}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current.click()}
        >
          <input 
            ref={fileInputRef}
            type="file" 
            multiple
            onChange={handleChange}
            accept=".xlsx,.xls"
            style={{display: 'none'}}
          />
          <p>Drag & Drop files here or</p>
          <button className="browse-button" onClick={onButtonClick}>Browse File</button>
        </div>
        {files.length > 0 && (
          <div className="file-list">
            {files.map((file, index) => (
              <div 
                key={index} 
                className={`file-item ${index === 0 ? 'first-file' : ''} ${index === files.length - 1 ? 'last-file' : ''} ${files.length === 1 ? 'single-file' : ''}`}
              >
                <span>{file.name}</span>
                {uploadStatus[file.name]?.status === 'completed' ? (
                  <i className="bi bi-check-circle" style={{ color: 'green' }}></i>
                ) : uploadStatus[file.name]?.status === 'uploading' ? (
                  <div className="loading-spinner"></div>
                ) : (
                  <button className="remove-file" onClick={() => removeFile(file)}>
                    <i className="bi bi-x-circle"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
        {files.length > 0 && (
          <div className="upload-button-container">
            <button className="clear-button" onClick={handleClear}>Clear</button>
            <button className="upload-button" onClick={handleUpload}>
              <i className="bi bi-upload"></i>Upload
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomUploader;
