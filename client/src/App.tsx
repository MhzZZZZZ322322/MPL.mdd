import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EventDetails from "@/pages/EventDetails";
import Admin from "@/pages/Admin";
import ContentEditor from "@/pages/ContentEditor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import AllEvents from "@/pages/AllEvents";
import AllRankings from "@/pages/AllRankings";
import CommunityPage from "@/pages/CommunityPage";
import ComingSoon from "@/pages/ComingSoon";
import MPLPilotCup from "@/pages/EventPages/MPLPilotCup";
import HatorCSLeague from "@/pages/EventPages/HatorCSLeague";
import HatorCupROPLxMPL from "@/pages/EventPages/HatorCupROPLxMPL";
import KingstonHyperXSupercup from "@/pages/EventPages/KingstonHyperXSupercup";
import MefPage from "@/pages/MefPage";
import V0R4yn from "@/pages/Var4un";
import TeamRegistration from "@/pages/TeamRegistration";
import { LanguageProvider } from "@/lib/LanguageContext";

// Importăm paginile de administrare
import EventManager from "@/pages/EventManager";
import SeoManager from "@/pages/SeoManager";
import TournamentAdmin from "@/pages/TournamentAdminFixed";
import AdminBlog from "@/pages/AdminBlog";
import AdminProtectedRoute from "@/components/AdminProtectedRoute";
import { useState, useEffect } from "react";
import BlogPage from "@/pages/BlogPage";
import BlogArticlePage from "@/pages/BlogArticlePage";
import NewsPage from "@/pages/NewsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/event/:id" component={EventDetails} />
      <Route path="/events" component={AllEvents} />
      <Route path="/events/mpl-pilot-cup" component={MPLPilotCup} />
      <Route path="/events/hator-cs-league" component={HatorCSLeague} />
      <Route path="/events/hator-cup-ropl-mpl" component={HatorCupROPLxMPL} />
      <Route path="/events/kingston-hyperx-supercup" component={KingstonHyperXSupercup} />
      <Route path="/register-team" component={TeamRegistration} />
      <Route path="/rankings" component={AllRankings} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/mef" component={MefPage} />
      <Route path="/v0r4yn" component={V0R4yn} />
      <Route path="/var4un" component={V0R4yn} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/content" component={ContentEditor} />
      <Route path="/admin/events" component={EventManager} />
      <Route path="/admin/blog" component={AdminBlog} />
      <Route path="/admin/seo" component={SeoManager} />
      <Route path="/admin/tournament" component={() => (
        <AdminProtectedRoute>
          <TournamentAdmin />
        </AdminProtectedRoute>
      )} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogArticlePage} />
      <Route path="/stiri" component={NewsPage} />
      <Route path="/cronologia-mpl" component={() => {
        window.location.replace('/');
        return null;
      }} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Pentru a verifica dacă suntem pe o pagină de admin
  const isAdminPage = () => {
    return window.location.pathname.startsWith('/admin');
  };
  
  // State pentru pagina Coming Soon - setat la false pentru a fi dezactivat
  const [comingSoonEnabled, setComingSoonEnabled] = useState(false);
  
  // Preluăm starea din localStorage - am dezactivat comportamentul fiind întotdeauna false
  useEffect(() => {
    // Setăm explicit Coming Soon la false în localStorage
    localStorage.setItem('comingSoonEnabled', 'false');
  }, []);
  
  // Adăugăm o metodă de acces la pagina de admin prin tastarea secvenței 'mpl'
  // Removed admin keyboard shortcut per user request
  
  // Actualizăm atributul lang al HTML pe baza schimbărilor de rută
  useEffect(() => {
    // Adăugăm funcționalitate pentru a actualiza tag-urile hreflang în funcție de rută
    const updateHreflangLinks = () => {
      const path = window.location.pathname;
      const isRussian = path.startsWith('/ru');
      
      // Actualizăm atributul hreflang pentru paginile în rusă
      document.querySelectorAll('link[rel="alternate"][hreflang]').forEach(el => {
        const hreflangEl = el as HTMLLinkElement;
        if (hreflangEl.hreflang === 'ro-MD') {
          hreflangEl.href = 'http://mpl.md/';
        } else if (hreflangEl.hreflang === 'ru-RU') {
          hreflangEl.href = 'http://mpl.md/ru';
        }
      });
    };
    
    updateHreflangLinks();
    
    // Adăugăm listener pentru schimbările de rută
    const handleRouteChange = () => {
      updateHreflangLinks();
    };
    
    window.addEventListener('popstate', handleRouteChange);
    
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);
  
  return (
    <LanguageProvider>
      <div className="flex flex-col min-h-screen overflow-hidden bg-black">
        {/* Afișăm pagina Coming Soon peste conținut */}
        <ComingSoon enabled={comingSoonEnabled} />
        
        {/* Nu afișăm navbar și footer când Coming Soon este activ */}
        {!isAdminPage() && !comingSoonEnabled && <Navbar />}
        <main className="flex-grow overflow-hidden bg-black">
          <Router />
        </main>
        {!isAdminPage() && !comingSoonEnabled && <Footer />}
        <Toaster />
      </div>
    </LanguageProvider>
  );
}

export default App;
