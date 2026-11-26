export type Block = { img?: string; imgs?: string[]; cap?: string; fit?: string; pair?: boolean };
export type Project = {
  id: string;
  name: string;
  client: string;
  kind: string;
  cats: string[];
  /** Settore del cliente (es. Agroalimentare, Sanità). */
  settore?: string;
  /** Un progetto è pubblicato se ha il materiale (anteprima): solo questi compaiono nel sito. */
  published: boolean;
  img?: string;
  cover?: string;
  intro?: string;
  work?: string;
  tags?: string[];
  blocks?: Block[];
  soon?: boolean;
  o: number;
  /** Larghezza e altezza dei file immagine, per indirizzo: servono a next/image (le dà WordPress). */
  dims?: Record<string, [number, number]>;
  [k: string]: unknown;
};
/** Tutti i progetti, anche quelli non ancora pubblicati. */
export const ALL_PROJECTS: Project[] = [
 {
  "id": "cultivar",
  "published": false, /* senza anteprima: nascosto da lista, filtri e pager */
  /* TODO(settore): non ricavabile dai contenuti, da confermare con il team */
  "settore": undefined,
  "name": "Cultivar",
  "client": "Cultivar",
  "kind": "Progetto in arrivo",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media",
   "Shooting foto/video"
  ],
  "tags": [
   "Brand Identity",
   "Social Media",
   "Web",
   "Shooting foto/video"
  ],
  "soon": true,
  "o": 24
 },
 {
  "id": "tenuta-macconi",
  "published": false, /* senza anteprima: nascosto da lista, filtri e pager */
  /* TODO(settore): non ricavabile dai contenuti, da confermare con il team */
  "settore": undefined,
  "name": "Tenuta Macconi",
  "client": "Tenuta Macconi",
  "kind": "Progetto in arrivo",
  "cats": [
   "Digital & Web",
   "Social Media"
  ],
  "tags": [
   "Social Media",
   "Sito web"
  ],
  "soon": true,
  "o": 23
 },
 {
  "id": "agribadiula",
  "published": false, /* senza anteprima: nascosto da lista, filtri e pager */
  /* TODO(settore): non ricavabile dai contenuti, da confermare con il team */
  "settore": undefined,
  "name": "Agribadiula",
  "client": "Agribadiula",
  "kind": "Progetto in arrivo",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media",
   "Shooting foto/video"
  ],
  "tags": [
   "Brand Identity",
   "Social Media",
   "Sito web",
   "Shooting foto/video"
  ],
  "soon": true,
  "o": 22
 },
 {
  "id": "iside",
  "published": false, /* senza anteprima: nascosto da lista, filtri e pager */
  /* TODO(settore): non ricavabile dai contenuti, da confermare con il team */
  "settore": undefined,
  "name": "Iside",
  "client": "Iside",
  "kind": "Progetto in arrivo",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media",
   "Shooting foto/video",
   "Event Management"
  ],
  "tags": [
   "Brand Identity",
   "Social Media",
   "Sito web",
   "Shooting foto/video",
   "Event Management"
  ],
  "soon": true,
  "o": 21
 },
 {
  "id": "aletheia",
  "published": false, /* senza anteprima: nascosto da lista, filtri e pager */
  /* TODO(settore): non ricavabile dai contenuti, da confermare con il team */
  "settore": undefined,
  "name": "Aletheia",
  "client": "Aletheia",
  "kind": "Progetto in arrivo",
  "cats": [
   "Digital & Web",
   "Social Media"
  ],
  "tags": [
   "Social Media",
   "Sito web"
  ],
  "soon": true,
  "o": 20
 },
 {
  "id": "promo-san",
  "published": false, /* senza anteprima: nascosto da lista, filtri e pager */
  /* TODO(settore): non ricavabile dai contenuti, da confermare con il team */
  "settore": undefined,
  "name": "Promo.San",
  "client": "Promo.San",
  "kind": "Progetto in arrivo",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media"
  ],
  "tags": [
   "Brand Identity",
   "Sito web",
   "Social Media"
  ],
  "soon": true,
  "o": 19
 },
 {
  "id": "promotergroup",
  "published": false, /* senza anteprima: nascosto da lista, filtri e pager */
  /* TODO(settore): non ricavabile dai contenuti, da confermare con il team */
  "settore": undefined,
  "name": "Promotergroup",
  "client": "Promotergroup",
  "kind": "Progetto in arrivo",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media"
  ],
  "tags": [
   "Brand Identity",
   "Sito web",
   "Social Media"
  ],
  "soon": true,
  "o": 18
 },
 {
  "id": "promo-gym",
  "published": false, /* senza anteprima: nascosto da lista, filtri e pager */
  /* TODO(settore): non ricavabile dai contenuti, da confermare con il team */
  "settore": undefined,
  "name": "Promo.Gym",
  "client": "Promo.Gym",
  "kind": "Progetto in arrivo",
  "cats": [
   "Brand Identity"
  ],
  "tags": [
   "Brand Identity"
  ],
  "soon": true,
  "o": 17
 },
 {
  "id": "pure-red",
  "published": true,
  "settore": "Agroalimentare",
  "name": "Pure Red",
  "client": "OP Esperidio",
  "kind": "Brand Identity e lancio",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media",
   "Shooting foto/video"
  ],
  "img": "purered/pr-anteprima",
  "cover": "purered/pr-cover",
  "intro": "Pure Red è il brand con cui OP Esperidio, forte di oltre 30 anni di esperienza, porta nel mondo gli agrumi rossi di Sicilia: un autentico superfood, riconoscibile per gusto e colore.",
  "work": "Per il lancio abbiamo costruito un progetto di comunicazione integrata: brand identity, sito web SEO-oriented, social media management, stand fieristico, shooting fotografici, spot di lancio, grafica del semirimorchio personalizzato e merchandising. Il risultato è un’immagine fresca, potente e subito riconoscibile.",
  "o": 16,
  "tags": [
   "Brand Identity",
   "Web",
   "SEO",
   "Social Media",
   "Shooting foto/video",
   "Merchandising",
   "Stand exhibition"
  ],
  "blocks": [
   {
    "imgs": [
     "purered/pr-logo",
     "purered/pr-colori"
    ],
    "cap": "Logo e palette"
   },
   {
    "img": "purered/pr-video",
    "cap": "Spot di lancio"
   },
   {
    "img": "purered/pr-foto",
    "cap": "Shooting fotografico",
    "fit": "contain"
   },
   {
    "img": "purered/pr-web",
    "cap": "Sito web SEO-oriented"
   },
   {
    "img": "purered/pr-social",
    "cap": "Social media management"
   },
   {
    "img": "purered/pr-truck",
    "cap": "Grafica del semirimorchio",
    "fit": "contain"
   },
   {
    "img": "purered/pr-card",
    "cap": "Biglietti da visita"
   }
  ]
 },
 {
  "id": "esperidio",
  "published": true,
  "settore": "Agroalimentare",
  "name": "OP Esperidio",
  "client": "OP Esperidio Soc. Cons. Agricola",
  "kind": "Rebranding completo",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media",
   "Shooting foto/video"
  ],
  "img": "esperidio/es-anteprima",
  "cover": "esperidio/es-cover",
  "intro": "OP Esperidio è un’organizzazione di produttori siciliani che coltiva, commercializza e distribuisce agrumi per la GDO nazionale e internazionale. Alle pendici dell’Etna ogni frutto è “uno spicchio di Sicilia”, capace di portare nel mondo “l’oro di Sicilia”: qualità, innovazione e sostenibilità.",
  "work": "Per rafforzarne identità e comunicazione abbiamo curato il rebranding del logo, realizzato un sito web SEO-oriented, prodotto shooting fotografici e video, progettato il catalogo prodotti e la grafica di un semirimorchio. Ne gestiamo anche i social media.",
  "o": 15,
  "tags": [
   "Brand Identity",
   "Web",
   "SEO",
   "Social Media",
   "Shooting foto/video",
   "Merchandising",
   "Stand exhibition"
  ],
  "blocks": [
   {
    "imgs": [
     "esperidio/es-logo",
     "esperidio/es-colori"
    ],
    "cap": "Logo e palette"
   },
   {
    "img": "esperidio/es-collage",
    "cap": "Shooting fotografico",
    "fit": "contain"
   },
   {
    "img": "esperidio/es-web",
    "cap": "Sito web SEO-oriented"
   },
   {
    "img": "esperidio/es-social",
    "cap": "Social media management"
   },
   {
    "img": "esperidio/es-sicilia",
    "cap": "L’oro di Sicilia",
    "fit": "contain"
   },
   {
    "img": "esperidio/es-bdv",
    "cap": "Biglietti da visita"
   },
   {
    "img": "esperidio/es-brochure",
    "cap": "Catalogo prodotti"
   },
   {
    "img": "esperidio/es-calendario",
    "cap": "Calendario"
   }
  ]
 },
 {
  "id": "agrisementi",
  "published": true,
  "settore": "Agroalimentare",
  "name": "Agrisementi",
  "client": "Agrisementi",
  "kind": "Rebranding completo",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media",
   "Shooting foto/video"
  ],
  "img": "agrisementi/ag-anteprima",
  "cover": "agrisementi/ag-cover",
  "intro": "Agrisementi produce e commercializza sementi di alta qualità, frutto di un lavoro costante che rispetta standard rigorosi per rispondere alle esigenze della filiera agroalimentare.",
  "work": "Abbiamo curato il rebranding del logo, realizzato un sito web SEO-oriented, uno shooting fotografico, una serie di video interviste e la grafica dei biglietti da visita.",
  "o": 14,
  "tags": [
   "Brand Identity",
   "Web",
   "SEO",
   "Social Media",
   "Event Management",
   "Shooting foto/video"
  ],
  "blocks": [
   {
    "imgs": [
     "agrisementi/ag-logo",
     "agrisementi/ag-colori"
    ],
    "cap": "Logo e palette"
   },
   {
    "img": "agrisementi/ag-web",
    "cap": "Sito web SEO-oriented"
   },
   {
    "img": "agrisementi/ag-catalogo",
    "cap": "Catalogo prodotti"
   },
   {
    "img": "agrisementi/ag-bdv",
    "cap": "Biglietti da visita"
   },
   {
    "img": "agrisementi/ag-schede",
    "cap": "Schede tecniche"
   },
   {
    "img": "agrisementi/ag-social",
    "cap": "Social media management"
   },
   {
    "img": "agrisementi/ag-collage",
    "cap": "Shooting fotografico",
    "fit": "contain"
   }
  ]
 },
 {
  "id": "biocon",
  "published": true,
  "settore": "Agricoltura",
  "name": "Bio.Con",
  "client": "Bio.Con – Biological Concept",
  "kind": "Brand Identity",
  "cats": [
   "Brand Identity",
   "Digital & Web"
  ],
  "img": "biocon/bc-anteprima",
  "cover": "biocon/bc-cover",
  "intro": "Bio.Con (Biological Concept) nasce nel 2021 per promuovere mezzi di controllo biologico in agricoltura come alternativa ai prodotti chimici. Oltre alla vendita offre assistenza tecnica per applicazione e distribuzione, portando agli agricoltori soluzioni innovative.",
  "work": "Per raccontare al meglio la loro missione abbiamo curato l’intera brand identity, realizzato il sito web, la brochure aziendale e la grafica dei biglietti da visita.",
  "o": 13,
  "tags": [
   "Brand Identity",
   "Web",
   "SEO"
  ],
  "blocks": [
   {
    "imgs": [
     "biocon/bc-logo",
     "biocon/bc-colori"
    ],
    "cap": "Logo e palette"
   },
   {
    "img": "biocon/bc-web",
    "cap": "Sito web"
   },
   {
    "img": "biocon/bc-bdv",
    "cap": "Biglietti da visita"
   },
   {
    "img": "biocon/bc-brochure",
    "cap": "Brochure aziendale"
   },
   {
    "img": "biocon/bc-gadget",
    "cap": "Gadget"
   }
  ]
 },
 {
  "id": "parlagreco",
  "published": true,
  "settore": "Agroalimentare",
  "name": "Parlagreco",
  "client": "Azienda Agricola F.lli Parlagreco",
  "kind": "Brand Identity",
  "cats": [
   "Brand Identity",
   "Digital & Web"
  ],
  "img": "parlagreco/pg-anteprima",
  "cover": "parlagreco/pg-cover",
  "intro": "Fondata a Niscemi (CL) nel 1980, l’Azienda Agricola F.lli Parlagreco è cresciuta da impresa familiare a realtà moderna e sostenibile, specializzata nella produzione di pomodori esportati in Italia e in Europa.",
  "work": "La loro storia di autenticità, passione e sacrificio ci ha guidato nello sviluppo di una brand identity coerente, insieme a un sito web SEO-oriented, una brochure aziendale e i biglietti da visita.",
  "o": 12,
  "tags": [
   "Brand Identity",
   "Web",
   "SEO"
  ],
  "blocks": [
   {
    "img": "parlagreco/pg-logo-colori",
    "cap": "Logo e palette",
    "fit": "contain"
   },
   {
    "img": "parlagreco/pg-web",
    "cap": "Sito web SEO-oriented"
   },
   {
    "img": "parlagreco/pg-brochure",
    "cap": "Brochure aziendale"
   },
   {
    "img": "parlagreco/pg-bdv",
    "cap": "Biglietti da visita"
   }
  ]
 },
 {
  "id": "law-deal",
  "published": true,
  "settore": "Legale",
  "name": "Law Deal",
  "client": "Studio Legale Law Deal",
  "kind": "Digital branding",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media"
  ],
  "img": "lawdeal/ld-anteprima",
  "cover": "lawdeal/ld-cover",
  "intro": "Lo Studio Legale Law Deal, iscritto all’Albo degli Avvocati di Milano e fondato nel 2020, assiste oltre 400 aziende con consulenza e tutela in ambito civile, del lavoro, amministrativo, tributario, penale, commerciale, societario e internazionale.",
  "work": "Per valorizzarne l’identità e la presenza sul mercato abbiamo realizzato il logo, un sito web SEO-oriented, la brochure aziendale e una newsletter periodica.",
  "o": 11,
  "tags": [
   "Brand Identity",
   "Web",
   "SEO",
   "Social Media",
   "Newsletter"
  ],
  "blocks": [
   {
    "imgs": [
     "lawdeal/ld-logo",
     "lawdeal/ld-colori"
    ],
    "cap": "Logo e palette"
   },
   {
    "img": "lawdeal/ld-web",
    "cap": "Sito web SEO-oriented"
   },
   {
    "img": "lawdeal/ld-social",
    "cap": "LinkedIn e newsletter",
    "fit": "contain"
   },
   {
    "img": "lawdeal/ld-print",
    "cap": "Brochure e materiali aziendali"
   }
  ]
 },
 {
  "id": "radiologia-carnica",
  "published": true,
  "settore": "Sanità",
  "name": "Radiologia Carnica",
  "client": "Radiologia Carnica – Gruppo E-Health",
  "kind": "Landing page",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media",
   "Shooting foto/video"
  ],
  "img": "radiologia/rc-anteprima",
  "cover": "radiologia/rc-cover",
  "intro": "In Friuli-Venezia Giulia, la Radiologia Carnica è un centro di riferimento per la diagnostica per immagini. Con tecnologie innovative e specialisti qualificati garantisce esami accurati e un’assistenza personalizzata, unendo precisione clinica e attenzione al paziente.",
  "work": "Abbiamo sviluppato la brand identity, il sito web e una landing page per E-Health, e raccontato il centro attraverso una serie di video interviste.",
  "o": 10,
  "tags": [
   "Brand Identity",
   "Web",
   "SEO",
   "Landing page",
   "Shooting foto/video"
  ],
  "blocks": [
   {
    "imgs": [
     "radiologia/rc-logo",
     "radiologia/rc-colori"
    ],
    "cap": "Logo e palette"
   },
   {
    "img": "radiologia/rc-bdv",
    "cap": "Biglietti da visita"
   },
   {
    "img": "radiologia/rc-cartelline",
    "cap": "Cartelline e brochure"
   },
   {
    "img": "radiologia/rc-badge",
    "cap": "Badge"
   },
   {
    "img": "radiologia/rc-social",
    "cap": "Social media",
    "fit": "contain"
   },
   {
    "img": "radiologia/rc-web",
    "cap": "Sito web e landing page E-Health"
   },
   {
    "img": "radiologia/rc-youtube",
    "cap": "Video interviste"
   }
  ]
 },
 {
  "id": "eutonia",
  "published": true,
  "settore": "Sanità",
  "name": "Eutonia",
  "client": "Eutonia Sanità e Salute",
  "kind": "Video corporate",
  "cats": [
   "Social Media",
   "Shooting foto/video"
  ],
  "img": "eutonia/eu-anteprima",
  "cover": "eutonia/eu-cover",
  "intro": "Eutonia Sanità e Salute, nata a Trieste nel 2012, è oggi la più grande realtà di fisioterapia e riabilitazione del Friuli-Venezia Giulia.",
  "work": "Per valorizzarne identità e professionalità abbiamo realizzato uno shooting fotografico e un video corporate che raccontano la loro eccellenza.",
  "o": 9,
  "tags": [
   "Shooting foto/video",
   "Video corporate"
  ],
  "blocks": [
   {
    "img": "eutonia/eu-foto1",
    "cap": "Shooting fotografico"
   },
   {
    "imgs": [
     "eutonia/eu-foto2a",
     "eutonia/eu-foto2b"
    ],
    "cap": "",
    "pair": true
   },
   {
    "img": "eutonia/eu-foto3",
    "cap": ""
   },
   {
    "img": "eutonia/eu-youtube",
    "cap": "Video corporate"
   }
  ]
 },
 {
  "id": "terme-fvg",
  "published": true,
  "settore": "Termale e benessere",
  "name": "Terme FVG",
  "client": "Terme di Arta",
  "kind": "Sito web ed e-health booking",
  "cats": [
   "Digital & Web"
  ],
  "img": "terme/tf-anteprima",
  "cover": "terme/tf-cover",
  "intro": "Nel cuore della Carnia, le Terme di Arta sorgono attorno alla fonte di Acqua Pudia, ricca di zolfo e nota fin dall’epoca romana per le sue proprietà terapeutiche. Oggi Terme FVG offre trattamenti riabilitativi, fitness, servizi estetici e percorsi wellness.",
  "work": "Abbiamo realizzato il sito web e integrato un sistema di prenotazione online, per rendere più semplice l’esperienza degli utenti.",
  "o": 8,
  "tags": [
   "Web",
   "SEO",
   "Plug-in booking"
  ],
  "blocks": [
   {
    "img": "terme/tf-web",
    "cap": "Sito web e prenotazione online"
   }
  ]
 },
 {
  "id": "officine-sociali",
  "published": true,
  "settore": "Sociale",
  "name": "Officine Sociali",
  "client": "Officine Sociali Soc. Coop. Sociale",
  "kind": "Sito web",
  "cats": [
   "Digital & Web"
  ],
  "img": "officine/os-anteprima",
  "cover": "officine/os-cover",
  "intro": "Officine Sociali è una cooperativa con sede a Cassibile (SR) che promuove l’inclusione sociale e lavorativa con progetti a forte impatto sul territorio. Opera senza scopo di lucro e si fonda sul principio di mutualità.",
  "work": "Per valorizzarne missione e attività abbiamo realizzato un sito web strutturato in chiave SEO, pensato per rafforzare la presenza digitale e facilitare l’accesso ai servizi.",
  "o": 7,
  "tags": [
   "Web",
   "SEO"
  ],
  "blocks": [
   {
    "img": "officine/os-web",
    "cap": "Sito web SEO-oriented"
   }
  ]
 },
 {
  "id": "rischio-zero",
  "published": true,
  "settore": "Pubblica amministrazione",
  "name": "Rischio Zero",
  "client": "Protezione Civile – Comune di Ragusa",
  "kind": "Campagna e portale",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media"
  ],
  "img": "rischiozero/rz-anteprima",
  "cover": "rischiozero/rz-cover",
  "intro": "Rischio Zero è il portale crossmediale della Protezione Civile del Comune di Ragusa. La sfida: comunicare la prevenzione in modo originale ma autorevole, e trasformarla in un’esperienza concreta e accessibile a tutti i cittadini, dai bambini agli adulti.",
  "work": "Abbiamo seguito il progetto dall’inizio alla fine, a partire dalla brand identity. Il cuore della campagna è un sito interattivo con guide pratiche e mappe delle aree di attesa, per trovare subito il punto di riferimento più vicino. A supporto, una strategia integrata con social media, campagne di advertising social e display e contenuti interattivi.",
  "o": 6,
  "tags": [
   "Brand Identity",
   "Web",
   "SEO",
   "Social Media",
   "Digital Strategy",
   "Display ADV",
   "Social ADV"
  ],
  "blocks": [
   {
    "imgs": [
     "rischiozero/rz-logo",
     "rischiozero/rz-colori"
    ],
    "cap": "Logo e palette"
   },
   {
    "img": "rischiozero/rz-collage",
    "cap": "Sito web, newsletter e materiali informativi"
   },
   {
    "img": "rischiozero/rz-social",
    "cap": "Social media"
   },
   {
    "img": "rischiozero/rz-map",
    "cap": "Affissioni e mappe delle aree di attesa"
   },
   {
    "img": "rischiozero/rz-youtube",
    "cap": "Canale YouTube"
   }
  ]
 },
 {
  "id": "sagra-pozzallo",
  "published": true,
  "settore": "Eventi",
  "name": "Sagra del Pesce di Pozzallo",
  "client": "Comune di Pozzallo",
  "kind": "Brand Identity ed evento",
  "cats": [
   "Brand Identity",
   "Digital & Web",
   "Social Media",
   "Shooting foto/video",
   "Event Management"
  ],
  "img": "anteprima-pozzallo",
  "cover": "sagra/sp-cover",
  "intro": "Per l’edizione 2023 della Sagra del Pesce, organizzata dal Comune di Pozzallo, la sfida era promuovere l’enogastronomia locale, creando connessioni tra territori e favorendo un turismo esperienziale.",
  "work": "Abbiamo sviluppato la brand identity, il sito web SEO-oriented, la gestione dei social media e l’event management, con il coordinamento delle attività collaterali. Completano il progetto le brochure e uno shooting fotografico per promuovere la manifestazione.",
  "o": 5,
  "tags": [
   "Brand Identity",
   "Web",
   "SEO",
   "Social Media",
   "Event Management",
   "Shooting foto/video"
  ],
  "blocks": [
   {
    "imgs": [
     "sagra/sp-logo",
     "sagra/sp-colori"
    ],
    "cap": "Logo e palette"
   },
   {
    "img": "sagra/sp-cartellone",
    "cap": "Affissioni"
   },
   {
    "img": "sagra/sp-web",
    "cap": "Sito web SEO-oriented"
   },
   {
    "img": "sagra/sp-programma",
    "cap": "Locandine"
   },
   {
    "img": "sagra/sp-depliant",
    "cap": "Depliant"
   },
   {
    "img": "sagra/sp-social",
    "cap": "Social media"
   },
   {
    "img": "sagra/sp-foto",
    "cap": "Shooting fotografico",
    "fit": "contain"
   }
  ]
 },
 {
  "id": "friskura",
  "published": true,
  "settore": "Agroalimentare",
  "name": "Friskura",
  "client": "Friskura",
  "kind": "Brand Identity",
  "cats": [
   "Brand Identity"
  ],
  "img": "friskura/fr-anteprima",
  "cover": "friskura/fr-cover",
  "intro": "Friskura è un e-commerce di ortofrutta fresca e conserve, nato per raccontare freschezza, genuinità e qualità dei prodotti con la comodità di una consegna rapida.",
  "work": "Abbiamo curato l’intera brand identity, creando un’immagine distintiva e coerente con i valori del marchio.",
  "o": 4,
  "tags": [
   "Brand Identity"
  ],
  "blocks": [
   {
    "imgs": [
     "friskura/fr-logo",
     "friskura/fr-colori"
    ],
    "cap": "Logo e palette"
   },
   {
    "img": "friskura/fr-social",
    "cap": "Social media"
   },
   {
    "img": "friskura/fr-bdv",
    "cap": "Biglietti da visita"
   },
   {
    "imgs": [
     "friskura/fr-foto1",
     "friskura/fr-foto2"
    ],
    "cap": "Applicazioni del brand",
    "pair": true
   },
   {
    "img": "friskura/fr-adv",
    "cap": "Packaging"
   }
  ]
 },
 {
  "id": "scalia",
  "published": true,
  "settore": "Agroalimentare",
  "name": "Scalia",
  "client": "Azienda Agricola Scalia",
  "kind": "Storytelling aziendale",
  "cats": [
   "Digital & Web",
   "Social Media",
   "Shooting foto/video"
  ],
  "img": "anteprima-scalia-e1759137661624",
  "cover": "scalia/sc-cover",
  "intro": "Da oltre 30 anni l’Azienda Agricola Scalia porta avanti la tradizione siciliana con prodotti genuini e di qualità. Ad Acate (RG) coltiva con passione i propri terreni per offrire pomodori dal colore brillante e dal gusto autentico.",
  "work": "Per raccontare questa identità abbiamo creato un sito web SEO-oriented, gestito i social media e realizzato un video corporate.",
  "o": 3,
  "tags": [
   "Web",
   "SEO",
   "Social Media",
   "Shooting foto/video"
  ],
  "blocks": [
   {
    "img": "scalia/sc-web",
    "cap": "Sito web SEO-oriented"
   },
   {
    "img": "scalia/sc-social",
    "cap": "Social media"
   },
   {
    "img": "scalia/sc-youtube",
    "cap": "Video corporate"
   }
  ]
 },
 {
  "id": "melb",
  "published": true,
  "settore": "Edilizia",
  "name": "Melb",
  "client": "Melb s.r.l.",
  "kind": "Sito web SEO-oriented",
  "cats": [
   "Digital & Web"
  ],
  "img": "melb/mb-anteprima",
  "cover": "melb/mb-cover",
  "intro": "Melb s.r.l., con sede a Comiso (RG), opera a livello nazionale nel movimento terra, negli sbancamenti, nelle urbanizzazioni e nei lavori edili, con la fornitura completa di materiali per edifici e strutture.",
  "work": "Abbiamo creato un sito web SEO-oriented, progettato per migliorare l’esperienza dell’utente e la ricerca dei servizi, rafforzando la presenza digitale e la competitività dell’azienda.",
  "o": 2,
  "tags": [
   "Web",
   "SEO"
  ],
  "blocks": [
   {
    "img": "melb/mb-web",
    "cap": "Sito web SEO-oriented"
   }
  ]
 },
 {
  "id": "dea-consulting",
  "published": true,
  "settore": "Consulenza",
  "name": "Dea Consulting",
  "client": "Dea Consulting s.r.l.",
  "kind": "Sito web e social",
  "cats": [
   "Digital & Web",
   "Social Media"
  ],
  "img": "dea/dea-anteprima",
  "cover": "dea/dea-cover",
  "intro": "Dea Consulting è specializzata nella consulenza per progetti di facility management e nella gestione integrata di appalti pubblici e privati, al fianco delle imprese che vogliono entrare in questo mercato o consolidarsi.",
  "work": "Abbiamo realizzato un sito web SEO-oriented, curato la gestione di LinkedIn e sviluppato campagne di social adv, rafforzando identità digitale e visibilità nel settore.",
  "o": 1,
  "tags": [
   "Web",
   "SEO",
   "Social Media",
   "Social ADV"
  ],
  "blocks": [
   {
    "img": "dea/dea-web",
    "cap": "Sito web SEO-oriented",
    "fit": "contain"
   },
   {
    "img": "dea/dea-social",
    "cap": "Gestione LinkedIn"
   }
  ]
 }
] as Project[];
/** Solo i progetti pubblicati: è la lista usata da portfolio, servizi, pager e route. */
export const PROJECTS: Project[] = ALL_PROJECTS.filter((p) => p.published);
export const REAL = PROJECTS;
/** Immagine di un progetto: un indirizzo completo (WordPress) resta com'è, un nome locale diventa /img/pf/<nome>.webp. */
export const pImg = (n: string) => (/^(https?:)?\/\//.test(n) || n.startsWith('/') ? n : '/img/pf/' + n + '.webp');
export const projSlug = (p: Project) => p.id;
export function projById(id: string) { return PROJECTS.find((p) => p.id === id); }
