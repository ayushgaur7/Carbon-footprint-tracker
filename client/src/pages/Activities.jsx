import { useState, useEffect } from 'react';
import axios from 'axios';

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

  const handleTypeChange = (e) => {
    setFormData({
      type: e.target.value,
      details: {}
    });
  };

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
      // This is where your error is being logged
      console.error('Error adding activity:', err);
    }
  };

  // This is the component that renders the dynamic fields
  const renderFormFields = () => {
    switch (formData.type) {
      case 'transport':
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2">Vehicle Type</label>
              <select
                name="vehicleType"
                className="form-control"
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
            </div>
            
            {/* FIX: Only show "Fuel Type" if the vehicleType is 'car'.
              This was the main bug in your form.
            */}
            {formData.details.vehicleType === 'car' && (
              <div className="mb-4">
                <label className="block mb-2">Fuel Type</label>
                <select
                  name="fuelType"
                  className="form-control"
                  value={formData.details.fuelType || ''}
                  onChange={handleDetailChange}
                  required // It's required, but only if the vehicle is a car
                >
                  <option value="">Select fuel type</option>
                  <option value="petrol">Petrol</option>
                  <option value="diesel">Diesel</option>
                  <option value="electric">Electric</option>
                  <option value="hybrid">Hybrid</option>
                </select>
              </div>
            )}

            <div className="mb-4">
              <label className="block mb-2">Distance (km)</label>
              <input
                type="number"
                name="distance"
                className="form-control"
                value={formData.details.distance || ''}
                onChange={handleDetailChange}
                required
              />
            </div>
          </>
        );
      case 'electricity':
        // (No changes to this part)
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2">Energy Source</label>
              <select
                name="energySource"
                className="form-control"
                value={formData.details.energySource || ''}
                onChange={handleDetailChange}
                required
              >
                <option value="">Select energy source</option>
                <option value="coal">Coal</option>
                <option value="natural-gas">Natural Gas</option>
                <option value="renewable">Renewable</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block mb-2">kWh Used</label>
              <input
                type="number"
                name="kWh"
                className="form-control"
                value={formData.details.kWh || ''}
                onChange={handleDetailChange}
                required
              />
            </div>
          </>
        );
      case 'food':
        // (No changes to this part)
        return (
          <>
            <div className="mb-4">
              <label className="block mb-2">Food Type</label>
              <select
                name="foodType"
                className="form-control"
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
            </div>
            <div className="mb-4">
              <label className="block mb-2">Quantity (kg)</label>
              <input
                type="number"
                name="quantity"
                className="form-control"
                value={formData.details.quantity || ''}
                onChange={handleDetailChange}
                required
              />
            </div>
          </>
        );
      default:
        // (No changes to this part)
        return (
          <div className="mb-4">
            <label className="block mb-2">CO2 Emissions (kg)</label>
            <input
              type="number"
              name="customCO2"
              className="form-control"
              value={formData.details.customCO2 || ''}
              onChange={handleDetailChange}
              required
            />
          </div>
        );
    }
  };

  if (loading) return <div className="container py-8">Loading...</div>;

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-6">Log Your Activities</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Activity</h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-2">Activity Type</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={handleTypeChange}
                required
              >
                <option value="transport">Transport</option>
                <option value="electricity">Electricity</option>
                <option value="food">Food</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {renderFormFields()}
            
            <button
              type="submit"
              className="btn btn-primary w-full"
            >
              Log Activity
            </button>
          </form>
        </div>
        
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Recent Activities</h2>
          <div className="space-y-3">
            {activities.length === 0 ? (
              <p>No activities logged yet.</p>
            ) : (
              activities.map((activity) => (
                <div key={activity._id} className="activity-item">
                  <p className="font-medium capitalize">{activity.type}</p>
                  <p className="text-sm">{new Date(activity.date).toLocaleString()}</p>
                  <p className="text-sm text-red-600">
                    CO2: {activity.co2e.toFixed(2)} kg
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}