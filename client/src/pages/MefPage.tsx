import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";

export default function MefPage() {
  const [_, setLocation] = useLocation();

  return (
    <>
      <Helmet>
        <title>MEF - Moldova Pro League</title>
        <meta name="description" content="MEF - Gerara Here!" />
      </Helmet>
      
      <div className="min-h-screen flex flex-col items-center justify-center bg-black p-4">
        <div className="max-w-3xl w-full bg-darkBg border border-primary/30 rounded-lg p-6 shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">MEF - Gerara Here!</h1>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => setLocation("/")}
            >
              Înapoi la site
            </Button>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="w-full md:w-1/2 rounded-lg overflow-hidden border border-primary/30">
              <div className="relative" style={{ paddingBottom: '56.25%', height: 0 }}>
                <iframe
                  src="https://www.youtube.com/embed/iOo4eMHFS5M"
                  title="MEF - Gerara here"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
            
            <div className="w-full md:w-1/2">
              <h2 className="text-xl font-bold text-primary mb-4">Ce înseamnă MEF?</h2>
              <p className="text-gray-300 mb-4">
                MEF (Macedonian Electronic Force) este un meme popular în comunitatea esports din Moldova și România.
              </p>
              <p className="text-gray-300 mb-4">
                "Gotta count on someone else man, cuz Gerara here!"
              </p>
              <p className="text-gray-300 mb-4">
                Acest easter egg este dedicat fanilor esport din comunitatea MPL.
              </p>
              
              <div className="mt-6">
                <Button 
                  variant="default"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => setLocation("/")}
                >
                  Înapoi la pagina principală
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}