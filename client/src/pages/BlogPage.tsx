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
    <div className="min-h-screen bg-black">
      {/* Header */}
      <div className="bg-black relative overflow-hidden py-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
              Blog MPL
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Ultimele știri, analize și actualizări din lumea esports-urilor din Moldova
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 bg-black relative">
        {/* Subtle background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent pointer-events-none"></div>
        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Caută articole..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-900/80 border-gray-800 text-white placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500/20 backdrop-blur-sm transition-all duration-300"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-12 max-w-md mx-auto backdrop-blur-sm">
              <FileText className="mx-auto h-16 w-16 text-purple-400 mb-6" />
              <h3 className="text-2xl font-bold text-white mb-4">
                {searchTerm ? "Nu s-au găsit articole" : "Nu există articole"}
              </h3>
              <p className="text-gray-300 text-lg mb-6">
                {searchTerm 
                  ? `Nu s-au găsit articole care să conțină "${searchTerm}".`
                  : "Nu există articole publicate încă."
                }
              </p>
              {searchTerm && (
                <Button
                  variant="outline"
                  onClick={() => setSearchTerm("")}
                  className="bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-400 transition-all duration-300"
                >
                  Șterge căutarea
                </Button>
              )}
            </div>
          </div>
        ) : (
          <>
            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
              {filteredArticles.map((article: BlogArticle) => (
                <Card 
                  key={article.id} 
                  className="bg-gray-900/80 border border-gray-800 backdrop-blur-sm hover:bg-gray-900/90 hover:border-purple-500/50 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl hover:shadow-purple-500/20 group"
                >
                  {article.featuredImageData && (
                    <div className="aspect-video overflow-hidden rounded-t-lg relative">
                      <img 
                        src={article.featuredImageData} 
                        alt={article.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
                    
                    <CardTitle className="text-white text-lg line-clamp-2 group-hover:text-purple-400 transition-colors duration-300">
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
                        className="text-xs bg-purple-900/20 border-purple-500/30 text-purple-300 hover:bg-purple-600 hover:text-white hover:border-purple-400 transition-all duration-300"
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
                            className="text-xs bg-purple-900/40 text-purple-200 border border-purple-500/30 hover:bg-purple-800/60 transition-colors duration-300 px-2 py-1 inline-block whitespace-nowrap"
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