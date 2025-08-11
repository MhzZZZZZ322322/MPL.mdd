import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, User, Eye, ArrowRight, FileText, Search, Filter } from "lucide-react";
import { Link } from "wouter";
import { useLanguage } from "@/lib/LanguageContext";

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
  primaryCategory?: string;
  createdAt: string;
}

export default function NewsPage() {
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const { data: articles = [], isLoading } = useQuery({
    queryKey: ['/api/blog/articles/published'],
    queryFn: async () => {
      const response = await fetch('/api/blog/articles/published');
      if (!response.ok) throw new Error("Failed to fetch published articles");
      return response.json();
    }
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'ro' ? 'ro-RO' : 'ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 24) {
      return language === 'ro' ? `${diffInHours} ore în urmă` : `${diffInHours} часов назад`;
    }
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) {
      return language === 'ro' ? `${diffInDays} zile în urmă` : `${diffInDays} дней назад`;
    }
    
    return formatDate(dateString);
  };

  // Filter and sort articles
  const filteredAndSortedArticles = articles
    .filter((article: BlogArticle) => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           article.tags.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === "all" || article.primaryCategory === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a: BlogArticle, b: BlogArticle) => {
      if (sortBy === "newest") {
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      } else if (sortBy === "oldest") {
        return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
      } else if (sortBy === "popular") {
        return b.viewCount - a.viewCount;
      }
      return 0;
    });

  // Get unique categories
  const categories = Array.from(new Set(articles.map((article: BlogArticle) => article.primaryCategory).filter(Boolean)));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="text-center mb-16">
            <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
              {language === 'ro' ? 'Știri & Actualizări' : 'Новости и Обновления'}
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {language === 'ro' ? 'Rămâi la curent cu ultimele evenimente din esports-ul moldovenesc' : 'Будьте в курсе последних событий молдавского киберспорта'}
            </p>
          </div>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-white mb-6 bg-gradient-to-r from-purple-400 via-white to-blue-400 bg-clip-text text-transparent">
            {language === 'ro' ? 'Știri & Actualizări' : 'Новости и Обновления'}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            {language === 'ro' ? 'Rămâi la curent cu ultimele evenimente din esports-ul moldovenesc' : 'Будьте в курсе последних событий молдавского киберспорта'}
          </p>
        </div>

        {/* Filters */}
        <div className="mb-12">
          <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl p-6 border border-purple-500/20">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="flex-1 max-w-md">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    type="text"
                    placeholder={language === 'ro' ? 'Caută știri...' : 'Поиск новостей...'}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/50 border-purple-500/30 text-white placeholder:text-gray-400 focus:border-purple-400"
                  />
                </div>
              </div>

              {/* Category Filter */}
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="w-48 bg-black/50 border-purple-500/30 text-white">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder={language === 'ro' ? 'Toate categoriile' : 'Все категории'} />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-500/30">
                    <SelectItem value="all">
                      {language === 'ro' ? 'Toate categoriile' : 'Все категории'}
                    </SelectItem>
                    {categories.map((category: string) => (
                      <SelectItem key={category} value={category || ''}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Sort */}
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-48 bg-black/50 border-purple-500/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-900 border-purple-500/30">
                    <SelectItem value="newest">
                      {language === 'ro' ? 'Cele mai noi' : 'Новые'}
                    </SelectItem>
                    <SelectItem value="oldest">
                      {language === 'ro' ? 'Cele mai vechi' : 'Старые'}
                    </SelectItem>
                    <SelectItem value="popular">
                      {language === 'ro' ? 'Cele mai populare' : 'Популярные'}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Articles Grid */}
        {filteredAndSortedArticles.length === 0 ? (
          <div className="text-center py-20">
            <FileText className="h-16 w-16 text-gray-600 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-white mb-4">
              {language === 'ro' ? 'Nu au fost găsite articole' : 'Статьи не найдены'}
            </h3>
            <p className="text-gray-400 max-w-md mx-auto">
              {language === 'ro' ? 
                'Încearcă să modifici filtrele sau să revii mai târziu pentru actualizări.' :
                'Попробуйте изменить фильтры или вернитесь позже для обновлений.'
              }
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAndSortedArticles.map((article: BlogArticle) => (
              <Card key={article.id} className="group bg-gray-900/50 border-purple-500/20 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden">
                {/* Featured Image */}
                {article.featuredImageData && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={article.featuredImageData}
                      alt={article.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}

                <CardHeader className="pb-3">
                  {/* Meta Info */}
                  <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatTimeAgo(article.publishedAt || article.createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        <span>{article.viewCount}</span>
                      </div>
                    </div>
                    {article.primaryCategory && (
                      <Badge variant="outline" className="text-purple-400 border-purple-400/50">
                        {article.primaryCategory}
                      </Badge>
                    )}
                  </div>

                  {/* Title */}
                  <CardTitle className="text-xl font-bold text-white group-hover:text-purple-400 transition-colors line-clamp-2">
                    {article.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Excerpt */}
                  <p className="text-gray-300 line-clamp-3">
                    {article.excerpt}
                  </p>

                  {/* Tags */}
                  {article.tags && (
                    <div className="flex flex-wrap gap-1">
                      {article.tags.split(',').slice(0, 3).map((tag: string, index: number) => (
                        <Badge key={index} variant="secondary" className="text-xs bg-purple-900/30 text-purple-300 border-0">
                          {tag.trim()}
                        </Badge>
                      ))}
                    </div>
                  )}

                  {/* Author & Read More */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                    <div className="flex items-center gap-2 text-sm text-gray-400">
                      <User className="h-3 w-3" />
                      <span>{article.authorName}</span>
                    </div>
                    <Link href={`/blog/${article.slug}`}>
                      <Button variant="ghost" size="sm" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 p-2">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Show Results Count */}
        {filteredAndSortedArticles.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-400">
              {language === 'ro' ? 
                `Se afișează ${filteredAndSortedArticles.length} din ${articles.length} articole` :
                `Показано ${filteredAndSortedArticles.length} из ${articles.length} статей`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
}