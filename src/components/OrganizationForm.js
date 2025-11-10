import React, { useState, useEffect } from 'react';
import config from '../config';

const OrganizationForm = ({ existingData, onSuccess }) => {
    // Initialize formData with default values
    const [formData, setFormData] = useState({
        _id: '',
        name: '',
        location: '',
    });

    // If existingData is provided, update the formData state
    useEffect(() => {
        if (existingData) {
            setFormData(existingData);
        }
    }, [existingData]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Submitting form...');
        try {
            // Determine URL and method based on the presence of _id
            const url = formData._id
                ? `${config.apiUrl}/organization/${formData._id}`
                : `${config.apiUrl}/organization`;
            const method = formData._id ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });
            console.log('Response received', response);
            if (!response.ok) throw new Error('Failed to save data');
            const data = await response.json();
            console.log('Data parsed', data);
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Organization`);
            if (typeof onSuccess === 'function') {
                onSuccess(data);
            }
        } catch (error) {
            console.error('Error caught:', error);
            alert('Error saving data');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                {/* Optionally include a hidden input for _id if present */}
                {formData._id && <input type="hidden" name="_id" value={formData._id} />}
                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div>
                    <label>Location: </label>
                    <input
                        type="text"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">{formData._id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default OrganizationForm;
