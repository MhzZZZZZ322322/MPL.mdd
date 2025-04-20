import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart, Server, Users, Wifi } from 'lucide-react';
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
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-bold">{server.name}</CardTitle>
          <Badge variant={server.status ? "default" : "destructive"} className={server.status ? "bg-green-600 hover:bg-green-700" : ""}>
            {server.status ? 'Online' : 'Offline'}
          </Badge>
        </div>
        <CardDescription>
          <span className="font-mono bg-black/10 dark:bg-white/10 p-1 rounded text-xs">
            connect {server.ip}:{server.port}
          </span>
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
                    <span className={getPingColor()}>{ping} ms</span>
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
                    <span>{server.players}/{server.maxPlayers}</span>
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
          <Heart className="h-4 w-4 text-red-500" />
          <span>{server.likes} mulțumiri</span>
        </Button>
        <p className="text-xs text-muted-foreground italic">
          Merci mult lui <a href="https://www.tiktok.com/@faceofmadness" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">@faceofmadness</a> pentru servere
        </p>
      </CardFooter>
    </Card>
  );
};

export const CsServerStatus: React.FC = () => {
  const queryClient = useQueryClient();
  
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
      <div className="container">
        <h2 className="text-2xl font-bold mb-6">Serverele Noastre CS2</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servers && Array.isArray(servers) ? servers.map((server: CsServer) => (
            <ServerCard 
              key={server.id} 
              server={server} 
              onLike={handleLike} 
            />
          )) : (
            <p>Nu există servere disponibile</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default CsServerStatus;