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
            setPersonnelList(data.results || []);
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

    const handlePersonnelClick = (personnel) => setSelectedPersonnel(personnel);

    const handleFormSuccess = () => {
        fetchPersonnel(page);
        setSelectedPersonnel(null);
    };

    const handleDelete = async (id) => {
        const confirmDelete = window.confirm('Are you sure you want to delete this person?');
        if (!confirmDelete) return;

        try {
            const res = await fetch(`${config.apiUrl}/personnel/${id}`, { method: 'DELETE' });
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
        <div className="max-w-5xl mx-auto">
            {selectedPersonnel ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            {selectedPersonnel._id ? 'Update Personnel' : 'Add New Personnel'}
                        </h2>
                        <button
                            onClick={() => setSelectedPersonnel(null)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                        >
                            Back to List
                        </button>
                    </div>

                    <PersonnelForm existingData={selectedPersonnel} onSuccess={handleFormSuccess} />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Personnel (Page {page} of {totalPages})
                        </h2>
                        <button
                            onClick={() => setSelectedPersonnel({})}
                            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Add New Personnel
                        </button>
                    </div>

                    {loading && <p className="text-slate-600">Loading personnel...</p>}
                    {error && <p className="text-red-600">Error: {error}</p>}

                    {personnelList.length > 0 ? (
                        <ul className="space-y-3">
                            {personnelList.map((person) => (
                                <li
                                    key={person._id}
                                    className="flex items-center gap-4 rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition"
                                >
                                    {person.image && (
                                        <img
                                            src={person.image}
                                            alt={`${person.first_name} ${person.last_name}`}
                                            className="h-32 w-24 rounded-md object-cover"
                                        />
                                    )}
                                    <div
                                        className="flex-1 cursor-pointer"
                                        onClick={() => handlePersonnelClick(person)}
                                    >
                                        <div className="font-medium text-slate-800">
                                            {person.first_name} {person.last_name}
                                        </div>
                                        <div className="text-sm text-slate-600">
                                            {person.role}
                                            {person.team?.name && (
                                                <span className="text-slate-500">
                                                    {' '}
                                                    (Team: {person.team.name})
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(person._id);
                                        }}
                                        className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-600">No personnel found.</p>
                    )}

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-3 pt-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            className={`rounded-md border px-3 py-1 text-sm ${
                                page === 1
                                    ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            className={`rounded-md border px-3 py-1 text-sm ${
                                page === totalPages
                                    ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PersonnelManager;
