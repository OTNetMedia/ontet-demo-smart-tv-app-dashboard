import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import config from '../config';

const TeamForm = ({ existingData, onSuccess }) => {
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        organization: '',
        genres: [],
        personnel: [],
    });

    const [organizations, setOrganizations] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);
    const [personnelOptions, setPersonnelOptions] = useState([]);

    useEffect(() => {
        const fetchData = async (endpoint, setter) => {
            try {
                const res = await fetch(`${config.apiUrl}/${endpoint}`);
                if (res.ok) {
                    const data = await res.json();
                    setter(data.results || []);
                } else {
                    console.error(`Failed to fetch ${endpoint}`);
                }
            } catch (err) {
                console.error(`Error fetching ${endpoint}:`, err);
            }
        };
        fetchData('organization', setOrganizations);
        fetchData('genre', setGenreOptions);
        fetchData('personnel', setPersonnelOptions);
    }, []);

    useEffect(() => {
        if (existingData) {
            const orgValue =
                existingData.organization && typeof existingData.organization === 'object'
                    ? existingData.organization._id
                    : existingData.organization || '';
            const genresValue = Array.isArray(existingData.genres)
                ? existingData.genres.map((g) => (g._id ? g._id : g))
                : [];
            const personnelValue = Array.isArray(existingData.personnel)
                ? existingData.personnel.map((p) => (p._id ? p._id : p))
                : [];

            setFormData({
                _id: existingData._id || '',
                name: existingData.name || '',
                organization: orgValue,
                genres: genresValue,
                personnel: personnelValue,
            });
        }
    }, [existingData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleGenresChange = (selectedOptions) => {
        setFormData({
            ...formData,
            genres: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        });
    };

    const handlePersonnelChange = (selectedOptions) => {
        setFormData({
            ...formData,
            personnel: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };

            if (!payload._id) {
                delete payload._id;
            }

            const url = formData._id
                ? `${config.apiUrl}/team/${formData._id}`
                : `${config.apiUrl}/team`;
            const method = formData._id ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to save data');
            const data = await response.json();

            alert(`Successfully ${formData._id ? 'updated' : 'created'} Team`);
            if (onSuccess) onSuccess(data);
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data');
        }
    };

    const organizationOptions = organizations.map((org) => ({
        value: org._id,
        label: org.name,
    }));

    const mappedGenreOptions = genreOptions.map((genre) => ({
        value: genre._id,
        label: genre.name,
    }));

    const mappedPersonnelOptions = personnelOptions.map((person) => ({
        value: person._id,
        label: `${person.first_name} ${person.last_name}`,
    }));

    return (
        <div className="mx-auto max-w-2xl">
            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                    {formData._id ? 'Edit Team' : 'Create Team'}
                </h2>

                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                    />
                </div>

                {/* Organization */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Organization
                    </label>
                    <select
                        name="organization"
                        value={formData.organization}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                    >
                        <option value="">Select Organization</option>
                        {organizationOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Genres */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Genres</label>
                    <Select
                        isMulti
                        name="genres"
                        options={mappedGenreOptions}
                        value={mappedGenreOptions.filter((option) =>
                            formData.genres.includes(option.value)
                        )}
                        onChange={handleGenresChange}
                        placeholder="Select genres..."
                        className="text-sm"
                    />
                </div>

                {/* Personnel */}
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Personnel
                    </label>
                    <Select
                        isMulti
                        name="personnel"
                        options={mappedPersonnelOptions}
                        value={mappedPersonnelOptions.filter((option) =>
                            formData.personnel.includes(option.value)
                        )}
                        onChange={handlePersonnelChange}
                        placeholder="Select personnel..."
                        className="text-sm"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    {formData._id ? 'Update Team' : 'Create Team'}
                </button>
            </form>
        </div>
    );
};

export default TeamForm;
