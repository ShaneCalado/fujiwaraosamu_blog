// src/api/blogApi.js

const WP_API_BASE = 'https://wp-backend.161-33-16-49.sslip.io/wp-json/wp/v2/blog_post';

// This site's location number (1, 2, or 3)
const SITE_LOCATION_ID = '3';

// Shared promise cache so Home and Sidebar don't fire duplicate network requests
let allPostsPromise = null;

// Shared helper: Extracts the 11-character YouTube ID
export function getYouTubeId(url) {
  if (!url || typeof url !== 'string') return '';
  const match = url.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  return match ? match[1] : '';
}

// Shared helper: Resolves ACF main_image or WP Featured Image
function getPrimaryImageUrl(wpPost) {
  const mainImg = wpPost.acf?.main_image;
  if (typeof mainImg === 'string' && mainImg.startsWith('http')) {
    return mainImg;
  }
  if (typeof mainImg === 'object' && mainImg?.url) {
    return mainImg.url;
  }
  return wpPost._embedded?.['wp:featuredmedia']?.[0]?.source_url || '';
}

// Shared helper: Normalizes ACF contact_link into 0, 1, 2, etc.
function parseContactLink(raw) {
  if (!raw) return 0;
  const val = typeof raw === 'object' && 'value' in raw ? raw.value : raw;
  const parsed = Number(val);
  if (!Number.isNaN(parsed)) return parsed;

  if (val === 'office-fujiwaraosamu') return 1;
  if (val === 'takarazuka-shukatsu') return 2;
  return 0;
}

// Shared helper: Normalizes ACF tag field into an array of strings, ignoring "-"
function parsePostTags(rawTag) {
  if (!rawTag) return [];
  const rawList = Array.isArray(rawTag) ? rawTag : [rawTag];
  return rawList
    .map((item) => {
      if (!item) return '';
      if (typeof item === 'object') {
        return String(item.label ?? item.value ?? '').trim();
      }
      return String(item).trim();
    })
    .filter((tag) => Boolean(tag) && tag !== '-' && tag !== 'ー' && tag !== '－');
}

// Shared helper: Parses HTML string, strips inline formatting for TOC, and injects IDs into h2-h6
export function extractTocAndInjectIds(htmlString) {
  if (!htmlString) return { contentWithIds: '', tocItems: [] };

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');
  const headings = doc.querySelectorAll('h2, h3, h4, h5, h6');

  const rawItems = [];
  headings.forEach((heading, index) => {
    const text = heading.textContent?.replace(/\s+/g, ' ').trim() || '';
    if (!text) return;

    const level = parseInt(heading.tagName.substring(1), 10);
    const id = heading.id || `toc-heading-${index}`;
    heading.id = id;

    rawItems.push({ id, text, level });
  });

  if (rawItems.length === 0) {
    return { contentWithIds: doc.body.innerHTML, tocItems: [] };
  }

  const minLevel = Math.min(...rawItems.map((i) => i.level));
  const counters = [0, 0, 0, 0, 0];

  const tocItems = rawItems.map((item) => {
    const depth = item.level - minLevel;

    counters[depth] += 1;
    for (let i = depth + 1; i < counters.length; i++) {
      counters[i] = 0;
    }

    for (let i = 0; i < depth; i++) {
      if (counters[i] === 0) counters[i] = 1;
    }

    const sectionNumber = counters.slice(0, depth + 1).join('.');

    return {
      ...item,
      indent: depth,
      sectionNumber,
    };
  });

  return {
    contentWithIds: doc.body.innerHTML,
    tocItems,
  };
}

// 1. Fetch all posts that include SITE_LOCATION_ID ('3') (shared by Home and Sidebar)
export async function fetchAllBlogPosts(forceRefresh = false) {
  if (!allPostsPromise || forceRefresh) {
    allPostsPromise = (async () => {
      const response = await fetch(
        `${WP_API_BASE}?location=${SITE_LOCATION_ID}&_embed&acf_format=standard&per_page=100`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const wpPosts = await response.json();

      // Safety client-side filter in case the server mu-plugin isn't active yet
      const matchingPosts = wpPosts.filter((post) => {
        const locs = post?.acf?.location;
        if (!locs) return false;
        const arr = Array.isArray(locs) ? locs : [locs];
        return arr.some((val) => String(val?.value ?? val) === SITE_LOCATION_ID);
      });

      return matchingPosts.map((post) => {
        const acfPreview = post.acf?.preview_text?.trim();
        const rawText = acfPreview || post.excerpt?.rendered || post.content?.rendered || '';
        const strippedText = rawText.replace(/<[^>]+>/g, '').trim();
        const cleanExcerpt =
          strippedText.length > 220
            ? strippedText.substring(0, 220) + '...'
            : strippedText;

        const imageUrl = getPrimaryImageUrl(post);
        const videoId = getYouTubeId(post.acf?.video_link);
        const videoThumbnailUrl = videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : '';

        const rawPos =
          post.acf?.['リスト上の位置list_position'] ?? post.acf?.list_position;
        const parsedPos = rawPos ? parseInt(String(rawPos), 10) : null;

        return {
          id: post.id,
          slug: post.slug,
          title: post.title?.rendered || 'Untitled',
          excerpt: cleanExcerpt,
          featuredMediaUrl: imageUrl || videoThumbnailUrl || '',
          date: new Date(post.date).toLocaleDateString(),
          rawDate: post.date,
          isTopPost: Boolean(post.acf?.on_top_post_list),
          listPosition:
            parsedPos && parsedPos >= 1 && parsedPos <= 5 ? parsedPos : null,
          contactLink: parseContactLink(post.acf?.contact_link),
          tags: parsePostTags(post.acf?.tag),
          acf: post.acf || {},
        };
      });
    })().catch((err) => {
      allPostsPromise = null; // Reset cache if the request fails so retries work
      throw err;
    });
  }

  return allPostsPromise;
}

// 2. Fetch a single post by slug (only if it includes SITE_LOCATION_ID '3')
export async function fetchSingleBlogPostBySlug(slug) {
  const response = await fetch(
    `${WP_API_BASE}?slug=${encodeURIComponent(slug)}&location=${SITE_LOCATION_ID}&_embed&acf_format=standard`
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const wpPosts = await response.json();
  if (!wpPosts || wpPosts.length === 0) {
    return null;
  }

  const data = wpPosts[0];
  const videoId = getYouTubeId(data.acf?.video_link);
  const imageUrl = getPrimaryImageUrl(data);
  const { contentWithIds, tocItems } = extractTocAndInjectIds(
    data.content?.rendered || ''
  );

  return {
    id: data.id,
    slug: data.slug,
    title: data.title?.rendered || 'Untitled',
    content: contentWithIds,
    toc: tocItems,
    date: new Date(data.date).toLocaleDateString(),
    videoId,
    featuredMediaUrl: imageUrl,
    contactLink: parseContactLink(data.acf?.contact_link),
    tags: parsePostTags(data.acf?.tag),
    acf: data.acf || {},
  };
}