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

// Importăm paginile de administrare
import EventManager from "@/pages/EventManager";
import SeoManager from "@/pages/SeoManager";
import { useState, useEffect } from "react";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/event/:id" component={EventDetails} />
      <Route path="/events" component={AllEvents} />
      <Route path="/rankings" component={AllRankings} />
      <Route path="/community" component={CommunityPage} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/content" component={ContentEditor} />
      <Route path="/admin/events" component={EventManager} />
      <Route path="/admin/seo" component={SeoManager} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Pentru a verifica dacă suntem pe o pagină de admin
  const isAdminPage = () => {
    return window.location.pathname.startsWith('/admin');
  };

  // State pentru pagina Coming Soon
  const [comingSoonEnabled, setComingSoonEnabled] = useState(true);
  
  useEffect(() => {
    // Preluăm starea din localStorage (dacă există)
    const comingSoonState = localStorage.getItem('comingSoonEnabled');
    if (comingSoonState !== null) {
      setComingSoonEnabled(comingSoonState === 'true');
    }
  }, []);
  
  return (
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
  );
}

export default App;
