Project Name: Employee Analytical Survey Tool
Group Name: Excel Crusaders
Group Members: Taitt Estes, Jacob Danner, Seth Aldrich, Yousef Mahmood
Project Start Date: 2/12/24
Project Finish Date: TBD

How to start node server: 
1. install node from node.js website
   go through the install wizard

2. open up project in vscode
   make sure config in database.js and upload.js are set to this:
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

3. type npm install in vs code terminal
4. type node home.js in vs code terminal
5. go to localhost:8080 in browser
6. choose the excel file and hit upload
7. hit the upload button, you will see a status update in the vs code terminal (estimated 10s)
