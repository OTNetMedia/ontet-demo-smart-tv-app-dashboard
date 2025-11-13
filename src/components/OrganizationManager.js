import React, { useState, useEffect } from 'react';
import OrganizationForm from './OrganizationForm';
import config from '../config';

const OrganizationManager = () => {
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchOrganizations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.apiUrl}/organization`);
            if (!response.ok) throw new Error('Failed to fetch organizations');
            const data = await response.json();
            setOrganizations(data.results || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrganizations();
    }, []);

    const handleOrgClick = (org) => setSelectedOrg(org);

    const handleFormSuccess = () => {
        fetchOrganizations();
        setSelectedOrg(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            {selectedOrg ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            {selectedOrg._id ? 'Update Organization' : 'Create New Organization'}
                        </h2>
                        <button
                            onClick={() => setSelectedOrg(null)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                        >
                            Back to List
                        </button>
                    </div>

                    <OrganizationForm existingData={selectedOrg} onSuccess={handleFormSuccess} />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">Organizations</h2>
                        <button
                            onClick={() => setSelectedOrg({})}
                            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Add New Organization
                        </button>
                    </div>

                    {loading && <p className="text-slate-600">Loading organizations...</p>}
                    {error && <p className="text-red-600">Error: {error}</p>}

                    {organizations.length > 0 ? (
                        <ul className="space-y-3">
                            {organizations.map((org) => (
                                <li
                                    key={org._id}
                                    onClick={() => handleOrgClick(org)}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition cursor-pointer"
                                >
                                    <div>
                                        <div className="font-medium text-slate-800">{org.name}</div>
                                        <div className="text-sm text-slate-600">{org.location}</div>
                                    </div>
                                    <span className="text-slate-400 text-sm">Click to edit</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-600">No organizations found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default OrganizationManager;
