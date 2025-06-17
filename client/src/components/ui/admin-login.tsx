import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Lock, Mail } from 'lucide-react';

interface AdminLoginProps {
  onLogin: () => void;
}

const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple validation
    if (!username || !password) {
      setError('Te rugăm să completezi toate câmpurile');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    // Verificare simplă - în producție, utilizează un sistem de autentificare securizat
    // Aceasta este doar o soluție temporară pentru demo
    setTimeout(() => {
      if (username === 'admin' && password === 'Admin322') {
        // În realitate, ar trebui să setăm un token JWT sau altă formă de autentificare securizată
        localStorage.setItem('isAdmin', 'true');
        toast({
          title: 'Autentificare reușită',
          description: 'Bine ai venit în panoul de administrare!',
        });
        onLogin();
      } else {
        setError('Credențiale invalide');
        toast({
          title: 'Eroare de autentificare',
          description: 'Numele de utilizator sau parola sunt incorecte',
          variant: 'destructive',
        });
      }
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-darkBg flex items-center justify-center">
      <div className="w-full max-w-md p-8 bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-rajdhani font-bold text-white">Administrator MPL</h1>
          <div className="w-16 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-2"></div>
          <p className="mt-4 text-gray-400">Autentifică-te pentru a accesa panoul de administrare</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-white mb-2">Nume utilizator</label>
            <div className="relative">
              <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-darkBg border border-primary/30 rounded-md p-3 pl-10 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors text-white"
                placeholder="Numele de utilizator"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-white mb-2">Parolă</label>
            <div className="relative">
              <div className="absolute left-0 inset-y-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-darkBg border border-primary/30 rounded-md p-3 pl-10 focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors text-white"
                placeholder="Parola"
              />
            </div>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm bg-red-500/10 border border-red-500/20 p-3 rounded">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white py-3 px-4 rounded-md font-medium transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
          >
            {isLoading ? 'Autentificare...' : 'Autentificare'}
          </button>
          
          {/* Am eliminat credențialele vizibile din interfață */}
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;