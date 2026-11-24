import Link from "next/link";
import { ViewTransition } from "react";
import { svcById } from "@/data/services";
import { svcHref, vars } from "@/lib/ui";

/**
 * Elenco "Cosa mettiamo in boost". All'hover con il mouse la riga si sposta e l'etichetta "boost your" scorre dentro:
 * è tutto CSS (vedi "Micro-interazioni" in site.css).
 */
export function SvcIndex({ ids }: { ids: string[] }) {
  return (
    <ul className="pc-index">
      {ids.map((id, i) => {
        const s = svcById(id)!;
        return (
          <li key={s.id} className="pc-reveal" style={vars({ "--i": Math.min(i, 3) })}>
            <Link href={svcHref(s.id)}>
              <span className="pc-index__k">boost your</span>
              <ViewTransition name={`svc-title-${s.id}`} share="pc-morph" default="none">
                <span className="pc-index__t">{s.name}</span>
              </ViewTransition>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
