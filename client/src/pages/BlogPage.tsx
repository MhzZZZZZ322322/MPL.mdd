import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar, Clock, User, Eye, ArrowRight, FileText, Search } from "lucide-react";
import { Link } from "wouter";
import { useState } from "react";

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
  createdAt: string;
}

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['/api/blog/articles/published'],
    queryFn: async () => {
      const response = await fetch('/api/blog/articles/published');
      if (!response.ok) throw new Error("Failed to fetch published articles");
      return response.json();
    }
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

  const filteredArticles = articles.filter((article: BlogArticle) =>
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.tags.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-slate-900/50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-4">
              Blog MPL
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Ultimele știri, analize și actualizări din lumea esports-urilor din Moldova
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Caută articole..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-800/50 border-slate-700 text-white placeholder-gray-400 focus:border-primary"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-2xl font-bold text-white mb-2">
              {searchTerm ? "Nu s-au găsit articole" : "Nu există articole"}
            </h3>
            <p className="text-gray-400 text-lg">
              {searchTerm 
                ? `Nu s-au găsit articole care să conțină "${searchTerm}".`
                : "Nu există articole publicate încă."
              }
            </p>
            {searchTerm && (
              <Button
                variant="outline"
                onClick={() => setSearchTerm("")}
                className="mt-4 text-primary border-primary hover:bg-primary hover:text-white"
              >
                Șterge căutarea
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article: BlogArticle) => (
                <Card 
                  key={article.id} 
                  className="bg-slate-800/50 border-slate-700 hover:bg-slate-800/70 transition-all duration-300 hover:scale-105 hover:shadow-xl"
                >
                  {article.featuredImageData && (
                    <div className="aspect-video overflow-hidden rounded-t-lg">
                      <img 
                        src={article.featuredImageData} 
                        alt={article.title}
                        className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  )}
                  
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between text-sm text-gray-400 mb-2">
                      <span className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1" />
                        {formatDate(article.publishedAt || article.createdAt)}
                      </span>
                      <span className="flex items-center">
                        <Eye className="w-4 h-4 mr-1" />
                        {article.viewCount}
                      </span>
                    </div>
                    
                    <CardTitle className="text-white text-lg line-clamp-2 hover:text-primary transition-colors">
                      {article.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <p className="text-gray-300 text-sm line-clamp-3 mb-4">
                      {article.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center text-xs text-gray-400">
                        <User className="w-3 h-3 mr-1" />
                        {article.authorName}
                      </div>
                      
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="text-xs bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white"
                        asChild
                      >
                        <Link href={`/blog/${article.slug}`}>
                          <span className="flex items-center">
                            Citește
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </span>
                        </Link>
                      </Button>
                    </div>

                    {article.tags && (
                      <div className="flex flex-wrap gap-1">
                        {article.tags.split(',').filter(tag => tag.trim()).slice(0, 3).map((tag, index) => (
                          <Badge 
                            key={index} 
                            variant="secondary" 
                            className="text-xs bg-slate-700 text-gray-300"
                          >
                            {tag.trim()}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Results Count */}
            {searchTerm && (
              <div className="text-center mt-8">
                <p className="text-gray-400">
                  S-au găsit {filteredArticles.length} articol{filteredArticles.length !== 1 ? 'e' : ''} pentru "{searchTerm}"
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}