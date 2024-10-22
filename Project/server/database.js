//database.js used to fetch data from database

//Import required modules
const express = require('express');
//const router = express.Router();
const mssql = require('mssql');

//Database configuratino
const config = {
  user: 'azureuser',
  password: 'b4y3r83}9',
  server: 'bayer-mssql.database.windows.net',
  database: 'mySampleDatabase',
  options: {
    encrypt: true,
    trustServerCertificate: true,
  },
};

const fetchData = async () => {
  const pool = await mssql.connect(config);
  try {
    const result = await pool.request().query('SELECT * FROM SurveyResponses');
    return result.recordset.map((row, index) => ({
      id: index + 1,
      ...row,
      'Recorded Date': row['Recorded Date'] ? new Date(row['Recorded Date']).toISOString().split('T')[0] : null
    }));
  } finally {
    await pool.close();
  }
};

const fetchAllData = async () => {
  const pool = await mssql.connect(config);
  try {
    const result = await pool.request().query('SELECT * FROM SurveyResponses');
    return result.recordset.map((row, index) => ({
      id: index + 1,
      ...row,
      'Recorded Date': row['Recorded Date'] ? new Date(row['Recorded Date']).toISOString().split('T')[0] : null
    }));
  } finally {
    await pool.close();
  }
};

const fetchUploadedData = async (uploadId) => {
  const pool = await mssql.connect(config);
  try {
    const result = await pool.request()
      .input('uploadId', mssql.UniqueIdentifier, uploadId)
      .query('SELECT * FROM SurveyResponses WHERE UploadID = @uploadId');
    
    return result.recordset.map((row, index) => ({
      id: index + 1,
      ...row,
      'Recorded Date': row['Recorded Date'] ? new Date(row['Recorded Date']).toISOString().split('T')[0] : null
    }));
  } finally {
    await pool.close();
  }
};

module.exports = {
  //router,
  fetchData,
  fetchAllData,
  fetchUploadedData,
};