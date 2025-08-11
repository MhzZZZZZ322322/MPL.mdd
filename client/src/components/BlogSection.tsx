import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, User, Eye, ArrowRight, FileText } from "lucide-react";
import { Link } from "wouter";

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

export default function BlogSection() {
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
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Știri & Actualizări
            </h2>
            <p className="text-xl text-gray-300">
              Rămâi la curent cu ultimele evenimente din esports
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </section>
    );
  }

  if (articles.length === 0) {
    return (
      <section className="py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Știri & Actualizări
            </h2>
            <p className="text-xl text-gray-300">
              Rămâi la curent cu ultimele evenimente din esports
            </p>
          </div>
          <div className="text-center py-12">
            <FileText className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <p className="text-gray-400 text-lg">
              Nu există articole publicate încă.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Știri & Actualizări
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rămâi la curent cu ultimele evenimente din esports
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {articles.slice(0, 6).map((article: BlogArticle) => (
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
                
                <div className="flex items-center justify-between">
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
                  <div className="flex flex-wrap gap-1 mt-3">
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

        {articles.length > 6 && (
          <div className="text-center">
            <Button 
              size="lg"
              variant="outline"
              className="bg-primary/10 border-primary/20 text-primary hover:bg-primary hover:text-white"
              asChild
            >
              <Link href="/blog">
                <span className="flex items-center">
                  Vezi toate articolele
                  <ArrowRight className="w-4 h-4 ml-2" />
                </span>
              </Link>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}