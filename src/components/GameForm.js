import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import config from '../config';

const GameForm = ({ existingData, onSuccess }) => {
    const [formData, setFormData] = useState({
        _id: '',
        title: '',
        video: false,
        media_type: '',
        original_language: '',
        original_title: '',
        overview: '',
        popularity: 0,
        poster_path: '',
        backdrop_path: '',
        vote_average: 0,
        vote_count: 0,
        date_played: '',
        home_score: 0,
        away_score: 0,
        played: false,
        home_team: '',
        away_team: '',
        genres: [],
        personnel: [],
    });

    const [teams, setTeams] = useState([]);
    const [personnelOptions, setPersonnelOptions] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/team`);
                if (res.ok) {
                    const data = await res.json();
                    setTeams(data.results || []);
                }
            } catch (err) {
                console.error('Error fetching teams:', err);
            }
        };
        fetchTeams();
    }, []);

    useEffect(() => {
        const fetchPersonnel = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/personnel`);
                if (res.ok) {
                    const data = await res.json();
                    setPersonnelOptions(data.results || []);
                }
            } catch (err) {
                console.error('Error fetching personnel:', err);
            }
        };
        fetchPersonnel();
    }, []);

    useEffect(() => {
        const fetchGenres = async () => {
            try {
                const res = await fetch(`${config.apiUrl}/genre`);
                if (res.ok) {
                    const data = await res.json();
                    setGenreOptions(data.results || []);
                }
            } catch (err) {
                console.error('Error fetching genres:', err);
            }
        };
        fetchGenres();
    }, []);

    useEffect(() => {
        if (existingData) {
            setFormData({
                _id: existingData._id || '',
                title: existingData.title || '',
                video: existingData.video || false,
                media_type: existingData.media_type || '',
                original_language: existingData.original_language || '',
                original_title: existingData.original_title || '',
                overview: existingData.overview || '',
                popularity: existingData.popularity || 0,
                poster_path: existingData.poster_path || '',
                backdrop_path: existingData.backdrop_path || '',
                vote_average: existingData.vote_average || 0,
                vote_count: existingData.vote_count || 0,
                date_played: existingData.date_played || '',
                home_score: existingData.home_score || 0,
                away_score: existingData.away_score || 0,
                played: existingData.played || false,
                home_team: existingData.home_team?._id || existingData.home_team || '',
                away_team: existingData.away_team?._id || existingData.away_team || '',
                genres: (existingData.genres || []).map((g) => g._id),
                personnel: (existingData.personnel || []).map((p) => p._id),
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

    const handlePersonnelChange = (selectedOptions) => {
        setFormData({
            ...formData,
            personnel: selectedOptions ? selectedOptions.map((o) => o.value) : [],
        });
    };

    const handleGenresChange = (selectedOptions) => {
        setFormData({
            ...formData,
            genres: selectedOptions ? selectedOptions.map((o) => o.value) : [],
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = formData._id
                ? `${config.apiUrl}/game/${formData._id}`
                : `${config.apiUrl}/game`;
            const method = formData._id ? 'PATCH' : 'POST';

            const data = new FormData();
            for (let key in formData) {
                if (Array.isArray(formData[key])) {
                    formData[key].forEach((val) => data.append(key, val));
                } else {
                    data.append(key, formData[key]);
                }
            }

            if (document.getElementById('poster_path').files[0]) {
                data.append('poster', document.getElementById('poster_path').files[0]);
            }
            if (document.getElementById('backdrop_path').files[0]) {
                data.append('backdrop', document.getElementById('backdrop_path').files[0]);
            }

            const response = await fetch(url, { method, body: data });
            if (!response.ok) throw new Error('Failed to save data');

            const result = await response.json();
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Game`);
            if (onSuccess) onSuccess(result);
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data');
        }
    };

    const teamSelectOptions = teams.map((t) => ({ value: t._id, label: t.name }));
    const personnelSelectOptions = personnelOptions.map((p) => ({
        value: p._id,
        label: `${p.first_name} ${p.last_name}`,
    }));
    const genreSelectOptions = genreOptions.map((g) => ({
        value: g._id,
        label: g.name,
    }));

    return (
        <div className="mx-auto max-w-3xl">
            <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                    {formData._id ? 'Edit Game' : 'Create Game'}
                </h2>

                <div className="grid grid-cols-1 gap-4">
                    {/* Title */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Title
                        </label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                        />
                    </div>

                    {/* Video */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="video"
                            checked={formData.video}
                            onChange={handleChange}
                            className="h-4 w-4 accent-slate-700"
                        />
                        <label className="text-sm font-medium text-slate-700">Video</label>
                    </div>

                    {/* Media Type */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Media Type
                        </label>
                        <input
                            type="text"
                            name="media_type"
                            value={formData.media_type}
                            onChange={handleChange}
                            required
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                        />
                    </div>

                    {/* Language and Title */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Original Language
                            </label>
                            <input
                                type="text"
                                name="original_language"
                                value={formData.original_language}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Original Title
                            </label>
                            <input
                                type="text"
                                name="original_title"
                                value={formData.original_title}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                            />
                        </div>
                    </div>

                    {/* Overview */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Overview
                        </label>
                        <textarea
                            name="overview"
                            value={formData.overview}
                            onChange={handleChange}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-slate-500 focus:ring focus:ring-slate-200"
                        />
                    </div>

                    {/* Popularity */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Popularity
                        </label>
                        <input
                            type="number"
                            name="popularity"
                            value={formData.popularity}
                            onChange={handleChange}
                            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                        />
                    </div>

                    {/* File Inputs */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Poster
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                id="poster_path"
                                className="block w-full text-sm text-slate-600"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Backdrop
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                id="backdrop_path"
                                className="block w-full text-sm text-slate-600"
                            />
                        </div>
                    </div>

                    {/* Scores */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Home Score
                            </label>
                            <input
                                type="number"
                                name="home_score"
                                value={formData.home_score}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Away Score
                            </label>
                            <input
                                type="number"
                                name="away_score"
                                value={formData.away_score}
                                onChange={handleChange}
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            />
                        </div>
                    </div>

                    {/* Played */}
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            name="played"
                            checked={formData.played}
                            onChange={handleChange}
                            className="h-4 w-4 accent-slate-700"
                        />
                        <label className="text-sm font-medium text-slate-700">Played</label>
                    </div>

                    {/* Teams */}
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Home Team
                            </label>
                            <select
                                name="home_team"
                                value={formData.home_team}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="">Select Home Team</option>
                                {teamSelectOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">
                                Away Team
                            </label>
                            <select
                                name="away_team"
                                value={formData.away_team}
                                onChange={handleChange}
                                required
                                className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
                            >
                                <option value="">Select Away Team</option>
                                {teamSelectOptions.map((opt) => (
                                    <option key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Genres */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Genres
                        </label>
                        <Select
                            isMulti
                            name="genres"
                            options={genreSelectOptions}
                            value={genreSelectOptions.filter((o) =>
                                formData.genres.includes(o.value)
                            )}
                            onChange={handleGenresChange}
                            className="react-select-container text-sm"
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
                            options={personnelSelectOptions}
                            value={personnelSelectOptions.filter((o) =>
                                formData.personnel.includes(o.value)
                            )}
                            onChange={handlePersonnelChange}
                            className="react-select-container text-sm"
                        />
                    </div>

                    <button
                        type="submit"
                        className="mt-4 w-full rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                    >
                        {formData._id ? 'Update Game' : 'Create Game'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default GameForm;
