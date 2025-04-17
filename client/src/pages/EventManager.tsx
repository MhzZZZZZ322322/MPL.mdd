import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Event, InsertEvent, insertEventSchema } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { queryClient } from '@/lib/queryClient';
import AdminLogin from '@/components/ui/admin-login';
import { 
  LoaderCircle, 
  Plus, 
  Calendar, 
  MapPin, 
  Edit, 
  Trash2, 
  AlertTriangle,
  Clock,
  ArrowLeft,
  Save,
  X,
  Image
} from 'lucide-react';
import { formatISO } from 'date-fns';

// Schema extins pentru validare
const eventFormSchema = insertEventSchema.extend({
  date: z.string().min(1, { message: 'Data este obligatorie' }),
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const EventManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const { toast } = useToast();

  // Form
  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: '',
      description: '',
      date: '',
      location: '',
      imageUrl: '',
      registrationLink: ''
    }
  });

  // Obținere evenimente
  const { 
    data: events = [], 
    isLoading, 
    error
  } = useQuery<Event[]>({
    queryKey: ['/api/events'],
    enabled: isAuthenticated,
  });

  // Mutație pentru adăugare eveniment
  const addEventMutation = useMutation({
    mutationFn: async (data: InsertEvent) => {
      const response = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la adăugarea evenimentului');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: 'Succes!',
        description: 'Evenimentul a fost adăugat cu succes!',
      });
      setIsAdding(false);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Eroare!',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Mutație pentru actualizare eveniment
  const updateEventMutation = useMutation({
    mutationFn: async (data: { id: number, event: Partial<Event> }) => {
      const response = await fetch(`/api/events/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.event)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la actualizarea evenimentului');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: 'Succes!',
        description: 'Evenimentul a fost actualizat cu succes!',
      });
      setIsEditing(false);
      setCurrentEvent(null);
      form.reset();
    },
    onError: (error: Error) => {
      toast({
        title: 'Eroare!',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  // Mutație pentru ștergere eveniment
  const deleteEventMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la ștergerea evenimentului');
      }
      
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      toast({
        title: 'Succes!',
        description: 'Evenimentul a fost șters cu succes!',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Eroare!',
        description: error.message,
        variant: 'destructive',
      });
    }
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAuthenticated(isAdmin);
  }, []);

  const handleLogin = () => {
    localStorage.setItem('isAdmin', 'true');
    setIsAuthenticated(true);
  };

  const handleAddEvent = () => {
    setIsAdding(true);
    setIsEditing(false);
    setCurrentEvent(null);
    form.reset();
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setIsEditing(true);
    setIsAdding(false);
    
    // Formatarea datei pentru input de tip date
    const eventDate = event.date ? new Date(event.date) : new Date();
    const formattedDate = formatISO(eventDate).split('T')[0];
    
    form.reset({
      title: event.title,
      description: event.description,
      date: formattedDate,
      location: event.location,
      imageUrl: event.imageUrl || '',
      registrationLink: event.registrationLink || ''
    });
  };

  const handleDeleteEvent = (id: number) => {
    if (window.confirm('Ești sigur că vrei să ștergi acest eveniment?')) {
      deleteEventMutation.mutate(id);
    }
  };

  const onSubmit = (data: EventFormValues) => {
    if (isEditing && currentEvent) {
      updateEventMutation.mutate({ 
        id: currentEvent.id, 
        event: data 
      });
    } else {
      addEventMutation.mutate(data);
    }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setIsEditing(false);
    setCurrentEvent(null);
    form.reset();
  };

  if (isLoading && isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center flex-col gap-4">
        <AlertTriangle className="w-12 h-12 text-red-500" />
        <h1 className="text-2xl font-bold text-white">Eroare la încărcarea evenimentelor</h1>
        <p className="text-gray-400">{error instanceof Error ? error.message : 'A apărut o eroare necunoscută'}</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/events'] })}
          className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors mt-4"
        >
          Încearcă din nou
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex items-center">
          <a 
            href="/admin" 
            className="mr-4 p-2 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </a>
          <div>
            <h1 className="text-3xl font-rajdhani font-bold text-white mb-2">Gestionare Evenimente</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary"></div>
          </div>
        </div>

        {/* Formular adăugare/editare */}
        {(isAdding || isEditing) && (
          <div className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-rajdhani font-bold text-white">
                {isAdding ? 'Adaugă eveniment nou' : 'Editează evenimentul'}
              </h2>
              <button 
                onClick={handleCancel}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">Titlu</label>
                    <input
                      {...form.register('title')}
                      className="w-full bg-darkBg border border-primary/30 rounded-md p-3 text-white focus:outline-none focus:border-secondary"
                    />
                    {form.formState.errors.title && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.title.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Data</label>
                    <input
                      type="date"
                      {...form.register('date')}
                      className="w-full bg-darkBg border border-primary/30 rounded-md p-3 text-white focus:outline-none focus:border-secondary"
                    />
                    {form.formState.errors.date && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.date.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Locație</label>
                    <input
                      {...form.register('location')}
                      className="w-full bg-darkBg border border-primary/30 rounded-md p-3 text-white focus:outline-none focus:border-secondary"
                    />
                    {form.formState.errors.location && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.location.message}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">URL Imagine (opțional)</label>
                    <input
                      {...form.register('imageUrl')}
                      className="w-full bg-darkBg border border-primary/30 rounded-md p-3 text-white focus:outline-none focus:border-secondary"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-white mb-2">Link Înregistrare (opțional)</label>
                    <input
                      {...form.register('registrationLink')}
                      className="w-full bg-darkBg border border-primary/30 rounded-md p-3 text-white focus:outline-none focus:border-secondary"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-white mb-2">Descriere</label>
                    <textarea
                      {...form.register('description')}
                      rows={12}
                      className="w-full bg-darkBg border border-primary/30 rounded-md p-3 text-white focus:outline-none focus:border-secondary"
                    />
                    {form.formState.errors.description && (
                      <p className="text-red-500 text-sm mt-1">{form.formState.errors.description.message}</p>
                    )}
                  </div>
                  
                  {form.watch('imageUrl') && (
                    <div>
                      <p className="text-white mb-2">Previzualizare imagine:</p>
                      <div className="border border-dashed border-gray-600 rounded-md p-4 flex justify-center">
                        <img 
                          src={form.watch('imageUrl')} 
                          alt="Preview" 
                          className="max-h-40 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/placeholder.png';
                            e.currentTarget.onerror = null;
                          }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end gap-4 mt-8">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                >
                  Anulează
                </button>
                <button
                  type="submit"
                  disabled={addEventMutation.isPending || updateEventMutation.isPending}
                  className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors flex items-center gap-2"
                >
                  {(addEventMutation.isPending || updateEventMutation.isPending) ? (
                    <LoaderCircle className="w-4 h-4 animate-spin" />
                  ) : (
                    <Save className="w-4 h-4" />
                  )}
                  {isAdding ? 'Adaugă eveniment' : 'Salvează modificări'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista evenimente */}
        <div className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-rajdhani font-bold text-white">Evenimente</h2>
            <button 
              onClick={handleAddEvent}
              className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Adaugă eveniment
            </button>
          </div>
          
          {events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Nu există evenimente</p>
              <button 
                onClick={handleAddEvent}
                className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-md transition-colors"
              >
                Adaugă primul eveniment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div 
                  key={event.id} 
                  className="bg-darkBg/60 border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-all"
                >
                  <div className="flex justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-white text-xl mb-2">{event.title}</h3>
                      <div className="flex flex-wrap gap-3 mb-3">
                        <span className="flex items-center text-sm text-gray-300">
                          <Calendar className="w-4 h-4 mr-1 text-primary" />
                          {new Date(event.date).toLocaleDateString('ro-RO')}
                        </span>
                        {event.location && (
                          <span className="flex items-center text-sm text-gray-300">
                            <MapPin className="w-4 h-4 mr-1 text-secondary" />
                            {event.location}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-300 line-clamp-2">{event.description}</p>
                    </div>
                    
                    {event.imageUrl && (
                      <div className="ml-4 hidden sm:block">
                        <img 
                          src={event.imageUrl} 
                          alt={event.title} 
                          className="w-20 h-20 object-cover rounded-md"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventManager;