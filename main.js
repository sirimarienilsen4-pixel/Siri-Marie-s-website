(function () {
  // Vis lerretet når bildefilen mangler.
  function loadImages() {
    document.querySelectorAll(".canvas img, .portrait img").forEach(function (img) {
      // Sjekk både ferdiglastede bilder og bilder som lastes senere.
      function updateImage() {
        img.parentElement.classList.toggle("is-empty", img.naturalWidth === 0);
      }
      img.addEventListener("load", updateImage);
      img.addEventListener("error", updateImage);
      if (img.complete) updateImage();
    });
  }

  // Åpne og lukk mobilmenyen med riktig tilgjengelighetsstatus.
  function setupMenu() {
    const toggle = document.querySelector(".menu-toggle");
    const nav = document.getElementById("meny");
    toggle.addEventListener("click", function () {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      toggle.textContent = open ? "Lukk" : "Meny";
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.textContent = "Meny";
      });
    });
  }

  // Vis en tynn linje under menyen når siden rulles.
  function setupHeaderScroll() {
    const header = document.querySelector(".site-header");
    // Oppdater også ved åpning med en gjenopprettet rulleposisjon.
    function updateHeader() {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }
    updateHeader();
    window.addEventListener("scroll", updateHeader, { passive: true });
  }

  // Valider meldingen og send via skjemaadresse eller e-postprogram.
  function setupContactForm() {
    const form = document.getElementById("skjema");
    const email = (form.dataset.email || "").trim();
    const status = form.querySelector(".form-status");
    // Vis tilbakemelding fra skjemaet.
    function say(msg, isError) {
      status.textContent = msg;
      status.classList.toggle("error", !!isError);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      const navn = form.elements.namedItem("navn").value.trim();
      const epost = form.elements.namedItem("epost").value.trim();
      const melding = form.elements.namedItem("melding").value.trim();

      if (!navn || !epost || !melding) return say("Fyll inn navn, e-post og en kort melding.", true);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) return say("Sjekk at e-postadressen er riktig skrevet.", true);

      const endpoint = (form.dataset.endpoint || "").trim();
      // Åpne e-postprogrammet med meldingen klar (reserveløsning).
      function openMail() {
        if (!email) return say("Meldingen ble ikke sendt. Prøv igjen senere.", true);
        const subject = encodeURIComponent("Melding fra nettsiden – " + navn);
        const body = encodeURIComponent(melding + "\n\n" + navn + "\n" + epost);
        window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
        say("E-postprogrammet ditt åpnes med meldingen klar til sending.");
      }
      // Egen skjemaadresse (f.eks. Formspree) hvis den er satt, ellers Netlify Forms.
      const request = /^https?:\/\//.test(endpoint)
        ? fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ navn: navn, epost: epost, melding: melding })
          })
        : fetch("/", {
            method: "POST",
            headers: { "Content-Type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams(new FormData(form)).toString()
          });
      say("Sender …");
      request.then(function (r) {
        if (!r.ok) throw new Error();
        form.reset();
        say("Takk! Meldingen er sendt. Du får svar på e-post.");
      }).catch(openMail);
    });
  }

  loadImages();
  setupMenu();
  setupHeaderScroll();
  setupContactForm();
})();
