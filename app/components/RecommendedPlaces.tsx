'use client';

import { useState } from 'react';

export interface Place {
  id: string;
  name: string;
  description: string;
  category: string;
  location: {
    lat: number;
    lng: number;
  };
}

const recommendedPlaces: Place[] = [
  {
    id: 'charles-bridge',
    name: 'Charles Bridge',
    description: 'Historic 14th-century bridge',
    category: 'Landmarks',
    location: { lat: 50.0865, lng: 14.4114 }
  },
  {
    id: 'prague-castle',
    name: 'Prague Castle',
    description: 'Largest ancient castle complex in the world',
    category: 'Landmarks',
    location: { lat: 50.0911, lng: 14.4016 }
  },
  {
    id: 'old-town-square',
    name: 'Old Town Square',
    description: 'Historic square with the famous Astronomical Clock, Gothic churches, and colorful baroque buildings',
    category: 'Landmarks',
    location: { lat: 50.0875, lng: 14.4213 }
  },
  {
    id: 'st-vitus-cathedral',
    name: 'St. Vitus Cathedral',
    description: 'Gothic cathedral inside Prague Castle',
    category: 'Religious Sites',
    location: { lat: 50.0891, lng: 14.4001 }
  },
  {
    id: 'jewish-quarter',
    name: 'Jewish Quarter',
    description: 'Historic Jewish quarter with synagogues',
    category: 'Districts',
    location: { lat: 50.0903, lng: 14.4186 }
  },
  {
    id: 'dancing-house',
    name: 'Dancing House',
    description: 'Modern architectural landmark',
    category: 'Architecture',
    location: { lat: 50.0755, lng: 14.4141 }
  },
  {
    id: 'u-sudu',
    name: 'U Sudu Wine Bar',
    description: 'Historic underground wine bar with medieval cellars and unique atmosphere',
    category: 'Bars',
    location: { lat: 50.0817, lng: 14.4187 }
  },
  {
    id: 'dog-bar',
    name: 'Dog Bar',
    description: 'Pet-friendly bar with a cozy atmosphere',
    category: 'Bars',
    location: { lat: 50.0789, lng: 14.4201 }
  },
  {
    id: 'dubliners',
    name: 'Dubliners',
    description: 'Traditional Irish pub with live music and sports',
    category: 'Bars',
    location: { lat: 50.0875, lng: 14.4215 }
  },
  {
    id: 'nevinny-gecko',
    name: 'Nevinny Gecko',
    description: 'Quirky bar with creative cocktails and friendly atmosphere',
    category: 'Bars',
    location: { lat: 50.0799, lng: 14.4278 }
  },
  {
    id: 'waid',
    name: 'WAID',
    description: 'Popular nightclub and bar with multiple dance floors',
    category: 'Bars',
    location: { lat: 50.0731, lng: 14.4198 }
  },
  {
    id: 'popo-cafe',
    name: 'Popo Cafe',
    description: 'Cozy cafe-bar with a relaxed vibe and great drinks',
    category: 'Bars',
    location: { lat: 50.0782, lng: 14.4234 }
  },
  {
    id: 'magicka-sova',
    name: 'Magicka Sova Harry Potter Bar',
    description: 'Themed bar inspired by Harry Potter with magical cocktails',
    category: 'Bars',
    location: { lat: 50.0889, lng: 14.4198 }
  },
  {
    id: 'green-flamingo',
    name: 'Green Flamingo Absinth Bar',
    description: 'Specialized absinth bar with traditional serving methods',
    category: 'Bars',
    location: { lat: 50.0892, lng: 14.4211 }
  },
  {
    id: 'kellyxir',
    name: 'Kellyxir Alchemical Pub',
    description: 'Unique alchemical-themed pub with experimental cocktails',
    category: 'Bars',
    location: { lat: 50.0803, lng: 14.4289 }
  },
  {
    id: 'nightmare-bar',
    name: 'Nightmare Horror Bar',
    description: 'Horror-themed bar with spooky atmosphere and themed drinks',
    category: 'Bars',
    location: { lat: 50.0795, lng: 14.4256 }
  },
  {
    id: 'roller-bar',
    name: 'Roller Rink and Bar',
    description: 'Unique combination of roller skating rink and bar',
    category: 'Bars',
    location: { lat: 50.0768, lng: 14.4301 }
  }
];

const categories = ['All', 'Landmarks', 'Religious Sites', 'Districts', 'Architecture', 'Parks', 'Museums', 'Bars'];

interface RecommendedPlacesProps {
  onPlaceSelect: (place: Place) => void;
  selectedPlaces: Place[];
}

export default function RecommendedPlaces({ onPlaceSelect, selectedPlaces }: RecommendedPlacesProps) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const filteredPlaces = selectedCategory === 'All' 
    ? recommendedPlaces 
    : recommendedPlaces.filter(place => place.category === selectedCategory);

  const totalPages = Math.ceil(filteredPlaces.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPlaces = filteredPlaces.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 title-gradient">Popular Places in Prague</h2>
      
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-sm transition-all ${
              selectedCategory === category
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Places list */}
      <div className="space-y-3 min-h-[28rem]">
        {paginatedPlaces.map(place => (
          <div
            key={place.id}
            className={`p-3 rounded-lg border transition-all ${
              selectedPlaces.some(p => p.id === place.id)
                ? 'border-blue-500 bg-blue-50 shadow-sm'
                : 'border-gray-200 hover:border-blue-300 hover:shadow-sm'
            } cursor-pointer`}
            onClick={() => onPlaceSelect(place)}
          >
            <h3 className="font-medium text-gray-900">{place.name}</h3>
            <p className="text-sm text-gray-600 mt-1">{place.description}</p>
            <span className="text-xs text-blue-600 font-medium mt-1 inline-block">{place.category}</span>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-2 py-1 rounded-md transition-colors ${
                currentPage === page
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-2 py-1 rounded-md bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      )}
    </div>
  );
} 