'use strict';
/* SistemiLab · nucleo: spazio dei nomi, utilità di testo, caricamento delle unità, percorsi.
   Il sito non conserva alcuno stato fra una visita e l'altra. */
window.SL = (() => {
  const SL = { unita: Object.create(null), viste: Object.create(null) };
  const mappa = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
  SL.E = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => mappa[c]);

  // Testo delle unità: [[termine]] oppure [[id|testo mostrato]] apre la definizione; `x` è codice.
  SL.T = (s) => SL.E(s)
    .replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, (m, id, t) => '<button type="button" class="termine" data-termine="' + id.trim() + '">' + t + '</button>')
    .replace(/\[\[([^\]]+)\]\]/g, (m, t) => '<button type="button" class="termine" data-termine="' + t.trim().toLowerCase() + '">' + t + '</button>')
    .replace(/(<button type="button" class="termine"[^>]*>[^<]*<\/button>)([.,;:!?»)]+)/g, '<span class="unito">$1$2</span>') // la punteggiatura resta unita al termine
    .replace(/`([^`]+)`/g, '<code>$1</code>');

  SL.sim = (id, lato, cls) => '<svg class="sim' + (cls ? ' ' + cls : '') + '" width="' + lato + '" height="' + lato + '" viewBox="0 0 64 64" aria-hidden="true"><use href="#sl-' + id + '"></use></svg>';

  SL.registra = (id, def) => { def.id = id; SL.unita[id] = def; };
  const attese = Object.create(null);
  // L'identificativo finisce nell'indirizzo di uno script: si accettano soltanto numeri separati da punti.
  SL.idUnita = (id) => typeof id === 'string' && /^\d{1,2}(\.\d{1,2}){1,2}$/.test(id);
  SL.idCapitolo = (id) => typeof id === 'string' && /^\d{1,2}\.\d{1,2}$/.test(id);
  SL.carica = (id) => {
    if (!SL.idUnita(id)) return Promise.reject(new Error('Identificativo di unità non valido'));
    if (SL.unita[id]) return Promise.resolve(SL.unita[id]);
    if (attese[id]) return attese[id];
    attese[id] = new Promise((ok, no) => {
      const s = document.createElement('script');
      s.src = 'sl/unita/' + id + '.js';
      s.onload = () => (SL.unita[id] ? ok(SL.unita[id]) : no(new Error('Unità ' + id + ' non registrata')));
      s.onerror = () => { delete attese[id]; no(new Error('Unità ' + id + ' non trovata')); };
      document.head.appendChild(s);
    });
    return attese[id];
  };

  // Ridimensiona un piano di misura fissa alla larghezza disponibile. Con un fattore minimo il piano
  // non scende sotto quella scala: sugli schermi stretti resta leggibile e scorre in orizzontale.
  SL.scala = (ospite, larghezza, altezza, minimo) => {
    const piano = ospite.firstElementChild;
    const regola = () => {
      const k = Math.min(1, Math.max(minimo || 0, ospite.clientWidth / larghezza));
      const scorre = larghezza * k > ospite.clientWidth + 1;
      piano.style.transform = 'scale(' + k + ')';
      piano.style.left = Math.max(0, Math.floor((ospite.clientWidth - larghezza * k) / 2)) + 'px';
      ospite.style.height = Math.ceil(altezza * k) + (scorre ? 12 : 0) + 'px';
      ospite.classList.toggle('scorre', scorre);
      if (scorre) ospite.setAttribute('tabindex', '0'); else ospite.removeAttribute('tabindex');
    };
    regola();
    if (window.ResizeObserver) { const o = new ResizeObserver(regola); o.observe(ospite); return () => o.disconnect(); }
    window.addEventListener('resize', regola);
    return () => window.removeEventListener('resize', regola);
  };

  // Fumetto con la definizione di un termine.
  let fumetto = null;
  const chiudi = () => { if (fumetto) { fumetto.remove(); fumetto = null; } };
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest && ev.target.closest('[data-termine]');
    if (!b) { chiudi(); return; }
    const voce = SL.glossario && Object.prototype.hasOwnProperty.call(SL.glossario, b.dataset.termine) ? SL.glossario[b.dataset.termine] : null;
    chiudi();
    if (!voce) return;
    fumetto = document.createElement('div');
    fumetto.id = 'fumetto';
    fumetto.setAttribute('role', 'tooltip');
    fumetto.innerHTML = '<b>' + (voce.s ? SL.sim(voce.s, 30) : '') + SL.E(voce.t) + '</b>' + SL.E(voce.d) +
      '<small>Introdotto nell’unità ' + SL.E(voce.u) + '</small>';
    document.body.appendChild(fumetto);
    const r = b.getBoundingClientRect();
    const x = Math.max(8, Math.min(r.left + window.scrollX, window.scrollX + document.documentElement.clientWidth - fumetto.offsetWidth - 8));
    fumetto.style.left = x + 'px';
    fumetto.style.top = (r.bottom + window.scrollY + 8) + 'px';
  });
  document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') chiudi(); });
  // Collegamento «Vai al contenuto»: sposta il fuoco senza cambiare l'indirizzo.
  document.addEventListener('click', (ev) => {
    const a = ev.target.closest && ev.target.closest('a.salta');
    if (!a) return;
    ev.preventDefault();
    const main = document.getElementById('contenuto');
    if (main) main.focus();
  });
  window.addEventListener('hashchange', chiudi);

  // Percorsi: #/  #/m/<modulo>  #/c/<capitolo>  #/u/<unità>/<fase>  #/p/<capitolo>/<variante>  #/glossario
  SL.percorso = () => {
    // Ogni parte dell'indirizzo è accettata soltanto se breve e fatta di lettere, cifre, punti e trattini:
    // qualunque altra forma vale come parte assente, e porta alla pagina «non trovato».
    const pulita = (x) => (typeof x === 'string' && /^[A-Za-z0-9._-]{1,24}$/.test(x) ? x : '');
    const p = location.hash.slice(0, 200).replace(/^#\/?/, '').split('/').filter(Boolean);
    return { vista: pulita(p[0]) || 'rete', a: pulita(p[1]), b: pulita(p[2]) };
  };
  let smonta = null;
  SL.mostra = () => {
    const main = document.getElementById('contenuto');
    const r = SL.percorso();
    if (smonta) { try { smonta(); } catch (e) { /* la vista precedente è già stata rimossa */ } smonta = null; }
    const vista = SL.viste[r.vista] || SL.viste.rete;
    document.querySelectorAll('.testa nav a[data-vista]').forEach((a) => {
      if (a.dataset.vista === (SL.viste[r.vista] ? r.vista : 'rete') || (a.dataset.vista === 'rete' && /^(m|c|u|p)$/.test(r.vista))) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    smonta = vista(main, r) || null;
    const h1 = main.querySelector('h1');
    document.title = (h1 ? h1.textContent + ' · ' : '') + 'SistemiLab';
  };
  SL.vai = (hash) => { if (location.hash === hash) SL.mostra(); else location.hash = hash; };
  return SL;
})();
