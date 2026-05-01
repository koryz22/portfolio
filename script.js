/* ═══════════════════════ SPLASH ═══════════════════════ */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('splash').classList.add('hidden');
    setTimeout(() => { document.getElementById('splash').style.display = 'none'; }, 500);
    initScrollObserver();
  }, 1200);
});

/* ═══════════════════════ SCROLL ANIM ═══════════════════════ */
let animObserver = null;
function initScrollObserver() {
  if (animObserver) animObserver.disconnect();
  animObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.anim').forEach(el => animObserver.observe(el));
}

/* ═══════════════════════ NAV DROPDOWN ═══════════════════════ */
const navDropdown = document.getElementById('navDropdown');
const menuBtn = document.getElementById('menuBtn');
const menuBtnClose = document.getElementById('menuBtnClose');

function setNavOpen(open) {
  navDropdown.classList.toggle('open', open);
  document.body.classList.toggle('nav-menu-open', open);
  menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
  navDropdown.setAttribute('aria-hidden', open ? 'false' : 'true');
}

menuBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  setNavOpen(!navDropdown.classList.contains('open'));
});
if (menuBtnClose) {
  menuBtnClose.addEventListener('click', () => setNavOpen(false));
}
document.querySelectorAll('.nav-dropdown-item').forEach((item) => {
  item.addEventListener('click', () => {
    setNavOpen(false);
    navigateTo(item.dataset.page);
  });
});
document.addEventListener('click', (e) => {
  if (!navDropdown.classList.contains('open')) return;
  if (navDropdown.contains(e.target)) return;
  if (menuBtn && menuBtn.contains(e.target)) return;
  setNavOpen(false);
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') setNavOpen(false);
});

/* ═══════════════════════ TOPBAR CLOCK — time / date / temp (Watch-style stack in bar) ═══════════════════════ */
(function initTopbarWidget() {
  const clockRoots = document.querySelectorAll('.js-topbar-clock');
  const timeWraps = document.querySelectorAll('.js-widget-time');
  const timeLeads = document.querySelectorAll('.js-time-lead');
  const timeTails = document.querySelectorAll('.js-time-tail');
  const dateEls = document.querySelectorAll('.js-widget-date');
  const tempEls = document.querySelectorAll('.js-widget-temp');
  if (!timeWraps.length || !dateEls.length || !tempEls.length) return;

  const TZ = 'America/Los_Angeles';
  const time12 = /^(\d{1,2}):(\d{2})\s*(AM|PM)$/i;

  function tickClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: TZ,
    });
    const weekday = now.toLocaleDateString('en-US', { weekday: 'short', timeZone: TZ });
    const monDay = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: TZ });
    const dateStr = (weekday + ', ' + monDay).toUpperCase();
    const iso = now.toISOString();
    const m = timeStr.match(time12);
    if (m) {
      const tail = m[2] + ' ' + m[3].toUpperCase();
      timeLeads.forEach((el) => { el.textContent = m[1]; });
      timeTails.forEach((el) => { el.textContent = tail; });
      timeWraps.forEach((w) => w.classList.remove('topbar-clock-time--plain'));
    } else {
      timeLeads.forEach((el) => { el.textContent = timeStr; });
      timeTails.forEach((el) => { el.textContent = ''; });
      timeWraps.forEach((w) => w.classList.add('topbar-clock-time--plain'));
    }
    dateEls.forEach((el) => { el.textContent = dateStr; });
    clockRoots.forEach((root) => { root.dateTime = iso; });
  }
  tickClock();
  setInterval(tickClock, 1000);

  async function refreshTemp() {
    tempEls.forEach((el) => { el.textContent = '…'; });
    let t = '—°';
    try {
      const url =
        'https://api.open-meteo.com/v1/forecast?latitude=37.7797&longitude=-121.9830' +
        '&current=temperature_2m&timezone=' +
        encodeURIComponent(TZ) +
        '&temperature_unit=fahrenheit';
      const res = await fetch(url);
      if (!res.ok) throw new Error('wx');
      const data = await res.json();
      t = Math.round(data.current.temperature_2m) + '°';
    } catch { /* keep —° */ }
    tempEls.forEach((el) => { el.textContent = t; });
  }
  refreshTemp();
  setInterval(refreshTemp, 10 * 60 * 1000);
})();

document.querySelectorAll('[data-nav]').forEach(el => {
  el.addEventListener('click', () => navigateTo(el.dataset.nav));
  el.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      navigateTo(el.dataset.nav);
    }
  });
});

/* ═══════════════════════ URL ROUTING ═══════════════════════ */
const PAGES = ['home', 'projects', 'values', 'testimony', 'contact'];
// History API path rewriting only works on http(s); file:// opaque origin throws SecurityError.
const ROUTING_ENABLED = location.protocol === 'http:' || location.protocol === 'https:';

