'use strict';
/* Introduzione al sito: una sequenza di schede, ciascuna con un faro sull'elemento della pagina al quale si riferisce.
   Compare a ogni apertura della pagina principale (avvio.js) e si riapre dai comandi marcati con data-intro.
   Il sito non conserva alcun dato: l'introduzione non sa di essere già stata letta, e la prima scheda offre per questo
   il comando «Salta intro». Testi, pagine ed elementi illuminati sono in sl/dati/intro.js.
   Mentre l'introduzione è aperta la pagina sottostante è inerte; nella scheda interattiva resta attivo soltanto
   l'elemento illuminato. */
(() => {
  const E = SL.E, D = SL.introduzione;
  const PAD = 6, GAP = 14;
  let st = null;

  const due = (n) => String(n).padStart(2, '0');
  const numeri = () => {
    let c = 0, u = 0, p = 0;
    SL.corso.forEach((m) => m.capitoli.forEach((x) => { if (!x.diretta) c++; u += x.unita ? x.unita.length : 1; if (x.prova) p++; }));
    return {
      SCHEDE: D.length, LAB: D.filter((s) => /^#\/u\//.test(s.rotta || '')).length, MODULI: SL.corso.length, CAPITOLI: c, UNITA: u, PROVE: p,
      TERMINI: Object.keys(SL.glossario).length, N0: SL.corso[0].capitoli.length, MPRIMO: SL.corso[1].r, MULTIMO: SL.corso[SL.corso.length - 1].r
    };
  };
  const riempi = (s, n) => s.replace(/\{([A-Z0-9]+)\}/g, (m, k) => (Object.prototype.hasOwnProperty.call(n, k) ? String(n[k]) : m));
  const primaUnita = () => SL.corso[0].capitoli[0].id;

  // Pagina corrente rispetto alla rotta di una scheda; '#/' indica la pagina principale.
  const qui = (rotta) => (rotta === '#/' ? SL.percorso().vista === 'rete' : location.hash === rotta);
  const selettori = (b) => (Array.isArray(b) ? b : b ? [b] : []);
  const elementi = (b) => selettori(b).flatMap((s) => Array.from(document.querySelectorAll(s))).filter((el) => el.getClientRects().length);
  const unione = (els) => {
    let a = Infinity, b = Infinity, c = -Infinity, d = -Infinity;
    els.forEach((el) => { const r = el.getBoundingClientRect(); a = Math.min(a, r.left); b = Math.min(b, r.top); c = Math.max(c, r.right); d = Math.max(d, r.bottom); });
    return { left: a, top: b, right: c, bottom: d, width: c - a, height: d - b };
  };
  // Attende una condizione per qualche secondo, un fotogramma alla volta.
  const attendi = (prova, fatto, limite) => {
    const t0 = performance.now();
    const giro = () => { const x = prova(); if (x) { fatto(x); return; } if (performance.now() - t0 < (limite || 4000)) requestAnimationFrame(giro); };
    giro();
  };

  // Pagina inerte: restano attive la scheda e, se richiesto, l'elemento illuminato.
  const inerti = [];
  const blocca = (el) => { if (el && !el.inert) { el.inert = true; inerti.push(el); } };
  const sblocca = () => { while (inerti.length) inerti.pop().inert = false; };
  function isola(attivo) {
    sblocca();
    const main = document.getElementById('contenuto');
    // Fratelli di ogni antenato, da un elemento fino a un limite: tutto ciò che non lo contiene diventa inerte.
    const intorno = (da, fino) => { for (let n = da; n && n !== fino && n.parentElement; n = n.parentElement) Array.from(n.parentElement.children).forEach((c) => { if (c !== n && c !== st.radice && c.tagName !== 'SCRIPT') blocca(c); }); };
    intorno(main, document.body);
    if (!attivo || !main.contains(attivo)) { blocca(main); return; }
    intorno(attivo, main);
  }

  function azioni(k, s) {
    const indietro = '<button type="button" class="bottone" data-azione="indietro">Scheda precedente</button>';
    if (k === 0) return '<button type="button" class="bottone primo" data-azione="avanti">Inizio dell’introduzione</button><button type="button" class="bottone" data-azione="chiudi">Salta intro</button>';
    if (s.finale) return indietro + '<button type="button" class="bottone primo" data-azione="fine">Inizio del percorso · unità ' + E(primaUnita()) + '</button>';
    if (s.bivio) return indietro + '<button type="button" class="bottone primo" data-azione="avanti">' + E(s.bivio[0]) + '</button><button type="button" class="bottone" data-azione="chiudi">' + E(s.bivio[1]) + '</button>';
    return indietro + '<button type="button" class="bottone primo" data-azione="avanti"' + (s.interattiva ? ' disabled' : '') + '>Scheda successiva</button>';
  }

  function disegna() {
    const k = st.i, s = D[k];
    st.scheda.innerHTML = '<div class="intro-capo"><div class="occhiello">Introduzione · ' + due(k + 1) + ' / ' + due(D.length) + ' · ' + E(s.eti) + '</div>' +
      (k ? '<button type="button" class="intro-chiudi" data-azione="chiudi" aria-label="Chiusura dell’introduzione" title="Chiusura dell’introduzione">×</button>' : '') + '</div>' +
      '<ol class="intro-corsa" aria-hidden="true">' + D.map((x, j) => '<li' + (j <= k ? ' class="fatta"' : '') + '></li>').join('') + '</ol>' +
      '<h2 class="titolo2" id="intro-titolo">' + E(s.titolo) + '</h2>' +
      '<div class="intro-testo" id="intro-testo" tabindex="0">' + s.testo.map((p) => '<p>' + E(riempi(p, st.n)) + '</p>').join('') + '</div>' +
      (s.interattiva ? '<p class="nota intro-stato" role="status"></p>' : '') +
      '<div class="riga-bottoni intro-azioni">' + azioni(k, s) + '</div>';
  }

  // Scelta della posizione, in quest'ordine: elemento e scheda centrati insieme nella finestra, uno sotto l'altra;
  // sugli schermi larghi, scheda accanto all'elemento; altrimenti scheda accostata al bordo inferiore, dal lato
  // opposto all'elemento, che occupa la parte libera a partire dal proprio inizio.
  // Sugli schermi stretti la scheda conserva l'altezza naturale quando entra con l'elemento; altrimenti è limitata
  // dal foglio di stile e il testo scorre al suo interno.
  function colloca() {
    const sch = st.scheda, vw = document.documentElement.clientWidth, vh = innerHeight, stretto = vw < 760, m = stretto ? 8 : 16;
    sch.style.maxHeight = '';
    if (!st.bers.length) {
      st.modo = 'centro'; st.radice.classList.add('velo'); st.faro.hidden = true;
      sch.dataset.posto = 'centro'; sch.style.left = ''; sch.style.top = '';
      return;
    }
    st.radice.classList.remove('velo'); st.faro.hidden = false; sch.dataset.posto = 'libero';
    const r = unione(st.bers), y0 = r.top + window.scrollY, alto = r.height + 2 * PAD, largo = r.width + 2 * PAD;
    if (stretto) { sch.style.maxHeight = 'none'; if (alto + GAP + sch.offsetHeight > vh - 2 * m) sch.style.maxHeight = ''; }
    const ch = sch.offsetHeight, cw = sch.offsetWidth;
    const massimo = Math.max(0, document.documentElement.scrollHeight - vh);
    let y, modo;
    if (alto + GAP + ch <= vh - 2 * m) { modo = 'sotto'; y = y0 - PAD - (vh - alto - GAP - ch) / 2; }
    else if (!stretto && largo + GAP + cw + 2 * m <= vw) { modo = 'lato'; y = alto <= vh - 2 * m ? y0 - PAD - (vh - alto) / 2 : y0 - PAD - m; }
    else { modo = 'fondo'; const banda = vh - ch - 3 * m; y = alto <= banda ? y0 - PAD - m - (banda - alto) / 2 : y0 - PAD - m; }
    y = Math.max(0, Math.min(massimo, Math.round(y)));
    window.scrollTo({ top: y, behavior: 'instant' });
    if (modo === 'sotto') {
      const t = y0 - y - PAD;
      if (t + alto + GAP + ch > vh - m) modo = t - GAP - ch >= m ? 'sopra' : !stretto && largo + GAP + cw + 2 * m <= vw ? 'lato' : 'fondo';
    }
    st.modo = modo;
    posiziona();
  }

  function posiziona() {
    if (st.modo === 'centro' || !st.bers.length) return;
    const sch = st.scheda, vw = document.documentElement.clientWidth, vh = innerHeight, stretto = vw < 760, m = stretto ? 8 : 16;
    const r = unione(st.bers);
    const faro = 'left:' + Math.round(r.left - PAD) + 'px;top:' + Math.round(r.top - PAD) + 'px;width:' + Math.round(r.width + 2 * PAD) + 'px;height:' + Math.round(r.height + 2 * PAD) + 'px';
    if (st.faro.style.cssText !== faro) st.faro.style.cssText = faro;
    const cw = sch.offsetWidth, ch = sch.offsetHeight;
    let left = stretto ? m : Math.max(m, Math.min(vw - cw - m, r.left)), top;
    const aSinistra = r.left + r.width / 2 > vw / 2;
    if (st.modo === 'sotto') top = Math.min(vh - ch - m, r.bottom + PAD + GAP);
    else if (st.modo === 'sopra') top = Math.max(m, r.top - PAD - GAP - ch);
    else if (st.modo === 'lato') {
      top = Math.max(m, Math.min(vh - ch - m, r.top - PAD));
      left = aSinistra ? r.left - PAD - GAP - cw : r.right + PAD + GAP;
    } else {
      top = vh - ch - m;
      if (!stretto) left = (D[st.i].angolo ? D[st.i].angolo === 'sinistra' : aSinistra) ? m : vw - cw - m;
    }
    sch.style.left = Math.round(left) + 'px'; sch.style.top = Math.round(top) + 'px';
  }

  // Scheda interattiva: il comando «Scheda successiva» si attiva quando nell'elemento illuminato è stata fatta una scelta.
  function attesa() {
    const b = st.scheda.querySelector('[data-azione="avanti"]'), nota = st.scheda.querySelector('.intro-stato');
    const scelta = Boolean(st.bers[0] && st.bers[0].querySelector('[aria-pressed="true"]'));
    if (b && b.disabled === scelta) { b.disabled = !scelta; if (scelta) b.focus({ preventScroll: true }); }
    const t = scelta ? 'Il comando «Scheda successiva» è attivo.' : 'Il comando «Scheda successiva» si attiva dopo la selezione di un valore.';
    if (nota && nota.textContent !== t) nota.textContent = t;
  }

  function segui() {
    if (!st) return;
    st.raf = requestAnimationFrame(segui);
    if (!st.pronta) return;
    const s = D[st.i];
    if (s.bersaglio && !st.bers.every((el) => el.isConnected)) st.bers = elementi(s.bersaglio);
    posiziona();
    if (s.interattiva) attesa();
    // Testo più lungo dello spazio disponibile: una sfumatura in fondo segnala che il testo prosegue.
    const tx = st.scheda.querySelector('.intro-testo');
    if (tx) tx.classList.toggle('prosegue', tx.scrollTop + tx.clientHeight < tx.scrollHeight - 2);
  }

  function fuoco() {
    const s = D[st.i];
    let b = st.scheda.querySelector('[data-azione="avanti"]:not([disabled]), [data-azione="fine"]');
    if (!b && s.interattiva && st.bers[0]) b = st.bers[0].querySelector('button');
    if (!b) b = st.scheda.querySelector('button');
    if (b) b.focus({ preventScroll: true });
  }

  function mostra(k) {
    st.i = k; st.pronta = false;
    const s = D[k], gettone = ++st.gettone;
    disegna();
    st.radice.classList.add('in-attesa');
    if (s.rotta && !qui(s.rotta)) { st.propria = true; st.navigato = true; SL.vai(s.rotta); }
    const t0 = performance.now(), quanti = selettori(s.bersaglio).length;
    const trovati = () => selettori(s.bersaglio).filter((x) => Array.from(document.querySelectorAll(x)).some((el) => el.getClientRects().length)).length;
    const giro = () => {
      if (!st || gettone !== st.gettone) return;
      const n = trovati(), passato = performance.now() - t0;
      const pronta = s.rotta ? qui(s.rotta) : true;
      if (pronta && (n === quanti || (n && passato > 1500) || passato > 8000)) {
        // Due fotogrammi di attesa: la pagina appena disegnata completa la disposizione.
        requestAnimationFrame(() => requestAnimationFrame(() => {
          if (!st || gettone !== st.gettone) return;
          st.bers = elementi(s.bersaglio);
          isola(s.interattiva ? st.bers[0] : null);
          colloca();
          st.pronta = true; st.radice.classList.remove('in-attesa');
          if (s.interattiva) attesa();
          fuoco();
        }));
        return;
      }
      requestAnimationFrame(giro);
    };
    giro();
  }

  function chiudi(come) {
    if (!st) return;
    const s0 = st;
    st = null;
    cancelAnimationFrame(s0.raf);
    sblocca();
    s0.radice.remove();
    document.documentElement.classList.remove('intro-aperta');
    document.removeEventListener('keydown', tasti, true);
    window.removeEventListener('resize', s0.ridimensiona);
    if (come === 'esterna') return;
    if (come === 'fine') {
      SL.vai('#/u/' + primaUnita());
      attendi(() => document.getElementById('fasi'), () => document.getElementById('contenuto').focus({ preventScroll: true }));
      return;
    }
    const casa = () => SL.percorso().vista === 'rete';
    if (!casa() && !s0.navigato) { if (s0.opener && s0.opener.isConnected) s0.opener.focus(); return; }
    if (!casa()) SL.vai('#/');
    // La chiusura riconduce al comando di inizio del percorso, che riceve il fuoco.
    attendi(() => casa() && document.querySelector('[aria-label="Percorso di studio"] a.bottone.primo'), (b) => {
      const r = b.getBoundingClientRect();
      if (r.top < 0 || r.bottom > innerHeight) window.scrollTo({ top: Math.max(0, Math.round(r.top + window.scrollY - (innerHeight - r.height) / 2)), behavior: 'instant' });
      b.focus({ preventScroll: true });
    });
  }

  function alClic(ev) {
    const b = ev.target.closest('[data-azione]');
    if (!b || !st || !st.scheda.contains(b) || b.disabled) return;
    const a = b.dataset.azione;
    if (a === 'avanti' && st.i < D.length - 1) mostra(st.i + 1);
    else if (a === 'indietro' && st.i > 0) mostra(st.i - 1);
    else if (a === 'chiudi') chiudi('comando');
    else if (a === 'fine') chiudi('fine');
  }

  // Tastiera: Esc chiude, le frecce scorrono le schede, la tabulazione resta nella scheda e nell'elemento attivo.
  function tasti(ev) {
    if (!st) return;
    if (ev.key === 'Escape') { ev.preventDefault(); chiudi('tasto'); return; }
    if (ev.key === 'Tab') {
      const s = D[st.i];
      const giro = Array.from(st.scheda.querySelectorAll('button:not([disabled]), [tabindex="0"]'))
        .concat(s.interattiva && st.bers[0] ? Array.from(st.bers[0].querySelectorAll('button:not([disabled])')) : []);
      if (!giro.length) return;
      const i = giro.indexOf(document.activeElement);
      const j = i < 0 ? 0 : (i + (ev.shiftKey ? -1 : 1) + giro.length) % giro.length;
      ev.preventDefault(); giro[j].focus();
      return;
    }
    if (ev.altKey || ev.ctrlKey || ev.metaKey || !st.pronta) return;
    if (ev.key === 'ArrowRight' || ev.key === 'ArrowLeft') {
      const b = st.scheda.querySelector(ev.key === 'ArrowRight' ? '[data-azione="avanti"]:not([disabled])' : '[data-azione="indietro"]');
      if (b) { ev.preventDefault(); b.click(); }
    }
  }

  function apri(opz) {
    if (st) return;
    const f = document.getElementById('fumetto');
    if (f) f.remove();
    st = { i: 0, gettone: 0, propria: false, navigato: false, pronta: false, bers: [], modo: 'centro', opener: (opz && opz.opener) || null, n: numeri() };
    st.radice = document.createElement('div');
    st.radice.className = 'intro velo';
    st.radice.setAttribute('role', 'dialog');
    st.radice.setAttribute('aria-modal', 'true');
    st.radice.setAttribute('aria-labelledby', 'intro-titolo');
    st.radice.setAttribute('aria-describedby', 'intro-testo');
    st.radice.innerHTML = '<div class="intro-faro" hidden></div><section class="intro-scheda pannello tacca" data-posto="centro"></section>';
    st.faro = st.radice.querySelector('.intro-faro');
    st.scheda = st.radice.querySelector('.intro-scheda');
    st.radice.addEventListener('click', alClic);
    document.body.appendChild(st.radice);
    document.documentElement.classList.add('intro-aperta');
    document.addEventListener('keydown', tasti, true);
    let atteso = false;
    st.ridimensiona = () => { if (atteso) return; atteso = true; requestAnimationFrame(() => { atteso = false; if (st && st.pronta) colloca(); }); };
    window.addEventListener('resize', st.ridimensiona);
    st.raf = requestAnimationFrame(segui);
    mostra(0);
  }

  // Un cambio di indirizzo non richiesto dall'introduzione (per esempio il tasto «indietro» del browser) la chiude.
  window.addEventListener('hashchange', () => {
    if (!st) return;
    if (st.propria) { st.propria = false; return; }
    chiudi('esterna');
  });
  document.addEventListener('click', (ev) => {
    const b = ev.target.closest && ev.target.closest('[data-intro]');
    if (!b) return;
    ev.preventDefault();
    apri({ opener: b });
  });

  SL.intro = { apri, chiudi: () => chiudi('comando'), aperta: () => Boolean(st) };
})();
