//upload.js used to upload data from excel sheet into database

//import required modules
const mssql = require('mssql');
const multer = require('multer');
const xlsx = require('xlsx');
const sanitizeHtml = require('sanitize-html');

//Database configuration
const config = {
  user: 'sa',
  password: 'password',
  server: 'SETH\\SQLEXPRESS',
  database: 'testDB',
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

//Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Function to handle file upload and data insertion into database
const uploadFile = async (req, res) => {
  try {
    //Read the uploaded Excel file
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    let data = xlsx.utils.sheet_to_json(sheet, { header: 1, dateNF: 'yyyy-mm-dd' });

    //Sanitize and format the data
    data = data.map(row => {
      const [recordedDate, responseId, satisfactionRating, csitOrg, directIndirect, comments] = row;
      const sanitizedComments = sanitizeHtml(comments, {
        allowedTags: [],
        allowedAttributes: {},
        allowedSchemes: [],
      });
      const validSatisfactionRating = satisfactionRating ? parseInt(satisfactionRating) : 0;
      
      //Parse the date from the Excel format
      const excelDate = recordedDate;
      const milliseconds = (excelDate - (25567 + 2)) * 86400 * 1000;
      const validRecordedDate = new Date(milliseconds);
      const isValidDate = !isNaN(validRecordedDate.getTime());
      
      //Format the date in the desired format
      const formattedRecordedDate = isValidDate ? validRecordedDate.toISOString().slice(0, 19).replace('T', ' ') : null;
      
      return [formattedRecordedDate, responseId, validSatisfactionRating, csitOrg, directIndirect, sanitizedComments];
    });

    console.log('Sanitized data:', data);

    const pool = await mssql.connect(config);

    //Create table if it doesn't exist
    const createTableQuery = `
      IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='Sheet1$' AND xtype='U')
      CREATE TABLE Sheet1$ (
        [Recorded Date] DATETIME,
        [Response Id] VARCHAR(50),
        [Satisfaction Rating] INT,
        [CSIT Org] VARCHAR(50),
        [Direct/Indirect] VARCHAR(50),
        [Comments] VARCHAR(MAX)
      );
    `;
    await pool.request().query(createTableQuery);

    //Truncate the table before inserting new data
    const truncateTableQuery = `
      TRUNCATE TABLE Sheet1$;
    `;
    await pool.request().query(truncateTableQuery);

    //Insert data into database
    const insertDataQuery = `
      INSERT INTO Sheet1$ ([Recorded Date], [Response Id], [Satisfaction Rating], [CSIT Org], [Direct/Indirect], [Comments])
      VALUES (@recordedDate, @responseId, @satisfactionRating, @csitOrg, @directIndirect, @comments);
    `;
    
    for (const row of data) {
      const [recordedDate, responseId, satisfactionRating, csitOrg, directIndirect, comments] = row;
      if (recordedDate !== null) {
        await pool.request()
          .input('recordedDate', mssql.DateTime, recordedDate)
          .input('responseId', mssql.VarChar, responseId)
          .input('satisfactionRating', mssql.Int, satisfactionRating)
          .input('csitOrg', mssql.VarChar, csitOrg)
          .input('directIndirect', mssql.VarChar, directIndirect)
          .input('comments', mssql.VarChar, comments)
          .query(insertDataQuery);
      }
    }

    console.log('Data uploaded successfully.');
  } catch (err) {
    console.error('Error:', err);
    res.status(500).send('Internal Server Error');
  } finally {
    await mssql.close();
  }
};

module.exports = {
  uploadFile,
  upload,
};