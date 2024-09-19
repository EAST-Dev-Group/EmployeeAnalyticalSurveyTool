//home.js used to start the web server

//Import required modules
const express = require('express');
const app = express();
const path = require('path');
const { router, fetchUploadedData } = require('./database');
const { uploadFile, upload } = require('./upload');

//Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));
//Use router for handling API routes
app.use('/api', router);

//Route for serving the 'output.html' file
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'output.html'));
});

//Route for handling file upload
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    //Upload file and insert data into database
    const uploadId = await uploadFile(req, res);

    //Fetch the updated data from the database
    const uploadedData = await fetchUploadedData(uploadId);

    //Send the updated data as a JSON response
    res.json(uploadedData);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  }
});

//Start the server and listen on the specified port
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});