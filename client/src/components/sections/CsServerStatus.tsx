import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ThumbsUp, Server, Users, Wifi, Copy, Check } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { CsServer } from '@shared/schema-cs-servers';
import { apiRequest } from '@/lib/queryClient';

/**
 * Calculate ping based on response time
 * In a real application, we would use proper ping calculation
 * This is a simplified version for demonstration purposes
 */
const calculatePing = () => {
  // Simulating ping between 5-100ms
  return Math.floor(Math.random() * 95) + 5;
};

interface ServerCardProps {
  server: CsServer;
}

const ServerCard: React.FC<ServerCardProps> = ({ server }) => {
  const [ping, setPing] = useState<number>(0);
  
  useEffect(() => {
    // Calculate initial ping
    setPing(calculatePing());
    
    // Update ping every 30 seconds
    const interval = setInterval(() => {
      setPing(calculatePing());
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const getPingColor = () => {
    if (ping < 30) return 'text-green-500';
    if (ping < 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <Card className="w-full h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg font-bold truncate mr-2">{server.name}</CardTitle>
            <Badge variant={server.status ? "default" : "destructive"} className={server.status ? "bg-green-600 hover:bg-green-700 shrink-0" : "shrink-0"}>
              {server.status ? 'Online' : 'Offline'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="h-4 w-4 shrink-0" />
              <span className="font-medium">{server.mode}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 shrink-0" />
              <span>{server.status ? `${server.players}/${server.maxPlayers}` : "0/0"}</span>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="flex-grow pt-0">
        <div className="flex flex-col space-y-4">
          <div className="flex items-center justify-between">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4 shrink-0" />
                    <span className={server.status ? getPingColor() : "text-muted-foreground"}>
                      {server.status ? `${ping} ms` : "N/A"}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ping-ul tău la server</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <span className="text-sm text-muted-foreground">{server.location}</span>
          </div>
          
          <div className="flex items-center gap-2 mt-2">
            <span className="font-mono bg-black/10 dark:bg-white/10 p-1 rounded text-xs flex-grow truncate">
              connect {server.ip}:{server.port}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 p-0 shrink-0"
                    onClick={() => {
                      navigator.clipboard.writeText(`connect ${server.ip}:${server.port}`);
                      toast({
                        description: "Conectarea a fost copiată în clipboard",
                        duration: 2000,
                      });
                    }}
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copiază comanda de conectare</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        {/* Spațiu fără butoane de like sau număr de mulțumiri */}
      </CardFooter>
    </Card>
  );
};

export const CsServerStatus: React.FC = () => {
  const queryClient = useQueryClient();
  // State pentru a urmări dacă utilizatorul a mulțumit
  const [hasLiked, setHasLiked] = useState<boolean>(false);
  
  // Încarcă starea mulțumirii din localStorage la inițializare
  useEffect(() => {
    const savedLikeState = localStorage.getItem('hasLikedCsServers');
    if (savedLikeState) {
      setHasLiked(JSON.parse(savedLikeState));
    }
  }, []);
  
  const { isLoading, error, data: servers } = useQuery({
    queryKey: ['/api/cs-servers'],
    refetchInterval: 60000, // Refetch every minute
  });
  
  const likeMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('POST', `/api/cs-servers/${id}/like`);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cs-servers'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Eroare',
        description: 'Nu am putut înregistra aprecierea ta. Te rugăm să încerci din nou.',
        variant: 'destructive',
      });
    },
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex justify-center items-center py-12">
        <p className="text-destructive">Eroare la încărcarea serverelor. Te rugăm să reîmprospătezi pagina.</p>
      </div>
    );
  }
  
  return (
    <section className="py-10">
      <div className="container max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Serverele Noastre CS2</h2>
        <div className="flex flex-wrap justify-center gap-6">
          {servers && Array.isArray(servers) ? servers.map((server: CsServer) => (
            <div key={server.id} className="w-full md:w-[300px]">
              <ServerCard 
                server={server}
              />
            </div>
          )) : (
            <p className="w-full text-center">Nu există servere disponibile</p>
          )}
        </div>
        <div className="flex flex-col justify-center items-center mt-8 gap-3">
          {!hasLiked ? (
            <Button 
              variant="default" 
              className="flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
              onClick={() => {
                // Adaugă doar un singur like la primul server activ
                if (servers && Array.isArray(servers) && servers.length > 0) {
                  // Găsește primul server online sau primul server dacă niciunul nu e online
                  const targetServer = servers.find(s => s.status) || servers[0];
                  
                  // Adaugă un singur like doar la acest server
                  likeMutation.mutate(targetServer.id);
                  
                  setHasLiked(true);
                  localStorage.setItem('hasLikedCsServers', JSON.stringify(true));
                  
                  toast({
                    title: 'Mulțumim pentru apreciere!',
                    description: 'Ai adăugat 1 mulțumire.',
                  });
                }
              }}
            >
              <ThumbsUp className="h-5 w-5" />
              <span className="ml-1 font-medium">MULȚUMEȘTE O DATĂ</span>
            </Button>
          ) : (
            <div className="flex items-center gap-2 text-muted-foreground">
              <ThumbsUp className="h-5 w-5 text-primary" />
              <span>
                {servers && Array.isArray(servers) ? 
                  servers.reduce((total, server) => total + server.likes, 0) || "0"
                  : "0"
                } mulțumiri
              </span>
            </div>
          )}
          <p className="text-sm text-muted-foreground">Mulțumește lui <a href="https://www.tiktok.com/@faceofmadness" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@faceofmadness</a> pentru toate serverele – cu un Follow, Like și Share. E Gratis!</p>
        </div>
      </div>
    </section>
  );
};

export default CsServerStatus;