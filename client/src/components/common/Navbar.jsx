import { Link } from 'react-router-dom';

export default function Navbar() {
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <nav className="navbar">
      <div className="container flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-white">Carbon Footprint Tracker</Link>
        
        <div className="nav-links">
          {token ? (
            <>
              <Link to="/dashboard">Dashboard</Link>
              <Link to="/activities">Activities</Link>
              <Link to="/achievements">Achievements</Link>
              <Link to="/leaderboard">Leaderboard</Link>
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}