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

export function SwissBracketVisualizer() {
  // Fetch data
  const { data: standings = [] } = useQuery<SwissStanding[]>({
    queryKey: ["/api/stage3-swiss-standings"],
  });

  const { data: matches = [] } = useQuery<SwissMatch[]>({
    queryKey: ["/api/stage3-swiss-matches"],
  });

  // Calculate real-time standings based on played matches
  const calculateCurrentStandings = () => {
    const teamStats: { [key: string]: { wins: number; losses: number; roundsWon: number; roundsLost: number } } = {};
    
    // Initialize all teams
    standings.forEach(team => {
      teamStats[team.teamName] = { wins: 0, losses: 0, roundsWon: 0, roundsLost: 0 };
    });

    // Process played matches
    matches.filter(match => match.isPlayed && match.winnerName).forEach(match => {
      const team1Stats = teamStats[match.team1Name];
      const team2Stats = teamStats[match.team2Name];
      
      if (team1Stats && team2Stats) {
        const team1Score = match.team1Score || 0;
        const team2Score = match.team2Score || 0;
        
        team1Stats.roundsWon += team1Score;
        team1Stats.roundsLost += team2Score;
        team2Stats.roundsWon += team2Score;
        team2Stats.roundsLost += team1Score;
        
        if (match.winnerName === match.team1Name) {
          team1Stats.wins++;
          team2Stats.losses++;
        } else if (match.winnerName === match.team2Name) {
          team2Stats.wins++;
          team1Stats.losses++;
        }
      }
    });

    // Convert to standings format
    return Object.entries(teamStats).map(([teamName, stats]) => ({
      teamName,
      wins: stats.wins,
      losses: stats.losses,
      roundsWon: stats.roundsWon,
      roundsLost: stats.roundsLost,
      status: stats.wins >= 3 ? 'qualified' : stats.losses >= 3 ? 'eliminated' : 'active'
    }));
  };

  const currentStandings = calculateCurrentStandings();

  // Group teams by record using calculated standings
  const getTeamsByRecord = () => {
    const records: { [key: string]: typeof currentStandings } = {};
    
    currentStandings.forEach(team => {
      const record = `${team.wins}-${team.losses}`;
      if (!records[record]) records[record] = [];
      records[record].push(team);
    });

    return records;
  };

  const teamsByRecord = getTeamsByRecord();

  // Swiss Bracket Layout exactly like in the image
  const renderSwissColumn = (record: string, label: string, bgColor: string, textColor: string) => {
    const teams = teamsByRecord[record] || [];
    const maxTeams = 8; // Maximum teams per column
    
    // Sort teams alphabetically for consistent display
    const sortedTeams = [...teams].sort((a, b) => a.teamName.localeCompare(b.teamName));
    
    return (
      <div className="flex flex-col items-center">
        {/* Column Header */}
        <div className={`w-20 h-8 ${bgColor} border-2 ${textColor} rounded flex items-center justify-center text-sm font-bold mb-2`}>
          {label}
        </div>
        
        {/* Teams in this column */}
        <div className="space-y-1">
          {Array.from({ length: maxTeams }, (_, index) => {
            const team = sortedTeams[index];
            return (
              <motion.div
                key={`${record}-${index}`}
                className={`w-20 h-8 border rounded flex items-center justify-center text-xs font-medium
                  ${team 
                    ? 'bg-slate-700 border-slate-500 text-white' 
                    : 'bg-slate-800/50 border-slate-600/50 text-slate-500'
                  }`}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                {team ? (
                  <span className="truncate px-1">{team.teamName}</span>
                ) : (
                  <span className="text-slate-600">-</span>
                )}
              </motion.div>
            );
          })}
        </div>
        
        {/* Connection indicators */}
        {record !== '3-0' && record !== '3-1' && record !== '3-2' && record !== '0-3' && record !== '1-3' && record !== '2-3' && sortedTeams.length > 0 && (
          <div className="absolute right-[-30px] top-[50px]">
            <div className="space-y-[36px]">
              {Array.from({ length: Math.min(sortedTeams.length, 4) }, (_, i) => (
                <div key={i} className="text-gray-400 text-xs font-bold bg-slate-800 px-1 rounded">vs</div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (standings.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-gray-400 mb-4">
          <Trophy className="w-12 h-12 mx-auto mb-2" />
          <p>Swiss Bracket nu este încă configurat</p>
          <p className="text-sm">Folosește admin panel pentru a configura echipele</p>
        </div>
      </div>
    );
  }

  // Current round matches
  const currentRoundMatches = matches.filter(match => !match.isPlayed);
  const currentRound = currentRoundMatches.length > 0 ? Math.max(...currentRoundMatches.map(m => m.roundNumber)) : 1;

  return (
    <>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">SWISS BRACKET</h2>
        <p className="text-gray-300">16 echipe → 8 calificate | 3 victorii = avansat | 3 înfrângeri = eliminat</p>
        <div className="mt-2 text-sm text-blue-400">
          Runda curentă: {currentRound} | Meciuri jucate: {matches.filter(m => m.isPlayed).length}/{matches.length}
        </div>
      </div>

      {/* Swiss Layout with connecting lines */}
      <div className="relative flex justify-center space-x-16">
        {/* SVG for connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ top: '60px' }}>
          {/* Lines from 0-0 to 1-0 and 0-1 */}
          <line x1="100" y1="80" x2="220" y2="80" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="100" y1="120" x2="220" y2="320" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="100" y1="160" x2="220" y2="120" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="100" y1="200" x2="220" y2="360" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Lines from 1-0 to 2-0 and 1-1 */}
          <line x1="340" y1="80" x2="460" y2="80" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="340" y1="120" x2="460" y2="360" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
          
          {/* Lines from 2-0 to QUALIFIED */}
          <line x1="580" y1="80" x2="700" y2="80" stroke="#eab308" strokeWidth="3" />
          
          {/* More complex connection lines */}
          <line x1="220" y1="400" x2="340" y2="400" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
          <line x1="460" y1="400" x2="580" y2="400" stroke="#64748b" strokeWidth="2" strokeDasharray="5,5" />
        </svg>

        {/* Column 1: 0-0 */}
        <div className="relative z-10">
          {renderSwissColumn('0-0', '0-0', 'bg-blue-600', 'border-blue-400 text-blue-100')}
        </div>

        {/* Column 2: 1-0 */}
        <div className="relative z-10">
          {renderSwissColumn('1-0', '1-0', 'bg-green-600', 'border-green-400 text-green-100')}
        </div>

        {/* Column 3: 2-0 */}
        <div className="relative z-10">
          {renderSwissColumn('2-0', '2-0', 'bg-green-700', 'border-green-300 text-green-100')}
        </div>

        {/* QUALIFIED Box */}
        <div className="flex flex-col items-center relative z-10">
          <div className="w-28 h-8 bg-orange-600 border-2 border-orange-400 text-orange-100 rounded flex items-center justify-center text-sm font-bold mb-2">
            QUALIFIED
          </div>
          <div className="space-y-1">
            {teamsByRecord['3-0']?.slice(0, 4).map((team, index) => (
              <div key={`qualified-3-0-${index}`} className="w-28 h-8 bg-orange-500 border border-orange-300 rounded text-xs text-black flex items-center justify-center font-medium">
                <span className="truncate px-1">{team.teamName}</span>
              </div>
            )) || Array.from({length: 4}, (_, i) => (
              <div key={`qualified-empty-${i}`} className="w-28 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
            ))}
          </div>
        </div>

        {/* QUALIFIED Box 2 */}
        <div className="flex flex-col items-center relative z-10">
          <div className="w-28 h-8 bg-orange-600 border-2 border-orange-400 text-orange-100 rounded flex items-center justify-center text-sm font-bold mb-2">
            QUALIFIED
          </div>
          <div className="space-y-1">
            {teamsByRecord['3-1']?.slice(0, 4).map((team, index) => (
              <div key={`qualified-3-1-${index}`} className="w-28 h-8 bg-orange-500 border border-orange-300 rounded text-xs text-black flex items-center justify-center font-medium">
                <span className="truncate px-1">{team.teamName}</span>
              </div>
            )) || Array.from({length: 4}, (_, i) => (
              <div key={`qualified-2-empty-${i}`} className="w-28 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
            ))}
          </div>
        </div>

        {/* QUALIFIED Box 3 */}
        <div className="flex flex-col items-center relative z-10">
          <div className="w-28 h-8 bg-orange-600 border-2 border-orange-400 text-orange-100 rounded flex items-center justify-center text-sm font-bold mb-2">
            QUALIFIED
          </div>
          <div className="space-y-1">
            {teamsByRecord['3-2']?.slice(0, 4).map((team, index) => (
              <div key={`qualified-3-2-${index}`} className="w-28 h-8 bg-orange-500 border border-orange-300 rounded text-xs text-black flex items-center justify-center font-medium">
                <span className="truncate px-1">{team.teamName}</span>
              </div>
            )) || Array.from({length: 4}, (_, i) => (
              <div key={`qualified-3-empty-${i}`} className="w-28 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Mixed Records with connections */}
      <div className="relative flex justify-center space-x-16 mt-16">
        {/* SVG for bottom connecting lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" style={{ top: '60px' }}>
          {/* Lines showing elimination paths */}
          <line x1="100" y1="80" x2="220" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
          <line x1="220" y1="80" x2="340" y2="80" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3,3" />
          <line x1="340" y1="80" x2="460" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
          <line x1="460" y1="80" x2="580" y2="80" stroke="#ef4444" strokeWidth="2" strokeDasharray="3,3" />
          
          {/* Elimination lines */}
          <line x1="580" y1="120" x2="700" y2="120" stroke="#dc2626" strokeWidth="3" />
        </svg>

        {/* Column: 0-1 */}
        <div className="relative z-10">
          {renderSwissColumn('0-1', '0-1', 'bg-orange-600', 'border-orange-400 text-orange-100')}
        </div>

        {/* Column: 1-1 */}
        <div className="relative z-10">
          {renderSwissColumn('1-1', '1-1', 'bg-yellow-700', 'border-yellow-500 text-yellow-100')}
        </div>

        {/* Column: 2-1 */}
        <div className="relative z-10">
          {renderSwissColumn('2-1', '2-1', 'bg-orange-700', 'border-orange-500 text-orange-100')}
        </div>

        {/* Column: 1-2 */}
        <div className="relative z-10">
          {renderSwissColumn('1-2', '1-2', 'bg-red-700', 'border-red-500 text-red-100')}
        </div>

        {/* Column: 0-2 */}
        <div className="relative z-10">
          {renderSwissColumn('0-2', '0-2', 'bg-red-600', 'border-red-400 text-red-100')}
        </div>

        {/* ELIMINATED Boxes */}
        <div className="space-y-4 relative z-10">
          <div className="flex flex-col items-center">
            <div className="w-28 h-8 bg-red-900 border-2 border-red-400 text-red-100 rounded flex items-center justify-center text-sm font-bold mb-2">
              ELIMINATED
            </div>
            <div className="space-y-1">
              {teamsByRecord['0-3']?.slice(0, 3).map((team, index) => (
                <div key={`elim-0-3-${index}`} className="w-28 h-8 bg-red-700 border border-red-400 rounded text-xs text-white flex items-center justify-center font-medium">
                  <span className="truncate px-1">{team.teamName}</span>
                </div>
              )) || Array.from({length: 3}, (_, i) => (
                <div key={`elim-1-empty-${i}`} className="w-28 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-28 h-8 bg-red-900 border-2 border-red-400 text-red-100 rounded flex items-center justify-center text-sm font-bold mb-2">
              ELIMINATED
            </div>
            <div className="space-y-1">
              {[...(teamsByRecord['1-3'] || []), ...(teamsByRecord['2-3'] || [])].slice(0, 5).map((team, index) => (
                <div key={`elim-mixed-${index}`} className="w-28 h-8 bg-red-700 border border-red-400 rounded text-xs text-white flex items-center justify-center font-medium">
                  <span className="truncate px-1">{team.teamName}</span>
                </div>
              )) || Array.from({length: 5}, (_, i) => (
                <div key={`elim-2-empty-${i}`} className="w-28 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}