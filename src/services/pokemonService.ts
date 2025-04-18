
import { PokemonData, PokemonType } from '../types/pokemon';

// We're limiting to Gen 1-3 (1-386) as specified
const POKEMON_LIMIT = 386;
const BASE_URL = 'https://pokeapi.co/api/v2';

export const fetchAllPokemon = async (): Promise<PokemonData[]> => {
  try {
    const pokemonList: PokemonData[] = [];
    
    // Fetch Pokemon in batches to prevent rate limiting
    const batchSize = 50;
    const batches = Math.ceil(POKEMON_LIMIT / batchSize);
    
    for (let batch = 0; batch < batches; batch++) {
      const start = batch * batchSize + 1;
      const end = Math.min((batch + 1) * batchSize, POKEMON_LIMIT);
      const batchPromises = [];
      
      for (let id = start; id <= end; id++) {
        batchPromises.push(fetchPokemonById(id));
      }
      
      const batchResults = await Promise.all(batchPromises);
      pokemonList.push(...batchResults);
    }
    
    return pokemonList;
  } catch (error) {
    console.error('Error fetching all Pokemon:', error);
    throw error;
  }
};

export const fetchPokemonById = async (id: number): Promise<PokemonData> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${id}`);
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      spriteUrl: data.sprites.front_default,
      types: data.types.map((type: { type: { name: string } }) => type.type.name as PokemonType),
    };
  } catch (error) {
    console.error(`Error fetching Pokemon with ID ${id}:`, error);
    throw error;
  }
};

export const fetchPokemonByName = async (name: string): Promise<PokemonData> => {
  try {
    const response = await fetch(`${BASE_URL}/pokemon/${name.toLowerCase()}`);
    const data = await response.json();
    
    return {
      id: data.id,
      name: data.name,
      spriteUrl: data.sprites.front_default,
      types: data.types.map((type: { type: { name: string } }) => type.type.name as PokemonType),
    };
  } catch (error) {
    console.error(`Error fetching Pokemon with name ${name}:`, error);
    throw error;
  }
};

// Group Pokémon into boxes (30 Pokémon per box)
export const organizeIntoBoxes = (pokemon: PokemonData[]): PokemonData[][] => {
  const boxes: PokemonData[][] = [];
  const pokemonPerBox = 30; // 6x5 grid
  
  for (let i = 0; i < pokemon.length; i += pokemonPerBox) {
    boxes.push(pokemon.slice(i, i + pokemonPerBox));
  }
  
  return boxes;
};
