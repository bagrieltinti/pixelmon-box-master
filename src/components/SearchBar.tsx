
import React, { useState } from 'react';
import { PokemonData, PokemonType } from '../types/pokemon';
import { getTypeColor } from '../utils/typeUtils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Filter } from 'lucide-react';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onTypeFilter: (type: PokemonType | null) => void;
  selectedType: PokemonType | null;
  isLoading: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  onTypeFilter,
  selectedType,
  isLoading
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const pokemonTypes: PokemonType[] = [
    'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug',
    'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  const handleTypeClick = (type: PokemonType) => {
    if (selectedType === type) {
      onTypeFilter(null);
    } else {
      onTypeFilter(type);
    }
  };

  return (
    <div className="mb-6">
      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <div className="relative flex-grow">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar Pokémon por nome ou número..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
            disabled={isLoading}
          />
        </div>
        <Button type="submit" disabled={isLoading || !searchQuery.trim()}>
          Buscar
        </Button>
      </form>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center mr-2">
          <Filter className="h-4 w-4 mr-1" />
          <span className="text-sm font-medium">Filtrar por tipo:</span>
        </div>
        {pokemonTypes.map((type) => (
          <button
            key={type}
            className={`text-xs px-2 py-1 rounded-full text-white font-medium transition-transform ${
              selectedType === type ? 'ring-2 ring-black ring-opacity-50 scale-110' : ''
            }`}
            style={{ 
              backgroundColor: getTypeColor(type),
              opacity: selectedType && selectedType !== type ? 0.6 : 1
            }}
            onClick={() => handleTypeClick(type)}
          >
            {type.charAt(0).toUpperCase() + type.slice(1)}
          </button>
        ))}
        {selectedType && (
          <button
            className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-800 hover:bg-gray-300"
            onClick={() => onTypeFilter(null)}
          >
            Limpar
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
