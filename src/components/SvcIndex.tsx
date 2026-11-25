import Link from "next/link";
import { ViewTransition } from "react";
import { BOOST_WORD } from "@/data/services";
import { getContent, serviceById } from "@/lib/content";
import { svcHref, vars } from "@/lib/ui";

/**
 * Elenco "Cosa mettiamo in boost". All'hover con il mouse la riga si sposta e l'etichetta "boost your" scorre dentro:
 * è tutto CSS (vedi "Micro-interazioni" in site.css).
 */
export async function SvcIndex() {
  const c = await getContent();
  const list = c.services.homeOrder.map((id) => serviceById(c, id)).filter((s) => s !== undefined);
  return (
    <ul className="pc-index">
      {list.map((s, i) => {
        return (
          <li key={s.id} className="pc-reveal" style={vars({ "--i": Math.min(i, 3) })}>
            <Link href={svcHref(s.id)}>
              <span className="pc-index__k">boost your</span>
              <ViewTransition name={`svc-title-${s.id}`} share="pc-morph" default="none">
                <span className="pc-index__t">{BOOST_WORD[s.id] ?? s.name}</span>
              </ViewTransition>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
