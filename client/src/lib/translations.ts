// Tipurile pentru traduceri
export type Language = 'ro' | 'ru';

export interface TranslationDictionary {
  [key: string]: {
    ro: string;
    ru: string;
  };
}

// Traducerile pentru întreaga aplicație
export const translations: TranslationDictionary = {
  // Texte generale
  "app.title": {
    ro: "Moldova Pro League",
    ru: "Moldova Pro League"
  },
  
  // Navigare
  "nav.home": {
    ro: "Acasă",
    ru: "Главная"
  },
  "nav.about": {
    ro: "Despre",
    ru: "О нас"
  },
  "nav.events": {
    ro: "Evenimente",
    ru: "События"
  },
  "nav.cs2": {
    ro: "CS2",
    ru: "CS2"
  },
  "nav.rankings": {
    ro: "Clasamente",
    ru: "Рейтинги"
  },
  "nav.partners": {
    ro: "Parteneri",
    ru: "Партнеры"
  },
  "nav.faq": {
    ro: "FAQ",
    ru: "FAQ"
  },
  "nav.contact": {
    ro: "Contact",
    ru: "Контакты"
  },
  
  // CS2 Server Status
  "servers.title": {
    ro: "Serverele Noastre CS2",
    ru: "Наши CS2 серверы"
  },
  "servers.online": {
    ro: "Online",
    ru: "Онлайн"
  },
  "servers.offline": {
    ro: "Offline",
    ru: "Офлайн"
  },
  "servers.ping": {
    ro: "Ping-ul tău la server",
    ru: "Ваш пинг до сервера"
  },
  "servers.copy": {
    ro: "Copiază comanda de conectare",
    ru: "Копировать команду подключения"
  },
  "servers.copy.success": {
    ro: "Conectarea a fost copiată în clipboard",
    ru: "Команда подключения скопирована в буфер обмена"
  },
  "servers.thanks.start": {
    ro: "Mulțumește lui ",
    ru: "Поблагодарите "
  },
  "servers.thanks.end": {
    ro: " pentru toate serverele – cu un Follow, Like și Share pe TikTok. E Gratis!",
    ru: " за все серверы – Follow, Like и Share в TikTok. Это бесплатно!"
  },
  
  // Ping Info Dialog
  "ping.dialog.title": {
    ro: "Cum calculăm ping-ul",
    ru: "Как мы измеряем пинг"
  },
  "ping.what.title": {
    ro: "Ce este ping-ul?",
    ru: "Что такое пинг?"
  },
  "ping.what.description": {
    ro: "Ping-ul arată cât de rapid comunică dispozitivul tău cu serverul jocului. Cu cât valoarea este mai mică, cu atât conexiunea este mai bună și jocul mai fluid.",
    ru: "Пинг показывает, насколько быстро ваше устройство связывается с игровым сервером. Чем ниже значение, тем лучше соединение и плавнее игра."
  },
  "ping.how.title": {
    ro: "Cum măsurăm ping-ul?",
    ru: "Как мы измеряем пинг?"
  },
  "ping.how.description.1": {
    ro: "În aplicația noastră, folosim o metodă web care măsoară timpul de răspuns trimițând o cerere către server sub forma unei imagini invizibile. Deși serverul nu returnează imaginea, browserul încearcă să o încarce, iar timpul până la eroare ne oferă o estimare a ping-ului.",
    ru: "В нашем приложении мы используем веб-метод, который измеряет время отклика, отправляя запрос на сервер в форме невидимого изображения. Хотя сервер не возвращает изображение, браузер пытается его загрузить, и время до ошибки дает нам оценку пинга."
  },
  "ping.how.description.2": {
    ro: "Această valoare este aproximativă. În joc, ping-ul real poate fi mai mic sau mai mare, fiind influențat de protocolul folosit (UDP vs HTTP) și de condițiile rețelei tale (VPN, proxy, WiFi etc.).",
    ru: "Это значение приблизительно. В игре реальный пинг может быть ниже или выше, на него влияет используемый протокол (UDP vs HTTP) и условия вашей сети (VPN, прокси, WiFi и т.д.)."
  },
  "ping.values.title": {
    ro: "Ce înseamnă valorile ping:",
    ru: "Что означают значения пинга:"
  },
  "ping.values.excellent": {
    ro: "Sub 10ms: Excelent - joc competitiv optim",
    ru: "Менее 10мс: Отлично - оптимально для соревновательной игры"
  },
  "ping.values.very.good": {
    ro: "10-20ms: Foarte bun - fără probleme",
    ru: "10-20мс: Очень хорошо - без проблем"
  },
  "ping.values.good": {
    ro: "20-50ms: Bun - experiență plăcută",
    ru: "20-50мс: Хорошо - приятный игровой опыт"
  },
  "ping.values.acceptable": {
    ro: "50-100ms: Acceptabil - ușoară întârziere",
    ru: "50-100мс: Приемлемо - небольшая задержка"
  },
  "ping.values.problematic": {
    ro: "Peste 100ms: Problematic - joc dificil",
    ru: "Более 100мс: Проблематично - сложно играть"
  },
  
  // Language Switch
  "language.ro": {
    ro: "RO",
    ru: "RO"
  },
  "language.ru": {
    ro: "RU",
    ru: "RU"
  },
  "language.switch": {
    ro: "Schimbă limba",
    ru: "Изменить язык"
  },
  
  // Butoane
  "button.join": {
    ro: "Alătură-te",
    ru: "Присоединяйся"
  },
  
  // Alte secțiuni
  "games": {
    ro: "Jocuri",
    ru: "Игры"
  },
  "coming.soon": {
    ro: "În curând",
    ru: "Скоро"
  },
  
  // Erori
  "errors.loading": {
    ro: "Eroare la încărcarea datelor. Te rugăm să reîmprospătezi pagina.",
    ru: "Ошибка при загрузке данных. Пожалуйста, обновите страницу."
  },
  
  // Secțiunea FAQ
  "faq.title.first": {
    ro: "Întrebări",
    ru: "Часто задаваемые"
  },
  "faq.title.second": {
    ro: "Frecvente",
    ru: "вопросы"
  },
  "faq.subtitle": {
    ro: "Află răspunsurile la cele mai comune întrebări despre Moldova Pro League.",
    ru: "Узнайте ответы на самые распространенные вопросы о Moldova Pro League."
  },
  "faq.no.questions": {
    ro: "Nu există întrebări disponibile",
    ru: "Нет доступных вопросов"
  },
  
  // Secțiunea Hero
  "hero.feature1.title": {
    ro: "Turnee Regulate",
    ru: "Регулярные турниры"
  },
  "hero.feature1.text": {
    ro: "Organizăm turnee și competiții pentru jucători de toate nivelurile, în diverse jocuri populare.",
    ru: "Мы организуем турниры и соревнования для игроков всех уровней в различных популярных играх."
  },
  "hero.feature2.title": {
    ro: "Comunitate Unită",
    ru: "Сплоченное сообщество"
  },
  "hero.feature2.text": {
    ro: "O comunitate dedicată pasionaților de gaming competitiv din toată Moldova, cu Discord activ.",
    ru: "Сообщество, посвященное любителям соревновательных игр со всей Молдовы, с активным Discord."
  },
  "hero.feature3.title": {
    ro: "Transmisiuni Live",
    ru: "Прямые трансляции"
  },
  "hero.feature3.text": {
    ro: "Toate evenimentele importante sunt transmise în direct pe platformele noastre Twitch și YouTube.",
    ru: "Все важные события транслируются в прямом эфире на наших платформах Twitch и YouTube."
  },
  
  // HeroSlider
  "hero.slider.title": {
    ro: "HATOR CS2 LEAGUE MOLDOVA",
    ru: "HATOR CS2 LEAGUE MOLDOVA"
  },
  "hero.slider.subtitle": {
    ro: "Sezonul 1 - Mai-Iunie 2025",
    ru: "Сезон 1 - Май-Июнь 2025"
  },
  "hero.slider.button": {
    ro: "Detalii Turneu",
    ru: "Детали Турнира"
  },
  
  // Secțiunea CS Server Status
  "servers.section.title": {
    ro: "Serverele Noastre CS2",
    ru: "Наши CS2 серверы"
  },
  "servers.connect.command": {
    ro: "Comandă de conectare",
    ru: "Команда подключения"
  },
  "servers.none": {
    ro: "Nu există servere disponibile",
    ru: "Серверы не доступны"
  },
  "servers.thanks.message": {
    ro: "Mulțumește lui @faceofmadness pentru toate serverele – cu un Follow, Like și Share pe TikTok. E Gratis!",
    ru: "Поблагодарите @faceofmadness за все серверы – Follow, Like и Share в TikTok. Это бесплатно!"
  }
};

// Funcția pentru a obține traducerea
export function getTranslation(key: string, language: Language): string {
  if (!translations[key]) {
    console.warn(`Missing translation for key: ${key}`);
    return key;
  }
  
  return translations[key][language] || key;
}