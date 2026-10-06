# Nettside – Siri Marie Nilsen (kreativ coaching)

Én landingsside som redigeres i **Pages CMS** og publiseres automatisk på Vercel.

## Slik henger det sammen
1. Siri Marie redigerer tekst og bilder på [app.pagescms.org](https://app.pagescms.org).
2. Pages CMS lagrer endringen i `content/site.json` (og bilder i `images/`) på GitHub.
3. Vercel kjører `node build.js` og publiserer siden på nytt, vanligvis innen ett minutt.

## Filer
| Fil | Hva den gjør |
|---|---|
| `content/site.json` | All tekst, alle lenker og bildestier. Redigeres via Pages CMS. |
| `.pages.yml` | Bestemmer hvilke felt som vises i Pages CMS. |
| `build.js` | Lager `dist/index.html` fra innholdet. Ingen pakker trengs. |
| `styles.css` | Farger og typografi. |
| `main.js` | Meny, skjema og bilder i nettleseren. |
| `images/` | Bilder lastet opp via Pages CMS. |
| `vercel.json` | Forteller Vercel at den skal kjøre `build.js` og publisere `dist/`. |

## Tomme felt
Felt som står tomme vises som en rolig plassholder på siden (f.eks. «Pris avtales», «Min historie kommer»). Når feltet fylles ut, forsvinner plassholderen.

## Før lansering
- Fyll ut alle felt og last opp bilder.
- Bekreft personverntekst og NLP-status (står som «under utdanning»).
- Sett opp skjemaadresse (f.eks. Formspree) under «Navn, kontakt og booking».
- Slå på **Vis siden i Google** når alt er klart.

## Lokalt (valgfritt)
```
node build.js
```
Åpne deretter `dist/index.html`.
