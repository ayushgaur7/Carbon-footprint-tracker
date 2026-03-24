import { useEffect, useState } from 'react';
import axios from 'axios';
import BlurText from './../animations/BlurText';
import { Target, Award, Calendar } from 'lucide-react';

export default function Achievements() {
  const [achievements, setAchievements] = useState([]);
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState({ targetScore: '', deadline: '' });
  const [loading, setLoading] = useState(true);

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
      } finally {
        setLoading(false);
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

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-12 h-12 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <BlurText
        text="Milestones & Goals"
        delay={40}
        animateBy="words"
        direction="top"
        className="text-4xl md:text-5xl font-bold mb-12 text-slate-900 tracking-tight"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Achievements Section */}
        <div className="glass-panel p-6 md:p-8">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <Award className="w-6 h-6 text-amber-500" />
            Your Achievements
          </h2>
          
          <div className="space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar pr-2">
            {achievements.length > 0 ? (
              achievements.map((ach, i) => (
                <div key={i} className="glass-card p-5 border-l-4 border-l-amber-400 flex items-start gap-4">
                   <div className="w-12 h-12 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                      <Award className="w-6 h-6 text-amber-500" />
                   </div>
                   <div>
                     <h3 className="text-lg font-bold text-slate-900 mb-1">{ach.name}</h3>
                     <p className="text-slate-600 text-sm mb-2 leading-relaxed">{ach.description}</p>
                     <p className="text-xs text-slate-500 bg-slate-50 inline-block px-2 py-1 rounded-md border border-slate-100">
                        Earned: {new Date(ach.earnedAt).toLocaleDateString()}
                     </p>
                   </div>
                </div>
              ))
            ) : (
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-8 text-center">
                 <Award className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                 <p className="text-lg text-slate-700">No achievements yet.</p>
                 <p className="text-slate-500 mt-2 text-sm">Keep logging activities and lowering your footprint to unlock badges!</p>
              </div>
            )}
          </div>
        </div>

        {/* Goals Section */}
        <div className="space-y-8">
          <div className="glass-panel p-6 md:p-8 border-t-4 border-t-teal-500">
            <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
               <Target className="w-6 h-6 text-teal-500" />
               Set New Goal
            </h2>
            <form onSubmit={handleAddGoal} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Target Carbon Score (kg)</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="form-input"
                  placeholder="e.g. 100"
                  value={newGoal.targetScore}
                  onChange={(e) => setNewGoal({...newGoal, targetScore: e.target.value})}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Deadline</label>
                <input
                  type="date"
                  className="form-input css-date-icon-fix"
                  value={newGoal.deadline}
                  onChange={(e) => setNewGoal({...newGoal, deadline: e.target.value})}
                  required
                />
              </div>
              <button type="submit" className="btn-primary w-full mt-2">
                Create Goal
              </button>
            </form>
          </div>

          <div className="glass-panel p-6 md:p-8">
             <h3 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-emerald-500" />
                Active Goals
             </h3>
             <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
              {goals.length > 0 ? (
                goals.map((goal, i) => (
                  <div key={i} className={`glass-card p-5 border-l-4 ${goal.achieved ? 'border-l-emerald-500 bg-emerald-50' : 'border-l-teal-500'}`}>
                    <div className="flex justify-between items-start mb-2">
                       <p className="font-semibold text-slate-900">Target: {goal.targetScore} kg</p>
                       <span className={`text-xs px-2 py-1 rounded-full font-medium ${goal.achieved ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-teal-50 text-teal-700 border border-teal-200'}`}>
                          {goal.achieved ? 'Achieved!' : 'In progress'}
                       </span>
                    </div>
                    <p className="text-sm text-slate-500 flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      By {new Date(goal.deadline).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
                    </p>
                  </div>
                ))
              ) : (
                <div className="text-center p-6 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-500">No active goals.</p>
                </div>
              )}
             </div>
          </div>
        </div>

      </div>
    </div>
  );
}