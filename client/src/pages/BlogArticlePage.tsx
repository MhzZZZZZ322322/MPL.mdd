import { useQuery } from "@tanstack/react-query";
import { useParams, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, User, Eye, ArrowLeft, Share2, Clock, FileText } from "lucide-react";
import { Link } from "wouter";
import { useToast } from "@/hooks/use-toast";

interface BlogArticle {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
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

export default function BlogArticlePage() {
  const { slug } = useParams<{ slug: string }>();
  const { toast } = useToast();

  const { data: article, isLoading, error } = useQuery({
    queryKey: ['/api/blog/articles/slug', slug],
    queryFn: async () => {
      const response = await fetch(`/api/blog/articles/slug/${slug}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("ARTICLE_NOT_FOUND");
        }
        throw new Error("Failed to fetch article");
      }
      return response.json();
    },
    enabled: !!slug
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ro-RO', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const processArticleContent = (content: string): string => {
    // Process HTML and JavaScript raw content
    let processedContent = content;
    
    // Allow script tags to be executed
    processedContent = processedContent.replace(
      /<script>([\s\S]*?)<\/script>/gi,
      (match, scriptContent) => {
        // Create a unique script tag that will be executed
        const scriptId = `article-script-${Math.random().toString(36).substr(2, 9)}`;
        setTimeout(() => {
          try {
            const scriptElement = document.createElement('script');
            scriptElement.textContent = scriptContent;
            scriptElement.id = scriptId;
            document.head.appendChild(scriptElement);
          } catch (error) {
            console.warn('Script execution error:', error);
          }
        }, 100);
        
        return `<div class="script-placeholder bg-gray-800 border border-gray-600 p-4 rounded-lg my-4">
          <div class="flex items-center text-yellow-400 text-sm font-mono mb-2">
            <span class="mr-2">⚡</span>
            JavaScript Code Executed
          </div>
          <pre class="text-gray-300 text-sm overflow-x-auto"><code>${scriptContent.trim()}</code></pre>
        </div>`;
      }
    );
    
    // Style HTML code blocks
    processedContent = processedContent.replace(
      /<div class="html-code">([\s\S]*?)<\/div>/gi,
      (match, htmlContent) => {
        return `<div class="html-code-container bg-blue-900/20 border border-blue-600/30 p-4 rounded-lg my-4">
          <div class="flex items-center text-blue-400 text-sm font-mono mb-3">
            <span class="mr-2">🔧</span>
            HTML Raw Content
          </div>
          ${htmlContent}
        </div>`;
      }
    );
    
    return processedContent;
  };

  const handleShare = async () => {
    const url = window.location.href;
    const title = article?.title || 'MPL Blog';

    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
        });
      } catch (error) {
        // User cancelled or error
      }
    } else {
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copiat",
          description: "Link-ul articolului a fost copiat în clipboard.",
          variant: "default",
        });
      } catch (error) {
        toast({
          title: "Eroare",
          description: "Nu s-a putut copia link-ul.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-4xl mx-auto">
            <div className="animate-pulse">
              <div className="h-8 bg-slate-700 rounded mb-4"></div>
              <div className="h-64 bg-slate-700 rounded mb-6"></div>
              <div className="space-y-3">
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded"></div>
                <div className="h-4 bg-slate-700 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error?.message === "ARTICLE_NOT_FOUND") {
    return (
      <div className="min-h-screen bg-black">
        <div className="container mx-auto px-4 py-20">
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 backdrop-blur-sm">
              <FileText className="mx-auto h-16 w-16 text-purple-400 mb-6" />
              <h1 className="text-4xl font-bold text-white mb-4">
                Articol negăsit
              </h1>
              <p className="text-xl text-gray-300 mb-8">
                Articolul pe care îl cauți nu există sau a fost eliminat.
              </p>
              <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white border-0">
                <Link href="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Înapoi la blog
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-white mb-4">
              Eroare la încărcare
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              A apărut o eroare la încărcarea articolului. Te rugăm să încerci din nou.
            </p>
            <Button 
              onClick={() => window.location.reload()} 
              size="lg" 
              className="bg-primary hover:bg-primary/90 mr-4"
            >
              Reîncarcă pagina
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link href="/blog">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Înapoi la blog
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Breadcrumb */}
      <div className="bg-black/80 py-6 border-b border-gray-800">
        <div className="container mx-auto px-4">
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-gray-400 hover:text-purple-400 transition-colors duration-300"
          >
            <Link href="/blog">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Înapoi la blog
            </Link>
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 bg-black relative">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none"></div>
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
        
        <article className="max-w-4xl mx-auto relative z-10">
          {/* Article Header */}
          <header className="mb-8">
            {/* Meta Info */}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-6">
              <div className="flex items-center space-x-6">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  {formatDate(article.publishedAt || article.createdAt)}
                </span>
                <span className="flex items-center">
                  <User className="w-4 h-4 mr-2" />
                  {article.authorName}
                </span>
                <span className="flex items-center">
                  <Eye className="w-4 h-4 mr-2" />
                  {article.viewCount} vizualizări
                </span>
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={handleShare}
                className="bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all duration-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Distribuie
              </Button>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight bg-gradient-to-r from-white via-purple-100 to-white bg-clip-text text-transparent">
              {article.title}
            </h1>

            {/* Excerpt */}
            <p className="text-xl text-gray-300 mb-6 leading-relaxed italic">
              {article.excerpt}
            </p>

            {/* Tags */}
            {article.tags && (
              <div className="flex flex-wrap gap-2 mb-8">
                {article.tags.split(',').filter((tag: string) => tag.trim()).map((tag: string, index: number) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-purple-900/40 text-purple-200 border border-purple-500/30 hover:bg-purple-800/60 transition-colors duration-300"
                  >
                    {tag.trim()}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          {/* Featured Image */}
          {article.featuredImageData && (
            <div className="mb-8">
              <img 
                src={article.featuredImageData} 
                alt={article.title}
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="bg-gray-900/30 border border-gray-800/50 rounded-lg p-8 mb-8 backdrop-blur-sm">
            <div 
              className="prose prose-lg prose-invert max-w-none
                prose-headings:text-white 
                prose-p:text-gray-200 prose-p:leading-relaxed
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                prose-strong:text-white
                prose-ul:text-gray-200 prose-ol:text-gray-200
                prose-li:text-gray-200
                prose-blockquote:border-primary prose-blockquote:text-gray-300
                prose-code:text-primary prose-code:bg-slate-700 prose-code:px-1 prose-code:rounded
                prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-600"
              dangerouslySetInnerHTML={{ __html: processArticleContent(article.content) }}
            />
          </div>

          {/* Article Footer */}
          <footer className="border-t border-gray-800 pt-8">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-400">
                <p>Ultima actualizare: {formatDate(article.updatedAt)}</p>
                {article.authorEmail && (
                  <p>Contact autor: 
                    <a 
                      href={`mailto:${article.authorEmail}`}
                      className="text-purple-400 hover:underline ml-1 transition-colors duration-300"
                    >
                      {article.authorEmail}
                    </a>
                  </p>
                )}
              </div>
              
              <Button
                variant="outline"
                onClick={handleShare}
                className="bg-gray-900/50 border-gray-700 text-gray-300 hover:bg-purple-600 hover:border-purple-500 hover:text-white transition-all duration-300"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Distribuie articolul
              </Button>
            </div>
          </footer>
        </article>
      </div>
    </div>
  );
}