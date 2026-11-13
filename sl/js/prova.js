'use strict';
/* Prove di fine capitolo. Ogni prova è un elenco di generatori: da un numero, la variante, ciascuno
   ricava una domanda con i propri dati. Lo stesso numero dà sempre la stessa prova.
   Il riepilogo vive soltanto nella pagina aperta: nulla viene conservato. */
(() => {
  SL.prove = Object.create(null);
  SL.registraProva = (cap, def) => { SL.prove[cap] = def; };

  // Numeri pseudo-casuali ripetibili: lo stesso seme produce sempre la stessa successione.
  SL.sorte = (seme) => {
    let a = (seme >>> 0) || 1;
    const u = () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = a;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    return {
      int: (da, fino) => da + Math.floor(u() * (fino - da + 1)),
      scegli: (lista) => lista[Math.floor(u() * lista.length)],
      mescola: (lista) => { const v = lista.slice(); for (let i = v.length - 1; i > 0; i--) { const j = Math.floor(u() * (i + 1)); const t = v[i]; v[i] = v[j]; v[j] = t; } return v; }
    };
  };

  // Scritture accettate per una stessa risposta: con o senza punti delle migliaia, con i due segni meno, con o senza 0x.
  SL.scritture = {
    intero: (v) => {
      const s = String(Math.abs(v)), p = s.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
      const base = s === p ? [s] : [s, p];
      return v < 0 ? base.flatMap((x) => ['-' + x, '−' + x]) : base;
    },
    esa: (v, cifre) => { const lungo = v.toString(16).padStart(cifre, '0'), corto = v.toString(16); return Array.from(new Set([lungo, '0x' + lungo, lungo + 'h', corto, '0x' + corto])); },
    decimale: (v, coda) => {
      const s = String(Math.abs(v)), base = v < 0 ? ['-' + s, '−' + s] : [s];
      return base.flatMap((x) => [x].concat((coda || []).map((c) => x + c)));
    }
  };

  /* Compone la prova di un capitolo: una domanda per generatore, con le opzioni in ordine rimescolato.
     Nelle domande a risposta scritta toglie dalle diagnosi le risposte che in quella variante coincidono
     con quella giusta, oppure con una diagnosi precedente. */
  const norma = (s) => String(s == null ? '' : s).trim().toLowerCase().replace(/\s+/g, '').replace(',', '.');
  SL.componiProva = (cap, variante) => SL.prove[cap].domande.map((genera, k) => {
    const q = genera(SL.sorte(variante * 7919 + k * 104729 + 13));
    if (q.o) q.o = SL.sorte(variante * 31 + k * 977 + 5).mescola(q.o);
    else {
      q.giuste = Array.from(new Set(q.giuste.map(String)));
      const viste = new Set(q.giuste.map(norma));
      q.diagnosi = (q.diagnosi || []).map((d) => {
        const se = Array.from(new Set(d.se.map(String))).filter((v) => !viste.has(norma(v)));
        se.forEach((v) => viste.add(norma(v)));
        return { se, msg: d.msg };
      }).filter((d) => d.se.length);
    }
    return q;
  });

  const E = SL.E;
  const attese = Object.create(null);
  const carica = (cap) => {
    if (SL.prove[cap]) return Promise.resolve();
    if (attese[cap]) return attese[cap];
    attese[cap] = new Promise((ok, no) => {
      const s = document.createElement('script');
      s.src = 'sl/prove/' + cap + '.js';
      s.onload = () => (SL.prove[cap] ? ok() : no(new Error('Prova del capitolo ' + cap + ' non registrata')));
      s.onerror = () => { delete attese[cap]; no(new Error('Prova del capitolo ' + cap + ' non trovata')); };
      document.head.appendChild(s);
    });
    return attese[cap];
  };
  const altraVariante = (attuale) => { let v = attuale; while (v === attuale) v = 1 + Math.floor(Math.random() * 999); return v; };

  SL.viste.p = (main, r) => {
    const t = SL.trovaCapitolo(r.a);
    if (!t || !t.cap.prova) {
      main.innerHTML = '<div class="pagina"><h1 class="titolone">Prova non disponibile</h1><p class="guida">Questo capitolo non ha ancora una prova nel nuovo formato.</p><p><a class="bottone primo" href="#/">Torna alla rete del corso</a></p></div>';
      return null;
    }
    const cap = t.cap, mod = t.mod, variante = Number(r.b);
    if (!(Number.isInteger(variante) && variante >= 1 && variante <= 999)) { location.replace('#/p/' + cap.id + '/' + altraVariante(0)); return null; }
    let vivo = true;
    const pulizie = [];
    main.innerHTML = '<div class="pagina"><h1 class="titolone">Prova del capitolo ' + E(cap.id) + '</h1><p class="guida">Carico le domande.</p></div>';
    carica(cap.id).then(() => {
      if (!vivo) return;
      const domande = SL.componiProva(cap.id, variante), n = domande.length, dopo = [];
      // Stato di ogni domanda: aperta, tentata, piena (giusta al primo colpo, senza indizi), aiutata.
      const stati = domande.map(() => 'aperta');
      main.innerHTML = '<div class="pagina">' +
        '<div class="nota" style="font-family:var(--mono)"><a href="#/m/' + mod.k + '">Rete del corso</a> / <a href="#/c/' + E(cap.id) + '">Capitolo ' + E(cap.id) + '</a> / Prova</div>' +
        '<header class="testata"><span class="filigrana" style="right:-30px;top:-46px">' + SL.sim('bilancio', 230) + '</span><span class="filigrana" style="right:170px;bottom:-70px">' + SL.sim(cap.sim, 190) + '</span>' +
        '<div class="podio">' + SL.sim('bilancio', 104) + '</div><div class="dx"><div class="occhiello">Capitolo ' + E(cap.id) + ' · Prova di fine capitolo</div><h1>Prova · ' + E(cap.breve) + '</h1>' +
        '<p style="color:var(--testo2);max-width:640px">' + n + ' domande sugli argomenti del capitolo. Ogni risposta riceve subito un commento, e per le domande a risposta scritta restano disponibili gli indizi e lo svolgimento.</p>' +
        '<div class="piste"><span class="pista">' + SL.sim('riproduci', 28) + 'Variante ' + variante + '</span><span class="pista">' + SL.sim('tabella', 28) + n + ' domande</span></div></div></header>' +
        '<section class="pannello colonna" style="gap:8px"><div class="occhiello">Come funziona</div><p style="color:#d6ccb5">Questa è la variante ' + variante + '. Con lo stesso numero la prova si ripresenta identica, quindi puoi rifarla oppure proporla ad altri. Il pulsante «Un’altra variante» cambia i dati delle domande e lascia uguali gli argomenti.</p>' +
        '<p style="color:#d6ccb5">Il riepilogo in fondo alla pagina si aggiorna mentre rispondi. Serve soltanto a te: quando lasci la pagina viene dimenticato.</p></section>' +
        domande.map((x, k) => '<section class="banco esercizio" data-q="' + k + '"></section>').join('') +
        '<section class="pannello esito colonna" data-r="riepilogo" role="status" aria-live="polite"></section>' +
        '<div class="passi-fase"><a class="bottone" href="#/c/' + E(cap.id) + '">Torna al capitolo</a><button type="button" class="bottone primo" data-b="altra">Un’altra variante</button></div></div>';

      const riepilogo = main.querySelector('[data-r="riepilogo"]');
      const disegnaRiepilogo = () => {
        const conta = (s) => stati.filter((x) => x === s).length;
        const piene = conta('piena'), aiutate = conta('aiutata'), aperte = n - piene - aiutate;
        const rivedere = [];
        domande.forEach((x, k) => { if ((stati[k] === 'aiutata' || stati[k] === 'tentata') && x.u && !rivedere.includes(x.u)) rivedere.push(x.u); });
        riepilogo.innerHTML = '<div class="occhiello c">Riepilogo della variante ' + variante + '</div>' +
          '<div class="hud"><div class="c"><small>Giuste al primo tentativo</small><b>' + piene + '</b></div><div class="a"><small>Giuste con un aiuto</small><b>' + aiutate + '</b></div><div><small>Ancora aperte</small><b>' + aperte + '</b></div><div><small>Domande</small><b>' + n + '</b></div></div>' +
          '<p style="color:#e9fafc">' + (piene + aiutate === 0 ? 'Rispondi alle domande nell’ordine che preferisci. Conta come «al primo tentativo» una risposta giusta data senza indizi e senza tentativi precedenti.'
            : aperte > 0 ? (aperte === 1 ? 'Resta una domanda aperta' : 'Restano ' + aperte + ' domande aperte') + '. Puoi tornarci in qualunque momento.'
            : piene === n ? 'Hai risolto tutte le domande al primo tentativo. Per una conferma puoi provare un’altra variante.'
            : 'Hai risolto tutte le domande. Quelle che hanno richiesto un aiuto indicano gli argomenti su cui conviene tornare.') + '</p>' +
          (rivedere.length ? '<div class="colonna" style="gap:8px"><div class="occhiello m" style="font-size:11px">Unità da rivedere</div><div class="riga-bottoni">' + rivedere.map((id) => { const info = SL.trovaUnita(id); return '<a class="bottone" href="#/u/' + E(id) + '">' + E(id) + (info ? ' · ' + E(info.titolo) : '') + '</a>'; }).join('') + '</div></div>' : '');
      };
      main.querySelectorAll('[data-q]').forEach((nodo) => {
        const k = Number(nodo.dataset.q), x = domande[k];
        SL.esercizio(nodo, x, k + 1, dopo, {
          occhiello: 'Domanda ' + (k + 1) + ' di ' + n + (x.u ? ' · dall’unità ' + x.u : ''),
          alEsito: (ok, tentativi, indizi) => {
            if (stati[k] === 'piena' || stati[k] === 'aiutata') return;
            stati[k] = ok ? (tentativi === 1 && !indizi ? 'piena' : 'aiutata') : 'tentata';
            disegnaRiepilogo();
          }
        });
      });
      disegnaRiepilogo();
      main.querySelector('[data-b="altra"]').addEventListener('click', () => { SL.vai('#/p/' + cap.id + '/' + altraVariante(variante)); });
      dopo.forEach((f) => { const p = f(); if (p) pulizie.push(p); });
      document.title = 'Prova · ' + cap.breve + ' · SistemiLab';
      window.scrollTo(0, 0);
    }).catch((err) => {
      if (!vivo) return;
      main.innerHTML = '<div class="pagina"><h1 class="titolone">Prova non disponibile</h1><p class="guida">' + E(err.message) + '.</p><p><a class="bottone primo" href="#/c/' + E(cap.id) + '">Torna al capitolo</a></p></div>';
    });
    return () => { vivo = false; pulizie.forEach((f) => { try { f(); } catch (e) { /* già smontato */ } }); };
  };
})();
