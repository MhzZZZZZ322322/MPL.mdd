import { Switch, Route } from "wouter";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import EventDetails from "@/pages/EventDetails";
import Admin from "@/pages/Admin";
import ContentEditor from "@/pages/ContentEditor";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/event/:id" component={EventDetails} />
      <Route path="/admin" component={Admin} />
      <Route path="/admin/content" component={ContentEditor} />
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
