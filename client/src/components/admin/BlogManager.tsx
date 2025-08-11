import { useState, useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Edit, Trash2, Plus, Eye, Calendar, FileText, Image, Upload, X, Bold, Italic, Underline, Link, Save, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageUrl?: string;
  featuredImageData?: string;
  tags: string;
  status: string;
  viewCount: number;
  publishedAt?: string;
  authorName: string;
  authorEmail?: string;
  metaTitle?: string;
  metaDescription?: string;
  createdAt: string;
  updatedAt: string;
}

interface ArticleFormData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImageData?: string;
  tags: string;
  status: string;
  publishedAt?: string;
  authorName: string;
  authorEmail: string;
  metaTitle: string;
  metaDescription: string;
}

export default function BlogManager() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [selectedArticle, setSelectedArticle] = useState<BlogArticle | null>(null);
  const [editingArticle, setEditingArticle] = useState<BlogArticle | null>(null);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [formData, setFormData] = useState<ArticleFormData>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    tags: "",
    status: "draft",
    authorName: "MPL Admin",
    authorEmail: "admin@moldovapro.md",
    metaTitle: "",
    metaDescription: ""
  });

  const contentTextareaRef = useRef<HTMLTextAreaElement>(null);

  // Fetch articles
  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['/api/blog/articles'],
    queryFn: async () => {
      const response = await fetch('/api/blog/articles');
      if (!response.ok) throw new Error("Failed to fetch articles");
      return response.json();
    }
  });

  // Create/Update article mutation
  const saveArticleMutation = useMutation({
    mutationFn: async (data: { article: ArticleFormData; isEditing: boolean; articleId?: number }) => {
      const url = data.isEditing 
        ? `/api/blog/articles/${data.articleId}` 
        : '/api/blog/articles';
      
      const method = data.isEditing ? 'PATCH' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data.article),
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/articles'] });
      setShowEditDialog(false);
      setEditingArticle(null);
      resetForm();
      
      toast({
        title: "Articol salvat",
        description: "Articolul a fost salvat cu succes.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Delete article mutation
  const deleteArticleMutation = useMutation({
    mutationFn: async (articleId: number) => {
      const response = await fetch(`/api/blog/articles/${articleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.text();
        throw new Error(error);
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/blog/articles'] });
      
      toast({
        title: "Articol șters",
        description: "Articolul a fost eliminat cu succes.",
        variant: "default",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Eroare",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const resetForm = () => {
    setFormData({
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      tags: "",
      status: "draft",
      authorName: "MPL Admin",
      authorEmail: "admin@moldovapro.md",
      metaTitle: "",
      metaDescription: ""
    });
  };

  const handleNewArticle = () => {
    resetForm();
    setEditingArticle(null);
    setShowEditDialog(true);
  };

  const handleEditArticle = (article: BlogArticle) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featuredImageData: article.featuredImageData,
      tags: article.tags || "",
      status: article.status,
      publishedAt: article.publishedAt || "",
      authorName: article.authorName,
      authorEmail: article.authorEmail || "",
      metaTitle: article.metaTitle || "",
      metaDescription: article.metaDescription || ""
    });
    setShowEditDialog(true);
  };

  const handleViewArticle = (article: BlogArticle) => {
    setSelectedArticle(article);
    setShowViewDialog(true);
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[ăâî]/g, 'a')
      .replace(/[ț]/g, 't')
      .replace(/[ș]/g, 's')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value)
    }));
  };

  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Eroare",
        description: "Vă rugăm să selectați un fișier imagine valid.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Eroare",
        description: "Imaginea este prea mare. Dimensiunea maximă este 5MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setFormData(prev => ({
        ...prev,
        featuredImageData: e.target?.result as string
      }));
    };
    reader.readAsDataURL(file);
  }, [toast]);

  const handleSave = () => {
    if (!formData.title.trim() || !formData.content.trim()) {
      toast({
        title: "Eroare",
        description: "Titlul și conținutul sunt obligatorii.",
        variant: "destructive",
      });
      return;
    }

    saveArticleMutation.mutate({
      article: formData,
      isEditing: !!editingArticle,
      articleId: editingArticle?.id
    });
  };

  const insertText = (before: string, after: string = "") => {
    const textarea = contentTextareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = formData.content.substring(start, end);
    
    const newText = formData.content.substring(0, start) + 
                   before + selectedText + after + 
                   formData.content.substring(end);
    
    setFormData(prev => ({ ...prev, content: newText }));
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, end + before.length);
    }, 0);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-600">Publicat</Badge>;
      case 'draft':
        return <Badge variant="secondary">Ciornă</Badge>;
      case 'archived':
        return <Badge variant="outline">Arhivat</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="mr-2" />
            Blog Manager
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <FileText className="mr-2" />
              Blog Manager ({articles.length} articole)
            </div>
            <Button onClick={handleNewArticle} className="flex items-center">
              <Plus className="mr-2 w-4 h-4" />
              Articol nou
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {articles.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">Nu există articole încă.</p>
              <Button onClick={handleNewArticle} className="mt-4">
                Creează primul articol
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {articles.map((article: BlogArticle) => (
                <div
                  key={article.id}
                  className="border rounded-lg p-4 bg-card/50 hover:bg-card/70 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-start space-x-4">
                        {article.featuredImageData && (
                          <img 
                            src={article.featuredImageData} 
                            alt={article.title} 
                            className="w-20 h-20 object-cover rounded"
                          />
                        )}
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg mb-2">{article.title}</h3>
                          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{article.excerpt}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <span className="flex items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {article.publishedAt ? formatDate(article.publishedAt) : 'Nepublicat'}
                            </span>
                            <span>Autor: {article.authorName}</span>
                            <span>{article.viewCount} vizualizări</span>
                            {getStatusBadge(article.status)}
                          </div>
                          {article.tags && (
                            <div className="mt-2">
                              <div className="flex flex-wrap gap-1">
                                {article.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                                  <Badge key={index} variant="outline" className="text-xs">
                                    {tag.trim()}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewArticle(article)}
                        className="text-blue-600 border-blue-600 hover:bg-blue-600 hover:text-white"
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Vezi
                      </Button>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditArticle(article)}
                        className="text-amber-600 border-amber-600 hover:bg-amber-600 hover:text-white"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editează
                      </Button>
                      
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Șterge
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Șterge articolul?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Ești sigur că vrei să ștergi articolul "{article.title}"? Această acțiune nu poate fi anulată.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Anulează</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => deleteArticleMutation.mutate(article.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Da, șterge articolul
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Article Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="mr-2" />
              {editingArticle ? `Editează: ${editingArticle.title}` : 'Articol nou'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Titlu *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Titlul articolului"
                />
              </div>
              <div>
                <Label htmlFor="slug">Slug URL</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="url-friendly-slug"
                />
              </div>
            </div>

            {/* Excerpt */}
            <div>
              <Label htmlFor="excerpt">Descriere scurtă *</Label>
              <Textarea
                id="excerpt"
                value={formData.excerpt}
                onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                placeholder="Scurtă descriere a articolului care va apărea în preview..."
                rows={3}
              />
            </div>

            {/* Featured Image */}
            <div>
              <Label>Imagine principală</Label>
              <div className="mt-2 space-y-3">
                {formData.featuredImageData && (
                  <div className="flex items-center space-x-3">
                    <img 
                      src={formData.featuredImageData} 
                      alt="Preview" 
                      className="w-32 h-24 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setFormData(prev => ({ ...prev, featuredImageData: undefined }))}
                    >
                      <X className="w-4 h-4 mr-1" />
                      Șterge imagine
                    </Button>
                  </div>
                )}
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                />
              </div>
            </div>

            {/* Content Editor */}
            <div>
              <Label htmlFor="content">Conținut articol *</Label>
              <div className="mt-2">
                {/* Toolbar */}
                <div className="flex items-center space-x-2 p-2 border rounded-t-md bg-gray-50">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText('<strong>', '</strong>')}
                    title="Bold"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText('<em>', '</em>')}
                    title="Italic"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText('<u>', '</u>')}
                    title="Underline"
                  >
                    <Underline className="w-4 h-4" />
                  </Button>
                  <div className="h-4 w-px bg-gray-300" />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText('\n## ', '\n')}
                    title="Heading"
                  >
                    H2
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText('\n### ', '\n')}
                    title="Subheading"
                  >
                    H3
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText('<a href="', '">link text</a>')}
                    title="Link"
                  >
                    <Link className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertText('\n- ', '\n')}
                    title="List"
                  >
                    Lista
                  </Button>
                </div>
                <Textarea
                  ref={contentTextareaRef}
                  value={formData.content}
                  onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                  placeholder="Scrie conținutul articolului aici. Poți folosi HTML basic pentru formatare..."
                  rows={15}
                  className="rounded-t-none border-t-0"
                />
              </div>
            </div>

            {/* Additional Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="tags">Tags (separate prin virgulă)</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                  placeholder="esports, cs2, moldova, turneu"
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Ciornă</SelectItem>
                    <SelectItem value="published">Publicat</SelectItem>
                    <SelectItem value="archived">Arhivat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="authorName">Autor</Label>
                <Input
                  id="authorName"
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  placeholder="Numele autorului"
                />
              </div>
              <div>
                <Label htmlFor="authorEmail">Email autor</Label>
                <Input
                  id="authorEmail"
                  value={formData.authorEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* SEO Fields */}
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50/50">
              <h4 className="font-medium">SEO Settings</h4>
              <div>
                <Label htmlFor="metaTitle">Meta Title</Label>
                <Input
                  id="metaTitle"
                  value={formData.metaTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                  placeholder="Titlu pentru motoarele de căutare"
                />
              </div>
              <div>
                <Label htmlFor="metaDescription">Meta Description</Label>
                <Textarea
                  id="metaDescription"
                  value={formData.metaDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                  placeholder="Descriere pentru motoarele de căutare (150-160 caractere)"
                  rows={2}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2 pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setShowEditDialog(false)}
                disabled={saveArticleMutation.isPending}
              >
                Anulează
              </Button>
              <Button
                onClick={handleSave}
                disabled={!formData.title.trim() || !formData.content.trim() || saveArticleMutation.isPending}
              >
                <Save className="w-4 h-4 mr-2" />
                {saveArticleMutation.isPending ? "Se salvează..." : "Salvează articolul"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Article Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center">
                <Eye className="mr-2" />
                Preview articol
              </div>
              {selectedArticle && getStatusBadge(selectedArticle.status)}
            </DialogTitle>
          </DialogHeader>
          
          {selectedArticle && (
            <div className="space-y-4">
              {selectedArticle.featuredImageData && (
                <img 
                  src={selectedArticle.featuredImageData} 
                  alt={selectedArticle.title} 
                  className="w-full h-64 object-cover rounded-lg"
                />
              )}
              
              <div>
                <h1 className="text-2xl font-bold mb-2">{selectedArticle.title}</h1>
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                  <span>De {selectedArticle.authorName}</span>
                  <span>{selectedArticle.publishedAt ? formatDate(selectedArticle.publishedAt) : 'Nepublicat'}</span>
                  <span>{selectedArticle.viewCount} vizualizări</span>
                </div>
                
                <p className="text-gray-600 mb-6 italic">{selectedArticle.excerpt}</p>
                
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedArticle.content }}
                />
                
                {selectedArticle.tags && (
                  <div className="mt-6 pt-4 border-t">
                    <h4 className="font-medium mb-2">Tags:</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedArticle.tags.split(',').filter(tag => tag.trim()).map((tag, index) => (
                        <Badge key={index} variant="outline">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}