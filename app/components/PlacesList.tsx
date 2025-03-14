'use client';

import React from 'react';

interface Place {
  id: string;
  name: string;
  location: google.maps.LatLngLiteral;
}

interface PlacesListProps {
  places: Place[];
  onRemovePlace: (id: string) => void;
}

export default function PlacesList({ places, onRemovePlace }: PlacesListProps) {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-semibold mb-3">Your Places</h2>
      {places.length === 0 ? (
        <div className="text-gray-600 space-y-2">
          <p>Browse and click on places from the list on the right to add them to your itinerary.</p>
          <p>Once you've selected your destinations, click "Export Route to Google Maps" to get an optimized walking route.</p>
          <p className="text-sm italic">We'll automatically order your places using a nearest-neighbor algorithm to create the shortest possible route between all locations.</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {places.map((place) => (
            <li
              key={place.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <span className="font-medium">{place.name}</span>
              <button
                onClick={() => onRemovePlace(place.id)}
                className="text-red-500 hover:text-red-700 focus:outline-none"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
} 