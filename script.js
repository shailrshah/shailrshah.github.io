function openMail() {
  document.getElementById('desktop').classList.remove('visible');
  document.getElementById('mailWindow').classList.remove('hidden');
}
function closeMail() {
  document.getElementById('mailWindow').classList.add('hidden');
  document.getElementById('desktop').classList.add('visible');
  document.getElementById('mailDockDot').classList.remove('active');
}
function minimizeMail() {
  document.getElementById('mailWindow').classList.add('hidden');
  document.getElementById('desktop').classList.add('visible');
  document.getElementById('mailDockDot').classList.add('active');
}
function sendMail() {
  var from = document.getElementById('mailFrom');
  var body = document.getElementById('mailBody');
  var subject = document.getElementById('mailSubject');
  var status = document.getElementById('mailStatus');
  from.classList.remove('error'); body.classList.remove('error');
  var hasError = false;
  if (!from.value) { from.classList.add('error'); hasError = true; }
  if (!body.value) { body.classList.add('error'); hasError = true; }
  if (hasError) { status.style.color = 'var(--coral)'; status.textContent = '✗ Please fill in highlighted fields'; return; }
  status.style.color = 'var(--yellow)'; status.textContent = '⏳ Sending...';
  fetch('https://formspree.io/f/xgopkvzk', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
    body: JSON.stringify({ email: from.value, subject: subject.value || "Let's chat!", message: body.value })
  }).then(function(r) {
    if (r.ok) {
      status.style.color = 'var(--green)'; status.textContent = '✓ Message sent!';
      from.value = ''; subject.value = ''; body.value = '';
    } else { status.style.color = 'var(--coral)'; status.textContent = '✗ Failed to send. Try again.'; }
  }).catch(function() { status.style.color = 'var(--coral)'; status.textContent = '✗ Network error. Try again.'; });
}

function animateToContact(startX, startY) {
  var cursor = document.getElementById('fakeCursor');
  var yellowDot = document.querySelector('#window .dot-yellow');
  var r1 = yellowDot.getBoundingClientRect();

  cursor.style.transition = 'none';
  cursor.style.left = (startX || window.innerWidth / 2) + 'px';
  cursor.style.top = (startY || window.innerHeight / 2) + 'px';
  cursor.classList.add('visible');

  setTimeout(function() {
    cursor.style.transition = 'left 0.6s ease, top 0.6s ease';
    cursor.style.left = (r1.left + r1.width / 2) + 'px';
    cursor.style.top = (r1.top + r1.height / 2) + 'px';
  }, 100);

  // Show dot icons on hover
  setTimeout(function() { yellowDot.parentElement.classList.add('hover-fake'); }, 500);

  // Click yellow dot to minimize
  setTimeout(function() { yellowDot.parentElement.classList.remove('hover-fake'); minimizeWindow(); }, 800);

  // Move cursor to contact icon in dock
  setTimeout(function() {
    var mailIcon = document.querySelectorAll('#desktop .desktop-icon')[1];
    var r2 = mailIcon.getBoundingClientRect();
    cursor.style.left = (r2.left + r2.width / 2) + 'px';
    cursor.style.top = (r2.top + r2.height / 2) + 'px';
  }, 1100);

  // Click contact icon
  setTimeout(function() {
    cursor.classList.remove('visible');
    openMail();
  }, 1800);
}

var wasMinimized = false;

function closeWindow() {
  wasMinimized = false;
  document.getElementById('window').classList.add('hidden');
  document.getElementById('desktop').classList.add('visible');
  document.getElementById('dockDot').classList.remove('active');
}
function minimizeWindow() {
  wasMinimized = true;
  document.getElementById('window').classList.add('hidden');
  document.getElementById('desktop').classList.add('visible');
  document.getElementById('dockDot').classList.add('active');
}
function openWindow() {
  document.getElementById('desktop').classList.remove('visible');
  document.getElementById('window').classList.remove('hidden');
  if (!wasMinimized) {
    var groups = document.querySelectorAll('.cmd-group[id^="cmd-"]');
    groups.forEach(function(g) { g.classList.remove('visible'); });
    var delay = 0;
    groups.forEach(function(g, i) {
      delay += (i === 0 ? 100 : 400);
      setTimeout(function() {
        g.classList.add('visible');
        g.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        if (i === groups.length - 1) {
          setTimeout(function() { document.getElementById('terminal').scrollTo({ top: 0, behavior: 'smooth' }); }, 600);
        }
      }, delay);
    });
  }
  wasMinimized = false;
}
function toggleFullscreen() {
  document.getElementById('window').classList.toggle('fullscreen');
}

const fortunes = [
  "The best code is code you don't have to write.",
  "Automate the boring stuff. Build the interesting stuff.",
  "A 57,000 hour problem is just an automation waiting to happen.",
  "Ship fast. Measure everything. Iterate faster.",
  "The best architecture is the one your team can reason about at 2am.",
  "Latency is a feature. Or a bug. Depends which side you're on.",
  "IAM policies: where 'least privilege' meets 'wait, why is this broken?'",
  "Every 98% improvement used to be someone's normal Monday.",
];
let fortuneIdx = 0;

const responses = {
  'help': () => `<div class="cmd-group"><div class="output">
    <div style="color:var(--cyan);margin-bottom:10px;">// available commands — type or click any below</div>
    <div style="display:grid;grid-template-columns:220px 1fr;gap:5px 12px;font-size:12.5px;">
      <span style="color:var(--purple)">sudo hire shail</span><span style="color:var(--dim)">you know you want to</span>
      <span style="color:var(--purple)">man shail</span><span style="color:var(--dim)">the manual page</span>
      <span style="color:var(--purple)">diff junior.sh senior.sh</span><span style="color:var(--dim)">how I've grown</span>
      <span style="color:var(--purple)">ps aux</span><span style="color:var(--dim)">currently running processes</span>
      <span style="color:var(--purple)">cat philosophy.txt</span><span style="color:var(--dim)">engineering principles</span>
      <span style="color:var(--purple)">clear</span><span style="color:var(--dim)">clear this area</span>
    </div>
  </div></div>`,

  'cat philosophy.txt': () => `<div class="cmd-group"><div class="output">
    <div style="color:var(--cyan);margin-bottom:10px;"># engineering_philosophy.txt</div>
    <div style="border-left:3px solid var(--purple);padding-left:14px;display:grid;gap:10px;max-width:72ch;">
      <div><span style="color:var(--yellow)">01.</span> <span style="color:var(--text)"><strong style="color:var(--purple)">Automate or die.</strong> If you do something twice, script it. If you do it three times, build a platform.</span></div>
      <div><span style="color:var(--yellow)">02.</span> <span style="color:var(--text)"><strong style="color:var(--purple)">Measure before you optimize.</strong> Intuition is a hypothesis, not a solution.</span></div>
      <div><span style="color:var(--yellow)">03.</span> <span style="color:var(--text)"><strong style="color:var(--purple)">Design for the on-call engineer at 2am.</strong> Observability and runbooks aren't optional.</span></div>
      <div><span style="color:var(--yellow)">04.</span> <span style="color:var(--text)"><strong style="color:var(--purple)">Own outcomes, not tickets.</strong> Ship code that moves a metric, not just code that ships.</span></div>
      <div><span style="color:var(--yellow)">05.</span> <span style="color:var(--text)"><strong style="color:var(--purple)">Raise the floor, not just the ceiling.</strong> Mentoring someone to promotion scales you further than any PR.</span></div>
    </div>
  </div></div>`,

  'cat /etc/motd': () => `<div class="cmd-group"><div class="output">
    <div style="color:var(--dim);margin-bottom:6px;"># /etc/motd — message of the day</div>
    <div style="color:var(--cyan);font-size:1.05em;line-height:1.8;max-width:68ch;">
      Currently obsessing over: <span style="color:var(--purple)">GenAI infra at scale</span>, <span style="color:var(--purple)">AWS cert prep</span>, and making distributed systems boring in the best way.<br><br>
      <span style="color:var(--dim)">Last login: today &nbsp;|&nbsp; uptime: 8 years &nbsp;|&nbsp; mood: building</span>
    </div>
  </div></div>`,

  'echo $superpower': () => `<div class="cmd-group"><div class="output">
    <div style="color:var(--text);max-width:70ch;line-height:1.8;">
      Finding the <span style="color:var(--coral);font-weight:700;">12GB sidecar</span> nobody knew existed.<br>
      <span style="color:var(--dim);font-size:12px;">// translating: I dig into systems until I find the real bottleneck — not the obvious one.</span>
    </div>
  </div></div>`,

  'whois shail': () => `<div class="cmd-group"><div class="output">
    <div style="color:var(--dim);margin-bottom:8px;">[whois shail.dev]</div>
    <div style="display:grid;grid-template-columns:140px 1fr;gap:5px 12px;font-size:12.5px;">
      <span style="color:var(--purple)">registrant</span><span>Shail R. Shah</span>
      <span style="color:var(--purple)">origin</span><span>Mumbai, India → Boston, MA → Sunnyvale, CA</span>
      <span style="color:var(--purple)">occupation</span><span>SDE II @ Amazon (AGI / AWS)</span>
      <span style="color:var(--purple)">drives</span><span>building things that make other engineers' lives easier</span>
      <span style="color:var(--purple)">known for</span><span>turning "that's just how it works" into "why does it work like this?"</span>
      <span style="color:var(--purple)">currently</span><span>scaling RAG infra, mentoring, interviewing as Bar Raiser</span>
      <span style="color:var(--purple)">status</span><span style="color:var(--green)">OPEN_TO_CONVERSATIONS</span>
    </div>
  </div></div>`,

  'ping recruiter.io': () => `<div class="cmd-group"><div class="output">
    <div style="color:var(--dim);margin-bottom:6px;">PING recruiter.io (acad.shail@gmail.com)</div>
    <div style="line-height:2;font-size:12.5px;">
      <div>64 bytes from <span style="color:var(--cyan)">shail@gmail</span>: icmp_seq=1 ttl=64 time=<span style="color:var(--green)">~4h</span> <span style="color:var(--dim)"># avg response time</span></div>
      <div>64 bytes from <span style="color:var(--cyan)">linkedin/shailrshah</span>: icmp_seq=2 ttl=64 time=<span style="color:var(--green)">~1d</span></div>
      <div style="margin-top:8px;color:var(--yellow)">--- recruiter.io ping statistics ---</div>
      <div>2 packets transmitted, 2 received, <span style="color:var(--green)">0% packet loss</span></div>
      <div style="margin-top:6px;color:var(--text)">→ <a href="mailto:acad.shail[at]gmail.com" data-email="acad.shail@gmail.com" onclick="this.href='mailto:'+this.dataset.email;return true;" style="color:var(--cyan);text-decoration:none;">acad.shail@gmail.com</a> &nbsp;|&nbsp; <a href="https://linkedin.com/in/shailrshah" target="_blank" style="color:var(--cyan);text-decoration:none;">linkedin.com/in/shailrshah</a></div>
    </div>
  </div></div>`,

  'df -h': () => `<div class="cmd-group"><div class="output">
    <div style="display:grid;grid-template-columns:180px 60px 60px 60px 1fr;gap:5px 16px;font-size:12.5px;">
      <span style="color:var(--muted)">Filesystem</span><span style="color:var(--muted)">Size</span><span style="color:var(--muted)">Used</span><span style="color:var(--muted)">Avail</span><span style="color:var(--muted)">Use%</span>
      <span style="color:var(--cyan)">/dev/curiosity</span><span>∞</span><span>∞</span><span>∞</span><span style="color:var(--green)">99% full — always</span>
      <span style="color:var(--cyan)">/dev/meetings</span><span>40h</span><span>5h</span><span>35h</span><span style="color:var(--green)">12% — protected headspace</span>
      <span style="color:var(--cyan)">/dev/focus</span><span>8h</span><span>7h</span><span>1h</span><span style="color:var(--yellow)">87% — deep work blocks</span>
      <span style="color:var(--cyan)">/dev/mentoring</span><span>10h</span><span>8h</span><span>2h</span><span style="color:var(--yellow)">80% — 3 eng to promo</span>
      <span style="color:var(--cyan)">/dev/patience</span><span>100G</span><span>2G</span><span>98G</span><span style="color:var(--green)">2% — nearly unlimited</span>
      <span style="color:var(--cyan)">/dev/coffee</span><span>2L</span><span>2L</span><span>0</span><span style="color:var(--coral)">100% — needs refill</span>
    </div>
  </div></div>`,

  'ps aux': () => `<div class="cmd-group"><div class="output">
    <div style="display:grid;grid-template-columns:50px 60px 1fr;gap:5px 16px;font-size:12.5px;">
      <span style="color:var(--muted)">PID</span><span style="color:var(--muted)">%CPU</span><span style="color:var(--muted)">COMMAND</span>
      <span style="color:var(--green)">1001</span><span style="color:var(--coral)">34%</span><span>rag_service_scaling <span style="color:var(--dim)">[region expansion, 4K TPS]</span></span>
      <span style="color:var(--green)">1002</span><span style="color:var(--yellow)">18%</span><span>aws_cert_prep <span style="color:var(--dim)">[Solutions Architect + GenAI Pro]</span></span>
      <span style="color:var(--green)">1003</span><span style="color:var(--yellow)">15%</span><span>mentoring_loop <span style="color:var(--dim)">[3 direct reports, bar raiser interviews]</span></span>
      <span style="color:var(--green)">1004</span><span>10%</span><span>code_review_daemon <span style="color:var(--dim)">[running 24/7]</span></span>
      <span style="color:var(--green)">1005</span><span>8%</span><span>iam_migration_followup <span style="color:var(--dim)">[5 teams, post-launch]</span></span>
      <span style="color:var(--green)">1337</span><span style="color:var(--dim)">0%</span><span>side_project <span style="color:var(--dim)">[sleeping — for now]</span></span>
      <span style="color:var(--green)">9999</span><span style="color:var(--dim)">0%</span><span>coffee_daemon <span style="color:var(--dim)">[zombie — needs restart]</span></span>
    </div>
  </div></div>`,

  'ssh interests@shail': () => `<div class="cmd-group"><div class="output">
    <div style="color:var(--green);margin-bottom:6px;">Connected to interests@shail — welcome.</div>
    <div style="display:grid;grid-template-columns:160px 1fr;gap:6px 12px;font-size:12.5px;">
      <span style="color:var(--purple)">currently_reading</span><span>System Design Interview Vol. II, anything on distributed tracing</span>
      <span style="color:var(--purple)">hobby_projects</span><span>tinkering with local LLMs, home automation on Raspberry Pi</span>
      <span style="color:var(--purple)">obsessions</span><span>performance tuning, clean APIs, the perfect Makefile</span>
      <span style="color:var(--purple)">outside_the_terminal</span><span>hiking trails in the Bay Area, cooking elaborate weekend meals</span>
      <span style="color:var(--purple)">life_philosophy</span><span>leave systems — and people — better than you found them</span>
    </div>
    <div style="color:var(--dim);margin-top:10px;font-size:12px;">Connection to interests@shail closed.</div>
  </div></div>`,

  'history': () => `<div class="cmd-group"><div class="output" style="font-size:12.5px;line-height:1.9;">
    <div><span style="color:var(--muted)"> 1</span>  <span style="color:var(--dim)">2012</span>  enrolled University of Mumbai — B.E. Information Technology</div>
    <div><span style="color:var(--muted)"> 2</span>  <span style="color:var(--dim)">2016</span>  ./move_to_boston.sh — Northeastern MS CS</div>
    <div><span style="color:var(--muted)"> 3</span>  <span style="color:var(--dim)">2018</span>  git commit -m "First job: Yelp SWE IC2, SF"</div>
    <div><span style="color:var(--muted)"> 4</span>  <span style="color:var(--dim)">2019</span>  built $1B+ ad platform, A/B tested $4M retention lift</div>
    <div><span style="color:var(--muted)"> 5</span>  <span style="color:var(--dim)">2020</span>  ssh amazon@sunnyvale — SDE II, Seller Fulfillment</div>
    <div><span style="color:var(--muted)"> 6</span>  <span style="color:var(--dim)">2021</span>  fixed DynamoDB 5xx — 98% error reduction in prod</div>
    <div><span style="color:var(--muted)"> 7</span>  <span style="color:var(--dim)">2022</span>  saved $11.2M/yr with cancellation workflow</div>
    <div><span style="color:var(--muted)"> 8</span>  <span style="color:var(--dim)">2022</span>  promoted; joined Amazon Ads Insights team</div>
    <div><span style="color:var(--muted)"> 9</span>  <span style="color:var(--dim)">2023</span>  shipped RAG doc gen: 30h → &lt;2min, &gt;95% accuracy</div>
    <div><span style="color:var(--muted)">10</span>  <span style="color:var(--dim)">2024</span>  built no-code analytics platform — 57K analyst hrs saved</div>
    <div><span style="color:var(--muted)">11</span>  <span style="color:var(--dim)">2025</span>  joined AGI/AWS — RAG infra 4K+ TPS, 5-team IAM migration</div>
    <div><span style="color:var(--muted)">12</span>  <span style="color:var(--dim)">now </span>  <span style="color:var(--green)">sudo hire shail</span> <span style="color:var(--dim)"># next command up to you</span></div>
  </div></div>`,

  './contact.sh': () => `<div class="cmd-group"><div class="output">
    <div style="color:var(--green);margin-bottom:8px;">#!/bin/bash — running contact.sh</div>
    <div style="display:grid;grid-template-columns:80px 1fr;gap:6px 12px;">
      <span style="color:var(--purple)">email</span><span><a href="mailto:acad.shail[at]gmail.com" data-email="acad.shail@gmail.com" onclick="this.href='mailto:'+this.dataset.email;return true;" style="color:var(--cyan);text-decoration:none;">acad.shail@gmail.com</a></span>
      <span style="color:var(--purple)">linkedin</span><span><a href="https://linkedin.com/in/shailrshah" target="_blank" style="color:var(--cyan);text-decoration:none;">linkedin.com/in/shailrshah</a></span>
      <span style="color:var(--purple)">phone</span><span style="color:var(--text)">+1 (669) 224-8809</span>
      <span style="color:var(--purple)">location</span><span style="color:var(--text)">Sunnyvale, CA — open to hybrid / remote</span>
    </div>
    <div style="margin-top:10px;color:var(--dim);font-size:12px;">exit 0 — go ahead, reach out. Response time: fast.</div>
  </div></div>`,

  'fortune': () => {
    const f = fortunes[fortuneIdx % fortunes.length];
    fortuneIdx++;
    return `<div class="cmd-group"><div class="output">
      <div style="border-left:3px solid var(--yellow);padding-left:14px;color:var(--text);font-style:italic;max-width:65ch;line-height:1.8;">${f}</div>
      <div style="color:var(--dim);font-size:12px;margin-top:6px;">// run again for another</div>
    </div></div>`;
  },

  'diff junior.sh senior.sh': () => `<div class="cmd-group"><div class="output"><pre style="font-size:12.5px;line-height:1.8;">--- junior.sh
+++ senior.sh
@@ career @@
<span style="color:var(--coral)">- write code that works</span>
<span style="color:var(--green)">+ write code others can maintain, extend, and reason about</span>

<span style="color:var(--coral)">- fix the bug in front of you</span>
<span style="color:var(--green)">+ find why the bug was possible in the first place</span>

<span style="color:var(--coral)">- estimate in hours</span>
<span style="color:var(--green)">+ break down, de-risk, then estimate — and pad for the unknown</span>

<span style="color:var(--coral)">- ask "is this done?"</span>
<span style="color:var(--green)">+ ask "does this move the metric?"</span>

<span style="color:var(--coral)">- avoid the hard conversation</span>
<span style="color:var(--green)">+ have it early, with data, with kindness</span>

<span style="color:var(--coral)">- work alone on hard problems</span>
<span style="color:var(--green)">+ bring in the right people, document the decision, share the win</span></pre>
  </div></div>`,

  'sudo hire shail': () => `__sudo__`,

  'man shail': () => `<div class="cmd-group"><div class="output"><pre style="font-size:12.5px;line-height:1.75;max-width:75ch;">
<span style="color:var(--yellow)">SHAIL(1)                  Engineer Manual                  SHAIL(1)</span>

<span style="color:var(--purple)">NAME</span>
       shail — distributed systems engineer, GenAI builder, team multiplier

<span style="color:var(--purple)">SYNOPSIS</span>
       shail [--role sde2] [--team agi|ads|stores] [--mode build|mentor|review]

<span style="color:var(--purple)">DESCRIPTION</span>
       shail(1) is a high-throughput, low-latency engineer specializing in
       distributed systems, RAG pipelines, and turning toil into automation.
       Optimized for impact at scale. Side effects include: reduced oncall
       burden, faster deploys, and 3 engineers promoted.

<span style="color:var(--purple)">OPTIONS</span>
       --mode build      Outputs: services, platforms, automations
       --mode mentor     Outputs: promotions, better PRs, stronger teams
       --mode review     Outputs: bugs caught early, architecture improvements
       --verbose         Adds metrics to everything (default: on)

<span style="color:var(--purple)">ENVIRONMENT</span>
       YEARS_EXP=8       CURRENT_TPS=4000+    COST_SAVED=$11.2M+
       HRS_SAVED=57000+  ERRORS_REDUCED=98%   TEAMS_UNBLOCKED=5

<span style="color:var(--purple)">BUGS</span>
       Will over-engineer the build system if left unsupervised.
       Occasionally removes 12GB sidecars that "weren't doing anything anyway."

<span style="color:var(--purple)">SEE ALSO</span>
       ping recruiter.io(1), ./contact.sh(1), sudo hire shail(8)

<span style="color:var(--yellow)">Amazon                        2025                        SHAIL(1)</span></pre>
  </div></div>`,

  'cat skills.json': () => `<div class="cmd-group">
    <div class="output"><pre style="line-height:1.7;color:var(--text)">{
  <span style="color:var(--purple)">"languages"</span>:   [<span style="color:var(--yellow)">"Java"</span>, <span style="color:var(--yellow)">"Kotlin"</span>, <span style="color:var(--yellow)">"Python"</span>, <span style="color:var(--yellow)">"TypeScript"</span>],
  <span style="color:var(--purple)">"cloud"</span>:        [<span style="color:var(--yellow)">"ECS"</span>, <span style="color:var(--yellow)">"Lambda"</span>, <span style="color:var(--yellow)">"Step Functions"</span>, <span style="color:var(--yellow)">"S3"</span>, <span style="color:var(--yellow)">"API Gateway"</span>],
  <span style="color:var(--purple)">"genai"</span>:        [<span style="color:var(--yellow)">"RAG pipelines"</span>, <span style="color:var(--yellow)">"LLM integration"</span>, <span style="color:var(--yellow)">"Bedrock"</span>, <span style="color:var(--yellow)">"SageMaker"</span>],
  <span style="color:var(--purple)">"databases"</span>:    [<span style="color:var(--yellow)">"DynamoDB"</span>, <span style="color:var(--yellow)">"MySQL"</span>, <span style="color:var(--yellow)">"Cassandra"</span>, <span style="color:var(--yellow)">"Elasticsearch"</span>],
  <span style="color:var(--purple)">"infra"</span>:        [<span style="color:var(--yellow)">"Terraform"</span>, <span style="color:var(--yellow)">"Kafka"</span>, <span style="color:var(--yellow)">"Spring Boot"</span>, <span style="color:var(--yellow)">"Gradle"</span>],
  <span style="color:var(--purple)">"years_exp"</span>:    <span style="color:var(--coral)">8</span>,
  <span style="color:var(--purple)">"current_role"</span>: <span style="color:var(--yellow)">"SDE II @ Amazon"</span>
}</pre></div>
  </div>`,

  'git log --oneline': () => `<div class="cmd-group">
    <div class="output" style="font-size:12.5px;line-height:1.9;">
      <div><span style="color:var(--coral)">a3f91bc</span> &nbsp;<span style="color:var(--yellow)">(HEAD → mainline)</span> &nbsp;AGI team: RAG service 4K+ TPS, region expansion</div>
      <div><span style="color:var(--coral)">7e2d014</span> &nbsp;Amazon Ads: LLM doc gen service, 57K hrs saved</div>
      <div><span style="color:var(--coral)">1b8a3c5</span> &nbsp;Amazon Stores: Orders API migration, $11.2M savings</div>
      <div><span style="color:var(--coral)">9f4c02a</span> &nbsp;Yelp: $1B+ ad revenue platform, $4M retention win</div>
      <div><span style="color:var(--coral)">3d17e88</span> &nbsp;Northeastern University: MS CS, GPA 3.92</div>
      <div><span style="color:var(--coral)">0c92ab1</span> &nbsp;University of Mumbai: B.E. Information Technology</div>
    </div>
  </div>`,

  'echo $years_xp': () => `<div class="cmd-group"><div class="output"><span style="color:var(--coral);font-size:1.4em;font-weight:700;">8</span></div></div>`,

  'top': () => `<div class="cmd-group">
    <div class="output">
      <div style="color:var(--cyan);margin-bottom:8px;">// top processes by impact</div>
      <div style="display:grid;grid-template-columns:auto auto 1fr;gap:5px 16px;font-size:12.5px;">
        <span style="color:var(--muted)">PID</span><span style="color:var(--muted)">%IMPACT</span><span style="color:var(--muted)">COMMAND</span>
        <span style="color:var(--green)">001</span><span style="color:var(--coral)">86%↓</span><span>region_expansion_automation — launch time 28d→4d</span>
        <span style="color:var(--green)">002</span><span style="color:var(--coral)">90%↓</span><span>analytics_platform — 57K analyst hrs saved/yr</span>
        <span style="color:var(--green)">003</span><span style="color:var(--coral)">98%↓</span><span>dynamo_fix — UI 5xx errors eliminated</span>
        <span style="color:var(--green)">004</span><span style="color:var(--coral)">75%↓</span><span>orders_api_migration — latency + infra cost</span>
        <span style="color:var(--green)">005</span><span style="color:var(--coral)">4.8×</span><span>ecs_sidecar_removal — packaging time 2h28m→33m</span>
        <span style="color:var(--green)">006</span><span style="color:var(--green)">$11.2M</span><span>cancellation_workflow — annual seller cost savings</span>
      </div>
    </div>
  </div>`,

  'uname -a': () => `<div class="cmd-group">
    <div class="output" style="color:var(--text);">
      ShailOS 8.0.0-LTS Amazon-SDE2 #1 SMP Thu Jun 2020 — Sunnyvale, CA x86_64 Java/Kotlin/Python/TypeScript GNU/AWS
    </div>
  </div>`,

  'clear': () => '__clear__',
  'exit': () => '__exit__',
};

// sudo hire shail — auto-resolving flow
function fillCmd(cmd) {
  document.getElementById('termInput').value = cmd;
  runCommand();
}

function renderHTML(html, container, beforeEl) {
  const wrapper = document.createElement('div');
  wrapper.classList.add('dynamic-output');
  wrapper.innerHTML = html;
  wrapper.style.opacity = '0';
  wrapper.style.transform = 'translateY(6px)';
  wrapper.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
  if (beforeEl) {
    container.insertBefore(wrapper, beforeEl);
  } else {
    container.appendChild(wrapper);
  }
  requestAnimationFrame(() => {
    wrapper.style.opacity = '1';
    wrapper.style.transform = 'translateY(0)';
    setTimeout(() => {
      container.scrollTo({ top: container.scrollHeight, behavior: 'smooth' });
    }, 300);
  });
  return wrapper;
}

function runCommand() {
  const input = document.getElementById('termInput');
  const raw = input.value.trim();
  const key = raw.toLowerCase();
  const responseArea = document.getElementById('terminal');
  const inputSection = document.getElementById('cmd-6');

  if (!raw) return;

  const promptHTML = `
    <div class="prompt-line" style="margin-bottom:8px;">
      <span class="p-user">guest</span><span class="p-at">@</span><span class="p-host">shail.dev</span><span class="p-sep">:</span><span class="p-dir">~/resume</span><span class="p-git">mainline</span><span class="p-sym">❯</span>
      <span class="p-cmd">${escapeHtml(raw)}</span>
    </div>`;

  const handler = responses[raw] || responses[key];
  let content;

  if (handler) {
    const result = typeof handler === 'function' ? handler() : handler;
    if (result === '__clear__') {
      responseArea.querySelectorAll('.dynamic-output').forEach(el => el.remove());
      input.value = '';
      return;
    }
    if (result === '__exit__') {
      responseArea.querySelectorAll('.dynamic-output').forEach(el => el.remove());
      input.value = '';
      closeWindow();
      return;
    }
    if (result === '__sudo__') {
      // Step 1: show password prompt
      const step1 = `<div class="cmd-group"><div style="color:var(--dim);line-height:2;">[sudo] password for shail: <span style="letter-spacing:2px;color:var(--muted)">········</span></div></div>`;
      const wrapper = renderHTML(promptHTML + step1, responseArea, inputSection);
      input.value = '';
      input.disabled = true;

      // Step 2: after delay, append the result
      setTimeout(() => {
        const step2 = `<div style="line-height:1.9;margin-top:6px;">
          <div style="color:var(--dim);margin-bottom:6px;">Verifying…</div>
          <div style="color:var(--green);font-size:1.1em;font-weight:700;">✓ Password accepted. Great choice.</div>
          <div style="margin-top:10px;color:var(--text);line-height:1.8;">
            Initiating <span style="color:var(--purple)">hire_shail</span> sequence…
            <div style="display:grid;grid-template-columns:auto auto;gap:2px 12px;width:fit-content;margin-top:6px;">
              <span>→ Checking calendar availability</span><span style="color:var(--green)">[ open ]</span>
              <span>→ Validating enthusiasm</span><span style="color:var(--green)">[ high ]</span>
              <span>→ Confirming fit</span><span style="color:var(--green)">[ excellent ]</span>
            </div><br>
            Next step: <a href="mailto:acad.shail[at]gmail.com" data-email="acad.shail@gmail.com" onclick="this.href='mailto:'+this.dataset.email;return true;" style="color:var(--cyan);text-decoration:none;">acad.shail@gmail.com</a>
          </div>
        </div>`;
        wrapper.innerHTML += step2;
        var terminal = document.getElementById('terminal');
        terminal.scrollTo({ top: terminal.scrollHeight, behavior: 'smooth' });
        input.disabled = false;
        input.focus({ preventScroll: true });
      }, 900);
      return;
    }
    content = result;
  } else {
    content = `<div class="cmd-group"><div class="error-line">bash: <span>${escapeHtml(raw)}</span>: command not found &nbsp; // try <span style="color:var(--cyan)">help</span></div></div>`;
  }

  renderHTML(promptHTML + content, responseArea, inputSection);
  input.value = '';
}


function escapeHtml(s) {
  return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

document.getElementById('termInput').addEventListener('keydown', e => {
  if (e.key === 'Enter') runCommand();
});

(function tickClock() {
  var el = document.getElementById('menuClock');
  function update() {
    var d = new Date();
    el.textContent = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) + '  ' + d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  }
  update();
  setInterval(update, 10000);
})();

(function autoOpen() {
  var cursor = document.getElementById('fakeCursor');
  var icon = document.querySelector('#desktop .desktop-icon');
  var rect = icon.getBoundingClientRect();
  var tx = rect.left + rect.width / 2;
  var ty = rect.top + rect.height / 2;

  // Start cursor at center of screen
  cursor.style.left = (window.innerWidth / 2) + 'px';
  cursor.style.top = (window.innerHeight / 2) + 'px';
  cursor.classList.add('visible');

  // Animate cursor to icon
  cursor.style.transition = 'left 0.5s ease, top 0.5s ease, opacity 0.3s';
  setTimeout(function() {
    cursor.style.left = tx + 'px';
    cursor.style.top = ty + 'px';
  }, 200);

  // Click effect then open
  setTimeout(function() {
    icon.style.transform = 'translateY(-4px)';
    icon.style.color = 'var(--cyan)';
  }, 800);

  setTimeout(function() {
    cursor.classList.remove('visible');
    icon.style.transform = '';
    icon.style.color = '';
    openWindow();
  }, 1100);
})();
