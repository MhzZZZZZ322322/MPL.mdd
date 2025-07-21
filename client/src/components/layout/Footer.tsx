import { Link } from "wouter";
import { cn } from "@/lib/utils";
import { FaYoutube, FaDiscord, FaTwitch, FaTiktok } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/LanguageContext";

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
  const { t } = useLanguage();
  
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
            <p className="text-sm mb-6">
              {t('footer.description')}
            </p>
            <div className="flex items-center mb-4">
              <div className="flex space-x-4 mr-4">
                <SocialIcon href="https://www.twitch.tv/MoldovaProLeague" target="_blank" rel="noopener noreferrer" icon={FaTwitch} />
                <SocialIcon href="https://www.youtube.com/@MoldovaProLeague" target="_blank" rel="noopener noreferrer" icon={FaYoutube} />
                <SocialIcon href="https://discord.gg/Ek4qvWE5qB" target="_blank" rel="noopener noreferrer" icon={FaDiscord} />
                <SocialIcon href="https://www.tiktok.com/@moldova.pro.league" target="_blank" rel="noopener noreferrer" icon={FaTiktok} />
              </div>
              <Button 
                onClick={() => window.location.href = "/mef"}
                variant="ghost" 
                className="bg-primary/10 hover:bg-primary/20 text-primary rounded-full px-4 py-2 text-sm font-bold flex items-center gap-1"
              >
                MEF <span className="text-lg">💩</span>
              </Button>
              <Button 
                onClick={() => window.location.href = "/var4un"}
                variant="ghost" 
                className="bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-full px-3 py-2 text-xl ml-2"
              >
                👴
              </Button>
            </div>
          </div>
          
          {/* Quick Links */}
          <FooterSection title={t('footer.quick.links')}>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/">{t('footer.home')}</FooterLink>
              <FooterLink href="#about">{t('footer.about')}</FooterLink>
              <FooterLink href="/cronologia-mpl">{t('footer.timeline')}</FooterLink>
              <FooterLink href="#events">{t('footer.events')}</FooterLink>
              <FooterLink href="#partners">{t('footer.partners')}</FooterLink>
              <FooterLink href="#faq">{t('footer.faq')}</FooterLink>
              <FooterLink href="#contact">{t('footer.contact')}</FooterLink>
            </ul>
          </FooterSection>
          
          {/* Tournaments */}
          <FooterSection title={t('footer.tournaments')}>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/events/mpl-pilot-cup">CS2</FooterLink>
              <li className="text-xs text-gray-500 mt-3 mb-1">{t('footer.tournaments.future')}</li>
              <li className="text-sm text-gray-400">Dota 2</li>
              <li className="text-sm text-gray-400">PUBG</li>
              <li className="text-sm text-gray-400">League of Legends</li>
              <li className="text-sm text-gray-400">Valorant</li>
              <li className="text-sm text-gray-400">Mobile Legends</li>
            </ul>
          </FooterSection>
          
          {/* Contact */}
          <FooterSection title={t('footer.contact')}>
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
                <a href="https://www.tiktok.com/@moldova.pro.league" target="_blank" rel="noopener noreferrer" className="hover:text-secondary transition-colors">
                  TikTok
                </a>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mt-1 mr-2">📧</span>
                <a href="mailto:proleaguemoldova@gmail.com" className="hover:text-secondary transition-colors">
                  proleaguemoldova@gmail.com
                </a>
              </li>
              <li className="flex items-start">
                <span className="text-secondary mt-1 mr-2">📍</span>
                <span>{t('footer.location')}</span>
              </li>
            </ul>
          </FooterSection>
        </div>
        
        {/* Footer bottom */}
        <div className="border-t border-primary/20 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-gray-400 mb-4 md:mb-0">{t('footer.copyright')}</p>
          <div className="flex space-x-4 text-sm">
            <a 
              href="/docs/Terms_Privacy_MPL_RO_EN_RU_FINAL.pdf" 
              target="_blank"
              className="text-gray-400 hover:text-secondary transition-colors"
            >
              {t('footer.terms')}
            </a>
            <a 
              href="/docs/Terms_Privacy_MPL_RO_EN_RU_FINAL.pdf#page=6" 
              target="_blank"
              className="text-gray-400 hover:text-secondary transition-colors"
            >
              {t('footer.privacy')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
