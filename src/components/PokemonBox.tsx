
import React from 'react';
import { PokemonData } from '../types/pokemon';
import PokemonSprite from './PokemonSprite';

interface PokemonBoxProps {
  boxNumber: number;
  pokemon: PokemonData[];
  capturedPokemon: Set<number>;
  searchedPokemonId: number | null;
  selectedType: string | null;
  onPokemonClick: (id: number) => void;
}

const PokemonBox: React.FC<PokemonBoxProps> = ({
  boxNumber,
  pokemon,
  capturedPokemon,
  searchedPokemonId,
  selectedType,
  onPokemonClick
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <h2 className="text-xl font-bold mb-3 text-pokeRedDark">Box {boxNumber + 1}</h2>
      <div className="pokemon-grid">
        {pokemon.map((poke) => (
          <PokemonSprite 
            key={poke.id}
            pokemon={poke}
            isCaptured={capturedPokemon.has(poke.id)}
            isHighlighted={searchedPokemonId === poke.id}
            isTypeHighlighted={selectedType !== null && poke.types.includes(selectedType as any)}
            onClick={() => onPokemonClick(poke.id)}
          />
        ))}
        {/* Fill empty slots if box is not full */}
        {Array.from({ length: Math.max(0, 30 - pokemon.length) }).map((_, idx) => (
          <div 
            key={`empty-${idx}`} 
            className="w-full aspect-square bg-gray-100 rounded opacity-50"
          />
        ))}
      </div>
    </div>
  );
};

export default PokemonBox;
