'use client';

import { useCallback, useEffect, useState } from 'react';
import { GoogleMap, Marker, useJsApiLoader, Libraries } from '@react-google-maps/api';
import type { Place } from './RecommendedPlaces';

interface MapProps {
  center: google.maps.LatLngLiteral;
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

const libraries: Libraries = ["places"];

export default function Map({ center, markers = [] }: MapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
    libraries
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    if (markers.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      markers.forEach(marker => bounds.extend(marker.position));
      map.fitBounds(bounds);
    } else {
      map.setCenter(center);
      map.setZoom(13);
    }
    setMap(map);
  }, [center, markers]);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-lg">
        <div className="text-gray-500">Loading map...</div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerClassName="w-full h-full rounded-lg"
      center={center}
      zoom={13}
      onLoad={onLoad}
      onUnmount={onUnmount}
      options={{
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        mapTypeControl: true,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }],
          },
        ],
      }}
    >
      {markers.map((marker, index) => (
        <Marker
          key={`${marker.position.lat}-${marker.position.lng}`}
          position={marker.position}
          title={marker.title}
          label={{
            text: getCategoryEmoji(marker.category),
            fontSize: "24px",
            className: "marker-label"
          }}
          icon={{
            url: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
            scaledSize: new google.maps.Size(1, 1)
          }}
        />
      ))}
    </GoogleMap>
  );
} 