// Client minimale per la REST API di WordPress (headless).
const BASE = process.env.WORDPRESS_URL;

export async function wpFetch<T>(
  path: string,
  init?: RequestInit & { next?: { revalidate?: number; tags?: string[] } },
): Promise<T> {
  if (!BASE) throw new Error("WORDPRESS_URL non configurato (.env.local)");
  const res = await fetch(`${BASE}/wp-json/wp/v2${path}`, {
    next: { revalidate: 60 },
    ...init,
  });
  if (!res.ok) throw new Error(`WP ${res.status} su ${path}`);
  return res.json() as Promise<T>;
}
