/** Invia un form a /api/invia. Lancia un errore con il messaggio da mostrare se qualcosa non va. */
export async function postForm(tipo: "contatti" | "home" | "candidatura", fd: FormData): Promise<void> {
  fd.set("tipo", tipo);
  let res: Response;
  try {
    res = await fetch("/api/invia", { method: "POST", body: fd });
  } catch {
    throw new Error("Connessione assente: riprova tra poco.");
  }
  if (res.ok) return;
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  throw new Error(data?.error ?? "Invio non riuscito.");
}
