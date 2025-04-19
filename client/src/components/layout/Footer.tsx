import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { FaTwitter, FaFacebook, FaYoutube, FaDiscord, FaTwitch, FaTiktok } from "react-icons/fa";

const FooterSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div>
    <h4 className="font-rajdhani font-semibold text-lg text-white mb-4">{title}</h4>
    {children}
  </div>
);

const FooterLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <li>
    <a href={href} className="hover:text-secondary transition-colors">
      {children}
    </a>
  </li>
);

interface SocialIconProps {
  href: string;
  icon: React.ElementType;
  target?: string;
  rel?: string;
}

const SocialIcon: React.FC<SocialIconProps> = ({ 
  href, 
  icon: Icon, 
  target, 
  rel 
}) => (
  <a 
    href={href} 
    className="text-gray-400 hover:text-secondary transition-colors"
    target={target}
    rel={rel}
  >
    <Icon size={20} />
  </a>
);

const Footer = () => {
  const handleLinkClick = (href: string, e: React.MouseEvent) => {
    if (href.startsWith('#')) {
      e.preventDefault();
      const element = document.querySelector(href);
      if (element) {
        window.scrollTo({
          top: element.getBoundingClientRect().top + window.scrollY - 80,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <footer className="bg-darkBg border-t border-primary/30 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
          {/* Brand section */}
          <div>
            <div className="mb-4">
              <Link href="/" className="flex items-center">
                <span className="text-2xl font-orbitron font-bold text-white">
                  <span className="text-secondary">M</span>
                  <span className="text-accent">P</span>
                  <span className="text-blue-500">L</span>
                </span>
              </Link>
            </div>
            <p className="text-sm mb-6">
              Moldova Pro League este comunitatea independentă de esports, creată din pasiunea pentru gaming competitiv.
            </p>
            <div className="flex space-x-4">
              <SocialIcon href="https://www.twitch.tv/MoldovaProLeague" target="_blank" rel="noopener noreferrer" icon={FaTwitch} />
              <SocialIcon href="https://www.youtube.com/@MoldovaProLeague" target="_blank" rel="noopener noreferrer" icon={FaYoutube} />
              <SocialIcon href="https://discord.gg/Ek4qvWE5qB" target="_blank" rel="noopener noreferrer" icon={FaDiscord} />
              <SocialIcon href="https://www.tiktok.com/@domnukrot" target="_blank" rel="noopener noreferrer" icon={FaTiktok} />
              <SocialIcon href="#" icon={FaFacebook} />
            </div>
          </div>
          
          {/* Quick Links */}
          <FooterSection title="Links Rapide">
            <ul className="space-y-2 text-sm">
              <FooterLink href="/">Acasă</FooterLink>
              <FooterLink href="#about">Despre noi</FooterLink>
              <FooterLink href="#events">Evenimente & Turnee</FooterLink>
              <FooterLink href="#rankings">Clasamente & Jucători</FooterLink>
              <FooterLink href="#partners">Parteneriate</FooterLink>
              <FooterLink href="#faq">FAQ</FooterLink>
              <FooterLink href="#contact">Contact</FooterLink>
            </ul>
          </FooterSection>
          
          {/* Tournaments */}
          <FooterSection title="Turnee">
            <ul className="space-y-2 text-sm">
              <FooterLink href="#">CS:GO</FooterLink>
              <FooterLink href="#">League of Legends</FooterLink>
              <FooterLink href="#">FIFA</FooterLink>
              <FooterLink href="#">Dota 2</FooterLink>
              <FooterLink href="#">Valorant</FooterLink>
              <FooterLink href="#">Mobile Legends</FooterLink>
            </ul>
          </FooterSection>
          
          {/* Contact */}
          <FooterSection title="Contact">
            <ul className="space-y-2 text-sm">
              <li className="flex items-start">
                <span className="text-secondary mt-1 mr-2"><FaDiscord /></span>
                <a href="https://discord.gg/Ek4qvWE5qB" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  Discord
                </a>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mt-1 mr-2"><FaTwitch /></span>
                <a href="https://www.twitch.tv/MoldovaProLeague" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  Twitch
                </a>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mt-1 mr-2"><FaYoutube /></span>
                <a href="https://www.youtube.com/@MoldovaProLeague" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  YouTube
                </a>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mt-1 mr-2"><FaTiktok /></span>
                <a href="https://www.tiktok.com/@domnukrot" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  TikTok
                </a>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mt-1 mr-2">📧</span>
                <span>proleaguemoldova@gmail.com</span>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mt-1 mr-2">📍</span>
                <span>Chișinău, Republica Moldova</span>
              </li>
            </ul>
          </FooterSection>
        </div>
        
        {/* Footer bottom */}
        <div className="border-t border-primary/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">© 2025 Moldova Pro League. Toate drepturile rezervate.</p>
          <div className="flex space-x-4 text-sm">
            <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Termeni și condiții</a>
            <a href="#" className="text-gray-400 hover:text-secondary transition-colors">Politica de confidențialitate</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
