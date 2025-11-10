import React, { useState, useEffect } from 'react';
import PersonnelForm from './PersonnelForm';
import config from '../config';

const PersonnelManager = () => {
    const [personnelList, setPersonnelList] = useState([]);
    const [selectedPersonnel, setSelectedPersonnel] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchPersonnel = async (pageNumber = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.apiUrl}/personnel?page=${pageNumber}&limit=5`);
            if (!response.ok) throw new Error('Failed to fetch personnel');
            const data = await response.json();
            setPersonnelList(data.results);
            setPage(data.page);
            setTotalPages(data.total_pages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPersonnel(page);
    }, [page]);

    const handlePersonnelClick = (personnel) => {
        setSelectedPersonnel(personnel);
    };

    const handleFormSuccess = () => {
        fetchPersonnel(page);
        setSelectedPersonnel(null);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this person?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${config.apiUrl}/personnel/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete personnel');
            fetchPersonnel(page);
        } catch (err) {
            alert('Error deleting personnel: ' + err.message);
        }
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    return (
        <div>
            {selectedPersonnel ? (
                <div>
                    <h2>{selectedPersonnel._id ? 'Update Personnel' : 'Add New Personnel'}</h2>
                    <PersonnelForm existingData={selectedPersonnel} onSuccess={handleFormSuccess} />
                    <button onClick={() => setSelectedPersonnel(null)}>Back to List</button>
                </div>
            ) : (
                <div>
                    <h2>
                        Personnel (Page {page} of {totalPages})
                    </h2>
                    {loading && <p>Loading personnel...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    {personnelList.length > 0 ? (
                        <ul>
                            {personnelList.map((person) => (
                                <li
                                    key={person._id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        marginBottom: '10px',
                                    }}
                                >
                                    <img
                                        src={person.image}
                                        alt={person.first_name}
                                        style={{
                                            width: '120px',
                                            height: '190px',
                                            borderRadius: '10%',
                                            marginRight: '10px',
                                        }}
                                    />
                                    <div
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => handlePersonnelClick(person)}
                                    >
                                        <strong>
                                            {person.first_name} {person.last_name}
                                        </strong>{' '}
                                        — {person.role}
                                        {person.team &&
                                            person.team.name &&
                                            ` (Team: ${person.team.name})`}
                                    </div>
                                    <button
                                        onClick={() => handleDelete(person._id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No personnel found.</p>
                    )}

                    <div style={{ marginTop: '20px' }}>
                        <button onClick={handlePrevPage} disabled={page === 1}>
                            Previous
                        </button>
                        <button onClick={handleNextPage} disabled={page === totalPages}>
                            Next
                        </button>
                    </div>

                    <button style={{ marginTop: '20px' }} onClick={() => setSelectedPersonnel({})}>
                        Add New Personnel
                    </button>
                </div>
            )}
        </div>
    );
};

export default PersonnelManager;
