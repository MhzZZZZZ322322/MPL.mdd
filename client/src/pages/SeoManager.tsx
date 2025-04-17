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
  FileText, ShoppingCart, CalendarDays, Building, User, Briefcase, BarChart,
  CornerDownRight, AlertCircle, XCircle, CheckCircle, AlertOctagon, PieChart, 
  Image, Upload, Eye
} from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Link } from 'wouter';
import { Switch } from '@/components/ui/switch';

// Lista de pagini prestabilite
const defaultPages = [
  { url: '/', title: 'Pagina Principală' },
  { url: '/events', title: 'Evenimente' },
  { url: '/rankings', title: 'Clasamente' },
  { url: '/community', title: 'Comunitate' },
  { url: '/event/:id', title: 'Detalii Eveniment (șablon)' },
];

// Funcția de detectare și compilare a tuturor paginilor disponibile
const detectAllPages = (existingSettings: SeoSetting[] = []): { url: string, title: string }[] => {
  // Combinăm paginile prestabilite cu cele detectate din setări
  const detectedUrls = new Set(defaultPages.map(p => p.url));
  const detectedPages = [...defaultPages];
  
  // Adăugăm orice pagină care există în setări dar nu este în lista prestabilită
  existingSettings.forEach(setting => {
    if (!detectedUrls.has(setting.pageUrl)) {
      detectedPages.push({ 
        url: setting.pageUrl, 
        title: setting.title.replace(' | Moldova Pro League', '') || `Pagină ${setting.pageUrl}` 
      });
      detectedUrls.add(setting.pageUrl);
    }
  });
  
  // Sortăm paginile cu pagina principală prima, apoi alfabetic
  return detectedPages.sort((a, b) => {
    if (a.url === '/') return -1;
    if (b.url === '/') return 1;
    return a.title.localeCompare(b.title);
  });
};

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
  microsoftClarityId: string; // ID Microsoft Clarity
  robotsTxt: string;
  sitemapXml: string;
  customHeaderScripts: string;
  siteIndexingEnabled: boolean; // Controleaza indexarea globala a site-ului
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
  microsoftClarityId: '', // ID Microsoft Clarity
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
  siteIndexingEnabled: true, // Implicit site-ul este indexabil
};

