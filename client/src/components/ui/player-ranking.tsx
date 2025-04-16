import { User } from 'lucide-react';
import type { Player } from '@shared/schema';

interface PlayerRankingProps {
  rank: number;
  player: Player;
}

const getTeamStyle = (team: string) => {
  const teamColors: Record<string, string> = {
    'Valhalla': 'bg-accent/20 text-accent',
    'Nexus': 'bg-blue-500/20 text-blue-500',
    'Phoenix': 'bg-cyan-500/20 text-cyan-500',
    'Dragons': 'bg-accent/20 text-accent',
    'Titans': 'bg-blue-500/20 text-blue-500'
  };
  
  return teamColors[team] || 'bg-primary/20 text-primary';
};

const PlayerRanking = ({ rank, player }: PlayerRankingProps) => {
  const teamStyle = getTeamStyle(player.team);
  
  return (
    <tr className="border-b border-primary/10 hover:bg-primary/10">
      <td className="px-4 py-3 whitespace-nowrap">
        <span className="font-rajdhani font-bold text-lg text-secondary">#{rank}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-secondary">
            <User className="h-4 w-4" />
          </div>
          <div className="ml-3">
            <div className="text-sm font-medium text-white">{player.nickname}</div>
            <div className="text-xs text-gray-400">{player.realName}</div>
          </div>
        </div>
      </td>
      <td className="px-4 py-3 whitespace-nowrap">
        <span className={`px-2 py-1 text-xs rounded ${teamStyle}`}>{player.team}</span>
      </td>
      <td className="px-4 py-3 whitespace-nowrap text-white">{player.score}</td>
    </tr>
  );
};

export default PlayerRanking;
