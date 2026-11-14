'use strict';
/* Lettore degli esperimenti: previsione, passi generati dai dati, tre modi d'uso. */
(() => {
  const E = SL.E;
  const ROMANI = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII'];
  const due = (n) => (n < 10 ? '0' : '') + n;
  const voce = (o) => (Array.isArray(o) ? { v: o[0], t: String(o[1]) } : { v: o, t: String(o) });

  SL.parametriIniziali = (lab) => {
    const p = {};
    (lab.controlli || []).forEach((c) => { p[c.id] = c.valore; });
    return p;
  };

  // Riquadro della previsione: compare nella fase 3 e, se i dati cambiano, anche nella fase 4.
  SL.previsione = (ospite, unita, ctx, alCambio) => {
    const lab = unita.lab;
    const disegna = () => {
      const opz = lab.previsione.opzioni(ctx.p).map(voce);
      ospite.innerHTML = '<h3 class="titolo3">Previsione</h3>' +
        '<p style="color:#d6ccb5">' + SL.T(lab.previsione.domanda(ctx.p)) + '</p>' +
        '<div class="riga-bottoni" role="group" aria-label="Valori possibili">' +
        opz.map((o, k) => '<button type="button" class="tessera" data-k="' + k + '" aria-pressed="' + (ctx.pred === o.v) + '">' + E(o.t) + '</button>').join('') + '</div>' +
        '<div class="nota" role="status">' + (ctx.pred == null ? 'Si selezioni un valore: al termine sarà confrontato con l’esito.' : 'Previsione registrata: ' + E((opz.find((o) => o.v === ctx.pred) || { t: ctx.pred }).t) + '.') + '</div>';
      ospite.querySelectorAll('[data-k]').forEach((b) => b.addEventListener('click', () => {
        ctx.pred = opz[Number(b.dataset.k)].v; disegna(); if (alCambio) alCambio();
      }));
    };
    disegna();
    return disegna;
  };

  SL.laboratorio = (ospite, unita, ctx, alFine) => {
    const lab = unita.lab;
    let costr = lab.costruisci(ctx.p), i = 0, raggiunto = 0, modo = 'osserva', timer = null, msg = '';
    const haDomande = costr.passi.some((s) => s.chiedi);

    ospite.innerHTML =
      '<div class="comandi" data-r="comandi"></div>' +
      (haDomande ? '<div class="riga-bottoni" role="group" aria-label="Modo d’uso"><button type="button" class="bottone" data-modo="osserva">Osserva</button><button type="button" class="bottone" data-modo="guidato">Guidato</button><span class="nota" data-r="notamodo" style="flex:1 1 320px"></span></div>' : '') +
      '<div class="banco" tabindex="0" aria-label="Banco dell’esperimento. Usa le frecce sinistra e destra per muoverti fra i passi.">' +
        '<div class="hud" data-r="hud"></div>' +
        '<div data-r="scena"></div>' +
        '<div class="calcolo" data-r="calcolo"></div>' +
        '<div class="racconto" aria-live="polite"><div class="occhiello" data-r="atto"></div><div class="t" data-r="titolo"></div><div class="c" data-r="testo"></div></div>' +
        '<div class="colonna" style="gap:8px"><div class="tacche" aria-hidden="true" data-r="tacche"></div><input type="range" min="0" step="1" data-r="barra" aria-label="Posizione nella sequenza dei passi"></div>' +
        '<div data-r="prev" class="pannello tacca colonna" hidden></div>' +
        '<div data-r="chiedi" class="colonna" hidden></div>' +
        '<div class="riga-bottoni" data-r="bottoni"></div>' +
        '<div class="avviso no" data-r="msg" role="alert" hidden></div>' +
        '<p class="nota">' + E(lab.nota || 'Il numero di passi dipende dai dati scelti.') + '</p>' +
      '</div>' +
      '<div class="pannello esito" data-r="esito" hidden></div>';
    const R = (k) => ospite.querySelector('[data-r="' + k + '"]');
    const scena = SL.scena(R('scena'), lab.scena);
    const banco = ospite.querySelector('.banco');

    const ferma = () => { if (timer) { clearInterval(timer); timer = null; } };
    const ultimo = () => costr.passi.length - 1;
    const domandaAttiva = () => modo === 'guidato' && costr.passi[i].chiedi && i < ultimo();
    const vai = (k) => { i = Math.max(0, Math.min(ultimo(), k)); raggiunto = Math.max(raggiunto, i); msg = ''; aggiorna(); };
    const ricostruisci = () => { ferma(); costr = lab.costruisci(ctx.p); i = 0; raggiunto = 0; msg = ''; ctx.pred = null; ctx.esito = null; comandi(); aggiorna(); };

    function comandi() {
      const blocchi = (lab.controlli || []).map((c) => {
        let h = '<div class="gruppo"><span class="eti">' + E(c.eti) + '</span>';
        if (c.tipo === 'num') {
          const salti = c.salti || [1];
          h += salti.slice().reverse().map((s) => '<button type="button" class="tessera" data-c="' + c.id + '" data-d="' + (-s) + '" aria-label="Diminuisci di ' + s + '">−' + s + '</button>').join('') +
            '<span class="valore">' + E(ctx.p[c.id]) + (c.unita ? ' ' + E(c.unita) : '') + '</span>' +
            salti.map((s) => '<button type="button" class="tessera" data-c="' + c.id + '" data-d="' + s + '" aria-label="Aumenta di ' + s + '">+' + s + '</button>').join('');
          if (c.pronti) h += '<span class="nota" style="margin-left:8px">Casi predefiniti</span>' + c.pronti.map((v) => '<button type="button" class="tessera" data-c="' + c.id + '" data-v="' + v + '">' + v + '</button>').join('');
        } else if (c.tipo === 'scelta') {
          h += c.opzioni.map(voce).map((o) => '<button type="button" class="tessera" data-c="' + c.id + '" data-s="' + E(o.v) + '" aria-pressed="' + (String(ctx.p[c.id]) === String(o.v)) + '">' + E(o.t) + '</button>').join('');
        } else if (c.tipo === 'testo') {
          h += '<input type="text" data-t="' + c.id + '" value="' + E(ctx.p[c.id]) + '" maxlength="' + (c.max || 8) + '" aria-label="' + E(c.eti) + '" autocomplete="off" spellcheck="false">' +
            '<button type="button" class="tessera" data-applica="' + c.id + '">Applica</button>' +
            (c.pronti ? '<span class="nota" style="margin-left:8px">Casi predefiniti</span>' + c.pronti.map((v) => '<button type="button" class="tessera" data-c="' + c.id + '" data-s="' + E(v) + '">' + E(v) + '</button>').join('') : '');
        }
        return h + '</div>';
      });
      R('comandi').innerHTML = blocchi.join('');
      R('comandi').hidden = !blocchi.length;
    }
    R('comandi').addEventListener('click', (ev) => {
      const b = ev.target.closest('button'); if (!b) return;
      const def = (id) => lab.controlli.find((c) => c.id === id);
      if (b.dataset.applica) {
        const c = def(b.dataset.applica), campo = R('comandi').querySelector('[data-t="' + c.id + '"]');
        const v = c.pulisci ? c.pulisci(campo.value) : campo.value;
        if (v) { ctx.p[c.id] = v; ricostruisci(); }
        return;
      }
      if (!b.dataset.c) return;
      const c = def(b.dataset.c);
      if (b.dataset.d) ctx.p[c.id] = Math.max(c.min, Math.min(c.max, ctx.p[c.id] + Number(b.dataset.d)));
      else if (b.dataset.v) ctx.p[c.id] = Number(b.dataset.v);
      else if (b.dataset.s != null) { const o = (c.opzioni || c.pronti).map(voce).find((x) => String(x.v) === b.dataset.s); ctx.p[c.id] = o ? o.v : b.dataset.s; }
      ricostruisci();
    });
    ospite.querySelectorAll('[data-modo]').forEach((b) => b.addEventListener('click', () => { ferma(); modo = b.dataset.modo; msg = ''; aggiorna(); }));
    R('barra').addEventListener('input', (ev) => {
      if (ctx.pred == null) { ev.target.value = i; return; }
      ferma(); const voluto = Number(ev.target.value); i = modo === 'guidato' ? Math.min(voluto, raggiunto) : voluto; raggiunto = Math.max(raggiunto, i); msg = ''; aggiorna();
    });
    banco.addEventListener('keydown', (ev) => {
      if (ev.target !== banco || ctx.pred == null) return;
      if (ev.key === 'ArrowRight' && !domandaAttiva()) { ferma(); vai(i + 1); ev.preventDefault(); }
      if (ev.key === 'ArrowLeft') { ferma(); vai(i - 1); ev.preventDefault(); }
    });
    const avanza = () => { if (ctx.pred == null || i >= ultimo() || domandaAttiva()) { ferma(); aggiorna(); return; } vai(i + 1); };
    const disegnaPrev = SL.previsione(R('prev'), unita, ctx, () => aggiorna());

    function aggiorna() {
      const s = costr.passi[i], fine = i === ultimo();
      ospite.querySelectorAll('[data-modo]').forEach((b) => { b.classList.toggle('attivo', b.dataset.modo === modo); b.setAttribute('aria-pressed', String(b.dataset.modo === modo)); });
      if (R('notamodo')) R('notamodo').textContent = modo === 'guidato' ? 'Alcuni passi richiedono una risposta. In caso di errore viene fornita la spiegazione, ed è ammesso un nuovo tentativo.' : 'L’esperimento procede un passo alla volta, e ogni passo è accompagnato dalla sua descrizione.';
      R('hud').innerHTML = (s.hud || []).map((x) => '<div class="' + (x[2] || '') + '"><small>' + E(x[0]) + '</small><b>' + E(x[1]) + '</b></div>').join('') +
        '<div><small>Passo</small><b>' + due(i + 1) + '<span style="font-size:15px;color:var(--muto)"> di ' + costr.passi.length + '</span></b></div>';
      scena.mostra(s.els || []);
      R('calcolo').hidden = !s.calc;
      R('calcolo').innerHTML = '<small>CALCOLO</small><b>' + E(s.calc || '') + '</b>' + (s.esito ? '<i class="' + (s.esito[1] || '') + '">' + E(s.esito[0]) + '</i>' : '');
      R('atto').textContent = 'Atto ' + ROMANI[s.atto || 0] + ' · ' + ((costr.atti || lab.atti || [])[s.atto || 0] || '');
      R('titolo').textContent = s.titolo;
      R('testo').innerHTML = SL.T(s.testo);
      R('tacche').innerHTML = costr.passi.map((x, k) => '<i class="' + (k === i ? 'q' : k < i ? 'p' : '') + (k > 0 && x.atto !== costr.passi[k - 1].atto ? ' n' : '') + '"></i>').join('');
      const barra = R('barra'); barra.max = ultimo(); barra.value = i;
      const senzaPrev = ctx.pred == null;
      R('prev').hidden = !senzaPrev;
      if (senzaPrev) disegnaPrev();
      const q = !senzaPrev && domandaAttiva() ? s.chiedi : null;
      R('chiedi').hidden = !q;
      if (q) {
        R('chiedi').innerHTML = '<div class="titolo3">' + SL.T(q.d) + '</div><div class="riga-bottoni">' + q.o.map((t, k) => '<button type="button" class="bottone" data-risposta="' + k + '">' + E(t) + '</button>').join('') + '</div>';
        R('chiedi').querySelectorAll('[data-risposta]').forEach((b) => b.addEventListener('click', () => {
          const k = Number(b.dataset.risposta);
          if (k === q.g) vai(i + 1); else { msg = Array.isArray(q.no) ? q.no[k] : q.no; aggiorna(); }
        }));
      }
      R('bottoni').hidden = senzaPrev;
      R('bottoni').innerHTML = '<button type="button" class="bottone" data-b="prima"' + (i === 0 ? ' disabled' : '') + '>Passo precedente</button>' +
        (q ? '' : '<button type="button" class="bottone primo" data-b="dopo"' + (fine ? ' disabled' : '') + '>Passo successivo</button><button type="button" class="bottone" data-b="gira"' + (fine ? ' disabled' : '') + ' aria-pressed="' + Boolean(timer) + '">' + (timer ? 'Pausa' : 'Riproduzione') + '</button>') +
        '<button type="button" class="bottone" data-b="capo">Da capo</button>';
      R('bottoni').querySelectorAll('[data-b]').forEach((b) => b.addEventListener('click', () => {
        const a = b.dataset.b;
        if (a === 'prima') { ferma(); vai(i - 1); }
        else if (a === 'dopo') { ferma(); vai(i + 1); }
        else if (a === 'capo') { ferma(); i = 0; msg = ''; aggiorna(); }
        else if (a === 'gira') { if (timer) ferma(); else timer = setInterval(avanza, lab.ritmo || 1600); aggiorna(); }
      }));
      R('msg').hidden = !msg;
      R('msg').innerHTML = msg ? '<span class="eti">DA RIVEDERE</span><span>' + SL.T(msg) + '</span>' : '';
      const esito = R('esito');
      esito.hidden = !(fine && !senzaPrev);
      if (fine && !senzaPrev) {
        ferma(); ctx.esito = costr.esito; ctx.fatto = true;
        const giusta = ctx.pred === costr.esito;
        const frase = lab.confronto ? lab.confronto(ctx.pred, costr.esito, ctx.p) :
          'La previsione indicava ' + ctx.pred + '. L’esito dell’esperimento è ' + costr.esito + '. ' + (giusta ? 'La previsione coincide con l’esito.' : 'L’origine della differenza è discussa nel bilancio.');
        esito.innerHTML = '<div class="riga-bottoni" style="justify-content:space-between;gap:16px 32px"><div class="colonna" style="gap:6px;max-width:700px"><div class="occhiello c">Previsione ed esito</div><div style="font-size:18px;color:#e9fafc">' + SL.T(frase) + '</div></div><button type="button" class="bottone ciano" data-r="alfine">Fase 5 · Bilancio</button></div>';
        esito.querySelector('[data-r="alfine"]').addEventListener('click', () => alFine && alFine());
      }
    }
    comandi(); aggiorna();
    return () => { ferma(); scena.smonta(); };
  };
})();
