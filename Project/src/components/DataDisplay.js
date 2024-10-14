import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function DataDisplay({ view }) {
  const [data, setData] = useState([]);
  const [sortOrder, setSortOrder] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: '100%', height: 400 });
  const resizableRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, [view]);

  const fetchData = async () => {
    try {
      const response = await axios.get(view === 'all' ? '/api/allData' : '/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const sortData = () => {
    if (sortOrder) {
      const sortedData = [...data].sort((a, b) => {
        const dateA = new Date(a['Recorded Date']);
        const dateB = new Date(b['Recorded Date']);
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      });
      setData(sortedData);
    }
  };

  const toggleComment = (index) => {
    setData(data.map((item, i) => 
      i === index ? { ...item, expanded: !item.expanded } : item
    ));
  };

  const escapeHtml = (unsafe) => {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  };

  // Resizable functionality
  useEffect(() => {
    const resizable = resizableRef.current;
    let isResizing = false;
    let currentResizer;

    const initResize = (e) => {
      isResizing = true;
      currentResizer = e.target;
      document.addEventListener('mousemove', resize);
      document.addEventListener('mouseup', stopResize);
    };

    const resize = (e) => {
      if (!isResizing) return;
      const rect = resizable.getBoundingClientRect();

      if (currentResizer.classList.contains('resizer-r')) {
        const width = e.clientX - rect.left;
        setWindowSize(prev => ({ ...prev, width: `${width}px` }));
      }
      
      if (currentResizer.classList.contains('resizer-b')) {
        const height = e.clientY - rect.top;
        setWindowSize(prev => ({ ...prev, height }));
      }
    };

    const stopResize = () => {
      isResizing = false;
      document.removeEventListener('mousemove', resize);
      document.removeEventListener('mouseup', stopResize);
    };

    const resizers = resizable.querySelectorAll('.resizer');
    resizers.forEach(resizer => {
      resizer.addEventListener('mousedown', initResize);
    });

    return () => {
      resizers.forEach(resizer => {
        resizer.removeEventListener('mousedown', initResize);
      });
    };
  }, []);

  return (
    <div className="data-container">
      <div id="uploadedDataWindow">
        <div className="resizable" ref={resizableRef} 
        style={{ width: windowSize.width, height: windowSize.height }}>
          <div className="data-window">
            <div className="search-container">
              <input
                type="text"
                id="searchInput"
                className="search-input"
                placeholder="Search..."
                style={{ display: searchVisible ? 'block' : 'none' }}
              />
              <button className="search-toggle" onClick={() => setSearchVisible(!searchVisible)}>
                <i className="bi bi-search"></i>
              </button>
            </div>
            
            <div className="sort-controls">
              <div className="sort-group">
                <label htmlFor="sortRecordedDate">Recorded Date</label>
                <select 
                  id="sortRecordedDate" 
                  value={sortOrder} 
                  onChange={(e) => setSortOrder(e.target.value)}
                >
                  <option value="">- Select -</option>
                  <option value="asc">Oldest to Newest</option>
                  <option value="desc">Newest to Oldest</option>
                </select>
              </div>
              <button className="confirmSort" onClick={sortData}>Confirm Sort</button>
            </div>

            <table id="dataTable">
              <thead>
                <tr>
                  <th className="line-number">#</th>
                  <th>Recorded Date</th>
                  <th>Response Id</th>
                  <th>Satisfaction Rating</th>
                  <th>CSIT Org</th>
                  <th>Direct/Indirect</th>
                  <th>Comments</th>
                </tr>
              </thead>
              <tbody id="dataBody">
                {data.map((row, index) => (
                  <tr key={index}>
                    <td className="line-number">{index + 1}</td>
                    <td>{new Date(row['Recorded Date']).toLocaleString()}</td>
                    <td>{row['Response Id']}</td>
                    <td>{row['Satisfaction Rating']}</td>
                    <td>{row['CSIT Org']}</td>
                    <td>{row['Direct/Indirect']}</td>
                    <td className="comment-cell">
                      <pre className={`comment-content ${row.expanded ? 'comment-expanded' : ''}`}>
                        {escapeHtml(row['Comments'])}
                      </pre>
                      <span className="expand-button" onClick={() => toggleComment(index)}>
                        <i className={`bi bi-${row.expanded ? 'dash' : 'plus'}-circle`}></i>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="resizer resizer-r"></div>
          <div className="resizer resizer-b"></div>
          <div className="resizer resizer-rb"></div>
        </div>
      </div>
      
      <div className="button-container">
        {view === 'single' ? (
          <Link to="/all-data" className="view-all-btn">View All Data<i class="bi bi-arrow-right"></i></Link>
        ) : (
          <Link to="/" className="view-single-btn"><i class="bi bi-arrow-left"></i>View Single File</Link>
        )}
      </div>
    </div>
  );
}

export default DataDisplay;