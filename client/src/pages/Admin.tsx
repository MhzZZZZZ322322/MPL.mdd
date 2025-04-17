import { useEffect, useState } from 'react';
import { Contact } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Mail, User, Type, Calendar, AlignLeft } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { ro } from 'date-fns/locale';
import AdminLogin from '@/components/ui/admin-login';

const Admin = () => {
  const [contactMessages, setContactMessages] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Verificăm dacă utilizatorul este autentificat
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAuthenticated(isAdmin);
    
    if (isAdmin) {
      getContactMessages();
    } else {
      setLoading(false);
    }
  }, []);
  
  const getContactMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contact');
      
      if (!response.ok) {
        throw new Error('Eroare la încărcarea mesajelor');
      }
      
      const data = await response.json();
      setContactMessages(data);
    } catch (error) {
      console.error('Error fetching contact messages:', error);
      setError('Nu s-au putut încărca mesajele. Te rugăm încearcă din nou.');
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca mesajele. Te rugăm încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 text-xl">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Încearcă din nou
          </button>
        </div>
      </div>
    );
  }

  // Dacă utilizatorul nu este autentificat, afișăm pagina de login
  if (!isAuthenticated) {
    return (
      <AdminLogin onLogin={() => {
        setIsAuthenticated(true);
        getContactMessages();
      }} />
    );
  }

  return (
    <div className="min-h-screen bg-darkBg">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-rajdhani font-bold text-white mb-2">Panou de administrare</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary"></div>
          </div>
          <button 
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors" 
            onClick={() => {
              localStorage.removeItem('isAdmin');
              setIsAuthenticated(false);
            }}
          >
            Deconectare
          </button>
        </div>
        
        <div className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-rajdhani font-bold text-white">Mesaje de contact</h2>
            <span className="px-3 py-1 bg-primary/20 text-primary rounded-md">
              {contactMessages.length} mesaje
            </span>
          </div>
          
          {contactMessages.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 text-gray-500 mx-auto mb-4" />
              <p className="text-gray-400">Nu există mesaje de contact</p>
            </div>
          ) : (
            <div className="space-y-4">
              {contactMessages.map((message) => (
                <div 
                  key={message.id} 
                  className="bg-darkBg/60 border border-primary/10 rounded-lg p-4 hover:border-primary/30 transition-all"
                >
                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className="px-2 py-1 text-xs bg-primary/10 text-primary rounded-full flex items-center">
                      <User className="w-3 h-3 mr-1" /> {message.name}
                    </span>
                    <span className="px-2 py-1 text-xs bg-secondary/10 text-secondary rounded-full flex items-center">
                      <Mail className="w-3 h-3 mr-1" /> {message.email}
                    </span>
                    <span className="px-2 py-1 text-xs bg-accent/10 text-accent rounded-full flex items-center">
                      <Type className="w-3 h-3 mr-1" /> {message.subject}
                    </span>
                    <span className="px-2 py-1 text-xs bg-gray-700/30 text-gray-300 rounded-full flex items-center">
                      <Calendar className="w-3 h-3 mr-1" /> 
                      {message.createdAt ? 
                        formatDistanceToNow(new Date(message.createdAt), { addSuffix: true, locale: ro }) :
                        'Data necunoscută'}
                    </span>
                  </div>
                  
                  <div className="flex items-start gap-2">
                    <AlignLeft className="w-4 h-4 text-gray-400 mt-1" />
                    <p className="text-gray-200 whitespace-pre-wrap">{message.message}</p>
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

export default Admin;