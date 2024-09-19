//database.js used to fetch data from database

//Import required modules
const express = require('express');
const router = express.Router();
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


//API route for fetching all data from the database
router.get('/data', async (req, res) => {
  try {
    const pool = await mssql.connect(config);
    const result = await pool.request().query('SELECT * FROM SurveyResponses');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  } finally {
    await mssql.close();
  }
});

// Function to fetch all data from the database
const fetchAllData = async () => {
  const pool = await mssql.connect(config);
  try {
    const result = await pool.request().query('SELECT * FROM SurveyResponses');
    return result.recordset;
  } finally {
    await pool.close();
  }
};

// Function to fetch data for a specific upload
const fetchUploadedData = async (uploadId) => {
  const pool = await mssql.connect(config);
  try {
    const result = await pool.request()
      .input('uploadId', mssql.UniqueIdentifier, uploadId)
      .query('SELECT * FROM SurveyResponses WHERE UploadID = @uploadId');
    return result.recordset;
  } finally {
    await pool.close();
  }
};

module.exports = {
  router,
  fetchAllData,
  fetchUploadedData,
};