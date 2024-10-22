//upload.js used to upload data from excel sheet into database

//import required modules
const mssql = require('mssql');
const multer = require('multer');
const xlsx = require('xlsx');
const sanitizeHtml = require('sanitize-html');
const { v4: uuidv4 } = require('uuid');

//Database configuration
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

//Configure multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage: storage }).array('files', 10);  // Allow up to 10 files

//Function to handle file upload and data insertion into database
const uploadFile = async (req, res) => {
  try {
    const uploadedData = [];
    const uploadId = uuidv4(); //Generate a single UUID for all files in this upload
    
    for (const file of req.files) {
      //Read the uploaded Excel file
      const workbook = xlsx.read(file.buffer, { type: 'buffer' });
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
        IF NOT EXISTS (SELECT * FROM sysobjects WHERE name='SurveyResponses' AND xtype='U')
        CREATE TABLE SurveyResponses (
          [Response Id] VARCHAR(50) PRIMARY KEY,
          [Recorded Date] DATETIME,
          [Satisfaction Rating] INT,
          [CSIT Org] VARCHAR(50),
          [Direct/Indirect] VARCHAR(50),
          [Comments] VARCHAR(MAX),
          [UploadedAt] DATETIME DEFAULT GETDATE(),
          [LastUpdatedAt] DATETIME DEFAULT GETDATE(),
          [UploadID] UNIQUEIDENTIFIER,
        );
      `;
      await pool.request().query(createTableQuery);

      // Prepare the insert/update query
      const upsertDataQuery = `
      MERGE INTO SurveyResponses AS target
      USING (VALUES (@responseId, @recordedDate, @satisfactionRating, @csitOrg, @directIndirect, @comments, @uploadId))
        AS source ([Response Id], [Recorded Date], [Satisfaction Rating], [CSIT Org], [Direct/Indirect], [Comments], UploadID)
      ON target.[Response Id] = source.[Response Id]
      WHEN MATCHED THEN
        UPDATE SET
          [Recorded Date] = source.[Recorded Date],
          [Satisfaction Rating] = source.[Satisfaction Rating],
          [CSIT Org] = source.[CSIT Org],
          [Direct/Indirect] = source.[Direct/Indirect],
          [Comments] = source.[Comments],
          [UploadID] = source.UploadID,
          [LastUpdatedAt] = GETDATE()
      WHEN NOT MATCHED THEN
        INSERT ([Response Id], [Recorded Date], [Satisfaction Rating], [CSIT Org], [Direct/Indirect], [Comments], UploadID)
        VALUES (source.[Response Id], source.[Recorded Date], source.[Satisfaction Rating], source.[CSIT Org], source.[Direct/Indirect], source.[Comments], source.UploadID);
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
            .input('uploadId', mssql.UniqueIdentifier, uploadId)
            .query(upsertDataQuery);

          uploadedData.push({
            'Response Id': responseId,
            'Recorded Date': recordedDate,
            'Satisfaction Rating': satisfactionRating,
            'CSIT Org': csitOrg,
            'Direct/Indirect': directIndirect,
            'Comments': comments
          });
        }
      }
    }

    console.log('Data uploaded successfully.');
    return { uploadId, data: uploadedData };
  } catch (err) {
    console.error('Error:', err);
    throw err;
  } finally {
    await mssql.close();
  }
};

module.exports = {
  uploadFile,
  upload,
};