/** Invia un form a /api/invia. Lancia un errore con il messaggio da mostrare se qualcosa non va. */
export async function postForm(tipo: "contatti" | "candidatura", fd: FormData): Promise<void> {
  fd.set("tipo", tipo);
  let res: Response;
  try {
    res = await fetch("/api/invia", { method: "POST", body: fd });
  } catch {
    throw new Error("Connessione assente: riprova tra poco.");
  }
  if (res.ok) return;
  if (res.status === 413) throw new Error("Gli allegati sono troppo pesanti.");
  const data = (await res.json().catch(() => null)) as { error?: string } | null;
  throw new Error(data?.error ?? "Invio non riuscito.");
}
