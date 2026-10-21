/*
  Bygger nettsiden fra content/site.json til mappen dist/.
  Kjøres automatisk av Vercel ved hver endring (se vercel.json).
  Lokalt: node build.js, og åpne dist/index.html.
  Innholdet redigeres i Pages CMS eller direkte i content/site.json.
*/
const fs = require("fs");
const path = require("path");

const root = __dirname;
const out = path.join(root, "dist");
const c = JSON.parse(fs.readFileSync(path.join(root, "content", "site.json"), "utf8"));
const s = c.settings || {};

/* ---------- Hjelpere ---------- */
const esc = (v) => String(v == null ? "" : v)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const has = (v) => String(v == null ? "" : v).trim() !== "";

// Tekst med linjeskift: tom linje = nytt avsnitt, enkelt linjeskift = <br>.
function paras(text, cls) {
  return String(text || "").trim().split(/\n\s*\n/).filter(Boolean)
    .map((p) => `<p${cls ? ` class="${cls}"` : ""}>${esc(p.trim()).replace(/\n/g, "<br>")}</p>`).join("\n");
}

// Felt som ikke er fylt ut ennå vises som en rolig plassholder.
function inline(value, label) {
  return has(value) ? esc(value) : `<span class="is-placeholder">${esc(label)}</span>`;
}
function block(value, label, tag = "div") {
  return has(value)
    ? `<div class="block-text">${paras(value)}</div>`
    : `<${tag} class="ph-block is-placeholder">${esc(label)}</${tag}>`;
}

// Bilde, eller tomt lerret med etikett når bildet ikke er lastet opp.
function figure(cls, src, label, alt, extra = "") {
  if (!has(src)) return `<figure class="${cls} is-empty" data-label="${esc(label)}"></figure>`;
  return `<figure class="${cls}" data-label="${esc(label)}"><img src="${esc(src)}" alt="${esc(alt)}" ${extra}></figure>`;
}

const name = has(s.businessName) ? s.businessName : "";
const nameHtml = inline(name, "Navn kommer");
const cta = esc(s.ctaLabel || "Book en gratis introsamtale");
const booking = has(s.bookingUrl) ? s.bookingUrl.trim() : "";
const bookAttrs = (fallback) => booking
  ? `href="${esc(booking)}" target="_blank" rel="noopener"`
  : `href="${fallback}"`;
const email = has(s.email) ? s.email.trim() : "";
const emailLink = email
  ? `<a href="mailto:${esc(email)}">${esc(email)}</a>`
  : `<span class="is-placeholder">E-postadresse kommer</span>`;
const instaRaw = has(s.instagramUrl) ? s.instagramUrl.trim() : "";
// Godta både full lenke og bare brukernavnet (med eller uten @).
const insta = !instaRaw || /^https?:\/\//.test(instaRaw) ? instaRaw : "https://www.instagram.com/" + instaRaw.replace(/^@/, "") + "/";
const instaLink = insta
  ? `<a href="${esc(insta)}" target="_blank" rel="noopener">${esc(insta.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, ""))}</a>`
  : `<span class="is-placeholder">Instagram-profil kommer</span>`;
const swatches = ["var(--ochre)", "var(--sage)", "var(--rose)"];
const galleryClasses = ["g-a", "g-b", "g-c", "g-d", "g-e", "g-f"];

const hero = c.hero || {}, forYou = c.forYou || {}, how = c.howItWorks || {}, paint = c.painting || {},
  about = c.about || {}, pilot = c.pilot || {}, gallery = c.gallery || {}, coaching = c.coaching || {},
  faq = c.faq || {}, contact = c.contact || {}, footer = c.footer || {};

const galleryImages = (gallery.images || []).filter(has).slice(0, 6);
// Vis fire tomme lerreter til maleriene er lastet opp.
const galleryHtml = (galleryImages.length ? galleryImages : ["", "", "", ""])
  .map((src, i) => figure(`canvas ${galleryClasses[i]}`, src, `Maleri ${i + 3}`, "Maleri av Siri Marie Nilsen", 'loading="lazy"'))
  .join("\n      ");

const title = `${has(name) ? name : "Navn kommer"} – ${s.tagline || ""}`;

