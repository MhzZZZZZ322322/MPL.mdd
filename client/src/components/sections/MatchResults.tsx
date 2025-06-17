import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Trophy, Target } from 'lucide-react';
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

  const { data: matchResults, isLoading, error } = useQuery<MatchResult[]>({
    queryKey: ['/api/match-results'],
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2 text-lg">{t('loading_results')}</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">{t('error_loading_results')}</p>
      </div>
    );
  }

  if (!matchResults || matchResults.length === 0) {
    return (
      <div className="text-center py-12">
        <Target className="h-12 w-12 mx-auto text-gray-400 mb-4" />
        <p className="text-gray-500 text-lg">{t('no_matches_played')}</p>
        <p className="text-gray-400 text-sm mt-2">{t('matches_will_appear_here')}</p>
      </div>
    );
  }

  // Group results by group name
  const groupedResults: GroupedResults = matchResults.reduce((acc, match) => {
    if (!acc[match.groupName]) {
      acc[match.groupName] = [];
    }
    acc[match.groupName].push(match);
    return acc;
  }, {} as GroupedResults);

  const getWinnerName = (match: MatchResult): string => {
    if (match.team1Score > match.team2Score) {
      return match.team1Name;
    } else if (match.team2Score > match.team1Score) {
      return match.team2Name;
    }
    return '';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ro' ? 'ro-RO' : language === 'ru' ? 'ru-RU' : 'en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className="py-16 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {t('match_results')}
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('match_results_description')}
          </p>
        </div>

        <div className="grid gap-8">
          {Object.entries(groupedResults)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([groupName, matches]) => (
              <Card key={groupName} className="overflow-hidden shadow-lg">
                <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <CardTitle className="flex items-center gap-2 text-xl">
                    <Trophy className="h-6 w-6" />
                    {t('group')} {groupName}
                    <Badge variant="secondary" className="ml-auto bg-white/20 text-white">
                      {matches.length} {t('matches')}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid gap-4">
                    {matches
                      .sort((a, b) => new Date(b.match_date).getTime() - new Date(a.match_date).getTime())
                      .map((match) => {
                        const winner = getWinnerName(match);
                        return (
                          <div
                            key={match.id}
                            className="flex flex-col md:flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
                          >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <div className="text-center">
                                <p className={`font-semibold text-lg ${
                                  winner === match.team1_name 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {match.team1_name}
                                </p>
                                {winner === match.team1_name && (
                                  <Trophy className="h-4 w-4 text-green-600 mx-auto mt-1" />
                                )}
                              </div>
                              
                              <div className="text-center px-4">
                                <div className="flex items-center gap-2 text-2xl font-bold">
                                  <span className={`${
                                    match.team1_score > match.team2_score 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {match.team1_score}
                                  </span>
                                  <span className="text-gray-400">-</span>
                                  <span className={`${
                                    match.team2_score > match.team1_score 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-gray-600 dark:text-gray-400'
                                  }`}>
                                    {match.team2_score}
                                  </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">CS2 BO1</p>
                              </div>
                              
                              <div className="text-center">
                                <p className={`font-semibold text-lg ${
                                  winner === match.team2_name 
                                    ? 'text-green-600 dark:text-green-400' 
                                    : 'text-gray-700 dark:text-gray-300'
                                }`}>
                                  {match.team2_name}
                                </p>
                                {winner === match.team2_name && (
                                  <Trophy className="h-4 w-4 text-green-600 mx-auto mt-1" />
                                )}
                              </div>
                            </div>
                            
                            <div className="text-right mt-4 md:mt-0">
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {formatDate(match.match_date)}
                              </p>
                              {winner && (
                                <Badge variant="outline" className="mt-1 text-green-600 border-green-600">
                                  {t('winner')}: {winner}
                                </Badge>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      </div>
    </section>
  );
}