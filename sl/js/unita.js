'use strict';
/* Pagina di un'unità: cinque fasi mostrate una alla volta. Nulla viene conservato fra una visita e l'altra. */
(() => {
  const E = SL.E, T = SL.T;
  const FASI = [['richiami', 'Richiami'], ['idea', 'Esposizione'], ['esperimento', 'Esperimento'], ['riproduci', 'Esecuzione guidata'], ['bilancio', 'Bilancio']];
  let corrente = { id: null, ctx: null };

  // Figure dichiarative dentro la prosa.
  function figura(f, dopo) {
    let corpo = '';
    if (f.fig === 'celle') {
      corpo = '<div class="scorri"><div class="fila-celle">' + f.celle.map((c) => '<div class="' + (c.st || '') + '"><small>' + E(c.so == null ? '' : c.so) + '</small><b>' + E(c.v) + '</b>' + (c.gi != null ? '<em>' + E(c.gi) + '</em>' : '') + '</div>').join('') + '</div></div>';
    } else if (f.fig === 'scena') {
      const id = 'fig' + Math.random().toString(36).slice(2, 8);
      corpo = '<div id="' + id + '"></div>';
      dopo.push(() => { const s = SL.scena(document.getElementById(id), { w: f.w, h: f.h }); s.mostra(f.els); return s.smonta; });
    }
    return '<figure class="figura">' + (f.titolo ? '<div class="tt">' + E(f.titolo) + '</div>' : '') + corpo + (f.nota ? '<figcaption>' + T(f.nota) + '</figcaption>' : '') + '</figure>';
  }
  const blocchi = (lista, dopo) => lista.map((b) => (typeof b === 'string' ? '<p>' + T(b) + '</p>' : b.fig ? figura(b, dopo) : b.sottotitolo ? '<h3>' + E(b.sottotitolo) + '</h3>' : '')).join('');

  // Domanda a scelta con risposta commentata.
  function scelta(ospite, q, alEsito) {
    let presa = null, scelte = 0;
    const disegna = () => {
      ospite.innerHTML = '<div class="titolo3">' + T(q.d) + '</div><div class="riga-bottoni">' +
        q.o.map((o, k) => '<button type="button" class="tessera' + (presa === k ? (o.ok ? ' giusta' : ' errata') : '') + '" data-k="' + k + '" aria-pressed="' + (presa === k) + '">' + E(o.t) + '</button>').join('') + '</div>' +
        (presa == null ? '' : '<div class="avviso ' + (q.o[presa].ok ? 'ok' : 'no') + '" role="status"><span class="eti">' + (q.o[presa].ok ? 'CORRETTO' : 'DA RIVEDERE') + '</span><span>' + T(q.o[presa].fb) + '</span></div>');
      ospite.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => { presa = Number(b.dataset.k); scelte++; disegna(); if (alEsito) alEsito(!!q.o[presa].ok, scelte, 0); }));
    };
    disegna();
  }

  // Esercizio a risposta scritta con correttore diagnostico e indizi graduati.
  const norma = (s) => String(s || '').trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
  // «opz» serve alle prove di fine capitolo: un occhiello diverso e un avviso a ogni risposta.
  function esercizio(ospite, x, n, dopo, opz) {
    let esito = null, indizi = 0, tentativi = 0, svolto = false;
    const fig = x.figura ? figura(x.figura, dopo) : '';
    ospite.innerHTML = '<div class="occhiello">' + E((opz && opz.occhiello) || 'Esercizio ' + n) + '</div><h3 class="titolo2" style="font-size:24px">' + T(x.d) + '</h3>' + fig + '<div data-r="corpo" class="colonna" style="gap:14px"></div>';
    const corpo = ospite.querySelector('[data-r="corpo"]');
    if (x.o) { scelta(corpo, { d: x.guida || 'Si scelga la risposta.', o: x.o }, opz && opz.alEsito); return; }
    corpo.innerHTML = '<div class="riga-bottoni" style="align-items:flex-end"><label class="campo">' + E(x.eti || 'Risposta') + '<input type="text" autocomplete="off" spellcheck="false" placeholder="' + E(x.segnaposto || '') + '"></label>' +
      '<button type="button" class="bottone primo" data-b="verifica">Verifica</button><button type="button" class="bottone" data-b="indizio"></button><button type="button" class="bottone" data-b="svolgi" hidden>Svolgimento</button></div><div data-r="esito"></div><div data-r="indizi" class="colonna" style="gap:8px"></div><div data-r="svolto"></div>';
    const campo = corpo.querySelector('input'), bInd = corpo.querySelector('[data-b="indizio"]'), bSv = corpo.querySelector('[data-b="svolgi"]');
    const aggiorna = () => {
      campo.style.borderColor = esito == null ? '' : esito.ok ? 'var(--ciano)' : 'var(--rosso)';
      corpo.querySelector('[data-r="esito"]').innerHTML = esito == null ? '' : '<div class="avviso con-sim ' + (esito.ok ? 'ok' : 'no') + '" role="status">' + SL.sim(esito.ok ? 'scudo' : 'conflitto', 40) + '<div><div class="eti">' + (esito.ok ? 'CORRETTO' : 'DA RIVEDERE') + '</div><div>' + T(esito.msg) + '</div></div></div>';
      bInd.textContent = indizi >= x.indizi.length ? 'Indizi esauriti' : 'Indizio ' + (indizi + 1) + ' di ' + x.indizi.length;
      bInd.disabled = indizi >= x.indizi.length;
      corpo.querySelector('[data-r="indizi"]').innerHTML = x.indizi.slice(0, indizi).map((t, k) => '<div class="avviso con-sim">' + SL.sim('idea', 36) + '<div><div class="eti">INDIZIO ' + (k + 1) + ' DI ' + x.indizi.length + '</div><div>' + T(t) + '</div></div></div>').join('');
      bSv.hidden = !(x.svolgimento && (tentativi >= 2 || (esito && esito.ok)));
      corpo.querySelector('[data-r="svolto"]').innerHTML = svolto ? '<div class="pannello colonna"><div class="occhiello m">Svolgimento</div>' + x.svolgimento.map((t) => '<p>' + T(t) + '</p>').join('') + '</div>' : '';
    };
    const verifica = () => {
      const a = norma(campo.value);
      if (!a) { esito = { ok: false, msg: 'Occorre inserire una risposta prima della verifica.' }; aggiorna(); return; }
      tentativi++;
      if (x.giuste.map(norma).includes(a)) esito = { ok: true, msg: x.ok };
      else { const d = (x.diagnosi || []).find((r) => r.se.map(norma).includes(a)); esito = { ok: false, msg: d ? d.msg : x.altro }; }
      aggiorna();
      if (opz && opz.alEsito) opz.alEsito(esito.ok, tentativi, indizi);
    };
    corpo.querySelector('[data-b="verifica"]').addEventListener('click', verifica);
    campo.addEventListener('keydown', (ev) => { if (ev.key === 'Enter') verifica(); });
    bInd.addEventListener('click', () => { indizi = Math.min(x.indizi.length, indizi + 1); aggiorna(); });
    bSv.addEventListener('click', () => { svolto = !svolto; bSv.textContent = svolto ? 'Nascondi lo svolgimento' : 'Mostra lo svolgimento'; aggiorna(); });
    aggiorna();
  }

  SL.esercizio = esercizio;

  SL.viste.u = (main, r) => {
    const info = SL.trovaUnita(r.a);
    if (!info) { main.innerHTML = '<div class="pagina"><h1 class="titolone">Unità non trovata</h1><p class="guida">L’identificativo indicato non corrisponde ad alcuna unità del corso.</p><p><a class="bottone primo" href="#/">Rete del corso</a></p></div>'; return null; }
    const fase = Math.max(1, Math.min(5, Number(r.b) || 1));
    const stessa = corrente.id === info.id;
    let pulizie = [], vivo = true;
    main.innerHTML = '<div class="pagina"><p class="guida">Caricamento dell’unità ' + E(info.id) + '.</p></div>';
    SL.carica(info.id).then((u) => {
      if (!vivo) return;
      if (!stessa) corrente = { id: info.id, ctx: { p: SL.parametriIniziali(u.lab), pred: null, esito: null, fatto: false } };
      const ctx = corrente.ctx, dopo = [];
      const base = '#/u/' + info.id + '/';
      const capLink = info.cap.diretta ? '#/' : '#/c/' + info.cap.id;
      const filigrane = (u.filigrana || [info.sim, 'bit', 'cpu']).slice(0, 3).map((s, k) => '<span class="filigrana" style="' + ['right:-30px;top:-46px', 'right:150px;bottom:-70px', 'right:330px;top:-40px'][k] + '">' + SL.sim(s, [230, 190, 150][k]) + '</span>').join('');
      let h = '<div class="pagina">' +
        '<div class="nota" style="font-family:var(--mono)"><a href="#/">Rete del corso</a> / ' + (info.cap.diretta ? 'Modulo ' + info.mod.r : '<a href="' + capLink + '">Capitolo ' + E(info.cap.id) + '</a>') + ' / Unità ' + E(info.id) + '</div>' +
        (fase === 1
          ? '<header class="testata">' + filigrane + '<div class="podio">' + SL.sim(info.sim, 104) + '</div><div class="dx"><div class="occhiello">Unità ' + E(info.id) + '</div><h1>' + E(u.titolo) + '</h1><p style="color:var(--testo2);max-width:640px">' + T(u.obiettivo) + '</p>' +
            (u.concetti ? '<div class="piste">' + u.concetti.map((c) => '<span class="pista">' + SL.sim(c[0], 28) + E(c[1]) + '</span>').join('') + '</div>' : '') + '</div></header>'
          : '<header class="testata stretta"><div class="podio">' + SL.sim(info.sim, 50) + '</div><div class="dx" style="gap:4px"><div class="occhiello">Unità ' + E(info.id) + '</div><h1>' + E(u.titolo) + '</h1></div></header>') +
        '<nav class="fasi" id="fasi" aria-label="Fasi dell’unità">' + FASI.map((f, k) => '<a class="fase' + (k + 1 < fase ? ' fatta' : '') + '" href="' + base + (k + 1) + '"' + (k + 1 === fase ? ' aria-current="step"' : '') + '>' + SL.sim(f[0], 44) + '<span><small>' + '0' + (k + 1) + '</small>' + f[1] + '</span></a>').join('') + '</nav>';

      if (fase === 1) {
        h += '<section class="colonna" style="gap:18px"><div class="colonna" style="gap:6px"><div class="occhiello c">Fase 1 · Richiami</div><h2 class="titolo2">Nozioni richiamate</h2><p class="guida">' + T(u.richiami.guida || 'L’unità si fonda su poche nozioni già introdotte, qui richiamate. Ogni altro termine è introdotto nel corso dell’unità, uno alla volta.') + '</p></div>' +
          (u.richiami.carte.length ? '<div class="griglia">' + u.richiami.carte.map((c) => '<div class="richiamo">' + SL.sim(c.sim, 60) + '<div class="colonna" style="gap:4px"><div class="occhiello c" style="font-size:11px">' + E(c.da) + '</div><h3 class="titolo3">' + E(c.t) + '</h3><p>' + T(c.d) + '</p></div></div>').join('') + '</div>' : '') +
          (u.richiami.domanda ? '<div class="pannello colonna" style="background:var(--pan2)" data-r="dom"></div>' : '') + '</section>';
      } else if (fase === 2) {
        h += '<section class="colonna" style="gap:22px"><div class="colonna" style="gap:6px"><div class="occhiello">Fase 2 · Esposizione</div><h2 class="titolo2" style="font-size:32px">' + E(u.idea.titolo) + '</h2></div><div class="due"><div class="prosa">' + blocchi(u.idea.testo, dopo) + '</div>' +
          '<aside class="accanto pannello tacca" aria-label="Termini nuovi"><div class="occhiello">Termini nuovi · ' + u.idea.termini.length + '</div>' + (u.idea.termini.length ? '' : '<div class="voce"><span>L’unità riordina termini già introdotti, senza aggiungerne di nuovi.</span></div>') + u.idea.termini.map((id) => { const v = SL.glossario[id] || { t: id, d: '' }; return '<div class="voce"><b>' + (v.s ? SL.sim(v.s, 34) : '') + E(v.t) + '</b><span>' + E(v.d) + '</span></div>'; }).join('') +
          '<div class="nota" style="border-top:1px solid var(--riga);padding-top:12px">I termini evidenziati nel testo si aprono con un clic e restano sempre nel <a href="#/glossario">glossario</a>.</div></aside></div></section>';
      } else if (fase === 3) {
        h += '<section class="colonna" style="gap:20px"><div class="colonna" style="gap:6px"><div class="occhiello">Fase 3 · L’esperimento</div><h2 class="titolo2">Prima di cominciare</h2></div><div class="griglia">' +
          '<div class="pannello colonna"><h3 class="titolo3">Svolgimento dell’esperimento</h3>' + u.esperimento.faremo.map((p) => '<p style="color:#d6ccb5">' + T(p) + '</p>').join('') + '</div>' +
          '<div class="pannello colonna" style="gap:14px"><h3 class="titolo3">Elementi della scena</h3>' + u.esperimento.vedrai.map((v) => '<div class="legenda-fig">' + SL.sim(v[0], 40) + '<div><b>' + E(v[1]) + '.</b> ' + T(v[2]) + '</div></div>').join('') + '</div>' +
          '<div class="pannello tacca colonna" data-r="prev"></div></div></section>';
      } else if (fase === 4) {
        h += '<section class="colonna" style="gap:18px"><div class="colonna" style="gap:6px"><div class="occhiello">Fase 4 · Esecuzione guidata</div><h2 class="titolo2">' + E(u.lab.titolo) + '</h2></div><div data-r="lab" class="colonna" style="gap:18px"></div></section>';
      } else {
        const b = u.bilancio;
        h += '<section class="colonna" style="gap:20px"><div class="colonna" style="gap:6px"><div class="occhiello">Fase 5 · Bilancio</div><h2 class="titolo2">Sintesi</h2></div>' +
          (ctx.fatto && ctx.pred != null ? '<div class="pannello esito colonna" style="gap:6px"><div class="occhiello c">Previsione ed esito</div><div style="font-size:18px;color:#e9fafc">' + T(u.lab.confronto ? u.lab.confronto(ctx.pred, ctx.esito, ctx.p) : 'La previsione indicava ' + ctx.pred + '. L’esito dell’esperimento è ' + ctx.esito + '.') + '</div></div>' : '') +
          '<div class="griglia"><div class="pannello colonna"><div class="occhiello">Enunciato della regola</div>' + b.regola.map((p) => '<p style="color:#e4dbc6">' + T(p) + '</p>').join('') + '</div>' +
          '<div class="pannello colonna"><div class="occhiello r">Errori frequenti</div>' + b.errori.map((e) => '<div class="colonna" style="gap:2px"><b style="color:var(--chiaro)">' + T(e[0]) + '</b><span style="color:var(--testo2)">' + T(e[1]) + '</span></div>').join('') + '</div>' +
          '<div class="pannello colonna"><div class="occhiello c">Competenze da verificare</div>' + b.saFare.map((t) => '<label class="spunta"><input type="checkbox"><span>' + T(t) + '</span></label>').join('') + '<p class="nota">Le spunte hanno valore di promemoria e non vengono conservate.</p></div></div></section>' +
          b.esercizi.map((x, k) => '<section class="banco esercizio" data-es="' + k + '"></section>').join('') +
          (b.sfida ? '<section class="pannello sfida"><div class="colonna" style="flex:999 1 420px;min-width:0;gap:8px"><div class="occhiello">Dal laboratorio alla sfida</div><h2 class="titolo3" style="font-size:21px">La sfida PWN collegata</h2><p style="color:#d6ccb5;max-width:680px">Le sfide sono esercizi del corso da svolgere in un terminale: il sistema assegna a ciascuno studente una traccia individuale e ne verifica la risposta. È opportuno affrontarle al termine del capitolo. L’indirizzo della piattaforma viene comunicato a lezione.</p></div><div class="pannello colonna" style="flex:1 1 280px;min-width:0;background:var(--pan2);border-color:var(--riga2);gap:6px"><div class="occhiello m" style="font-size:11px">Sfida collegata</div><div class="id">' + E(b.sfida[0]) + '</div><div style="color:var(--testo2);font-size:15px">' + E(b.sfida[1]) + '</div></div></section>' : '');
      }
      const dopoUnita = info.dopo;
      h += '<div class="passi-fase">' + (fase > 1 ? '<a class="bottone" href="' + base + (fase - 1) + '">Fase precedente</a>' : '<a class="bottone" href="' + capLink + '">' + (info.cap.diretta ? 'Rete del corso' : 'Pagina del capitolo') + '</a>') +
        (fase < 5 ? '<a class="bottone primo" href="' + base + (fase + 1) + '">Fase ' + (fase + 1) + ' · ' + FASI[fase][1] + '</a>' :
          (dopoUnita ? '<a class="bottone primo" href="#/u/' + dopoUnita.id + '">Unità successiva · ' + E(dopoUnita.id) + ' ' + E(dopoUnita.titolo) + '</a>' : '<a class="bottone primo" href="#/">Rete del corso</a>')) + '</div></div>';
      main.innerHTML = h;
      const Q = (k) => main.querySelector('[data-r="' + k + '"]');
      if (fase === 1 && u.richiami.domanda) scelta(Q('dom'), u.richiami.domanda);
      if (fase === 3) SL.previsione(Q('prev'), u, ctx, null);
      if (fase === 4) pulizie.push(SL.laboratorio(Q('lab'), u, ctx, () => SL.vai(base + '5')));
      if (fase === 5) main.querySelectorAll('[data-es]').forEach((n) => esercizio(n, u.bilancio.esercizi[Number(n.dataset.es)], Number(n.dataset.es) + 1, dopo));
      dopo.forEach((f) => { const p = f(); if (p) pulizie.push(p); });
      document.title = u.titolo + ' · SistemiLab';
      if (stessa) { const a = document.getElementById('fasi'); if (a) a.scrollIntoView({ block: 'start' }); } else window.scrollTo(0, 0);
    }).catch((err) => {
      if (!vivo) return;
      main.innerHTML = '<div class="pagina"><h1 class="titolone">Unità non disponibile</h1><p class="guida">' + E(err.message) + '.</p><p><a class="bottone primo" href="#/">Rete del corso</a></p></div>';
    });
    return () => { vivo = false; pulizie.forEach((f) => { try { f(); } catch (e) { /* già smontato */ } }); };
  };
})();
