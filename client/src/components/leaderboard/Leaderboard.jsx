import { useEffect, useState } from 'react';
import axios from 'axios';
import BlurText from './../animations/BlurText';
import { Trophy, Medal, Crown } from 'lucide-react';

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

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Crown className="w-6 h-6 text-amber-500" />;
      case 1: return <Medal className="w-6 h-6 text-slate-400" />;
      case 2: return <Medal className="w-6 h-6 text-amber-700" />;
      default: return <span className="font-bold text-slate-400 w-6 text-center">{index + 1}</span>;
    }
  };

  const getRankStyle = (index) => {
    switch(index) {
      case 0: return 'bg-amber-50 border-amber-100';
      case 1: return 'bg-slate-100 border-slate-200';
      case 2: return 'bg-amber-100/50 border-amber-200/50';
      default: return 'bg-white border-slate-100';
    }
  };

  const getScoreStyle = (index) => {
      switch(index) {
          case 0: return 'text-amber-600 drop-shadow-sm';
          case 1: return 'text-slate-600 drop-shadow-sm';
          case 2: return 'text-amber-700 drop-shadow-sm';
          default: return 'text-emerald-600';
      }
  }

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto relative">
      <div className="absolute top-20 right-10 w-[400px] h-[400px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="text-center mb-12 relative z-10">
        <BlurText
          text="Eco Leaderboard"
          delay={40}
          animateBy="words"
          direction="top"
          className="text-4xl md:text-6xl font-black mb-4 text-emerald-700 tracking-tight justify-center"
        />
        <p className="text-slate-500 text-lg">Top 20 most eco-friendly champions</p>
      </div>
      
      <div className="glass-panel p-2 md:p-6 relative z-10 mx-auto max-w-4xl shadow-md border-slate-200/60 bg-white/80 backdrop-blur-3xl">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-sm uppercase tracking-wider text-slate-500 font-semibold">
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Eco Warrior</th>
                <th className="px-6 py-4 text-right">Carbon Score</th>
                <th className="px-6 py-4 text-center">Achievements</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {users.map((user, index) => (
                <tr 
                  key={user._id} 
                  className={`group transition-all duration-300 hover:bg-slate-50 ${getRankStyle(index)} ${index < 3 ? 'font-medium' : ''}`}
                >
                  <td className="px-6 py-4 w-20">
                    <div className="flex items-center justify-center">
                      {getRankIcon(index)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${index === 0 ? 'bg-amber-400 text-amber-900 border border-amber-500' : index === 1 ? 'bg-slate-200 text-slate-700 border border-slate-300' : index === 2 ? 'bg-amber-600 text-white border border-amber-700' : 'bg-emerald-100 text-emerald-700 border border-emerald-200'}`}>
                         {user.username.charAt(0).toUpperCase()}
                      </div>
                      <span className={`text-base tracking-wide ${index < 3 ? 'font-bold text-slate-900' : 'text-slate-700'}`}>
                        {user.username}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className={`text-xl font-bold tracking-tight ${getScoreStyle(index)}`}>
                      {user.carbonScore.toFixed(2)}
                    </span>
                    <span className="text-xs text-slate-500 ml-1 uppercase">kg</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-slate-50 border border-slate-200 shadow-sm">
                       <Trophy className="w-3.5 h-3.5 text-amber-500" />
                       <span className="font-semibold text-slate-700">{user.achievementsCount || 0}</span>
                    </div>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                   <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                      No eco-warriors found yet. Be the first to join the leaderboard!
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}