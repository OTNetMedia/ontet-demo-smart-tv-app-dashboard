import React, { useState, useEffect } from 'react';
import config from '../config';

const GenreForm = ({ existingData, onSuccess }) => {
    const [formData, setFormData] = useState({ _id: '', name: '' });

    useEffect(() => {
        if (existingData) {
            setFormData({
                _id: existingData._id || '',
                name: existingData.name || '',
            });
        }
    }, [existingData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData };
            if (!payload._id) delete payload._id;

            const url = formData._id
                ? `${config.apiUrl}/genre/${formData._id}`
                : `${config.apiUrl}/genre`;
            const method = formData._id ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) throw new Error('Failed to save data');
            const data = await response.json();
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Genre`);
            if (onSuccess) onSuccess(data);
        } catch (error) {
            console.error(error);
            alert('Error saving data');
        }
    };

    return (
        <div className="mx-auto max-w-md">
            <form
                onSubmit={handleSubmit}
                className="space-y-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
            >
                <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                    {formData._id ? 'Edit Genre' : 'Create Genre'}
                </h2>

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

                <button
                    type="submit"
                    className="w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                >
                    {formData._id ? 'Update Genre' : 'Create Genre'}
                </button>
            </form>
        </div>
    );
};

export default GenreForm;
