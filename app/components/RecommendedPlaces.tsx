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

const categories = ['All', 'Brunch Spots', 'Cafes', 'Restaurants', 'Bars', 'Clubs', 'Sites'];

const recommendedPlaces: Place[] = [
  // Brunch Spots
  {
    id: 'spot-dlouha',
    name: 'The Spot – Dlouhá',
    description: 'Cozy café with a modern international menu. Famous for their English breakfast (189 CZK) including fried eggs, sausage, bacon, beans, salad, and pastry. Offers summer garden and free Wi-Fi.',
    category: 'Brunch Spots',
    location: { lat: 50.0892, lng: 14.4256 }
  },
  {
    id: 'spot-mala-strana',
    name: 'The Spot – Malá Strana',
    description: 'Same great menu and vibe as the Dlouhá location, situated in the charming Malá Strana district. Perfect for a leisurely brunch or lunch.',
    category: 'Brunch Spots',
    location: { lat: 50.0847, lng: 14.4036 }
  },
  {
    id: 'mistro',
    name: 'Místro',
    description: 'Very cool environment + study spot with great coffee and brunch selections.',
    category: 'Brunch Spots',
    location: { lat: 50.1027, lng: 14.4147 }
  },
  {
    id: 'venue',
    name: 'Venue',
    description: 'Good brunch with unique coffee featuring their homemade simple syrups. The croque madame is their viral TikTok meal—it was okay but heavy and cheesy.',
    category: 'Brunch Spots',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'mezi-srnky',
    name: 'Mezi Srnky Smíchov',
    description: 'Delicious breakfast and really cool environment. Great selection of pastries.',
    category: 'Brunch Spots',
    location: { lat: 50.0755, lng: 14.4036 }
  },
  {
    id: 'monk-michalska',
    name: 'Monk Bistro – Michalská',
    description: 'Amazing avocado toast and cool outdoor seating.',
    category: 'Brunch Spots',
    location: { lat: 50.0867, lng: 14.4186 }
  },
  {
    id: 'monk-maltezske',
    name: 'Monk Bistro – Maltézské náměstí',
    description: 'Same great food, even cuter location in Malá Strana.',
    category: 'Brunch Spots',
    location: { lat: 50.0847, lng: 14.4036 }
  },
  {
    id: 'laskava',
    name: 'Bistro Café Laskavá',
    description: 'Amazing brunch with cool, fun, refreshing drinks. Very cool environment as well.',
    category: 'Brunch Spots',
    location: { lat: 50.0892, lng: 14.4256 }
  },
  {
    id: 'anezka',
    name: 'Anežka Café',
    description: 'Amazing brunch with a really cool environment. Great outdoor space; get the traditional Czech breakfast.',
    category: 'Brunch Spots',
    location: { lat: 50.0892, lng: 14.4256 }
  },
  {
    id: 'kampa',
    name: 'Kampa Café',
    description: 'Such good brunch and coffee. Highly recommend.',
    category: 'Brunch Spots',
    location: { lat: 50.0847, lng: 14.4036 }
  },

  // Cafes
  {
    id: 'milani',
    name: 'Caffe Milani',
    description: 'Not many food options but such a good study spot.',
    category: 'Cafes',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'mistral',
    name: 'Mistral Café',
    description: 'Some decent food but one of the best study cafés with a cool environment.',
    category: 'Cafes',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'chleba',
    name: 'Chleba & Máslo',
    description: 'Super cool café with decent food but a really cool, relaxing environment. Go there for the space, not the coffee or food. No Wi-Fi.',
    category: 'Cafes',
    location: { lat: 50.1027, lng: 14.4147 }
  },
  {
    id: 'void',
    name: '(A)void Café',
    description: 'The most unique café I have ever seen—like a hole in the wall, literally. Limited seating; check it out if you\'re studying abroad here.',
    category: 'Cafes',
    location: { lat: 50.0755, lng: 14.4147 }
  },

  // Restaurants
  {
    id: 'tiskarna',
    name: 'Restaurace Tiskárna',
    description: 'My favorite traditional Czech spot with a fun, upbeat environment. Great brewery/restaurant style with upscale Czech food at good prices. Highly recommend the pickled trout, pickled cheese, and sausages as appetizers—so good.',
    category: 'Restaurants',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'adelitas-americka',
    name: 'Las Adelitas – Americká',
    description: 'Great Mexican food coming from California with amazing frozen margaritas.',
    category: 'Restaurants',
    location: { lat: 50.0755, lng: 14.4147 }
  },
  {
    id: 'adelitas-male',
    name: 'Las Adelitas – Malé náměstí',
    description: 'Same vibe, frozen margs hit just as hard.',
    category: 'Restaurants',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'adelitas-petrska',
    name: 'Las Adelitas – Petrská',
    description: 'Solid location if you\'re in the New Town area.',
    category: 'Restaurants',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'adelitas-jame',
    name: 'Las Adelitas – V Jámě',
    description: 'Super central, good starting point for a night out.',
    category: 'Restaurants',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'maly-buddha',
    name: 'Malý Buddha',
    description: 'The best fried rice I\'ve ever had in my life. Cash only; far from Old Town Square. A must if studying abroad here.',
    category: 'Restaurants',
    location: { lat: 50.0847, lng: 14.4036 }
  },
  {
    id: 'u-telleru',
    name: 'U Tellerů',
    description: 'My favorite Czech restaurant with a great environment and amazing Czech food. Ideal for study abroad folks as it\'s farther away.',
    category: 'Restaurants',
    location: { lat: 50.0755, lng: 14.4147 }
  },

  // Bars
  {
    id: 'dog-bar',
    name: 'Dog Bar (Vzorkovna)',
    description: 'One of the most iconic bars — like an acid trip with really cool rooms and decorations; a must when you\'re in Prague. Don\'t lose your card; cash only.',
    category: 'Bars',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'u-sudu',
    name: 'U Sudu',
    description: 'Our favorite chill/late-night bar that\'s open till 5 AM; an underground bar with good cheap drinks.',
    category: 'Bars',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'gecko',
    name: 'Nevinný Gecko Bar',
    description: 'Cheap drinks and a more chill place to start the night.',
    category: 'Bars',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'durty-nellys',
    name: 'Durty Nelly\'s',
    description: 'Fun karaoke and good environment but mostly tourists; still a blast.',
    category: 'Bars',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'harleys',
    name: 'Harley\'s',
    description: 'Cool American biker-themed bar and club; people are a little wild — super fun, but some old heads may be weird; just don\'t go alone.',
    category: 'Bars',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'steampunk',
    name: 'Steampunk Prague',
    description: 'Really cool place with crazy decorations; bar with a more club vibe; bartenders can be touchy, so just don\'t spin the wheel.',
    category: 'Bars',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'cafe-80s',
    name: 'Cafe 80s',
    description: 'Great spot with great 80s music; more chill upstairs and fun dance floor downstairs; bar/club vibes.',
    category: 'Bars',
    location: { lat: 50.0867, lng: 14.4247 }
  },

  // Clubs
  {
    id: 'duplex',
    name: 'Duplex',
    description: 'One of the most famous clubs; two-story rooftop club; $15–25 cover but a really cool spot with good dance floors; open every day; cool inside and outside spaces; best place to end the night.',
    category: 'Clubs',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'epic',
    name: 'Epic',
    description: 'Your typical club but a little cooler; free some days of the week if you go before midnight; fun spot to end the night.',
    category: 'Clubs',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'fuch2',
    name: 'Fuch2',
    description: 'Crazy run-down warehouse rave club on an island in the river; more of a real rave place — very niche but definitely a wild experience; don\'t go here on a weekend trip — only if you\'re abroad, then maybe try once.',
    category: 'Clubs',
    location: { lat: 50.1027, lng: 14.4147 }
  },

  // Sites
  {
    id: 'charles-bridge',
    name: 'Charles Bridge',
    description: 'A must-walk across with great views of Prague; either end has great shops, restaurants, performers, etc.',
    category: 'Sites',
    location: { lat: 50.0865, lng: 14.4114 }
  },
  {
    id: 'old-town-square',
    name: 'Old Town Square',
    description: 'A must-see; kind of the central location of all things Prague, tons of history, restaurants, bars, and more on it. You don\'t need to watch the "clock performance" at the hour—it is really underwhelming.',
    category: 'Sites',
    location: { lat: 50.0875, lng: 14.4213 }
  },
  {
    id: 'prague-castle',
    name: 'Prague Castle',
    description: 'More of a hike to get to but a cool visit; good food around the area; has a ton of rich history; walk the Charles Bridge back to the city.',
    category: 'Sites',
    location: { lat: 50.0911, lng: 14.4016 }
  },
  {
    id: 'national-museum',
    name: 'National Museum (Národní muzeum)',
    description: 'Cool museum with Prague history, dinosaurs of the area, and a really cool geology section.',
    category: 'Sites',
    location: { lat: 50.0867, lng: 14.4247 }
  },
  {
    id: 'prague-zoo',
    name: 'Prague Zoo',
    description: 'If you\'re studying abroad here, you have to check it out; super cool zoo, cheap drinks, fun visit.',
    category: 'Sites',
    location: { lat: 50.1167, lng: 14.4167 }
  }
];

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