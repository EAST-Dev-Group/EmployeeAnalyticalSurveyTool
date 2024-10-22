//server.js used to start the web server

//Import required modules
const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const { fetchData, fetchUploadedData, fetchAllData} = require('./database');
const { uploadFile, upload } = require('./upload');

//Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, '../build')));

app.get('/api/data', async (req, res) => {
  try {
    const data = await fetchData();
    res.json(data);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/allData', async (req, res) => {
  try {
    const allData = await fetchAllData();
    res.json(allData);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/api/uploadedData/:uploadId', async (req, res) => {
  try {
    const uploadedData = await fetchUploadedData(req.params.uploadId);
    res.json(uploadedData);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/upload', (req, res) => {
  upload(req, res, async function(err) {
    if (err instanceof multer.MulterError) {
      console.error('Multer error:', err);
      return res.status(500).json({ error: err.message });
    } else if (err) {
      console.error('Unknown error:', err);
      return res.status(500).json({ error: 'An unknown error occurred' });
    }

    try {
      const { uploadId, data } = await uploadFile(req, res);
      res.json({ uploadId, data });
    } catch (err) {
      console.error('Error:', err);
      res.status(500).send('Internal Server Error');
    }
  });
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

//Start the server and listen on the specified port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});