const SeoManager = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [seoSettings, setSeoSettings] = useState<SeoSetting[]>([]);
  const [analyticsSetting, setAnalyticsSetting] = useState<AnalyticsSetting | null>(null);
  const [currentSeoPage, setCurrentSeoPage] = useState<string>('/');
  const [currentSeoSetting, setCurrentSeoSetting] = useState<Omit<SeoSetting, 'id' | 'updatedAt'>>(EMPTY_SEO_SETTING);
  const [isEditing, setIsEditing] = useState(false);
  const [structuredDataItems, setStructuredDataItems] = useState<StructuredDataItem[]>([]);
  const [editingItemIndex, setEditingItemIndex] = useState<number | null>(null);
  
  // State pentru redirectări
  const [redirects, setRedirects] = useState<{id: number, fromPath: string, toPath: string, type: '301' | '302', active: boolean}[]>([]);
  const [newRedirect, setNewRedirect] = useState<{fromPath: string, toPath: string, type: '301' | '302'}>({
    fromPath: '',
    toPath: '',
    type: '301'
  });
  
  // State pentru pagina 404 personalizată
  const [custom404, setCustom404] = useState({
    enable404tracking: true,
    enable404suggestions: true,
    errorPageMessage: 'Oops! Pagina pe care o cauți nu există. Iată câteva pagini care te-ar putea interesa...',
    errorReturnLink: '/',
    errorMaxSuggestions: 3,
    errorImage: '', // Imagine personalizată pentru pagina 404
  });
  
  // Funcție pentru actualizarea setărilor paginii 404
  const handleCustom404Change = (field: string, value: string | boolean | number) => {
    setCustom404(prev => ({ ...prev, [field]: value }));
  };
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
      const mockSeoSettings = defaultPages.map((page, index) => ({
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
          structuredDataItems: mockSeoSettings[0].structuredDataItems || [],
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
        microsoftClarityId: 'XXXXXXXXXX', // ID Microsoft Clarity
        robotsTxt: 'User-agent: *\nAllow: /\nSitemap: https://moldovaproleague.md/sitemap.xml',
        sitemapXml: '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <url>\n    <loc>https://moldovaproleague.md/</loc>\n    <lastmod>2025-04-01</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>1.0</priority>\n  </url>\n</urlset>',
        customHeaderScripts: '<!-- Script-uri custom pentru header -->',
        siteIndexingEnabled: true, // Implicit site-ul este indexabil
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

  const handleAnalyticsSettingChange = (field: keyof Omit<AnalyticsSetting, 'id' | 'updatedAt'>, value: string | boolean) => {
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
        structuredDataItems: selectedSetting.structuredDataItems || [],
        openGraph: selectedSetting.openGraph,
        twitterCard: selectedSetting.twitterCard,
      });
      
      // Actualizăm starea locală pentru datele structurate
      setStructuredDataItems(selectedSetting.structuredDataItems || []);
    } else {
      setCurrentSeoSetting({
        ...EMPTY_SEO_SETTING,
        pageUrl: pageUrl,
      });
      setStructuredDataItems([]);
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
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="pageSeo">SEO pentru pagini</TabsTrigger>
            <TabsTrigger value="analytics">Analytics & Site-wide SEO</TabsTrigger>
            <TabsTrigger value="redirects">Redirectări & 404</TabsTrigger>
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
                    {/* Folosim lista de pagini detectate automat pentru a afișa toate paginile, inclusiv cele noi */}
                    {detectAllPages(seoSettings).map((page) => (
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
                    Setări SEO pentru {detectAllPages(seoSettings).find(p => p.url === currentSeoPage)?.title || currentSeoPage}
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
                </CardContent>
                <CardFooter className="justify-end gap-2 border-t border-gray-800 pt-4">
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
              <Card className="bg-darkBg border-primary/20 mb-6">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Bot className="w-5 h-5 mr-2" />
                    Indexare Globală
                  </CardTitle>
                  <CardDescription>Control superior pentru indexarea în motoarele de căutare</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-white font-medium">Indexare globală a site-ului</h3>
                        <p className="text-sm text-gray-400">Această setare controlează indexarea globală a site-ului, superior tag-ului robots</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Label htmlFor="siteIndexingEnabled" className={`text-sm ${analyticsSetting?.siteIndexingEnabled ? 'text-green-500' : 'text-red-500'} font-medium`}>
                          {analyticsSetting?.siteIndexingEnabled ? 'Activat' : 'Dezactivat'}
                        </Label>
                        <Label className="cursor-pointer relative inline-flex items-center">
                          <input
                            type="checkbox"
                            id="siteIndexingEnabled"
                            className="sr-only"
                            checked={analyticsSetting?.siteIndexingEnabled}
                            onChange={(e) => handleAnalyticsSettingChange('siteIndexingEnabled', e.target.checked)}
                          />
                          <div className={`w-11 h-6 rounded-full transition ${analyticsSetting?.siteIndexingEnabled ? 'bg-primary' : 'bg-gray-700'}`}>
                            <div className={`w-5 h-5 rounded-full transition transform bg-white ${analyticsSetting?.siteIndexingEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
                          </div>
                        </Label>
                      </div>
                    </div>
                    
                    <div className="bg-darkGray/40 rounded-md p-4 border border-gray-700 mt-2">
                      <h4 className="text-white text-sm font-medium mb-2">Efectele dezactivării indexării globale:</h4>
                      <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                        <li>Adaugă X-Robots-Tag: noindex, nofollow la toate răspunsurile HTTP</li>
                        <li>Actualizează robots.txt pentru a bloca toți agenții</li>
                        <li>Funcționează superior și înlocuiește setările meta robots individuale</li>
                        <li>Folosește pentru a preveni indexarea site-urilor aflate în dezvoltare</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-800 pt-4">
                  <Button variant="ghost" size="sm" className="text-xs text-gray-400 hover:text-white ml-auto">
                    Ajutor
                  </Button>
                </CardFooter>
              </Card>

              <Card className="bg-darkBg border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <BarChart className="w-5 h-5 mr-2" />
                    Integrări Analytics
                  </CardTitle>
                  <CardDescription>Configurează serviciile de analiză și urmărire</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
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
                    <Label htmlFor="microsoftClarityId" className="text-white flex items-center">
                      <BarChart className="w-4 h-4 mr-2" /> Microsoft Clarity ID
                    </Label>
                    <Input 
                      id="microsoftClarityId" 
                      value={analyticsSetting?.microsoftClarityId || ''} 
                      onChange={(e) => handleAnalyticsSettingChange('microsoftClarityId', e.target.value)}
                      className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                      placeholder="XXXXXXXXXX"
                    />
                    <p className="text-xs text-gray-400">ID-ul pentru Microsoft Clarity - instrumentul de analiză comportamentală a vizitatorilor</p>
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
          
          <TabsContent value="redirects">
            <div className="space-y-6">
              <Card className="bg-darkBg border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <CornerDownRight className="w-5 h-5 mr-2" />
                    Gestionare Redirectări
                  </CardTitle>
                  <CardDescription>Adaugă și administrează redirectări 301 și 302 pentru a nu pierde trafic</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-darkGray/40 rounded-md p-4 border border-gray-700 mb-4">
                    <div className="flex items-center mb-2">
                      <AlertCircle className="w-4 h-4 text-yellow-500 mr-2" />
                      <h4 className="text-white text-sm font-medium">Importanța redirectărilor</h4>
                    </div>
                    <p className="text-xs text-gray-300 mb-2">
                      Redirectările sunt esențiale pentru a păstra autoritatea SEO și a nu pierde trafic atunci când modifici structura site-ului:
                    </p>
                    <ul className="text-xs text-gray-300 space-y-1 list-disc list-inside">
                      <li><span className="font-medium text-primary">301 (Permanent)</span> - Pentru pagini mutate definitiv</li>
                      <li><span className="font-medium text-blue-400">302 (Temporar)</span> - Pentru pagini temporar indisponibile</li>
                    </ul>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="text-white font-medium">Adaugă redirectare nouă</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="fromPath" className="text-white">URL sursă</Label>
                        <Input 
                          id="fromPath" 
                          placeholder="/pagina-veche" 
                          value={newRedirect.fromPath}
                          onChange={(e) => setNewRedirect({...newRedirect, fromPath: e.target.value})}
                          className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                        />
                        <p className="text-xs text-gray-400">Calea URL care nu mai există</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="toPath" className="text-white">URL destinație</Label>
                        <Input 
                          id="toPath" 
                          placeholder="/pagina-noua" 
                          value={newRedirect.toPath}
                          onChange={(e) => setNewRedirect({...newRedirect, toPath: e.target.value})}
                          className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                        />
                        <p className="text-xs text-gray-400">Calea URL către care se face redirectarea</p>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="redirectType" className="text-white">Tip redirectare</Label>
                        <Select 
                          value={newRedirect.type} 
                          onValueChange={(value: '301' | '302') => setNewRedirect({...newRedirect, type: value})}
                        >
                          <SelectTrigger className="border-primary/20 bg-darkGray/60 text-white">
                            <SelectValue placeholder="Selectează tip" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="301">301 - Permanent</SelectItem>
                            <SelectItem value="302">302 - Temporar</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        className="bg-primary hover:bg-primary/80"
                        disabled={!newRedirect.fromPath || !newRedirect.toPath}
                        onClick={() => {
                          // Adaugă o nouă redirectare
                          const newId = redirects.length > 0 ? Math.max(...redirects.map(r => r.id)) + 1 : 1;
                          setRedirects([...redirects, {
                            id: newId,
                            fromPath: newRedirect.fromPath,
                            toPath: newRedirect.toPath,
                            type: newRedirect.type,
                            active: true
                          }]);
                          
                          // Resetează formularul
                          setNewRedirect({
                            fromPath: '',
                            toPath: '',
                            type: '301'
                          });
                          
                          toast({
                            title: 'Succes',
                            description: 'Redirectarea a fost adăugată cu succes.',
                          });
                        }}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Adaugă redirectare
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-white font-medium mb-4">Redirectări active</h3>
                    {redirects.length === 0 ? (
                      <div className="text-center bg-darkGray/40 rounded-md p-8 border border-gray-700">
                        <CornerDownRight className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">Nu există redirectări configurate</p>
                        <p className="text-xs text-gray-500 mt-2">Adaugă prima redirectare pentru a gestiona traficul către URL-uri indisponibile</p>
                      </div>
                    ) : (
                      <div className="bg-darkGray/40 rounded-md border border-gray-700 overflow-hidden">
                        <table className="w-full text-sm text-left">
                          <thead className="text-xs text-gray-400 uppercase bg-darkGray">
                            <tr>
                              <th className="px-6 py-3">Stare</th>
                              <th className="px-6 py-3">De la URL</th>
                              <th className="px-6 py-3">Către URL</th>
                              <th className="px-6 py-3">Tip</th>
                              <th className="px-6 py-3 text-right">Acțiuni</th>
                            </tr>
                          </thead>
                          <tbody>
                            {redirects.map((redirect) => (
                              <tr key={redirect.id} className="border-t border-gray-700">
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <div className={`w-3 h-3 rounded-full mr-2 ${redirect.active ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-xs text-gray-300">{redirect.active ? 'Activ' : 'Inactiv'}</span>
                                  </div>
                                </td>
                                <td className="px-6 py-4 font-mono text-gray-300">{redirect.fromPath}</td>
                                <td className="px-6 py-4 font-mono text-gray-300">{redirect.toPath}</td>
                                <td className="px-6 py-4">
                                  <span className={`text-xs font-medium px-2 py-1 rounded ${redirect.type === '301' ? 'bg-primary/20 text-primary' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {redirect.type}
                                  </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                  <div className="flex items-center justify-end gap-2">
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-gray-400 hover:text-white"
                                      onClick={() => {
                                        // Toggle starea active/inactive
                                        setRedirects(redirects.map(r => 
                                          r.id === redirect.id ? {...r, active: !r.active} : r
                                        ));
                                      }}
                                    >
                                      {redirect.active ? 
                                        <XCircle className="w-4 h-4" /> : 
                                        <CheckCircle className="w-4 h-4" />
                                      }
                                    </Button>
                                    <Button 
                                      variant="ghost" 
                                      size="sm" 
                                      className="text-red-400 hover:text-red-300"
                                      onClick={() => {
                                        // Șterge redirectarea
                                        setRedirects(redirects.filter(r => r.id !== redirect.id));
                                        toast({
                                          title: 'Succes',
                                          description: 'Redirectarea a fost ștearsă cu succes.',
                                        });
                                      }}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-between gap-2 border-t border-gray-800 pt-4">
                  <Button variant="outline" className="text-white border-gray-600 hover:bg-darkGray">
                    Exportă redirectări
                  </Button>
                  <Button className="bg-primary hover:bg-primary/80">
                    <Save className="w-4 h-4 mr-2" />
                    Salvează toate redirectările
                  </Button>
                </CardFooter>
              </Card>
              
              <Card className="bg-darkBg border-primary/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <AlertOctagon className="w-5 h-5 mr-2" />
                    Pagină 404 Personalizată
                  </CardTitle>
                  <CardDescription>Configurează pagina de eroare 404 cu redirectări automate</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="bg-darkGray/40 rounded-md p-4 border border-gray-700 mb-4">
                    <div className="flex items-center mb-2">
                      <PieChart className="w-4 h-4 text-yellow-500 mr-2" />
                      <h4 className="text-white text-sm font-medium">Sugestii inteligente pentru pagini 404</h4>
                    </div>
                    <p className="text-xs text-gray-300">
                      Sistemul poate sugera vizitatorilor pagini similare atunci când aceștia ajung la o pagină inexistentă, 
                      bazându-se pe calea URL și potrivirea de cuvinte cheie.
                    </p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enable404tracking" 
                        checked={custom404.enable404tracking}
                        onCheckedChange={(checked) => handleCustom404Change('enable404tracking', checked)}
                      />
                      <Label htmlFor="enable404tracking" className="text-white">Activează monitorizarea 404</Label>
                    </div>
                    <p className="text-xs text-gray-400 ml-7">Urmărește și înregistrează toate erorile 404 pentru a optimiza redirectările</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch 
                        id="enable404suggestions" 
                        checked={custom404.enable404suggestions}
                        onCheckedChange={(checked) => handleCustom404Change('enable404suggestions', checked)}
                      />
                      <Label htmlFor="enable404suggestions" className="text-white">Activează sugestii automate</Label>
                    </div>
                    <p className="text-xs text-gray-400 ml-7">Oferă sugestii de pagini similare pentru vizitatori</p>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="errorPageMessage" className="text-white">Mesaj personalizat pentru pagina 404</Label>
                    <Textarea 
                      id="errorPageMessage" 
                      placeholder="Oops! Pagina pe care o cauți nu există. Iată câteva pagini care te-ar putea interesa..."
                      value={custom404.errorPageMessage}
                      onChange={(e) => handleCustom404Change('errorPageMessage', e.target.value)}
                      className="border-primary/20 bg-darkGray/60 text-white focus:border-primary min-h-[80px]"
                    />
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="errorReturnLink" className="text-white">Link principal de redirecționare</Label>
                      <Input 
                        id="errorReturnLink" 
                        placeholder="/" 
                        value={custom404.errorReturnLink}
                        onChange={(e) => handleCustom404Change('errorReturnLink', e.target.value)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                      />
                      <p className="text-xs text-gray-400">De obicei pagina principală sau harta site-ului</p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="errorMaxSuggestions" className="text-white">Număr maxim de sugestii</Label>
                      <Input 
                        id="errorMaxSuggestions" 
                        placeholder="3" 
                        type="number"
                        value={custom404.errorMaxSuggestions.toString()}
                        onChange={(e) => handleCustom404Change('errorMaxSuggestions', parseInt(e.target.value) || 3)}
                        className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                      />
                      <p className="text-xs text-gray-400">Numărul maxim de pagini similare sugerate</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="errorImage" className="text-white flex items-center">
                      <Image size={16} className="w-4 h-4 mr-2" /> Imagine personalizată pentru pagina 404
                    </Label>
                    <div className="grid md:grid-cols-12 gap-2">
                      <div className="md:col-span-10">
                        <Input 
                          id="errorImage" 
                          placeholder="URL imagine (ex: /images/404.svg)" 
                          value={custom404.errorImage}
                          onChange={(e) => handleCustom404Change('errorImage', e.target.value)}
                          className="border-primary/20 bg-darkGray/60 text-white focus:border-primary"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label htmlFor="image-upload" className="w-full">
                          <Button
                            variant="outline"
                            className="w-full text-white border-gray-600 hover:bg-darkGray"
                            onClick={() => {
                              // Verificăm dacă există un input pentru încărcare, dacă nu, creăm unul
                              const input = document.getElementById('image-upload');
                              if (input) {
                                (input as HTMLInputElement).click();
                              }
                            }}
                          >
                            <Upload className="w-4 h-4 mr-2" /> Încarcă
                          </Button>
                        </label>
                        <input 
                          type="file" 
                          id="image-upload" 
                          accept="image/*" 
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const tempUrl = URL.createObjectURL(file);
                              handleCustom404Change('errorImage', tempUrl);
                              toast({
                                title: 'Imagine încărcată',
                                description: 'Imaginea a fost încărcată cu succes. Nu uita să salvezi schimbările!',
                                variant: 'default',
                              });
                            }
                          }} 
                        />
                      </div>
                    </div>
                    <p className="text-xs text-gray-400">Imagine personalizată pentru pagina de eroare 404 (recomandă format SVG sau PNG transparent)</p>
                    
                    {custom404.errorImage && (
                      <div className="mt-4 p-4 border border-dashed border-primary/30 rounded-md">
                        <p className="text-xs text-white mb-2">Previzualizare imagine:</p>
                        <div className="flex justify-center">
                          <img 
                            src={custom404.errorImage} 
                            alt="Previzualizare imagine 404" 
                            className="max-h-60 object-contain rounded" 
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter className="justify-end gap-2 border-t border-gray-800 pt-4">
                  <Button 
                    variant="outline" 
                    disabled={loading} 
                    className="text-white border-gray-600 hover:bg-darkGray"
                    onClick={() => {
                      toast({
                        title: 'Previzualizare pagină 404',
                        description: 'Previzualizarea paginii 404 va fi deschisă într-o fereastră nouă',
                      });
                      // Am putea deschide o previzualizare a paginii 404 aici
                    }}
                  >
                    <Eye className="w-4 h-4 mr-2" /> Previzualizare
                  </Button>
                  <Button 
                    disabled={loading} 
                    className="bg-primary hover:bg-primary/80"
                    onClick={() => {
                      toast({
                        title: 'Setări salvate',
                        description: 'Setările paginii 404 au fost salvate cu succes',
                        variant: 'default',
                      });
                    }}
                  >
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