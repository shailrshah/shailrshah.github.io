# shail.dev

A terminal-themed interactive resume and personal blog built with vanilla HTML, CSS, and JS.

**Live at:** [shail.dev](https://shail.dev)

## Features

- macOS-style desktop with dock, window chrome, and animated cursor
- Resume rendered as terminal commands (`whoami`, `cat summary.txt`, `./print_experience.sh`, etc.)
- Interactive command input with easter eggs (`sudo hire shail`, `man shail`, `diff junior.sh senior.sh`, and more)
- Blog with markdown rendering — posts listed in a Finder-style window, sorted by date
- Deep links — `/resume`, `/contact`, `/blog`, `/blog/:slug` all work as direct URLs
- Per-post OG tags for rich link previews on WhatsApp, Slack, iMessage, etc.
- Built-in contact form via mail window
- Single-window focus — opening an app minimizes others
- Mobile responsive with safe area support
- Print-friendly styles

## Structure

```
index.html        — HTML markup
style.css         — all styles
script.js         — interactive commands, animations, blog, mail form
worker.js         — Cloudflare Worker for OG tag injection on blog posts
wrangler.jsonc    — Cloudflare Workers config
blog/             — markdown blog posts
assets/           — favicon, app icons, images, and blog images
```

## Adding a blog post

1. Add a `.md` file to `blog/`
2. Register it in the `blogPosts` array in `script.js`:
   ```js
   { file: 'my-post.md', title: 'My Post', date: 'YYYY-MM-DD' }
   ```
3. Register it in the `blogPosts` map in `worker.js`:
   ```js
   'my-post': { title: 'My Post', date: 'YYYY-MM-DD' }
   ```

## Run locally

```bash
mise exec node@20 -- wrangler pages dev . --port 8080
```

Or without Wrangler (deep links won't work):

```bash
python3 -m http.server 8080
```

## Deploy

Pushes to `master` auto-deploy via Cloudflare Workers CI. Feature branches get preview URLs automatically.
