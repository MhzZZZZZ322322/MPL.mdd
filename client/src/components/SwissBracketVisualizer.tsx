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

  // Group teams by record
  const getTeamsByRecord = () => {
    const records: { [key: string]: SwissStanding[] } = {};
    
    standings.forEach(team => {
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
    
    return (
      <div className="flex flex-col items-center">
        {/* Column Header */}
        <div className={`w-20 h-8 ${bgColor} border-2 ${textColor} rounded flex items-center justify-center text-sm font-bold mb-2`}>
          {label}
        </div>
        
        {/* Teams in this column */}
        <div className="space-y-1">
          {Array.from({ length: maxTeams }, (_, index) => {
            const team = teams[index];
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
        
        {/* VS indicators between columns */}
        {record !== '2-0' && record !== '0-2' && (
          <div className="absolute right-[-15px] top-[40px]">
            <div className="space-y-[36px]">
              {Array.from({ length: Math.min(teams.length, 4) }, (_, i) => (
                <div key={i} className="text-gray-400 text-xs font-bold">vs</div>
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

  return (
    <div className="relative w-full min-h-[600px] bg-gradient-to-br from-slate-900/95 to-slate-800/90 rounded-lg border border-slate-600/50 p-6 overflow-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">SWISS BRACKET</h2>
        <p className="text-gray-300">16 echipe → 8 calificate | 3 victorii = avansat | 3 înfrângeri = eliminat</p>
      </div>

      {/* Swiss Layout - exactly like in the image */}
      <div className="flex justify-center space-x-8">
        {/* Column 1: 0-0 */}
        <div className="relative">
          {renderSwissColumn('0-0', '0-0', 'bg-blue-600', 'border-blue-400 text-blue-100')}
        </div>

        {/* Column 2: 1-0 */}
        <div className="relative">
          {renderSwissColumn('1-0', '1-0', 'bg-green-600', 'border-green-400 text-green-100')}
        </div>

        {/* Column 3: 2-0 */}
        <div className="relative">
          {renderSwissColumn('2-0', '2-0', 'bg-green-700', 'border-green-300 text-green-100')}
        </div>

        {/* QUALIFIED Box */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-8 bg-yellow-600 border-2 border-yellow-400 text-yellow-100 rounded flex items-center justify-center text-sm font-bold mb-2">
            QUALIFIED
          </div>
          <div className="space-y-1">
            {teamsByRecord['3-0']?.slice(0, 4).map((team, index) => (
              <div key={`qualified-3-0-${index}`} className="w-24 h-8 bg-yellow-500 border border-yellow-300 rounded text-xs text-black flex items-center justify-center font-medium">
                <span className="truncate px-1">{team.teamName}</span>
              </div>
            )) || Array.from({length: 4}, (_, i) => (
              <div key={`qualified-empty-${i}`} className="w-24 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
            ))}
          </div>
        </div>

        {/* QUALIFIED Box 2 */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-8 bg-yellow-600 border-2 border-yellow-400 text-yellow-100 rounded flex items-center justify-center text-sm font-bold mb-2">
            QUALIFIED
          </div>
          <div className="space-y-1">
            {teamsByRecord['3-1']?.slice(0, 4).map((team, index) => (
              <div key={`qualified-3-1-${index}`} className="w-24 h-8 bg-yellow-500 border border-yellow-300 rounded text-xs text-black flex items-center justify-center font-medium">
                <span className="truncate px-1">{team.teamName}</span>
              </div>
            )) || Array.from({length: 4}, (_, i) => (
              <div key={`qualified-2-empty-${i}`} className="w-24 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
            ))}
          </div>
        </div>

        {/* QUALIFIED Box 3 */}
        <div className="flex flex-col items-center">
          <div className="w-24 h-8 bg-yellow-600 border-2 border-yellow-400 text-yellow-100 rounded flex items-center justify-center text-sm font-bold mb-2">
            QUALIFIED
          </div>
          <div className="space-y-1">
            {teamsByRecord['3-2']?.slice(0, 4).map((team, index) => (
              <div key={`qualified-3-2-${index}`} className="w-24 h-8 bg-yellow-500 border border-yellow-300 rounded text-xs text-black flex items-center justify-center font-medium">
                <span className="truncate px-1">{team.teamName}</span>
              </div>
            )) || Array.from({length: 4}, (_, i) => (
              <div key={`qualified-3-empty-${i}`} className="w-24 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row - Mixed Records */}
      <div className="flex justify-center space-x-8 mt-12">
        {/* Column: 0-1 */}
        <div className="relative">
          {renderSwissColumn('0-1', '0-1', 'bg-orange-600', 'border-orange-400 text-orange-100')}
        </div>

        {/* Column: 1-1 */}
        <div className="relative">
          {renderSwissColumn('1-1', '1-1', 'bg-yellow-700', 'border-yellow-500 text-yellow-100')}
        </div>

        {/* Column: 2-1 */}
        <div className="relative">
          {renderSwissColumn('2-1', '2-1', 'bg-orange-700', 'border-orange-500 text-orange-100')}
        </div>

        {/* Column: 1-2 */}
        <div className="relative">
          {renderSwissColumn('1-2', '1-2', 'bg-red-700', 'border-red-500 text-red-100')}
        </div>

        {/* Column: 0-2 */}
        <div className="relative">
          {renderSwissColumn('0-2', '0-2', 'bg-red-600', 'border-red-400 text-red-100')}
        </div>

        {/* ELIMINATED Boxes */}
        <div className="space-y-4">
          <div className="flex flex-col items-center">
            <div className="w-24 h-8 bg-red-800 border-2 border-red-400 text-red-100 rounded flex items-center justify-center text-sm font-bold mb-2">
              ELIMINATED
            </div>
            <div className="space-y-1">
              {teamsByRecord['0-3']?.slice(0, 3).map((team, index) => (
                <div key={`elim-0-3-${index}`} className="w-24 h-8 bg-red-600 border border-red-400 rounded text-xs text-white flex items-center justify-center font-medium">
                  <span className="truncate px-1">{team.teamName}</span>
                </div>
              )) || Array.from({length: 3}, (_, i) => (
                <div key={`elim-1-empty-${i}`} className="w-24 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-24 h-8 bg-red-800 border-2 border-red-400 text-red-100 rounded flex items-center justify-center text-sm font-bold mb-2">
              ELIMINATED
            </div>
            <div className="space-y-1">
              {[...(teamsByRecord['1-3'] || []), ...(teamsByRecord['2-3'] || [])].slice(0, 5).map((team, index) => (
                <div key={`elim-mixed-${index}`} className="w-24 h-8 bg-red-600 border border-red-400 rounded text-xs text-white flex items-center justify-center font-medium">
                  <span className="truncate px-1">{team.teamName}</span>
                </div>
              )) || Array.from({length: 5}, (_, i) => (
                <div key={`elim-2-empty-${i}`} className="w-24 h-8 bg-slate-800/50 border border-slate-600/50 rounded text-xs text-slate-600 flex items-center justify-center">-</div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}