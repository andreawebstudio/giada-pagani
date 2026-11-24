/* Dott.ssa Giada Pagani — interazioni del sito (nessuna libreria esterna) */
(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Copyright dinamico ---------- */
  var year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Menu mobile (hamburger sotto i 1180px) ---------- */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.getElementById('main-nav');
  var toggleLabel = toggle && toggle.querySelector('.visually-hidden');

  function setMenu(open) {
    if (!toggle || !nav) return;
    toggle.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('nav-open', open);
    if (toggleLabel) toggleLabel.textContent = open ? 'Chiudi il menu' : 'Apri il menu';
  }
  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    nav.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 1180px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Voce di menu attiva durante lo scroll ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.main-nav ul a'));
  var sections = navLinks
    .map(function (a) { return document.querySelector(a.getAttribute('href')); })
    .filter(Boolean);
  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Fade-in all'ingresso delle sezioni ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-visible'); });
  }

  /* ---------- HERO: se l'immagine manca resta lo sfondo avorio ---------- */
  var heroImg = document.querySelector('.hero-media img');
  if (heroImg) {
    var hideHero = function () { heroImg.parentNode.classList.add('is-missing'); };
    if (heroImg.complete && heroImg.naturalWidth === 0) hideHero();
    else heroImg.addEventListener('error', hideHero, { once: true });
  }

  /* ---------- Pannelli apribili (FAQ e "Scopri di più" dei servizi) ---------- */
  function disclosure(btn) {
    var panel = document.getElementById(btn.getAttribute('aria-controls'));
    if (!panel) return;
    var label = btn.querySelector('.service-toggle-label');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') === 'true';
      btn.setAttribute('aria-expanded', String(!open));
      if (label) label.textContent = open ? 'Scopri di più' : 'Mostra meno';
      if (!open) {
        panel.hidden = false;
        requestAnimationFrame(function () {
          requestAnimationFrame(function () { panel.classList.add('is-open'); });
        });
      } else {
        panel.classList.remove('is-open');
        if (reduceMotion) { panel.hidden = true; return; }
        panel.addEventListener('transitionend', function handler(e) {
          if (e.propertyName !== 'grid-template-rows') return;
          if (btn.getAttribute('aria-expanded') === 'false') panel.hidden = true;
          panel.removeEventListener('transitionend', handler);
        });
      }
    });
  }
  document.querySelectorAll('.faq-q button, .service-toggle').forEach(disclosure);

  /* ---------- COME FUNZIONA: linea che avanza con lo scroll ---------- */
  var wrap = document.querySelector('.timeline-wrap');
  if (wrap) {
    var track = wrap.querySelector('.timeline-track');
    var progress = wrap.querySelector('.timeline-progress');
    var steps = Array.prototype.slice.call(wrap.querySelectorAll('.step'));
    var dots = steps.map(function (s) { return s.querySelector('.step-dot'); });
    var ticking = false;

    var layout = function () {
      var w = wrap.getBoundingClientRect();
      var first = dots[0].getBoundingClientRect();
      var last = dots[dots.length - 1].getBoundingClientRect();
      var vertical = Math.abs(first.left - last.left) < 2;
      var cx = function (r) { return r.left + r.width / 2 - w.left; };
      var cy = function (r) { return r.top + r.height / 2 - w.top; };
      if (vertical) {
        track.style.cssText = 'left:' + cx(first) + 'px;top:' + cy(first) + 'px;height:' + (cy(last) - cy(first)) + 'px;width:1px;right:auto;bottom:auto';
      } else {
        track.style.cssText = 'left:' + cx(first) + 'px;top:' + cy(first) + 'px;width:' + (cx(last) - cx(first)) + 'px;height:1px;right:auto;bottom:auto';
      }
      return { vertical: vertical, w: w, first: first, last: last };
    };

    var update = function () {
      ticking = false;
      var L = layout();
      var vh = window.innerHeight;
      var p;
      if (L.vertical) {
        // avanza mentre la timeline attraversa il 60% dello schermo
        var start = L.first.top + L.first.height / 2;
        var end = L.last.top + L.last.height / 2;
        p = (vh * 0.6 - start) / Math.max(end - start, 1);
      } else {
        p = (vh * 0.85 - L.w.top) / (vh * 0.5);
      }
      p = reduceMotion ? 1 : Math.min(Math.max(p, 0), 1);
      progress.style.setProperty('--p', p.toFixed(3));
      var n = steps.length - 1;
      steps.forEach(function (s, i) {
        if (p >= i / n - 0.001) s.classList.add('is-active');
        else s.classList.remove('is-active');
      });
    };
    var onScroll = function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(onScroll);
    update();
  }

  /* ---------- Modulo di contatto ----------
     Se data-endpoint è valorizzato (servizio di invio autorizzato), i dati vengono
     inviati lì e la conferma appare SOLO dopo una risposta positiva del server.
     Altrimenti si apre il programma di posta con l'email precompilata (mailto):
     nessuna conferma di invio viene mostrata, perché l'invio lo fa l'utente. */
  var form = document.getElementById('contact-form');
  var status = document.getElementById('form-status');
  var RECIPIENT = 'giada.pagani87@gmail.com';

  function fieldError(field, msg) {
    field.setAttribute('aria-invalid', 'true');
    status.textContent = msg;
    field.focus();
    return false;
  }
  function validate() {
    form.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
    var nome = form.elements.nome, email = form.elements.email, tipo = form.elements.tipologia,
        msg = form.elements.messaggio, privacy = form.elements.privacy;
    if (!nome.value.trim()) return fieldError(nome, 'Inserisci nome e cognome.');
    if (!email.value.trim() || !email.validity.valid) return fieldError(email, 'Inserisci un indirizzo email valido.');
    if (!tipo.value) return fieldError(tipo, 'Seleziona la tipologia di richiesta.');
    if (!msg.value.trim()) return fieldError(msg, 'Scrivi un breve messaggio.');
    if (!privacy.checked) return fieldError(privacy, "Per procedere è necessario prendere visione dell'informativa privacy.");
    return true;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.textContent = '';
      if (!validate()) return;

      var data = {
        nome: form.elements.nome.value.trim(),
        email: form.elements.email.value.trim(),
        telefono: form.elements.telefono.value.trim(),
        tipologia: form.elements.tipologia.value,
        messaggio: form.elements.messaggio.value.trim()
      };
      var endpoint = (form.getAttribute('data-endpoint') || '').trim();

      if (endpoint) {
        var btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        status.textContent = 'Invio in corso…';
        fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        }).then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          status.textContent = 'Grazie, la tua richiesta è stata inviata. Ti risponderò il prima possibile.';
          form.reset();
        }).catch(function () {
          status.textContent = 'Non è stato possibile inviare il messaggio. Puoi scrivermi direttamente a ' + RECIPIENT + '.';
        }).finally(function () { btn.disabled = false; });
        return;
      }

      var subject = 'Richiesta dal sito — ' + data.tipologia;
      var body =
        'Nome e cognome: ' + data.nome + '\n' +
        'Email: ' + data.email + '\n' +
        (data.telefono ? 'Telefono: ' + data.telefono + '\n' : '') +
        'Tipologia di richiesta: ' + data.tipologia + '\n\n' +
        data.messaggio + '\n';
      window.location.href = 'mailto:' + RECIPIENT +
        '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      status.textContent = 'Si sta aprendo il tuo programma di posta con il messaggio già compilato: per completare la richiesta premi “Invia” da lì. Se non si apre, scrivimi direttamente a ' + RECIPIENT + '.';
    });
  }
})();
