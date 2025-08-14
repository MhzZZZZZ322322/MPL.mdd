import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trophy, Star, Award, Crown, TrendingUp } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';

interface Stage3SwissProps {
  isExpanded: boolean;
  onToggle: () => void;
}

interface SwissStanding {
  id: number;
  teamName: string;
  wins: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  status: 'qualified' | 'eliminated';
  tournamentId: string;
}

export function Stage3Swiss({ isExpanded, onToggle }: Stage3SwissProps) {
  // Fetch Swiss standings
  const { data: standings = [], isLoading } = useQuery<SwissStanding[]>({
    queryKey: ['/api/stage3-swiss-standings'],
    queryFn: async () => {
      const response = await fetch('/api/stage3-swiss-standings');
      if (!response.ok) throw new Error('Failed to fetch Swiss standings');
      return response.json();
    }
  });

  // Separate qualified and eliminated teams
  const qualifiedTeams = standings.filter(team => team.status === 'qualified');
  const eliminatedTeams = standings.filter(team => team.status === 'eliminated');

  const getStatusIcon = (status: string) => {
    return status === 'qualified' ? 
      <Crown className="w-4 h-4 text-yellow-400" /> : 
      <div className="w-4 h-4" />;
  };

  const getStatusColor = (status: string) => {
    return status === 'qualified' ? 
      'border-green-500/50 bg-green-500/5' : 
      'border-red-500/50 bg-red-500/5';
  };

  const StandingsTable = ({ teams, title, bgColor }: { 
    teams: SwissStanding[], 
    title: string,
    bgColor: string 
  }) => (
    <div className={`${bgColor} border border-primary/30 rounded-lg p-4`}>
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
        {title === 'Echipe Calificate' ? 
          <Trophy className="w-5 h-5 mr-2 text-yellow-400" /> :
          <Award className="w-5 h-5 mr-2 text-gray-400" />
        }
        {title} ({teams.length})
      </h4>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-600">
              <th className="text-left py-2 text-gray-300">Pos</th>
              <th className="text-left py-2 text-gray-300">Echipa</th>
              <th className="text-center py-2 text-gray-300">W-L</th>
              <th className="text-center py-2 text-gray-300">Rounds</th>
              <th className="text-center py-2 text-gray-300">Diff</th>
              <th className="text-center py-2 text-gray-300">Status</th>
            </tr>
          </thead>
          <tbody>
            {teams.map((team, index) => (
              <tr key={team.id} className="border-b border-gray-700/50 hover:bg-white/5">
                <td className="py-2 text-gray-300">{index + 1}</td>
                <td className="py-2">
                  <span className={`font-medium ${
                    team.status === 'qualified' ? 'text-yellow-400' : 'text-gray-300'
                  }`}>
                    {team.teamName}
                  </span>
                </td>
                <td className="text-center py-2">
                  <span className="text-green-400">{team.wins}</span>
                  <span className="text-gray-500 mx-1">-</span>
                  <span className="text-red-400">{team.losses}</span>
                </td>
                <td className="text-center py-2 text-gray-300">
                  {team.roundsWon}-{team.roundsLost}
                </td>
                <td className="text-center py-2">
                  <span className={`${
                    (team.roundsWon - team.roundsLost) > 0 ? 'text-green-400' : 
                    (team.roundsWon - team.roundsLost) < 0 ? 'text-red-400' : 'text-gray-400'
                  }`}>
                    {team.roundsWon - team.roundsLost > 0 ? '+' : ''}
                    {team.roundsWon - team.roundsLost}
                  </span>
                </td>
                <td className="text-center py-2">
                  {getStatusIcon(team.status)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
              <span className="text-white font-bold text-lg">3</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Stage 3 - Swiss System</h2>
              <p className="text-gray-300 text-sm">
                {qualifiedTeams.length} echipe calificate • {eliminatedTeams.length} echipe eliminate
              </p>
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
                    <TrendingUp className="w-5 h-5 mr-2" />
                    Swiss System Format
                  </h3>
                  <p className="text-gray-300 text-sm">
                    Cele mai bune 16 echipe din Stage 2 participă în Swiss System. 
                    Sistemul garantează că echipele se înfruntă cu adversari de forță similară.
                  </p>
                </div>

                {/* Qualification Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
                    <Trophy className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                    <h4 className="text-green-400 font-semibold">Calificate în Playoff</h4>
                    <p className="text-2xl font-bold text-yellow-400">{qualifiedTeams.length}</p>
                    <p className="text-gray-400 text-xs">Top 8 echipe</p>
                  </div>
                  
                  <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
                    <Award className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                    <h4 className="text-red-400 font-semibold">Eliminate</h4>
                    <p className="text-2xl font-bold text-red-400">{eliminatedTeams.length}</p>
                    <p className="text-gray-400 text-xs">Bottom {eliminatedTeams.length} echipe</p>
                  </div>
                </div>

                {/* Qualified Teams */}
                {qualifiedTeams.length > 0 && (
                  <StandingsTable 
                    teams={qualifiedTeams} 
                    title="Echipe Calificate" 
                    bgColor="bg-green-900/10"
                  />
                )}

                {/* Eliminated Teams */}
                {eliminatedTeams.length > 0 && (
                  <StandingsTable 
                    teams={eliminatedTeams} 
                    title="Echipe Eliminate" 
                    bgColor="bg-red-900/10"
                  />
                )}

                {standings.length === 0 && !isLoading && (
                  <div className="text-center py-8">
                    <Star className="w-16 h-16 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Stage 3 Swiss în curs de desfășurare</p>
                    <p className="text-gray-500 text-sm mt-2">
                      Clasamentul va fi disponibil după primele meciuri
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