/* ---------- Siden ---------- */
const html = `<!doctype html>
<html lang="nb">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(hero.intro || "")}">
  ${s.showInGoogle ? "" : '<meta name="robots" content="noindex">'}
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600&family=Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..400&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>

<a class="skip" href="#innhold">Hopp til innholdet</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="#top" aria-label="Til toppen">${nameHtml}</a>
    <button class="menu-toggle" aria-expanded="false" aria-controls="meny">Meny</button>
    <nav id="meny" class="nav" aria-label="Hovedmeny">
      <a href="#for-deg">For hvem</a>
      <a href="#slik">Slik foregår det</a>
      <a href="#om">Om meg</a>
      <a href="#pilot">Pilot</a>
      <a href="#sporsmal">Spørsmål</a>
      <a class="btn btn-small" ${bookAttrs("#kontakt")}>${cta}</a>
    </nav>
  </div>
</header>

<main id="innhold">

<section class="hero" id="top">
  <div class="wrap hero-grid">
    <div class="hero-copy">
      <p class="hero-name">${nameHtml}</p>
      <h1>${esc(hero.title)}</h1>
      ${paras(hero.intro, "lead")}
      ${has(hero.note) ? `<p class="hero-note">${esc(hero.note)}</p>` : ""}
      <div class="cta-row">
        <a class="btn" ${bookAttrs("#kontakt")}>${cta}</a>
        ${has(hero.micro) ? `<span class="micro">${esc(hero.micro)}</span>` : ""}
      </div>
    </div>
    ${figure("canvas canvas-hero", hero.image, "Maleri 1", "Maleri av Siri Marie Nilsen", 'fetchpriority="high"')}
  </div>
</section>

<section class="section" id="for-deg">
  <div class="wrap">
    <h2>${esc(forYou.title)}</h2>
    <div class="situations">
      ${(forYou.items || []).map((it, i) => `<article class="situation">
        <svg class="swatch" viewBox="0 0 200 60" aria-hidden="true"><use href="#stroke" fill="${swatches[i % 3]}"/></svg>
        <h3>${esc(it.title)}</h3>
        ${paras(it.text)}
      </article>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section section-linen" id="slik">
  <div class="wrap">
    <h2>${esc(how.title)}</h2>
    <ol class="steps">
      ${(how.steps || []).map((st, i) => `<li>
        <span class="step-no" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
        <h3>${esc(st.title)}</h3>
        ${paras(st.text)}
      </li>`).join("\n      ")}
    </ol>
    <div class="cta-center">
      <a class="btn" ${bookAttrs("#kontakt")}>${cta}</a>
    </div>
  </div>
</section>

<section class="section section-dark" id="maling">
  <div class="wrap paint-grid">
    <div class="paint-copy">
      <h2>${esc(paint.title)}</h2>
      ${paras(paint.lead, "lead")}
      ${paras(paint.body)}
      <dl class="todo-list">
        <div>
          <dt>Slik foregår en samtale</dt>
          <dd>${block(paint.sessionDescription, "Beskrivelse av samtalen kommer")}</dd>
        </div>
        <div>
          <dt>Dette trenger du</dt>
          <dd>${block(paint.materials, "Materialer avklares")}</dd>
        </div>
      </dl>
    </div>
    ${figure("canvas canvas-tall", paint.image, "Maleri 2", "Maleri av Siri Marie Nilsen", 'loading="lazy"')}
  </div>
</section>

<section class="section" id="om">
  <div class="wrap about-grid">
    ${figure("portrait", about.portrait, "Portrett", "Portrett av Siri Marie Nilsen", 'loading="lazy"')}
    <div class="about-copy">
      <h2>${esc(about.title)}</h2>
      ${paras(about.lead, "lead")}
      ${block(about.personalStory, "Min historie kommer", "p")}
      ${(about.facts || []).length ? `<h3 class="small-heading">${esc(about.factsTitle)}</h3>
      <ul class="facts">
        ${about.facts.filter(has).map((f) => `<li>${esc(f)}</li>`).join("\n        ")}
      </ul>` : ""}
    </div>
  </div>
</section>

<section class="section section-linen" id="pilot">
  <div class="wrap">
    <div class="offer">
      <div class="offer-copy">
        <h2>${esc(pilot.title)}</h2>
        ${paras(pilot.text, "lead")}
        <a class="btn" ${bookAttrs("#kontakt")}>${cta}</a>
      </div>
      <div class="offer-details">
        <h3 class="small-heading">${esc(pilot.includedTitle)}</h3>
        <ul class="included">
          ${(pilot.included || []).filter(has).map((x, i) => `<li>${esc(x)}</li>`).join("\n          ")}
          <li>${inline(pilot.sessionCount, "Antall")} samtaler</li>
        </ul>
        <p class="price">Pilotpris: ${inline(pilot.price, "Pris avtales")}</p>
        ${has(pilot.priceNote) ? `<p class="price-note">${esc(pilot.priceNote)}</p>` : ""}
      </div>
    </div>
  </div>
</section>

