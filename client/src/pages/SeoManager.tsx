import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  LoaderCircle, Info, AlertTriangle, Globe, Tag, Bot, Link as LinkIcon, 
  Code, Twitter, Facebook, ChevronLeft, Copy, Save, Plus, Trash2, 
  FileText, ShoppingCart, CalendarDays, Building, User, Briefcase
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';

const pages = [
  { url: '/', title: 'Pagina Principală' },
  { url: '/events', title: 'Evenimente' },
  { url: '/rankings', title: 'Clasamente' },
  { url: '/community', title: 'Comunitate' },
  { url: '/event/:id', title: 'Detalii Eveniment (șablon)' },
];

// Tipuri de date pentru SEO și Analytics
// Interfața pentru un fragment de date structurate
interface StructuredDataItem {
  id: string;
  type: string; // "WebPage", "Event", "Article", "Person", "Organization", etc.
  data: string; // JSON-LD ca string
}

type SeoSetting = {
  id: number;
  pageUrl: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  metaRobots: string;
  canonicalUrl: string;
  structuredData: string;
  structuredDataItems: StructuredDataItem[]; // Array de fragmente de date structurate
  openGraph: string;
  twitterCard: string;
  updatedAt: Date;
};

type AnalyticsSetting = {
  id: number;
  googleTagManagerId: string;
  googleAnalyticsId: string;
  googleSearchConsoleVerification: string;
  facebookPixelId: string;
  robotsTxt: string;
  sitemapXml: string;
  customHeaderScripts: string;
  updatedAt: Date;
};

// Date structurate predefinite pentru diferite tipuri
const STRUCTURED_DATA_TEMPLATES = {
  WebPage: '{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Titlul paginii",\n  "description": "Descrierea paginii"\n}',
  Event: '{\n  "@context": "https://schema.org",\n  "@type": "Event",\n  "name": "Numele evenimentului",\n  "startDate": "Data",\n  "endDate": "Data",\n  "location": {\n    "@type": "Place",\n    "name": "Locația",\n    "address": "Adresa"\n  },\n  "description": "Descrierea evenimentului"\n}',
  Article: '{\n  "@context": "https://schema.org",\n  "@type": "Article",\n  "headline": "Titlul articolului",\n  "author": {\n    "@type": "Person",\n    "name": "Autor"\n  },\n  "publisher": {\n    "@type": "Organization",\n    "name": "Moldova Pro League",\n    "logo": {\n      "@type": "ImageObject",\n      "url": "URL logo"\n    }\n  },\n  "datePublished": "Data publicării",\n  "dateModified": "Data modificării",\n  "description": "Descrierea articolului"\n}',
  Organization: '{\n  "@context": "https://schema.org",\n  "@type": "Organization",\n  "name": "Moldova Pro League",\n  "url": "https://moldovaproleague.md",\n  "logo": "URL logo",\n  "description": "Descrierea organizației"\n}',
  Person: '{\n  "@context": "https://schema.org",\n  "@type": "Person",\n  "name": "Nume persoană",\n  "jobTitle": "Titlu job",\n  "description": "Descriere"\n}'
};

const EMPTY_SEO_SETTING: Omit<SeoSetting, 'id' | 'updatedAt'> = {
  pageUrl: '',
  title: '',
  metaDescription: '',
  metaKeywords: '',
  metaRobots: 'index, follow',
  canonicalUrl: '',
  structuredData: STRUCTURED_DATA_TEMPLATES.WebPage,
  structuredDataItems: [], // Array gol inițial
  openGraph: '{\n  "og:title": "Titlul paginii",\n  "og:description": "Descrierea paginii",\n  "og:type": "website",\n  "og:image": "URL imagine"\n}',
  twitterCard: '{\n  "twitter:card": "summary_large_image",\n  "twitter:title": "Titlul paginii",\n  "twitter:description": "Descrierea paginii",\n  "twitter:image": "URL imagine"\n}',
};

const EMPTY_ANALYTICS_SETTING: Omit<AnalyticsSetting, 'id' | 'updatedAt'> = {
  googleTagManagerId: '',
  googleAnalyticsId: '',
  googleSearchConsoleVerification: '',
  facebookPixelId: '',
  robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://moldovaproleague.md/sitemap.xml',
  sitemapXml: `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
  <url>
    <loc>https://moldovaproleague.md/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>`,
  customHeaderScripts: '<!-- Adaugă aici script-uri custom pentru header -->',
};

const SeoManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seoSettings, setSeoSettings] = useState<SeoSetting[]>([]);
  const [analyticsSetting, setAnalyticsSetting] = useState<AnalyticsSetting | null>(null);
  const [currentSeoPage, setCurrentSeoPage] = useState<string>('/');
  const [currentSeoSetting, setCurrentSeoSetting] = useState<Omit<SeoSetting, 'id' | 'updatedAt'>>(EMPTY_SEO_SETTING);
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Verificăm dacă utilizatorul este autentificat
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    setIsAuthenticated(isAdmin);
    
    if (isAdmin) {
      fetchSeoSettings();
      fetchAnalyticsSettings();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchSeoSettings = async () => {
    try {
      setLoading(true);
      // Vom implementa acest API endpoint în viitor
      // const response = await fetch('/api/seo');
      // const data = await response.json();
      // setSeoSettings(data);
      
      // Pentru moment, folosim date fictive 
      const mockSeoSettings = pages.map((page, index) => ({
        id: index + 1,
        pageUrl: page.url,
        title: `${page.title} | Moldova Pro League`,
        metaDescription: `Moldova Pro League - ${page.title}, comunitatea esports din Moldova.`,
        metaKeywords: 'esports, moldova, gaming, jocuri video, competiții',
        metaRobots: 'index, follow',
        canonicalUrl: `https://moldovaproleague.md${page.url}`,
        structuredData: '{\n  "@context": "https://schema.org",\n  "@type": "WebPage",\n  "name": "Titlul paginii",\n  "description": "Descrierea paginii"\n}',
        structuredDataItems: [], // Array gol inițial
        openGraph: '{\n  "og:title": "Titlul paginii",\n  "og:description": "Descrierea paginii",\n  "og:type": "website",\n  "og:image": "URL imagine"\n}',
        twitterCard: '{\n  "twitter:card": "summary_large_image",\n  "twitter:title": "Titlul paginii",\n  "twitter:description": "Descrierea paginii",\n  "twitter:image": "URL imagine"\n}',
        updatedAt: new Date(),
      }));
      
      setSeoSettings(mockSeoSettings);
      
      // Setăm setarea curentă ca fiind prima pagină
      if (mockSeoSettings.length > 0) {
        setCurrentSeoSetting({
          pageUrl: mockSeoSettings[0].pageUrl,
          title: mockSeoSettings[0].title,
          metaDescription: mockSeoSettings[0].metaDescription,
          metaKeywords: mockSeoSettings[0].metaKeywords,
          metaRobots: mockSeoSettings[0].metaRobots,
          canonicalUrl: mockSeoSettings[0].canonicalUrl,
          structuredData: mockSeoSettings[0].structuredData,
          openGraph: mockSeoSettings[0].openGraph,
          twitterCard: mockSeoSettings[0].twitterCard,
        });
      }
    } catch (error) {
      console.error('Error fetching SEO settings:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca setările SEO. Te rugăm încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchAnalyticsSettings = async () => {
    try {
      // Vom implementa acest API endpoint în viitor
      // const response = await fetch('/api/analytics');
      // const data = await response.json();
      // setAnalyticsSetting(data);
      
      // Pentru moment, folosim date fictive 
      const mockAnalyticsSetting = {
        id: 1,
        googleTagManagerId: 'GTM-XXXXXXX',
        googleAnalyticsId: 'G-XXXXXXXXXX',
        googleSearchConsoleVerification: '<meta name="google-site-verification" content="XXXXXXXXXXXXXXXXXXXXXXXXX" />',
        facebookPixelId: 'XXXXXXXXXXXXXXXXXX',
        robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://moldovaproleague.md/sitemap.xml',
        sitemapXml: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://moldovaproleague.md/</loc>\n    <lastmod>2025-04-01</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>',
        customHeaderScripts: '<!-- Script-uri custom pentru header -->',
        updatedAt: new Date(),
      };
      
      setAnalyticsSetting(mockAnalyticsSetting);
    } catch (error) {
      console.error('Error fetching analytics settings:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut încărca setările Analytics. Te rugăm încearcă din nou.',
        variant: 'destructive',
      });
    }
  };

  const handleSeoSettingChange = (field: keyof Omit<SeoSetting, 'id' | 'updatedAt'>, value: string) => {
    setCurrentSeoSetting(prev => ({ ...prev, [field]: value }));
  };

  const handleAnalyticsSettingChange = (field: keyof Omit<AnalyticsSetting, 'id' | 'updatedAt'>, value: string) => {
    if (analyticsSetting) {
      setAnalyticsSetting(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const saveSeoSetting = async () => {
    try {
      setLoading(true);
      // Vom implementa acest API endpoint în viitor
      // const response = await fetch(`/api/seo/${currentSeoSetting.pageUrl}`, {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(currentSeoSetting),
      // });
      // const data = await response.json();
      
      // Actualizăm setările locale
      setSeoSettings(prev => 
        prev.map(setting => 
          setting.pageUrl === currentSeoSetting.pageUrl 
            ? { ...setting, ...currentSeoSetting, updatedAt: new Date() } 
            : setting
        )
      );
      
      toast({
        title: 'Succes',
        description: 'Setările SEO au fost salvate cu succes.',
      });
    } catch (error) {
      console.error('Error saving SEO setting:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut salva setările SEO. Te rugăm încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveAnalyticsSetting = async () => {
    try {
      setLoading(true);
      // Vom implementa acest API endpoint în viitor
      // const response = await fetch('/api/analytics', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(analyticsSetting),
      // });
      // const data = await response.json();
      
      toast({
        title: 'Succes',
        description: 'Setările Analytics au fost salvate cu succes.',
      });
    } catch (error) {
      console.error('Error saving analytics setting:', error);
      toast({
        title: 'Eroare',
        description: 'Nu s-au putut salva setările Analytics. Te rugăm încearcă din nou.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const selectPage = (pageUrl: string) => {
    setCurrentSeoPage(pageUrl);
    const selectedSetting = seoSettings.find(setting => setting.pageUrl === pageUrl);
    
    if (selectedSetting) {
      setCurrentSeoSetting({
        pageUrl: selectedSetting.pageUrl,
        title: selectedSetting.title,
        metaDescription: selectedSetting.metaDescription,
        metaKeywords: selectedSetting.metaKeywords,
        metaRobots: selectedSetting.metaRobots,
        canonicalUrl: selectedSetting.canonicalUrl,
        structuredData: selectedSetting.structuredData,
        openGraph: selectedSetting.openGraph,
        twitterCard: selectedSetting.twitterCard,
      });
    } else {
      setCurrentSeoSetting({
        ...EMPTY_SEO_SETTING,
        pageUrl: pageUrl,
      });
    }
  };

  const generateSitemap = () => {
    // Generează sitemap.xml din seoSettings cu o structură XML îmbunătățită
    const sitemapItems = seoSettings.map(setting => {
      // Formatăm data în formatul ISO complet pentru o mai bună compatibilitate
      const lastModified = new Date().toISOString();
      const priority = setting.pageUrl === '/' ? '1.0' : '0.8';
      // Folosim indentare mai clară și separate pe linii pentru a îmbunătăți lizibilitatea
      return `  <url>
    <loc>https://moldovaproleague.md${setting.pageUrl.replace(':id', '1')}</loc>
    <lastmod>${lastModified}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('\n');
    
    // Adăugăm doctype și namespaces specifice pentru sitemap
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${sitemapItems}
</urlset>`;
    
    if (analyticsSetting) {
      handleAnalyticsSettingChange('sitemapXml', sitemap);
    }
    
    toast({
      title: 'Succes',
      description: 'Sitemap-ul a fost generat cu etichete conforme standardelor.',
    });
  };

  // Dacă utilizatorul nu este autentificat, redirecționăm la pagina de admin
  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-darkBg">
        <div className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-8 max-w-md w-full">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white text-center mb-4">Acces restricționat</h2>
          <p className="text-gray-300 text-center mb-6">Trebuie să fii autentificat pentru a accesa această pagină.</p>
          <div className="flex justify-center">
            <Link href="/admin">
              <Button className="bg-primary hover:bg-primary/80 text-white">
                Înapoi la Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-darkBg">
        <LoaderCircle className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-darkBg">
      <div className="container mx-auto px-4 py-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-rajdhani font-bold text-white mb-2">Manager SEO & Analytics</h1>
            <div className="w-20 h-1 bg-gradient-to-r from-primary to-secondary"></div>
          </div>
          <div className="flex gap-4">
            <Link href="/admin">
              <Button variant="outline" className="text-white border-gray-600 hover:bg-darkGray">
                <ChevronLeft className="w-4 h-4 mr-2" /> Înapoi la Admin
              </Button>
            </Link>
          </div>
        </div>
        
        <Tabs defaultValue="pageSeo" className="bg-darkGray/60 backdrop-blur-sm border border-primary/20 rounded-lg p-6">
          <TabsList className="grid grid-cols-2 mb-6">
            <TabsTrigger value="pageSeo">SEO pentru pagini</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Site-wide SEO</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pageSeo">
            <div className="grid md:grid-cols-4 gap-6">
              <Card className="md:col-span-1 bg-darkBg border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white">Pagini</CardTitle>
                  <CardDescription>Selectează pagina pentru a edita setările SEO</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {pages.map((page) => (
                      <Button 
                        key={page.url} 
                        variant={currentSeoPage === page.url ? "default" : "outline"} 
                        className={`w-full justify-start ${currentSeoPage === page.url ? 'bg-primary hover:bg-primary/90' : 'text-white border-gray-600 hover:bg-darkGray'}`}
                        onClick={() => selectPage(page.url)}
                      >
                        <Globe className="w-4 h-4 mr-2" /> 
                        {page.title}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <Card className="md:col-span-3 bg-darkBg border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Globe className="w-5 h-5 mr-2" />
                    Setări SEO pentru {pages.find(p => p.url === currentSeoPage)?.title || currentSeoPage}
                  </CardTitle>
                  <CardDescription>
                    Editează meta title, description și alte setări SEO pentru această pagină
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-white flex items-center">
                        <Tag className="w-4 h-4 mr-2" /> Meta Title
                      </Label>
                      <Input 
                        id="title" 
                        value={currentSeoSetting.title} 
                        onChange={(e) => handleSeoSettingChange('title', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                      />
                      <p className="text-xs text-gray-400">Recomandat: 50-60 caractere</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="metaKeywords" className="text-white flex items-center">
                        <Tag className="w-4 h-4 mr-2" /> Meta Keywords
                      </Label>
                      <Input 
                        id="metaKeywords" 
                        value={currentSeoSetting.metaKeywords} 
                        onChange={(e) => handleSeoSettingChange('metaKeywords', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                      />
                      <p className="text-xs text-gray-400">Separate prin virgulă</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="metaDescription" className="text-white flex items-center">
                      <Info className="w-4 h-4 mr-2" /> Meta Description
                    </Label>
                    <Textarea 
                      id="metaDescription" 
                      value={currentSeoSetting.metaDescription} 
                      onChange={(e) => handleSeoSettingChange('metaDescription', e.target.value)}
                      className="border-primary/20 bg-darkGray/60 text-white focus:border-primary min-h-[80px]"
                    />
                    <p className="text-xs text-gray-400">Recomandat: 150-160 caractere</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="metaRobots" className="text-white flex items-center">
                        <Bot className="w-4 h-4 mr-2" /> Meta Robots
                      </Label>
                      <Input 
                        id="metaRobots" 
                        value={currentSeoSetting.metaRobots} 
                        onChange={(e) => handleSeoSettingChange('metaRobots', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                      />
                      <p className="text-xs text-gray-400">Ex: index, follow, noarchive</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="canonicalUrl" className="text-white flex items-center">
                        <LinkIcon className="w-4 h-4 mr-2" /> Canonical URL
                      </Label>
                      <Input 
                        id="canonicalUrl" 
                        value={currentSeoSetting.canonicalUrl} 
                        onChange={(e) => handleSeoSettingChange('canonicalUrl', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                      />
                      <p className="text-xs text-gray-400">URL-ul canonic complet</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="structuredData" className="text-white flex items-center">
                      <Code className="w-4 h-4 mr-2" /> Date Structurate (JSON-LD)
                    </Label>
                    <Textarea 
                      id="structuredData" 
                      value={currentSeoSetting.structuredData} 
                      onChange={(e) => handleSeoSettingChange('structuredData', e.target.value)}
                      className="border-primary/20 bg-darkGray/60 text-white focus:border-primary font-mono text-sm min-h-[150px]"
                    />
                    <p className="text-xs text-gray-400">Format JSON pentru Schema.org</p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="openGraph" className="text-white flex items-center">
                        <Facebook className="w-4 h-4 mr-2" /> Open Graph (Meta/Facebook)
                      </Label>
                      <Textarea 
                        id="openGraph" 
                        value={currentSeoSetting.openGraph} 
                        onChange={(e) => handleSeoSettingChange('openGraph', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary font-mono text-sm min-h-[150px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="twitterCard" className="text-white flex items-center">
                        <Twitter className="w-4 h-4 mr-2" /> Twitter Card
                      </Label>
                      <Textarea 
                        id="twitterCard" 
                        value={currentSeoSetting.twitterCard} 
                        onChange={(e) => handleSeoSettingChange('twitterCard', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary font-mono text-sm min-h-[150px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2 border-t border-gray-800 pt-4">
                  <Button variant="outline" disabled={loading} className="text-white border-gray-600 hover:bg-darkGray">
                    Anulează
                  </Button>
                  <Button onClick={saveSeoSetting} disabled={loading} className="bg-primary hover:bg-primary/80">
                    {loading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvează
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card className="bg-darkBg border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white">Servicii Analytics & Tag Management</CardTitle>
                  <CardDescription>Conectează site-ul la servicii de analytics și urmărire</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="googleTagManagerId" className="text-white">Google Tag Manager ID</Label>
                      <Input 
                        id="googleTagManagerId" 
                        value={analyticsSetting?.googleTagManagerId || ''} 
                        onChange={(e) => handleAnalyticsSettingChange('googleTagManagerId', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                        placeholder="GTM-XXXXXXX"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="googleAnalyticsId" className="text-white">Google Analytics ID</Label>
                      <Input 
                        id="googleAnalyticsId" 
                        value={analyticsSetting?.googleAnalyticsId || ''} 
                        onChange={(e) => handleAnalyticsSettingChange('googleAnalyticsId', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                        placeholder="G-XXXXXXXXXX"
                      />
                    </div>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="googleSearchConsoleVerification" className="text-white">Google Search Console (meta tag)</Label>
                      <Input 
                        id="googleSearchConsoleVerification" 
                        value={analyticsSetting?.googleSearchConsoleVerification || ''} 
                        onChange={(e) => handleAnalyticsSettingChange('googleSearchConsoleVerification', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                        placeholder='<meta name="google-site-verification" content="..." />'
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="facebookPixelId" className="text-white">Facebook Pixel ID</Label>
                      <Input 
                        id="facebookPixelId" 
                        value={analyticsSetting?.facebookPixelId || ''} 
                        onChange={(e) => handleAnalyticsSettingChange('facebookPixelId', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                        placeholder="XXXXXXXXXXXXXXXXXX"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="customHeaderScripts" className="text-white">Script-uri Custom pentru Header</Label>
                    <Textarea 
                      id="customHeaderScripts" 
                      value={analyticsSetting?.customHeaderScripts || ''} 
                      onChange={(e) => handleAnalyticsSettingChange('customHeaderScripts', e.target.value)}
                      className="border-primary/20 bg-darkGray/60 text-white focus:border-primary font-mono text-sm min-h-[150px]"
                      placeholder="<!-- Adaugă aici script-uri custom pentru header -->"
                    />
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-2 border-t border-gray-800 pt-4">
                  <div>
                    <Button variant="outline" disabled={loading} className="text-white border-gray-600 hover:bg-darkGray">
                      Testează
                    </Button>
                  </div>
                  <Button onClick={saveAnalyticsSetting} disabled={loading} className="bg-primary hover:bg-primary/80">
                    {loading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvează
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-darkBg border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white">Robots.txt & Sitemap.xml</CardTitle>
                  <CardDescription>Configurează fișierele pentru crawlere</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="robotsTxt" className="text-white">Robots.txt</Label>
                        <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(analyticsSetting?.robotsTxt || '')} className="h-7 px-2 text-xs text-gray-400 hover:text-white">
                          <Copy className="w-3 h-3 mr-1" /> Copiază
                        </Button>
                      </div>
                      <Textarea 
                        id="robotsTxt" 
                        value={analyticsSetting?.robotsTxt || ''} 
                        onChange={(e) => handleAnalyticsSettingChange('robotsTxt', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary font-mono text-sm min-h-[250px]"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label htmlFor="sitemapXml" className="text-white">Sitemap.xml</Label>
                        <div className="flex gap-2">
                          <Button variant="ghost" size="sm" onClick={generateSitemap} className="h-7 px-2 text-xs text-gray-400 hover:text-white">
                            Generează
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(analyticsSetting?.sitemapXml || '')} className="h-7 px-2 text-xs text-gray-400 hover:text-white">
                            <Copy className="w-3 h-3 mr-1" /> Copiază
                          </Button>
                        </div>
                      </div>
                      <Textarea 
                        id="sitemapXml" 
                        value={analyticsSetting?.sitemapXml || ''} 
                        onChange={(e) => handleAnalyticsSettingChange('sitemapXml', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary font-mono text-sm min-h-[250px]"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2 border-t border-gray-800 pt-4">
                  <Button variant="outline" disabled={loading} className="text-white border-gray-600 hover:bg-darkGray">
                    Resetează
                  </Button>
                  <Button onClick={saveAnalyticsSetting} disabled={loading} className="bg-primary hover:bg-primary/80">
                    {loading ? <LoaderCircle className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                    Salvează
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default SeoManager;