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
  // Fetch data
  const { data: standings = [] } = useQuery<SwissStanding[]>({
    queryKey: ["/api/stage3-swiss-standings"],
    refetchInterval: 5000,
  });

  const { data: matches = [] } = useQuery<SwissMatch[]>({
    queryKey: ["/api/stage3-swiss-matches"],
    refetchInterval: 5000,
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

  // Generate Swiss rounds with proper matchups
  const generateSwissRounds = () => {
    const rounds = [];
    
    // Round 1 - all teams start at 0-0
    const startingTeams = teamPositions.filter(t => t.wins === 0 && t.losses === 0);
    
    for (let round = 1; round <= 5; round++) {
      rounds.push({
        roundNumber: round,
        matches: matches.filter(m => m.roundNumber === round)
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
          <div key={roundIndex} className="absolute" style={{ left: `${roundIndex * 180 + 20}px`, top: '20px' }}>
            {/* Round header */}
            <div className="text-center mb-4">
              <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold border-2 
                ${roundIndex === 0 ? 'border-blue-400 bg-blue-400/20 text-blue-400' :
                  'border-gray-600 bg-gray-600/20 text-gray-400'}`}>
                {roundIndex === 0 ? 'START' : `R${roundIndex}`}
              </div>
            </div>

            {/* Teams in this round */}
            <div className="space-y-2">
              {roundIndex === 0 ? (
                // Starting position - all 16 teams
                teamPositions.slice(0, 16).map((team, index) => (
                  <motion.div
                    key={`start-${index}`}
                    className="w-32 h-8 bg-slate-700/80 border border-slate-500 rounded flex items-center justify-center text-xs font-medium text-white"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <span className="truncate px-2">{team.teamName}</span>
                  </motion.div>
                ))
              ) : (
                // Show teams based on their record after each round
                ['3-0', '2-1', '1-2', '0-3'].map((record, recordIndex) => {
                  const [wins, losses] = record.split('-').map(Number);
                  const teamsWithRecord = teamPositions.filter(t => 
                    t.wins === wins && t.losses === losses
                  );
                  
                  if (teamsWithRecord.length === 0) return null;
                  
                  return (
                    <div key={record} className="mb-4">
                      <div className={`text-xs font-semibold mb-1 text-center
                        ${wins === 3 ? 'text-green-400' :
                          losses === 3 ? 'text-red-400' : 'text-gray-300'}`}>
                        {record}
                      </div>
                      {teamsWithRecord.map((team, teamIndex) => (
                        <motion.div
                          key={`${record}-${teamIndex}`}
                          className={`w-32 h-7 border rounded flex items-center justify-center text-xs font-medium mb-1
                            ${wins === 3 ? 'bg-green-600/80 border-green-400 text-white' :
                              losses === 3 ? 'bg-red-600/80 border-red-400 text-white' :
                              'bg-slate-600/80 border-slate-400 text-white'}`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (roundIndex * 0.3) + (teamIndex * 0.1) }}
                        >
                          <span className="truncate px-2">{team.teamName}</span>
                        </motion.div>
                      ))}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ))}

        {/* Qualification area */}
        <div className="absolute right-6 top-20">
          <div className="bg-green-900/40 border-2 border-green-400 rounded-lg p-4 w-40">
            <div className="flex items-center justify-center mb-3">
              <Crown className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-sm text-green-400 font-bold">QUALIFIED</span>
            </div>
            <div className="text-center text-xs text-gray-300 mb-3">
              {standings.filter(t => t.status === 'qualified' || t.wins >= 3).length}/8
            </div>
            {teamPositions.filter(t => t.wins >= 3 || t.status === 'qualified').map((team, index) => (
              <div key={`qualified-${index}`} className="w-full h-6 bg-yellow-500/80 border border-yellow-300 rounded text-xs text-black flex items-center justify-center mb-1 font-medium">
                <span className="truncate px-2">{team.teamName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Elimination area */}
        <div className="absolute left-6 bottom-6">
          <div className="bg-red-900/40 border-2 border-red-400 rounded-lg p-4 w-40">
            <div className="flex items-center justify-center mb-3">
              <X className="w-5 h-5 text-red-400 mr-2" />
              <span className="text-sm text-red-400 font-bold">ELIMINATED</span>
            </div>
            <div className="text-center text-xs text-gray-300 mb-3">
              {standings.filter(t => t.status === 'eliminated' || t.losses >= 3).length}
            </div>
            {teamPositions.filter(t => t.losses >= 3 || t.status === 'eliminated').map((team, index) => (
              <div key={`eliminated-${index}`} className="w-full h-6 bg-red-600/80 border border-red-400 rounded text-xs text-white flex items-center justify-center mb-1 font-medium">
                <span className="truncate px-2">{team.teamName}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}