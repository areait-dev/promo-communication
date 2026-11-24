export type Member = { n: string; r: string; c: 'b' | 'r'; img?: string; b: string };
export const TEAM: Member[] = [
 {
  "n": "Antonio Caputo",
  "r": "Press Officer",
  "c": "b",
  "img": "/img/team/antonio-caputo.webp",
  "b": "La sua giornata inizia con Morning (Il Post) e finisce quasi sempre con la lettura di una newsletter. In agenzia si dimena tra comunicati stampa, relazioni coi media e la ricerca delle ‘giuste’ parole per dare vita e forma al racconto di ‘imprese’ quotidiane. L’esperienza nella comunicazione politica lo ha reso un osservatore attento dei media e del dibattito pubblico. Quando qualcosa in agenzia sembra complicarsi, torna sempre con un nuovo claim capace di ribaltare la situazione. Del resto, il suo motto resta lo stesso: <strong><em>Yes, we can!</em></strong>"
 },
 {
  "n": "Emanuele Canzonieri",
  "r": "Art Director & Graphic Designer",
  "c": "r",
  "img": "/img/team/emanuele-canzonieri.webp",
  "b": "Frequentatore abituale del bizzarro mondo del <em>Paese delle Meraviglie</em>, vaga tra illustrator e photoshop, alla ricerca del Bianconiglio. Coordina l’identità visiva dei clienti come un discografico alle prese con gli umori dei fratelli Gallagher: <strong><em>“And you know it’s no fun”!</em></strong>"
 },
 {
  "n": "Ausilia Ippolito",
  "r": "Social Media Manager & Content Specialist",
  "c": "b",
  "img": "/img/team/ausilia-ippolito.webp",
  "b": "Puntuale, meticolosa, sempre sul pezzo! In grado di saltare da un account all’altro mantenendo la lucidità e la freddezza di una serial ‘skroller’. Tra le sue skills, la capacità di disinnescare crisi diplomatiche e ideare piani editoriali in grado di prevedere il futuro come nessun altro. In PromoCommunication, la social media manager su cui poter contare."
 },
 {
  "n": "Valentina Brafa",
  "r": "Graphic Designer & Social Media Manager",
  "c": "r",
  "img": "/img/team/valentina-brafa.webp",
  "b": "Tra le palazzine a fuoco riuscirebbe a scontornare anche la scritta al neon di un sexy shop. La più giovane del team, entra in punta di piedi in PromoCommunication apportando creatività, talento e intraprendenza. SMM e Graphic Designer, veneta d’adozione e siciliana d’origine, è la fu-sio-ne perfetta per affrontare le sfide d’agenzia. Tra i suoi hobby sollevare bilancieri e consigliare acquisti impulsivi."
 },
 {
  "n": "Giorgio Candiano",
  "r": "Full Stack Developer | Performance Marketing Specialist",
  "c": "b",
  "img": "/img/team/giorgio-candiano.webp",
  "b": "Tra i gadget speciali di Doraemon c’è la sua calcolatrice magica, sempre pronta ad analizzare dati per dare senso e valore ai numeri del web. Perso nel chill delle campagne adv e del linguaggio in codice, è sempre a caccia delle keywords giuste per non offendere l’algoritmo. Spento il monitor, accende il giradischi: la musica elettronica è l’unico codice che non ha bisogno di debug."
 }
] as Member[];
export const initials = (n: string) => n.split(' ').map((x) => x[0]).join('');
