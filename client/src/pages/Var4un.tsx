import { useState, useEffect } from 'react';

const Var4un = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // Load likes from localStorage on component mount
  useEffect(() => {
    const savedLikes = localStorage.getItem('var4un-likes');
    const userHasLiked = localStorage.getItem('var4un-user-liked');
    
    if (savedLikes) {
      setLikes(parseInt(savedLikes));
    }
    
    if (userHasLiked === 'true') {
      setHasLiked(true);
    }
  }, []);

  const handleLike = () => {
    if (!hasLiked) {
      const newLikes = likes + 1;
      setLikes(newLikes);
      setHasLiked(true);
      
      // Save to localStorage
      localStorage.setItem('var4un-likes', newLikes.toString());
      localStorage.setItem('var4un-user-liked', 'true');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-green-800 to-green-700 p-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="pt-20 pb-12">
          <h1 className="text-8xl font-bold text-yellow-400 mb-12 font-rajdhani tracking-wider animate-pulse drop-shadow-2xl relative z-10 text-shadow-lg">
            🎖️ VAR4UN 🎖️
          </h1>
        </div>
        
        <div className="bg-black/30 rounded-3xl p-8 mb-8 border-4 border-yellow-400/50 shadow-2xl">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              {!imageLoaded && (
                <div className="w-full h-96 bg-green-800/50 rounded-2xl flex items-center justify-center">
                  <div className="text-yellow-400 text-2xl font-bold animate-pulse">Loading...</div>
                </div>
              )}
              <img 
                src="/var4un-short-timer.png" 
                alt="Var4un - SHORT-TIMER" 
                className={`w-full h-auto rounded-2xl shadow-2xl border-4 border-yellow-400/30 ${!imageLoaded ? 'hidden' : ''}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageLoaded(true)}
              />
            </div>
          </div>
        </div>

        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-bold text-yellow-300 mb-4">SHORT-TIMER</h2>
          <p className="text-2xl text-green-200 mb-6">🪖 Soldatul de elită al MPL 🪖</p>
          
          <div className="bg-green-800/50 rounded-2xl p-6 border-2 border-yellow-400/30">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">Misiunea completă!</h3>
            <p className="text-green-100 text-lg mb-4">
              Ai găsit pagina secretă a celui mai curajos soldat din Moldova Pro League.
              <br />
              Var4un - SHORT-TIMER este gata pentru orice provocare!
            </p>
            
            {/* Like Counter - Gest Onoare */}
            <div className="flex items-center justify-center gap-4 mt-6 p-4 bg-yellow-600/20 rounded-xl border border-yellow-400/40">
              <div className="text-center">
                <div className="text-yellow-300 font-semibold text-lg mb-1">Gest - Onoare</div>
                <div className="flex items-center justify-center gap-3 mb-2">
                  <div className="text-6xl">😔</div>
                  <div className="text-4xl font-bold text-yellow-400">{likes}</div>
                </div>
                <button
                  onClick={handleLike}
                  disabled={hasLiked}
                  className={`px-6 py-2 rounded-full font-bold text-lg transition-all duration-300 transform ${
                    hasLiked 
                      ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                      : 'bg-yellow-600 hover:bg-yellow-500 text-black hover:scale-105 shadow-lg'
                  }`}
                >
                  {hasLiked ? '😔 Onoare dată' : '😔 Onorează'}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8">
            <div className="bg-yellow-600/20 rounded-xl p-4 border border-yellow-400/30">
              <div className="text-3xl mb-2">🎯</div>
              <p className="text-yellow-300 font-semibold">Precizie</p>
              <p className="text-green-200 text-sm">100%</p>
            </div>
            <div className="bg-yellow-600/20 rounded-xl p-4 border border-yellow-400/30">
              <div className="text-3xl mb-2">💪</div>
              <p className="text-yellow-300 font-semibold">Forță</p>
              <p className="text-green-200 text-sm">MAXIM</p>
            </div>
            <div className="bg-yellow-600/20 rounded-xl p-4 border border-yellow-400/30">
              <div className="text-3xl mb-2">🏆</div>
              <p className="text-yellow-300 font-semibold">Onoare</p>
              <p className="text-green-200 text-sm">LEGENDĂ</p>
            </div>
          </div>

          <button 
            onClick={() => window.history.back()}
            className="mt-8 bg-yellow-600 hover:bg-yellow-500 text-black px-8 py-3 rounded-full font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            ← Înapoi la bază
          </button>
        </div>
      </div>
    </div>
  );
};

export default Var4un;