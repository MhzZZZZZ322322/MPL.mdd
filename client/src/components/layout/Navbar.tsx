import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import Glitch from "@/components/animations/Glitch";
import mplLogo from "@/assets/mpl-logo.png";

interface NavItem {
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Acasă", href: "/" },
  { label: "Despre noi", href: "#about" },
  { label: "Evenimente", href: "#events" },
  { label: "Clasamente", href: "#rankings" },
  { label: "Parteneriate", href: "#partners" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    } else {
      // Handle regular links
      setLocation(href);
    }
  };

  return (
    <header className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
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
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavLinkClick(item.href)}
              className="hover:text-secondary transition-colors"
            >
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            className="block md:hidden text-white hover:text-secondary"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <Button 
            onClick={() => handleNavLinkClick('#contact')}
            className="hidden md:flex bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded text-sm font-medium transition-all hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          >
            Alătură-te
          </Button>
        </div>
      </nav>
      
      {/* Mobile Menu */}
      <div className={cn(
        "md:hidden bg-black absolute top-full left-0 w-full border-b border-primary/30 transition-all duration-300 shadow-lg",
        mobileMenuOpen ? "block" : "hidden"
      )}>
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => handleNavLinkClick(item.href)}
              className="py-2 hover:text-secondary transition-colors border-b border-gray-700/50"
            >
              {item.label}
            </button>
          ))}
          <Button 
            onClick={() => handleNavLinkClick('#contact')}
            className="w-full bg-primary hover:bg-primary/80 text-white px-4 py-2 rounded text-center font-medium transition-all hover:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
          >
            Alătură-te
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
