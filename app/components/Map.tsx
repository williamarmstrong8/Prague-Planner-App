'use client';

import { useRef, useState, useCallback } from 'react';
import { GoogleMap, useLoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import type { Place } from './RecommendedPlaces';

interface MapProps {
  selectedPlace: google.maps.places.PlaceResult | null;
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  center?: google.maps.LatLngLiteral;
  markers?: Array<{
    position: google.maps.LatLngLiteral;
    title: string;
    category: string;
  }>;
}

const getCategoryEmoji = (category: string): string => {
  switch (category) {
    case 'Bars':
      return '🍺';
    case 'Restaurants':
      return '🍽️';
    case 'Museums':
      return '🏛️';
    case 'Religious Sites':
      return '⛪';
    case 'Landmarks':
      return '🏰';
    case 'Squares':
      return '🏢';
    case 'Districts':
      return '🏘️';
    case 'Architecture':
      return '🏛️';
    case 'Parks':
      return '🌳';
    case 'Cafes':
      return '☕';
    default:
      return '📍';
  }
};

const libraries: ("places")[] = ["places"];

const mapContainerStyle = {
  width: '100%',
  height: '100%'
};

const defaultCenter = {
  lat: 50.0755,
  lng: 14.4378
};

const options = {
  disableDefaultUI: true,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }]
    }
  ]
};

export default function Map({ selectedPlace, onPlaceSelect, center, markers }: MapProps) {
  const [localMarkers, setLocalMarkers] = useState<google.maps.LatLngLiteral[]>([]);
  const [infoWindow, setInfoWindow] = useState<google.maps.places.PlaceResult | null>(null);
  const mapRef = useRef<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const onMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setLocalMarkers(prev => [...prev, { lat: e.latLng!.lat(), lng: e.latLng!.lng() }]);
    }
  }, []);

  const onMapLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={13}
      center={center || selectedPlace?.geometry?.location || defaultCenter}
      onClick={onMapClick}
      onLoad={onMapLoad}
      options={options}
    >
      {localMarkers.map((marker, index) => (
        <Marker
          key={index}
          position={marker}
          onClick={() => {
            // You could add place details here if needed
          }}
        />
      ))}

      {markers?.map((marker, index) => (
        <Marker
          key={`prop-${index}`}
          position={marker.position}
          title={marker.title}
          label={getCategoryEmoji(marker.category)}
        />
      ))}

      {selectedPlace?.geometry?.location && (
        <Marker
          position={selectedPlace.geometry.location}
          onClick={() => setInfoWindow(selectedPlace)}
        />
      )}

      {infoWindow && (
        <InfoWindow
          position={infoWindow.geometry?.location}
          onCloseClick={() => setInfoWindow(null)}
        >
          <div className="p-2">
            <h3 className="font-bold">{infoWindow.name}</h3>
            <p className="text-sm">{infoWindow.formatted_address}</p>
            {infoWindow.rating && (
              <p className="text-sm">Rating: {infoWindow.rating} ⭐</p>
            )}
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
} 