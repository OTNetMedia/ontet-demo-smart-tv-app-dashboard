import React, { useState, useEffect } from 'react';
import GameForm from './GameForm';
import config from '../config';

const GameManager = () => {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchGames = async (pageNumber = 1) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.apiUrl}/game?page=${pageNumber}&limit=5`);
            if (!response.ok) throw new Error('Failed to fetch games');
            const data = await response.json();
            setGames(data.results);
            setPage(data.page);
            setTotalPages(data.total_pages);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchGames(page);
    }, [page]);

    const handleGameClick = (game) => setSelectedGame(game);

    const handleFormSuccess = () => {
        fetchGames(page);
        setSelectedGame(null);
    };

    const handleNextPage = () => {
        if (page < totalPages) setPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (page > 1) setPage((prev) => prev - 1);
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm('Are you sure you want to delete this game?');
        if (!confirmed) return;

        try {
            const res = await fetch(`${config.apiUrl}/game/${id}`, { method: 'DELETE' });
            if (!res.ok) throw new Error('Failed to delete game');
            fetchGames(page);
        } catch (err) {
            alert('Error deleting game: ' + err.message);
        }
    };

    return (
        <div className="max-w-6xl mx-auto">
            {selectedGame ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            {selectedGame._id ? 'Update Game' : 'Add New Game'}
                        </h2>
                        <button
                            onClick={() => setSelectedGame(null)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                        >
                            Back to List
                        </button>
                    </div>
                    <GameForm existingData={selectedGame} onSuccess={handleFormSuccess} />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            Games (Page {page} of {totalPages})
                        </h2>
                        <button
                            onClick={() => setSelectedGame({})}
                            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Add New Game
                        </button>
                    </div>

                    {loading && <p className="text-slate-600">Loading games...</p>}
                    {error && <p className="text-red-600">Error: {error}</p>}

                    {games.length > 0 ? (
                        <ul className="space-y-4">
                            {games.map((game) => (
                                <li
                                    key={game._id}
                                    onClick={() => handleGameClick(game)}
                                    className="flex gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md cursor-pointer transition"
                                >
                                    {/* Poster */}
                                    {game.poster_path && (
                                        <img
                                            src={game.poster_path}
                                            alt="Poster"
                                            className="h-28 w-20 rounded-md object-cover flex-shrink-0"
                                        />
                                    )}

                                    {/* Game Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-semibold text-slate-800">
                                                    {game.title || 'Untitled Game'}
                                                </h3>
                                                <p className="text-sm text-slate-500">
                                                    {game.original_title && (
                                                        <span className="italic">
                                                            {game.original_title}
                                                        </span>
                                                    )}
                                                    {game.original_language && (
                                                        <span>
                                                            {' '}
                                                            • Lang: {game.original_language}
                                                        </span>
                                                    )}
                                                </p>
                                            </div>
                                            <p className="text-xs text-slate-400">
                                                ID: <span className="font-mono">{game._id}</span>
                                            </p>
                                        </div>

                                        {/* Teams and Score */}
                                        {game.home_team && game.away_team && (
                                            <p className="mt-2 text-slate-700 font-medium">
                                                {game.home_team.name} {game.home_score} -{' '}
                                                {game.away_score} {game.away_team.name}
                                            </p>
                                        )}

                                        {/* Played / Date */}
                                        <p className="text-sm text-slate-500">
                                            {game.date_played
                                                ? `Date Played: ${new Date(
                                                      game.date_played
                                                  ).toLocaleDateString()}`
                                                : 'Not Played Yet'}
                                            {game.played && (
                                                <span className="ml-2 text-green-600">
                                                    (Played)
                                                </span>
                                            )}
                                        </p>

                                        {/* Genres */}
                                        {game.genres?.length > 0 && (
                                            <p className="text-sm text-slate-600">
                                                <span className="font-medium text-slate-700">
                                                    Genres:
                                                </span>{' '}
                                                {game.genres.map((g) => g.name).join(', ')}
                                            </p>
                                        )}

                                        {/* Personnel */}
                                        {game.personnel?.length > 0 && (
                                            <p className="text-sm text-slate-600">
                                                <span className="font-medium text-slate-700">
                                                    Personnel:
                                                </span>{' '}
                                                {game.personnel
                                                    .map((p) => `${p.first_name} ${p.last_name}`)
                                                    .join(', ')}
                                            </p>
                                        )}

                                        {/* Votes & Popularity */}
                                        <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-500">
                                            <span>Votes: {game.vote_count}</span>
                                            <span>Average: {game.vote_average}</span>
                                            <span>Popularity: {game.popularity}</span>
                                            <span>Media: {game.media_type || 'N/A'}</span>
                                            <span>Video: {game.video ? 'Yes' : 'No'}</span>
                                        </div>
                                    </div>

                                    {/* Backdrop */}
                                    {game.backdrop_path && (
                                        <img
                                            src={game.backdrop_path}
                                            alt="Backdrop"
                                            className="h-24 w-36 rounded-md object-cover flex-shrink-0"
                                        />
                                    )}

                                    {/* Delete Button */}
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDelete(game._id);
                                        }}
                                        className="self-start rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-600">No games found.</p>
                    )}

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-3 pt-4">
                        <button
                            onClick={handlePrevPage}
                            disabled={page === 1}
                            className={`rounded-md border px-3 py-1 text-sm ${
                                page === 1
                                    ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            Previous
                        </button>
                        <span className="text-sm text-slate-600">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={page === totalPages}
                            className={`rounded-md border px-3 py-1 text-sm ${
                                page === totalPages
                                    ? 'border-slate-200 text-slate-400 cursor-not-allowed'
                                    : 'border-slate-300 text-slate-700 hover:bg-slate-100'
                            }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GameManager;
