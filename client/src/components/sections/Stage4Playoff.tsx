import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trophy, Medal, Crown } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Stage4PlayoffProps {
  isExpanded: boolean;
  onToggle: () => void;
}

interface PlayoffMatch {
  id: number;
  bracketRound: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  winnerName: string | null;
  isPlayed: boolean;
  matchDate: string | null;
  matchType: string;
}

export default function Stage4Playoff({ isExpanded, onToggle }: Stage4PlayoffProps) {
  // Fetch playoff matches
  const { data: playoffMatches = [], isLoading } = useQuery<PlayoffMatch[]>({
    queryKey: ['/api/stage4-playoff'],
    queryFn: async () => {
      const response = await fetch('/api/stage4-playoff');
      if (!response.ok) throw new Error('Failed to fetch playoff matches');
      return response.json();
    }
  });

  // Group matches by stage
  const quarterFinals = playoffMatches.filter(match => match.bracketRound === 'quarterfinals');
  const semiFinals = playoffMatches.filter(match => match.bracketRound === 'semifinals');
  const finalMatch = playoffMatches.find(match => match.bracketRound === 'final');
  const thirdPlaceMatch = playoffMatches.find(match => match.bracketRound === 'third_place');

  const getMatchStatusColor = (isPlayed: boolean) => {
    if (isPlayed) return 'border-green-500/50 bg-green-500/5';
    return 'border-gray-500/50 bg-gray-500/5';
  };

  const getMatchStatusText = (isPlayed: boolean) => {
    return isPlayed ? 'Terminat' : 'Programat';
  };

  const MatchCard = ({ match, title }: { match: PlayoffMatch, title: string }) => (
    <div className={`border rounded-lg p-4 ${getMatchStatusColor(match.isPlayed)} hover:bg-white/5 transition-colors`}>
      <div className="flex justify-between items-center mb-2">
        <h4 className="font-semibold text-white">{title}</h4>
        <span className={`text-xs px-2 py-1 rounded ${
          match.isPlayed ? 'bg-green-600 text-white' : 'bg-gray-600 text-white'
        }`}>
          {getMatchStatusText(match.isPlayed)}
        </span>
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`${match.winnerName === match.team1Name ? 'text-yellow-400 font-semibold' : 'text-gray-300'}`}>
            {match.team1Name}
          </span>
          <span className="text-primary font-bold">{match.team1Score}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className={`${match.winnerName === match.team2Name ? 'text-yellow-400 font-semibold' : 'text-gray-300'}`}>
            {match.team2Name}
          </span>
          <span className="text-primary font-bold">{match.team2Score}</span>
        </div>
      </div>
      
      <div className="mt-2 flex justify-between items-center text-xs">
        {match.matchDate && (
          <span className="text-gray-400">
            {new Date(match.matchDate).toLocaleDateString('ro-RO', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric'
            })}
          </span>
        )}
        <span className="text-gray-500">{match.matchType}</span>
      </div>
      
      {match.winnerName && (
        <div className="mt-2 text-center">
          <span className="text-yellow-400 text-sm font-medium">
            🏆 {match.winnerName}
          </span>
        </div>
      )}
    </div>
  );

  return (
    <div className="bg-gradient-to-r from-zinc-900/95 to-black/90 border border-primary/30 rounded-lg shadow-xl">
      <button
        onClick={onToggle}
        className="w-full p-6 text-left hover:bg-primary/5 transition-colors rounded-lg"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-amber-500 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-lg">4</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Stage 4 - Playoff</h2>
              <p className="text-gray-300 text-sm">8 echipe calificate - Format eliminatoriu</p>
            </div>
          </div>
          <ChevronDown 
            className={`w-6 h-6 text-primary transition-transform duration-200 ${
              isExpanded ? 'rotate-180' : ''
            }`}
          />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="px-6 pb-6"
          >
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Format Info */}
                <div className="bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/30 rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-primary mb-2 flex items-center">
                    <Trophy className="w-5 h-5 mr-2" />
                    Format Playoff
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Cele mai bune 8 echipe din Stage 3 Swiss se califică în playoff-ul eliminatoriu. 
                    Format: Sferturi → Semifinale → Finala + Meciul pentru locul 3.
                  </p>
                </div>

                {/* Quarterfinals */}
                {quarterFinals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Medal className="w-5 h-5 mr-2 text-bronze" />
                      Sferturi de finală
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {quarterFinals.map((match, index) => (
                        <MatchCard 
                          key={match.id} 
                          match={match} 
                          title={`Sfert ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Semifinals */}
                {semiFinals.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                      <Medal className="w-5 h-5 mr-2 text-silver" />
                      Semifinale
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {semiFinals.map((match, index) => (
                        <MatchCard 
                          key={match.id} 
                          match={match} 
                          title={`Semifinala ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Finals */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {thirdPlaceMatch && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Medal className="w-5 h-5 mr-2 text-bronze" />
                        Meciul pentru locul 3
                      </h3>
                      <MatchCard match={thirdPlaceMatch} title="Locul 3" />
                    </div>
                  )}

                  {finalMatch && (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                        <Crown className="w-5 h-5 mr-2 text-yellow-400" />
                        Marea Finală
                      </h3>
                      <MatchCard match={finalMatch} title="Finala" />
                    </div>
                  )}
                </div>

                {playoffMatches.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Trophy className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Stage 4 Playoff în curs de configurare</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Meciurile vor fi disponibile după finalizarea Stage 3 Swiss
                    </p>
                  </div>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}