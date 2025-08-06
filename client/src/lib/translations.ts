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
  
  // Team member positions
  "team.position.main": {
    ro: "PRINCIPAL",
    ru: "ОСНОВНОЙ"
  },
  "team.position.reserve": {
    ro: "REZERVĂ",
    ru: "ЗАПАСНОЙ"
  },
  "team.role.captain": {
    ro: "CĂPITAN",
    ru: "КАПИТАН"
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
    ro: "🔥 HATOR CUP - ROPL x MPL 🔥",
    ru: "🔥 HATOR CUP - ROPL x MPL 🔥"
  },
  "hero.slider.subtitle": {
    ro: "23-24 August 2025 • 5500 RON Prize Pool",
    ru: "23-24 Август 2025 • 5500 RON Prize Pool"
  },
  "hero.slider.button": {
    ro: "Înscrie Echipa",
    ru: "Записать Команду"
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

  // Butoane pentru evenimente și echipe
  "teams.profile.button": {
    ro: "Profilul echipelor",
    ru: "Профили команд"
  },
  "tournament.groups.button": {
    ro: "Grupe Turneu Stage 1",
    ru: "Группы турнира Stage 1"
  },
  "tournament.matches.button": {
    ro: "Vezi Meciurile",
    ru: "Смотреть матчи"
  },
  "event.read.more": {
    ro: "Vezi mai mult",
    ru: "Читать далее"
  },
  "event.read.less": {
    ro: "Vezi mai puțin",
    ru: "Читать меньше"
  },

  // Tournament Groups
  "tournament.groups.title": {
    ro: "Grupe Turneu",
    ru: "Турнирные группы"
  },

  "tournament.groups.standings": {
    ro: "Clasament",
    ru: "Таблица"
  },
  "tournament.groups.legend.advance": {
    ro: "Calificare directă",
    ru: "Прямое прохождение"
  },
  "tournament.groups.legend.playoffs": {
    ro: "Playoff",
    ru: "Плей-офф"
  },
  "tournament.groups.legend.eliminated": {
    ro: "Eliminare",
    ru: "Исключение"
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
  },
  
  // Partners section
  "partners.title.first": {
    ro: "Parteneriate &",
    ru: "Партнерства и"
  },
  "partners.title.second": {
    ro: "Sponsori",
    ru: "Спонсоры"
  },
  "partners.subtitle": {
    ro: "Devino parte din comunitatea MPL și contribuie la creșterea scenei esports din Moldova.",
    ru: "Станьте частью сообщества MPL и внесите свой вклад в развитие киберспортивной сцены в Молдове."
  },
  "partners.grow.title": {
    ro: "Hai să creștem",
    ru: "Давайте расти"
  },
  "partners.grow.together": {
    ro: "împreună",
    ru: "вместе"
  },
  "partners.description.1": {
    ro: "Suntem deschisi la parteneriate cu branduri și companii care doresc să contribuie la dezvoltarea esports-ului în Moldova.",
    ru: "Мы открыты для партнерства с брендами и компаниями, которые хотят внести свой вклад в развитие киберспорта в Молдове."
  },
  "partners.description.2": {
    ro: "Ca sponsor al MPL, obții vizibilitate în fața unei audiențe tinere, pasionate și în continuă creștere.",
    ru: "Как спонсор MPL, вы получаете видимость перед молодой, увлеченной и растущей аудиторией."
  },
  "partners.benefit.1": {
    ro: "Branding la evenimente și turnee",
    ru: "Брендинг на мероприятиях и турнирах"
  },
  "partners.benefit.2": {
    ro: "Prezență pe platformele social media",
    ru: "Присутствие на платформах социальных сетей"
  },
  "partners.benefit.3": {
    ro: "Integrare în transmisiuni live",
    ru: "Интеграция в прямые трансляции"
  },
  "partners.benefit.4": {
    ro: "Acțiuni promoționale targetate",
    ru: "Целевые рекламные акции"
  },
  "partners.contact.button": {
    ro: "Contactează-ne",
    ru: "Свяжитесь с нами"
  },
  "partners.our.partners": {
    ro: "Partenerii noștri",
    ru: "Наши партнеры"
  },
  "partners.sponsor.spot": {
    ro: "Sponsor Spot",
    ru: "Место для спонсора"
  },
  "partners.supported.by": {
    ro: "Susținut de partenerii noștri principali",
    ru: "При поддержке наших основных партнеров"
  },
  
  // MEF button
  "mef.button": {
    ro: "MEF",
    ru: "MEF"
  },
  
  // Event pages
  "event.back.button": {
    ro: "Înapoi la evenimente",
    ru: "Назад к событиям"
  },
  "event.pilot.cup.title": {
    ro: "MPL Pilot Cup",
    ru: "MPL Pilot Cup"
  },
  "event.pilot.cup.date": {
    ro: "10-23 Martie 2025",
    ru: "10-23 марта 2025"
  },
  "event.pilot.cup.location": {
    ro: "Online (FACEIT)",
    ru: "Онлайн (FACEIT)"
  },
  "event.pilot.cup.description": {
    ro: "Turneul inaugural organizat de Moldova Pro League, dedicat jucătorilor de Counter-Strike 2 din Moldova, a fost un succes cu o participare record și meciuri intense.",
    ru: "Инаугурационный турнир, организованный Moldova Pro League, посвященный игрокам Counter-Strike 2 из Молдовы, прошел с рекордным участием и напряженными матчами."
  },
  "event.about.title": {
    ro: "Despre eveniment",
    ru: "О событии"
  },
  "event.pilot.cup.about.p1": {
    ro: "MPL Pilot Cup a fost turneul pilot prin care Moldova Pro League a inaugurat seria sa de competiții oficiale pentru Counter-Strike 2. Acest turneu a fost conceput special pentru jucătorii din Moldova, indiferent de nivelul lor de abilitate, oferind o platformă inclusivă unde echipele au concurat într-un mediu profesionist.",
    ru: "MPL Pilot Cup был пилотным турниром, которым Moldova Pro League открыла свою серию официальных соревнований по Counter-Strike 2. Этот турнир был разработан специально для игроков из Молдовы, независимо от их уровня мастерства, предоставляя инклюзивную платформу, где команды соревновались в профессиональной среде."
  },
  "event.pilot.cup.about.p2": {
    ro: "Turneul a fost organizat exclusiv online pe platforma FACEIT, eliminând astfel barierele geografice și facilitând participarea echipelor. MPL Pilot Cup nu a fost doar despre competiție, ci și despre construirea unei comunități unite în jurul pasiunii pentru Counter-Strike.",
    ru: "Турнир проводился полностью онлайн на платформе FACEIT, устраняя географические барьеры и облегчая участие команд. MPL Pilot Cup был не только о соревновании, но и о создании объединенного сообщества вокруг страсти к Counter-Strike."
  },
  "event.format.title": {
    ro: "Format",
    ru: "Формат"
  },
  "event.format.elimination": {
    ro: "Faza eliminatorie: circa 40 echipe într-un bracket simplu, meciuri eliminatorii (single elimination).",
    ru: "Стадия выбывания: около 40 команд в простой сетке, матчи на выбывание (single elimination)."
  },
  "event.format.matches": {
    ro: "Format meciuri: Bo1 (Best of 1) pentru majoritatea meciurilor, Bo3 (Best of 3) pentru ultimele 4 echipe.",
    ru: "Формат матчей: Bo1 (Best of 1) для большинства матчей, Bo3 (Best of 3) для последних 4 команд."
  },
  "event.prizes.title": {
    ro: "Premii",
    ru: "Призы"
  },
  "event.prizes.description": {
    ro: "MPL Pilot Cup a oferit premii valoroase pentru echipele câștigătoare, furnizate de sponsorii noștri Darwin și HATOR:",
    ru: "MPL Pilot Cup предложил ценные призы для команд-победителей, предоставленные нашими спонсорами Darwin и HATOR:"
  },
  "event.prize.first.place": {
    ro: "Locul 1",
    ru: "1-е место"
  },
  "event.prize.second.place": {
    ro: "Locul 2",
    ru: "2-е место"
  },
  "event.prize.third.place": {
    ro: "Locul 3",
    ru: "3-е место"
  },
  "event.prize.fourth.place": {
    ro: "Locul 4",
    ru: "4-е место"
  },
  "event.winners.title": {
    ro: "Câștigătorii",
    ru: "Победители"
  },
  "event.first.place": {
    ro: "LOCUL 1",
    ru: "1-Е МЕСТО"
  },
  
  // HATOR CS2 LEAGUE
  "event.hator.title": {
    ro: "HATOR CS2 LEAGUE MOLDOVA",
    ru: "HATOR CS2 LEAGUE MOLDOVA"
  },
  "event.hator.date": {
    ro: "Aprilie-Iunie 2025",
    ru: "Апрель-Июнь 2025"
  },
  "event.hator.location": {
    ro: "Online (FACEIT)",
    ru: "Онлайн (FACEIT)"
  },
  "event.hator.description": {
    ro: "Cel mai tare turneu online de Counter-Strike 2 din Moldova și România, organizat de comunitatea MPL în parteneriat cu HATOR.",
    ru: "Самый крутой онлайн-турнир по Counter-Strike 2 в Молдове и Румынии, организованный сообществом MPL в партнерстве с HATOR."
  },
  "event.countdown": {
    ro: "Până la începerea turneului:",
    ru: "До начала турнира:"
  },
  "event.schedule.title": {
    ro: "Program",
    ru: "Расписание"
  },
  "event.league.description.1": {
    ro: "MPL, cea mai mare comunitate CS din Moldova, în parteneriat cu HATOR și susținut de rețeaua Darwin, organizează primul sezon al turneului Hator CS2 League Moldova. Primul sezon promite un spectacol de neuitat – sute de jucători, zeci de meciuri, transmisiuni live și premii impresionante.",
    ru: "MPL, крупнейшее CS-сообщество в Молдове, в партнерстве с HATOR и при поддержке сети Darwin, организует первый сезон турнира Hator CS2 League Moldova. Первый сезон обещает незабываемое зрелище – сотни игроков, десятки матчей, прямые трансляции и впечатляющие призы."
  },
  "event.league.description.2": {
    ro: "Participanții și spectatorii vor primi coduri promoționale exclusive pentru produsele HATOR, disponibile în magazinele Darwin.",
    ru: "Участники и зрители получат эксклюзивные промо-коды на продукцию HATOR, доступную в магазинах Darwin."
  },
  
  "event.prizes.value": {
    ro: "Premii în Valoare de 65.000 Lei",
    ru: "Призы стоимостью 65 000 леев"
  },
  "event.prize.first": {
    ro: "Locul 1",
    ru: "1-е место"
  },
  "event.prize.second": {
    ro: "Locul 2",
    ru: "2-е место"
  },
  "event.prize.third": {
    ro: "Locul 3",
    ru: "3-е место"
  },
  "event.prize.secret": {
    ro: "Premiu Secret",
    ru: "Секретный приз"
  },
  "event.prize.secret.description": {
    ro: "Va fi dezvăluit în timpul turneului",
    ru: "Будет раскрыт во время турнира"
  },
  "event.prize.special": {
    ro: "Surpriză specială pentru participanți",
    ru: "Специальный сюрприз для участников"
  },
  "event.hator.chairs": {
    ro: "5x Scaune gaming HATOR Arc 2 XL",
    ru: "5x Игровые кресла HATOR Arc 2 XL"
  },
  "event.hator.mouse": {
    ro: "5x Mouse HATOR Quasar 3 ULTRA 8K",
    ru: "5x Мышь HATOR Quasar 3 ULTRA 8K"
  },
  "event.hator.headphones": {
    ro: "5x Căști HATOR Hypergang 2 USB 7.1",
    ru: "5x Наушники HATOR Hypergang 2 USB 7.1"
  },
  
  "event.format.title.official": {
    ro: "Format Oficial Turneu",
    ru: "Официальный формат турнира"
  },
  "event.format.stage1": {
    ro: "Etapa 1: Grupe (Swiss Format)",
    ru: "Этап 1: Группы (Швейцарская система)"
  },
  "event.format.stage2": {
    ro: "Etapa 2: Play-off (Eliminatoriu)",
    ru: "Этап 2: Плей-офф (На выбывание)"
  },
  "event.format.matches.format": {
    ro: "Format Meciuri",
    ru: "Формат матчей"
  },
  "event.format.max.capacity": {
    ro: "Capacitate maximă",
    ru: "Максимальная вместимость"
  },
  "event.format.teams.number": {
    ro: "Până la 40 echipe din Moldova și România",
    ru: "До 40 команд из Молдовы и Румынии"
  },
  "event.format.structure": {
    ro: "Structură",
    ru: "Структура"
  },
  "event.format.groups.structure": {
    ro: "16 grupe a câte 8 echipe",
    ru: "16 групп по 8 команд"
  },
  "event.format.system": {
    ro: "Sistem",
    ru: "Система"
  },
  "event.format.swiss.description": {
    ro: "Swiss Style Bo1 - echipele joacă meciuri până acumulează:",
    ru: "Swiss Style Bo1 - команды играют матчи до накопления:"
  },
  "event.format.wins.qualification": {
    ro: "2 victorii - se califică automat în play-off",
    ru: "2 победы - автоматически квалифицируются в плей-офф"
  },
  "event.format.losses.elimination": {
    ro: "2 înfrângeri - sunt eliminate",
    ru: "2 поражения - выбывают"
  },
  "event.format.swiss.detailed": {
    ro: "Explicație detaliată Swiss Format",
    ru: "Подробное объяснение Swiss формата"
  },
  "event.format.qualification": {
    ro: "Calificare",
    ru: "Квалификация"
  },
  "event.format.qualification.description": {
    ro: "Primele 3 echipe din fiecare grupă (cele cu rezultate 2-0, 2-1 sau 1-2) avansează în faza Play-off",
    ru: "Первые 3 команды из каждой группы (с результатами 2-0, 2-1 или 1-2) переходят в стадию плей-офф"
  },
  "event.format.bonus.seeding": {
    ro: "Bonus seeding",
    ru: "Бонус посева"
  },
  "event.format.bonus.description": {
    ro: "Echipele clasate pe locul 1 din cele 16 grupe avansează direct în Top 24, fără a juca primul meci din Play-off",
    ru: "Команды, занявшие 1-е место в 16 группах, переходят прямо в Top 24, минуя первый матч плей-офф"
  },
  "event.format.qualified.teams": {
    ro: "Echipe calificate",
    ru: "Квалифицированные команды"
  },
  "event.format.qualified.number": {
    ro: "48 din faza grupelor",
    ru: "48 из группового этапа"
  },
  "event.format.round1": {
    ro: "Runda 1 (Top 48 → Top 32): participă locurile 2 și 3 din grupe (32 echipe) - meciuri Bo1",
    ru: "Раунд 1 (Top 48 → Top 32): участвуют места 2 и 3 из групп (32 команды) - матчи Bo1"
  },
  "event.format.round2": {
    ro: "Runda 2 (Top 32 → Top 24): echipele câștigătoare din R1 + echipele clasate pe locul 1 în grupe - meciuri Bo1",
    ru: "Раунд 2 (Top 32 → Top 24): команды-победители R1 + команды, занявшие 1-е место в группах - матчи Bo1"
  },
  "event.format.round3": {
    ro: "Runda 3 (Top 24 → Top 12): se joacă 12 meciuri Bo1",
    ru: "Раунд 3 (Top 24 → Top 12): играются 12 матчей Bo1"
  },
  "event.format.final": {
    ro: "Etapa finală: optimi, sferturi, semifinale și finală - toate meciuri Bo3",
    ru: "Финальный этап: 1/8, 1/4, полуфиналы и финал - все матчи Bo3"
  },
  "event.format.playoff.detailed": {
    ro: "Explicație detaliată Play-off",
    ru: "Подробное объяснение плей-офф"
  },
  "event.maps.selection": {
    ro: "Alegere Hărți - Bo3",
    ru: "Выбор карт - Bo3"
  },
  
  "event.rules": {
    ro: "Reguli importante",
    ru: "Важные правила"
  },
  "event.anticheat": {
    ro: "Anti-cheat și Fair Play",
    ru: "Анти-чит и честная игра"
  },
  "event.conduct": {
    ro: "Conduită",
    ru: "Поведение"
  },
  "event.technical.pause": {
    ro: "Technical Pause",
    ru: "Технические паузы"
  },
  "event.rules.mandatory": {
    ro: "Reguli obligatorii pentru participanți",
    ru: "Обязательные правила для участников"
  },
  
  "event.registration": {
    ro: "Înregistrare echipă",
    ru: "Регистрация команды"
  },
  "event.regulation": {
    ro: "Regulament",
    ru: "Правила"
  },
  
  "event.quick.info": {
    ro: "Informații rapide",
    ru: "Быстрая информация"
  },
  "event.date.range": {
    ro: "Aprilie-Iunie 2025",
    ru: "Апрель-Июнь 2025"
  },
  "event.date.hours": {
    ro: "Weekenduri: 10:00 - 22:00 EEST",
    ru: "Выходные: 10:00 - 22:00 EEST"
  },
  "event.platform": {
    ro: "Platforma oficială de competiție",
    ru: "Официальная платформа соревнований"
  },
  "event.teams.limit": {
    ro: "Până la 128 echipe",
    ru: "До 128 команд"
  },
  "event.format.5v5": {
    ro: "Format 5v5",
    ru: "Формат 5v5"
  },
  "event.prizes.value.hator": {
    ro: "Premii în valoare de 65.000 lei",
    ru: "Призы стоимостью 65 000 леев"
  },
  "event.hator.premium": {
    ro: "Echipament HATOR premium",
    ru: "Премиальное оборудование HATOR"
  },
  
  "event.organized.by": {
    ro: "Organizat de",
    ru: "Организовано"
  },
  "event.main.sponsor": {
    ro: "Sponsor Principal",
    ru: "Главный спонсор"
  },
  "event.partners": {
    ro: "Parteneri",
    ru: "Партнеры"
  },
  "event.registrations": {
    ro: "Înscrieri",
    ru: "Регистрация"
  }, 
  "event.team.validation": {
    ro: "Validare echipe",
    ru: "Проверка команд"
  },
  "event.tournament.start": {
    ro: "Start turneu",
    ru: "Начало турнира"
  },
  "event.swiss.format": {
    ro: "Swiss Format",
    ru: "Швейцарская система"
  },
  "event.playoff": {
    ro: "Play-off",
    ru: "Плей-офф"
  },
  "event.stream.media": {
    ro: "Stream & Media",
    ru: "Стримы и Медиа"
  },
  "event.stream.description": {
    ro: "Toate meciurile din faza eliminatorie vor fi transmise live pe canalele oficiale:",
    ru: "Все матчи отборочного этапа будут транслироваться в прямом эфире на официальных каналах:"
  },
  "event.contact": {
    ro: "Contact",
    ru: "Контакты"
  },
  "event.contact.description": {
    ro: "Pentru orice întrebări legate de turneu, nu ezitați să ne contactați:",
    ru: "По любым вопросам, связанным с турниром, не стесняйтесь обращаться к нам:"
  },
  "event.eligibility": {
    ro: "Eligibilitate",
    ru: "Требования к участникам"
  },
  "event.eligibility.teams": {
    ro: "Echipele trebuie să aibă minimum 5 jucători și maximum 7 (5 titulari + 2 rezerve)",
    ru: "Команды должны иметь минимум 5 игроков и максимум 7 (5 основных + 2 запасных)"
  },
  "event.eligibility.faceit": {
    ro: "Toți jucătorii trebuie să dețină un cont FACEIT verificat",
    ru: "Все игроки должны иметь верифицированный аккаунт FACEIT"
  },
  "event.eligibility.nationality": {
    ro: "Cel puțin 4 jucători care vor juca - fără rezerve - din echipă trebuie să fie din Moldova, din Romania maxim 1 jucator",
    ru: "Не менее 4 игроков, которые будут играть - без запасных - должны быть из Молдовы, из Румынии максимум 1 игрок"
  },
  "event.eligibility.tag": {
    ro: "Fiecare echipă trebuie să aibă obligatoriu un TEG (tag) și un logotip oficial pe platformă",
    ru: "Каждая команда должна обязательно иметь TEG (тег) и официальный логотип на платформе"
  },
  "event.registration.title": {
    ro: "Înscriere",
    ru: "Регистрация команд"
  },
  "event.registration.description": {
    ro: "Înscrierea echipelor se va face exclusiv pe platforma FACEIT și Discord MPL, conform următorului calendar:",
    ru: "Регистрация команд будет проводиться исключительно на платформе FACEIT и в Discord MPL в соответствии со следующим графиком:"
  },
  "event.registration.start": {
    ro: "Start înscrieri",
    ru: "Начало регистрации"
  },
  "event.registration.end": {
    ro: "Închidere înscrieri",
    ru: "Закрытие регистрации"
  },
  "event.anticheat.rule1": {
    ro: "Toți jucătorii sunt obligați să folosească FACEIT Anti-Cheat pe durata turneului",
    ru: "Все игроки обязаны использовать FACEIT Anti-Cheat на протяжении всего турнира"
  },
  "event.anticheat.rule2": {
    ro: "Utilizarea oricărui tip de cheat/hack, exploit, sau script neautorizat va duce la descalificarea imediată a echipei",
    ru: "Использование любого типа читов/хаков, эксплойтов или несанкционированных скриптов приведет к немедленной дисквалификации команды"
  },
  "event.anticheat.rule3": {
    ro: "Conturi Steam publice – Toți jucătorii trebuie să joace de pe un cont Steam public. Dacă nu folosesc contul principal, trebuie să prezinte motivul și să accepte riscul descalificării.",
    ru: "Публичные аккаунты Steam – Все игроки должны играть с публичного аккаунта Steam. Если они не используют свой основной аккаунт, они должны объяснить причину и принять риск дисквалификации."
  },
  "event.anticheat.rule4": {
    ro: "Răspundere pentru reguli – Orice abatere sau folosirea unui cont alternativ fără motiv justificat poate duce la descalificarea echipei.",
    ru: "Ответственность за правила – Любое нарушение или использование альтернативного аккаунта без уважительной причины может привести к дисквалификации команды."
  },
  "event.conduct.rule1": {
    ro: "Jucătorii trebuie să manifeste respect față de adversari, spectatori și administratori",
    ru: "Игроки должны проявлять уважение к соперникам, зрителям и администраторам"
  },
  "event.conduct.rule2": {
    ro: "Comportamentul toxic, limbajul abuziv, rasist sau discriminatoriu nu sunt tolerate",
    ru: "Токсичное поведение, оскорбительная, расистская или дискриминационная лексика не допускаются"
  },
  "event.conduct.rule3": {
    ro: "Nerespectarea regulilor de conduită poate duce la avertismente, penalizări sau descalificare",
    ru: "Несоблюдение правил поведения может привести к предупреждениям, штрафам или дисквалификации"
  },
  "event.technical.pause.rule1": {
    ro: "Fiecare echipă are dreptul la maximum 2 pauze tehnice de maximum 5 minute pe meci",
    ru: "Каждая команда имеет право на максимум 2 технических паузы продолжительностью до 5 минут за матч"
  },
  "event.technical.pause.rule2": {
    ro: "Abuzul de pauze tehnice va fi penalizat cu avertismente și potențial pierderea dreptului la pauze viitoare",
    ru: "Злоупотребление техническими паузами будет наказываться предупреждениями и возможной потерей права на будущие паузы"
  },
  "event.format.bo1": {
    ro: "Un singur meci decide câștigătorul (grupe și primele 3 runde din Play-off)",
    ru: "Один матч определяет победителя (группы и первые 3 раунда плей-офф)"
  },
  "event.format.bo3": {
    ro: "Cele mai bune din 3 hărți (etapa finală din Top 12 până în finală)",
    ru: "Лучшее из 3 карт (финальный этап от Top 12 до финала)"
  },
  "event.maps.coinflip": {
    ro: "Coinflip",
    ru: "Жребий"
  },
  "event.maps.teams.determination": {
    ro: "Determinarea echipelor A și B",
    ru: "Определение команд A и B"
  },
  "event.maps.steps": {
    ro: "Pași alegere hartă",
    ru: "Шаги выбора карты"
  },
  "event.maps.step1": {
    ro: "Echipa A elimină 1 hartă",
    ru: "Команда A исключает 1 карту"
  },
  "event.maps.step2": {
    ro: "Echipa B elimină 1 hartă",
    ru: "Команда B исключает 1 карту"
  },
  "event.maps.step3": {
    ro: "Echipa A alege harta 1 (care va fi jucată prima)",
    ru: "Команда A выбирает карту 1 (которая будет сыграна первой)"
  },
  "event.maps.step4": {
    ro: "Echipa B alege partea (CT/T) pentru harta 1",
    ru: "Команда B выбирает сторону (CT/T) для карты 1"
  },
  "event.maps.step5": {
    ro: "Echipa B alege harta 2 (care va fi jucată a doua)",
    ru: "Команда B выбирает карту 2 (которая будет сыграна второй)"
  },
  "event.maps.step6": {
    ro: "Echipa A alege partea (CT/T) pentru harta 2",
    ru: "Команда A выбирает сторону (CT/T) для карты 2"
  },
  "event.maps.step7": {
    ro: "Echipa A elimină 1 hartă",
    ru: "Команда A исключает 1 карту"
  },
  "event.maps.step8": {
    ro: "Echipa B elimină 1 hartă",
    ru: "Команда B исключает 1 карту"
  },
  "event.maps.step9": {
    ro: "Harta rămasă devine harta 3 (decisivă dacă scorul e 1-1)",
    ru: "Оставшаяся карта становится картой 3 (решающей при счете 1-1)"
  },
  "event.maps.step10": {
    ro: "Echipa A alege partea (CT/T) pentru harta 3",
    ru: "Команда A выбирает сторону (CT/T) для карты 3"
  },
  "event.rules.warning": {
    ro: "Nerespectarea acestor reguli duce la descalificare (pierdere tehnică):",
    ru: "Несоблюдение этих правил приведет к дисквалификации (техническое поражение):"
  },
  "event.rule.nickname.title": {
    ro: "Nickname adecvat",
    ru: "Подходящий никнейм"
  },
  "event.rule.nickname.description": {
    ro: "un nickname provocator, care instigă la ură națională, rasism, misoginie și alte forme de discriminare, este absolut INTERZIS.",
    ru: "провокационный никнейм, подстрекающий к национальной ненависти, расизму, мизогинии и другим формам дискриминации, категорически ЗАПРЕЩЕН."
  },
  "event.rule.skins.title": {
    ro: "Skinuri indecente",
    ru: "Неприличные скины"
  },
  "event.rule.skins.description": {
    ro: "se interzice folosirea skinurilor care conțin combinații de stickere indecente sau name tag-uri provocatoare. Dacă este depistată utilizarea unui skin indecent, se va aplica o avertizare; la a doua abatere, echipa va fi descalificată.",
    ru: "запрещается использование скинов, содержащих неприличные комбинации стикеров или провокационные нейм-теги. Если обнаружено использование неприличного скина, будет применено предупреждение; при повторном нарушении команда будет дисквалифицирована."
  },
  "event.rule.agents.title": {
    ro: "Agenții",
    ru: "Агенты"
  },
  "event.rule.agents.description": {
    ro: "trebuie să aibă skin-ul default.",
    ru: "должны иметь скин по умолчанию."
  },
  "event.rule.taunting.title": {
    ro: "Provocarea",
    ru: "Провокация"
  },
  "event.rule.taunting.description": {
    ro: "și alte forme de batjocură sunt permise doar dacă ambele echipe sunt de acord cu trash talk-ul; în caz contrar, se aplică avertizare, urmată de descalificare.",
    ru: "и другие формы насмешек разрешены только если обе команды согласны на треш-ток; в противном случае применяется предупреждение, за которым следует дисквалификация."
  },
  "event.rule.bugs.title": {
    ro: "Bug-uri",
    ru: "Баги"
  },
  "event.rule.bugs.description": {
    ro: "folosirea bug-urilor cu ajutorul aplicațiilor externe este echivalentă cu folosirea de cheats. Bug-urile din joc sunt permise doar dacă nu oferă un avantaj semnificativ (ex: bug cu WH sau macro/exploit pentru Auto-Aim sunt interzise).",
    ru: "использование багов с помощью внешних приложений приравнивается к использованию читов. Баги в игре разрешены только если они не дают значительного преимущества (например: баг с WH или макросы/эксплойты для Auto-Aim запрещены)."
  },
  "event.rule.pfp.title": {
    ro: "PFP (profile picture)",
    ru: "PFP (аватар профиля)"
  },
  "event.rule.pfp.description": {
    ro: "poza de profil trebuie să conțină un conținut adecvat.",
    ru: "изображение профиля должно содержать соответствующий контент."
  },
  "event.rule.smurfing.title": {
    ro: "Smurfing",
    ru: "Смурфинг"
  },
  "event.rule.smurfing.description": {
    ro: "conturile suspecte de smurfing vor fi investigate până la demonstrarea clară a smurfingului sau, în caz contrar, până la infirmarea acestuia. Se admite folosirea unui alt cont (decât cel principal) doar dacă acel cont principal are un ban temporar. Conturile cu ban pentru smurfing sau cheating nu sunt admise. Dacă jucătorul nu deține contul original, este obligat să informeze moderatorii sau organizatorii turneului.",
    ru: "подозрительные на смурфинг аккаунты будут расследоваться до ясного доказательства смурфинга или, наоборот, до его опровержения. Разрешается использование другого аккаунта (кроме основного) только если этот основной аккаунт имеет временный бан. Аккаунты с баном за смурфинг или читерство не допускаются. Если игрок не владеет оригинальным аккаунтом, он обязан информировать модераторов или организаторов турнира."
  },
  "event.rule.streamsniping.title": {
    ro: "Streamsniping",
    ru: "Стримснайпинг"
  },
  "event.rule.streamsniping.description": {
    ro: "este interzisă vizionarea jocului atât timp cât jucătorul se află în meci, indiferent de delay.",
    ru: "запрещается просмотр игры, пока игрок находится в матче, независимо от задержки."
  },
  "event.rule.discord.title": {
    ro: "Folosirea Discordului",
    ru: "Использование Discord"
  },
  "event.rule.discord.description": {
    ro: "Discord turneului este platforma oficială de comunicare și trebuie utilizată pentru coordonare.",
    ru: "Discord турнира является официальной платформой для общения и должен использоваться для координации."
  },
  "event.date.registration.start": {
    ro: "21 Aprilie 2025",
    ru: "21 апреля 2025"
  },
  "event.date.registration.end": {
    ro: "8 Iunie 2025",
    ru: "8 июня 2025"
  },
  "event.date.team.validation": {
    ro: "9 Iunie - 15 Iunie 2025",
    ru: "9 июня - 15 июня 2025"
  },
  "event.date.tournament.start": {
    ro: "16 Iunie 2025",
    ru: "16 июня 2025"
  },
  "event.rules.title": {
    ro: "Regulament",
    ru: "Правила"
  },
  "event.eligibility.title": {
    ro: "Eligibilitate",
    ru: "Требования к участникам"
  },
  "event.eligibility.team.size": {
    ro: "Echipele au trebuit să aibă minim 5 jucători și maximum 7 (5 titulari + 2 rezerve)",
    ru: "Команды должны были иметь минимум 5 игроков и максимум 7 (5 основных + 2 запасных)"
  },
  "event.eligibility.faceit.account": {
    ro: "Toți jucătorii au trebuit să dețină un cont FACEIT verificat",
    ru: "Все игроки должны были иметь верифицированный аккаунт FACEIT"
  },
  "event.eligibility.nationality.rule": {
    ro: "Cel puțin 3 jucători din echipă au trebuit să fie din Republica Moldova",
    ru: "Не менее 3 игроков в команде должны были быть из Республики Молдова"
  },
  "event.general.rules.title": {
    ro: "Reguli generale",
    ru: "Общие правила"
  },
  "event.rules.cheating": {
    ro: "Utilizarea oricărui tip de cheat/hack a fost strict interzisă și a rezultat în descalificarea imediată",
    ru: "Использование любого типа читов/хаков было строго запрещено и привело к немедленной дисквалификации"
  },
  "event.rules.toxic.behavior": {
    ro: "Comportamentul toxic, rasist sau discriminatoriu nu a fost tolerat",
    ru: "Токсичное, расистское или дискриминационное поведение не допускалось"
  },
  "event.rules.map.selection": {
    ro: "Hărțile s-au ales prin sistemul de veto înainte de fiecare meci",
    ru: "Карты выбирались с помощью системы вето перед каждым матчем"
  },
  "event.rules.monitoring": {
    ro: "Toate meciurile au fost monitorizate de administratori oficiali MPL",
    ru: "Все матчи контролировались официальными администраторами MPL"
  },
  "event.rules.disputes": {
    ro: "Orice dispută a fost rezolvată de administratorii turneului, iar decizia lor a fost finală",
    ru: "Любые споры разрешались администраторами турнира, и их решение было окончательным"
  },
  "event.quick.info.title": {
    ro: "Informații rapide",
    ru: "Быстрая информация"
  },
  "event.date.range.march": {
    ro: "10-23 Martie 2025",
    ru: "10-23 марта 2025"
  },
  "event.date.hours.range": {
    ro: "15:00 - 22:00 EEST",
    ru: "15:00 - 22:00 EEST"
  },
  "event.platform.official": {
    ro: "Platforma oficială de competiție",
    ru: "Официальная платформа соревнований"
  },
  "event.teams.count": {
    ro: "64 echipe",
    ru: "64 команды"
  },
  "event.prizes.hator": {
    ro: "Premii oferite de HATOR",
    ru: "Призы предоставлены HATOR"
  },
  "event.equipment.gaming": {
    ro: "Echipament gaming pentru câștigători",
    ru: "Игровое оборудование для победителей"
  },
  "event.sponsors.title": {
    ro: "Sponsori",
    ru: "Спонсоры"
  },
  "event.sponsor.main": {
    ro: "Main Sponsor",
    ru: "Главный спонсор"
  },
  "event.partner.title": {
    ro: "Partner",
    ru: "Партнер"
  },
  "event.contact.title": {
    ro: "Contact",
    ru: "Контакты"
  },
  "event.contact.questions": {
    ro: "Pentru orice întrebări legate de turneu, nu ezitați să ne contactați:",
    ru: "По любым вопросам, связанным с турниром, не стесняйтесь обращаться к нам:"
  },
  "event.winners.text.first": {
    ro: "Felicitări, LitEnergy! 🏆 Echipa a demonstrat că talentul, determinarea și munca în echipă sunt cheia succesului! Printr-un parcurs spectaculos și momente de joc electrizante, au reușit să cucerească titlul de campioni ai turneului.",
    ru: "Поздравляем, LitEnergy! 🏆 Команда доказала, что талант, решимость и командная работа - ключ к успеху! Благодаря впечатляющему выступлению и захватывающим моментам игры, они смогли завоевать чемпионский титул турнира."
  },
  "event.winners.text.second": {
    ro: "Respect, R5Team! Echipa a demonstrat curaj, determinare și un joc de înaltă clasă în turneu! Au luptat până la capăt și au arătat de ce sunt una dintre cele mai puternice echipe din competiție.",
    ru: "Уважение, R5Team! Команда показала храбрость, решимость и высококлассную игру в турнире! Они боролись до конца и показали, почему являются одной из сильнейших команд в соревновании."
  },
  "event.winners.text.third": {
    ro: "Felicitări, K9 TEAM! Echipa a demonstrat ambiție, spirit de luptă și skill-uri impresionante în turneu! Printr-un parcurs plin de emoții și meciuri spectaculoase, au reușit să urce pe podium.",
    ru: "Поздравляем, K9 TEAM! Команда показала амбиции, боевой дух и впечатляющие навыки в турнире! Благодаря эмоциональному выступлению и захватывающим матчам, они смогли подняться на пьедестал."
  },
  "event.place.first": {
    ro: "LOCUL 1",
    ru: "1 МЕСТО"
  },
  "event.place.second": {
    ro: "LOCUL 2",
    ru: "2 МЕСТО"
  },
  "event.place.third": {
    ro: "LOCUL 3",
    ru: "3 МЕСТО"
  },
  
  // Match Results Translations
  "match_results": {
    ro: "Rezultate Meciuri",
    ru: "Результаты матчей"
  },
  "match_results_description": {
    ro: "Vezi toate rezultatele meciurilor jucate în cadrul turneului, organizate pe grupe",
    ru: "Смотрите все результаты матчей, сыгранных в рамках турнира, организованные по группам"
  },
  "loading_results": {
    ro: "Se încarcă rezultatele...",
    ru: "Загружаются результаты..."
  },
  "error_loading_results": {
    ro: "Eroare la încărcarea rezultatelor",
    ru: "Ошибка при загрузке результатов"
  },
  "no_matches_played": {
    ro: "Nu au fost jucate încă meciuri",
    ru: "Пока что матчи не проводились"
  },
  "matches_will_appear_here": {
    ro: "Rezultatele meciurilor vor apărea aici odată ce sunt introduse",
    ru: "Результаты матчей появятся здесь после их ввода"
  },
  "group": {
    ro: "Grupa",
    ru: "Группа"
  },
  "matches": {
    ro: "meciuri",
    ru: "матчей"
  },
  "winner": {
    ro: "Câștigător",
    ru: "Победитель"
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