import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const Var4un = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [hasLiked, setHasLiked] = useState(false);
  const queryClient = useQueryClient();

  // Load user like status from localStorage
  useEffect(() => {
    const userHasLiked = localStorage.getItem('var4un-user-liked');
    if (userHasLiked === 'true') {
      setHasLiked(true);
    }
  }, []);

  // Fetch counter from database
  const { data: counter, isLoading } = useQuery({
    queryKey: ['/api/var4un-counter'],
    staleTime: 1000 * 30, // 30 seconds
  });

  // Increment counter mutation
  const incrementMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch('/api/var4un-counter/increment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error('Failed to increment counter');
      return response.json();
    },
    onSuccess: () => {
      // Update local state and localStorage
      setHasLiked(true);
      localStorage.setItem('var4un-user-liked', 'true');
      // Invalidate and refetch the counter
      queryClient.invalidateQueries({ queryKey: ['/api/var4un-counter'] });
    },
  });

  const handleLike = () => {
    if (!hasLiked && !incrementMutation.isPending) {
      incrementMutation.mutate();
    }
  };

  const likes = counter?.totalLikes || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-3 sm:p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="pt-8 sm:pt-20 pb-6 sm:pb-12">
          <h1 className="text-4xl sm:text-6xl lg:text-8xl font-bold text-yellow-400 mb-6 sm:mb-12 font-rajdhani tracking-wider animate-pulse drop-shadow-2xl relative z-10 text-shadow-lg">
            🎖️ VAR4UN 🎖️
          </h1>
        </div>
        
        <div className="bg-black/30 rounded-2xl sm:rounded-3xl p-4 sm:p-8 mb-4 sm:mb-8 border-2 sm:border-4 border-yellow-400/50 shadow-2xl">
          <div className="max-w-sm sm:max-w-2xl mx-auto">
            <div className="relative">
              {!imageLoaded && (
                <div className="w-full h-48 sm:h-96 bg-green-800/50 rounded-xl sm:rounded-2xl flex items-center justify-center">
                  <div className="text-yellow-400 text-lg sm:text-2xl font-bold animate-pulse">Loading...</div>
                </div>
              )}
              <img 
                src="/var4un-short-timer.png" 
                alt="Var4un - SHORT-TIMER" 
                className={`w-full h-auto rounded-xl sm:rounded-2xl shadow-2xl border-2 sm:border-4 border-yellow-400/30 ${!imageLoaded ? 'hidden' : ''}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6 text-center">
          <h2 className="text-2xl sm:text-4xl font-bold text-yellow-300 mb-2 sm:mb-4">SHORT-TIMER</h2>
          <p className="text-lg sm:text-2xl text-green-200 mb-3 sm:mb-6 px-2">Soldatul de elită din comunitatea MPL</p>
          
          <div className="bg-green-800/50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border-2 border-yellow-400/30 mx-2 sm:mx-0">
            <h3 className="text-lg sm:text-xl font-bold text-yellow-400 mb-2 sm:mb-3">Misiunea completă!</h3>
            <p className="text-green-100 text-sm sm:text-lg mb-3 sm:mb-4 leading-relaxed">
              Ai găsit pagina secretă a celui mai curajos soldat din Moldova Pro League.
              <br />
              Var4un - SHORT-TIMER este gata pentru orice provocare!
            </p>
            
            {/* Like Counter - Gest Onoare */}
            <div className="flex items-center justify-center gap-2 sm:gap-4 mt-4 sm:mt-6 p-4 sm:p-6 bg-yellow-600/20 rounded-lg sm:rounded-xl border border-yellow-400/40">
              <div className="text-center w-full max-w-xs">
                <div className="text-yellow-300 font-semibold text-base sm:text-lg mb-2 sm:mb-3">Gest - Onoare</div>
                <div className="flex flex-col items-center justify-center mb-3 sm:mb-4 space-y-1 sm:space-y-2">
                  <img src="/salute-emoji.png" alt="Salut militar" className="w-12 h-12 sm:w-16 sm:h-16 flex-shrink-0" />
                  <div className="text-2xl sm:text-4xl font-bold text-yellow-400 break-all text-center leading-tight">{likes.toLocaleString()}</div>
                </div>
                <button
                  onClick={handleLike}
                  disabled={hasLiked || incrementMutation.isPending}
                  className={`px-4 sm:px-6 py-2 rounded-full font-bold text-sm sm:text-lg transition-all duration-300 transform ${
                    hasLiked || incrementMutation.isPending
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-yellow-600 hover:bg-yellow-500 text-black hover:scale-105 shadow-lg'
                  }`}
                >
                  {incrementMutation.isPending ? '⏳ Se salvează...' : hasLiked ? '✋ Onoare dată' : '✋ Onorează'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-8 mx-2 sm:mx-0">
            <div className="bg-yellow-600/20 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-yellow-400/30">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎯</div>
              <p className="text-yellow-300 font-semibold text-xs sm:text-base">Precizie</p>
              <p className="text-green-200 text-xs sm:text-sm">100%</p>
            </div>
            <div className="bg-yellow-600/20 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-yellow-400/30">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">💪</div>
              <p className="text-yellow-300 font-semibold text-xs sm:text-base">Forță</p>
              <p className="text-green-200 text-xs sm:text-sm">MAXIM</p>
            </div>
            <div className="bg-yellow-600/20 rounded-lg sm:rounded-xl p-2 sm:p-4 border border-yellow-400/30">
              <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🏆</div>
              <p className="text-yellow-300 font-semibold text-xs sm:text-base">Onoare</p>
              <p className="text-green-200 text-xs sm:text-sm">LEGENDĂ</p>
            </div>
          </div>

          <button 
            onClick={() => window.history.back()}
            className="mt-6 sm:mt-8 bg-yellow-600 hover:bg-yellow-500 text-black px-6 sm:px-8 py-2 sm:py-3 rounded-full font-bold text-base sm:text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ← Înapoi la bază
          </button>
        </div>
      </div>
    </div>
  );
};

export default Var4un;