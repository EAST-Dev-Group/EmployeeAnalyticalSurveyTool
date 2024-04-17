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


//API route for fetching data from the database
router.get('/data', async (req, res) => {
  try {
    const pool = await mssql.connect(config);
    const result = await pool.request().query('SELECT * FROM Sheet1$');
    res.json(result.recordset);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

//Function to fetch data from the database
const fetchData = async () => {
  const pool = await mssql.connect(config);
  const result = await pool.request().query('SELECT * FROM Sheet1$');
  return result.recordset;
};

module.exports = {
  router,
  fetchData,
};