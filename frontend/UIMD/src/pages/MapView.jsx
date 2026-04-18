import { useState, useEffect } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { Activity } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const zoneCenters = {
  'North Zone': [28.7041, 77.1025],
  'South Zone': [28.5355, 77.1558],
  'East Zone': [28.6139, 77.3090],
  'West Zone': [28.6520, 77.0190],
};

const MapView = () => {
  const [issues, setIssues] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [issuesRes, statsRes] = await Promise.all([
        axios.get('http://localhost:5000/api/issues'),
        axios.get('http://localhost:5000/api/stats')
      ]);
      setIssues(issuesRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getHealthColor = (score) => {
    if (score < 50) return '#f43f5e';
    if (score < 75) return '#f59e0b';
    if (score < 90) return '#38bdf8';
    return '#10b981';
  };

  return (
    <div className="flex flex-col h-[85vh] space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#6366f1]" />
            Live Map
          </h1>
          <p className="text-sm text-[#8b8fa3]">Reported issues and zone health overlays.</p>
        </div>
        <div className="flex gap-4 mt-3 md:mt-0 bg-[#161822] p-2 px-4 rounded-lg border border-[#252834] text-xs font-medium text-[#8b8fa3]">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#10b981]"></span>Healthy</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#38bdf8]"></span>Moderate</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f59e0b]"></span>Degraded</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f43f5e]"></span>Critical</span>
        </div>
      </div>

      <div className="flex-1 w-full rounded-xl overflow-hidden border border-[#252834] z-0">
        <MapContainer
          center={[28.6139, 77.2090]}
          zoom={11}
          className="w-full h-full"
          style={{ width: '100%', height: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {issues.map(issue => (
            <Marker key={issue._id} position={[issue.location.lat, issue.location.lng]}>
              <Popup>
                <div className="p-1">
                  <h3 className="font-bold text-sm mb-1">{issue.title}</h3>
                  <div className="text-xs space-y-0.5">
                    <p><strong>Category:</strong> {issue.category}</p>
                    <p><strong>Severity:</strong> {issue.severity}/5</p>
                    <p><strong>Status:</strong> {issue.status}</p>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}

          {stats?.zoneHealth?.map(zone => {
            const center = zoneCenters[zone.zone] || [28.6139, 77.2090];
            return (
              <Circle
                key={zone.zone}
                center={center}
                radius={6000}
                pathOptions={{
                  color: getHealthColor(zone.score),
                  fillColor: getHealthColor(zone.score),
                  fillOpacity: 0.12,
                  weight: 2,
                }}
              >
                <Popup>
                  <div className="text-center">
                    <h4 className="font-bold">{zone.zone}</h4>
                    <p className="text-sm mt-1">Score: <strong style={{ color: getHealthColor(zone.score) }}>{zone.score}</strong>/100</p>
                    <p className="text-xs text-gray-500">{zone.issuesCount} issues</p>
                  </div>
                </Popup>
              </Circle>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};

export default MapView;
