# Nettside – Siri Marie Nilsen (kreativ coaching)

Én enkel landingsside i ren HTML/CSS/JS. Ingen byggesteg. Klar for GitHub + Vercel.

## Filer
| Fil | Hva den gjør |
|---|---|
| `index.html` | All tekst på siden. Søk etter `{{` for å finne plassholdere. |
| `config.js` | Navn, booking-lenke, e-post, Instagram og skjema-adresse. Fyll inn her. |
| `styles.css` | Farger og typografi (øverst i fila). |
| `main.js` | Meny, FAQ, skjema, bilder. Trenger normalt ikke endres. |
| `images/` | Legg bilder her med disse navnene (se under). |

## Bilder
Legg filene i `images/` med nøyaktig disse navnene. Da erstattes lerret-plassholderne automatisk:

- `painting-1.jpg` – hero (stående format, ca. 4:5)
- `painting-2.jpg` – seksjonen «Du trenger ikke være kunstner» (stående, ca. 3:4)
- `painting-3.jpg` … `painting-6.jpg` – galleri
- `portrait.jpg` – portrett av Siri Marie (stående, ca. 4:5)

Anbefalt: JPG, maks ca. 1600 px på lengste side, under 400 KB hver.

## Plassholdere som må fylles inn før lansering
- `{{BUSINESS NAME}}` → `config.js` (businessName) – arbeidsnavn «Nytt lerret» er ikke bestemt
- `{{BOOKING LINK}}` → `config.js` (bookingUrl)
- `{{BUSINESS EMAIL}}` → `config.js` (email)
- `{{INSTAGRAM LINK}}` → `config.js` (instagramUrl)
- Kontaktskjema → `config.js` (formEndpoint), f.eks. gratis Formspree
- I `index.html`: øktbeskrivelse, materialer, personlig historie, antall samtaler, pilotpris, varighet, konfidensialitet, videoverktøy, personvernerklæring

## Før lansering
1. Fjern `<meta name="robots" content="noindex">` i `index.html`.
2. Sjekk at ingen `{{` er igjen (søk i `index.html`).
3. Bekreft personverntekst og NLP-status (står som «under utdanning»).

## Publisering
1. Lag et nytt repo på GitHub og last opp alle filene (eller `git push`).
2. På vercel.com: **Add New → Project → Import** repoet. Framework: **Other**. Ingen build-kommando. **Deploy**.
3. Domene kan legges til senere under **Settings → Domains**.
