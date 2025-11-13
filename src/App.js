// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import CreateOrganisation from './components/OrganizationManager';
import CreateTeam from './components/TeamManager';
import CreatePersonnel from './components/PersonnelManager';
import CreateGame from './components/GameManager';
import CreateGenre from './components/GenreManager';

const navItems = [
    { to: '/create-organisation', label: 'Organisations' },
    { to: '/create-team', label: 'Teams' },
    { to: '/create-personnel', label: 'Personnel' },
    { to: '/create-game', label: 'Games' },
    { to: '/create-genre', label: 'Genres' },
];

function App() {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50 text-slate-800">
                <header className="border-b bg-white">
                    <div className="mx-auto max-w-6xl px-4">
                        {/* Top header */}
                        <div className="flex items-center justify-between py-4">
                            <span className="text-lg font-semibold tracking-tight">
                                Content Admin
                            </span>
                            <a
                                href={`${
                                    process.env.REACT_APP_API_URL || 'http://localhost:5001'
                                }/api/game`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="rounded-full bg-slate-800 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700"
                            >
                                Open API
                            </a>
                        </div>

                        {/* Navigation */}
                        <nav className="pb-3 border-t pt-3">
                            <ul className="flex gap-2 overflow-x-auto">
                                {navItems.map((item) => (
                                    <li key={item.to}>
                                        <NavLink
                                            to={item.to}
                                            className={({ isActive }) =>
                                                [
                                                    'inline-block rounded-full px-4 py-2 text-sm transition-colors',
                                                    isActive
                                                        ? 'bg-slate-900 text-white'
                                                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200',
                                                ].join(' ')
                                            }
                                        >
                                            {item.label}
                                        </NavLink>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </header>

                <main className="mx-auto max-w-6xl px-4 py-6">
                    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        <Routes>
                            <Route path="/create-organisation" element={<CreateOrganisation />} />
                            <Route path="/create-team" element={<CreateTeam />} />
                            <Route path="/create-personnel" element={<CreatePersonnel />} />
                            <Route path="/create-game" element={<CreateGame />} />
                            <Route path="/create-genre" element={<CreateGenre />} />
                        </Routes>
                    </div>
                </main>
            </div>
        </Router>
    );
}

export default App;
