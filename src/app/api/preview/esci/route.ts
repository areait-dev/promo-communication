import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

/** Esce dall'anteprima delle bozze e torna alla home. Si apre dal pulsante della barra di anteprima (form, non link: niente prefetch). */
export async function GET() {
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}
