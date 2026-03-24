import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import BlurText from '../components/animations/BlurText';
import LightRays from '../components/animations/LightRays';
import AnimatedList from '../components/animations/AnimatedList';

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
      if (!token) { setLoading(false); return; }
      
      const config = { headers: { Authorization: `Bearer ${token}` }};

      const [userRes, activitiesRes, suggestionsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/auth/me', config).catch(() => ({ data: { carbonScore: 0 } })),
        axios.get('http://localhost:5000/api/activities', config).catch(() => ({ data: [] })),
        axios.get('http://localhost:5000/api/suggestions', config).catch(() => ({ data: [] }))
      ]);

      setCarbonScore(userRes.data?.carbonScore || 0);
      setActivities(activitiesRes.data || []);
      setSuggestions(suggestionsRes.data || []);
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

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
        backgroundColor: ['rgba(16, 185, 129, 0.8)', 'rgba(20, 184, 166, 0.8)', 'rgba(6, 182, 212, 0.8)', 'rgba(148, 163, 184, 0.8)'],
        borderColor: ['#10B981', '#14B8A6', '#06B6D4', '#94A3B8'],
        borderWidth: 1,
        borderRadius: 6,
      }]
    };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { color: 'rgba(15, 23, 42, 0.8)' } }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0, 0, 0, 0.05)' },
        ticks: { color: 'rgba(15, 23, 42, 0.7)' }
      },
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(15, 23, 42, 0.7)' }
      }
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-hidden pb-20">
      {/* Background Effect */}
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100vh', zIndex: 0 }}>
        <LightRays
          raysOrigin="top-center"
          raysColor="rgba(16, 185, 129, 0.05)"
          raysSpeed={1.5}
          lightSpread={0.8}
          rayLength={3}
          followMouse={true}
          mouseInfluence={0.15}
        />
      </div>

      <div className="container mx-auto px-6 pt-32 relative z-10 max-w-6xl">
        <BlurText
          text="Your Carbon Footprint Dashboard"
          delay={50}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-5xl font-bold mb-12 text-slate-900 tracking-tight"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <h2 className="text-slate-500 font-medium mb-2 uppercase tracking-wider text-sm">Carbon Score</h2>
            <p className="text-5xl font-black text-slate-900">{carbonScore.toFixed(2)}</p>
            <p className="text-emerald-600 font-medium text-sm mt-1">kg CO2</p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <h2 className="text-slate-500 font-medium mb-2 uppercase tracking-wider text-sm">Activities Logged</h2>
            <p className="text-5xl font-black text-slate-900">{activities.length}</p>
            <p className="text-teal-600 font-medium text-sm mt-1">Total entries</p>
          </div>

          <div className="glass-card p-6 flex flex-col items-center justify-center">
            <h2 className="text-slate-500 font-medium mb-2 uppercase tracking-wider text-sm">Potential Savings</h2>
            <p className="text-5xl font-black text-slate-900">
              {suggestions.reduce((sum, s) => sum + (s.potentialSavings || 0), 0).toFixed(2)}
            </p>
            <p className="text-cyan-600 font-medium text-sm mt-1">kg CO2</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 glass-panel p-6 md:p-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Emissions by Category
            </h2>
            <div className="h-[350px] w-full relative">
              <Bar data={getChartData()} options={chartOptions} />
            </div>
          </div>

          <div className="glass-panel p-6 md:p-8 flex flex-col h-full">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-teal-500"></span>
              Smart Suggestions
            </h2>
            
            <div className="flex-1">
              {suggestions.length > 0 ? (
                <AnimatedList
                  items={suggestions}
                  showGradients={true}
                  displayScrollbar={true}
                  className="h-full"
                  onItemSelect={(item) => console.log('Selected:', item.suggestion)}
                />
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 border border-slate-100 rounded-2xl bg-slate-50">
                  <p className="text-slate-500 italic">No suggestions available.</p>
                  <p className="text-sm text-slate-400 mt-2">Log more activities to get personalized tips!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