function pageToPath(pageId) {
  return pageId === 'home' ? '/' : '/' + pageId;
}
function pathToPage(path) {
  const seg = (path || '/').replace(/^\/+|\/+$/g, '').toLowerCase();
  if (!seg) return 'home';
  return PAGES.includes(seg) ? seg : 'home';
}

// Sync initial active page with the URL (runs synchronously, before splash hides)
(function initRouteFromUrl() {
  if (!ROUTING_ENABLED) return;
  const pageId = pathToPage(location.pathname);
  if (pageId !== 'home') {
    const next = document.getElementById('page-' + pageId);
    const cur = document.querySelector('.page.active');
    if (next && cur && next !== cur) {
      cur.classList.remove('active');
      next.classList.add('active');
    }
  }
  // Seed history state so popstate always has a known page to fall back to.
  try {
    history.replaceState({ page: pageId }, '', pageToPath(pageId));
  } catch (e) { /* non-http origin — routing disabled */ }
})();

if (ROUTING_ENABLED) {
  window.addEventListener('popstate', (e) => {
    const pageId = (e.state && e.state.page) || pathToPage(location.pathname);
    navigateTo(pageId, { updateHistory: false });
  });
}

/* ═══════════════════════ PAGE NAV ═══════════════════════ */
let txOutTimer = null;
let txInTimer = null;
function scrollPageToTop() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    window.scrollTo(0, 0);
    return;
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function navigateTo(pageId, opts) {
  opts = opts || {};
  const next = document.getElementById('page-' + pageId);
  if (!next) return;
  const cur = document.querySelector('.page.active');
  if (next === cur) {
    scrollPageToTop();
    return;
  }
  if (opts.updateHistory !== false && ROUTING_ENABLED) {
    const path = pageToPath(pageId);
    if (location.pathname !== path) {
      try {
        history.pushState({ page: pageId }, '', path);
      } catch (e) { /* non-http origin — skip URL update */ }
    }
  }
  // Cancel any in-flight transition so rapid clicks feel instant.
  if (txOutTimer) { clearTimeout(txOutTimer); txOutTimer = null; }
  if (txInTimer)  { clearTimeout(txInTimer);  txInTimer = null; }
  document.querySelectorAll('.page.tx-out, .page.tx-in').forEach(p => {
    p.classList.remove('tx-out', 'tx-in');
  });

  const OUT_MS = 150;
  const IN_MS = 220;

  cur.classList.add('tx-out');

  txOutTimer = setTimeout(() => {
    txOutTimer = null;
    cur.classList.remove('active', 'tx-out');
    next.classList.add('active', 'tx-in');
    window.scrollTo(0, 0);
    next.querySelectorAll('.anim').forEach(el => el.classList.remove('visible'));

    txInTimer = setTimeout(() => {
      txInTimer = null;
      next.classList.remove('tx-in');
      initScrollObserver();
    }, IN_MS);
  }, OUT_MS);
}
document.getElementById('exploreProjBtn').addEventListener('click', () => navigateTo('projects'));

document.querySelectorAll('.topbar-nav a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    setNavOpen(false);
    navigateTo(link.dataset.page);
  });
});

/* ═══════════════════════ THEME ═══════════════════════ */
function setupThemeToggle(c) {
  c.querySelectorAll('span').forEach(span => {
    span.addEventListener('click', () => {
      const m = span.dataset.mode;
      document.documentElement.setAttribute('data-theme', m);
      try { localStorage.setItem('theme', m); } catch (e) {}
      document.querySelectorAll('.theme-toggle span').forEach(s => {
        s.className = s.dataset.mode === m ? 'active-theme' : 'inactive-theme';
      });
    });
  });
}
document.querySelectorAll('.theme-toggle').forEach(setupThemeToggle);
(function syncToggleToCurrentTheme() {
  const current = document.documentElement.getAttribute('data-theme') || 'light';
  document.querySelectorAll('.theme-toggle span').forEach(s => {
    s.className = s.dataset.mode === current ? 'active-theme' : 'inactive-theme';
  });
})();

/* ═══════════════════════ TYPEWRITER ═══════════════════════ */
const titles = ['software engineer', 'keyboard enthusiast', 'part-time dog sitter'];
const typeEl = document.getElementById('typewriterText');
let tIdx = 0, cIdx = 0, deleting = false;
function typewriterTick() {
  const t = titles[tIdx];
  if (!deleting) {
    typeEl.textContent = t.substring(0, cIdx + 1); cIdx++;
    if (cIdx === t.length) { setTimeout(() => { deleting = true; typewriterTick(); }, 3500); return; }
    setTimeout(typewriterTick, 80 + Math.random() * 40);
  } else {
    typeEl.textContent = t.substring(0, cIdx - 1); cIdx--;
    if (cIdx === 0) { deleting = false; tIdx = (tIdx + 1) % titles.length; setTimeout(typewriterTick, 400); return; }
    setTimeout(typewriterTick, 40 + Math.random() * 20);
  }
}
setTimeout(typewriterTick, 1800);

