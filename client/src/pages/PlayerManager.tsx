import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertPlayerSchema, Player } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, getQueryFn, queryClient } from '@/lib/queryClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import AdminLogin from '@/components/ui/admin-login';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

// Extend player schema for validating form submission
const playerFormSchema = insertPlayerSchema.extend({
  profileImage: z.string().min(1, { message: 'URL-ul imaginii este obligatoriu' }),
  game: z.string().min(1, { message: 'Jocul este obligatoriu' }),
});

type PlayerFormValues = z.infer<typeof playerFormSchema>;

const PlayerManager = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isEditingPlayerId, setIsEditingPlayerId] = useState<number | null>(null);
  const [open, setOpen] = useState(false);
  const [deletePlayerId, setDeletePlayerId] = useState<number | null>(null);
  const { toast } = useToast();

  // Query to fetch all players
  const { data: players, isLoading, isError } = useQuery({
    queryKey: ['/api/players'],
    queryFn: getQueryFn({ on401: 'throw' }),
    enabled: isLoggedIn,
  });

  // Form for adding/editing players
  const form = useForm<PlayerFormValues>({
    resolver: zodResolver(playerFormSchema),
    defaultValues: {
      nickname: '',
      realName: '',
      game: '',
      team: '',
      country: 'Moldova',
      profileImage: '',
      socialLinks: '',
      achievements: '',
      stats: '',
    },
  });

  // Mutation for creating a new player
  const createPlayerMutation = useMutation({
    mutationFn: async (data: PlayerFormValues) => {
      const res = await apiRequest('POST', '/api/players', data);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Eroare la crearea jucătorului');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Jucător adăugat',
        description: 'Jucătorul a fost adăugat cu succes.',
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Eroare',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for updating a player
  const updatePlayerMutation = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: PlayerFormValues }) => {
      const res = await apiRequest('PATCH', `/api/players/${id}`, data);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Eroare la actualizarea jucătorului');
      }
      return await res.json();
    },
    onSuccess: () => {
      toast({
        title: 'Jucător actualizat',
        description: 'Jucătorul a fost actualizat cu succes.',
      });
      form.reset();
      setIsEditingPlayerId(null);
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Eroare',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Mutation for deleting a player
  const deletePlayerMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest('DELETE', `/api/players/${id}`);
      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText || 'Eroare la ștergerea jucătorului');
      }
    },
    onSuccess: () => {
      toast({
        title: 'Jucător șters',
        description: 'Jucătorul a fost șters cu succes.',
      });
      setDeletePlayerId(null);
      setOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/players'] });
    },
    onError: (error: Error) => {
      toast({
        title: 'Eroare',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  // Handle form submission
  const onSubmit = (data: PlayerFormValues) => {
    if (isEditingPlayerId !== null) {
      updatePlayerMutation.mutate({ id: isEditingPlayerId, data });
    } else {
      createPlayerMutation.mutate(data);
    }
  };

  // Handle edit player
  const handleEditPlayer = (player: Player) => {
    setIsEditingPlayerId(player.id);
    
    form.reset({
      nickname: player.nickname,
      realName: player.realName,
      game: player.game,
      team: player.team || '',
      country: player.country || 'Moldova',
      profileImage: player.profileImage,
      socialLinks: player.socialLinks || '',
      achievements: player.achievements || '',
      stats: player.stats || '',
    });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setIsEditingPlayerId(null);
    form.reset();
  };

  // Handle delete player confirmation
  const handleDeleteConfirm = (id: number) => {
    setDeletePlayerId(id);
    setOpen(true);
  };

  // Display login form if not logged in
  if (!isLoggedIn) {
    return (
      <div className="container mx-auto py-8 px-4">
        <AdminLogin onLogin={() => setIsLoggedIn(true)} />
      </div>
    );
  }

  // Loading and error states
  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="border-destructive shadow-md">
          <CardHeader>
            <CardTitle className="text-destructive">Eroare</CardTitle>
          </CardHeader>
          <CardContent>
            <p>A apărut o eroare la încărcarea datelor. Te rugăm să încerci din nou.</p>
          </CardContent>
          <CardFooter>
            <Button 
              onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/players'] })}
              variant="outline"
            >
              Încearcă din nou
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Managementul Jucătorilor</h1>
      
      <div className="grid md:grid-cols-[1fr_2fr] gap-8">
        {/* Add/Edit Player Form */}
        <div>
          <Card className="border border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle>
                {isEditingPlayerId ? 'Editează Jucător' : 'Adaugă Jucător Nou'}
              </CardTitle>
              <CardDescription>
                {isEditingPlayerId 
                  ? 'Editează informațiile jucătorului existent.' 
                  : 'Completează formularul pentru a adăuga un jucător nou.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="nickname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nickname</FormLabel>
                        <FormControl>
                          <Input placeholder="AlexGG" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="realName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nume Real</FormLabel>
                        <FormControl>
                          <Input placeholder="Alexandru G." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="game"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Joc</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selectează jocul" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="CS:GO">CS:GO</SelectItem>
                            <SelectItem value="CS2">CS2</SelectItem>
                            <SelectItem value="Dota 2">Dota 2</SelectItem>
                            <SelectItem value="League of Legends">League of Legends</SelectItem>
                            <SelectItem value="Valorant">Valorant</SelectItem>
                            <SelectItem value="FIFA">FIFA</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="team"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Echipă</FormLabel>
                        <FormControl>
                          <Input placeholder="XTeam" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Țară</FormLabel>
                        <FormControl>
                          <Input placeholder="Moldova" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="profileImage"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL Imagine Profil</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/image.jpg" {...field} />
                        </FormControl>
                        <FormDescription>
                          URL-ul imaginii de profil a jucătorului
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="socialLinks"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Linkuri Social Media</FormLabel>
                        <FormControl>
                          <Input placeholder="https://twitter.com/player, https://instagram.com/player" {...field} />
                        </FormControl>
                        <FormDescription>
                          Link-uri către profilurile sociale, separate prin virgulă
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="achievements"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Realizări</FormLabel>
                        <FormControl>
                          <Input placeholder="Locul 1 Turneu MPL 2023" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="stats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Statistici</FormLabel>
                        <FormControl>
                          <Input placeholder="KD: 1.5, HS%: 65%" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-2 justify-end pt-4">
                    {isEditingPlayerId && (
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={handleCancelEdit}
                      >
                        Anulează
                      </Button>
                    )}
                    <Button 
                      type="submit" 
                      disabled={createPlayerMutation.isPending || updatePlayerMutation.isPending}
                    >
                      {isEditingPlayerId ? 'Actualizează' : 'Adaugă Jucător'}
                      {(createPlayerMutation.isPending || updatePlayerMutation.isPending) && (
                        <div className="ml-2 animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                      )}
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Player List */}
        <div>
          <Card className="border border-primary/20 shadow-md">
            <CardHeader>
              <CardTitle>Lista Jucătorilor</CardTitle>
              <CardDescription>
                Jucătorii înregistrați în sistem. Poți edita sau șterge jucătorii existenți.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {players?.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>Nu există jucători în sistem. Adaugă primul jucător folosind formularul.</p>
                </div>
              ) : (
                <Table>
                  <TableCaption>Lista jucătorilor înregistrați</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nickname</TableHead>
                      <TableHead>Nume Real</TableHead>
                      <TableHead>Joc</TableHead>
                      <TableHead>Echipă</TableHead>
                      <TableHead className="text-right">Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {players?.map((player) => (
                      <TableRow key={player.id}>
                        <TableCell className="font-medium">{player.nickname}</TableCell>
                        <TableCell>{player.realName}</TableCell>
                        <TableCell>{player.game}</TableCell>
                        <TableCell>{player.team || '-'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditPlayer(player)}
                            >
                              Editează
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleDeleteConfirm(player.id)}
                            >
                              Șterge
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmare ștergere</DialogTitle>
            <DialogDescription>
              Ești sigur că vrei să ștergi acest jucător? Această acțiune nu poate fi anulată.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Anulează
            </Button>
            <Button 
              variant="destructive" 
              onClick={() => deletePlayerId && deletePlayerMutation.mutate(deletePlayerId)}
              disabled={deletePlayerMutation.isPending}
            >
              {deletePlayerMutation.isPending ? 'Se șterge...' : 'Șterge'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerManager;