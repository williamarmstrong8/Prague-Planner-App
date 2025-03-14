'use client';

import { useState } from 'react';
import Map from './components/Map';
import RecommendedPlaces from './components/RecommendedPlaces';
import type { Place } from './components/RecommendedPlaces';

// Calculate distance between two points using Haversine formula
function getDistance(p1: { lat: number; lng: number }, p2: { lat: number; lng: number }): number {
  const R = 6371; // Earth's radius in km
  const dLat = (p2.lat - p1.lat) * Math.PI / 180;
  const dLon = (p2.lng - p1.lng) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(p1.lat * Math.PI / 180) * Math.cos(p2.lat * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Find optimal route using nearest neighbor algorithm
function optimizeRoute(places: Place[]): Place[] {
  if (places.length <= 2) return places;

  const optimizedRoute: Place[] = [places[0]]; // Start with first place
  const remaining = places.slice(1);

  while (remaining.length > 0) {
    const current = optimizedRoute[optimizedRoute.length - 1];
    let nearestIndex = 0;
    let minDistance = Infinity;

    // Find nearest unvisited place
    remaining.forEach((place, index) => {
      const distance = getDistance(current.location, place.location);
      if (distance < minDistance) {
        minDistance = distance;
        nearestIndex = index;
      }
    });

    // Add nearest place to route and remove from remaining
    optimizedRoute.push(remaining[nearestIndex]);
    remaining.splice(nearestIndex, 1);
  }

  return optimizedRoute;
}

export default function Home() {
  const [selectedPlaces, setSelectedPlaces] = useState<Place[]>([]);
  const [center, setCenter] = useState({ lat: 50.0755, lng: 14.4378 }); // Prague center

  const handlePlaceSelect = (place: Place) => {
    setSelectedPlaces(current => {
      const exists = current.some(p => p.id === place.id);
      if (exists) {
        return current.filter(p => p.id !== place.id);
      }
      return [...current, place];
    });
    setCenter(place.location);
  };

  const handleExport = () => {
    if (selectedPlaces.length === 0) return;

    // Optimize the route
    const optimizedPlaces = optimizeRoute([...selectedPlaces]);

    const baseUrl = 'https://www.google.com/maps/dir/?api=1';
    const origin = encodeURIComponent(optimizedPlaces[0].name);
    const destination = encodeURIComponent(optimizedPlaces[optimizedPlaces.length - 1].name);
    const waypoints = optimizedPlaces.slice(1, -1)
      .map(place => encodeURIComponent(place.name))
      .join('|');

    const url = `${baseUrl}&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=walking`;
    window.open(url, '_blank');
  };

  return (
    <main className="min-h-screen p-4 md:p-6">
      <h1 className="text-3xl md:text-4xl font-bold text-center mb-2 title-gradient">Prague City Planner</h1>
      <p className="text-gray-600 text-center mb-6 max-w-3xl mx-auto">
        Create your perfect Prague itinerary by selecting places from our curated list. 
        We'll show them on the map and create an optimized walking route for you to explore the city.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-[1920px] mx-auto">
        {/* Left sidebar - Selected Places */}
        <div className="card p-4">
          <h2 className="text-2xl font-bold mb-4 title-gradient">Your Places</h2>
          {selectedPlaces.length === 0 ? (
            <div className="text-gray-600 space-y-2">
              <p>Browse and click on places from the list on the right to add them to your itinerary.</p>
              <p>Once you've selected your destinations, click "Export Route to Google Maps" to get an optimized walking route.</p>
              <p className="text-sm italic">We'll automatically order your places using a nearest-neighbor algorithm to create the shortest possible route between all locations.</p>
            </div>
          ) : (
            <>
              <div className="space-y-2 mb-4">
                {selectedPlaces.map((place, index) => (
                  <div key={place.id} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all">
                    <span className="font-bold text-blue-600">{index + 1}.</span>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{place.name}</h3>
                      <p className="text-sm text-gray-600">{place.description}</p>
                    </div>
                    <button
                      onClick={() => handlePlaceSelect(place)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleExport}
                className="button-primary w-full flex items-center justify-center gap-2"
              >
                <span>Export Route to Google Maps</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Center - Map */}
        <div className="h-[600px] md:h-[750px] md:col-span-1 card overflow-hidden">
          <Map
            center={center}
            markers={selectedPlaces.map(place => ({
              position: place.location,
              title: place.name,
              category: place.category
            }))}
          />
        </div>

        {/* Right sidebar - Recommended Places */}
        <div className="card p-4">
          <RecommendedPlaces
            onPlaceSelect={handlePlaceSelect}
            selectedPlaces={selectedPlaces}
          />
        </div>
      </div>
    </main>
  );
} 