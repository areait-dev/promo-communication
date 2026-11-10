// Pagina "coming soon": immagine di layout + stella che ruota.
// Le coordinate della stella (663,789 84x84) sono riferite all'immagine 2048x1152.
export default function Home() {
  return (
    <main
      aria-label="Promo communication. Creative Agency by Promotergroup. Coming soon."
      className="w-full overflow-hidden leading-[0]"
    >
      {/* Taglia 300px di blu in alto (300/2048 della larghezza) */}
      <div className="stage relative">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 2048 1152"
        role="img"
        aria-labelledby="title"
        className="block h-auto w-full"
      >
        <title id="title">Promo communication — il nuovo sito è in arrivo</title>
        <image href="/layout.jpg" width="2048" height="1152" />
        <rect x="663" y="789" width="84" height="84" fill="#001a6f" />
      </svg>
      <div className="star" aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="663 789 84 84">
          <image href="/layout.jpg" width="2048" height="1152" />
        </svg>
      </div>
      </div>
    </main>
  );
}
