import { useQuery } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import PlayerRanking from '@/components/ui/player-ranking';
import type { Player } from '@shared/schema';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const AllRankings = () => {
  const { data: csgoPlayers, isLoading: loadingCSGO } = useQuery<Player[]>({
    queryKey: ['/api/players', { game: 'CS:GO' }],
  });

  const { data: lolPlayers, isLoading: loadingLOL } = useQuery<Player[]>({
    queryKey: ['/api/players', { game: 'LoL' }],
  });
  
  const { data: valorantPlayers, isLoading: loadingValorant } = useQuery<Player[]>({
    queryKey: ['/api/players', { game: 'VALORANT' }],
  });

  return (
    <>
      <Helmet>
        <title>Clasamente Jucători | Moldova Pro League</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      
      <Navbar />
      
      <main className="pt-32 pb-16 min-h-screen bg-black">
        <div className="container mx-auto px-4">
          <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold font-rajdhani text-white mb-2">
                Clasamente <span className="text-secondary">Jucători</span>
              </h1>
              <p className="text-gray-400 max-w-2xl">
                Urmărește performanțele celor mai buni jucători din Moldova în competițiile MPL. Clasamentele sunt actualizate după fiecare turneu.
              </p>
            </div>
            <Link href="/">
              <Button 
                variant="outline" 
                className="mt-4 md:mt-0 flex items-center gap-2 border-primary text-primary hover:bg-primary/10"
              >
                <ArrowLeft size={16} />
                Înapoi la pagina principală
              </Button>
            </Link>
          </div>
          
          <div className="bg-darkGray/30 p-6 rounded-lg border border-primary/20 mb-8">
            <Tabs defaultValue="csgo" className="w-full">
              <TabsList className="w-full flex mb-6 bg-black/50 p-1 border border-primary/20 rounded-lg">
                <TabsTrigger value="csgo" className="flex-1 py-3 data-[state=active]:bg-primary/20 text-base rounded-md">
                  <img src="https://img.icons8.com/color/48/000000/counter-strike.png" alt="CS:GO" className="w-6 h-6 mr-2 inline-block" />
                  CS:GO
                </TabsTrigger>
                <TabsTrigger value="lol" className="flex-1 py-3 data-[state=active]:bg-primary/20 text-base rounded-md">
                  <img src="https://img.icons8.com/color/48/000000/league-of-legends.png" alt="League of Legends" className="w-6 h-6 mr-2 inline-block" />
                  LoL
                </TabsTrigger>
                <TabsTrigger value="valorant" className="flex-1 py-3 data-[state=active]:bg-primary/20 text-base rounded-md">
                  <img src="https://img.icons8.com/color/48/000000/valorant.png" alt="VALORANT" className="w-6 h-6 mr-2 inline-block" />
                  VALORANT
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="csgo" className="mt-0">
                <div className="bg-darkGray/50 border border-primary/20 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/30">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingCSGO ? (
                          [...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-primary/10">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Skeleton className="h-6 w-6" />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Skeleton className="h-8 w-8 rounded-full" />
                                  <div className="ml-3">
                                    <Skeleton className="h-4 w-20 mb-1" />
                                    <Skeleton className="h-3 w-16" />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Skeleton className="h-6 w-16" />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Skeleton className="h-4 w-12" />
                              </td>
                            </tr>
                          ))
                        ) : (
                          csgoPlayers?.map((player, index) => (
                            <PlayerRanking
                              key={player.id}
                              rank={index + 1}
                              player={player}
                            />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="lol" className="mt-0">
                <div className="bg-darkGray/50 border border-primary/20 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/30">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingLOL ? (
                          [...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-primary/10">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Skeleton className="h-6 w-6" />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Skeleton className="h-8 w-8 rounded-full" />
                                  <div className="ml-3">
                                    <Skeleton className="h-4 w-20 mb-1" />
                                    <Skeleton className="h-3 w-16" />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Skeleton className="h-6 w-16" />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Skeleton className="h-4 w-12" />
                              </td>
                            </tr>
                          ))
                        ) : (
                          lolPlayers?.map((player, index) => (
                            <PlayerRanking
                              key={player.id}
                              rank={index + 1}
                              player={player}
                            />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="valorant" className="mt-0">
                <div className="bg-darkGray/50 border border-primary/20 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-primary/30">
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Rank</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Player</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Team</th>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Score</th>
                        </tr>
                      </thead>
                      <tbody>
                        {loadingValorant ? (
                          [...Array(5)].map((_, i) => (
                            <tr key={i} className="border-b border-primary/10">
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Skeleton className="h-6 w-6" />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="flex items-center">
                                  <Skeleton className="h-8 w-8 rounded-full" />
                                  <div className="ml-3">
                                    <Skeleton className="h-4 w-20 mb-1" />
                                    <Skeleton className="h-3 w-16" />
                                  </div>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Skeleton className="h-6 w-16" />
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <Skeleton className="h-4 w-12" />
                              </td>
                            </tr>
                          ))
                        ) : (
                          valorantPlayers?.map((player, index) => (
                            <PlayerRanking
                              key={player.id}
                              rank={index + 1}
                              player={player}
                            />
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
          
          <div className="bg-primary/10 border border-primary/30 p-6 rounded-lg">
            <h3 className="text-xl font-bold text-white mb-4">Informații despre clasament</h3>
            <ul className="list-disc pl-5 space-y-2 text-gray-300">
              <li>Clasamentele sunt actualizate după fiecare turneu oficial MPL</li>
              <li>Punctele sunt acordate în funcție de performanța individuală și rezultatele echipei</li>
              <li>Jucătorii trebuie să participe la cel puțin 2 turnee pentru a apărea în clasament</li>
              <li>La finalul sezonului, top 10 jucători din fiecare joc primesc invitații la turneul final MPL</li>
            </ul>
          </div>
        </div>
      </main>
      
      <Footer />
    </>
  );
};

export default AllRankings;