/**
 * true sui deploy Preview di Vercel (ramo `stage`, stage.promocommunication.it): lì il sito non deve finire su Google.
 * VERCEL_ENV lo imposta Vercel da solo ("production" | "preview" | "development"). In locale e in produzione e' false.
 * Per forzarlo altrove (es. altro server di prova) basta NOINDEX=1.
 */
export const isPreview = process.env.VERCEL_ENV === "preview" || process.env.NOINDEX === "1";
