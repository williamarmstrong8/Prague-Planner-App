'use client';

import { FormEvent, useEffect, useState } from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  getDetails
} from 'use-places-autocomplete';
import { Combobox } from '@headlessui/react';

interface PlaceSearchProps {
  onPlaceSelect: (place: google.maps.places.PlaceResult) => void;
  setCenter: (location: google.maps.LatLngLiteral) => void;
}

export default function PlaceSearch({ onPlaceSelect, setCenter }: PlaceSearchProps) {
  const [initError, setInitError] = useState<string>('');
  const [query, setQuery] = useState('');

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    initOnMount: true,
    requestOptions: { 
      types: ['establishment', 'tourist_attraction', 'point_of_interest'],
      componentRestrictions: { country: 'cz' },
      locationBias: {
        center: { lat: 50.0755, lng: 14.4378 }, // Prague center coordinates
        radius: 20000 // 20km radius
      }
    },
    debounce: 300,
    cache: 24 * 60 * 60,
  });

  useEffect(() => {
    // Debug logging
    const isGoogleDefined = typeof window !== 'undefined' && 'google' in window;
    const isPlacesServiceDefined = isGoogleDefined && 'places' in (window as any).google;
    
    console.log('Component mounted');
    console.log('Google Maps loaded:', isGoogleDefined);
    console.log('Places service available:', isPlacesServiceDefined);
    console.log('Places API ready:', ready);

    if (!isGoogleDefined) {
      setInitError('Google Maps not loaded');
    } else if (!isPlacesServiceDefined) {
      setInitError('Places service not available');
    }
  }, [ready]);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log('Input change:', e.target.value);
    setValue(e.target.value);
    setQuery(e.target.value);
  };

  const handleSelect = async (description: string) => {
    setValue(description, false);
    clearSuggestions();
    setQuery(description);

    try {
      const results = await getGeocode({ address: description });
      const { lat, lng } = await getLatLng(results[0]);
      const placeId = results[0].place_id;
      
      // Get additional place details
      const details = await getDetails({
        placeId,
        fields: ['name', 'formatted_address', 'geometry', 'rating', 'user_ratings_total', 'types', 'photos']
      }) as google.maps.places.PlaceResult;

      const location = new google.maps.LatLng(lat, lng);
      setCenter({ lat, lng });
      
      const placeResult: google.maps.places.PlaceResult = {
        place_id: placeId,
        name: details.name || description.split(',')[0],
        formatted_address: details.formatted_address || description,
        rating: details.rating,
        user_ratings_total: details.user_ratings_total,
        types: details.types || [],
        photos: details.photos,
        geometry: {
          location
        }
      };
      
      onPlaceSelect(placeResult);
      setValue('');
      setQuery('');
    } catch (error) {
      console.error('Error selecting place:', error);
    }
  };

  const getPlaceIcon = (types: string[] = []) => {
    if (types.includes('restaurant')) return '🍽️';
    if (types.includes('museum')) return '🏛️';
    if (types.includes('park')) return '🌳';
    if (types.includes('lodging')) return '🏨';
    if (types.includes('tourist_attraction')) return '🎯';
    if (types.includes('subway_station') || types.includes('train_station')) return '🚉';
    return '📍';
  };

  return (
    <div className="w-full">
      <Combobox value={query} onChange={handleSelect}>
        <div className="relative w-full">
          <Combobox.Input
            value={value}
            onChange={handleInput}
            className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={initError || (ready ? "Search for places in Prague..." : "Loading...")}
            autoComplete="off"
            aria-label="Search places"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">
            {ready ? '🔍' : '⌛'}
          </span>
          {status === "OK" && (
            <Combobox.Options className="absolute z-50 w-full bg-white shadow-lg rounded-md mt-1 border border-gray-200 max-h-96 overflow-auto">
              {data.map(({ place_id, description, structured_formatting, types = [] }) => (
                <Combobox.Option
                  key={place_id}
                  value={description}
                  className={({ active }: { active: boolean }) =>
                    `px-4 py-2 cursor-pointer ${
                      active ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                    }`
                  }
                >
                  <div className="flex items-start gap-2">
                    <span className="mt-0.5 text-lg">{getPlaceIcon(types)}</span>
                    <div className="flex-1">
                      <div className="font-medium">
                        {structured_formatting?.main_text || description.split(',')[0]}
                      </div>
                      <div className="text-xs text-gray-600 mt-0.5">
                        {structured_formatting?.secondary_text || description.split(',').slice(1).join(',')}
                      </div>
                    </div>
                  </div>
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </div>
      </Combobox>
    </div>
  );
} 