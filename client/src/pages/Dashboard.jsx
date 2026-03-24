import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [carbonScore, setCarbonScore] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch data function
  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { Authorization: `Bearer ${token}` }};

      const [userRes, activitiesRes, suggestionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/me', config),
        axios.get('http://localhost:5000/api/activities', config),
        axios.get('http://localhost:5000/api/suggestions', config)
      ]);

      console.log('User Data:', userRes.data);
      console.log('Activities:', activitiesRes.data);
      console.log('Suggestions:', suggestionsRes.data);

      setCarbonScore(userRes.data.carbonScore);
      setActivities(activitiesRes.data);
      setSuggestions(suggestionsRes.data);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch on mount
  useEffect(() => {
    fetchData();
  }, []);

  // Polling every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Prepare chart data
  const getChartData = () => {
    const categories = ['transport', 'electricity', 'food', 'other'];
    const initialData = { transport: 0, electricity: 0, food: 0, other: 0 };

    activities.forEach(activity => {
      if (categories.includes(activity.type)) {
        initialData[activity.type] += activity.co2e;
      }
    });

    return {
      labels: ['Transport', 'Electricity', 'Food', 'Other'],
      datasets: [{
        label: 'CO2 Emissions (kg)',
        data: [
          initialData.transport,
          initialData.electricity,
          initialData.food,
          initialData.other
        ],
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        borderWidth: 1
      }]
    };
  };

  if (loading) return <div className="loading-spinner">Loading...</div>;

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Your Carbon Footprint Dashboard</h1>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h2>Your Carbon Score</h2>
          <p className="carbon-score">{carbonScore.toFixed(2)} kg CO2</p>
        </div>

        <div className="summary-card">
          <h2>Activities Logged</h2>
          <p className="activity-count">{activities.length}</p>
        </div>

        <div className="summary-card">
          <h2>Potential Savings</h2>
          <p className="savings">
            {suggestions.reduce((sum, s) => sum + (s.potentialSavings || 0), 0).toFixed(2)} kg CO2
          </p>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="chart-card">
          <h2>Emissions by Category</h2>
          <div className="chart-wrapper">
            <Bar 
              data={getChartData()} 
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: 'kg CO2'
                    }
                  }
                }
              }} 
            />
          </div>
        </div>

        <div className="suggestions-card">
          <h2>Suggestions to Reduce</h2>
          {suggestions.length > 0 ? (
            <ul className="suggestions-list">
              {suggestions.map((suggestion, index) => (
                <li key={index} className="suggestion-item">
                  <p className="suggestion-text">{suggestion.suggestion}</p>
                  <p className="suggestion-savings">
                    Potential savings: {suggestion.potentialSavings.toFixed(2)} kg CO2
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-suggestions">No suggestions available. Log some activities first!</p>
          )}
        </div>
      </div>
    </div>
  );
}
