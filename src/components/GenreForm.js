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
            // Create a copy of formData and remove _id if it's an empty string
            const payload = { ...formData };
            if (!payload._id) {
                delete payload._id;
            }
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
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        } catch (error) {
            console.error(error);
            alert('Error saving data');
        }
    };

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
                <button type="submit">{formData._id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default GenreForm;
