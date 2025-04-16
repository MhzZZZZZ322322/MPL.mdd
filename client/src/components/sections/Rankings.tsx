import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import PlayerRanking from '@/components/ui/player-ranking';
import { ArrowRight } from 'lucide-react';
import type { Player } from '@shared/schema';

const Rankings = () => {
  const { data: csgoPlayers, isLoading: loadingCSGO } = useQuery<Player[]>({
    queryKey: ['/api/players', { game: 'CS:GO' }],
  });

  const { data: lolPlayers, isLoading: loadingLOL } = useQuery<Player[]>({
    queryKey: ['/api/players', { game: 'LoL' }],
  });

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <section id="rankings" className="py-16 md:py-24 relative">
      <motion.div 
        className="container mx-auto px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        <motion.div className="text-center mb-12" variants={itemVariants}>
          <h2 className="font-rajdhani font-bold text-3xl md:text-4xl text-white mb-4">
            Clasamente & <span className="text-secondary">Jucători</span>
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-secondary to-accent mx-auto"></div>
          <p className="mt-4 max-w-2xl mx-auto">Top jucători din turneele recente organizate de Moldova Pro League.</p>
        </motion.div>
        
        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-12"
          variants={itemVariants}
        >
          {/* CS:GO Leaderboard */}
          <div>
            <h3 className="font-orbitron font-medium text-xl mb-6 flex items-center text-white">
              <img src="https://img.icons8.com/color/48/000000/counter-strike.png" alt="CS:GO" className="w-8 h-8 mr-2" />
              CS:GO Top Players
            </h3>
            
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
                      [...Array(3)].map((_, i) => (
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
          </div>
          
          {/* LoL Leaderboard */}
          <div>
            <h3 className="font-orbitron font-medium text-xl mb-6 flex items-center text-white">
              <img src="https://img.icons8.com/color/48/000000/league-of-legends.png" alt="League of Legends" className="w-8 h-8 mr-2" />
              LoL Top Players
            </h3>
            
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
                      [...Array(3)].map((_, i) => (
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
          </div>
        </motion.div>
        
        <motion.div className="text-center" variants={itemVariants}>
          <Button 
            variant="outline"
            className="inline-block bg-transparent border-2 border-secondary hover:border-accent text-white px-6 py-3 rounded-md font-medium transition-all hover:shadow-[0_0_15px_rgba(236,72,153,0.6)]"
          >
            Vezi toate clasamentele <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Rankings;
