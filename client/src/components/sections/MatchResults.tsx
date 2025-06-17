import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, ChevronDown, ChevronUp, Calendar } from 'lucide-react';
import { useLanguage } from '@/lib/LanguageContext';

interface MatchResult {
  id: number;
  groupName: string;
  team1Name: string;
  team2Name: string;
  team1Score: number;
  team2Score: number;
  winnerId: number | null;
  matchDate: string;
}

interface GroupedResults {
  [groupName: string]: MatchResult[];
}

export default function MatchResults() {
  const { language, t } = useLanguage();
  const [expandedGroups, setExpandedGroups] = useState<{ [key: string]: boolean }>({});

  const { data: matchResults, isLoading, error } = useQuery<MatchResult[]>({
    queryKey: ['/api/match-results'],
    refetchInterval: 30000,
  });

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getWinner = (match: MatchResult): string => {
    if (match.team1Score > match.team2Score) return match.team1Name;
    if (match.team2Score > match.team1Score) return match.team2Name;
    return 'Egalitate';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">Se încarcă rezultatele...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Eroare la încărcarea rezultatelor</p>
      </div>
    );
  }

  if (!matchResults || matchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <Trophy className="h-16 w-16 mx-auto text-gray-400 mb-4" />
        <p className="text-xl text-gray-300 mb-2">Nu există rezultate încă</p>
        <p className="text-gray-400">Rezultatele meciurilor vor apărea aici după ce vor fi adăugate.</p>
      </div>
    );
  }

  // Group results by group name
  const groupedResults: GroupedResults = matchResults.reduce((groups, match) => {
    const groupName = match.groupName;
    if (!groups[groupName]) {
      groups[groupName] = [];
    }
    groups[groupName].push(match);
    return groups;
  }, {} as GroupedResults);

  // Sort groups alphabetically
  const sortedGroups = Object.keys(groupedResults).sort();

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">Rezultate Meciuri</h2>
        <p className="text-gray-300">
          Vezi toate rezultatele meciurilor jucate în cadrul turneului, organizate pe grupe
        </p>
      </div>

      <div className="grid gap-4">
        {sortedGroups.map(groupName => {
          const groupMatches = groupedResults[groupName];
          const isExpanded = expandedGroups[groupName];
          const matchCount = groupMatches.length;

          return (
            <Card key={groupName} className="bg-gradient-to-r from-primary/20 to-blue-600/20 border-primary/30 overflow-hidden">
              <CardContent className="p-0">
                {/* Group Header */}
                <div 
                  className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
                  onClick={() => toggleGroup(groupName)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary/30 rounded-full flex items-center justify-center">
                      <Trophy className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        Grupa {groupName}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {matchCount} {matchCount === 1 ? 'meci' : 'meciuri'} jucat{matchCount === 1 ? '' : 'e'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-primary border-primary/50">
                      {matchCount} rezultate
                    </Badge>
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-gray-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                </div>

                {/* Matches List */}
                {isExpanded && (
                  <div className="border-t border-white/10">
                    <div className="p-4 space-y-3">
                      {groupMatches
                        .sort((a, b) => new Date(b.matchDate).getTime() - new Date(a.matchDate).getTime())
                        .map((match) => {
                          const winner = getWinner(match);
                          return (
                            <div
                              key={match.id}
                              className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 hover:bg-slate-800/70 transition-colors"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4 flex-1">
                                  {/* Team 1 */}
                                  <div className="flex items-center space-x-2 min-w-0 flex-1">
                                    <span className={`font-medium truncate ${
                                      match.team1Score > match.team2Score ? 'text-green-400' : 'text-gray-300'
                                    }`}>
                                      {match.team1Name}
                                    </span>
                                  </div>

                                  {/* Score */}
                                  <div className="flex items-center space-x-2 px-4">
                                    <span className={`text-lg font-bold ${
                                      match.team1Score > match.team2Score ? 'text-green-400' : 'text-gray-300'
                                    }`}>
                                      {match.team1Score}
                                    </span>
                                    <span className="text-gray-500">-</span>
                                    <span className={`text-lg font-bold ${
                                      match.team2Score > match.team1Score ? 'text-green-400' : 'text-gray-300'
                                    }`}>
                                      {match.team2Score}
                                    </span>
                                  </div>

                                  {/* Team 2 */}
                                  <div className="flex items-center space-x-2 min-w-0 flex-1 justify-end">
                                    <span className={`font-medium truncate ${
                                      match.team2Score > match.team1Score ? 'text-green-400' : 'text-gray-300'
                                    }`}>
                                      {match.team2Name}
                                    </span>
                                  </div>
                                </div>

                                <div className="flex items-center space-x-3 ml-4">
                                  <div className="text-right">
                                    <div className="flex items-center text-gray-400 text-sm">
                                      <Calendar className="h-4 w-4 mr-1" />
                                      {formatDate(match.matchDate)}
                                    </div>
                                    {winner !== 'Egalitate' && (
                                      <Badge variant="outline" className="mt-1 text-green-400 border-green-400">
                                        Câștigător: {winner}
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}