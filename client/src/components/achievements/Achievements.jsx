import { useEffect, useState } from 'react';
import axios from 'axios';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ targetScore: '', deadline: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/auth/me', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setAchievements(res.data.achievements || []);
        setGoals(res.data.goals || []);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, []);

  const handleAddGoal = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/achievements/goals',
        newGoal,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setGoals(res.data);
      setNewGoal({ targetScore: '', deadline: '' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="achievements-container">
      <h2>Your Achievements</h2>
      {achievements.length > 0 ? (
        <ul className="achievements-list">
          {achievements.map((ach, i) => (
            <li key={i}>
              <h3>{ach.name}</h3>
              <p>{ach.description}</p>
              <small>Earned on: {new Date(ach.earnedAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      ) : (
        <p>No achievements yet. Keep logging activities!</p>
      )}

      <div className="goals-section">
        <h2>Set New Goal</h2>
        <form onSubmit={handleAddGoal}>
          <label>
            Target Carbon Score:
            <input 
              type="number" 
              value={newGoal.targetScore}
              onChange={(e) => setNewGoal({...newGoal, targetScore: e.target.value})}
              required
            />
          </label>
          <label>
            Deadline:
            <input
              type="date"
              value={newGoal.deadline}
              onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
              required
            />
          </label>
          <button type="submit">Set Goal</button>
        </form>

        <h3>Your Goals</h3>
        {goals.length > 0 ? (
          <ul className="goals-list">
            {goals.map((goal, i) => (
              <li key={i} className={goal.achieved ? 'achieved' : ''}>
                <p>Target: {goal.targetScore} kg CO2 by {new Date(goal.deadline).toLocaleDateString()}</p>
                <p>Status: {goal.achieved ? 'Achieved!' : 'In progress'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No goals set yet</p>
        )}
      </div>
    </div>
  );
}