'use client';

import { useState } from 'react';
import Map from './components/Map';
import PlaceSearch from './components/PlaceSearch';
import RecommendedPlaces from './components/RecommendedPlaces';
import { Place } from './components/RecommendedPlaces';

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
  const [selectedPlace, setSelectedPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [center, setCenter] = useState<google.maps.LatLngLiteral>({
    lat: 50.0755,
    lng: 14.4378
  });

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setSelectedPlace(place);
    if (place.geometry?.location) {
      setCenter({
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng()
      });
    }
  };

  const handleExport = () => {
    if (!selectedPlace) return;

    // Optimize the route
    const optimizedPlaces = optimizeRoute([{
      id: '',
      name: selectedPlace.name || '',
      description: selectedPlace.formatted_address || '',
      location: {
        lat: selectedPlace.geometry?.location?.lat() || 0,
        lng: selectedPlace.geometry?.location?.lng() || 0
      },
      category: ''
    }]);

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
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-center mb-8">Prague Planner</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-6">
            <div className="card p-4">
              <h2 className="text-xl font-semibold mb-4">Search Places</h2>
              <PlaceSearch 
                onPlaceSelect={handlePlaceSelect} 
                setCenter={setCenter} 
              />
            </div>
            
            <div className="card p-4">
              <h2 className="text-xl font-semibold mb-4">Recommended Places</h2>
              <RecommendedPlaces
                onPlaceSelect={handlePlaceSelect}
                selectedPlace={selectedPlace ? {
                  id: selectedPlace.place_id || '',
                  name: selectedPlace.name || '',
                  description: selectedPlace.formatted_address || '',
                  category: selectedPlace.types?.[0] || 'Site',
                  location: {
                    lat: selectedPlace.geometry?.location?.lat() || 0,
                    lng: selectedPlace.geometry?.location?.lng() || 0
                  }
                } : null}
              />
            </div>
          </div>
          
          <div className="h-[600px] md:h-[750px] md:col-span-1 card overflow-hidden">
            <Map 
              selectedPlace={selectedPlace}
              onPlaceSelect={handlePlaceSelect}
            />
          </div>
        </div>
      </div>
    </main>
  );
} 