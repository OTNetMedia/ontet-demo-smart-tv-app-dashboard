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
    const [imageFile, setImageFile] = useState(null); // Add this for file tracking
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
            setFormData({ ...existingData, team: teamValue });
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

            const response = await fetch(url, {
                method,
                body: data,
            });

            if (!response.ok) throw new Error('Failed to save data');
            const result = await response.json();
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Personnel`);
            if (typeof onSuccess === 'function') {
                onSuccess(result);
            }
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data');
        }
    };

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                {formData._id && <input type="hidden" name="_id" value={formData._id} />}

                <div>
                    <label>First Name: </label>
                    <input
                        type="text"
                        name="first_name"
                        value={formData.first_name || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Last Name: </label>
                    <input
                        type="text"
                        name="last_name"
                        value={formData.last_name || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Role: </label>
                    <input
                        type="text"
                        name="role"
                        value={formData.role || ''}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Team: </label>
                    <select name="team" value={formData.team} onChange={handleChange} required>
                        <option value="">Select a Team</option>
                        {teams.map((team) => (
                            <option key={team._id} value={team._id}>
                                {team.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Image: </label>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                <button type="submit">{formData._id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default PersonnelForm;
