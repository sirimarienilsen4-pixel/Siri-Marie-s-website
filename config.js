/*
  ============================================================
  NETTSIDE-INNSTILLINGER — rediger kun denne fila for lenker
  ============================================================
  Fyll inn verdiene mellom anførselstegnene. Så lenge et felt
  står tomt, viser nettsiden en tydelig {{PLASSHOLDER}}.

  businessName  Navnet på virksomheten (f.eks. "Nytt lerret").
  bookingUrl    Lenke til booking av gratis introsamtale
                (f.eks. Calendly, Google Kalender-booking o.l.)
                Tom: alle "Book"-knapper hopper til kontaktskjemaet.
  email         E-postadresse for virksomheten.
  instagramUrl  Full lenke til Instagram-profilen.
  formEndpoint  Adresse som tar imot kontaktskjemaet (f.eks.
                https://formspree.io/f/xxxxxxx). Tom: skjemaet
                åpner e-postprogrammet hvis e-post er fylt inn.
*/
window.SITE_CONFIG = {
  businessName: "",
  bookingUrl: "",
  email: "",
  instagramUrl: "",
  formEndpoint: ""
};
