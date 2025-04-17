import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Save, Image, Edit, Type, Trash, AlertTriangle } from 'lucide-react';
import AdminLogin from '@/components/ui/admin-login';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { useQuery, useMutation } from '@tanstack/react-query';

// Tipul pentru conținutul din baza de date
interface SiteContent {
  id: number;
  contentKey: string;
  title: string;
  content: string;
  contentType: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// Tipul adaptat pentru interfața de editare
type ContentSection = {
  id: number;
  name: string;
  contentKey: string;
  type: string;
  content: string;
  description?: string;
  originalData: SiteContent;
};

const ContentEditor = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentSection | null>(null);
  const { toast } = useToast();
  
  // React Query pentru a obține conținutul
  const { data: siteContents, isLoading, error } = useQuery({
    queryKey: ['/api/content'],
    queryFn: async () => {
      const response = await fetch('/api/content');
      if (!response.ok) {
        throw new Error('Eroare la încărcarea conținutului');
      }
      return response.json() as Promise<SiteContent[]>;
    },
    enabled: isAuthenticated,
  });
  
  // Transformare date din API pentru interfața UI
  const contentSections = siteContents?.map((item) => ({
    id: item.id,
    name: item.title,
    contentKey: item.contentKey,
    type: item.contentType,
    content: item.contentType === 'image' ? item.imageUrl : item.content,
    description: `ID: ${item.contentKey}`,
    originalData: item
  })) || [];
  
  // Mutație pentru a actualiza conținutul
  const updateContentMutation = useMutation({
    mutationFn: async (data: { id: number, content: Partial<SiteContent> }) => {
      const response = await fetch(`/api/content/${data.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.content)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Eroare la actualizarea conținutului');
      }
      
      return response.json();
    },
    onSuccess: () => {
      // Invalidăm cache-ul pentru a reîncărca datele
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      
      toast({
        title: 'Succes!',
        description: 'Conținutul a fost actualizat cu succes!',
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
  
  const handleEdit = (content: ContentSection) => {
    setEditingContent({...content});
  };
  
  const handleCancelEdit = () => {
    setEditingContent(null);
  };
  
  const handleSaveEdit = () => {
    if (!editingContent) return;
    
    // Pregătim datele pentru API
    const updateData: Partial<SiteContent> = {};
    
    if (editingContent.type === 'image') {
      updateData.imageUrl = editingContent.content;
    } else {
      updateData.content = editingContent.content;
    }
    
    // Trimitem actualizarea la API
    updateContentMutation.mutate({
      id: editingContent.id,
      content: updateData
    });
    
    setEditingContent(null);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingContent) return;
    
    setEditingContent({
      ...editingContent,
      content: e.target.value
    });
  };
  
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'hero':
        return <Type className="w-5 h-5 text-primary" />;
      case 'text':
        return <Type className="w-5 h-5 text-secondary" />;
      case 'image':
        return <Image className="w-5 h-5 text-purple-500" />;
      case 'section-title':
        return <Type className="w-5 h-5 text-amber-500" />;
      default:
        return <Type className="w-5 h-5 text-gray-500" />;
    }
  };
  
  if (isLoading) {
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
        <h1 className="text-2xl font-bold text-white">Eroare la încărcarea conținutului</h1>
        <p className="text-gray-400">{error instanceof Error ? error.message : 'A apărut o eroare necunoscută'}</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/content'] })}
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
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-rajdhani font-bold text-white mb-2">Editor de conținut</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary"></div>
            <p className="mt-2 text-gray-400">Modifică textele și imaginile de pe site</p>
          </div>
          
          <div className="flex gap-4">
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
        </div>
        
        {/* Editor de conținut */}
        <div className="grid grid-cols-1 gap-6">
          {/* Dialog de editare */}
          {editingContent && (
            <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
              <div className="bg-darkGray/95 border border-primary/40 rounded-lg p-6 max-w-2xl w-full mx-4">
                <h3 className="text-xl font-bold text-white mb-4">Editare: {editingContent.name}</h3>
                <p className="text-gray-400 mb-4">{editingContent.description}</p>
                
                {editingContent.type === 'image' ? (
                  <div className="space-y-4">
                    <label className="block text-white">URL Imagine</label>
                    <input
                      type="text"
                      value={editingContent.content}
                      onChange={handleInputChange}
                      className="w-full bg-darkBg border border-primary/30 rounded-md p-3 text-white focus:outline-none focus:border-secondary"
                    />
                    <div className="mt-4">
                      <p className="text-white mb-2">Previzualizare:</p>
                      <div className="border border-dashed border-gray-600 rounded-md p-4 flex justify-center">
                        <img 
                          src={editingContent.content} 
                          alt="Preview" 
                          className="max-h-40 object-contain"
                          onError={(e) => {
                            e.currentTarget.src = '/assets/placeholder.png';
                            e.currentTarget.onerror = null;
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <label className="block text-white">Conținut</label>
                    {editingContent.type === 'text' || editingContent.type === 'section-title' ? (
                      <textarea
                        value={editingContent.content}
                        onChange={handleInputChange}
                        rows={4}
                        className="w-full bg-darkBg border border-primary/30 rounded-md p-3 text-white focus:outline-none focus:border-secondary"
                      />
                    ) : (
                      <input
                        type="text"
                        value={editingContent.content}
                        onChange={handleInputChange}
                        className="w-full bg-darkBg border border-primary/30 rounded-md p-3 text-white focus:outline-none focus:border-secondary"
                      />
                    )}
                    <div className="mt-4">
                      <p className="text-white mb-2">Previzualizare:</p>
                      <div className="border border-dashed border-gray-600 rounded-md p-4">
                        {editingContent.type === 'hero' ? (
                          <h1 className="text-3xl font-bold text-white">{editingContent.content}</h1>
                        ) : editingContent.type === 'section-title' ? (
                          <h2 className="text-2xl font-bold text-white">{editingContent.content}</h2>
                        ) : (
                          <p className="text-gray-200">{editingContent.content}</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    onClick={handleCancelEdit}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-md transition-colors"
                  >
                    Anulează
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-primary hover:bg-primary/80 text-white rounded-md transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Salvează
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {/* Lista de conținut */}
          {contentSections.map((content: ContentSection) => (
            <div 
              key={content.id} 
              className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6 hover:border-primary/40 transition-all"
            >
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-darkBg/80 border border-gray-700">
                    {getContentIcon(content.type)}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{content.name}</h3>
                    <p className="text-gray-400 text-sm">{content.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={() => handleEdit(content)}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                  >
                    <Edit className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="mt-4 pl-12">
                {content.type === 'image' ? (
                  <div className="border border-dashed border-gray-700 rounded-md p-4 flex justify-center">
                    <img 
                      src={content.content} 
                      alt={content.name} 
                      className="max-h-32 object-contain"
                      onError={(e) => {
                        e.currentTarget.src = '/assets/placeholder.png';
                        e.currentTarget.onerror = null;
                      }}
                    />
                  </div>
                ) : (
                  <div className="border border-dashed border-gray-700 rounded-md p-4">
                    <p className="text-gray-300 break-words">{content.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentEditor;