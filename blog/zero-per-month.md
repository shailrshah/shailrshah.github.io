# Zero Per month

For a while, my personal site was held together with duct tape: GitHub Pages for hosting, Zoho for email, and a vague sense of dread every time I needed to change something. It worked, technically. But it was brittle, fragmented, and — most annoyingly — owned by other people's free tiers.

So I rebuilt it. The result is a stack that costs nothing per month, deploys in seconds, and gives me more control than I had before. Here's what I landed on and why.

---

## The stack

| Layer | Tool | Cost |
|---|---|---|
| Domain | NameCheap | ~$10–15/yr |
| DNS, CDN, hosting | Cloudflare | $0 |
| Email (inbound) | Cloudflare Email Routing | $0 |
| Email (outbound) | Brevo | $0 |
| Mail client | Gmail | $0 |

> **Running cost:** $0/mo. The domain is the only bill, and it's annual.

---

## The domain: just buy it and leave

NameCheap is where I registered `shail.dev`. The management experience is fine, though like most registrars the renewal price is higher than the intro price.

If you want to stay fully in the Cloudflare ecosystem, **Cloudflare Registrar** is worth considering — they sell at wholesale with no markup, so the renewal price matches year one. I may migrate there eventually.

Either way, the only step that matters is pointing your nameservers at Cloudflare. After that, you never touch the registrar again.

![DNS configuration](../assets/blog/zero-per-month/dns.png)

---

## Cloudflare: the backbone of everything

Cloudflare is the part of this stack I'm most enthusiastic about, and not just because it's free. It handles DNS, CDN, SSL, and static hosting — all from a single dashboard.

### Deploying with Cloudflare Pages + GitHub

Connect your GitHub repo, push to `main`, and your site is live globally in about 30 seconds. No pipeline to configure, no cache invalidation to think about.

What I didn't expect to love as much as I do: branch previews. Every feature branch gets its own live URL automatically, which makes reviewing visual changes dramatically easier.

SSL is handled via Let's Encrypt — provisioned and renewed automatically. HTTP/3 and TLS 1.3 out of the box.

![Hosting setup](../assets/blog/zero-per-month/hosting.png)

### Email routing: receiving mail for free

Getting `hi@shail.dev` to land in my Gmail inbox used to require a paid mail host. Cloudflare Email Routing intercepts at the DNS level and forwards to wherever you configure. No third-party mail server, no cost.

![Receiving email](../assets/blog/zero-per-month/receive_email.png)

---

## Brevo: sending as your domain without the spam folder

Receiving is the easy part. The harder problem is sending *from* `hi@shail.dev` via Gmail and having it actually arrive.

Brevo acts as an SMTP relay — a trusted mail server that sends on your behalf, authenticated with your domain. Their free tier covers 300 emails a day, which is more than enough for a personal site. You add SPF, DKIM, and DMARC records to your DNS once; after that, delivery just works.

![Sending email](../assets/blog/zero-per-month/send_email.png)

---

## The full picture

Put together, the data flow looks like this:

| Direction | Flow |
|---|---|
| Site deploys | GitHub push → Cloudflare Pages → live globally in ~30s |
| Inbound email | hi@shail.dev → Cloudflare Email Routing → Gmail |
| Outbound email | Gmail compose → Brevo SMTP → delivered as hi@shail.dev |
| DNS + CDN | Cloudflare sits in front of everything |

One control plane for almost everything. Brevo does one specific job on the side.

---

## Why not AWS?

I considered it. Route 53, S3, CloudFront, SES — AWS has an equivalent for every layer of this stack, and it scales further if you ever need a backend or database.

But for a personal site, the overhead is all wrong. Inbound email forwarding requires a Lambda. The free tier expires after twelve months. SES starts in a sandbox that needs manual approval to leave. The total setup time is measured in hours, not minutes.

The Cloudflare stack took half an hour. If `shail.dev` ever outgrows it, that'll be a good problem to have.

---

## What I got out of this

Beyond the cost savings: simplicity. The old stack required me to remember which service controlled what. Now it's all Cloudflare, with Brevo doing one specific job on the side.

Publishing is frictionless. Writing is frictionless. And I own the domain — which means I own the address where everything lives. Everything else is commodity infrastructure. That's the right way to think about a personal site: the domain is the asset; the rest is just plumbing.