'use strict';
/* Rete del corso in tre dimensioni, pagina di capitolo e glossario. */
(() => {
  const E = SL.E, T = SL.T;
  let scelto = { m: 0, c: null };

  const nodo = (grande, cx, cy, sim, n, d, attr, sel, nasce) =>
    '<div class="nodo' + (grande ? ' grande' : '') + (sel ? ' sel' : '') + (nasce ? ' nasce' : '') + '" ' + attr + ' style="left:' + (cx - (grande ? 44 : 30)) + 'px;top:' + (cy - (grande ? 44 : 30)) + 'px' + (nasce ? ';animation-delay:' + nasce + 'ms' : '') + '">' +
    '<i class="f-fronte"></i><i class="f-lato"></i><i class="f-sopra"></i><div class="perno"><button type="button" class="insegna" aria-pressed="' + Boolean(sel) + '">' +
    '<span class="targa"><span class="n">' + E(n) + '</span><span class="d">' + E(d) + '</span></span>' + SL.sim(sim, grande ? 76 : 50) + '</button></div></div>';

  SL.viste.rete = SL.viste.m = (main, r) => {
    const mods = SL.corso, passo = 800 / (mods.length - 1);
    if (r.vista === 'm') { const k = mods.findIndex((x) => x.k === r.a); if (k >= 0) scelto = { m: k, c: null }; }
    const mx = (i) => Math.round(100 + i * passo);
    main.innerHTML = '<div class="pagina larga">' +
      '<div class="riga-bottoni" style="justify-content:space-between;align-items:flex-end;gap:16px 48px"><div class="colonna" style="gap:10px"><div class="occhiello">SistemiLab · atlante interattivo</div><h1 class="titolone">Architettura <span style="color:var(--ambra)">dei sistemi</span></h1></div>' +
      '<p class="guida" style="flex:1 1 420px;max-width:620px">Scegli un modulo sulla rete e poi un capitolo. Ogni nodo è sempre aperto e il sito non tiene traccia di ciò che hai già visto. Le linee indicano l’ordine consigliato a chi parte da zero.</p></div>' +
      '<section class="rete-cornice" aria-label="Rete del corso"><div data-r="scala"><div class="piano-fisso rete"><div class="suolo">' +
      '<div class="traccia" style="left:100px;top:98px;width:800px"></div><div class="traccia dato" style="left:100px;top:268px;width:800px"></div>' +
      '<div class="discesa" data-r="discesa"><i></i></div><div class="corre"></div><div data-r="gambi"></div>' +
      mods.map((m, i) => nodo(true, mx(i), 100, m.sim, m.r, m.breve, 'data-m="' + i + '"', false, 0)).join('') +
      '<div data-r="capitoli" style="transform-style:preserve-3d"></div></div>' +
      '<div class="legenda"><div class="occhiello m">Come leggere la rete</div><div><i class="q"></i><span>Sulla fila di fondo si trovano i moduli.</span></div><div><i></i><span>La linea azzurra scende dal modulo scelto ai suoi capitoli.</span></div><div><i class="o"></i><span>Da sinistra a destra corre l’ordine consigliato.</span></div></div>' +
      '<div class="scheda pannello tacca" data-r="scheda" aria-live="polite"></div></div></div></section>' +
      '<section class="colonna" style="gap:14px" aria-label="Capitoli del modulo scelto"><div class="riga-bottoni" style="align-items:baseline;gap:6px 16px"><div class="occhiello" data-r="titlista"></div><div class="nota" style="font-size:15px">Lo stesso elenco della rete, per chi preferisce scegliere da una lista.</div></div><div class="carte" data-r="carte"></div></section></div>';
    const Q = (k) => main.querySelector('[data-r="' + k + '"]');
    const ferma = SL.scala(Q('scala'), 1180, 800);
    Q('scala').classList.add('scalato');

    const scheda = () => {
      const mod = mods[scelto.m], cap = scelto.c == null ? null : mod.capitoli[scelto.c];
      let h;
      if (!cap) h = '<div class="su">' + SL.sim(mod.sim, 44) + '<div class="occhiello">Modulo ' + E(mod.r) + '</div></div><div class="t">' + E(mod.nome) + '</div><div class="c">' + (mod.k === '0' ? 'Quattro unità brevi per chi parte da zero. Scegline una sulla fila avanzata della rete oppure dall’elenco qui sotto.' : 'Questo modulo ha ' + mod.capitoli.length + ' capitoli. Scegline uno sulla fila avanzata della rete oppure dall’elenco qui sotto.') + '</div>';
      else {
        const nuovo = cap.stato === 'nuovo';
        h = '<div class="su">' + SL.sim(cap.sim, 44) + '<div class="occhiello">' + (cap.diretta ? 'Unità ' : 'Capitolo ') + E(cap.id) + '</div></div><div class="t">' + E(cap.titolo) + '</div><div class="c">' +
          E(nuovo ? (cap.guida || cap.scopo) : 'Questo capitolo non è ancora stato riscritto e si apre nella versione precedente del sito.') + '</div>' +
          '<a class="bottone primo" href="' + SL.apriCapitolo(cap) + '">' + (nuovo ? (cap.diretta ? 'Apri l’unità' : 'Apri il capitolo') : 'Apri nella versione precedente') + '</a>';
      }
      Q('scheda').innerHTML = h;
    };
    const capitoli = (anima) => {
      const mod = mods[scelto.m], n = mod.capitoli.length;
      const cx = (j) => Math.round(100 + j * (800 / (n - 1)));
      Q('gambi').innerHTML = mod.capitoli.map((c, j) => '<div class="gambo' + (scelto.c === j ? ' sel' : '') + '" data-g="' + j + '" style="left:' + (cx(j) - 2) + 'px"></div>').join('');
      Q('capitoli').innerHTML = mod.capitoli.map((c, j) => nodo(false, cx(j), 470, c.sim, c.id, c.breve, 'data-c="' + j + '"', scelto.c === j, anima ? 40 + j * 45 : 0)).join('');
      Q('titlista').textContent = (mod.k === '0' ? 'Unità del modulo ' : 'Capitoli del modulo ') + mod.r + ' · ' + mod.nome;
      Q('carte').innerHTML = mod.capitoli.map((c, j) => '<button type="button" class="carta" data-c="' + j + '" aria-pressed="' + (scelto.c === j) + '">' + SL.sim(c.sim, 36) + '<span><span class="k">' + E(c.id) + '</span><span class="v">' + E(c.titolo) + '</span>' + (c.stato === 'nuovo' ? '' : '<span class="w">versione precedente</span>') + '</span></button>').join('');
    };
    const moduli = () => {
      main.querySelectorAll('.nodo[data-m]').forEach((n) => { const on = Number(n.dataset.m) === scelto.m; n.classList.toggle('sel', on); n.querySelector('.insegna').setAttribute('aria-pressed', String(on)); });
      Q('discesa').style.left = (mx(scelto.m) - 2) + 'px';
    };
    const segnaCapitolo = () => {
      main.querySelectorAll('.nodo[data-c]').forEach((n) => { const on = Number(n.dataset.c) === scelto.c; n.classList.toggle('sel', on); n.querySelector('.insegna').setAttribute('aria-pressed', String(on)); });
      main.querySelectorAll('.gambo').forEach((g) => g.classList.toggle('sel', Number(g.dataset.g) === scelto.c));
      main.querySelectorAll('.carta[data-c]').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.c) === scelto.c)));
      scheda();
    };
    const alClic = (ev) => {
      const m = ev.target.closest('.nodo[data-m]'), c = ev.target.closest('[data-c]');
      if (m) {
        scelto = { m: Number(m.dataset.m), c: null }; moduli(); capitoli(true); scheda();
        try { history.replaceState(null, '', '#/m/' + mods[scelto.m].k); } catch (e) { /* l'indirizzo resta quello di prima */ }
      } else if (c && main.contains(c)) { scelto.c = Number(c.dataset.c); segnaCapitolo(); }
    };
    main.addEventListener('click', alClic);
    moduli(); capitoli(false); scheda();
    window.scrollTo(0, 0);
    return () => { ferma(); main.removeEventListener('click', alClic); };
  };

  SL.viste.c = (main, r) => {
    const t = SL.trovaCapitolo(r.a);
    if (!t || t.cap.stato !== 'nuovo' || t.cap.diretta) { main.innerHTML = '<div class="pagina"><h1 class="titolone">Capitolo non disponibile</h1><p class="guida">Questo capitolo non è ancora nel nuovo formato.</p><p><a class="bottone primo" href="#/">Torna alla rete del corso</a></p></div>'; return null; }
    const cap = t.cap, mod = t.mod;
    main.innerHTML = '<div class="pagina">' +
      '<div class="nota" style="font-family:var(--mono)"><a href="#/m/' + mod.k + '">Rete del corso</a> / Modulo ' + E(mod.r) + ' / Capitolo ' + E(cap.id) + '</div>' +
      '<header class="testata"><span class="filigrana" style="right:-30px;top:-46px">' + SL.sim(mod.sim, 230) + '</span><span class="filigrana" style="right:170px;bottom:-70px">' + SL.sim(cap.unita[1].sim, 190) + '</span>' +
      '<div class="podio">' + SL.sim(cap.sim, 104) + '</div><div class="dx"><div class="occhiello">Capitolo ' + E(cap.id) + ' · Modulo ' + E(mod.r) + '</div><h1>' + E(cap.titolo) + '</h1><p style="color:var(--testo2);max-width:640px">' + E(cap.guida) + '</p></div></header>' +
      '<section class="colonna" style="gap:14px"><div class="occhiello">Le unità, nell’ordine consigliato</div><p class="guida" style="font-size:16px">Ogni unità richiama ciò che serve, racconta l’idea, la fa provare in un esperimento e si chiude con un bilancio. Puoi aprirle in qualsiasi ordine.</p><div class="carte" style="grid-template-columns:repeat(auto-fit,minmax(min(330px,100%),1fr))">' +
      cap.unita.map((u) => '<a class="carta" href="#/u/' + u.id + '" style="min-height:92px;align-items:flex-start;padding:14px 16px">' + SL.sim(u.sim, 52) + '<span><span class="k">' + E(u.id) + '</span><span class="v" style="font-size:17px;color:var(--chiaro);font-weight:600">' + E(u.titolo) + '</span><span class="w" style="font-size:14px;color:var(--testo2)">' + E(u.scopo) + '</span></span></a>').join('') + '</div></section>' +
      '<div class="griglia">' + (cap.prova
        ? '<section class="pannello colonna"><div class="occhiello">Prova del capitolo</div><p style="color:#d6ccb5">Una domanda per ogni argomento del capitolo, con dati che cambiano da una variante all’altra. Ogni risposta riceve un commento, e il riepilogo finale indica le unità da rivedere. Il sito lo dimentica appena lasci la pagina.</p><p><a class="bottone" href="#/p/' + E(cap.id) + '">Apri la prova del capitolo</a></p></section>'
        : '<section class="pannello colonna"><div class="occhiello">Prova del capitolo</div><p style="color:#d6ccb5">Gli esercizi di fine capitolo, con le loro varianti, sono per ora nella versione precedente del sito. Ogni unità qui sopra ha già i propri esercizi nel bilancio.</p><p><a class="bottone" href="classico.html#esercitazioni/' + E(cap.id) + '">Apri gli esercizi del capitolo</a></p></section>') +
      '<section class="pannello colonna"><div class="occhiello">Sfide PWN del capitolo</div><p style="color:#d6ccb5">' + (cap.sfide.length ? 'Si svolgono in un terminale, sulla piattaforma indicata a lezione.' : 'Questo capitolo riunisce gli argomenti dei precedenti. Le sfide collegate sono quelle elencate nei capitoli da cui ciascun argomento proviene.') + '</p>' + cap.sfide.map((s) => '<div class="colonna" style="gap:0"><span style="font:500 14px var(--mono);color:var(--chiaro);word-break:break-all">' + E(s[0]) + '</span><span class="nota">' + E(s[1]) + '</span></div>').join('') + '</section></div>' +
      '<div class="passi-fase"><a class="bottone" href="#/m/' + mod.k + '">Torna alla rete</a><a class="bottone primo" href="#/u/' + cap.unita[0].id + '">Comincia dall’unità ' + E(cap.unita[0].id) + '</a></div></div>';
    window.scrollTo(0, 0);
    return null;
  };

  SL.viste.glossario = (main) => {
    const voci = Object.keys(SL.glossario).map((id) => Object.assign({ id }, SL.glossario[id])).sort((a, b) => a.t.localeCompare(b.t, 'it'));
    main.innerHTML = '<div class="pagina"><div class="colonna" style="gap:10px"><div class="occhiello">Glossario · ' + voci.length + ' termini</div><h1 class="titolone">Le parole del corso</h1><p class="guida">Ogni termine compare qui con la definizione data nell’unità che lo introduce. I simboli sono gli stessi usati nella rete e negli esperimenti.</p></div>' +
      '<div class="colonna" style="gap:0;background:var(--pan);border:1px solid var(--riga)">' + voci.map((v, k) => '<div style="display:flex;gap:16px;align-items:center;padding:12px 18px' + (k ? ';border-top:1px solid #2a2418' : '') + '">' + SL.sim(v.s || 'input', 46) + '<div style="flex:1 1 auto;min-width:0"><div style="font-weight:600;color:var(--chiaro)">' + E(v.t) + '</div><div style="color:var(--testo2);font-size:15px">' + E(v.d) + '</div></div><a class="nota" style="flex:none;font-family:var(--mono)" href="#/u/' + E(v.u) + '/2">' + E(v.u) + '</a></div>').join('') + '</div></div>';
    window.scrollTo(0, 0);
    return null;
  };
})();
