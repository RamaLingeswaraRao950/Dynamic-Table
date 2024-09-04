import React, { useState, useEffect } from 'react';
import ReactPaginate from 'react-paginate';

const DynamicTable = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState('');
  const [newRecord, setNewRecord] = useState({ id: '', name: '', email: '' });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [currentPage, setCurrentPage] = useState(0);
  const recordsPerPage = 5;

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then((response) => response.json())
      .then((data) => setData(data));
  }, []);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = [...data].sort((a, b) => {
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'ascending' ? 1 : -1;
    }
    return 0;
  });

  const filteredData = sortedData.filter(
    (item) =>
      item.id.toString().includes(search.toLowerCase()) ||
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddRecord = () => {
    if (newRecord.id && newRecord.name && newRecord.email) {
      setData([...data, { id: parseInt(newRecord.id), name: newRecord.name, email: newRecord.email }]);
      setNewRecord({ id: '', name: '', email: '' }); 
    } else {
      alert('Please fill in all fields');
    }
  };

  const handleDeleteRecord = (id) => {
    setData(data.filter((item) => item.id !== id));
  };

  const handlePageClick = (event) => {
    setCurrentPage(event.selected);
  };

  const offset = currentPage * recordsPerPage;
  const currentPageData = filteredData.slice(offset, offset + recordsPerPage);

  return (
    <div className="App-header">
      <div className="table-container">
        <h1><u>Dynamic Table</u></h1>
        <input
          type="text"
          placeholder="Search The Record by ID, name, or email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <table>
          <thead>
            <tr>
              <th onClick={() => handleSort('id')}>ID</th>
              <th onClick={() => handleSort('name')}>Name</th>
              <th onClick={() => handleSort('email')}>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentPageData.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>
                  <button onClick={() => handleDeleteRecord(item.id)}>Delete The Record</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="add-record-container">
          <input
            type="text"
            placeholder="ID"
            value={newRecord.id}
            onChange={(e) => setNewRecord({ ...newRecord, id: e.target.value })}
          />
          <input
            type="text"
            placeholder="Name"
            value={newRecord.name}
            onChange={(e) => setNewRecord({ ...newRecord, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email"
            value={newRecord.email}
            onChange={(e) => setNewRecord({ ...newRecord, email: e.target.value })}
          />
          <button onClick={handleAddRecord}>Add The Record</button>
        </div>

        <div className="pagination-container">
          <ReactPaginate
            previousLabel={'Previous Page'}
            nextLabel={'Next Page'}
            breakLabel={'...'}
            pageCount={Math.ceil(filteredData.length / recordsPerPage)}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            pageClassName={'page-item'} 
            pageLinkClassName={'page-link'} 
            previousClassName={'page-item'} 
            previousLinkClassName={'page-link'} 
            nextClassName={'page-item'} 
            nextLinkClassName={'page-link'} 
            breakClassName={'page-item'} 
            breakLinkClassName={'page-link'} 
            activeClassName={'active'} 
          />
        </div>
      </div>
    </div>
  );
};

export default DynamicTable;
