//script.js is currently not being used in the react version of this project
//it is simply here for reference

function fetchData() {
    fetch('/api/data')
        .then(response => response.json())
        .then(data => displayData(data))
        .catch(error => console.error('Error:', error));
}

function fetchAllData() {
    fetch('/api/allData')
        .then(response => response.json())
        .then(data => displayData(data))
        .catch(error => console.error('Error:', error));
}

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

// Resizable window for uploaded data
const uploadedDataWindow = document.getElementById('uploadedDataWindow');
const resizable = uploadedDataWindow.querySelector('.resizable');
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

    const containerRect = uploadedDataWindow.getBoundingClientRect();
    const rect = resizable.getBoundingClientRect();

    if (currentResizer.classList.contains('resizer-r') || currentResizer.classList.contains('resizer-rb')) {
        const width = Math.min(e.clientX - rect.left, containerRect.width);
        resizable.style.width = `${width}px`;
    }
    
    if (currentResizer.classList.contains('resizer-b') || currentResizer.classList.contains('resizer-rb')) {
        const height = e.clientY - rect.top;
        resizable.style.height = `${height}px`;
    }

    dataWindow.style.width = `${resizable.offsetWidth}px`;
    dataWindow.style.height = `${resizable.offsetHeight}px`;
}

function stopResize() {
    isResizing = false;
    window.removeEventListener('mousemove', resize);
    window.removeEventListener('mouseup', stopResize);
}



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
  
//   function displayAllData(data) {
//     const tableBody = document.getElementById('dataBody');
//     tableBody.innerHTML = '';
//     data.forEach((row, index) => {
//       const tr = document.createElement('tr');
//       tr.innerHTML = `
//         <td class="line-number">${index + 1}</td>
//         <td>${new Date(row['Recorded Date']).toLocaleString()}</td>
//         <td>${row['Response Id']}</td>
//         <td>${row['Satisfaction Rating']}</td>
//         <td>${row['CSIT Org']}</td>
//         <td>${row['Direct/Indirect']}</td>
//         <td class="comment-cell">
//           <pre class="comment-content">${escapeHtml(row['Comments'])}</pre>
//           <span class="expand-button" onclick="toggleComment(this, event)">
//             <i class="bi bi-plus-circle"></i>
//           </span>
//         </td>
//       `;
//       tableBody.appendChild(tr);
//     });
//   }
  

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded");
    if (window.FileUpload) {
        ReactDOM.render(
            React.createElement(window.FileUpload),
            document.getElementById('fileUploadContainer')
        );
    } else {
        console.error("FileUpload component not found");
    }

    // Determine which page we're on
    const isAllDataPage = window.location.pathname.includes('output2.html');

    if (isAllDataPage) {
        fetchAllData();
        
        // Add event listener for the "Back to Single File View" button
        const viewSingleFileBtn = document.getElementById('viewSingleFileBtn');
        if (viewSingleFileBtn) {
            viewSingleFileBtn.addEventListener('click', function() {
                window.location.href = 'output.html';
            });
        }
    } else {
        fetchData();
        
        // Add event listener for the "View All Data" button
        const viewAllDataBtn = document.getElementById('viewAllDataBtn');
        if (viewAllDataBtn) {
            viewAllDataBtn.addEventListener('click', function() {
                window.location.href = 'output2.html';
            });
        }
    }

    // Set up other event listeners
    setupEventListeners();
});