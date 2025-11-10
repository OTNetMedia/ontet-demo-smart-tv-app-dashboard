import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import config from '../config';

const GameForm = ({ existingData, onSuccess }) => {
    // Initialize formData with default values
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
        genres: [], // as an array of genre IDs
        personnel: [], // as an array of personnel IDs
    });

    // State to hold dropdown options
    const [teams, setTeams] = useState([]);
    const [personnelOptions, setPersonnelOptions] = useState([]);
    const [genreOptions, setGenreOptions] = useState([]);

    // Fetch teams for home/away dropdowns
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

    // Fetch personnel options for multi-select
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

    // Fetch genre options for multi-select
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

    // Populate formData if existingData is provided
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
                home_team:
                    existingData.home_team && typeof existingData.home_team === 'object'
                        ? existingData.home_team._id
                        : existingData.home_team || '',
                away_team:
                    existingData.away_team && typeof existingData.away_team === 'object'
                        ? existingData.away_team._id
                        : existingData.away_team || '',
                genres: Array.isArray(existingData.genres)
                    ? existingData.genres.map((g) => g._id)
                    : [],
                personnel: Array.isArray(existingData.personnel)
                    ? existingData.personnel.map((p) => p._id)
                    : [],
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

    // Handlers for react-select multi-selects
    const handlePersonnelChange = (selectedOptions) => {
        setFormData({
            ...formData,
            personnel: selectedOptions ? selectedOptions.map((option) => option.value) : [],
        });
    };

    const handleGenresChange = (selectedOptions) => {
        setFormData({
            ...formData,
            genres: selectedOptions ? selectedOptions.map((option) => option.value) : [],
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

            // Add image files if present
            if (document.getElementById('poster_path').files[0]) {
                data.append('poster', document.getElementById('poster_path').files[0]);
            }
            if (document.getElementById('backdrop_path').files[0]) {
                data.append('backdrop', document.getElementById('backdrop_path').files[0]);
            }

            const response = await fetch(url, {
                method,
                body: data,
            });

            if (!response.ok) throw new Error('Failed to save data');
            const result = await response.json();
            alert(`Successfully ${formData._id ? 'updated' : 'created'} Game`);
            if (typeof onSuccess === 'function') onSuccess(result);
        } catch (error) {
            console.error('Error saving data:', error);
            alert('Error saving data');
        }
    };

    // Convert fetched options into react-select friendly format
    const teamSelectOptions = teams.map((team) => ({
        value: team._id,
        label: team.name,
    }));

    const personnelSelectOptions = personnelOptions.map((person) => ({
        value: person._id,
        label: `${person.first_name} ${person.last_name}`,
    }));

    const genreSelectOptions = genreOptions.map((genre) => ({
        value: genre._id,
        label: genre.name,
    }));

    return (
        <div className="form-container">
            <form onSubmit={handleSubmit}>
                {formData._id && <input type="hidden" name="_id" value={formData._id} />}

                <div>
                    <label>Title: </label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Video: </label>
                    <input
                        type="checkbox"
                        name="video"
                        checked={formData.video}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Media Type: </label>
                    <input
                        type="text"
                        name="media_type"
                        value={formData.media_type}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label>Original Language: </label>
                    <input
                        type="text"
                        name="original_language"
                        value={formData.original_language}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Original Title: </label>
                    <input
                        type="text"
                        name="original_title"
                        value={formData.original_title}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Overview: </label>
                    <textarea name="overview" value={formData.overview} onChange={handleChange} />
                </div>

                <div>
                    <label>Popularity: </label>
                    <input
                        type="number"
                        name="popularity"
                        value={formData.popularity}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Poster Image: </label>
                    <input type="file" accept="image/*" id="poster_path" />
                </div>

                <div>
                    <label>Backdrop Image: </label>
                    <input type="file" accept="image/*" id="backdrop_path" />
                </div>

                <div>
                    <label>Vote Average: </label>
                    <input
                        type="number"
                        name="vote_average"
                        value={formData.vote_average}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Vote Count: </label>
                    <input
                        type="number"
                        name="vote_count"
                        value={formData.vote_count}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Date Played: </label>
                    <input
                        type="date"
                        name="date_played"
                        value={formData.date_played}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Home Score: </label>
                    <input
                        type="number"
                        name="home_score"
                        value={formData.home_score}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Away Score: </label>
                    <input
                        type="number"
                        name="away_score"
                        value={formData.away_score}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Played: </label>
                    <input
                        type="checkbox"
                        name="played"
                        checked={formData.played}
                        onChange={handleChange}
                    />
                </div>

                <div>
                    <label>Home Team: </label>
                    <select
                        name="home_team"
                        value={formData.home_team}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Home Team</option>
                        {teamSelectOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Away Team: </label>
                    <select
                        name="away_team"
                        value={formData.away_team}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select Away Team</option>
                        {teamSelectOptions.map((option) => (
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
                        options={genreSelectOptions}
                        value={genreSelectOptions.filter((option) =>
                            formData.genres.includes(option.value)
                        )}
                        onChange={handleGenresChange}
                    />
                </div>

                <div>
                    <label>Personnel: </label>
                    <Select
                        isMulti
                        name="personnel"
                        options={personnelSelectOptions}
                        value={personnelSelectOptions.filter((option) =>
                            formData.personnel.includes(option.value)
                        )}
                        onChange={handlePersonnelChange}
                    />
                </div>

                <button type="submit">{formData._id ? 'Update' : 'Create'}</button>
            </form>
        </div>
    );
};

export default GameForm;
