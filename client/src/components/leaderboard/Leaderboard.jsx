import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/leaderboard');
        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, []);

  if (loading) return <div>Loading leaderboard...</div>;

  return (
    <div className="leaderboard-container">
      <h2>Eco Leaderboard</h2>
      <p>Top 20 most eco-friendly users</p>
      
      <table>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Username</th>
            <th>Carbon Score</th>
            <th>Achievements</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user._id}>
              <td>{index + 1}</td>
              <td>{user.username}</td>
              <td>{user.carbonScore.toFixed(2)} kg</td>
              <td>{user.achievementsCount || 0}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}