/* ═══════════════════════ KEYBOARD (inline logic) ═══════════════════════ */
const kbInfo = {
  esc:   { tag: "BIO",             val: "Kory Zhang",                       desc: "full-stack, architect, designer" },
  tab:   { tag: "currently listening to", val: "Get Your Wish - Porter Robinson", desc: "" },
  caps:  { tag: "unmapped",        val: "—",  desc: "" },
  "shift-l": { tag: "currently playing", val: "Red Dead Redemption 2", desc: "" },
  "shift-r": { tag: "Spoken Languages", val: "English (Native Proficiency), Mandarin Chinese (Professional Proficiency)", desc: "" },
  ctrl:  { tag: "currently reading", val: "Shoe Dog — Phil Knight", desc: "" },
  opt:   { tag: "unmapped",        val: "—",  desc: "" },
  loc:   { tag: "location",        val: "Bay Area, CA", desc: "" },
  uci:   { tag: "education",       val: "UC Irvine '24", desc: "" },
  role:  { tag: "field of study",  val: "Software Engineer", desc: "" },
  interests: { tag: "Interests",   val: "Guitar, Skiing, Basketball, Gaming, Running, Speed Typing", desc: "" },
  py:    { tag: "language", val: "Python", desc: "" },
  cpp:   { tag: "language", val: "C++", desc: "" },
  csh:   { tag: "language", val: "C#", desc: "" },
  jv:    { tag: "language", val: "Java", desc: "" },
  ts:    { tag: "language", val: "TypeScript", desc: "" },
  h:     { tag: "language", val: "HTML, CSS, JavaScript", desc: "" },
  sq:    { tag: "language", val: "SQL", desc: "" },
  yaml:  { tag: "tool", val: "YAML", desc: "" },
  pypo:  { tag: "tool", val: "Postman", desc: "" },
  re:    { tag: "tool", val: "React", desc: "" },
  bs:    { tag: "tool", val: "Bootstrap", desc: "" },
  lwc:   { tag: "tool", val: "Lucid, Lightning Web Components", desc: "" },
  az:    { tag: "tool", val: "Azure, AWS", desc: "" },
  sf:    { tag: "tool", val: "Salesforce, Splunk, Slack", desc: "" },
  fg:    { tag: "tool", val: "Figma, Framer", desc: "" },
  gi:    { tag: "tool", val: "Git", desc: "" },
  ji:    { tag: "tool", val: "Jira", desc: "" },
  cert:  { tag: "certifications", val: "Salesforce Platform Developer I (2025), Salesforce Agentforce Specialist (2025)", desc: "" },
};

const kbKeyMap = {
  Escape:'esc','1':'py','2':'cpp','3':'csh','4':'jv','5':'ts','6':'h','7':'sq',
  '8':'blank','9':'blank','0':'blank','-':'blank','_':'blank','=':'blank','+':'blank',Backspace:'uci',
  Tab:'tab',Enter:'role',CapsLock:'caps',' ':'interests',
  ShiftLeft:'shift-l',ShiftRight:'shift-r',Control:'ctrl',Alt:'opt',Meta:'loc',
  'q':'blank','w':'blank','e':'blank','r':'re','t':'blank','y':'yaml',
  'u':'blank','i':'blank','o':'blank','p':'pypo','[':'blank',']':'blank','{':'blank','}':'blank',
  '\\':'blank','|':'blank',
  'a':'az','s':'sf','d':'blank','f':'fg','g':'gi','h':'blank','j':'ji',
  'k':'blank','l':'lwc',';':'blank',"'":'blank','"':'blank',
  'z':'blank','x':'blank','c':'cert','v':'blank','b':'bs','n':'blank',
  'm':'blank',',':'blank','.':'blank','/':'blank','?':'blank',
};
const kbKeyLabel = {
  '8':'8','9':'9','0':'0','-':'- _','_':'- _','=':'= +','+':'= +',Backspace:'delete',Enter:'return',
  'q':'Q','w':'W','e':'E','t':'T','u':'U','i':'I','o':'O',
  '[':'[ {',']':'] }','{':'[ {','}':'] }','\\':'\\ |','|':'\\ |',"'":"' \"",'"':"' \"",
  'd':'D','h':'H','k':'K',';':';','/':'/ ?','?':'/ ?',
  'z':'Z','x':'X','v':'V','n':'N','m':'M',',':',','.':'.',
};

