import { SOCIALS, type SocialId } from "@/data/contact";

/**
 * Icone social: SVG a tratto (viewBox 24, linea arrotondata), come le altre icone del sito.
 * Forme semplificate da Feather Icons (MIT, https://feathericons.com).
 */
const ICONS: Record<SocialId, React.ReactNode> = {
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
};

export function SocialLinks({ className = "" }: { className?: string }) {
  return (
    <ul className={`socials ${className}`}>
      {SOCIALS.map((s) => {
        return (
          <li key={s.id}>
            <a
              href={s.href}
              aria-label={s.name}
              title={s.name}
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="social-ic" viewBox="0 0 24 24" aria-hidden="true">
                {ICONS[s.id]}
              </svg>
            </a>
          </li>
        );
      })}
    </ul>
  );
}
