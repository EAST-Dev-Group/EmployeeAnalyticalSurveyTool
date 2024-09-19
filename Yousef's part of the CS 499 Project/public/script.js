// Function to fetch data (ensure this is correctly populating currentData)
function fetchData() {
    fetch('/api/data') // Example API endpoint
        .then(response => response.json())
        .then(data => {
            currentData = data; // Store the data in currentData for later use
            displayData(currentData); // Display the data initially
        })
        .catch(error => console.error('Error:', error));
}

// Call fetchData to load data initially
fetchData();


//Display data in table
let currentData = [];
function displayData(data) {
    currentData = data; 
    const tableBody = document.getElementById('dataBody');
    tableBody.innerHTML = '';
    data.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="line-number">${index + 1}</td>
          <td>${new Date(row['Recorded Date']).toLocaleString()}</td>
          <td>${row['Response Id']}</td>
          <td>${row['Satisfaction Rating']}</td>
          <td>${row['CSIT Org']}</td>
          <td>${row['Direct/Indirect']}</td>
          <td class="comment-cell">
            <pre class="comment-content">${escapeHtml(row['Comments'])}</pre>
            <span class="expand-button" onclick="toggleComment(this, event)">
                <i class="bi bi-plus-circle"></i>
            </span>
          </td>
        `;
        tableBody.appendChild(tr);
    });
}

// Sort by Recorded Date
function sortData() {
    const sortOrder = document.getElementById('sortRecordedDate').value;
    if (sortOrder) {
        currentData.sort((a, b) => {
            const dateA = new Date(a['Recorded Date']);
            const dateB = new Date(b['Recorded Date']);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
        displayData(currentData);
    }
}
document.getElementById('confirmSort').addEventListener('click', sortData);

function escapeHtml(unsafe) {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

//Expand comments section
function toggleComment(button, event) {
    event.preventDefault();
    const commentPre = button.previousElementSibling;
    if (commentPre.classList.contains('comment-expanded')) {
        commentPre.classList.remove('comment-expanded');
        button.innerHTML = '<i class="bi bi-plus-circle"></i>';
    } else {
        commentPre.classList.add('comment-expanded');
        button.innerHTML = '<i class="bi bi-dash-circle"></i>';
    }
}

function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file to upload.');
        return;
    }

    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        displayData(data);
        alert('File uploaded successfully.');
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while uploading the file.');
    });
}

// Resizable window
const resizable = document.querySelector('.resizable');
const dataWindow = resizable.querySelector('.data-window');
const resizers = resizable.querySelectorAll('.resizer');

let isResizing = false;
let currentResizer;

for (let resizer of resizers) {
    resizer.addEventListener('mousedown', initResize);
}

function initResize(e) {
    e.preventDefault();
    isResizing = true;
    currentResizer = e.target;
    
    window.addEventListener('mousemove', resize);
    window.addEventListener('mouseup', stopResize);
}

function resize(e) {
    if (!isResizing) return;

    const rect = resizable.getBoundingClientRect();

    if (currentResizer.classList.contains('resizer-r') || currentResizer.classList.contains('resizer-rb')) {
        const width = e.clientX - rect.left;
        resizable.style.width = `${width}px`;
    }
    
    if (currentResizer.classList.contains('resizer-b') || currentResizer.classList.contains('resizer-rb')) {
        const height = e.clientY - rect.top;
        resizable.style.height = `${height}px`;
    }
}

function stopResize() {
    isResizing = false;
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResize);
}
fetchData();

// File Selection Name Display
function fileSelection() {
    const fileInput = document.getElementById('fileInput');
    const fileNameDisplay = document.getElementById('fileNameDisplay');
    
    fileInput.addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : '';
        fileNameDisplay.textContent = fileName;
    });
}
fileSelection();

// Search Algorithm
function searchTable() {
    var input, filter, table, tr, td, i, txtValue;
    input = document.getElementById("searchInput");
    filter = input.value.toUpperCase();
    table = document.getElementById("dataTable");
    tr = table.getElementsByTagName("tr");

    for (i = 0; i < tr.length; i++) {
        td = tr[i].getElementsByTagName("td");
        for (var j = 0; j < td.length; j++) {
            if (td[j]) {
                txtValue = td[j].textContent || td[j].innerText;
                if (txtValue.toUpperCase().indexOf(filter) > -1) {
                    tr[i].style.display = "";
                    break;
                } else {
                    tr[i].style.display = "none";
                }
            }
        }
    }
}

// Function to reset and display all data
function clearFilters() {
    // Reset the table to display all original unfiltered data
    displayData(currentData); // Redisplay all data (original unfiltered data)

    // Reset the dropdown selections
    document.getElementById('sortOrder').selectedIndex = 0; // Reset sort dropdown
    document.getElementById('sortDateRange').selectedIndex = 0; // Reset date range dropdown
}

// Event listener for the Clear button
document.getElementById('clearFilters').addEventListener('click', clearFilters);

function displayData(data) {
    const tableBody = document.getElementById('dataBody');
    tableBody.innerHTML = ''; // Clear previous data before displaying new data

    let totalRating = 0;
    let ratingCount = 0;

    // Object to store CSIT org ratings
    let csitOrgRatings = {};

    // Iterate over data to build table rows
    data.forEach((row, index) => {
        const rating = parseFloat(row['Satisfaction Rating']);
        const csitOrg = row['CSIT Org'];

        if (!isNaN(rating)) {
            totalRating += rating;
            ratingCount++;

            // Calculate ratings for each CSIT org
            if (!csitOrgRatings[csitOrg]) {
                csitOrgRatings[csitOrg] = { total: 0, count: 0 };
            }
            csitOrgRatings[csitOrg].total += rating;
            csitOrgRatings[csitOrg].count++;
        }

        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td class="line-number">${index + 1}</td>
          <td>${new Date(row['Recorded Date']).toLocaleString()}</td>
          <td>${row['Response Id']}</td>
          <td>${row['Satisfaction Rating']}</td>
          <td>${row['CSIT Org']}</td>
          <td>${row['Direct/Indirect']}</td>
          <td class="comment-cell">
            <pre class="comment-content">${escapeHtml(row['Comments'])}</pre>
            <span class="expand-button" onclick="toggleComment(this, event)">
                <i class="bi bi-plus-circle"></i>
            </span>
          </td>
        `;
        tableBody.appendChild(tr);
    });

    // Calculate and display the overall average rating
    const overallAverageRating = ratingCount > 0 ? (totalRating / ratingCount).toFixed(2) : 0;
    document.getElementById('averageRating').textContent = overallAverageRating;

    // Clear previous averages for CSIT orgs
    const csitOrgAveragesContainer = document.getElementById('csitOrgAveragesContainer');
    csitOrgAveragesContainer.innerHTML = '';

    // Calculate and display the average rating for each CSIT org in boxes
    for (const org in csitOrgRatings) {
        const orgAverage = (csitOrgRatings[org].total / csitOrgRatings[org].count).toFixed(2);

        // Create the box for each org's average rating
        const orgBox = document.createElement('div');
        orgBox.classList.add('averageRatingContainer');
        orgBox.innerHTML = `
            <h2>${org}</h2>
            <div class="rating-box">
                <span id="averageRating">${orgAverage}</span>
                <span class="star">★</span>
            </div>
        `;

        csitOrgAveragesContainer.appendChild(orgBox);
    }
}






