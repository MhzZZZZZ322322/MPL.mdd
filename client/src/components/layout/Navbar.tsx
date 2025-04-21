import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { ChevronDown, Menu, X, Globe } from "lucide-react";
import { cn } from "@/lib/utils";
import Glitch from "@/components/animations/Glitch";
import mplLogo from "@/assets/mpl-logo.png";
import { useLanguage } from "@/lib/LanguageContext";
import { SimpleLanguageSwitcher } from "@/components/ui/language-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  label: string;
  href: string;
}

// Aceste etichete vor fi traduse la afișare folosind funcția t()
const navItems: NavItem[] = [
  { label: "nav.home", href: "/" },
  { label: "nav.about", href: "/#about" },
  { label: "nav.partners", href: "/#partners" },
  { label: "nav.faq", href: "/#faq" },
  { label: "nav.contact", href: "/#contact" },
];

// Jocurile disponibile și în curând
const currentGames = [
  { name: "CS2", link: "/events/mpl-pilot-cup" },
];

const upcomingGames = [
  { name: "Dota 2", link: "#" },
  { name: "PUBG", link: "#" },
  { name: "League of Legends", link: "#" },
  { name: "Valorant", link: "#" },
  { name: "Mobile Legends", link: "#" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();
  const { t } = useLanguage();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Disable scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    // Cleanup function to ensure we don't leave the body with overflow: hidden
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const handleNavLinkClick = (href: string) => {
    setMobileMenuOpen(false);
    
    if (href.startsWith('#')) {
      // Handle anchor links
      const element = document.querySelector(href);
      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    } else if (href.startsWith('/#')) {
      // Handle anchor links on homepage
      setLocation('/');
      setTimeout(() => {
        const anchorId = href.substring(2); // Remove the '/#' to get the ID
        const element = document.getElementById(anchorId);
        if (element) {
          window.scrollTo({
            top: element.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      }, 100); // Small delay to ensure page navigation completes
    } else {
      // Handle regular links
      setLocation(href);
    }
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 overflow-hidden",
      scrolled ? "bg-black border-b border-primary/30" : "bg-black"
    )}>
      <nav className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center group" onClick={() => setMobileMenuOpen(false)}>
          <div className="h-10 flex items-center">
            <img src={mplLogo} alt="MPL Logo" className="h-8 w-auto" />
          </div>
          <span className="ml-2 hidden md:block text-sm font-medium">Moldova Pro League</span>
        </Link>
        
        <div className="hidden md:flex space-x-6 text-sm">
          {/* Jocuri Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center hover:text-secondary transition-colors">
                {t('games')} <ChevronDown className="ml-1 h-3 w-3" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="bg-black/90 border border-primary/30 text-white">
              {currentGames.map((game) => (
                <DropdownMenuItem key={game.name} className="hover:bg-primary/20">
                  <Link href={game.link} className="w-full">{game.name}</Link>
                </DropdownMenuItem>
              ))}
              {upcomingGames.length > 0 && (
                <>
                  <DropdownMenuSeparator className="bg-gray-700/50" />
                  <div className="px-2 py-1 text-xs text-gray-400">{t('coming.soon')}</div>
                  {upcomingGames.map((game) => (
                    <DropdownMenuItem key={game.name} className="text-gray-400 cursor-not-allowed">
                      {game.name}
                    </DropdownMenuItem>
                  ))}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavLinkClick(item.href)}
              className="hover:text-secondary transition-colors"
            >
              {t(item.label)}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <SimpleLanguageSwitcher />
          
          <button 
            className="block md:hidden text-white hover:text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Button 
            onClick={() => handleNavLinkClick('/#contact')}
            className="hidden md:flex bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded text-sm font-medium transition-all hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          >
            {t('button.join')}
          </Button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-black fixed top-[72px] left-0 w-full h-[calc(100vh-72px)] overflow-auto border-b border-primary/30 transition-all duration-300 shadow-lg",
        mobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="container mx-auto px-4 py-6 flex flex-col space-y-5">
          {/* Jocuri section */}
          <div className="py-3 text-lg font-medium hover:text-secondary border-b border-gray-800">
            <p className="mb-2">{t('games')}</p>
            <div className="ml-4 mt-3 space-y-2">
              {currentGames.map(game => (
                <Link key={game.name} href={game.link} className="block py-2 text-base">
                  {game.name}
                </Link>
              ))}
              
              {upcomingGames.length > 0 && (
                <>
                  <p className="text-sm text-gray-500 mt-3 mb-1">{t('coming.soon')}</p>
                  {upcomingGames.map(game => (
                    <p key={game.name} className="block py-1 text-sm text-gray-400">
                      {game.name}
                    </p>
                  ))}
                </>
              )}
            </div>
          </div>
          
          {/* Regular links */}
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavLinkClick(item.href)}
              className="py-3 text-lg font-medium hover:text-secondary transition-colors border-b border-gray-800"
            >
              {t(item.label)}
            </button>
          ))}
          <Button 
            onClick={() => handleNavLinkClick('/#contact')}
            className="w-full mt-4 bg-primary hover:bg-primary/80 text-white px-4 py-3 rounded text-center font-medium transition-all hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          >
            {t('button.join')}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
