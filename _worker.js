export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // Serve static assets as-is
    if (path === '/' || path.match(/\.(html|css|js|png|jpg|jpeg|ico|webmanifest|pdf|md)$/)) {
      return env.ASSETS.fetch(request);
    }

    // Rewrite known routes to index.html
    if (path === '/resume' || path === '/contact' || path === '/blog' || path.startsWith('/blog/')) {
      const indexRequest = new Request(new URL('/index.html', url.origin), request);
      return env.ASSETS.fetch(indexRequest);
    }

    return env.ASSETS.fetch(request);
  }
};
