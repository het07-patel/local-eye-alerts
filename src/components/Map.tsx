
import { useEffect, useRef } from "react";
import { Problem } from "@/lib/types";
import { MapPin } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup, useMap, ZoomControl } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons in Leaflet with React
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom marker icons for different statuses
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: "custom-icon",
    html: `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke="#fff" stroke-width="1" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

const reportedIcon = createCustomIcon("#eab308"); // yellow-500
const inProgressIcon = createCustomIcon("#3b82f6"); // blue-500
const resolvedIcon = createCustomIcon("#22c55e"); // green-500
const selectedIcon = createCustomIcon("#ef4444"); // red-500

interface MapProps {
  problems?: Problem[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

// Component to handle map events
const MapEvents = ({ onMapClick }: { onMapClick?: (lat: number, lng: number) => void }) => {
  const map = useMap();
  
  useEffect(() => {
    if (!onMapClick) return;
    
    const handleClick = (e: L.LeafletMouseEvent) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    };
    
    map.on('click', handleClick);
    
    return () => {
      map.off('click', handleClick);
    };
  }, [map, onMapClick]);
  
  return null;
};

const Map = ({ 
  problems = [], 
  center = { lat: 40.7128, lng: -74.006 }, 
  zoom = 12,
  onMapClick,
  selectedLocation
}: MapProps) => {
  const mapRef = useRef<L.Map | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "reported":
        return reportedIcon;
      case "in-progress":
        return inProgressIcon;
      case "resolved":
        return resolvedIcon;
      default:
        return DefaultIcon;
    }
  };

  return (
    <div className="w-full h-full">
      <MapContainer 
        center={[center.lat, center.lng]} 
        zoom={zoom} 
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ZoomControl position="bottomright" />
        
        {/* Add problem markers */}
        {problems.map((problem) => (
          <Marker 
            key={problem.id} 
            position={[problem.location.lat, problem.location.lng]}
            icon={getStatusIcon(problem.status)}
          >
            <Popup>
              <div className="p-1">
                <h3 className="font-semibold">{problem.title}</h3>
                <p className="text-xs mt-1">{problem.location.address}</p>
                <p className="text-xs mt-1 line-clamp-2">{problem.description}</p>
                <a 
                  href={`/problem/${problem.id}`} 
                  className="text-xs text-blue-500 hover:underline mt-2 inline-block"
                >
                  View Details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
        
        {/* Add selected location marker */}
        {selectedLocation && (
          <Marker 
            position={[selectedLocation.lat, selectedLocation.lng]}
            icon={selectedIcon}
          />
        )}
        
        {/* Map events handler */}
        {onMapClick && <MapEvents onMapClick={onMapClick} />}
      </MapContainer>
    </div>
  );
};

export default Map;