let kbCurrent = null;
function kbFirstVisibleKey(selector) {
  const list = document.querySelectorAll(selector);
  for (let i = 0; i < list.length; i++) {
    if (list[i].offsetParent !== null) return list[i];
  }
  return list[0] || null;
}
let kbMarqueeTimer = null;
let kbMarqueeRaf = null;
function kbMarqueeClear() {
  if (kbMarqueeTimer) { clearTimeout(kbMarqueeTimer); kbMarqueeTimer = null; }
  if (kbMarqueeRaf) { cancelAnimationFrame(kbMarqueeRaf); kbMarqueeRaf = null; }
}
function kbShow(el) {
  document.querySelectorAll('.key.active').forEach(k => k.classList.remove('active'));
  const dk = el.dataset.key;
  if (dk === 'interests') {
    document.querySelectorAll('.key[data-key="interests"]').forEach(k => {
      if (k.offsetParent !== null) k.classList.add('active');
    });
  } else {
    el.classList.add('active');
  }
  kbCurrent = el;
  const k = el.dataset.key, d = kbInfo[k];
  const p = document.getElementById('kbPanel');
  const pm = document.getElementById('kbPanelMobile');
  kbMarqueeClear();
  const unmapped = '<div class="tag">unmapped</div><div class="val-wrap"><div class="val">—</div></div>';
  if (!d || k === 'blank') { p.innerHTML = unmapped; if (pm) pm.innerHTML = unmapped; return; }
  const html = `<div class="tag">${d.tag}</div><div class="val-wrap"><div class="val">${d.val}</div></div>${k==='esc'?`<div class="desc">${d.desc}</div>`:''}`;
  p.innerHTML = html;
  if (pm) pm.innerHTML = html;
  // marquee on whichever panel is visible
  const visible = p.offsetParent !== null ? p : pm;
  if (visible) requestAnimationFrame(() => kbMarquee(visible));
}

function kbMarquee(panel) {
  const wrap = panel.querySelector('.val-wrap');
  const val = panel.querySelector('.val');
  if (!wrap || !val) return;
  kbMarqueeClear();
  val.style.transform = 'translateX(0)';
  const text = val.textContent;
  val.textContent = text;
  const singleW = val.offsetWidth;
  const wrapW = wrap.clientWidth;
  if (singleW <= wrapW + 2) return;
  // measure one copy + gap width before duplicating
  const gap = '\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0\u00A0';
  val.textContent = text + gap;
  const dist = val.offsetWidth;
  // now add the second copy so the loop is seamless
  val.textContent = text + gap + text;
  const speed = 60; // px/s
  const pauseMs = 1800;
  function cycle() {
    let start = null;
    const durMs = (dist / speed) * 1000;
    function step(ts) {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / durMs, 1);
      val.style.transform = `translateX(-${progress * dist}px)`;
      if (progress < 1) {
        kbMarqueeRaf = requestAnimationFrame(step);
      } else {
        // at this point the second copy is exactly where the first started
        val.style.transform = 'translateX(0)';
        kbMarqueeTimer = setTimeout(cycle, pauseMs);
      }
    }
    kbMarqueeRaf = requestAnimationFrame(step);
  }
  kbMarqueeTimer = setTimeout(cycle, pauseMs);
}

document.querySelectorAll('.key').forEach(k => k.addEventListener('click', () => kbShow(k)));

document.addEventListener('keydown', function(e) {
  if (e.target.matches('input,textarea,select')) return;
  if ((e.ctrlKey||e.metaKey) && e.key.toLowerCase()==='r') return;
  let k = e.key;
  if (k.length===1 && k>='A' && k<='Z' && !e.shiftKey) k = k.toLowerCase();
  let dk = kbKeyMap[e.code] ?? kbKeyMap[k];
  if (!dk) return;
  let el;
  if (dk !== 'blank') {
    el = kbFirstVisibleKey('.key[data-key="' + dk + '"]');
  } else {
    const label = kbKeyLabel[k];
    if (label) {
      el = [...document.querySelectorAll('.key[data-key="blank"]')].find(x => {
        if (x.offsetParent === null) return false;
        return x.querySelector('span:not(.subtext)')?.textContent.trim() === label;
      });
    }
    if (!el) el = kbFirstVisibleKey('.key[data-key="blank"]');
  }
  if (el) { e.preventDefault(); kbShow(el); }
});

/* ═══════════════════════ FOOTER IDENTITY — click → home (scroll up when already home) ═══════════════════════ */
(function initFooterIdentityWords() {
  const root = document.querySelector('.footer-identity');
  if (!root) return;
  root.querySelectorAll('.footer-id-word').forEach((btn) => {
    btn.addEventListener('click', () => navigateTo('home'));
  });
})();

