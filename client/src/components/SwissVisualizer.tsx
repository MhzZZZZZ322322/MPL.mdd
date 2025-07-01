import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Trophy, Crown, X } from "lucide-react";

interface SwissStanding {
  teamName: string;
  wins: number;
  losses: number;
  roundsWon: number;
  roundsLost: number;
  status: string;
}

interface SwissMatch {
  id: number;
  roundNumber: number;
  team1Name: string;
  team2Name: string;
  team1Score?: number;
  team2Score?: number;
  winnerName?: string;
  isPlayed: boolean;
  matchType: string;
  isDecisive: boolean;
}

interface TeamPosition {
  teamName: string;
  wins: number;
  losses: number;
  status: string;
  x: number;
  y: number;
}

export function SwissVisualizer() {
  // Fetch data - no refresh interval since Stage3Swiss component already handles it
  const { data: standings = [] } = useQuery<SwissStanding[]>({
    queryKey: ["/api/stage3-swiss-standings"],
  });

  const { data: matches = [] } = useQuery<SwissMatch[]>({
    queryKey: ["/api/stage3-swiss-matches"],
  });

  // Group teams by their record (wins-losses)
  const getTeamsByRecord = () => {
    const records: { [key: string]: SwissStanding[] } = {};
    
    standings.forEach(team => {
      const record = `${team.wins}-${team.losses}`;
      if (!records[record]) {
        records[record] = [];
      }
      records[record].push(team);
    });

    return records;
  };

  // Generate positions for Swiss visualization - only real teams from database
  const generateSwissLayout = () => {
    // Use only teams from database, positioned by their actual record
    if (standings.length > 0) {
      return standings.map((team) => ({
        teamName: team.teamName,
        wins: team.wins,
        losses: team.losses,
        status: team.status,
        x: 0, // Will be positioned in columns based on wins/losses
        y: 0  // Will be positioned vertically
      }));
    }

    // If no teams in database yet, show empty state
    return [];
  };

  const teamPositions = generateSwissLayout();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'qualified':
        return <Crown className="w-4 h-4 text-yellow-400" />;
      case 'eliminated':
        return <X className="w-4 h-4 text-red-400" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string, wins: number, losses: number) => {
    if (status === 'qualified' || wins === 3) return 'border-yellow-400 bg-yellow-400/10';
    if (status === 'eliminated' || losses === 3) return 'border-red-400 bg-red-400/10';
    if (wins === 2 && losses <= 1) return 'border-green-400 bg-green-400/10';
    if (wins === 1 && losses <= 1) return 'border-blue-400 bg-blue-400/10';
    return 'border-gray-400 bg-gray-400/10';
  };

  if (standings.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Trophy className="w-12 h-12 mx-auto mb-2" />
          <p>Nicio echipă în Swiss System încă</p>
          <p className="text-sm">Adaugă echipe în interfața admin pentru a vedea schema vizuală</p>
        </div>
      </div>
    );
  }

  // Generate Swiss matchups for next rounds
  const generateNextRoundMatchups = (roundNumber: number) => {
    // Get teams that are still active (not qualified or eliminated)
    const activeTeams = standings.filter(team => 
      team.status === 'active' && 
      team.wins < 3 && 
      team.losses < 3
    );

    if (activeTeams.length === 0) return [];

    // Group teams by record
    const recordGroups: { [key: string]: any[] } = {};
    activeTeams.forEach(team => {
      const record = `${team.wins}-${team.losses}`;
      if (!recordGroups[record]) recordGroups[record] = [];
      recordGroups[record].push(team);
    });

    // Generate matchups within same record groups
    const suggestedMatchups: Array<{team1: string, team2: string, record: string}> = [];
    Object.values(recordGroups).forEach(group => {
      for (let i = 0; i < group.length - 1; i += 2) {
        if (group[i + 1]) {
          suggestedMatchups.push({
            team1: group[i].teamName,
            team2: group[i + 1].teamName,
            record: `${group[i].wins}-${group[i].losses}`
          });
        }
      }
    });

    return suggestedMatchups;
  };

  // Generate Swiss rounds with matches and suggested matchups
  const generateSwissRounds = () => {
    const rounds = [];
    
    for (let round = 1; round <= 5; round++) {
      const roundMatches = matches.filter(m => m.roundNumber === round);
      const suggestedMatchups = round > Math.max(...matches.map(m => m.roundNumber), 0) 
        ? generateNextRoundMatchups(round) 
        : [];

      rounds.push({
        roundNumber: round,
        matches: roundMatches,
        suggestedMatchups
      });
    }
    
    return rounds;
  };

  const swissRounds = generateSwissRounds();

  return (
    <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-900/95 to-slate-800/90 rounded-lg border border-slate-600/50 overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-6 right-6 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-yellow-400">SWISS STAGE</h3>
          <p className="text-sm text-gray-300">16 echipe → 8 calificate</p>
        </div>
        <div className="text-right">
          <p className="text-green-400 font-semibold text-sm">3 WINS: ADVANCE</p>
          <p className="text-red-400 font-semibold text-sm">3 LOSSES: ELIMINATED</p>
        </div>
      </div>

      {/* Swiss progression visualization */}
      <div className="absolute inset-6 top-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Background grid */}
          <defs>
            <pattern id="grid" width="50" height="30" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 30" fill="none" stroke="#374151" strokeWidth="0.5" opacity="0.3"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Round columns */}
        {[0, 1, 2, 3, 4].map((roundIndex) => (
          <div key={roundIndex} className="absolute" style={{ left: `${roundIndex * 150 + 20}px`, top: '10px' }}>
            {/* Round header */}
            <div className="text-center mb-3">
              <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold border-2 
                ${roundIndex === 0 ? 'border-blue-400 bg-blue-400/20 text-blue-400' :
                  'border-gray-600 bg-gray-600/20 text-gray-400'}`}>
                {roundIndex === 0 ? 'START' : `R${roundIndex}`}
              </div>
            </div>

            {/* Teams in this round */}
            <div className="space-y-1">
              {roundIndex === 0 ? (
                // Starting position - all 16 teams in one column
                teamPositions.slice(0, 16).map((team, index) => (
                  <motion.div
                    key={`start-${index}`}
                    className="w-28 h-6 bg-slate-700/90 border border-slate-500 rounded flex items-center justify-center text-xs font-medium text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <span className="truncate px-1 text-[10px]">{team.teamName}</span>
                  </motion.div>
                ))
              ) : (
                // Show teams based on their record after each round
                <div className="space-y-3">
                  {/* Winners section */}
                  {teamPositions.filter(t => t.wins === roundIndex && t.losses === 0).length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold mb-1 text-center text-green-400">
                        {roundIndex}-0
                      </div>
                      {teamPositions.filter(t => t.wins === roundIndex && t.losses === 0).map((team, teamIndex) => (
                        <motion.div
                          key={`${roundIndex}-0-${teamIndex}`}
                          className="w-28 h-6 bg-green-600/90 border border-green-400 rounded flex items-center justify-center text-white mb-1"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (roundIndex * 0.2) + (teamIndex * 0.05) }}
                        >
                          <span className="truncate px-1 text-[10px] font-medium">{team.teamName}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                  
                  {/* Mixed records */}
                  {Array.from({length: roundIndex}, (_, i) => i + 1).reverse().map(wins => {
                    const losses = roundIndex - wins;
                    const teamsWithRecord = teamPositions.filter(t => t.wins === wins && t.losses === losses);
                    if (teamsWithRecord.length === 0) return null;
                    
                    return (
                      <div key={`${wins}-${losses}`}>
                        <div className="text-[10px] font-semibold mb-1 text-center text-gray-300">
                          {wins}-{losses}
                        </div>
                        {teamsWithRecord.map((team, teamIndex) => (
                          <motion.div
                            key={`${wins}-${losses}-${teamIndex}`}
                            className="w-28 h-6 bg-slate-600/90 border border-slate-400 rounded flex items-center justify-center text-white mb-1"
                            initial={{ opacity: 0, x: -15 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: (roundIndex * 0.2) + (teamIndex * 0.05) }}
                          >
                            <span className="truncate px-1 text-[10px] font-medium">{team.teamName}</span>
                          </motion.div>
                        ))}
                      </div>
                    );
                  })}
                  
                  {/* Losers section */}
                  {teamPositions.filter(t => t.wins === 0 && t.losses === roundIndex).length > 0 && (
                    <div>
                      <div className="text-[10px] font-semibold mb-1 text-center text-red-400">
                        0-{roundIndex}
                      </div>
                      {teamPositions.filter(t => t.wins === 0 && t.losses === roundIndex).map((team, teamIndex) => (
                        <motion.div
                          key={`0-${roundIndex}-${teamIndex}`}
                          className="w-28 h-6 bg-red-600/90 border border-red-400 rounded flex items-center justify-center text-white mb-1"
                          initial={{ opacity: 0, x: -15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (roundIndex * 0.2) + (teamIndex * 0.05) }}
                        >
                          <span className="truncate px-1 text-[10px] font-medium">{team.teamName}</span>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Qualification area */}
        <div className="absolute" style={{ left: '780px', top: '60px' }}>
          <div className="bg-green-900/50 border-2 border-green-400 rounded-lg p-3 w-36">
            <div className="flex items-center justify-center mb-2">
              <Crown className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-xs text-green-400 font-bold">QUALIFIED</span>
            </div>
            <div className="text-center text-xs text-gray-300 mb-2">
              {standings.filter(t => t.status === 'qualified' || t.wins >= 3).length}/8
            </div>
            {teamPositions.filter(t => t.wins >= 3 || t.status === 'qualified').map((team, index) => (
              <div key={`qualified-${index}`} className="w-full h-5 bg-yellow-500/90 border border-yellow-300 rounded text-[10px] text-black flex items-center justify-center mb-1 font-medium">
                <span className="truncate px-1">{team.teamName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Elimination area */}
        <div className="absolute" style={{ left: '200px', top: '380px' }}>
          <div className="bg-red-900/50 border-2 border-red-400 rounded-lg p-3 w-36">
            <div className="flex items-center justify-center mb-2">
              <X className="w-4 h-4 text-red-400 mr-1" />
              <span className="text-xs text-red-400 font-bold">ELIMINATED</span>
            </div>
            <div className="text-center text-xs text-gray-300 mb-2">
              {standings.filter(t => t.status === 'eliminated' || t.losses >= 3).length}
            </div>
            {teamPositions.filter(t => t.losses >= 3 || t.status === 'eliminated').map((team, index) => (
              <div key={`eliminated-${index}`} className="w-full h-5 bg-red-600/90 border border-red-400 rounded text-[10px] text-white flex items-center justify-center mb-1 font-medium">
                <span className="truncate px-1">{team.teamName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Next Round Matchups */}
        {(() => {
          const currentRound = Math.max(...matches.map(m => m.roundNumber), 0);
          const nextRound = currentRound + 1;
          const nextMatchups = generateNextRoundMatchups(nextRound);
          
          if (nextMatchups.length > 0 && nextRound <= 5) {
            return (
              <div className="absolute" style={{ left: '400px', top: '350px' }}>
                <div className="bg-blue-900/50 border-2 border-blue-400 rounded-lg p-3 w-48">
                  <div className="flex items-center justify-center mb-2">
                    <Trophy className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-xs text-blue-400 font-bold">URMĂTOAREA RUNDĂ {nextRound}</span>
                  </div>
                  <div className="space-y-1">
                    {nextMatchups.map((matchup, index) => (
                      <div key={`next-${index}`} className="bg-slate-700/80 border border-slate-500 rounded p-2">
                        <div className="text-center text-[10px] text-gray-300 mb-1">
                          Record: {matchup.record}
                        </div>
                        <div className="flex items-center justify-between text-[10px] text-white">
                          <span className="truncate w-16 text-left">{matchup.team1}</span>
                          <span className="text-gray-400 text-[8px]">VS</span>
                          <span className="truncate w-16 text-right">{matchup.team2}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }
          return null;
        })()}
      </div>
    </div>
  );
}