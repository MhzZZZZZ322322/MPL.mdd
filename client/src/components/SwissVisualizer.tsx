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

  // Generate positions for Swiss visualization
  const generateSwissLayout = () => {
    const teamsByRecord = getTeamsByRecord();
    const positions: TeamPosition[] = [];
    
    // Define column positions based on record
    const columns = [
      { record: '0-0', x: 50, label: '0-0', color: 'border-blue-400' },
      { record: '1-0', x: 150, label: '1-0', color: 'border-green-400' },
      { record: '2-0', x: 250, label: '2-0', color: 'border-green-400' },
      { record: '3-0', x: 350, label: '3-0', color: 'border-yellow-400' },
      { record: '2-1', x: 200, label: '2-1', color: 'border-blue-400' },
      { record: '1-1', x: 150, label: '1-1', color: 'border-gray-400' },
      { record: '0-1', x: 100, label: '0-1', color: 'border-orange-400' },
      { record: '1-2', x: 100, label: '1-2', color: 'border-red-400' },
      { record: '0-2', x: 50, label: '0-2', color: 'border-red-400' },
      { record: '0-3', x: 0, label: '0-3', color: 'border-red-600' },
    ];

    columns.forEach(col => {
      const teams = teamsByRecord[col.record] || [];
      teams.forEach((team, index) => {
        positions.push({
          teamName: team.teamName,
          wins: team.wins,
          losses: team.losses,
          status: team.status,
          x: col.x,
          y: index * 60 + 50
        });
      });
    });

    return positions;
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
    <div className="relative w-full h-96 bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg border border-primary/20 overflow-hidden">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-yellow-400">SWISS STAGE</h3>
          <p className="text-sm text-gray-300">Top 8 echipe avansează</p>
        </div>
        <div className="text-right">
          <p className="text-green-400 font-semibold">3 WINS: ADVANCE</p>
          <p className="text-red-400 font-semibold">3 LOSSES: ELIMINATED</p>
        </div>
      </div>

      {/* Swiss visualization */}
      <div className="absolute inset-6 top-20">
        <svg width="100%" height="100%" className="absolute inset-0">
          {/* Draw connection lines between rounds */}
          {matches
            .filter(match => match.isPlayed)
            .map((match, index) => {
              const team1Pos = teamPositions.find(p => p.teamName === match.team1Name);
              const team2Pos = teamPositions.find(p => p.teamName === match.team2Name);
              
              if (!team1Pos || !team2Pos) return null;

              return (
                <motion.line
                  key={`match-${match.id}`}
                  x1={team1Pos.x + 40}
                  y1={team1Pos.y + 15}
                  x2={team2Pos.x + 40}
                  y2={team2Pos.y + 15}
                  stroke={match.winnerName ? "#22c55e" : "#6b7280"}
                  strokeWidth="2"
                  strokeOpacity="0.6"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                />
              );
            })}
        </svg>

        {/* Team cards */}
        {teamPositions.map((team, index) => (
          <motion.div
            key={team.teamName}
            className={`absolute w-20 h-8 rounded border-2 ${getStatusColor(team.status, team.wins, team.losses)} 
                       flex items-center justify-center text-xs font-medium text-white shadow-lg`}
            style={{
              left: `${team.x}px`,
              top: `${team.y}px`,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            whileHover={{ scale: 1.05 }}
          >
            <div className="flex items-center space-x-1">
              {getStatusIcon(team.status)}
              <span className="truncate max-w-12" title={team.teamName}>
                {team.teamName.length > 6 ? team.teamName.substring(0, 6) : team.teamName}
              </span>
            </div>
            
            {/* Record badge */}
            <div className="absolute -bottom-2 -right-1 bg-darkBg text-xs px-1 rounded border border-primary/30">
              {team.wins}-{team.losses}
            </div>
          </motion.div>
        ))}

        {/* Round indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-8">
          {[1, 2, 3, 4, 5].map(round => {
            const roundMatches = matches.filter(m => m.roundNumber === round);
            const isActive = roundMatches.some(m => !m.isPlayed);
            const isComplete = roundMatches.length > 0 && roundMatches.every(m => m.isPlayed);
            
            return (
              <div
                key={round}
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold
                           ${isComplete ? 'border-green-400 bg-green-400/20 text-green-400' :
                             isActive ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400' :
                             'border-gray-600 bg-gray-600/20 text-gray-400'}`}
              >
                {round}
              </div>
            );
          })}
        </div>

        {/* Qualification zones */}
        <div className="absolute top-0 right-0 w-24 h-32 border-2 border-green-400/30 bg-green-400/5 rounded">
          <div className="text-center p-2">
            <Trophy className="w-6 h-6 mx-auto text-green-400 mb-1" />
            <span className="text-xs text-green-400 font-semibold">QUALIFIED</span>
            <div className="text-xs text-gray-300 mt-1">
              {standings.filter(t => t.status === 'qualified' || t.wins === 3).length}/8
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-24 h-32 border-2 border-red-400/30 bg-red-400/5 rounded">
          <div className="text-center p-2">
            <X className="w-6 h-6 mx-auto text-red-400 mb-1" />
            <span className="text-xs text-red-400 font-semibold">ELIMINATED</span>
            <div className="text-xs text-gray-300 mt-1">
              {standings.filter(t => t.status === 'eliminated' || t.losses === 3).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}