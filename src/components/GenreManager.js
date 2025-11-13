import React, { useState, useEffect } from 'react';
import GenreForm from './GenreForm';
import config from '../config';

const GenreManager = () => {
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchGenres = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.apiUrl}/genre`);
            if (!response.ok) throw new Error('Failed to fetch genres');
            const data = await response.json();
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

    const handleGenreClick = (genre) => setSelectedGenre(genre);

    const handleFormSuccess = () => {
        fetchGenres();
        setSelectedGenre(null);
    };

    const handleDelete = async (genreId) => {
        if (!window.confirm('Are you sure you want to delete this genre?')) return;

        try {
            const response = await fetch(`${config.apiUrl}/genre/${genreId}`, {
                method: 'DELETE',
            });
            if (!response.ok) throw new Error('Failed to delete genre');
            alert('Genre deleted successfully');
            fetchGenres();
        } catch (error) {
            console.error('Error deleting genre:', error);
            alert('Error deleting genre');
        }
    };

    return (
        <div className="max-w-4xl mx-auto">
            {selectedGenre ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            {selectedGenre._id ? 'Update Genre' : 'Add New Genre'}
                        </h2>
                        <button
                            onClick={() => setSelectedGenre(null)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                        >
                            Back to List
                        </button>
                    </div>

                    <GenreForm existingData={selectedGenre} onSuccess={handleFormSuccess} />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">Genres</h2>
                        <button
                            onClick={() => setSelectedGenre({})}
                            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Add New Genre
                        </button>
                    </div>

                    {loading && <p className="text-slate-600">Loading genres...</p>}
                    {error && <p className="text-red-600">Error: {error}</p>}

                    {genres.length > 0 ? (
                        <ul className="space-y-3">
                            {genres.map((genre) => (
                                <li
                                    key={genre._id}
                                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 shadow-sm hover:shadow-md transition cursor-pointer"
                                >
                                    <span
                                        onClick={() => handleGenreClick(genre)}
                                        className="text-slate-800 font-medium hover:text-slate-600"
                                    >
                                        {genre.name}
                                    </span>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(genre._id);
                                        }}
                                        className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-600">No genres found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default GenreManager;
