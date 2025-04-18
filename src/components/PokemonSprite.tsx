
import React from 'react';
import { PokemonData } from '../types/pokemon';
import { getTypeColor } from '../utils/typeUtils';

interface PokemonSpriteProps {
  pokemon: PokemonData;
  isCaptured: boolean;
  isHighlighted: boolean;
  isTypeHighlighted: boolean;
  onClick: () => void;
}

const PokemonSprite: React.FC<PokemonSpriteProps> = ({
  pokemon,
  isCaptured,
  isHighlighted,
  isTypeHighlighted,
  onClick
}) => {
  return (
    <div 
      className={`relative pokemon-sprite p-1 rounded cursor-pointer
        ${isHighlighted ? 'highlighted' : ''}
        ${isTypeHighlighted ? 'border-2 border-opacity-50' : ''}
      `}
      style={{
        borderColor: isTypeHighlighted ? getTypeColor(pokemon.types[0]) : undefined
      }}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 flex items-center justify-center">
          <img 
            src={pokemon.spriteUrl} 
            alt={pokemon.name} 
            className={`w-full h-full object-contain transition-all duration-300
              ${!isCaptured ? 'pokemon-silhouette' : ''}
            `}
            onError={(e) => {
              // Fallback if sprite fails to load
              (e.target as HTMLImageElement).src = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png';
            }}
          />
        </div>
        <div className="text-xs text-center mt-1 font-medium truncate w-full">
          #{pokemon.id} {pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}
        </div>
      </div>
    </div>
  );
};

export default PokemonSprite;
