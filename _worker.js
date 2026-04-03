export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve static assets as-is
    if (path.match(/\.(html|css|js|png|jpg|ico|webmanifest|pdf|md)$/)) {
      return env.ASSETS.fetch(request);
    }

    // Rewrite known routes to index.html, preserving the URL
    if (path === '/resume' || path === '/contact' || path === '/blog' || path.startsWith('/blog/')) {
      const indexUrl = new URL('/index.html', url.origin);
      return env.ASSETS.fetch(new Request(indexUrl, request));
    }

    return env.ASSETS.fetch(request);
  }
};
