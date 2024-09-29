import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/authSlice';
import { FaSearch, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { FaHandshake, FaUsers, FaMobile, FaTag, FaBookmark, FaThumbtack } from 'react-icons/fa';
import './Dashboard.css';

const tiles = [
  { label: 'Partners', icon: FaHandshake },
  { label: 'Users', icon: FaUsers },
  { label: 'Devices', icon: FaMobile },
  { label: 'Label4', icon: FaTag },
  { label: 'Label5', icon: FaBookmark },
  { label: 'Label6', icon: FaThumbtack },
];

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Search..." />
        </div>
        <div className="user-info">
          <div className="username">
            <FaUser className="user-icon" />
            <span>{user?.username}</span>
          </div>
          <FaSignOutAlt className="logout-icon" onClick={handleLogout} />
        </div>
      </header>
      <div className="dashboard-content">
        <aside className="side-panel">
          <div className="tiles-container">
            {tiles.map((tile, index) => (
              <div key={index} className="tile">
                <div className="tile-icon-wrapper">
                  <tile.icon className="tile-icon-background" />
                  <tile.icon className="tile-icon-foreground" />
                </div>
                <span className="tile-label">{tile.label}</span>
              </div>
            ))}
          </div>
        </aside>
        <main className="main-content">
          <h1>Welcome to your Dashboard, {user?.username}!</h1>
          <p>Select a tile from the side panel to view more information.</p>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
