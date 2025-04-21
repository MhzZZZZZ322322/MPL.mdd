import React from 'react';
import { useLanguage } from '@/lib/LanguageContext';
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Globe } from 'lucide-react';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="icon" 
          className="h-8 w-8 md:h-10 md:w-14 md:px-3 relative overflow-hidden group"
        >
          <Globe className="h-4 w-4 md:absolute md:left-3 transition-transform group-hover:scale-110" />
          <span className="hidden md:inline md:ml-4 font-medium">{language.toUpperCase()}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[100px]">
        <DropdownMenuItem
          onClick={() => setLanguage('ro')}
          className={language === 'ro' ? 'bg-primary/10 font-medium' : ''}
        >
          {t('language.ro')}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => setLanguage('ru')}
          className={language === 'ru' ? 'bg-primary/10 font-medium' : ''}
        >
          {t('language.ru')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const SimpleLanguageSwitcher: React.FC = () => {
  const { toggleLanguage, language } = useLanguage();

  return (
    <Button 
      variant="outline" 
      size="sm" 
      className="h-8 px-3 rounded-full" 
      onClick={toggleLanguage}
    >
      {language === 'ro' ? 'RU' : 'RO'}
    </Button>
  );
};