function sortData() {
    const sortOrder = document.getElementById('sortOrder').value; // Get sorting order (asc/desc)
    const sortRange = document.getElementById('sortDateRange').value; // Get date range filter
    
    // Always work with a fresh copy of the original data (currentData)
    let filteredData = [...currentData]; 

    // Get today's date
    const today = new Date();
    let rangeStartDate;

    // Calculate start date based on the selected date range
    if (sortRange === 'daily') {
        rangeStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    } else if (sortRange === 'weekly') {
        rangeStartDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);
    } else if (sortRange === '1month') {
        rangeStartDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    } else if (sortRange === '3months') {
        rangeStartDate = new Date(today.getFullYear(), today.getMonth() - 3, today.getDate());
    } else if (sortRange === '6months') {
        rangeStartDate = new Date(today.getFullYear(), today.getMonth() - 6, today.getDate());
    } else if (sortRange === '9months') {
        rangeStartDate = new Date(today.getFullYear(), today.getMonth() - 9, today.getDate());
    } else if (sortRange === '1year') {
        rangeStartDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    }

    // Filter data based on the range start date
    if (rangeStartDate) {
        filteredData = currentData.filter(row => {
            const recordedDate = new Date(row['Recorded Date']);
            return recordedDate >= rangeStartDate && recordedDate <= today;
        });
    }

    // Sort the filtered data by date if sortOrder is provided
    if (sortOrder) {
        filteredData.sort((a, b) => {
            const dateA = new Date(a['Recorded Date']);
            const dateB = new Date(b['Recorded Date']);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });
    }

    // Display the filtered and sorted data
    displayData(filteredData);
}


document.getElementById('confirmSort').addEventListener('click', function() {
    sortData(); // Call sortData to update the table based on selected filters
});