/* ═══════════════════════ FOOTER ORION — star hover + knock-back ═══════════════════════ */
(function initFooterOrion() {
  var wrap = document.querySelector('.footer-constellation');
  if (!wrap) return;
  var svg = wrap.querySelector('svg');
  if (!svg) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var lines = [].slice.call(svg.querySelectorAll('line'));
  var starEls = [].slice.call(svg.querySelectorAll('circle.orion-star'));
  if (!starEls.length) return;

  /* ── Build data model ── */
  var VB_W = 180, VB_H = 140;
  // Map blue-gray base fills to light-mode equivalents
  var fillDarkToLight = {
    '#e6e8f0': '#f0f0f0', // bright star → near white (default)
    '#8d98ac': '#e8c4b6', // mid star → peach
    '#4a5568': '#c49a8a'  // dim star → dimmer peach
  };
  // Inner stars that stay white in light mode — everything else becomes salmon
  var whiteLightStars = [
    '120,60',  // center mid star
    '130,90',  // star 4 (right-middle bright)
    '155,110', // bottom-right outlier
    '168,47',  // ambient dim star (right side)
    '88,134'   // ambient dim star (bottom)
  ];
  var starData = starEls.map(function(el) {
    var darkFill = el.getAttribute('fill');
    var cx = +el.getAttribute('cx'), cy = +el.getAttribute('cy');
    var key = cx + ',' + cy;
    var lightFill = (whiteLightStars.indexOf(key) !== -1) ? '#f0f0f0' : '#e8c4b6';
    // Mirror in dark mode: white-list stars → bright white, others → blue-gray mid
    var isAmbient = el.classList.contains('orion-ambient');
    if (whiteLightStars.indexOf(key) !== -1) {
      darkFill = '#e6e8f0';
    } else {
      darkFill = isAmbient ? '#4a5568' : '#8d98ac';
    }
    el.setAttribute('fill', darkFill);
    return {
      el: el,
      cx: cx,
      cy: cy,
      r: +el.getAttribute('r'),
      darkFill: darkFill,
      lightFill: lightFill,
      baseFill: darkFill,
      // current animated state (lerped each frame)
      scale: 1, glow: 0, tx: 0, ty: 0,
      // targets
      tScale: 1, tGlow: 0, tTx: 0, tTy: 0
    };
  });

  var VB_EPS = 1.5;

  // Create <defs> for line gradients
  var defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
  svg.insertBefore(defs, svg.firstChild);

  var lineData = lines.map(function(el, idx) {
    var x1 = +el.getAttribute('x1'), y1 = +el.getAttribute('y1');
    var x2 = +el.getAttribute('x2'), y2 = +el.getAttribute('y2');
    var baseStroke = el.getAttribute('stroke');
    var baseWidth = +el.getAttribute('stroke-width') || 0.7;

    // find endpoint stars — star1 near (x1,y1), star2 near (x2,y2)
    var star1 = null, star2 = null;
    for (var si = 0; si < starData.length; si++) {
      var s = starData[si];
      if (!star1 && Math.hypot(s.cx - x1, s.cy - y1) < VB_EPS) star1 = s;
      if (!star2 && Math.hypot(s.cx - x2, s.cy - y2) < VB_EPS) star2 = s;
    }

    // create a 5-stop linear gradient: endpoint, fade-before, center, fade-after, endpoint
    var lineLen = Math.hypot(x2 - x1, y2 - y1) || 1;
    var grad = document.createElementNS('http://www.w3.org/2000/svg', 'linearGradient');
    grad.id = 'orion-lg-' + idx;
    grad.setAttribute('gradientUnits', 'userSpaceOnUse');
    grad.setAttribute('x1', x1); grad.setAttribute('y1', y1);
    grad.setAttribute('x2', x2); grad.setAttribute('y2', y2);
    var stop1 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop1.setAttribute('offset', '0%');
    stop1.setAttribute('stop-color', baseStroke);
    var fadeA = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    fadeA.setAttribute('offset', '25%');
    fadeA.setAttribute('stop-color', baseStroke);
    var center = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    center.setAttribute('offset', '50%');
    center.setAttribute('stop-color', baseStroke);
    var fadeB = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    fadeB.setAttribute('offset', '75%');
    fadeB.setAttribute('stop-color', baseStroke);
    var stop2 = document.createElementNS('http://www.w3.org/2000/svg', 'stop');
    stop2.setAttribute('offset', '100%');
    stop2.setAttribute('stop-color', baseStroke);
    grad.appendChild(stop1); grad.appendChild(fadeA);
    grad.appendChild(center); grad.appendChild(fadeB);
    grad.appendChild(stop2);
    defs.appendChild(grad);

    el.setAttribute('stroke', 'url(#orion-lg-' + idx + ')');

    return {
      el: el, darkStroke: baseStroke, lightStroke: '#808080',
      baseStroke: baseStroke, baseWidth: baseWidth,
      star1: star1, star2: star2,
      stop1: stop1, fadeA: fadeA, center: center, fadeB: fadeB, stop2: stop2, grad: grad,
      x1: x1, y1: y1, x2: x2, y2: y2, lineLen: lineLen,
      glow1: 0, tGlow1: 0,
      glow2: 0, tGlow2: 0,
      glowMid: 0, tGlowMid: 0, tMidT: 0.5
    };
  });

  /* ── Cursor state ── */
  var mouse = { x: -9999, y: -9999, active: false };

  function svgPoint(clientX, clientY) {
    var rect = svg.getBoundingClientRect();
    return {
      x: (clientX - rect.left) / rect.width * VB_W,
      y: (clientY - rect.top) / rect.height * VB_H
    };
  }

  /* ── Interaction constants ── */
  var GLOW_RADIUS = 45;      // vb units — how far the glow reaches
  var PUSH_RADIUS = 30;      // vb units — how far the knock push reaches
  var PUSH_STRENGTH = 8;     // max push in vb units
  var MAX_SCALE = 2.0;
  var LERP_IN = 0.17;        // smoothing toward target (approach)
  var LERP_OUT = 0.12;       // smoothing toward rest (retreat)

  /* ── Per-frame update ── */
  var running = false;

  function lerp(a, b, t) { return a + (b - a) * t; }

  function hexToRgb(hex) {
    var n = parseInt(hex.replace('#', ''), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  function rgbStr(r, g, b) { return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')'; }

  var GLOW_COLOR_DARK = [174, 191, 208]; // #aebfd0
  var GLOW_COLOR_LIGHT = [216, 180, 166]; // #d8b4a6
  function getGlowColor() {
    return document.documentElement.getAttribute('data-theme') === 'light' ? GLOW_COLOR_LIGHT : GLOW_COLOR_DARK;
  }
  var GLOW_COLOR = getGlowColor();

  function computeTargets() {
    var p = mouse.active ? svgPoint(mouse.x, mouse.y) : null;

    for (var i = 0; i < starData.length; i++) {
      var s = starData[i];
      if (!p) {
        s.tScale = 1; s.tGlow = 0; s.tTx = 0; s.tTy = 0;
        continue;
      }
      var dx = s.cx - p.x, dy = s.cy - p.y;
      var dist = Math.hypot(dx, dy) || 0.001;

      // glow: smooth falloff
      var glowT = Math.max(0, 1 - dist / GLOW_RADIUS);
      s.tGlow = glowT * glowT; // quadratic falloff for softness

      // scale: closest stars scale up
      s.tScale = 1 + (MAX_SCALE - 1) * s.tGlow;

      // push: stars near cursor get pushed away
      var pushT = Math.max(0, 1 - dist / PUSH_RADIUS);
      var mag = PUSH_STRENGTH * pushT * pushT;
      s.tTx = (dx / dist) * mag;
      s.tTy = (dy / dist) * mag;
    }

    // line glow: per-endpoint + mouse projection for seamless glow along line
    for (var j = 0; j < lineData.length; j++) {
      var l = lineData[j];
      l.tGlow1 = l.star1 ? l.star1.tGlow : 0;
      l.tGlow2 = l.star2 ? l.star2.tGlow : 0;
      if (p) {
        // project mouse onto line segment → parameter t (0–1) and perp distance
        var ldx = l.x2 - l.x1, ldy = l.y2 - l.y1;
        var t = ((p.x - l.x1) * ldx + (p.y - l.y1) * ldy) / (l.lineLen * l.lineLen);
        t = Math.max(0, Math.min(1, t));
        var projX = l.x1 + t * ldx, projY = l.y1 + t * ldy;
        var perpDist = Math.hypot(p.x - projX, p.y - projY);
        var midGlow = Math.max(0, 1 - perpDist / GLOW_RADIUS);
        l.tGlowMid = midGlow * midGlow;
        l.tMidT = t;
      } else {
        l.tGlowMid = 0;
      }
    }
  }

  function animate() {
    computeTargets();
    GLOW_COLOR = getGlowColor();
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    var settled = true;

    // animate stars
    for (var i = 0; i < starData.length; i++) {
      starData[i].baseFill = isLight ? starData[i].lightFill : starData[i].darkFill;
      var s = starData[i];
      var rate = (s.tGlow > s.glow) ? LERP_IN : LERP_OUT;
      s.glow = lerp(s.glow, s.tGlow, rate);
      s.scale = lerp(s.scale, s.tScale, rate);
      s.tx = lerp(s.tx, s.tTx, rate);
      s.ty = lerp(s.ty, s.tTy, rate);

      // apply transform
      s.el.setAttribute('transform',
        'translate(' + s.tx.toFixed(2) + ',' + s.ty.toFixed(2) + ') ' +
        'scale(' + s.scale.toFixed(3) + ')'
      );
      // apply glow via fill brightening + filter — always interpolate, never snap
      var base = hexToRgb(s.baseFill);
      var r = lerp(base[0], GLOW_COLOR[0], s.glow * 0.9);
      var g = lerp(base[1], GLOW_COLOR[1], s.glow * 0.9);
      var b = lerp(base[2], GLOW_COLOR[2], s.glow * 0.9);
      s.el.setAttribute('fill', rgbStr(r, g, b));
      if (s.glow > 0.001) {
        var blur = (s.glow * 16).toFixed(1);
        s.el.style.filter = 'drop-shadow(0 0 ' + blur + 'px rgba(' + GLOW_COLOR[0] + ',' + GLOW_COLOR[1] + ',' + GLOW_COLOR[2] + ',' + (s.glow * 0.9).toFixed(2) + '))';
      } else {
        s.el.style.filter = '';
      }

      if (Math.abs(s.glow - s.tGlow) > 0.0005 ||
          Math.abs(s.tx - s.tTx) > 0.01 ||
          Math.abs(s.ty - s.tTy) > 0.01) settled = false;
    }

    // animate lines — 5-stop gradient: endpoint, fade-before, center, fade-after, endpoint
    var GLOW_SPREAD = 0.20; // how far the glow spreads along the line (0–0.5)
    for (var j = 0; j < lineData.length; j++) {
      var l = lineData[j];
      var baseRgb = hexToRgb(l.baseStroke);

      // lerp each endpoint + center independently
      var rate1 = (l.tGlow1 > l.glow1) ? LERP_IN : LERP_OUT;
      l.glow1 = lerp(l.glow1, l.tGlow1, rate1);
      var rate2 = (l.tGlow2 > l.glow2) ? LERP_IN : LERP_OUT;
      l.glow2 = lerp(l.glow2, l.tGlow2, rate2);
      var rateMid = (l.tGlowMid > l.glowMid) ? LERP_IN : LERP_OUT;
      l.glowMid = lerp(l.glowMid, l.tGlowMid, rateMid);

      // position center stop at mouse projection, with fade stops on either side
      var midT = l.tMidT;
      var fadeAT = Math.max(0.01, midT - GLOW_SPREAD);
      var fadeBT = Math.min(0.99, midT + GLOW_SPREAD);
      l.fadeA.setAttribute('offset', (fadeAT * 100).toFixed(1) + '%');
      l.center.setAttribute('offset', (midT * 100).toFixed(1) + '%');
      l.fadeB.setAttribute('offset', (fadeBT * 100).toFixed(1) + '%');

      // endpoint colors
      var boost1 = Math.min(l.glow1 * 1.6, 1);
      l.stop1.setAttribute('stop-color', rgbStr(
        lerp(baseRgb[0], GLOW_COLOR[0], boost1),
        lerp(baseRgb[1], GLOW_COLOR[1], boost1),
        lerp(baseRgb[2], GLOW_COLOR[2], boost1)));

      var boost2 = Math.min(l.glow2 * 1.6, 1);
      l.stop2.setAttribute('stop-color', rgbStr(
        lerp(baseRgb[0], GLOW_COLOR[0], boost2),
        lerp(baseRgb[1], GLOW_COLOR[1], boost2),
        lerp(baseRgb[2], GLOW_COLOR[2], boost2)));

      // center + fade stops: glow based on perpendicular distance to line
      var boostMid = Math.min(l.glowMid * 1.6, 1);
      var midColor = rgbStr(
        lerp(baseRgb[0], GLOW_COLOR[0], boostMid),
        lerp(baseRgb[1], GLOW_COLOR[1], boostMid),
        lerp(baseRgb[2], GLOW_COLOR[2], boostMid));
      l.center.setAttribute('stop-color', midColor);
      // fade stops: solid between star and mouse when both glow, otherwise fade to base
      var fadeAGlow = Math.min(Math.max(boost1, boostMid), 1);
      l.fadeA.setAttribute('stop-color', rgbStr(
        lerp(baseRgb[0], GLOW_COLOR[0], fadeAGlow),
        lerp(baseRgb[1], GLOW_COLOR[1], fadeAGlow),
        lerp(baseRgb[2], GLOW_COLOR[2], fadeAGlow)));
      var fadeBGlow = Math.min(Math.max(boost2, boostMid), 1);
      l.fadeB.setAttribute('stop-color', rgbStr(
        lerp(baseRgb[0], GLOW_COLOR[0], fadeBGlow),
        lerp(baseRgb[1], GLOW_COLOR[1], fadeBGlow),
        lerp(baseRgb[2], GLOW_COLOR[2], fadeBGlow)));

      // stroke-width: use the brightest glow
      var maxGlow = Math.max(l.glow1, l.glow2, l.glowMid);
      l.el.setAttribute('stroke-width', (l.baseWidth + 1.0 * maxGlow).toFixed(2));

      if (Math.abs(l.glow1 - l.tGlow1) > 0.0005 ||
          Math.abs(l.glow2 - l.tGlow2) > 0.0005 ||
          Math.abs(l.glowMid - l.tGlowMid) > 0.0005) settled = false;
    }

    if (!settled) {
      requestAnimationFrame(animate);
    } else {
      running = false;
    }
  }

  function kick() {
    if (!running) { running = true; requestAnimationFrame(animate); }
  }

  wrap.addEventListener('pointermove', function(e) {
    mouse.x = e.clientX; mouse.y = e.clientY;
    mouse.active = true;
    kick();
  });
  wrap.addEventListener('pointerleave', function() {
    mouse.active = false;
    kick();
  });

  // Sync star/line base colors to current theme (on load + theme toggle)
  function syncConstellationTheme() {
    var isLight = document.documentElement.getAttribute('data-theme') === 'light';
    for (var i = 0; i < starData.length; i++) {
      var s = starData[i];
      s.baseFill = isLight ? s.lightFill : s.darkFill;
      if (s.glow < 0.01) s.el.setAttribute('fill', s.baseFill);
    }
    for (var j = 0; j < lineData.length; j++) {
      var l = lineData[j];
      l.baseStroke = isLight ? l.lightStroke : l.darkStroke;
      if (l.glow1 < 0.01 && l.glow2 < 0.01 && l.glowMid < 0.01) {
        l.stop1.setAttribute('stop-color', l.baseStroke);
        l.fadeA.setAttribute('stop-color', l.baseStroke);
        l.center.setAttribute('stop-color', l.baseStroke);
        l.fadeB.setAttribute('stop-color', l.baseStroke);
        l.stop2.setAttribute('stop-color', l.baseStroke);
      }
    }
  }
  syncConstellationTheme();
  new MutationObserver(function() { syncConstellationTheme(); }).observe(
    document.documentElement, { attributes: true, attributeFilter: ['data-theme'] }
  );
})();

/* ═══════════════════════ FOOTER NAME — letter split (no hover effect) ═══════════════════════ */
(function initFooterNameLetters() {
  var btns = document.querySelectorAll('.footer-id-scatter');
  if (!btns.length) return;

  btns.forEach(function(btn) {
    var text = btn.getAttribute('data-text') || btn.textContent;
    btn.textContent = '';
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'footer-id-letter' + (text[i] === ' ' ? ' footer-id-space' : '');
      span.textContent = text[i] === ' ' ? '\u00A0' : text[i];
      btn.appendChild(span);
    }
  });
})();

(function scheduleHomeIconWave() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const WAVE_MS = 1400;
  const FIRST_WAVE_DELAY_MS = 4000;
  const WAVE_INTERVAL_MS = 12000;

  function isVisible(el) {
    if (!el) return false;
    if (el.offsetParent === null && getComputedStyle(el).position !== 'fixed') return false;
    const cs = getComputedStyle(el);
    return cs.display !== 'none' && cs.visibility !== 'hidden' && cs.opacity !== '0';
  }

  function trigger(el) {
    if (!el || el.classList.contains('icon-wave')) return;
    el.classList.add('icon-wave');
    setTimeout(function () { el.classList.remove('icon-wave'); }, WAVE_MS);
  }

  function scheduleWave(delayMs) {
    setTimeout(function () {
      run();
      scheduleWave(WAVE_INTERVAL_MS);
    }, delayMs);
  }

  function run() {
    var home = document.getElementById('page-home');
    if (home && home.classList.contains('active')) {
      var row = document.querySelector('.portrait-icons-row');
      var col = document.querySelector('.portrait-icons');

      var rowOn = row && isVisible(row) && getComputedStyle(row).display !== 'none';
      var colOn = col && isVisible(col) && getComputedStyle(col).display !== 'none';

      if (rowOn) {
        trigger(row);
      } else if (colOn) {
        trigger(col);
      }
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      scheduleWave(FIRST_WAVE_DELAY_MS);
    });
  } else {
    scheduleWave(FIRST_WAVE_DELAY_MS);
  }
})();

