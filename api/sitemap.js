// api/sitemap.js
const SITE_URL = 'https://fujiwaraosamu.com';
const WP_API_URL =
  process.env.VITE_WP_API_URL ||
  'https://wp-backend.161-33-16-49.sslip.io/wp-json/wp/v2/blog_post';

// Set to the location ID used in src/api/blogApi.js (or null if unfiltered)
const SITE_LOCATION_ID = '2';

function escapeXml(str) {
  return String(str).replace(/[<>&'"]/g, (c) => (
    { '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' }[c]
  ));
}

export default async function handler(req, res) {
  try {
    const posts = [];
    let page = 1;
    let totalPages = 1;

    while (page <= totalPages) {
      const locQuery = SITE_LOCATION_ID ? `&location=${SITE_LOCATION_ID}` : '';
      const resPage = await fetch(
        `${WP_API_URL}?per_page=100&page=${page}&_fields=slug,modified_gmt,date_gmt,acf${locQuery}`
      );
      if (!resPage.ok) break;

      const data = await resPage.json();
      if (Array.isArray(data)) posts.push(...data);

      totalPages = Number(resPage.headers.get('X-WP-TotalPages')) || 1;
      page += 1;
    }

    const filtered = SITE_LOCATION_ID
      ? posts.filter((p) => {
          const loc = p?.acf?.location;
          if (!Array.isArray(loc)) return true;
          return loc.some((item) =>
            String(typeof item === 'object' && item !== null ? item.value : item) === SITE_LOCATION_ID
          );
        })
      : posts;

    const latestRaw = filtered[0]?.modified_gmt || filtered[0]?.date_gmt;
    const homeLastMod = latestRaw ? new Date(`${latestRaw}Z`).toISOString() : new Date().toISOString();

    const postUrls = filtered
      .filter((p) => Boolean(p.slug))
      .map((p) => {
        const rawMod = p.modified_gmt || p.date_gmt;
        const lastmod = rawMod ? new Date(`${rawMod}Z`).toISOString() : new Date().toISOString();
        const safeSlug = encodeURIComponent(decodeURIComponent(p.slug));
        return `  <url>
    <loc>${escapeXml(`${SITE_URL}/post/${safeSlug}`)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${SITE_URL}/</loc>
    <lastmod>${homeLastMod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
${postUrls}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(xml);
  } catch (err) {
    console.error('Sitemap error:', err);
    return res.status(500).send('Failed to generate sitemap');
  }
}