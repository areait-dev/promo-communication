export type Service = { id: string; name: string; boost: string; p1: string; p2: string; tags: string[] };
export const SERVICES: Service[] = [
 {
  "id": "brand-strategy",
  "name": "Brand Strategy",
  "boost": "Boost your Strategy",
  "p1": "Prima di correre, serve sapere dove andare. Mettiamo sotto la lente la tua impresa, il mercato e i concorrenti per capire dove sei oggi e fin dove puoi arrivare. Poi fissiamo posizionamento, pubblici e messaggi chiave.",
  "p2": "Ne esce una bussola. Da quel momento, ogni scelta ha un nord.",
  "tags": [
   "Analisi di mercato",
   "Audit della comunicazione",
   "Posizionamento di marca",
   "Definizione dei pubblici",
   "Piano di comunicazione e marketing"
  ]
 },
 {
  "id": "brand-identity",
  "name": "Brand Identity",
  "boost": "Boost your Brand",
  "p1": "L’identità è il modo in cui una marca si fa riconoscere. Diamo forma a identità visive e verbali coerenti, capaci di distinguersi e di durare nel tempo, e accompagniamo le imprese nei percorsi di rebranding.",
  "p2": "",
  "tags": [
   "Naming",
   "Logo e identità visiva",
   "Tone of voice e identità verbale",
   "Brand guidelines",
   "Storytelling di marca",
   "Rebranding",
   "Company profile",
   "Packaging"
  ]
 },
 {
  "id": "digital-web",
  "name": "Digital & Web",
  "boost": "Boost your Digital",
  "p1": "Un brand forte si riconosce anche di sfuggita, con la coda dell’occhio. Diamo forma a identità visive e verbali coerenti, fatte per distinguersi oggi e reggere bene il passare degli anni.",
  "p2": "E quando un’identità comincia a starti stretta, ti accompagniamo nel rebranding senza perdere per strada chi ti conosce già.",
  "tags": [
   "Siti web e landing page",
   "App",
   "Campagne digital e advertising",
   "SEO",
   "Analisi e reportistica"
  ]
 },
 {
  "id": "social-media",
  "name": "Social Media Management",
  "boost": "Boost your Social",
  "p1": "Il pollice scorre veloce: hai un secondo, forse due, per fermarlo. Costruiamo piani editoriali, scriviamo i post, giriamo reel e diamo forma a contenuti che meritano quella pausa. Poi ascoltiamo la community, rispondiamo, e con le campagne adv portiamo i tuoi contenuti dove da soli non arriverebbero.",
  "p2": "Combattere lo scrolling è un mestiere. Noi lo facciamo ogni giorno.",
  "tags": [
   "Social media management",
   "Piani editoriali",
   "Contenuti foto, video e reel",
   "Community management",
   "Social adv",
   "Analisi e reportistica"
  ]
 },
 {
  "id": "brand-reputation",
  "name": "Brand Reputation",
  "boost": "Boost your Reputation",
  "p1": "La reputazione si costruisce in anni e può incrinarsi in un pomeriggio. Per questo la curiamo ogni giorno, con pazienza. Coltiviamo le relazioni con i media e ascoltiamo cosa si dice di te, online e offline.",
  "p2": "Quando arriva un momento delicato, siamo i primi a rispondere al telefono.",
  "tags": [
   "Ufficio stampa",
   "Media relations",
   "Monitoraggio della reputazione online e offline",
   "Crisis communication",
   "Comunicazione corporate e istituzionale",
   "Comunicazione della sostenibilità"
  ]
 },
 {
  "id": "personal-branding",
  "name": "Personal Branding",
  "boost": "Boost Yourself",
  "p1": "Anche le persone sono brand, e spesso sono il primo biglietto da visita dell’impresa che rappresentano. Affianchiamo imprenditori, manager e professionisti nel far emergere competenze e visione.",
  "p2": "L’obiettivo è un’immagine che ti somigli davvero, dal profilo LinkedIn fino al palco.",
  "tags": [
   "Analisi del profilo personale",
   "Posizionamento personale",
   "LinkedIn e profili social",
   "Contenuti e thought leadership",
   "Media training e public speaking"
  ]
 },
 {
  "id": "event-management",
  "name": "Event Management",
  "boost": "Boost your Event",
  "p1": "Certi messaggi arrivano meglio guardandosi negli occhi. Progettiamo eventi che trasformano un brand o un prodotto in un’esperienza, dall’idea alla regia, dalla segreteria organizzativa alla comunicazione del prima, durante e dopo.",
  "p2": "Tu goditi l’evento. Al resto pensiamo noi.",
  "tags": [
   "Ideazione e concept",
   "Eventi aziendali e istituzionali",
   "Convegni e congressi",
   "Lanci di prodotto",
   "Segreteria organizzativa",
   "Comunicazione e copertura social dell’evento"
  ]
 },
 {
  "id": "comunicazione-politica",
  "name": "Comunicazione Politica",
  "boost": "Boost your Campaign",
  "p1": "Il consenso si conquista una stretta di mano alla volta, in piazza come online. Affianchiamo candidati, amministratori e rappresentanti politici nel costruire una strategia che parta da quello che i cittadini pensano davvero, con sondaggi e focus group. Poi trasformiamo idee e programmi in messaggi chiari, e li portiamo dove le persone li leggono, li commentano e ne discutono.",
  "p2": "Prima si ascolta. Poi si parla.",
  "tags": [
   "Strategia di comunicazione politica",
   "Sondaggi e focus group",
   "Campagne elettorali"
  ]
 }
];
/** Parola dopo "boost your" nell'elenco della home, dove deve essere diversa dal nome del servizio (il nastro dei servizi usa sempre il nome). */
export const BOOST_WORD: Record<string, string> = { "comunicazione-politica": "Political Campaign" };
export const HOME_ORDER: string[] = [
 "brand-strategy",
 "brand-identity",
 "digital-web",
 "social-media",
 "brand-reputation",
 "comunicazione-politica",
 "personal-branding",
 "event-management"
];
export const ACC: Record<string, [string, string]> = {
 "brand-strategy": [
  "acc-red",
  "BS"
 ],
 "brand-identity": [
  "acc-blu",
  "BI"
 ],
 "digital-web": [
  "acc-el",
  "DW"
 ],
 "social-media": [
  "acc-rosa",
  "SM"
 ],
 "brand-reputation": [
  "acc-notte",
  "BR"
 ],
 "comunicazione-politica": [
  "acc-pietra",
  "CP"
 ],
 "personal-branding": [
  "acc-azz",
  "PB"
 ],
 "event-management": [
  "acc-corallo",
  "EM"
 ]
};
export const ICONS: Record<string, string> = {
 "search": "M11 18a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM20 20l-4-4",
 "audit": "M9 4h6v3H9zM7 5.5H5.5V20h13V5.5H17M8.5 12l2 2 4-4M8.5 17h7",
 "target": "M12 20a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM12 12l7-7M16 5h3v3",
 "users": "M9 11a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7zM3 20c0-3.3 2.7-6 6-6s6 2.7 6 6M16 4.3a3.5 3.5 0 0 1 0 6.4M18 14.5c1.8.8 3 2.6 3 5.5",
 "plan": "M4 6h16v14H4zM4 10h16M8 3v4M16 3v4M8 14h3M8 17h6",
 "tag": "M3 12V4h8l9 9-8 8-9-9zM7.5 8.5h.01",
 "pen": "M12 20l-7-2-2-7 9-9 9 9-9 9zM12 2v8M12 13.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z",
 "voice": "M5 5h14v10H10l-4 4v-4H5zM9 9h6M9 12h4",
 "book": "M4 5c3-1.5 5.5-1.5 8 0v14c-2.5-1.5-5-1.5-8 0zM12 5c2.5-1.5 5-1.5 8 0v14c-3-1.5-5.5-1.5-8 0",
 "story": "M4 4h16v12H8l-4 4zM8 8h8M8 12h5",
 "refresh": "M20 12a8 8 0 0 1-14 5.3M4 12a8 8 0 0 1 14-5.3M18 3v4h-4M6 21v-4h4",
 "company": "M4 20V6l8-3v17M12 9h8v11M7 8h2M7 12h2M7 16h2M15 13h2M15 16h2M2 20h20",
 "box": "M12 3l8 4.5v9L12 21l-8-4.5v-9zM4 7.5l8 4.5 8-4.5M12 12v9",
 "browser": "M3 5h18v14H3zM3 9h18M6 7h.01M9 7h.01",
 "app": "M7 2h10v20H7zM11 18h2",
 "megaphone": "M4 10v4h3l9 5V5l-9 5zM7 14l1.5 5H11l-1.5-5M19 9.5a3 3 0 0 1 0 5",
 "seo": "M10 17a7 7 0 1 0 0-14 7 7 0 0 0 0 14zM15 15l6 6M7 12l2-2 2 2 3-4",
 "chart": "M4 20V4M4 20h16M8 16v-4M12 16V8M16 16v-6",
 "grid": "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
 "camera": "M4 7h4l2-3h4l2 3h4v12H4zM12 16.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z",
 "heart": "M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10z",
 "adv": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM14.5 9.5c-.5-1-1.5-1.5-2.5-1.5-1.4 0-2.5.8-2.5 2s1.1 1.7 2.5 2 2.5.8 2.5 2-1.1 2-2.5 2c-1 0-2-.5-2.5-1.5M12 6.5V8M12 16v1.5",
 "news": "M4 5h13v14H6a2 2 0 0 1-2-2zM17 9h3v8a2 2 0 0 1-2 2M7 8h7M7 12h7M7 15h4",
 "mic": "M9 4a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0zM5 11a7 7 0 0 0 14 0M12 18v3M8 21h8",
 "eye": "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z",
 "shield": "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6zM12 8v5M12 16h.01",
 "inst": "M3 9l9-5 9 5M5 9v9M9.5 9v9M14.5 9v9M19 9v9M3 20h18",
 "leaf": "M5 19c0-9 6-14 15-14 0 9-5 15-14 15zM5 19l8-8",
 "user": "M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21c0-4.4 3.6-8 8-8s8 3.6 8 8",
 "badge": "M4 4h16v16H4zM8 10v6M8 7v.01M12 16v-6M12 13c0-1.7 1-3 2.5-3S17 11 17 13v3",
 "bulb": "M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2V16h5v-.1c0-.8.4-1.5 1-2A6 6 0 0 0 12 3z",
 "stage": "M3 20h18M5 20v-4h14v4M8 16V9M16 16V9M6 9h12M12 4v5",
 "conf": "M4 4h16v10H4zM12 14v4M8 21l4-3 4 3M8 8h8M8 11h5",
 "rocket": "M14 4c3 0 6 3 6 6l-7 7-6-6 7-7zM7 11l-3 1 2 2M13 17l-1 3-2-2M15.5 9.5h.01M6 18l-2 2",
 "desk": "M4 13h16M6 13v7M18 13v7M7 9h10v4H7zM10 9V6h4v3",
 "share": "M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8.6 13.5l6.8 4M15.4 6.5l-6.8 4",
 "poll": "M4 20h16M6 20V10M11 20V5M16 20v-8M20 7l-3-3-3 3",
 "ballot": "M5 10h14v10H5zM9 10V4h6v6M10 7h4M9 15h6",
 "compass": "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18zM15.5 8.5l-2 5-5 2 2-5z"
};
export const FEAT: Record<string, { intro: string; items: [string, string, string][] }> = {
 "brand-strategy": {
  "intro": "Ogni boost parte da una direzione chiara: prima ascoltiamo, poi analizziamo, poi decidiamo insieme la rotta.",
  "items": [
   [
    "Analisi di mercato",
    "search",
    "Studiamo il settore, i concorrenti e le tendenze per capire dove sei oggi e dove puoi arrivare."
   ],
   [
    "Audit della comunicazione",
    "audit",
    "Passiamo in rassegna tutto quello che comunichi, online e offline, per capire cosa funziona e cosa no."
   ],
   [
    "Posizionamento di marca",
    "target",
    "Individuiamo lo spazio che solo il tuo brand può occupare e lo rendiamo riconoscibile."
   ],
   [
    "Definizione dei pubblici",
    "users",
    "Diamo un volto alle persone a cui parli: bisogni, abitudini e canali giusti per raggiungerle."
   ],
   [
    "Piano di comunicazione e marketing",
    "plan",
    "Mettiamo tutto in fila: obiettivi, messaggi, canali, tempi e budget, pronti da attuare."
   ]
  ]
 },
 "brand-identity": {
  "intro": "Diamo al tuo brand un nome, un volto e una voce che si riconoscono al primo sguardo.",
  "items": [
   [
    "Naming",
    "tag",
    "Troviamo nomi che si ricordano, si pronunciano bene e raccontano chi sei."
   ],
   [
    "Logo e identità visiva",
    "pen",
    "Disegniamo marchi e sistemi visivi coerenti, pensati per funzionare ovunque."
   ],
   [
    "Tone of voice e identità verbale",
    "voice",
    "Definiamo come parla il tuo brand: parole, ritmo e stile sempre riconoscibili."
   ],
   [
    "Brand guidelines",
    "book",
    "Raccogliamo regole ed esempi in un manuale chiaro, per usare l’identità senza sbagliare."
   ],
   [
    "Storytelling di marca",
    "story",
    "Trasformiamo valori e storia del brand in un racconto che le persone vogliono ascoltare."
   ],
   [
    "Rebranding",
    "refresh",
    "Rinnoviamo identità che sentono il peso degli anni, senza perdere quello che le rende uniche."
   ],
   [
    "Company profile",
    "company",
    "Presentiamo la tua azienda in un documento curato, efficace e facile da sfogliare."
   ],
   [
    "Packaging",
    "box",
    "Progettiamo confezioni che si fanno notare sullo scaffale e raccontano il prodotto."
   ]
  ]
 },
 "digital-web": {
  "intro": "Costruiamo la casa digitale del tuo brand e la facciamo trovare alle persone giuste.",
  "items": [
   [
    "Siti web e landing page",
    "browser",
    "Progettiamo siti chiari, veloci e facili da usare, pensati per trasformare le visite in contatti."
   ],
   [
    "App",
    "app",
    "Diamo forma ad app intuitive, dall’idea all’interfaccia, con l’utente sempre al centro."
   ],
   [
    "Campagne digital e advertising",
    "megaphone",
    "Pianifichiamo campagne online mirate per portare il messaggio giusto alle persone giuste."
   ],
   [
    "SEO",
    "seo",
    "Ottimizziamo contenuti e struttura per farti trovare quando le persone ti cercano."
   ],
   [
    "Analisi e reportistica",
    "chart",
    "Misuriamo i risultati e li traduciamo in report chiari, per decidere i prossimi passi."
   ]
  ]
 },
 "social-media": {
  "intro": "Ogni giorno, sui social, costruiamo relazioni: contenuti che fermano il pollice e community che restano.",
  "items": [
   [
    "Social media management",
    "grid",
    "Gestiamo i tuoi profili con continuità, cura e uno stile coerente con il brand."
   ],
   [
    "Piani editoriali",
    "plan",
    "Organizziamo i contenuti in calendari chiari, con temi, formati e uscite già decisi."
   ],
   [
    "Contenuti foto, video e reel",
    "camera",
    "Produciamo immagini e video pensati per ogni piattaforma, dal post al reel."
   ],
   [
    "Community management",
    "heart",
    "Rispondiamo, ascoltiamo e coinvolgiamo: trasformiamo i follower in una community."
   ],
   [
    "Social adv",
    "adv",
    "Investiamo il budget in modo mirato per aumentare visibilità, contatti e vendite."
   ],
   [
    "Analisi e reportistica",
    "chart",
    "Leggiamo i numeri dei tuoi canali e li trasformiamo in scelte concrete."
   ]
  ]
 },
 "brand-reputation": {
  "intro": "Proteggiamo e facciamo crescere la fiducia che le persone ripongono nel tuo nome.",
  "items": [
   [
    "Ufficio stampa",
    "news",
    "Scriviamo e diffondiamo comunicati, curiamo i rapporti con le redazioni e le uscite sui media."
   ],
   [
    "Media relations",
    "mic",
    "Costruiamo relazioni solide con giornalisti e testate per dare voce alle tue notizie."
   ],
   [
    "Monitoraggio della reputazione online e offline",
    "eye",
    "Teniamo d’occhio cosa si dice di te, sul web e sui media, per intervenire al momento giusto."
   ],
   [
    "Crisis communication",
    "shield",
    "Prepariamo e gestiamo la comunicazione nei momenti difficili, con lucidità e tempestività."
   ],
   [
    "Comunicazione corporate e istituzionale",
    "inst",
    "Raccontiamo l’impresa a stakeholder, istituzioni e territorio con autorevolezza."
   ],
   [
    "Comunicazione della sostenibilità",
    "leaf",
    "Comunichiamo il tuo impegno ambientale e sociale in modo trasparente e credibile."
   ]
  ]
 },
 "personal-branding": {
  "intro": "Aiutiamo professionisti e manager a raccontarsi con autenticità e a farsi riconoscere nel loro campo.",
  "items": [
   [
    "Analisi del profilo personale",
    "user",
    "Partiamo da chi sei: competenze, obiettivi e immagine attuale, online e offline."
   ],
   [
    "Posizionamento personale",
    "compass",
    "Definiamo il tuo spazio professionale e il messaggio che ti rende unico."
   ],
   [
    "LinkedIn e profili social",
    "badge",
    "Curiamo i tuoi profili perché parlino di te in modo chiaro, coerente e professionale."
   ],
   [
    "Contenuti e thought leadership",
    "bulb",
    "Ti aiutiamo a condividere idee e competenze per diventare un punto di riferimento."
   ],
   [
    "Media training e public speaking",
    "mic",
    "Ti prepariamo a interviste, palchi e telecamere, per parlare con sicurezza."
   ]
  ]
 },
 "event-management": {
  "intro": "Progettiamo e curiamo eventi in ogni dettaglio, perché il tuo messaggio arrivi guardando le persone negli occhi.",
  "items": [
   [
    "Ideazione e concept",
    "bulb",
    "Partiamo da un’idea forte e la trasformiamo in un format coerente con il tuo brand."
   ],
   [
    "Eventi aziendali e istituzionali",
    "stage",
    "Organizziamo eventi interni ed esterni, dalla location alla regia della giornata."
   ],
   [
    "Convegni e congressi",
    "conf",
    "Gestiamo programmi, relatori e ospiti per incontri ordinati e di valore."
   ],
   [
    "Lanci di prodotto",
    "rocket",
    "Creiamo il momento giusto per presentare una novità e farne parlare."
   ],
   [
    "Segreteria organizzativa",
    "desk",
    "Ci occupiamo di inviti, iscrizioni, accrediti e logistica, prima e durante l’evento."
   ],
   [
    "Comunicazione e copertura social dell’evento",
    "share",
    "Raccontiamo l’evento prima, durante e dopo, sui social e sui media."
   ]
  ]
 },
 "comunicazione-politica": {
  "intro": "Accompagniamo candidati e amministrazioni con una comunicazione chiara, credibile e vicina alle persone.",
  "items": [
   [
    "Strategia di comunicazione politica",
    "target",
    "Definiamo messaggi, temi e canali per costruire consenso in modo coerente."
   ],
   [
    "Sondaggi e focus group",
    "poll",
    "Ascoltiamo il territorio per capire opinioni, priorità e bisogni dei cittadini."
   ],
   [
    "Campagne elettorali",
    "ballot",
    "Progettiamo e gestiamo la campagna, dall’identità del candidato al voto."
   ]
  ]
 }
};
export const SVC_CAT: Record<string, string> = {
 "brand-identity": "Brand Identity",
 "digital-web": "Digital & Web",
 "social-media": "Social Media",
 "event-management": "Event Management"
};
export const ILL: Record<string, string> = {
 "comunicazione-politica": "<svg class=\"svc-ill svc-ill--cp\" viewBox=\"-6 -6 136 130\" aria-hidden=\"true\"><path class=\"cp-a\" pathLength=\"1\" d=\"M22 60V108Q22 112 26 112H98Q102 112 102 108V60\"/><path class=\"cp-a\" pathLength=\"1\" d=\"M13 50H111V60H13Z\"/><path class=\"cp-a\" pathLength=\"1\" d=\"M44 55H80\"/><path class=\"cp-a\" pathLength=\"1\" d=\"M50 51V17Q50 14 53 14H71Q74 14 74 17V51\"/><path class=\"cp-a\" pathLength=\"1\" d=\"M56 31L61 36L69 24\"/><path class=\"cp-a\" pathLength=\"1\" d=\"M42 76H82V100H42Z\"/><path class=\"cp-a\" pathLength=\"1\" d=\"M52 88L58 94L72 80\"/></svg>",
 "event-management": "<svg class=\"svc-ill svc-ill--ev\" viewBox=\"-6 -6 136 130\" aria-hidden=\"true\"><path class=\"ev-d\" pathLength=\"1\" d=\"M4 6H120\"/><g transform=\"rotate(-14 19 8)\"><path class=\"bulb beam beam0\" d=\"M13 25L4 52H34L25 25Z\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M19 6V10\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M15 10H23V22H15Z\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M23 22L25 25H13L15 22\"/></g><g transform=\"rotate(-5 48 8)\"><path class=\"bulb beam beam1\" d=\"M42 25L33 52H63L54 25Z\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M48 6V10\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M44 10H52V22H44Z\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M52 22L54 25H42L44 22\"/></g><g transform=\"rotate(5 76 8)\"><path class=\"bulb beam beam2\" d=\"M70 25L61 52H91L82 25Z\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M76 6V10\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M72 10H80V22H72Z\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M80 22L82 25H70L72 22\"/></g><g transform=\"rotate(14 105 8)\"><path class=\"bulb beam beam3\" d=\"M99 25L90 52H120L111 25Z\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M105 6V10\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M101 10H109V22H101Z\"/><path class=\"ev-d\" pathLength=\"1\" d=\"M109 22L111 25H99L101 22\"/></g><path class=\"ev-m\" pathLength=\"1\" d=\"M57 58A5 5 0 0 1 67 58V70A5 5 0 0 1 57 70Z\"/><path class=\"ev-m\" pathLength=\"1\" d=\"M57 62H67M57 66H67\"/><path class=\"ev-m\" pathLength=\"1\" d=\"M62 75V108M62 108L52 112M62 108L72 112\"/><path class=\"ev-s\" pathLength=\"1\" d=\"M2 112H122V119H2Z\"/></svg>",
 "personal-branding": "<svg class=\"svc-ill svc-ill--spot\" viewBox=\"-6 -6 136 130\" aria-hidden=\"true\"><path class=\"lamp\" pathLength=\"1\" d=\"M41 -1H91\"/><path class=\"lamp\" pathLength=\"1\" d=\"M66 -1V11.8\"/><path class=\"lamp\" pathLength=\"1\" d=\"M59 7H73V28H59Z\"/><path class=\"lamp\" pathLength=\"1\" d=\"M73 28L76 32H56L59 28\"/><circle class=\"lamp\" pathLength=\"1\" cx=\"66\" cy=\"14\" r=\"2.2\"/><path class=\"cone\" d=\"M56 32L34 113M76 32L98 113\"/><path class=\"cone\" d=\"M50 30L43 28M82 30L89 28M51 37L45 40M81 37L87 40\"/><ellipse class=\"cone\" cx=\"66\" cy=\"113\" rx=\"32\" ry=\"5\"/><circle class=\"man\" pathLength=\"1\" cx=\"66\" cy=\"64\" r=\"9\"/><path class=\"man\" pathLength=\"1\" d=\"M47 112V96Q47 80 66 80Q85 80 85 96V112\"/></svg>",
 "brand-reputation": "<svg class=\"svc-ill svc-ill--wall\" viewBox=\"-6 -6 136 130\" aria-hidden=\"true\"><path class=\"gr\" pathLength=\"1\" d=\"M2 119H122\"/><path class=\"bk bk0\" d=\"M12 108H36V118H12Z\"/><path class=\"bk bk1\" d=\"M38 108H62V118H38Z\"/><path class=\"bk bk2\" d=\"M64 108H88V118H64Z\"/><path class=\"bk bk3\" d=\"M90 108H114V118H90Z\"/><path class=\"bk bk4\" d=\"M11 96H22V106H11Z\"/><path class=\"bk bk5\" d=\"M24 96H48V106H24Z\"/><path class=\"bk bk6\" d=\"M50 96H74V106H50Z\"/><path class=\"bk bk7\" d=\"M76 96H100V106H76Z\"/><path class=\"bk bk8\" d=\"M102 96H113V106H102Z\"/><path class=\"bk bk9\" d=\"M12 84H36V94H12Z\"/><path class=\"bk bk10\" d=\"M38 84H62V94H38Z\"/><path class=\"bk bk11\" d=\"M64 84H88V94H64Z\"/><path class=\"bk bk12\" d=\"M90 84H114V94H90Z\"/><path class=\"bk bk13\" d=\"M11 72H22V82H11Z\"/><path class=\"bk bk14\" d=\"M24 72H48V82H24Z\"/><path class=\"bk bk15\" d=\"M50 72H74V82H50Z\"/><path class=\"bk bk16\" d=\"M76 72H100V82H76Z\"/><path class=\"bk bk17\" d=\"M102 72H113V82H102Z\"/><path class=\"bk bk18\" d=\"M12 60H36V70H12Z\"/><path class=\"bk bk19\" d=\"M38 60H62V70H38Z\"/><path class=\"bk bk20\" d=\"M64 60H88V70H64Z\"/><path class=\"bk bk21\" d=\"M90 60H114V70H90Z\"/><path class=\"bk bk22\" d=\"M11 48H22V58H11Z\"/><path class=\"bk bk23\" d=\"M24 48H48V58H24Z\"/><path class=\"bk bk24\" d=\"M50 48H74V58H50Z\"/><path class=\"bk bk25\" d=\"M76 48H100V58H76Z\"/><path class=\"bk bk26\" d=\"M102 48H113V58H102Z\"/></svg>",
 "social-media": "<svg class=\"svc-ill svc-ill--ph\" viewBox=\"-6 -6 136 130\" aria-hidden=\"true\"><defs><clipPath id=\"ph-clip\"><rect x=\"35\" y=\"13\" width=\"54\" height=\"99\"/></clipPath></defs><path class=\"phf\" pathLength=\"1\" d=\"M43 2H81Q90.5 2 90.5 11.5V110.5Q90.5 120 81 120H43Q33.5 120 33.5 110.5V11.5Q33.5 2 43 2Z\"/><path class=\"phf\" pathLength=\"1\" d=\"M57 5.5H67A2.5 2.5 0 0 1 67 10.5H57A2.5 2.5 0 0 1 57 5.5Z\"/><path class=\"phf\" pathLength=\"1\" d=\"M54 116H70\"/><g clip-path=\"url(#ph-clip)\"><g class=\"feed\"><circle cx=\"42\" cy=\"18\" r=\"2.5\"/><path d=\"M47 18H62\"/><path d=\"M39 23H85V49H39Z\"/><path d=\"M45 44L54 34L61 41L66 36L77 46\"/><g transform=\"translate(43 54.5)\"><path class=\"hh h0\" d=\"M0 2.2C-3.2 -0.2 -3.4 -2.6 -1.8 -3.3C-0.9 -3.7 -0.2 -3.1 0 -2.4C0.2 -3.1 0.9 -3.7 1.8 -3.3C3.4 -2.6 3.2 -0.2 0 2.2Z\"/></g><path d=\"M48 54.5H70\"/><circle cx=\"42\" cy=\"64\" r=\"2.5\"/><path d=\"M47 64H62\"/><path d=\"M39 69H85V95H39Z\"/><path d=\"M45 90L54 80L61 87L66 82L77 92\"/><g transform=\"translate(43 100.5)\"><path class=\"hh h1\" d=\"M0 2.2C-3.2 -0.2 -3.4 -2.6 -1.8 -3.3C-0.9 -3.7 -0.2 -3.1 0 -2.4C0.2 -3.1 0.9 -3.7 1.8 -3.3C3.4 -2.6 3.2 -0.2 0 2.2Z\"/></g><path d=\"M48 100.5H70\"/><circle cx=\"42\" cy=\"110\" r=\"2.5\"/><path d=\"M47 110H62\"/><path d=\"M39 115H85V141H39Z\"/><path d=\"M45 136L54 126L61 133L66 128L77 138\"/><g transform=\"translate(43 146.5)\"><path class=\"hh h2\" d=\"M0 2.2C-3.2 -0.2 -3.4 -2.6 -1.8 -3.3C-0.9 -3.7 -0.2 -3.1 0 -2.4C0.2 -3.1 0.9 -3.7 1.8 -3.3C3.4 -2.6 3.2 -0.2 0 2.2Z\"/></g><path d=\"M48 146.5H70\"/><circle cx=\"42\" cy=\"156\" r=\"2.5\"/><path d=\"M47 156H62\"/><path d=\"M39 161H85V187H39Z\"/><path d=\"M45 182L54 172L61 179L66 174L77 184\"/><g transform=\"translate(43 192.5)\"><path class=\"hh\" d=\"M0 2.2C-3.2 -0.2 -3.4 -2.6 -1.8 -3.3C-0.9 -3.7 -0.2 -3.1 0 -2.4C0.2 -3.1 0.9 -3.7 1.8 -3.3C3.4 -2.6 3.2 -0.2 0 2.2Z\"/></g><path d=\"M48 192.5H70\"/><circle cx=\"42\" cy=\"202\" r=\"2.5\"/><path d=\"M47 202H62\"/><path d=\"M39 207H85V233H39Z\"/><path d=\"M45 228L54 218L61 225L66 220L77 230\"/><g transform=\"translate(43 238.5)\"><path class=\"hh\" d=\"M0 2.2C-3.2 -0.2 -3.4 -2.6 -1.8 -3.3C-0.9 -3.7 -0.2 -3.1 0 -2.4C0.2 -3.1 0.9 -3.7 1.8 -3.3C3.4 -2.6 3.2 -0.2 0 2.2Z\"/></g><path d=\"M48 238.5H70\"/><circle cx=\"42\" cy=\"248\" r=\"2.5\"/><path d=\"M47 248H62\"/><path d=\"M39 253H85V279H39Z\"/><path d=\"M45 274L54 264L61 271L66 266L77 276\"/><g transform=\"translate(43 284.5)\"><path class=\"hh\" d=\"M0 2.2C-3.2 -0.2 -3.4 -2.6 -1.8 -3.3C-0.9 -3.7 -0.2 -3.1 0 -2.4C0.2 -3.1 0.9 -3.7 1.8 -3.3C3.4 -2.6 3.2 -0.2 0 2.2Z\"/></g><path d=\"M48 284.5H70\"/></g></g></svg>",
 "digital-web": "<svg class=\"svc-ill svc-ill--kb\" viewBox=\"-6 -6 136 130\" aria-hidden=\"true\"><path class=\"fr\" pathLength=\"1\" d=\"M16 4H108V64H16Z\"/><path class=\"fr\" pathLength=\"1\" d=\"M62 64V74M50 74H74\"/><path class=\"cl c1\" pathLength=\"1\" d=\"M26 18H58\"/><path class=\"cl c2\" pathLength=\"1\" d=\"M34 28H80\"/><path class=\"cl c3\" pathLength=\"1\" d=\"M34 38H66\"/><path class=\"cl c4\" pathLength=\"1\" d=\"M26 48H48\"/><path class=\"fr\" pathLength=\"1\" d=\"M8 82H116V119H8Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M11.00 85.0H16.50V90.0H11.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M18.00 85.0H23.50V90.0H18.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M25.00 85.0H30.50V90.0H25.00Z\"/><path class=\"kk kp kp0\" pathLength=\"1\" d=\"M32.00 85.0H37.50V90.0H32.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M39.00 85.0H44.50V90.0H39.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M46.00 85.0H51.50V90.0H46.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M53.00 85.0H58.50V90.0H53.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M60.00 85.0H65.50V90.0H60.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M67.00 85.0H72.50V90.0H67.00Z\"/><path class=\"kk kp kp5\" pathLength=\"1\" d=\"M74.00 85.0H79.50V90.0H74.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M81.00 85.0H86.50V90.0H81.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M88.00 85.0H93.50V90.0H88.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M95.00 85.0H100.50V90.0H95.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M102.00 85.0H113.00V90.0H102.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M11.00 91.5H19.25V96.5H11.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M20.75 91.5H26.25V96.5H20.75Z\"/><path class=\"kk kp kp7\" pathLength=\"1\" d=\"M27.75 91.5H33.25V96.5H27.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M34.75 91.5H40.25V96.5H34.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M41.75 91.5H47.25V96.5H41.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M48.75 91.5H54.25V96.5H48.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M55.75 91.5H61.25V96.5H55.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M62.75 91.5H68.25V96.5H62.75Z\"/><path class=\"kk kp kp2\" pathLength=\"1\" d=\"M69.75 91.5H75.25V96.5H69.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M76.75 91.5H82.25V96.5H76.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M83.75 91.5H89.25V96.5H83.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M90.75 91.5H96.25V96.5H90.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M97.75 91.5H103.25V96.5H97.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M104.75 91.5H113.00V96.5H104.75Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M11.00 98.0H20.80V103.0H11.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M22.30 98.0H27.90V103.0H22.30Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M29.40 98.0H35.00V103.0H29.40Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M36.50 98.0H42.10V103.0H36.50Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M43.60 98.0H49.20V103.0H43.60Z\"/><path class=\"kk kp kp1\" pathLength=\"1\" d=\"M50.70 98.0H56.30V103.0H50.70Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M57.80 98.0H63.40V103.0H57.80Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M64.90 98.0H70.50V103.0H64.90Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M72.00 98.0H77.60V103.0H72.00Z\"/><path class=\"kk kp kp6\" pathLength=\"1\" d=\"M79.10 98.0H84.70V103.0H79.10Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M86.20 98.0H91.80V103.0H86.20Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M93.30 98.0H98.90V103.0H93.30Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M100.40 98.0H113.00V103.0H100.40Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M11.00 104.5H23.83V109.5H11.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M25.33 104.5H31.03V109.5H25.33Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M32.53 104.5H38.23V109.5H32.53Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M39.73 104.5H45.43V109.5H39.73Z\"/><path class=\"kk kp kp4\" pathLength=\"1\" d=\"M46.93 104.5H52.63V109.5H46.93Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M54.13 104.5H59.83V109.5H54.13Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M61.33 104.5H67.03V109.5H61.33Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M68.53 104.5H74.23V109.5H68.53Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M75.73 104.5H81.43V109.5H75.73Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M82.93 104.5H88.63V109.5H82.93Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M90.13 104.5H95.83V109.5H90.13Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M97.33 104.5H113.00V109.5H97.33Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M11.00 111.0H18.62V116.0H11.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M20.12 111.0H27.75V116.0H20.12Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M29.25 111.0H36.88V116.0H29.25Z\"/><path class=\"kk kp kp3\" pathLength=\"1\" d=\"M38.38 111.0H76.50V116.0H38.38Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M78.00 111.0H85.62V116.0H78.00Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M87.12 111.0H94.75V116.0H87.12Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M96.25 111.0H103.88V116.0H96.25Z\"/><path class=\"kk\" pathLength=\"1\" d=\"M105.38 111.0H113.00V116.0H105.38Z\"/></svg>",
 "brand-identity": "<svg class=\"svc-ill svc-ill--pen\" viewBox=\"-6 -6 136 130\" aria-hidden=\"true\"><path class=\"crv\" d=\"M8 104C16 64 40 46 56 62C72 78 94 82 104 66\"/><path class=\"pt\" data-at=\"0\" d=\"M4.5 100.5H11.5V107.5H4.5Z\"/><path class=\"pt\" data-at=\"0.02\" d=\"M8 104L16 64\"/><circle class=\"pt\" data-at=\"0.02\" cx=\"16\" cy=\"64\" r=\"2.6\"/><path class=\"pt\" data-at=\"0.45\" d=\"M40 46L72 78\"/><circle class=\"pt\" data-at=\"0.45\" cx=\"40\" cy=\"46\" r=\"2.6\"/><circle class=\"pt\" data-at=\"0.45\" cx=\"72\" cy=\"78\" r=\"2.6\"/><path class=\"pt\" data-at=\"0.5\" d=\"M52.5 58.5H59.5V65.5H52.5Z\"/><path class=\"pt\" data-at=\"0.99\" d=\"M100.5 62.5H107.5V69.5H100.5Z\"/><g class=\"pen\"><path d=\"M0 0L-12 -24L0 -40L12 -24Z\"/><path d=\"M0 0V-18\"/><circle cx=\"0\" cy=\"-22\" r=\"3.2\"/><path d=\"M-7 -40H7V-50H-7Z\"/></g></svg>",
 "brand-strategy": "<svg class=\"svc-ill svc-ill--bs\" viewBox=\"-6 -6 136 130\" aria-hidden=\"true\"><circle class=\"s1\" pathLength=\"1\" cx=\"52\" cy=\"66\" r=\"42\"/><circle class=\"s1\" pathLength=\"1\" cx=\"52\" cy=\"66\" r=\"27\"/><circle class=\"s2\" pathLength=\"1\" cx=\"52\" cy=\"66\" r=\"12\"/><path class=\"s3\" pathLength=\"1\" d=\"M116 2L54 64\"/><path class=\"s3\" pathLength=\"1\" d=\"M54 64L64 61M54 64L57 54\"/><path class=\"s3\" pathLength=\"1\" d=\"M102 6V16H112\"/><path class=\"s3\" pathLength=\"1\" d=\"M108 0V10H118\"/></svg>"
};
export function svcById(id: string) { return SERVICES.find((s) => s.id === id); }
