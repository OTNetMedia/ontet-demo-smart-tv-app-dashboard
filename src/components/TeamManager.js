import React, { useState, useEffect } from 'react';
import TeamForm from './TeamForm';
import config from '../config';

const TeamManager = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetch teams from the API
    const fetchTeams = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.apiUrl}/team`);
            if (!response.ok) throw new Error('Failed to fetch teams');
            const data = await response.json();
            // Assume API returns data.results as an array of teams
            setTeams(data.results);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    // Handle clicking on a team to edit
    const handleTeamClick = (team) => {
        setSelectedTeam(team);
    };

    // After a successful form submission, refresh the list and clear the selection.
    const handleFormSuccess = (updatedTeam) => {
        fetchTeams();
        setSelectedTeam(null);
    };

    return (
        <div>
            {selectedTeam ? (
                <div>
                    <h2>{selectedTeam._id ? 'Update Team' : 'Add New Team'}</h2>
                    <TeamForm existingData={selectedTeam} onSuccess={handleFormSuccess} />
                    <button onClick={() => setSelectedTeam(null)}>Back to List</button>
                </div>
            ) : (
                <div>
                    <h2>Teams</h2>
                    {loading && <p>Loading teams...</p>}
                    {error && <p style={{ color: 'red' }}>Error: {error}</p>}
                    {teams.length > 0 ? (
                        <ul>
                            {teams.map((team) => (
                                <li
                                    key={team._id}
                                    onClick={() => handleTeamClick(team)}
                                    style={{
                                        cursor: 'pointer',
                                        margin: '8px 0',
                                        borderBottom: '1px solid #ccc',
                                        paddingBottom: '8px',
                                    }}
                                >
                                    <div>
                                        <strong>{team.name}</strong>
                                        {team.organization && team.organization.name && (
                                            <span> - Organization: {team.organization.name}</span>
                                        )}
                                    </div>
                                    <div>
                                        <strong>Genres: </strong>
                                        {team.genres && team.genres.length
                                            ? team.genres.map((g) => g.name).join(', ')
                                            : 'None'}
                                    </div>
                                    <div>
                                        <strong>Personnel: </strong>
                                        {team.personnel && team.personnel.length
                                            ? team.personnel
                                                  .map((p) => `${p.first_name} ${p.last_name}`)
                                                  .join(', ')
                                            : 'None'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No teams found.</p>
                    )}
                    <button onClick={() => setSelectedTeam({})}>Add New Team</button>
                </div>
            )}
        </div>
    );
};

export default TeamManager;