/* ═══════════════════════ TESTIMONY SCROLL HIGHLIGHT ═══════════════════════ */
(function initTestimonyScroll() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var section = document.querySelector('.testimony-scroll-section');
  if (!section) return;
  var sentences = section.querySelectorAll('.testimony-hover-sentence');
  if (!sentences.length) return;
  var stickyEl = section.querySelector('.testimony-scroll-sticky');

  /* Set top so the text centres at 50vh on all screen sizes */
  function centerSticky() {
    if (!stickyEl) return;
    var h = stickyEl.offsetHeight;
    if (h > 0) stickyEl.style.top = 'calc(50vh - ' + (h / 2) + 'px)';
  }
  centerSticky();
  window.addEventListener('resize', centerSticky);

  /* Re-run when the testimony page becomes visible (display:none → flex) */
  var page = section.closest('.page');
  if (page) {
    new MutationObserver(function () {
      if (page.classList.contains('active')) {
        requestAnimationFrame(centerSticky);
      }
    }).observe(page, { attributes: true, attributeFilter: ['class'] });
  }

  function update() {
    if (!section.offsetParent && getComputedStyle(section).display === 'none') return;

    var rect = section.getBoundingClientRect();
    var stickyRange = section.offsetHeight - window.innerHeight;
    if (stickyRange <= 0) return;

    var scrolled = -rect.top;
    var progress = Math.max(0, Math.min(1, scrolled / stickyRange));

    var padStart = 0.08;
    var padEnd = 0.92;
    var adjusted = (progress - padStart) / (padEnd - padStart);
    adjusted = Math.max(0, Math.min(1, adjusted));

    var step = 1 / sentences.length;
    for (var i = 0; i < sentences.length; i++) {
      if (adjusted >= i * step + step * 0.35) {
        sentences[i].classList.add('scroll-lit');
      } else {
        sentences[i].classList.remove('scroll-lit');
      }
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
})();
