(function () {
  var cfg = window.SITE_CONFIG || {};

  /* --- Bilder: vis lerret-plassholder til ekte bilde er lagt i /images --- */
  document.querySelectorAll(".canvas img, .portrait img").forEach(function (img) {
    var probe = new Image();
    probe.onerror = function () { img.parentElement.classList.add("is-empty"); };
    probe.src = img.getAttribute("src");
  });

  /* --- Navn på virksomheten fra config.js --- */
  var name = (cfg.businessName || "").trim();
  if (name) {
    document.title = document.title.replace("{{BUSINESS NAME}}", name);
    document.querySelectorAll(".ph").forEach(function (el) {
      if (el.textContent.trim() === "{{BUSINESS NAME}}") { el.textContent = name; el.classList.add("is-filled"); }
    });
  }

  /* --- Booking-knapper --- */
  var booking = (cfg.bookingUrl || "").trim();
  document.querySelectorAll("[data-book]").forEach(function (a) {
    if (booking) {
      a.href = booking;
      a.target = "_blank";
      a.rel = "noopener";
    }
  });
  if (!booking) {
    var miss = document.querySelector(".booking-missing");
    if (miss) miss.hidden = false;
  }

  /* --- E-post og Instagram fra config.js --- */
  var email = (cfg.email || "").trim();
  var insta = (cfg.instagramUrl || "").trim();
  document.querySelectorAll('[data-fill="email"]').forEach(function (a) {
    if (email) { a.textContent = email; a.href = "mailto:" + email; a.classList.add("is-filled"); }
  });
  document.querySelectorAll('[data-fill="instagram"]').forEach(function (a) {
    if (insta) {
      a.textContent = insta.replace(/^https?:\/\/(www\.)?instagram\.com\//, "@").replace(/\/$/, "");
      a.href = insta; a.target = "_blank"; a.rel = "noopener"; a.classList.add("is-filled");
    }
  });

  /* --- Mobilmeny --- */
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

  /* --- Tynn linje under menyen når man scroller --- */
  var header = document.querySelector(".site-header");
  window.addEventListener("scroll", function () {
    header.classList.toggle("scrolled", window.scrollY > 8);
  }, { passive: true });

  /* --- Kontaktskjema --- */
  var form = document.getElementById("skjema");
  var status = form.querySelector(".form-status");
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

    var endpoint = (cfg.formEndpoint || "").trim();
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
      say("Skjemaet er ikke koblet til ennå: {{FORM ENDPOINT / BUSINESS EMAIL}}", true);
    }
  });
})();
