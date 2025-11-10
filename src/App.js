// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import CreateOrganisation from './components/OrganizationManager';
import CreateTeam from './components/TeamManager';
import CreatePersonnel from './components/PersonnelManager';
import CreateGame from './components/GameManager';
import CreateGenre from './components/GenreManager';

function App() {
    return (
        <Router>
            <div>
                <nav style={{ marginBottom: '20px' }}>
                    <ul style={{ listStyle: 'none', display: 'flex', gap: '10px' }}>
                        <li>
                            <Link to="/create-organisation">Create Organisation</Link>
                        </li>
                        <li>
                            <Link to="/create-team">Create Team</Link>
                        </li>
                        <li>
                            <Link to="/create-personnel">Create Personnel</Link>
                        </li>
                        <li>
                            <Link to="/create-game">Create Game</Link>
                        </li>
                        <li>
                            <Link to="/create-genre">Create Genre</Link>
                        </li>
                    </ul>
                </nav>
                <Routes>
                    <Route path="/create-organisation" element={<CreateOrganisation />} />
                    <Route path="/create-team" element={<CreateTeam />} />
                    <Route path="/create-personnel" element={<CreatePersonnel />} />
                    <Route path="/create-game" element={<CreateGame />} />
                    <Route path="/create-genre" element={<CreateGenre />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
