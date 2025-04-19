import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-darkBg text-white px-4">
      <div className="max-w-3xl w-full flex flex-col items-center justify-center gap-6">
        <img 
          src="/404-error.png" 
          alt="Eroare 404 - Moldova Pro League" 
          className="w-full max-w-lg mx-auto"
          width="800"
          height="800"
          loading="eager"
        />
        
        <h1 className="text-3xl sm:text-4xl font-bold text-white text-center mt-4 font-rajdhani">
          Pagină negăsită
        </h1>
        
        <p className="text-lg text-gray-300 text-center max-w-md">
          Ups... ai intrat în respawn. Hai înapoi în lobby și încearcă o altă cale!
        </p>
        
        <div className="flex flex-wrap gap-4 mt-2 justify-center">
          <Link href="/">
            <Button className="flex items-center gap-2 bg-primary hover:bg-primary/90">
              <Home className="h-4 w-4" />
              Pagina principală
            </Button>
          </Link>
          <Button variant="outline" className="flex items-center gap-2" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4" />
            Înapoi
          </Button>
        </div>
      </div>
    </div>
  );
}
