import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import config from '../config';

const TeamForm = ({ existingData, onSuccess }) => {
    // Initialize default state
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        organization: '',
        genres: [], // array of genre IDs
        personnel: [], // array of personnel IDs
    });

    // State to hold dropdown options
    const [organizations, setOrganizations] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);
    const [personnelOptions, setPersonnelOptions] = useState([]);

    // Fetch organizations from API to populate organization dropdown
    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/organization`);
                if (res.ok) {
                    const data = await res.json();
                    setOrganizations(data.results || []);
                } else {
                    console.error('Failed to fetch organizations');
                }
            } catch (err) {
                console.error('Error fetching organizations:', err);
            }
        };
        fetchOrganizations();
    }, []);

    // Fetch genres from API to populate multi-select options
    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/genre`);
                if (res.ok) {
                    const data = await res.json();
                    setGenreOptions(data.results || []);
                } else {
                    console.error('Failed to fetch genres');
                }
            } catch (err) {
                console.error('Error fetching genres:', err);
            }
        };
        fetchGenres();
    }, []);

    // Fetch personnel from API to populate multi-select options for personnel
    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/personnel`);
                if (res.ok) {
                    const data = await res.json();
                    setPersonnelOptions(data.results || []);
                } else {
                    console.error('Failed to fetch personnel');
                }
            } catch (err) {
                console.error('Error fetching personnel:', err);
            }
        };
        fetchPersonnel();
    }, []);

    // Update form state if existingData is provided.
    useEffect(() => {
        if (existingData) {
            // For organization: if it's an object, extract its _id; otherwise, use value.
            const orgValue =
                existingData.organization && typeof existingData.organization === 'object'
                    ? existingData.organization._id
                    : existingData.organization || '';
            // For genres: if it's an array of objects, extract their _id; if already an array of IDs, use as-is.
            const genresValue = Array.isArray(existingData.genres)
                ? existingData.genres.map((g) => (g._id ? g._id : g))
                : [];
            // For personnel: if it's an array of objects, extract their _id.
            const personnelValue = Array.isArray(existingData.personnel)
                ? existingData.personnel.map((p) => (p._id ? p._id : p))
                : [];

            setFormData({
                ...existingData,
                organization: orgValue,
                genres: genresValue,
                personnel: personnelValue,
            });
        }
    }, [existingData]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Handler for react-select multi-select for genres
    const handleGenresChange = (selectedOptions) => {
        setFormData({
            ...formData,
            genres: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        });
    };

    // Handler for react-select multi-select for personnel
    const handlePersonnelChange = (selectedOptions) => {
        setFormData({
            ...formData,
            personnel: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = formData._id
                ? `${config.apiUrl}/team/${formData._id}`
                : `${config.apiUrl}/team`;
            const method = formData._id ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error('Failed to save data');
            const data = await response.json();
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Team`);
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data');
        }
    };

    // Map organization options for the select
    const organizationOptions = organizations.map((org) => ({
        value: org._id,
        label: org.name,
    }));

    // Map genre options for react-select
    const mappedGenreOptions = genreOptions.map((genre) => ({
        value: genre._id,
        label: genre.name,
    }));

    // Map personnel options for react-select
    const mappedPersonnelOptions = personnelOptions.map((person) => ({
        value: person._id,
        label: `${person.first_name} ${person.last_name}`,
    }));

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                {formData._id && <input type="hidden" name="_id" value={formData._id} />}

                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Organization: </label>
                    <select
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Organization</option>
                        {organizationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Genres: </label>
                    <Select
                        isMulti
                        name="genres"
                        options={mappedGenreOptions}
                        value={mappedGenreOptions.filter((option) =>
                            formData.genres.includes(option.value)
                        )}
                        onChange={handleGenresChange}
                        placeholder="Select genres..."
                    />
                </div>

                <div>
                    <label>Personnel: </label>
                    <Select
                        isMulti
                        name="personnel"
                        options={mappedPersonnelOptions}
                        value={mappedPersonnelOptions.filter((option) =>
                            formData.personnel.includes(option.value)
                        )}
                        onChange={handlePersonnelChange}
                        placeholder="Select personnel..."
                    />
                </div>

                <button type="submit">{formData._id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default TeamForm;
