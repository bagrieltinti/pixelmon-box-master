
import { PokemonType } from '../types/pokemon';

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: '#A8A878',
  fire: '#F08030',
  water: '#6890F0',
  electric: '#F8D030',
  grass: '#78C850',
  ice: '#98D8D8',
  fighting: '#C03028',
  poison: '#A040A0',
  ground: '#E0C068',
  flying: '#A890F0',
  psychic: '#F85888',
  bug: '#A8B820',
  rock: '#B8A038',
  ghost: '#705898',
  dragon: '#7038F8',
  dark: '#705848',
  steel: '#B8B8D0',
  fairy: '#EE99AC',
};

export const getTypeColor = (type: PokemonType): string => {
  return TYPE_COLORS[type] || '#777777';
};

export const getBadgeClass = (type: PokemonType): string => {
  const baseClass = 'inline-block rounded-full px-3 py-1 text-sm font-semibold text-white mr-2 mb-2';
  return `${baseClass} bg-[${getTypeColor(type)}]`;
};
