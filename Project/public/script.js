function fetchData() {
    fetch('/api/data')
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
