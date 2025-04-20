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
  onLike: (id: number) => void;
}

const ServerCard: React.FC<ServerCardProps> = ({ server, onLike }) => {
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
    <Card className="w-full h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">{server.name}</CardTitle>
          <Badge variant={server.status ? "default" : "destructive"} className={server.status ? "bg-green-600 hover:bg-green-700" : ""}>
            {server.status ? 'Online' : 'Offline'}
          </Badge>
        </div>
        <CardDescription>
          <div className="flex items-center gap-2">
            <span className="font-mono bg-black/10 dark:bg-white/10 p-1 rounded text-xs">
              connect {server.ip}:{server.port}
            </span>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 p-0"
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
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Wifi className="h-4 w-4" />
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
          </div>
          
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{server.status ? `${server.players}/${server.maxPlayers}` : "0/0"}</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Jucători activi</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          
          <div className="flex items-center gap-2">
            <Server className="h-4 w-4" />
            <span>{server.mode}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col items-start gap-2">
        <Button 
          variant="ghost" 
          className="flex items-center gap-1"
          onClick={() => onLike(server.id)}
        >
          <ThumbsUp className="h-4 w-4 text-primary" />
          <span>{server.likes} mulțumiri</span>
        </Button>
      </CardFooter>
    </Card>
  );
};

export const CsServerStatus: React.FC = () => {
  const queryClient = useQueryClient();
  // State pentru a urmări like-urile date de utilizator
  const [likedServers, setLikedServers] = useState<Record<number, boolean>>({});
  
  // Încarcă like-urile din localStorage la inițializare
  useEffect(() => {
    const savedLikes = localStorage.getItem('likedCsServers');
    if (savedLikes) {
      setLikedServers(JSON.parse(savedLikes));
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
    onSuccess: (_, id) => {
      // Actualizează starea locală și salvează în localStorage
      const updatedLikes = { ...likedServers, [id]: true };
      setLikedServers(updatedLikes);
      localStorage.setItem('likedCsServers', JSON.stringify(updatedLikes));
      
      queryClient.invalidateQueries({ queryKey: ['/api/cs-servers'] });
      toast({
        title: 'Mulțumim pentru apreciere!',
        description: 'Like-ul tău a fost înregistrat cu succes.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Eroare',
        description: 'Nu am putut înregistra aprecierea ta. Te rugăm să încerci din nou.',
        variant: 'destructive',
      });
    },
  });
  
  const handleLike = (id: number) => {
    // Verifică dacă utilizatorul a dat deja like la acest server
    if (likedServers[id]) {
      toast({
        title: 'Deja ai apreciat',
        description: 'Poți aprecia un server doar o singură dată. Mulțumim!',
      });
      return;
    }
    
    likeMutation.mutate(id);
  };
  
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 justify-items-center">
          {servers && Array.isArray(servers) ? servers.map((server: CsServer) => (
            <div key={server.id} className="w-full" style={{ maxWidth: "320px", minHeight: "320px" }}>
              <ServerCard 
                server={server} 
                onLike={handleLike} 
              />
            </div>
          )) : (
            <p className="col-span-3 text-center">Nu există servere disponibile</p>
          )}
        </div>
        <div className="text-center mt-8 text-sm text-muted-foreground">
          <p>Mulțumiri lui <a href="https://www.tiktok.com/@faceofmadness" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@faceofmadness</a> pentru servere</p>
        </div>
      </div>
    </section>
  );
};

export default CsServerStatus;