
import React, { useState, useEffect, useRef } from 'react';
import { PokemonData, PokemonType } from '../types/pokemon';
import { fetchAllPokemon, organizeIntoBoxes } from '../services/pokemonService';
import { saveToStorage, loadFromStorage } from '../services/storageService';
import PokemonBox from '../components/PokemonBox';
import SearchBar from '../components/SearchBar';
import StatsBar from '../components/StatsBar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

const Index = () => {
  const [allPokemon, setAllPokemon] = useState<PokemonData[]>([]);
  const [boxes, setBoxes] = useState<PokemonData[][]>([]);
  const [currentBoxIndex, setCurrentBoxIndex] = useState(0);
  const [capturedPokemon, setCapturedPokemon] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [searchedPokemonId, setSearchedPokemonId] = useState<number | null>(null);
  const [selectedType, setSelectedType] = useState<PokemonType | null>(null);
  
  const searchedPokemonRef = useRef<HTMLDivElement>(null);

  // Load all Pokémon data and captured state from storage
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load captured Pokémon from storage
        const savedCaptured = loadFromStorage();
        setCapturedPokemon(savedCaptured);
        
        // Fetch all Pokémon data
        const pokemonData = await fetchAllPokemon();
        setAllPokemon(pokemonData);
        
        // Organize into boxes
        const organizedBoxes = organizeIntoBoxes(pokemonData);
        setBoxes(organizedBoxes);
      } catch (error) {
        console.error('Error loading data:', error);
        toast({
          title: "Erro ao carregar dados",
          description: "Não foi possível carregar os dados dos Pokémon. Tente novamente mais tarde.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadData();
  }, []);

  // Scroll to searched Pokémon when found
  useEffect(() => {
    if (searchedPokemonId && searchedPokemonRef.current) {
      searchedPokemonRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [searchedPokemonId]);

  // Handle Pokémon capture toggle
  const handlePokemonClick = (id: number) => {
    setCapturedPokemon(prevState => {
      const newState = new Set(prevState);
      if (newState.has(id)) {
        newState.delete(id);
      } else {
        newState.add(id);
      }
      
      // Save updated state to storage
      saveToStorage(newState);
      
      return newState;
    });
  };

  // Handle search
  const handleSearch = (query: string) => {
    if (!query.trim()) return;
    
    const searchTerm = query.toLowerCase();
    let foundPokemon: PokemonData | undefined;
    
    // Check if search is a number (Pokémon ID)
    if (!isNaN(Number(searchTerm))) {
      foundPokemon = allPokemon.find(p => p.id === Number(searchTerm));
    } else {
      // Search by name
      foundPokemon = allPokemon.find(p => 
        p.name.toLowerCase().includes(searchTerm)
      );
    }
    
    if (foundPokemon) {
      // Find which box contains this Pokémon
      const boxIndex = Math.floor((foundPokemon.id - 1) / 30);
      
      // Set the current box to the one containing the Pokémon
      setCurrentBoxIndex(boxIndex);
      
      // Highlight the Pokémon
      setSearchedPokemonId(foundPokemon.id);
      
      // Clear highlight after 3 seconds
      setTimeout(() => {
        setSearchedPokemonId(null);
      }, 3000);
    } else {
      toast({
        title: "Pokémon não encontrado",
        description: `Não foi possível encontrar um Pokémon com o nome ou número "${query}"`,
        variant: "destructive"
      });
    }
  };

  // Handle type filter
  const handleTypeFilter = (type: PokemonType | null) => {
    setSelectedType(type);
  };

  // Navigate between boxes
  const goToPreviousBox = () => {
    setCurrentBoxIndex(prevIndex => 
      prevIndex > 0 ? prevIndex - 1 : prevIndex
    );
  };
  
  const goToNextBox = () => {
    setCurrentBoxIndex(prevIndex => 
      prevIndex < boxes.length - 1 ? prevIndex + 1 : prevIndex
    );
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-pokeRedDark mb-2">Pokémon Living Dex</h1>
          <p className="text-gray-600">Carregando seu organizador de Pokémon...</p>
        </div>
        
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-pokeRedDark" />
        </div>
        
        <div className="mt-8">
          <Skeleton className="h-12 w-full mb-4" />
          <Skeleton className="h-8 w-full mb-6" />
          
          <div className="grid grid-cols-6 gap-4">
            {Array.from({ length: 30 }).map((_, idx) => (
              <Skeleton key={idx} className="w-full aspect-square" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-pokeRedDark mb-2">Pokémon Living Dex</h1>
        <p className="text-gray-600">
          Organize sua coleção do Pokémon Fire Red
        </p>
      </div>
      
      <SearchBar 
        onSearch={handleSearch}
        onTypeFilter={handleTypeFilter}
        selectedType={selectedType}
        isLoading={isLoading}
      />
      
      <StatsBar 
        totalPokemon={allPokemon.length}
        capturedCount={capturedPokemon.size}
      />
      
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          onClick={goToPreviousBox}
          disabled={currentBoxIndex === 0}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" /> Box Anterior
        </Button>
        
        <span className="font-medium">
          Box {currentBoxIndex + 1} de {boxes.length}
        </span>
        
        <Button
          variant="outline"
          onClick={goToNextBox}
          disabled={currentBoxIndex === boxes.length - 1}
          className="flex items-center"
        >
          Box Seguinte <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
      
      <div ref={searchedPokemonRef}>
        {boxes.length > 0 && currentBoxIndex < boxes.length && (
          <PokemonBox
            boxNumber={currentBoxIndex}
            pokemon={boxes[currentBoxIndex]}
            capturedPokemon={capturedPokemon}
            searchedPokemonId={searchedPokemonId}
            selectedType={selectedType}
            onPokemonClick={handlePokemonClick}
          />
        )}
      </div>
      
      <div className="text-center text-gray-500 text-sm mt-8">
        Pokémon e todos os nomes relacionados são marcas registradas da Nintendo.
        <br />
        Este é um projeto não oficial de fãs.
      </div>
    </div>
  );
};

export default Index;
