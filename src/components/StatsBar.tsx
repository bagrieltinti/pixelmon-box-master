
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface StatsBarProps {
  totalPokemon: number;
  capturedCount: number;
}

const StatsBar: React.FC<StatsBarProps> = ({ totalPokemon, capturedCount }) => {
  const capturePercentage = totalPokemon > 0 
    ? Math.round((capturedCount / totalPokemon) * 100) 
    : 0;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-bold text-pokeRedDark">Progresso do Living Dex</h3>
        <span className="font-medium">
          {capturedCount} de {totalPokemon} ({capturePercentage}%)
        </span>
      </div>
      <Progress value={capturePercentage} className="h-2" />
    </div>
  );
};

export default StatsBar;
