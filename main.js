(function () {
  var cfg = window.SITE_CONFIG || {};

  // Les en verdi fra config.js uten mellomrom rundt teksten.
  function value(key) {
    return String(cfg[key] || "").trim();
  }

  // Vis lerretet når bildefilen mangler.
  function loadImages() {
    document.querySelectorAll(".canvas img, .portrait img").forEach(function (img) {
      var probe = new Image();
      probe.onerror = function () { img.parentElement.classList.add("is-empty"); };
      probe.src = img.getAttribute("src");
    });
  }

  // Fyll alle merkede felt og bruk etiketten når verdien er tom.
  function fillContent() {
    document.querySelectorAll("[data-fill]").forEach(function (el) {
      var key = el.dataset.fill;
      var text = value(key);
      el.classList.toggle("is-placeholder", !text);
      el.textContent = (text || el.dataset.label) + (el.dataset.suffix || "");
      if (!text || el.tagName !== "A") return;
      if (key === "email") {
        el.href = "mailto:" + text;
      } else if (key === "instagramUrl") {
        el.textContent = text.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "");
        el.href = text;
        el.target = "_blank";
        el.rel = "noopener";
      }
    });
  }

  // Koble bookingknappene til booking eller kontaktseksjonen.
  function setupBooking() {
    var booking = value("bookingUrl");
    document.querySelectorAll("[data-book]").forEach(function (a) {
      if (booking) {
        a.href = booking;
        a.target = "_blank";
        a.rel = "noopener";
      }
    });
    document.querySelector(".booking-missing").hidden = !!booking;
  }

  // Åpne og lukk mobilmenyen med riktig tilgjengelighetsstatus.
  function setupMenu() {
    var toggle = document.querySelector(".menu-toggle");
    var nav = document.getElementById("meny");
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
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
    var header = document.querySelector(".site-header");
    window.addEventListener("scroll", function () {
      header.classList.toggle("scrolled", window.scrollY > 8);
    }, { passive: true });
  }

  // Valider meldingen og send via skjemaadresse eller e-postprogram.
  function setupContactForm() {
    var email = value("email");
    var form = document.getElementById("skjema");
    var status = form.querySelector(".form-status");
    // Vis tilbakemelding fra skjemaet.
    function say(msg, isError) {
      status.textContent = msg;
      status.classList.toggle("error", !!isError);
    }
  
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var navn = form.navn.value.trim();
      var epost = form.epost.value.trim();
      var melding = form.melding.value.trim();
  
      if (!navn || !epost || !melding) return say("Fyll inn navn, e-post og en kort melding.", true);
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(epost)) return say("Sjekk at e-postadressen er riktig skrevet.", true);
  
      var endpoint = value("formEndpoint");
      if (endpoint) {
        say("Sender …");
        fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify({ navn: navn, epost: epost, melding: melding })
        }).then(function (r) {
          if (!r.ok) throw new Error();
          form.reset();
          say("Takk! Meldingen er sendt. Du får svar på e-post.");
        }).catch(function () {
          say("Meldingen ble ikke sendt. Prøv igjen, eller send en e-post direkte.", true);
        });
      } else if (email) {
        var subject = encodeURIComponent("Melding fra nettsiden – " + navn);
        var body = encodeURIComponent(melding + "\n\n" + navn + "\n" + epost);
        window.location.href = "mailto:" + email + "?subject=" + subject + "&body=" + body;
        say("E-postprogrammet ditt åpnes med meldingen klar til sending.");
      } else {
        say("Skjemaet er ikke koblet til ennå.", true);
      }
    });
  }

  loadImages();
  fillContent();
  setupBooking();
  setupMenu();
  setupHeaderScroll();
  setupContactForm();
})();
