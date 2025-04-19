import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { Helmet } from "react-helmet";
import { useEffect } from "react";

export default function MefPage() {
  const [_, setLocation] = useLocation();
  
  useEffect(() => {
    // Încarcă scriptul Tenor când componenta este montată
    const script = document.createElement('script');
    script.src = 'https://tenor.com/embed.js';
    script.async = true;
    document.body.appendChild(script);
    
    return () => {
      // Curățare la demontare
      document.body.removeChild(script);
    };
  }, []);

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
            <div className="w-full md:w-1/2 rounded-lg overflow-hidden border border-primary/30 bg-black/70">
              <div 
                dangerouslySetInnerHTML={{ 
                  __html: `<div class="tenor-gif-embed p-2" data-postid="16947551" data-share-method="host" data-aspect-ratio="1.36752" data-width="100%"><a href="https://tenor.com/view/gerara-give-me-a-favor-get-out-of-here-go-away-mad-gif-16947551">Gerara Give Me A Favor GIF</a></div>` 
                }} 
              />
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