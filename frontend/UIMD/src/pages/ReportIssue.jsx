import { useState } from 'react';
import axios from 'axios';
import { MapPin, Send, CheckCircle2 } from 'lucide-react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Auto-detect zone from lat/lng (simple bounding box)
const detectZone = (lat, lng) => {
  if (lat >= 28.65) return 'North Zone';
  if (lat < 28.55) return 'South Zone';
  if (lng >= 77.25) return 'East Zone';
  return 'West Zone';
};

const LocationMarker = ({ position, setPosition, onLocationSelect }) => {
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return position === null ? null : <Marker position={position} />;
};

const ReportIssue = () => {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Roads',
    description: '',
    severity: 3,
    image: '',
    lat: '',
    lng: '',
  });
  const [position, setPosition] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        handleLocationSelect(pos.coords.latitude, pos.coords.longitude);
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.error(err);
        alert("Failed to get location. Please allow location or use map.");
      }
    );
  };

  const handleLocationSelect = (lat, lng) => {
    setFormData(prev => ({
      ...prev,
      lat: lat.toFixed(6),
      lng: lng.toFixed(6),
    }));
  };

  const handleLatLngChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    const lat = field === 'lat' ? parseFloat(value) : parseFloat(formData.lat);
    const lng = field === 'lng' ? parseFloat(value) : parseFloat(formData.lng);
    if (!isNaN(lat) && !isNaN(lng)) {
      setPosition({ lat, lng });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const lat = parseFloat(formData.lat);
    const lng = parseFloat(formData.lng);

    if (isNaN(lat) || isNaN(lng)) {
      alert('Please enter valid latitude and longitude, or click the map.');
      return;
    }

    setLoading(true);
    try {
      const zone = detectZone(lat, lng);
      const payload = {
        title: formData.title,
        category: formData.category,
        description: formData.description,
        severity: formData.severity,
        zone,
        location: { lat, lng },
      };

      await axios.post('http://localhost:5000/api/issues', payload);
      setSuccess(true);
      setFormData({ title: '', category: 'Roads', description: '', severity: 3, image: '', lat: '', lng: '' });
      setPosition(null);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error(error);
      alert('Failed to report issue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Report an Issue</h1>
        <p className="text-sm text-[#8b8fa3] mt-0.5">Fill in details and pick a location on the map or enter coordinates.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form */}
        <div className="bg-[#161822] border border-[#252834] rounded-xl p-6">
          {success && (
            <div className="mb-5 p-3 bg-[#10b981]/10 border border-[#10b981]/20 text-[#10b981] rounded-lg flex items-center text-sm font-medium">
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Issue reported successfully!
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#c4c7d4] mb-1.5">Title</label>
              <input
                type="text" required
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#1e2030] border border-[#252834] text-white text-sm focus:border-[#6366f1] focus:outline-none transition-colors placeholder-[#555a6e]"
                placeholder="e.g. Broken water pipe on Main St"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-[#c4c7d4] mb-1.5">Category</label>
                <select
                  value={formData.category}
                  onChange={e => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg bg-[#1e2030] border border-[#252834] text-white text-sm focus:border-[#6366f1] focus:outline-none"
                >
                  {['Roads', 'Water', 'Electricity', 'Sanitation', 'Other'].map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#c4c7d4] mb-1.5">Severity (1-5)</label>
                <div className="flex items-center gap-3">
                  <input
                    type="range" min="1" max="5"
                    value={formData.severity}
                    onChange={e => setFormData({ ...formData, severity: parseInt(e.target.value) })}
                    className="flex-1 h-1.5 bg-[#252834] rounded-lg appearance-none cursor-pointer accent-[#6366f1]"
                  />
                  <span className="text-lg font-bold text-white bg-[#252834] px-2.5 py-0.5 rounded-md min-w-[36px] text-center">{formData.severity}</span>
                </div>
              </div>
            </div>

            {/* Lat / Lng inputs */}
            <div>
              <div className="grid grid-cols-2 gap-4 mb-3">
                <div>
                  <label className="block text-sm font-medium text-[#c4c7d4] mb-1.5">Latitude</label>
                  <input
                    type="text"
                    value={formData.lat}
                    onChange={e => handleLatLngChange('lat', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1e2030] border border-[#252834] text-white text-sm focus:border-[#6366f1] focus:outline-none"
                    placeholder="e.g. 28.6139"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#c4c7d4] mb-1.5">Longitude</label>
                  <input
                    type="text"
                    value={formData.lng}
                    onChange={e => handleLatLngChange('lng', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg bg-[#1e2030] border border-[#252834] text-white text-sm focus:border-[#6366f1] focus:outline-none"
                    placeholder="e.g. 77.2090"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleGetLocation}
                className="w-full py-2 bg-[#252834] hover:bg-[#1e2030] text-[#c4c7d4] text-sm font-medium rounded border border-[#363a46] transition-colors"
              >
                📍 Use My Current Location
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c7d4] mb-1.5">Description</label>
              <textarea
                required rows="3"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-[#1e2030] border border-[#252834] text-white text-sm focus:border-[#6366f1] focus:outline-none resize-none placeholder-[#555a6e]"
                placeholder="Describe the issue..."
              ></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#c4c7d4] mb-1.5">Photo (Optional)</label>
              <input 
                type="file" 
                accept="image/*"
                onChange={handleImageChange}
                className="w-full text-sm text-[#8b8fa3] file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-sm file:font-medium file:bg-[#252834] file:text-white hover:file:bg-[#363a46] cursor-pointer"
              />
              {formData.image && <img src={formData.image} alt="Preview" className="mt-2 h-20 rounded border border-[#252834]" />}
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-2.5 bg-[#6366f1] hover:bg-[#5558e6] text-white text-sm font-semibold rounded-lg transition-colors flex justify-center items-center gap-2 disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Submitting...' : 'Submit Report'}
            </button>
          </form>
        </div>

        {/* Map */}
        <div className="flex flex-col min-h-[460px]">
          <div className="bg-[#1e2030] text-[#c4c7d4] px-4 py-2.5 rounded-t-xl flex items-center justify-between text-sm border border-b-0 border-[#252834]">
            <div className="flex items-center gap-2 font-medium">
              <MapPin className="w-3.5 h-3.5" />
              Click map to set location
            </div>
            {position && <span className="text-xs text-[#10b981] bg-[#10b981]/10 px-2 py-0.5 rounded">Location set</span>}
          </div>
          <div className="flex-1 rounded-b-xl overflow-hidden border border-[#252834] z-0">
            <MapContainer
              center={[28.6139, 77.2090]}
              zoom={12}
              className="w-full h-full"
              style={{ width: '100%', height: '100%', minHeight: '420px' }}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <LocationMarker position={position} setPosition={setPosition} onLocationSelect={handleLocationSelect} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIssue;