<section class="section" id="galleri">
  <div class="wrap">
    <h2>${esc(gallery.title)}</h2>
    ${has(gallery.intro) ? `<p class="section-intro">${esc(gallery.intro)}</p>` : ""}
    <div class="gallery gallery-${(galleryImages.length || 4)}">
      ${galleryHtml}
    </div>
  </div>
</section>

<section class="section section-tight" id="coaching">
  <div class="wrap">
    <div class="notice">
      <h2>${esc(coaching.title)}</h2>
      ${paras(coaching.body)}
    </div>
  </div>
</section>

<section class="section section-linen" id="sporsmal">
  <div class="wrap faq-wrap">
    <h2>${esc(faq.title)}</h2>
    <div class="faq">
      ${(faq.items || []).filter((q) => has(q.question)).map((q) => `<details>
        <summary>${esc(q.question)}</summary>
        <div class="answer">${has(q.answer) ? paras(q.answer) : '<p class="ph-block is-placeholder">Svar kommer</p>'}</div>
      </details>`).join("\n      ")}
    </div>
  </div>
</section>

<section class="section" id="kontakt">
  <div class="wrap contact-grid">
    <div class="contact-copy">
      <h2>${esc(contact.title)}</h2>
      ${paras(contact.text, "lead")}
      <a class="btn btn-large" ${bookAttrs("#skjema")}>${cta}</a>
      ${booking ? "" : '<p class="booking-missing is-placeholder">Bookinglenke kommer. Bruk kontaktskjemaet nedenfor.</p>'}
      <p class="contact-mail">Eller send en e-post til ${emailLink}</p>
    </div>

    <form class="contact-form" id="skjema" name="kontakt" method="POST" data-netlify="true" netlify-honeypot="bot-field" novalidate data-endpoint="${esc(s.formEndpoint || "")}" data-email="${esc(email)}">
      <h3>${esc(contact.formTitle)}</h3>
      <input type="hidden" name="form-name" value="kontakt">
      <p class="hp" hidden><label>Ikke fyll ut: <input name="bot-field"></label></p>
      <label for="navn">Navn</label>
      <input id="navn" name="navn" type="text" autocomplete="name" required>
      <label for="epost">E-post</label>
      <input id="epost" name="epost" type="email" autocomplete="email" required>
      <label for="melding">Kort melding</label>
      <textarea id="melding" name="melding" rows="4" maxlength="800" required></textarea>
      ${has(contact.formHint) ? `<p class="form-hint">${esc(contact.formHint)}</p>` : ""}
      <button class="btn" type="submit">Send melding</button>
      <p class="form-status" role="status" aria-live="polite"></p>
    </form>
  </div>
</section>

</main>

<footer class="site-footer">
  <div class="wrap footer-grid">
    <div>
      <p class="footer-brand">${nameHtml}</p>
      ${has(footer.tagline) ? `<p>${esc(footer.tagline)}</p>` : ""}
    </div>
    <div>
      <p>${emailLink}</p>
      <p>Instagram: ${instaLink}</p>
    </div>
    <div>
      <details class="privacy" id="personvern">
        <summary>Personvern</summary>
        <div class="privacy-text">${block(footer.privacyText, "Personverntekst kommer", "p")}</div>
      </details>
    </div>
  </div>
  ${has(footer.disclaimer) ? `<div class="wrap footer-bottom"><p>${esc(footer.disclaimer)}</p></div>` : ""}
</footer>

<svg width="0" height="0" style="position:absolute" aria-hidden="true">
  <defs>
    <filter id="rough" x="-5%" y="-20%" width="110%" height="140%">
      <feTurbulence type="fractalNoise" baseFrequency="0.035 0.6" numOctaves="2" seed="4"/>
      <feDisplacementMap in="SourceGraphic" scale="9"/>
    </filter>
    <symbol id="stroke" viewBox="0 0 200 60">
      <path filter="url(#rough)" d="M10 26 C 50 12, 120 16, 186 20 C 196 22, 198 38, 186 42 C 130 50, 64 50, 16 46 C 4 44, 2 30, 10 26 Z"/>
    </symbol>
  </defs>
</svg>

<script src="main.js"></script>
</body>
</html>
`;

/* ---------- Skriv dist/ ---------- */
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
fs.writeFileSync(path.join(out, "index.html"), html);
for (const f of ["styles.css", "main.js"]) fs.copyFileSync(path.join(root, f), path.join(out, f));
if (fs.existsSync(path.join(root, "images"))) fs.cpSync(path.join(root, "images"), path.join(out, "images"), { recursive: true });
console.log("Bygget dist/index.html");
