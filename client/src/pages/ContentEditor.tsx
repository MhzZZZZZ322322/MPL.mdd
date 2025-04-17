import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { LoaderCircle, Save, Image, Edit, Type, Trash } from 'lucide-react';
import AdminLogin from '@/components/ui/admin-login';

// Definim tipurile pentru conținut
type ContentSection = {
  id: string;
  name: string;
  type: 'hero' | 'text' | 'image' | 'section-title'; 
  content: string;
  description?: string;
};

const ContentEditor = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contents, setContents] = useState<ContentSection[]>([]);
  const [editingContent, setEditingContent] = useState<ContentSection | null>(null);
  const { toast } = useToast();
  
  // Date inițiale pentru demo
  const initialContent: ContentSection[] = [
    {
      id: 'hero-title',
      name: 'Titlu Hero',
      type: 'hero',
      content: 'Moldova Pro League',
      description: 'Titlul principal din secțiunea hero'
    },
    {
      id: 'hero-subtitle',
      name: 'Subtitlu Hero',
      type: 'text',
      content: 'Cea mai mare comunitate de esports din Moldova',
      description: 'Subtitlul din secțiunea hero'
    },
    {
      id: 'about-title',
      name: 'Titlu Despre Noi',
      type: 'section-title',
      content: 'Despre MPL',
      description: 'Titlul secțiunii despre noi'
    },
    {
      id: 'about-content',
      name: 'Conținut Despre Noi',
      type: 'text',
      content: 'Moldova Pro League este o comunitate dedicată jucătorilor profesioniști și amatori de jocuri video din Republica Moldova. Fondată din pasiune pentru cybersport, MPL organizează turnee, evenimente și construiește o comunitate unită de gameri.',
      description: 'Textul principal din secțiunea despre noi'
    },
    {
      id: 'logo-image',
      name: 'Logo MPL',
      type: 'image',
      content: '/assets/MPL logo black-white.png',
      description: 'Logo-ul principal al organizației'
    }
  ];
  
  useEffect(() => {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAuthenticated(isAdmin);
    
    if (isAdmin) {
      // În producție, aici ar trebui să facem un fetch pentru a obține conținutul din baza de date
      // Pentru demo, folosim datele inițiale
      setContents(initialContent);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, []);
  
  const handleLogin = () => {
    setIsAuthenticated(true);
    setContents(initialContent);
  };
  
  const handleSaveContent = () => {
    // În producție, aici ar trebui să facem un POST pentru a salva datele în baza de date
    // Pentru demo, doar afișăm un mesaj de succes
    console.log('Conținutul care ar fi salvat:', contents);
    
    toast({
      title: 'Succes!',
      description: 'Conținutul a fost salvat cu succes!',
    });
  };
  
  const handleEdit = (content: ContentSection) => {
    setEditingContent({...content});
  };
  
  const handleCancelEdit = () => {
    setEditingContent(null);
  };
  
  const handleSaveEdit = () => {
    if (!editingContent) return;
    
    setContents(prevContents => 
      prevContents.map(item => 
        item.id === editingContent.id ? editingContent : item
      )
    );
    
    setEditingContent(null);
    
    toast({
      title: 'Modificare salvată',
      description: 'Conținutul a fost actualizat cu succes!',
    });
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
  
  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <AdminLogin onLogin={handleLogin} />;
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
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition-colors flex items-center gap-2" 
              onClick={handleSaveContent}
            >
              <Save className="w-4 h-4" />
              Salvează tot
            </button>
            
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
          {contents.map((content) => (
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