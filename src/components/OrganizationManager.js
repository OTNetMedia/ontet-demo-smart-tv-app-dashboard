import React, { useState, useEffect } from 'react';
import OrganizationForm from './OrganizationForm';
import config from '../config';

const OrganizationManager = () => {
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrg, setSelectedOrg] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch organizations from the API
    const fetchOrganizations = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.apiUrl}/organization`);
            if (!response.ok) throw new Error('Failed to fetch organizations');
            const data = await response.json();
            // Expecting data.results to contain the array of organizations
            setOrganizations(data.results);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchOrganizations();
    }, []);

    // Handle click on an organization to update
    const handleOrgClick = (org) => {
        setSelectedOrg(org);
    };

    // When the form successfully creates/updates, refresh list and clear selection
    const handleFormSuccess = (updatedOrg) => {
        fetchOrganizations();
        setSelectedOrg(null);
    };

    return (
        <div>
            {selectedOrg ? (
                <div>
                    <h2>{selectedOrg._id ? 'Update Organization' : 'Create New Organization'}</h2>
                    <OrganizationForm existingData={selectedOrg} onSuccess={handleFormSuccess} />
                    <button onClick={() => setSelectedOrg(null)}>Back to List</button>
                </div>
            ) : (
                <div>
                    <h2>Organizations</h2>
                    {loading && <p>Loading organizations...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    {organizations.length > 0 ? (
                        <ul>
                            {organizations.map((org) => (
                                <li
                                    key={org._id}
                                    onClick={() => handleOrgClick(org)}
                                    style={{ cursor: 'pointer', margin: '8px 0' }}
                                >
                                    <strong>{org.name}</strong> - {org.location}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No organizations found.</p>
                    )}
                    <button onClick={() => setSelectedOrg({})}>Add New Organization</button>
                </div>
            )}
        </div>
    );
};

export default OrganizationManager;
