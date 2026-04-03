const blogPosts = {
  'hello-world':          { title: 'Hello, World!',          date: '2026-03-30' },
  'prospective-hindsight':{ title: 'Prospective Hindsight',  date: '2026-03-31' },
  'building-shail-dev':   { title: 'Building shail.dev',     date: '2026-03-31' },
  'zero-per-month':       { title: 'Zero Per Month',         date: '2026-04-02' },
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const blogSlug = url.pathname.match(/^\/blog\/(.+)$/);
    const accept = request.headers.get('Accept') || '';

    if (blogSlug && accept.includes('text/html')) {
      const post = blogPosts[blogSlug[1]];
      if (post) {
        const indexRes = await env.ASSETS.fetch(new Request(new URL('/index.html', url.origin), request));
        const title = `${post.title} — Shail R. Shah`;
        const description = `Published ${post.date} · shail.dev`;
        const postUrl = `https://shail.dev/blog/${blogSlug[1]}`;

        return new HTMLRewriter()
          .on('title', { element: el => el.setInnerContent(title) })
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
