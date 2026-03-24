import { useState, useEffect } from 'react';
import axios from 'axios';
import BlurText from '../components/animations/BlurText';
import { Leaf, Zap, Train, Coffee } from 'lucide-react';

export default function Activities() {
  const [activities, setActivities] = useState([]);
  const [formData, setFormData] = useState({
    type: 'transport',
    details: {}
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/activities', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setActivities(res.data);
      } catch (err) {
        console.error('Error fetching activities:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchActivities();
  }, []);

  const handleDetailChange = (e) => {
    setFormData({
      ...formData,
      details: {
        ...formData.details,
        [e.target.name]: e.target.value
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('http://localhost:5000/api/activities', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActivities([res.data, ...activities]);
      setFormData({ type: 'transport', details: {} });
    } catch (err) {
      console.error('Error adding activity:', err);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'transport': return <Train className="w-5 h-5 text-emerald-600" />;
      case 'electricity': return <Zap className="w-5 h-5 text-teal-600" />;
      case 'food': return <Coffee className="w-5 h-5 text-cyan-600" />;
      default: return <Leaf className="w-5 h-5 text-emerald-500" />;
    }
  };

  const renderFormFields = () => {
    switch (formData.type) {
      case 'transport':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Vehicle Type</label>
              <div className="relative">
                <select
                  name="vehicleType"
                  className="form-input appearance-none cursor-pointer"
                  value={formData.details.vehicleType || ''}
                  onChange={handleDetailChange}
                  required
                >
                  <option value="">Select vehicle type</option>
                  <option value="car">Car</option>
                  <option value="bus">Bus</option>
                  <option value="train">Train</option>
                  <option value="bike">Bike</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            
            {formData.details.vehicleType === 'car' && (
              <div className="mb-4 animate-[fadeIn_0.3s_ease-out]">
                <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Fuel Type</label>
                <div className="relative">
                  <select
                    name="fuelType"
                    className="form-input appearance-none cursor-pointer"
                    value={formData.details.fuelType || ''}
                    onChange={handleDetailChange}
                    required
                  >
                    <option value="">Select fuel type</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="electric">Electric</option>
                    <option value="hybrid">Hybrid</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                    <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                  </div>
                </div>
              </div>
            )}

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Distance (km)</label>
              <input
                type="number"
                name="distance"
                className="form-input"
                placeholder="e.g. 15"
                value={formData.details.distance || ''}
                onChange={handleDetailChange}
                required
              />
            </div>
          </>
        );
      case 'electricity':
        return (
          <>
             <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Energy Source</label>
              <div className="relative">
                <select
                  name="energySource"
                  className="form-input appearance-none cursor-pointer"
                  value={formData.details.energySource || ''}
                  onChange={handleDetailChange}
                  required
                >
                  <option value="">Select energy source</option>
                  <option value="coal">Coal</option>
                  <option value="natural-gas">Natural Gas</option>
                  <option value="renewable">Renewable</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">kWh Used</label>
              <input
                type="number"
                name="kWh"
                className="form-input"
                placeholder="e.g. 50"
                value={formData.details.kWh || ''}
                onChange={handleDetailChange}
                required
              />
            </div>
          </>
        );
      case 'food':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Food Type</label>
              <div className="relative">
                <select
                  name="foodType"
                  className="form-input appearance-none cursor-pointer"
                  value={formData.details.foodType || ''}
                  onChange={handleDetailChange}
                  required
                >
                  <option value="">Select food type</option>
                  <option value="meat">Meat</option>
                  <option value="dairy">Dairy</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="grains">Grains</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Quantity (kg)</label>
              <input
                type="number"
                name="quantity"
                className="form-input"
                placeholder="e.g. 2"
                value={formData.details.quantity || ''}
                onChange={handleDetailChange}
                required
              />
            </div>
          </>
        );
      default:
        return (
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">CO2 Emissions (kg)</label>
            <input
              type="number"
              name="customCO2"
              className="form-input"
              placeholder="e.g. 10"
              value={formData.details.customCO2 || ''}
              onChange={handleDetailChange}
              required
            />
          </div>
        );
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
        text="Log Your Activities"
        delay={40}
        animateBy="words"
        direction="top"
        className="text-4xl md:text-5xl font-bold mb-12 text-slate-900 tracking-tight"
      />
      
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        {/* Form Container */}
        <div className="md:col-span-5 glass-panel p-6 md:p-8 h-fit">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Add New Activity
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2 ml-1">Category</label>
              <div className="grid grid-cols-2 gap-3">
                {['transport', 'electricity', 'food', 'other'].map(type => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ type, details: {} })}
                    className={`py-3 px-4 rounded-xl text-sm font-medium capitalize flex flex-col items-center justify-center gap-2 transition-all duration-300 ${
                      formData.type === type 
                      ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 shadow-sm' 
                      : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800'
                    }`}
                  >
                    {getTypeIcon(type)}
                    {type}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-slate-50 rounded-2xl p-5 border border-slate-100">
               {renderFormFields()}
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full text-lg flex justify-center items-center gap-2 shadow-sm shadow-emerald-600/20"
            >
               <span>Log Activity</span>
               <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
               </svg>
            </button>
          </form>
        </div>
        
        {/* Recent Activities List */}
        <div className="md:col-span-7 glass-panel p-6 md:p-8 flex flex-col h-fit md:h-[calc(100vh-12rem)] md:max-h-[800px]">
          <h2 className="text-xl font-semibold text-slate-900 mb-6 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-teal-500"></span>
             Recent Activities
          </h2>
          
          <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
            {activities.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8">
                 <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 border border-slate-200">
                    <Leaf className="w-8 h-8 text-slate-400" />
                 </div>
                 <p className="text-lg text-slate-700 font-medium">No activities logged yet.</p>
                 <p className="text-slate-500 mt-2">Add your first activity on the left to start tracking.</p>
              </div>
            ) : (
              activities.map((activity) => (
                <div key={activity._id} className="group glass-card p-5 border-l-4 border-l-emerald-500 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center p-2.5">
                       {getTypeIcon(activity.type)}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900 capitalize text-lg">{activity.type}</p>
                      <p className="text-xs text-slate-500 mt-1">{new Date(activity.date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">
                      {activity.co2e.toFixed(2)}
                    </p>
                    <p className="text-xs text-slate-500 tracking-wider font-semibold">kg CO2</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}