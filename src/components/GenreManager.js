import React, { useState, useEffect } from 'react';
import GenreForm from './GenreForm';
import config from '../config';

const GenreManager = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch genres from the API
    const fetchGenres = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.apiUrl}/genre`);
            if (!response.ok) throw new Error('Failed to fetch genres');
            const data = await response.json();
            // Assuming genres are returned in data.results array
            setGenres(data.results || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGenres();
    }, []);

    // Handle clicking on a genre to edit
    const handleGenreClick = (genre) => {
        setSelectedGenre(genre);
    };

    // After successful form submission, refresh the list and clear the selection
    const handleFormSuccess = (updatedGenre) => {
        fetchGenres();
        setSelectedGenre(null);
    };

    // Handle deletion of a genre
    const handleDelete = async (genreId) => {
        if (!window.confirm('Are you sure you want to delete this genre?')) {
            return;
        }
        try {
            const response = await fetch(`${config.apiUrl}/genre/${genreId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete genre');
            }
            alert('Genre deleted successfully');
            fetchGenres();
        } catch (error) {
            console.error('Error deleting genre:', error);
            alert('Error deleting genre');
        }
    };

    return (
        <div>
            {selectedGenre ? (
                <div>
                    <h2>{selectedGenre._id ? 'Update Genre' : 'Add New Genre'}</h2>
                    <GenreForm existingData={selectedGenre} onSuccess={handleFormSuccess} />
                    <button onClick={() => setSelectedGenre(null)}>Back to List</button>
                </div>
            ) : (
                <div>
                    <h2>Genres</h2>
                    {loading && <p>Loading genres...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    {genres.length > 0 ? (
                        <ul>
                            {genres.map((genre) => (
                                <li
                                    key={genre._id}
                                    style={{
                                        cursor: 'pointer',
                                        margin: '8px 0',
                                        borderBottom: '1px solid #ccc',
                                        paddingBottom: '8px',
                                    }}
                                >
                                    <span onClick={() => handleGenreClick(genre)}>
                                        {genre.name}
                                    </span>
                                    <button
                                        onClick={() => handleDelete(genre._id)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No genres found.</p>
                    )}
                    <button onClick={() => setSelectedGenre({})}>Add New Genre</button>
                </div>
            )}
        </div>
    );
};

export default GenreManager;
