import React, { useState, useEffect } from 'react';
import TeamForm from './TeamForm';
import config from '../config';

const TeamManager = () => {
    const [teams, setTeams] = useState([]);
    const [selectedTeam, setSelectedTeam] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTeams = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`${config.apiUrl}/team`);
            if (!response.ok) throw new Error('Failed to fetch teams');
            const data = await response.json();
            setTeams(data.results || []);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTeams();
    }, []);

    const handleTeamClick = (team) => setSelectedTeam(team);

    const handleFormSuccess = () => {
        fetchTeams();
        setSelectedTeam(null);
    };

    return (
        <div className="max-w-5xl mx-auto">
            {selectedTeam ? (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">
                            {selectedTeam._id ? 'Update Team' : 'Add New Team'}
                        </h2>
                        <button
                            onClick={() => setSelectedTeam(null)}
                            className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-100"
                        >
                            Back to List
                        </button>
                    </div>

                    <TeamForm existingData={selectedTeam} onSuccess={handleFormSuccess} />
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-semibold text-slate-800">Teams</h2>
                        <button
                            onClick={() => setSelectedTeam({})}
                            className="rounded-md bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                        >
                            Add New Team
                        </button>
                    </div>

                    {loading && <p className="text-slate-600">Loading teams...</p>}
                    {error && <p className="text-red-600">Error: {error}</p>}

                    {teams.length > 0 ? (
                        <ul className="space-y-3">
                            {teams.map((team) => (
                                <li
                                    key={team._id}
                                    onClick={() => handleTeamClick(team)}
                                    className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition cursor-pointer"
                                >
                                    <div className="font-medium text-slate-800 text-lg">
                                        {team.name}
                                    </div>

                                    {team.organization?.name && (
                                        <div className="text-sm text-slate-600 mt-1">
                                            <span className="font-medium text-slate-700">
                                                Organization:
                                            </span>{' '}
                                            {team.organization.name}
                                        </div>
                                    )}

                                    <div className="text-sm text-slate-600 mt-1">
                                        <span className="font-medium text-slate-700">Genres:</span>{' '}
                                        {team.genres?.length
                                            ? team.genres.map((g) => g.name).join(', ')
                                            : 'None'}
                                    </div>

                                    <div className="text-sm text-slate-600 mt-1">
                                        <span className="font-medium text-slate-700">
                                            Personnel:
                                        </span>{' '}
                                        {team.personnel?.length
                                            ? team.personnel
                                                  .map((p) => `${p.first_name} ${p.last_name}`)
                                                  .join(', ')
                                            : 'None'}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-600">No teams found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default TeamManager;
