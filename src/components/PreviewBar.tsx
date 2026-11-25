import { draftMode } from "next/headers";

/**
 * Barra visibile solo in anteprima (Draft Mode): ricorda che si stanno vedendo le bozze di WordPress e permette di uscire.
 * Il pulsante è un form GET, non un link, perché i link vengono precaricati e chiuderebbero l'anteprima da soli.
 */
export async function PreviewBar() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;
  return (
    <aside className="pc-preview" role="status">
      <span>Anteprima: stai vedendo anche le bozze di WordPress.</span>
      <form action="/api/preview/esci" method="get">
        <button type="submit" className="pc-preview__btn">
          Esci dall&apos;anteprima
        </button>
      </form>
    </aside>
  );
}
