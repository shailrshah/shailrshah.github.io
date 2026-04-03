const blogPosts = {
  'hello-world':           { title: 'Hello, World!',         date: '2026-03-30' },
  'prospective-hindsight': { title: 'Prospective Hindsight', date: '2026-03-31' },
  'building-shail-dev':    { title: 'Building shail.dev',    date: '2026-03-31' },
  'zero-per-month':        { title: 'Zero Per Month',        date: '2026-04-02' },
};

const knownRoutes = new Set(['/', '/resume', '/contact', '/blog']);

function excerpt(md) {
  const text = md
    .replace(/^#.*$/mg, '')
    .replace(/[*_`>#\[\]]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return text.length > 160 ? text.slice(0, 157) + '...' : text;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, '') || '/';
    const blogSlug = path.match(/^\/blog\/([^/.]+)$/);

    // Inject OG tags for blog posts
    if (blogSlug) {
      const post = blogPosts[blogSlug[1]];
      if (post) {
        const [indexRes, mdRes] = await Promise.all([
          env.ASSETS.fetch(new Request(new URL('/index.html', url.origin), request)),
          env.ASSETS.fetch(new Request(new URL(`/blog/${blogSlug[1]}.md`, url.origin), request)),
        ]);
        const md = mdRes.ok ? await mdRes.text() : '';
        const title = `${post.title} — Shail R. Shah`;
        const description = md ? excerpt(md) : `Published ${post.date} · shail.dev`;
        const postUrl = `https://shail.dev/blog/${blogSlug[1]}`;

        return new HTMLRewriter()
          .on('title',                           { element: el => el.setInnerContent(title) })
          .on('meta[property="og:title"]',       { element: el => el.setAttribute('content', title) })
          .on('meta[property="og:description"]', { element: el => el.setAttribute('content', description) })
          .on('meta[property="og:url"]',         { element: el => el.setAttribute('content', postUrl) })
          .on('meta[name="description"]',        { element: el => el.setAttribute('content', description) })
          .transform(indexRes);
      }
      // Unknown blog slug → 404
      return env.ASSETS.fetch(new Request(new URL('/404.html', url.origin), request));
    }

    // Unknown top-level route → 404
    if (!knownRoutes.has(path) && !path.match(/\.[a-z0-9]+$/i)) {
      return env.ASSETS.fetch(new Request(new URL('/404.html', url.origin), request));
    }

    return env.ASSETS.fetch(request);
  }
};
