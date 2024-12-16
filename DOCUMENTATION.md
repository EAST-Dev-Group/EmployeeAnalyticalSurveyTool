For this project, the main directories for .js files are going to be:

Project/server
Project/src/components
Project/src/utils

whereas the main .js file to route the functions to is going to be: App.js.

App.js is the main .js file that builds the website using the React Library.

If you need to install the npm libraries and build the project read README.md for more details.

---

Project/server has the following files that accomplish the following tasks:

database.js: Establishes a connection to the Microsoft SQL server. This is where the config is if you wish to change the config to your own database server.

server.js: Starts the web server. This is where you can change the port configuration.

upload.js: Responsible for uploading the sheet into the database. This also has a config for the server database that follows the same format as database.js.

---

Project/src/components are different web components built using the React and MUI Javascript Libraries:

BarGraph.js, LineGraph.js, and PieGraph.js are all different graphing functions provided by MUI that takes processed data from the database server and outputs it visually to the webpage.

CustomUploader.js provides the functions needed to achieve uploading files.

DataDisplay.js outputs the database queries to the webpage in a column x row categorical format.

daterange.js is necessary for gauging ranges in between dates for other .js files.

GraphWrapper.js allows the user to download visual graphs provided by BarGraph.js, LineGraph.js, and PieGraph.js as pngs.

Header.js controls the Header of the webpage and can be adjusted or customized accordingly.

---

Project/src/utils is mainly a directory that provides functions that process the datamap for BarGraph.js, LineGraph.js, and PieGraph.js to properly output the visualization to the webpage.

Look into BarGraphConfig.js, LineGraphConfig.js, or PieGraphConfig.js for more details.

---

Key Notes:

- If you wish to make your own components or utilities you can declare a new function in any of the Graph files if you wish to make a Graph using the data. Alternatively, new .js files can be created for components and utilities.

- This Project was designed to follow this excel format with the following data headers:

Recorded Date, Response Id, Satisfaction Rating, CSIT Org, Direct/Indirect, Comments

Example being: 1/1/2023 9:35, Xa4TbD9eYp1sR3wF, 5, Product Platforms, Indirect, "There's a lack of clear communication from management, which often leads to confusion and frustration."

If changes are made to this data header format they made need reflected in the code or else components and querying from the database will not work as intended.
