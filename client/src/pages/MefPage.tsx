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
        <div className="max-w-3xl w-full bg-darkBg border border-primary/30 rounded-lg p-8 shadow-xl">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">MEF - Gerara Here!</h1>
            <Button 
              variant="outline" 
              className="border-primary text-primary hover:bg-primary/10"
              onClick={() => setLocation("/")}
            >
              Înapoi la site
            </Button>
          </div>
          
          <div className="text-center mb-8">
            <div className="bg-black/50 p-6 rounded-lg border border-primary/30 mb-8">
              <h2 className="text-3xl font-bold text-primary mb-4">GERARA HERE!</h2>
              <p className="text-xl text-gray-300 italic mb-4">
                "Gotta count on someone else man, cuz Gerara here!"
              </p>
              <img 
                src="https://media.tenor.com/6yyJGwJ2U0sAAAAC/macedonian-electronic-force-mef.gif" 
                alt="MEF - Gerara Here" 
                className="mx-auto rounded border border-primary/40 my-6"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h3 className="text-xl font-bold text-primary mb-2">Ce înseamnă MEF?</h3>
                <p className="text-gray-300">
                  MEF (Macedonian Electronic Force) este un meme popular în comunitatea esports din Moldova și România.
                </p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h3 className="text-xl font-bold text-primary mb-2">Istoria MEF</h3>
                <p className="text-gray-300">
                  Meme-ul a devenit viral în comunitatea gamers din Europa de Est și este folosit des în stream-uri și competiții.
                </p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h3 className="text-xl font-bold text-primary mb-2">Expresii celebre</h3>
                <p className="text-gray-300">
                  "Man you gotta count on someone else, cuz, Gerara here!"
                </p>
              </div>
              
              <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                <h3 className="text-xl font-bold text-primary mb-2">Easter Egg</h3>
                <p className="text-gray-300">
                  Acest easter egg este dedicat fanilor esport din comunitatea MPL care înțeleg referința.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-6">
            <Button 
              variant="default"
              className="bg-primary hover:bg-primary/90 px-6 py-2 text-lg"
              onClick={() => setLocation("/")}
            >
              Înapoi la pagina principală
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}