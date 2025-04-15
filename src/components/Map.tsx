
import { useEffect, useRef } from "react";
import { Problem } from "@/lib/types";
import { MapPin } from "lucide-react";

interface MapProps {
  problems?: Problem[];
  center?: { lat: number; lng: number };
  zoom?: number;
  onMapClick?: (lat: number, lng: number) => void;
  selectedLocation?: { lat: number; lng: number } | null;
}

const Map = ({ 
  problems = [], 
  center = { lat: 40.7128, lng: -74.006 }, 
  zoom = 12,
  onMapClick,
  selectedLocation 
}: MapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);

  useEffect(() => {
    // In a real app, you would use a proper Google Maps API key
    const loadGoogleMapsScript = () => {
      // Mock implementation for demonstration purposes
      // This is where you'd actually load the Google Maps script
      console.log("Loading Google Maps script (mock)");
      initializeMap();
    };

    const initializeMap = () => {
      if (!mapRef.current) return;

      // Mock map initialization
      console.log(`Initializing map at ${center.lat}, ${center.lng} with zoom ${zoom}`);
      
      // This is where you'd actually initialize the Google Map
      // For now, we'll just show a placeholder
      const mapContainer = mapRef.current;
      mapContainer.innerHTML = "";
      
      // Create a mock map display
      const mockMap = document.createElement("div");
      mockMap.className = "w-full h-full bg-gray-200 relative";
      
      // Add a simple legend
      const legend = document.createElement("div");
      legend.className = "absolute top-4 right-4 bg-white p-3 rounded shadow-md text-sm";
      legend.innerHTML = `
        <div class="font-semibold mb-2">Map Legend</div>
        <div class="flex items-center mb-1">
          <span class="inline-block w-3 h-3 rounded-full bg-yellow-500 mr-2"></span>
          <span>Reported</span>
        </div>
        <div class="flex items-center mb-1">
          <span class="inline-block w-3 h-3 rounded-full bg-blue-500 mr-2"></span>
          <span>In Progress</span>
        </div>
        <div class="flex items-center">
          <span class="inline-block w-3 h-3 rounded-full bg-green-500 mr-2"></span>
          <span>Resolved</span>
        </div>
      `;
      
      // Add center indicator
      const centerIndicator = document.createElement("div");
      centerIndicator.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
      centerIndicator.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-primary"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
      
      // Add problem markers
      problems.forEach((problem, index) => {
        const marker = document.createElement("div");
        marker.className = "absolute transform -translate-x-1/2 -translate-y-1/2";
        
        // Position marker randomly around center for mock
        const offsetX = (Math.random() - 0.5) * 200;
        const offsetY = (Math.random() - 0.5) * 200;
        
        marker.style.top = `calc(50% + ${offsetY}px)`;
        marker.style.left = `calc(50% + ${offsetX}px)`;
        
        let markerColor = "text-yellow-500";
        if (problem.status === "in-progress") markerColor = "text-blue-500";
        if (problem.status === "resolved") markerColor = "text-green-500";
        
        marker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="${markerColor}"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
        
        // Add tooltip on hover
        marker.title = problem.title;
        marker.dataset.id = problem.id;
        marker.style.cursor = "pointer";
        
        marker.addEventListener("click", () => {
          window.location.href = `/problem/${problem.id}`;
        });
        
        mockMap.appendChild(marker);
      });
      
      // Add selected location if provided
      if (selectedLocation) {
        const selectedMarker = document.createElement("div");
        selectedMarker.className = "absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2";
        selectedMarker.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-red-500"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`;
        mockMap.appendChild(selectedMarker);
      }
      
      // Add click handler
      if (onMapClick) {
        mockMap.addEventListener("click", (e) => {
          const rect = mockMap.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Convert to lat/lng (mock)
          const lat = center.lat + (y - rect.height / 2) / 1000;
          const lng = center.lng + (x - rect.width / 2) / 1000;
          
          onMapClick(lat, lng);
        });
      }
      
      mockMap.appendChild(centerIndicator);
      mockMap.appendChild(legend);
      mapContainer.appendChild(mockMap);
      
      // Add text explaining this is a mock
      const disclaimer = document.createElement("div");
      disclaimer.className = "absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-center text-sm";
      disclaimer.textContent = "Interactive map would be implemented with Google Maps API";
      mapContainer.appendChild(disclaimer);
    };

    loadGoogleMapsScript();

    return () => {
      // Cleanup markers
      markersRef.current.forEach((marker) => {
        marker.setMap(null);
      });
      markersRef.current = [];
    };
  }, [center, zoom, problems.length]);

  // Update markers when problems change
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    
    // Clear existing markers
    markersRef.current.forEach((marker) => {
      marker.setMap(null);
    });
    markersRef.current = [];
    
    // In a real implementation, we would add the problem markers
    console.log(`Displaying ${problems.length} problem markers on map`);
  }, [problems]);

  // Update selected location marker
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedLocation) return;
    
    console.log(`Selected location: ${selectedLocation.lat}, ${selectedLocation.lng}`);
  }, [selectedLocation]);

  return (
    <div ref={mapRef} className="w-full h-full bg-gray-100 flex items-center justify-center">
      <div className="flex flex-col items-center text-muted-foreground">
        <MapPin className="h-6 w-6 mb-2" />
        <p>Map loading...</p>
      </div>
    </div>
  );
};

export default Map;
