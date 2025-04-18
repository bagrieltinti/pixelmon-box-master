
export type PokemonType = 
  | 'normal' | 'fire' | 'water' | 'electric' | 'grass' | 'ice' 
  | 'fighting' | 'poison' | 'ground' | 'flying' | 'psychic' | 'bug' 
  | 'rock' | 'ghost' | 'dragon' | 'dark' | 'steel' | 'fairy';

export interface PokemonData {
  id: number;
  name: string;
  spriteUrl: string;
  types: PokemonType[];
}

export interface PokemonState {
  pokemon: PokemonData[];
  capturedPokemon: Set<number>;
  currentBox: number;
  searchQuery: string;
  searchResult: PokemonData | null;
  selectedType: PokemonType | null;
  isLoading: boolean;
  error: string | null;
}
