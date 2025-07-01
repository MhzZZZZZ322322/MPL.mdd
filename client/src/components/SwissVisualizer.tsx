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

  // Generate positions for Swiss visualization - using demo data structure like in image
  const generateSwissLayout = () => {
    // Demo Swiss layout similar to the image
    const demoLayout = [
      // Starting teams (0-0)
      { teamName: 'Cadian', wins: 0, losses: 0, status: 'active', x: 70, y: 20 },
      { teamName: 'Japon', wins: 0, losses: 0, status: 'active', x: 70, y: 50 },
      { teamName: 'Auratix', wins: 0, losses: 0, status: 'active', x: 70, y: 80 },
      { teamName: 'VGT', wins: 0, losses: 0, status: 'active', x: 70, y: 110 },
      { teamName: 'Trigger', wins: 0, losses: 0, status: 'active', x: 70, y: 140 },
      { teamName: 'BPSP', wins: 0, losses: 0, status: 'active', x: 70, y: 170 },
      { teamName: 'Duke Z', wins: 0, losses: 0, status: 'active', x: 70, y: 200 },
      
      // 1-0 teams
      { teamName: 'XPlosion', wins: 3, losses: 0, status: 'qualified', x: 350, y: 50 },
      
      // 2-0 teams  
      { teamName: '', wins: 2, losses: 0, status: 'active', x: 250, y: 80 },
      
      // Other positions
      { teamName: '', wins: 1, losses: 1, status: 'active', x: 180, y: 140 },
      { teamName: '', wins: 0, losses: 1, status: 'active', x: 120, y: 170 },
    ];

    // If we have real data, merge it with demo structure
    if (standings.length > 0) {
      const realTeams = standings.slice(0, 8); // Take first 8 teams
      return realTeams.map((team, index) => ({
        teamName: team.teamName,
        wins: team.wins,
        losses: team.losses,
        status: team.status,
        x: 70 + (team.wins * 80) - (team.losses * 30),
        y: 20 + (index * 25)
      }));
    }

    return demoLayout.filter(team => team.teamName !== '');
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

  return (
    <div className="relative w-full h-80 bg-gradient-to-br from-blue-900/30 to-blue-800/20 rounded-lg border border-blue-500/30 overflow-hidden">
      {/* Header */}
      <div className="absolute top-3 left-4 right-4 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-yellow-400">SWISS STAGE</h3>
          <p className="text-xs text-gray-300">Top 8 echipe avansează</p>
        </div>
        <div className="text-right text-xs">
          <p className="text-green-400 font-semibold">3 WINS: ADVANCE</p>
          <p className="text-red-400 font-semibold">3 LOSSES: ELIMINATED</p>
        </div>
      </div>

      {/* Swiss bracket visualization */}
      <div className="absolute inset-4 top-16">
        {/* Starting column (0-0) */}
        <div className="absolute left-0 top-4">
          <div className="text-xs text-blue-400 font-semibold mb-2 text-center">0-0</div>
          {teamPositions.slice(0, 8).map((team, index) => (
            <motion.div
              key={`start-${index}`}
              className="w-16 h-6 bg-blue-600/80 border border-blue-400 rounded text-xs text-white flex items-center justify-center mb-1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <span className="truncate text-[10px]">{team.teamName}</span>
            </motion.div>
          ))}
        </div>

        {/* 1-0 Column */}
        <div className="absolute left-24 top-4">
          <div className="text-xs text-green-400 font-semibold mb-2 text-center">1-0</div>
          {teamPositions.filter(t => t.wins === 1 && t.losses === 0).map((team, index) => (
            <motion.div
              key={`1-0-${index}`}
              className="w-16 h-6 bg-green-600/80 border border-green-400 rounded text-xs text-white flex items-center justify-center mb-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              <span className="truncate text-[10px]">{team.teamName}</span>
            </motion.div>
          ))}
        </div>

        {/* 2-0 Column */}
        <div className="absolute left-48 top-4">
          <div className="text-xs text-green-400 font-semibold mb-2 text-center">2-0</div>
          {teamPositions.filter(t => t.wins === 2 && t.losses === 0).map((team, index) => (
            <motion.div
              key={`2-0-${index}`}
              className="w-16 h-6 bg-green-500/80 border border-green-300 rounded text-xs text-white flex items-center justify-center mb-1"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.0 + index * 0.1 }}
            >
              <span className="truncate text-[10px]">{team.teamName}</span>
            </motion.div>
          ))}
        </div>

        {/* 3-0 Column (Qualified) */}
        <div className="absolute right-4 top-4">
          <div className="text-xs text-yellow-400 font-semibold mb-2 text-center">3-0</div>
          <div className="bg-green-900/50 border-2 border-green-400 rounded-lg p-2">
            <div className="flex items-center justify-center mb-2">
              <Crown className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-xs text-green-400 font-bold">QUALIFIED</span>
            </div>
            <div className="text-xs text-gray-300 text-center">
              {standings.filter(t => t.status === 'qualified' || t.wins >= 3).length}/8
            </div>
            {teamPositions.filter(t => t.wins >= 3 || t.status === 'qualified').map((team, index) => (
              <div key={`qualified-${index}`} className="w-16 h-5 bg-yellow-500/80 border border-yellow-300 rounded text-[10px] text-black flex items-center justify-center mb-1">
                <span className="truncate font-medium">{team.teamName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* 1-1 Middle area */}
        <div className="absolute left-32 top-20">
          <div className="text-xs text-gray-400 font-semibold mb-2 text-center">1-1</div>
          {teamPositions.filter(t => t.wins === 1 && t.losses === 1).map((team, index) => (
            <div key={`1-1-${index}`} className="w-16 h-6 bg-gray-600/80 border border-gray-400 rounded text-xs text-white flex items-center justify-center mb-1">
              <span className="truncate text-[10px]">{team.teamName}</span>
            </div>
          ))}
        </div>

        {/* 0-1 Column */}
        <div className="absolute left-16 top-32">
          <div className="text-xs text-orange-400 font-semibold mb-2 text-center">0-1</div>
          {teamPositions.filter(t => t.wins === 0 && t.losses === 1).map((team, index) => (
            <div key={`0-1-${index}`} className="w-16 h-6 bg-orange-600/80 border border-orange-400 rounded text-xs text-white flex items-center justify-center mb-1">
              <span className="truncate text-[10px]">{team.teamName}</span>
            </div>
          ))}
        </div>

        {/* 0-2 Column */}
        <div className="absolute left-8 top-44">
          <div className="text-xs text-red-400 font-semibold mb-2 text-center">0-2</div>
          {teamPositions.filter(t => t.wins === 0 && t.losses === 2).map((team, index) => (
            <div key={`0-2-${index}`} className="w-16 h-6 bg-red-600/80 border border-red-400 rounded text-xs text-white flex items-center justify-center mb-1">
              <span className="truncate text-[10px]">{team.teamName}</span>
            </div>
          ))}
        </div>

        {/* Eliminated area (0-3) */}
        <div className="absolute left-0 bottom-0">
          <div className="bg-red-900/50 border-2 border-red-400 rounded-lg p-2">
            <div className="flex items-center justify-center mb-2">
              <X className="w-4 h-4 text-red-400 mr-1" />
              <span className="text-xs text-red-400 font-bold">ELIMINATED</span>
            </div>
            <div className="text-xs text-gray-300 text-center mb-1">
              {standings.filter(t => t.status === 'eliminated' || t.losses >= 3).length}
            </div>
            {teamPositions.filter(t => t.losses >= 3 || t.status === 'eliminated').map((team, index) => (
              <div key={`eliminated-${index}`} className="w-16 h-5 bg-red-600/80 border border-red-400 rounded text-[10px] text-white flex items-center justify-center mb-1">
                <span className="truncate">{team.teamName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Demo connection lines */}
        <svg width="100%" height="100%" className="absolute inset-0 pointer-events-none">
          {/* Yellow connecting lines for advancement */}
          <motion.path
            d="M80 40 L120 50"
            stroke="#eab308"
            strokeWidth="2"
            strokeOpacity="0.7"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          />
          <motion.path
            d="M140 50 L180 60"
            stroke="#eab308"
            strokeWidth="2"
            strokeOpacity="0.7"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 2 }}
          />
          {/* Red connecting lines for elimination */}
          <motion.path
            d="M80 80 L120 100"
            stroke="#dc2626"
            strokeWidth="2"
            strokeOpacity="0.7"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, delay: 2.5 }}
          />
        </svg>
      </div>

      {/* Round indicators */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center space-x-4">
        {[1, 2, 3, 4, 5].map(round => (
          <div
            key={round}
            className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs font-bold
                       ${round <= 2 ? 'border-green-400 bg-green-400/20 text-green-400' :
                         round === 3 ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400' :
                         'border-gray-600 bg-gray-600/20 text-gray-400'}`}
          >
            {round}
          </div>
        ))}
      </div>
    </div>
  );
}