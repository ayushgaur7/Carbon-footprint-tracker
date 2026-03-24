import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import BlurText from '../components/animations/BlurText';
import { Leaf } from 'lucide-react';

export default function Login() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData);
      localStorage.setItem('token', res.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center p-6 relative overflow-hidden bg-slate-50">
      {/* Background gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-teal-500/5 rounded-full blur-[80px] pointer-events-none"></div>

      <div className="glass-panel w-full max-w-md p-8 md:p-10 relative z-10">
        <div className="flex justify-center mb-8">
           <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center p-2.5 shadow-sm">
             <Leaf className="w-full h-full text-emerald-600" />
           </div>
        </div>

        <div className="text-center mb-8">
          <BlurText text="Welcome Back" className="text-3xl font-bold text-slate-900 justify-center mb-2" />
          <p className="text-slate-500">Sign in to track your carbon footprint</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm text-center font-medium animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Email Address</label>
            <input
              type="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Password</label>
            <input
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
            />
          </div>
          <button 
            type="submit" 
            className="btn-primary w-full mt-2 flex justify-center items-center h-12"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Don't have an account? <Link to="/register" className="text-emerald-600 hover:text-emerald-700 font-medium">Create one</Link>
        </p>
      </div>
    </div>
  );
}