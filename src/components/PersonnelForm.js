import React, { useState, useEffect } from 'react';
import config from '../config';

const PersonnelForm = ({ existingData, onSuccess }) => {
    const [formData, setFormData] = useState({
        _id: '',
        first_name: '',
        last_name: '',
        role: '',
        team: '',
    });
    const [imageFile, setImageFile] = useState(null);
    const [teams, setTeams] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/team`);
                if (res.ok) {
                    const data = await res.json();
                    setTeams(data.results || []);
                } else {
                    console.error('Failed to fetch teams');
                }
            } catch (err) {
                console.error('Error fetching teams:', err);
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        if (existingData) {
            const teamValue =
                existingData.team && typeof existingData.team === 'object'
                    ? existingData.team._id
                    : existingData.team || '';
            setFormData({
                _id: existingData._id || '',
                first_name: existingData.first_name || '',
                last_name: existingData.last_name || '',
                role: existingData.role || '',
                team: teamValue,
            });
        }
    }, [existingData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageChange = (e) => {
        setImageFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const url = formData._id
                ? `${config.apiUrl}/personnel/${formData._id}`
                : `${config.apiUrl}/personnel`;
            const method = formData._id ? 'PATCH' : 'POST';

            const data = new FormData();
            for (let key in formData) {
                if (formData[key]) data.append(key, formData[key]);
            }
            if (imageFile) {
                data.append('image', imageFile);
            }

            const response = await fetch(url, { method, body: data });

            if (!response.ok) throw new Error('Failed to save data');
            const result = await response.json();
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Personnel`);
            if (onSuccess) onSuccess(result);
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data');
        }
    };

    return (
        <div className="mx-auto max-w-md">
            <form
                onSubmit={handleSubmit}
                encType="multipart/form-data"
                className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                    {formData._id ? 'Edit Personnel' : 'Create Personnel'}
                </h2>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        First Name
                    </label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                        Last Name
                    </label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role || ''}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Team</label>
                    <select
                        name="team"
                        value={formData.team}
                        onChange={handleChange}
                        required
                        className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                    >
                        <option value="">Select a Team</option>
                        {teams.map((team) => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Image</label>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="block w-full text-sm text-slate-600"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    {formData._id ? 'Update Personnel' : 'Create Personnel'}
                </button>
            </form>
        </div>
    );
};

export default PersonnelForm;
