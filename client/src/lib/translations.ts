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
  },
  
  // Secțiunea Contact
  "contact.title.first": {
    ro: "Contactează-",
    ru: "Свяжитесь с "
  },
  "contact.title.second": {
    ro: "ne",
    ru: "нами"
  },
  "contact.subtitle": {
    ro: "Ai întrebări sau sugestii? Completează formularul sau alătură-te comunității noastre pe Discord.",
    ru: "У вас есть вопросы или предложения? Заполните форму или присоединитесь к нашему сообществу в Discord."
  },
  "contact.form.title": {
    ro: "Trimite-ne un mesaj",
    ru: "Отправьте нам сообщение"
  },
  "contact.form.name": {
    ro: "Nume",
    ru: "Имя"
  },
  "contact.form.name.placeholder": {
    ro: "Numele tău",
    ru: "Ваше имя"
  },
  "contact.form.email": {
    ro: "Email",
    ru: "Email"
  },
  "contact.form.email.placeholder": {
    ro: "emailul@tau.com",
    ru: "your@email.com"
  },
  "contact.form.subject": {
    ro: "Subiect",
    ru: "Тема"
  },
  "contact.form.subject.general": {
    ro: "Întrebare generală",
    ru: "Общий вопрос"
  },
  "contact.form.subject.tournaments": {
    ro: "Informații turnee",
    ru: "Информация о турнирах"
  },
  "contact.form.subject.partnership": {
    ro: "Parteneriat",
    ru: "Партнерство"
  },
  "contact.form.subject.other": {
    ro: "Altele",
    ru: "Другое"
  },
  "contact.form.message": {
    ro: "Mesaj",
    ru: "Сообщение"
  },
  "contact.form.message.placeholder": {
    ro: "Mesajul tău...",
    ru: "Ваше сообщение..."
  },
  "contact.form.submit": {
    ro: "Trimite mesajul",
    ru: "Отправить сообщение"
  },
  "contact.form.submitting": {
    ro: "Se trimite...",
    ru: "Отправка..."
  },
  "contact.info.title": {
    ro: "Informații de contact",
    ru: "Контактная информация"
  },
  "contact.info.location": {
    ro: "Locație",
    ru: "Местоположение"
  },
  "contact.social.title": {
    ro: "Urmărește-ne",
    ru: "Подписывайтесь на нас"
  },
  "contact.discord.title": {
    ro: "Alătură-te comunității",
    ru: "Присоединяйтесь к сообществу"
  },
  "contact.discord.text": {
    ro: "Fii parte din cea mai mare comunitate de esports din Moldova. Discuții, turnee, evenimente și multe altele.",
    ru: "Станьте частью крупнейшего киберспортивного сообщества Молдовы. Обсуждения, турниры, мероприятия и многое другое."
  },
  "contact.discord.button": {
    ro: "Discord MPL",
    ru: "Discord MPL"
  },
  "contact.validation.name": {
    ro: "Numele trebuie să conțină cel puțin 2 caractere",
    ru: "Имя должно содержать не менее 2 символов"
  },
  "contact.validation.email": {
    ro: "Adresa de email nu este validă",
    ru: "Неверный адрес электронной почты"
  },
  "contact.validation.subject": {
    ro: "Vă rugăm să selectați un subiect",
    ru: "Пожалуйста, выберите тему"
  },
  "contact.validation.message": {
    ro: "Mesajul trebuie să conțină cel puțin 10 caractere",
    ru: "Сообщение должно содержать не менее 10 символов"
  },
  "contact.success.title": {
    ro: "Succes!",
    ru: "Успех!"
  },
  "contact.success.message": {
    ro: "Mesajul a fost trimis cu succes!",
    ru: "Сообщение успешно отправлено!"
  },
  "contact.error.title": {
    ro: "Eroare",
    ru: "Ошибка"
  },
  "contact.error.message": {
    ro: "A apărut o eroare. Încercați din nou mai târziu.",
    ru: "Произошла ошибка. Пожалуйста, повторите попытку позже."
  },
  
  // Footer
  "footer.description": {
    ro: "Moldova Pro League este comunitatea independentă de esports, creată din pasiunea pentru gaming competitiv.",
    ru: "Moldova Pro League - это независимое киберспортивное сообщество, созданное из страсти к соревновательным играм."
  },
  "footer.quick.links": {
    ro: "Links Rapide",
    ru: "Быстрые ссылки"
  },
  "footer.home": {
    ro: "Acasă",
    ru: "Главная"
  },
  "footer.about": {
    ro: "Despre noi",
    ru: "О нас"
  },
  "footer.timeline": {
    ro: "Cronologia MPL",
    ru: "Хронология MPL"
  },
  "footer.events": {
    ro: "Evenimente & Turnee",
    ru: "События & Турниры"
  },
  "footer.partners": {
    ro: "Parteneriate",
    ru: "Партнерства"
  },
  "footer.faq": {
    ro: "FAQ",
    ru: "FAQ"
  },
  "footer.contact": {
    ro: "Contact",
    ru: "Контакты"
  },
  "footer.tournaments": {
    ro: "Turnee",
    ru: "Турниры"
  },
  "footer.tournaments.future": {
    ro: "Pe viitor planificăm și:",
    ru: "В будущем планируем также:"
  },
  "footer.copyright": {
    ro: "© 2025 Moldova Pro League. Toate drepturile rezervate.",
    ru: "© 2025 Moldova Pro League. Все права защищены."
  },
  "footer.terms": {
    ro: "Termeni și condiții",
    ru: "Условия использования"
  },
  "footer.privacy": {
    ro: "Politica de confidențialitate",
    ru: "Политика конфиденциальности"
  },
  "footer.location": {
    ro: "Chișinău, Republica Moldova",
    ru: "Кишинёв, Республика Молдова"
  },
  
  // About section
  "about.title": {
    ro: "Despre",
    ru: "О нас"
  },
  "about.mpl": {
    ro: "Moldova Pro League",
    ru: "Moldova Pro League"
  },
  "about.story.title": {
    ro: "Povestea noastră",
    ru: "Наша история"
  },
  "about.story.p1": {
    ro: "MPL (Moldova Pro League) este o comunitate independentă, născută din pasiune pură pentru gaming și dorința de a construi un ecosistem de cybersport autentic în Republica Moldova.",
    ru: "MPL (Moldova Pro League) - это независимое сообщество, рожденное из чистой страсти к играм и желания построить подлинную киберспортивную экосистему в Республике Молдова."
  },
  "about.story.p2": {
    ro: "Suntem o organizație fără bugete, fără sponsori și fără promisiuni goale – dar cu o echipă de oameni dedicați care cred că e-sportul merită un loc de cinste și recunoaștere în Moldova. Tot ce am făcut până acum – am făcut din proprie inițiativă, în timpul nostru liber, cu resurse minime, dar cu un scop clar: să aducem jucătorii împreună și să punem Moldova pe harta internațională a e-sportului.",
    ru: "Мы организация без бюджетов, без спонсоров и без пустых обещаний – но с командой преданных людей, которые верят, что киберспорт заслуживает почетного места и признания в Молдове. Всё, что мы сделали до сих пор – мы сделали по собственной инициативе, в свободное время, с минимальными ресурсами, но с ясной целью: объединить игроков и поставить Молдову на международную карту киберспорта."
  },
  "about.story.p3": {
    ro: "Organizăm turnee, ligă proprie și evenimente online, susținem creatorii locali și ne implicăm activ în creșterea comunității – de la casual players la profesioniști. MPL nu este doar despre competiție. Este despre comunitate, prietenie și oportunități reale.",
    ru: "Мы организуем турниры, собственную лигу и онлайн-мероприятия, поддерживаем местных создателей контента и активно участвуем в росте сообщества – от обычных игроков до профессионалов. MPL – это не только соревнования. Это сообщество, дружба и реальные возможности."
  },
  "about.story.p4": {
    ro: "Dacă și tu visezi la o Moldovă unde gamingul este luat în serios – alătură-te nouă. MPL e deschisă tuturor: jucători, streameri, voluntari, sau pur și simplu fani ai e-sportului. Împreună putem construi ceva măreț. Chiar de la zero.",
    ru: "Если вы тоже мечтаете о Молдове, где киберспорт воспринимают серьезно – присоединяйтесь к нам. MPL открыта для всех: игроков, стримеров, волонтеров или просто поклонников киберспорта. Вместе мы можем построить что-то великое. Даже с нуля."
  },
  "about.timeline": {
    ro: "Cronologia MPL",
    ru: "Хронология MPL"
  },
  "about.timeline.event1.date": {
    ro: "22-23 Martie 2025",
    ru: "22-23 марта 2025"
  },
  "about.timeline.event1.title": {
    ro: "MPL Pilot Cup",
    ru: "MPL Pilot Cup"
  },
  "about.timeline.event1.description": {
    ro: "Turneul inaugural dedicat jucătorilor din Moldova și România cu susținerea oferită de Darwin și HATOR.",
    ru: "Инаугурационный турнир, посвященный игрокам из Молдовы и Румынии при поддержке Darwin и HATOR."
  },
  "about.timeline.event2.date": {
    ro: "Mai-Iunie 2025",
    ru: "Май-Июнь 2025"
  },
  "about.timeline.event2.title": {
    ro: "HATOR CS2 LEAGUE MOLDOVA",
    ru: "HATOR CS2 LEAGUE MOLDOVA"
  },
  "about.timeline.event2.description": {
    ro: "Un turneu major sponsorizat de HATOR cu premii substanțiale, marcând un moment cheie pentru scena competitivă din Moldova.",
    ru: "Крупный турнир, спонсируемый HATOR с существенными призами, знаменующий ключевой момент для соревновательной сцены Молдовы."
  },
  "about.mission": {
    ro: "Misiunea noastră",
    ru: "Наша миссия"
  },
  "about.mission1.title": {
    ro: "Dezvoltare",
    ru: "Развитие"
  },
  "about.mission1.description": {
    ro: "Să creăm o scenă esports vibrantă și recunoscută în Republica Moldova.",
    ru: "Создать яркую и признанную киберспортивную сцену в Республике Молдова."
  },
  "about.mission2.title": {
    ro: "Comunitate",
    ru: "Сообщество"
  },
  "about.mission2.description": {
    ro: "Să construim un spațiu inclusiv pentru gameri de toate nivelurile.",
    ru: "Построить инклюзивное пространство для геймеров всех уровней."
  },
  "about.mission3.title": {
    ro: "Excelență",
    ru: "Совершенство"
  },
  "about.mission3.description": {
    ro: "Să promovăm competiția de calitate și fair-play în mediul digital.",
    ru: "Продвигать качественные соревнования и честную игру в цифровой среде."
  },
  "about.event.details": {
    ro: "Detalii eveniment",
    ru: "Детали события"
  },
  "about.join.community": {
    ro: "Alătură-te comunității",
    ru: "Присоединяйтесь к сообществу"
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