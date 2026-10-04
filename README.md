# Nettside – Siri Marie Nilsen (kreativ coaching)

Én enkel landingsside i ren HTML/CSS/JS. Ingen byggesteg. Klar for GitHub + Vercel.

## Filer
| Fil | Hva den gjør |
|---|---|
| `index.html` | Fast tekst og struktur. Utfyllbare felt er merket med `data-fill`. |
| `config.js` | Alt utfyllbart innhold og alle kontaktlenker. Fyll inn her. |
| `styles.css` | Farger og typografi (øverst i fila). |
| `main.js` | Utfylling, booking, meny, skjema og bilder. Trenger normalt ikke endres. |
| `images/` | Legg bilder her med disse navnene (se under). |

## Bilder
Legg filene i `images/` med nøyaktig disse navnene. Da erstattes lerret-plassholderne automatisk:

- `painting-1.jpg` – hero (stående format, ca. 4:5)
- `painting-2.jpg` – seksjonen «Du trenger ikke være kunstner» (stående, ca. 3:4)
- `painting-3.jpg` … `painting-6.jpg` – galleri
- `portrait.jpg` – portrett av Siri Marie (stående, ca. 4:5)

Anbefalt: JPG, maks ca. 1600 px på lengste side, under 400 KB hver.

## Fyll inn innhold ett sted
Rediger bare `config.js` for navn, kontakt, booking, samtaledetaljer, personlig historie, personverntekst og skjemaadresse. Verdiene står mellom anførselstegnene. Tom verdi viser en plassholder; fylt verdi vises som vanlig tekst. Navnet oppdaterer også sidetittelen.

- `businessName`, `email`, `instagramUrl`: navn og kontakt. Arbeidsnavnet «Nytt lerret» er ikke bestemt.
- `bookingUrl`: full bookinglenke. Tom verdi sender bookingknappene til kontaktseksjonen og viser en kort beskjed.
- `sessionCount`, `sessionLength`, `pilotPrice`, `videoTool`, `materials`, `confidentiality`, `sessionDescription`: samtaledetaljer. Antall skrives uten ordet «samtaler»; pris skrives med valuta.
- `personalStory`, `privacyNote`: din historie og bekreftet personverntekst.
- `formEndpoint`: adresse som tar imot skjemaet, f.eks. Formspree. Tom verdi åpner e-postprogrammet hvis `email` er fylt inn.

### Mønsteret i HTML
Alle utfyllbare tekstfelt bruker samme nøkkel som i `config.js`:

```html
<span data-fill="pilotPrice" data-label="Pris avtales"></span>
<p class="ph-block" data-fill="personalStory" data-label="Min historie kommer"></p>
```

`data-label` er den norske plassholderteksten. `ph-block` gir lange, tomme felt en rolig notisboks. `main.js` fyller tekst og lenker og slår plassholderstilen av når verdien er fylt inn. Samme nøkkel kan brukes flere steder. Sidetittelen bruker også `data-fill`, med den faste teksten i `data-suffix`.

## Før lansering
1. Fjern `<meta name="robots" content="noindex">` i `index.html`.
2. Gå gjennom alle feltene: tom verdi i `config.js` viser plassholder. Fyll inn og bekreft innholdet før lansering.
3. Bekreft personverntekst og NLP-status (står som «under utdanning»).

## Publisering
1. Lag et nytt repo på GitHub og last opp alle filene (eller `git push`).
2. På vercel.com: **Add New → Project → Import** repoet. Framework: **Other**. Ingen build-kommando. **Deploy**.
3. Domene kan legges til senere under **Settings → Domains**.
