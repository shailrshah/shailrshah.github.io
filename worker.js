const blogPosts = {
  'hello-world':           { title: 'Hello, World!',         date: '2026-03-30' },
  'prospective-hindsight': { title: 'Prospective Hindsight', date: '2026-03-31' },
  'building-shail-dev':    { title: 'Building shail.dev',    date: '2026-03-31' },
  'zero-per-month':        { title: 'Zero Per Month',        date: '2026-04-02' },
};

function excerpt(md) {
  const text = md
    .replace(/^#.*$/mg, '')         // remove headings
    .replace(/[*_`>#\[\]]/g, '')    // remove markdown symbols
    .replace(/\s+/g, ' ')           // collapse whitespace
    .trim();
  return text.length > 160 ? text.slice(0, 157) + '...' : text;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const blogSlug = url.pathname.match(/^\/blog\/([^/.]+)$/);

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
    }

    return env.ASSETS.fetch(request);
  }
};
