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

// Importăm paginile de administrare
import EventManager from "@/pages/EventManager";

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
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Pentru a verifica dacă suntem pe o pagină de admin
  const isAdminPage = () => {
    return window.location.pathname.startsWith('/admin');
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminPage() && <Navbar />}
      <main className="flex-grow">
        <Router />
      </main>
      {!isAdminPage() && <Footer />}
      <Toaster />
    </div>
  );
}

export default App;
