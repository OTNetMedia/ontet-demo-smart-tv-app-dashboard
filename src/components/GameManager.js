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

    const handleGameClick = (game) => {
        setSelectedGame(game);
    };

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
            const res = await fetch(`${config.apiUrl}/game/${id}`, {
                method: 'DELETE',
            });

            if (!res.ok) throw new Error('Failed to delete game');

            fetchGames(page); // Refresh list after deletion
        } catch (err) {
            alert('Error deleting game: ' + err.message);
        }
    };

    return (
        <div>
            {selectedGame ? (
                <div>
                    <h2>{selectedGame._id ? 'Update Game' : 'Add New Game'}</h2>
                    <GameForm existingData={selectedGame} onSuccess={handleFormSuccess} />
                    <button onClick={() => setSelectedGame(null)}>Back to List</button>
                </div>
            ) : (
                <div>
                    <h2>
                        Games (Page {page} of {totalPages})
                    </h2>
                    {loading && <p>Loading games...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}

                    {games.length > 0 ? (
                        <ul>
                            {games.map((game) => (
                                <li
                                    key={game._id}
                                    onClick={() => handleGameClick(game)}
                                    style={{
                                        cursor: 'pointer',
                                        margin: '12px 0',
                                        padding: '8px',
                                        border: '1px solid #ccc',
                                        borderRadius: '8px',
                                        alignItems: 'center',
                                        gap: '12px',
                                    }}
                                >
                                    {game.poster_path && (
                                        <img
                                            src={game.poster_path}
                                            alt="Poster"
                                            style={{
                                                width: '60px',
                                                height: '90px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <strong>{game.title}</strong> - {game.date_played}
                                        {game.home_team && game.away_team && (
                                            <div>
                                                {game.home_team.name} vs {game.away_team.name}
                                            </div>
                                        )}
                                    </div>
                                    {game.backdrop_path && (
                                        <img
                                            src={game.backdrop_path}
                                            alt="Backdrop"
                                            style={{
                                                width: '120px',
                                                height: '68px',
                                                objectFit: 'cover',
                                            }}
                                        />
                                    )}
                                    <button
                                        onClick={() => handleDelete(game._id)}
                                        style={{
                                            marginLeft: '12px',
                                            backgroundColor: '#e74c3c',
                                            color: 'white',
                                            border: 'none',
                                            padding: '6px 10px',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        Delete
                                    </button>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No games found.</p>
                    )}

                    {/* Pagination */}
                    <div style={{ marginTop: '20px' }}>
                        <button onClick={handlePrevPage} disabled={page === 1}>
                            Previous
                        </button>
                        <button onClick={handleNextPage} disabled={page === totalPages}>
                            Next
                        </button>
                    </div>

                    <button style={{ marginTop: '20px' }} onClick={() => setSelectedGame({})}>
                        Add New Game
                    </button>
                </div>
            )}
        </div>
    );
};

export default GameManager;
