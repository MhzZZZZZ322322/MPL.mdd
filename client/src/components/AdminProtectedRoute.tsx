import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock } from "lucide-react";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Verificăm dacă utilizatorul este deja autentificat
    const authStatus = sessionStorage.getItem('adminAuthenticated');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificăm parola (aceeași logică ca în componentele admin existente)
    if (password === 'Admin322') {
      setIsAuthenticated(true);
      sessionStorage.setItem('adminAuthenticated', 'true');
      setError("");
    } else {
      setError("Parolă incorectă");
      setPassword("");
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-darkBg to-black flex items-center justify-center">
        <Card className="w-full max-w-md bg-slate-800/50 border-slate-700">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-white text-xl">Acces Admin - Gestionare Turneu</CardTitle>
            <p className="text-gray-400 text-sm">
              Introduceți parola pentru a accesa panoul de administrare al turneului
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Parolă administrator"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="bg-slate-700 border-slate-600 text-white placeholder-gray-400"
                  autoFocus
                />
                {error && (
                  <p className="text-red-400 text-sm flex items-center">
                    <Lock className="w-4 h-4 mr-1" />
                    {error}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-primary hover:bg-primary/90"
                disabled={!password.trim()}
              >
                Autentificare
              </Button>
            </form>
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-500">
                Doar administratorii autorizați pot accesa această secțiune
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}