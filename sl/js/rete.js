'use strict';
/* Rete del corso in tre dimensioni, pagina di capitolo e glossario. */
(() => {
  const E = SL.E;
  let scelto = { m: 0, c: null };

  const nodo = (grande, cx, cy, sim, n, d, attr, sel, nasce) =>
    '<div class="nodo' + (grande ? ' grande' : '') + (sel ? ' sel' : '') + (nasce ? ' nasce' : '') + '" ' + attr + ' style="left:' + (cx - (grande ? 44 : 30)) + 'px;top:' + (cy - (grande ? 44 : 30)) + 'px' + (nasce ? ';animation-delay:' + nasce + 'ms' : '') + '">' +
    '<i class="f-fronte"></i><i class="f-lato"></i><i class="f-sopra"></i><div class="perno"><button type="button" class="insegna" aria-pressed="' + Boolean(sel) + '">' +
    '<span class="targa"><span class="n">' + E(n) + '</span><span class="d">' + E(d) + '</span></span>' + SL.sim(sim, grande ? 76 : 50) + '</button></div></div>';

  // Consistenza di un modulo, ricavata dalla mappa del corso.
  const conta = (m) => { let u = 0, p = 0; m.capitoli.forEach((c) => { u += c.unita ? c.unita.length : 1; if (c.prova) p++; }); return { c: m.capitoli.filter((c) => !c.diretta).length, u, p }; };
  const consistenza = (m) => { const n = conta(m); return (n.c ? n.c + ' capitoli · ' : '') + n.u + ' unità' + (n.p ? ' · ' + n.p + ' prove' : ''); };
  // Nei prerequisiti i numeri di capitolo e di unità diventano collegamenti.
  const conRinvii = (s) => E(s).replace(/\b\d\.\d\b/g, (id) => '<a href="#/' + (id[0] === '0' ? 'u' : 'c') + '/' + id + '">' + id + '</a>');
  // Percorso di studio: indica a chi apre il sito da dove ha inizio lo studio e in quale ordine procede.
  const percorso = (conGuida) => {
    const mods = SL.corso, zero = mods[0].capitoli, prima = zero[0].id, ultima = zero[zero.length - 1].id;
    const tappe = [
      ['Modulo ' + E(mods[0].r) + ' · ' + E(mods[0].nome), 'Il modulo comprende ' + zero.length + ' unità brevi, prive di prerequisiti. L’unità ' + E(ultima) + ' presenta le cinque fasi di ogni unità e i comandi degli esperimenti.'],
      ['Moduli da ' + E(mods[1].r) + ' a ' + E(mods[mods.length - 1].r), 'I ' + (mods.length - 1) + ' moduli tematici si affrontano nell’ordine della rete, poiché ciascuno richiama nozioni dei precedenti. La scheda di ogni modulo ne indica argomento, prerequisiti ed esiti attesi.'],
      ['All’interno di un capitolo', 'Le unità si percorrono nell’ordine indicato; seguono la prova del capitolo e le sfide in terminale. Ogni unità si articola in cinque fasi: richiami, esposizione, esperimento, esecuzione guidata, bilancio. Le ' + SL.unitaInOrdine.filter((u) => u.oltre).length + ' unità contrassegnate come approfondimento vanno oltre la <a href="#/dispensa">dispensa di riferimento</a>, e la loro consultazione è facoltativa.']
    ];
    return '<section class="pannello tacca colonna" style="gap:18px" aria-label="Percorso di studio"><div class="colonna" style="gap:6px"><div class="occhiello">Percorso di studio</div><h2 class="titolo2">Da dove ha inizio lo studio</h2></div>' +
      '<ol class="tappe">' + tappe.map((x, k) => '<li><span class="n" aria-hidden="true">' + (k + 1) + '</span><div><h3 class="titolo3">' + x[0] + '</h3><p>' + x[1] + '</p></div></li>').join('') + '</ol>' +
      '<div class="riga-bottoni"><a class="bottone primo" href="#/u/' + E(prima) + '">Inizio del percorso · unità ' + E(prima) + '</a><a class="bottone" href="#/u/' + E(ultima) + '">Uso del laboratorio · unità ' + E(ultima) + '</a>' + (conGuida ? '<a class="bottone" href="#/guida">Guida all’uso</a>' : '') + '<button type="button" class="bottone" data-intro>Introduzione al sito</button></div>' +
      '<p class="nota">Il sito non conserva alcun dato. A ogni visita il punto raggiunto si ritrova mediante l’elenco dei moduli oppure la rete.</p></section>';
  };

  SL.viste.rete = SL.viste.m = (main, r) => {
    const mods = SL.corso, passo = 800 / (mods.length - 1);
    if (r.vista === 'm') { const k = mods.findIndex((x) => x.k === r.a); if (k >= 0) scelto = { m: k, c: null }; }
    const mx = (i) => Math.round(100 + i * passo);
    // La pagina principale presenta il percorso di studio; l'indirizzo di un modulo conduce direttamente alla sua scheda.
    const casa = r.vista !== 'm';
    main.innerHTML = '<div class="pagina larga">' +
      '<div class="riga-bottoni" style="justify-content:space-between;align-items:flex-end;gap:16px 48px"><div class="colonna" style="gap:10px"><div class="occhiello">SistemiLab · atlante interattivo</div><h1 class="titolone">Architettura <span style="color:var(--ambra)">dei sistemi</span></h1></div>' +
      '<p class="guida" style="flex:1 1 420px;max-width:620px">' + (casa
        ? 'SistemiLab è il laboratorio interattivo del corso di architettura dei sistemi. Ogni argomento è trattato in un’unità costruita attorno a un esperimento, eseguibile un passo alla volta. Il percorso di studio è indicato qui sotto; la rete dispone moduli e capitoli nell’ordine consigliato.'
        : 'La scheda del modulo selezionato e l’elenco dei relativi capitoli si trovano sotto la rete. Il percorso di studio è descritto nella <a href="#/">pagina principale</a>.') + '</p></div>' +
      (casa ? percorso(true) : '') +
      '<section class="colonna" style="gap:10px" aria-label="Moduli del corso"><div class="riga-bottoni" style="align-items:baseline;gap:6px 16px"><div class="occhiello">Moduli del corso</div><div class="nota" style="font-size:15px">La selezione di un modulo ne mostra, sotto la rete, la scheda e i capitoli.</div></div>' +
      '<div class="linguette" role="group" aria-label="Selezione del modulo">' + mods.map((m, i) => '<button type="button" class="linguetta" data-m="' + i + '" aria-pressed="false"><b>' + E(m.r) + '</b><span>' + E(m.breve) + '</span></button>').join('') + '</div></section>' +
      '<section class="rete-cornice" aria-label="Rete del corso"><div data-r="scala"><div class="piano-fisso rete"><div class="suolo">' +
      '<div class="traccia" style="left:100px;top:98px;width:800px"></div><div class="traccia dato" style="left:100px;top:268px;width:800px"></div>' +
      '<div class="discesa" data-r="discesa"><i></i></div><div class="corre"></div><div data-r="gambi"></div>' +
      mods.map((m, i) => nodo(true, mx(i), 100, m.sim, m.r, m.breve, 'data-m="' + i + '"', false, 0)).join('') +
      '<div data-r="capitoli" style="transform-style:preserve-3d"></div></div>' +
      '<div class="legenda"><div class="occhiello m">Come leggere la rete</div><div><i class="q"></i><span>Sulla fila di fondo si trovano i moduli.</span></div><div><i></i><span>La linea azzurra scende dal modulo scelto ai suoi capitoli.</span></div><div><i class="o"></i><span>Da sinistra a destra corre l’ordine consigliato.</span></div></div>' +
      '<div class="scheda pannello tacca" data-r="scheda" aria-live="polite"></div></div></div></section>' +
      '<section class="pannello modulo" data-r="modulo" aria-label="Scheda del modulo scelto"></section>' +
      '<section class="colonna" style="gap:14px" aria-label="Capitoli del modulo scelto"><div class="riga-bottoni" style="align-items:baseline;gap:6px 16px"><div class="occhiello" data-r="titlista"></div><div class="nota" style="font-size:15px" data-r="notalista"></div></div><div class="carte" data-r="carte"></div></section></div>';
    const Q = (k) => main.querySelector('[data-r="' + k + '"]');
    const ferma = SL.scala(Q('scala'), 1180, 800);
    Q('scala').classList.add('scalato');

    const scheda = () => {
      const mod = mods[scelto.m], cap = scelto.c == null ? null : mod.capitoli[scelto.c];
      let h;
      if (!cap) h = '<div class="su">' + SL.sim(mod.sim, 44) + '<div class="occhiello">Modulo ' + E(mod.r) + '</div></div><div class="t">' + E(mod.nome) + '</div><div class="c">' + (() => { const n = conta(mod); return n.c ? 'Il modulo comprende ' + n.c + ' capitoli, ' + n.u + ' unità e ' + n.p + ' prove di capitolo. La scheda del modulo e l’elenco dei capitoli si trovano sotto la rete.' : 'Il modulo comprende ' + n.u + ' unità brevi, prive di prerequisiti. La scheda del modulo e l’elenco delle unità si trovano sotto la rete.'; })() + '</div>';
      else h = '<div class="su">' + SL.sim(cap.sim, 44) + '<div class="occhiello">' + (cap.diretta ? 'Unità ' : 'Capitolo ') + E(cap.id) + '</div></div><div class="t">' + E(cap.titolo) + '</div><div class="c">' + E(cap.guida || cap.scopo) + '</div>' +
        '<a class="bottone primo" href="' + SL.apriCapitolo(cap) + '">' + (cap.diretta ? 'Pagina dell’unità' : 'Pagina del capitolo') + '</a>';
      Q('scheda').innerHTML = h;
    };
    const schedaModulo = () => {
      const mod = mods[scelto.m], x = mod.intro, primo = mod.capitoli[0];
      Q('modulo').innerHTML = '<div class="su">' + SL.sim(mod.sim, 64) + '<div class="colonna" style="gap:4px"><div class="occhiello">Modulo ' + E(mod.r) + ' · ' + consistenza(mod) + '</div><h2 class="titolo2">' + E(mod.nome) + '</h2></div></div>' +
        '<div class="tre"><div><h3 class="occhiello c">Argomento</h3><p>' + E(x.tema) + '</p></div>' +
        '<div><h3 class="occhiello c">Prerequisiti</h3><p>' + conRinvii(x.premesse) + '</p></div>' +
        '<div><h3 class="occhiello c">Al termine del modulo</h3><ul>' + x.esiti.map((e) => '<li>' + E(e) + '</li>').join('') + '</ul></div></div>' +
        '<div class="riga-bottoni"><a class="bottone primo" href="' + SL.apriCapitolo(primo) + '">' + (primo.diretta ? 'Prima unità' : 'Primo capitolo') + ' · ' + E(primo.id) + ' ' + E(primo.titolo) + '</a></div>';
    };
    const capitoli = (anima) => {
      const mod = mods[scelto.m], n = mod.capitoli.length;
      const cx = (j) => Math.round(100 + j * (800 / (n - 1)));
      Q('gambi').innerHTML = mod.capitoli.map((c, j) => '<div class="gambo' + (scelto.c === j ? ' sel' : '') + '" data-g="' + j + '" style="left:' + (cx(j) - 2) + 'px"></div>').join('');
      Q('capitoli').innerHTML = mod.capitoli.map((c, j) => nodo(false, cx(j), 470, c.sim, c.id, c.breve, 'data-c="' + j + '"', scelto.c === j, anima ? 40 + j * 45 : 0)).join('');
      Q('titlista').textContent = (mod.k === '0' ? 'Unità del modulo ' : 'Capitoli del modulo ') + mod.r + ' · ' + mod.nome;
      Q('notalista').textContent = mod.k === '0' ? 'Ogni voce conduce all’unità.' : 'Ogni voce conduce alla pagina del capitolo.';
      Q('carte').innerHTML = mod.capitoli.map((c) => '<a class="carta" href="' + SL.apriCapitolo(c) + '">' + SL.sim(c.sim, 36) + '<span><span class="k">' + E(c.id) + '</span><span class="v">' + E(c.titolo) + '</span><span class="w">' +
        E(c.diretta ? c.scopo : c.unita.length + ' unità' + (c.unita.every((u) => u.oltre) ? ' di approfondimento' : '') + (c.prova ? ' · prova di capitolo' : '') + (c.sfide.length ? ' · ' + c.sfide.length + ' sfide' : '')) + '</span></span></a>').join('');
    };
    const moduli = () => {
      main.querySelectorAll('.nodo[data-m]').forEach((n) => { const on = Number(n.dataset.m) === scelto.m; n.classList.toggle('sel', on); n.querySelector('.insegna').setAttribute('aria-pressed', String(on)); });
      main.querySelectorAll('.linguetta').forEach((b) => b.setAttribute('aria-pressed', String(Number(b.dataset.m) === scelto.m)));
      Q('discesa').style.left = (mx(scelto.m) - 2) + 'px';
    };
    const segnaCapitolo = () => {
      main.querySelectorAll('.nodo[data-c]').forEach((n) => { const on = Number(n.dataset.c) === scelto.c; n.classList.toggle('sel', on); n.querySelector('.insegna').setAttribute('aria-pressed', String(on)); });
      main.querySelectorAll('.gambo').forEach((g) => g.classList.toggle('sel', Number(g.dataset.g) === scelto.c));
      scheda();
    };
    const alClic = (ev) => {
      const m = ev.target.closest('[data-m]'), c = ev.target.closest('[data-c]');
      if (m && main.contains(m)) {
        scelto = { m: Number(m.dataset.m), c: null }; moduli(); capitoli(true); scheda(); schedaModulo();
        try { history.replaceState(null, '', '#/m/' + mods[scelto.m].k); } catch (e) { /* l'indirizzo resta quello di prima */ }
      } else if (c && main.contains(c)) { scelto.c = Number(c.dataset.c); segnaCapitolo(); }
    };
    main.addEventListener('click', alClic);
    moduli(); capitoli(false); scheda(); schedaModulo();
    window.scrollTo(0, 0);
    return () => { ferma(); main.removeEventListener('click', alClic); };
  };

  SL.viste.c = (main, r) => {
    const t = SL.trovaCapitolo(r.a);
    if (!t || t.cap.diretta) { main.innerHTML = '<div class="pagina"><h1 class="titolone">Capitolo non trovato</h1><p class="guida">L’identificativo indicato non corrisponde ad alcun capitolo del corso.</p><p><a class="bottone primo" href="#/">Rete del corso</a></p></div>'; return null; }
    const cap = t.cap, mod = t.mod;
    const nCap = mod.capitoli.indexOf(cap), nMod = SL.corso.indexOf(mod);
    const dopoCap = mod.capitoli[nCap + 1] || (SL.corso[nMod + 1] ? SL.corso[nMod + 1].capitoli[0] : null);
    let vivo = true;
    main.innerHTML = '<div class="pagina">' +
      '<div class="nota briciole"><a href="#/m/' + mod.k + '">Rete del corso</a> / <a href="#/m/' + mod.k + '">Modulo ' + E(mod.r) + '</a> / Capitolo ' + E(cap.id) + '</div>' +
      '<header class="testata"><span class="filigrana" style="right:-30px;top:-46px">' + SL.sim(mod.sim, 230) + '</span><span class="filigrana" style="right:170px;bottom:-70px">' + SL.sim(cap.unita[1].sim, 190) + '</span>' +
      '<div class="podio">' + SL.sim(cap.sim, 104) + '</div><div class="dx"><div class="occhiello">Capitolo ' + E(cap.id) + ' · Modulo ' + E(mod.r) + ' · capitolo ' + (nCap + 1) + ' di ' + mod.capitoli.length + '</div><h1>' + E(cap.titolo) + '</h1><p style="color:var(--testo2);max-width:640px">' + E(cap.guida) + '</p>' +
      '<p class="premesse" data-r="premesse"></p></div></header>' +
      '<p class="guida">Il capitolo si svolge in tre passi: le ' + cap.unita.length + ' unità, la prova e le sfide in terminale. Ogni unità richiama i prerequisiti, espone l’argomento, lo verifica in un esperimento e si conclude con un bilancio; l’ordine di consultazione resta libero.' + (function () { const n = cap.unita.filter((u) => u.oltre).length; return !n ? '' : n === cap.unita.length ? ' Tutte le unità del capitolo sono di approfondimento: il loro argomento va oltre la <a href="#/dispensa">dispensa</a>, e la consultazione è facoltativa.' : (n === 1 ? ' L’unità contrassegnata come approfondimento va' : ' Le ' + n + ' unità contrassegnate come approfondimento vanno') + ' oltre la <a href="#/dispensa">dispensa</a>, e la loro consultazione è facoltativa.'; })() + '</p>' +
      '<section class="colonna" style="gap:14px"><h2 class="occhiello">Passo 1 · Le unità, nell’ordine indicato</h2><div class="carte elenco">' +
      cap.unita.map((u, k) => '<a class="carta unita' + (u.oltre ? ' oltre' : '') + '" href="#/u/' + u.id + '">' + SL.sim(u.sim, 52) + '<span><span class="k">' + E(u.id) + ' · unità ' + (k + 1) + ' di ' + cap.unita.length + '</span>' + (u.oltre ? '<span class="approf">Approfondimento</span>' : '') + '<span class="v">' + E(u.titolo) + '</span><span class="w">' + E(u.scopo) + '</span></span><span class="ob" data-ob="' + E(u.id) + '"></span></a>').join('') + '</div></section>' +
      '<div class="griglia">' +
        '<section class="pannello colonna"><h2 class="occhiello">Passo 2 · Prova del capitolo</h2><p style="color:#d6ccb5">La prova si affronta al termine delle unità. Comprende una domanda per ogni argomento del capitolo, con dati che cambiano da una variante all’altra. Ogni risposta riceve un commento, e il riepilogo finale indica le unità da rivedere; alla chiusura della pagina il riepilogo è eliminato.</p><p><a class="bottone" href="#/p/' + E(cap.id) + '">Prova del capitolo</a></p></section>' +
      '<section class="pannello colonna"><h2 class="occhiello">Passo 3 · Sfide in terminale</h2><p style="color:#d6ccb5">' + (cap.sfide.length ? 'Le sfide sono esercizi da svolgere in un terminale, al termine del capitolo. Il sito ne riporta l’identificativo e il titolo; la piattaforma è indicata a lezione.' : 'Questo capitolo riunisce gli argomenti dei precedenti. Le sfide collegate sono quelle elencate nei capitoli da cui ciascun argomento proviene.') + '</p>' + cap.sfide.map((s) => '<div class="colonna" style="gap:0"><span style="font:500 14px var(--mono);color:var(--chiaro);word-break:break-all">' + E(s[0]) + '</span><span class="nota">' + E(s[1]) + '</span></div>').join('') + '</section></div>' +
      '<div class="passi-fase"><a class="bottone" href="#/m/' + mod.k + '">Rete del corso</a>' + (dopoCap ? '<a class="bottone" href="' + SL.apriCapitolo(dopoCap) + '">Capitolo successivo · ' + E(dopoCap.id) + '</a>' : '') + '<a class="bottone primo" href="#/u/' + cap.unita[0].id + '">Prima unità · ' + E(cap.unita[0].id) + '</a></div></div>';
    // Obiettivi e prerequisiti provengono dai file delle unità, letti qui in anticipo: l'apertura di un'unità ne risulta immediata.
    const serie = (v) => (v.length < 2 ? v.join('') : v.slice(0, -1).join(', ') + ' e ' + v[v.length - 1]);
    const peso = (id) => id.split('.').reduce((s, x) => s * 100 + Number(x), 0);
    Promise.all(cap.unita.map((u) => SL.carica(u.id).catch(() => null))).then((lista) => {
      if (!vivo) return;
      const fuori = new Set();
      lista.forEach((u) => {
        if (!u) return;
        const o = main.querySelector('[data-ob="' + u.id + '"]');
        if (o) o.textContent = String(u.obiettivo || '').replace(/\[\[(?:[^\]|]+\|)?([^\]]+)\]\]/g, '$1').replace(/`/g, '');
        ((u.richiami && u.richiami.carte) || []).forEach((c) => (String(c.da).match(/\d+(\.\d+)+/g) || []).forEach((id) => { const p = id.split('.'), k = p[0] === '0' ? id : p[0] + '.' + p[1]; if (k !== cap.id && SL.idCapitolo(k)) fuori.add(k); }));
      });
      const pre = main.querySelector('[data-r="premesse"]');
      if (!pre || !lista.every(Boolean)) return;
      const ord = Array.from(fuori).sort((a, b) => peso(a) - peso(b));
      const un = ord.filter((k) => k[0] === '0').map((k) => '<a href="#/u/' + k + '">' + k + '</a>'), ca = ord.filter((k) => k[0] !== '0').map((k) => '<a href="#/c/' + k + '">' + k + '</a>');
      pre.innerHTML = ord.length
        ? '<b>Prerequisiti.</b> Nozioni ' + (un.length ? (un.length > 1 ? 'delle unità ' : 'dell’unità ') + serie(un) : '') + (un.length && ca.length ? ' e ' : '') + (ca.length ? (ca.length > 1 ? 'dei capitoli ' : 'del capitolo ') + serie(ca) : '') + ', richiamate nella prima fase di ogni unità.'
        : '<b>Prerequisiti.</b> Il capitolo richiama soltanto nozioni introdotte al proprio interno.';
    });
    window.scrollTo(0, 0);
    return () => { vivo = false; };
  };

  SL.viste.glossario = (main) => {
    const voci = Object.keys(SL.glossario).map((id) => Object.assign({ id }, SL.glossario[id])).sort((a, b) => a.t.localeCompare(b.t, 'it'));
    main.innerHTML = '<div class="pagina"><div class="colonna" style="gap:10px"><div class="occhiello">Glossario · ' + voci.length + ' termini</div><h1 class="titolone">Glossario del corso</h1><p class="guida">Ogni termine compare qui con la definizione data nell’unità che lo introduce. I simboli sono i medesimi impiegati nella rete e negli esperimenti.</p></div>' +
      '<div class="colonna" style="gap:0;background:var(--pan);border:1px solid var(--riga)">' + voci.map((v, k) => '<div style="display:flex;gap:16px;align-items:center;padding:12px 18px' + (k ? ';border-top:1px solid #2a2418' : '') + '">' + SL.sim(v.s || 'input', 46) + '<div style="flex:1 1 auto;min-width:0"><div style="font-weight:600;color:var(--chiaro)">' + E(v.t) + '</div><div style="color:var(--testo2);font-size:15px">' + E(v.d) + '</div></div><a class="nota rinvio" href="#/u/' + E(v.u) + '/2">' + E(v.u) + '</a></div>').join('') + '</div></div>';
    window.scrollTo(0, 0);
    return null;
  };
  /* Guida all'uso: che cosa contiene il sito e come si consulta. I numeri sono calcolati dalla mappa del corso. */
  // Dispensa in costruzione. Il disegno riprende la rete del corso: piano a griglia, blocchi isometrici e linea
  // azzurra; una gru posa l'ultimo blocco. I colori vengono dalle variabili del tema, tramite le classi di sito.css.
  const CANTIERE = '<svg class="cantiere" viewBox="0 0 720 360" role="img" aria-label="Disegno: una gru posa l’ultimo blocco della dispensa; un cartello reca la scritta «In costruzione»"><path class="cp" d="M250.0 95.0 L483.8 230.0 L302.0 335.0 L68.1 200.0Z"/><path class="cg" d="M250.0 95.0 L68.1 200.0"/><path class="cg" d="M276.0 110.0 L94.1 215.0"/><path class="cg" d="M302.0 125.0 L120.1 230.0"/><path class="cg" d="M327.9 140.0 L146.1 245.0"/><path class="cg" d="M353.9 155.0 L172.1 260.0"/><path class="cg" d="M379.9 170.0 L198.0 275.0"/><path class="cg" d="M405.9 185.0 L224.0 290.0"/><path class="cg" d="M431.9 200.0 L250.0 305.0"/><path class="cg" d="M457.8 215.0 L276.0 320.0"/><path class="cg" d="M483.8 230.0 L302.0 335.0"/><path class="cg" d="M250.0 95.0 L483.8 230.0"/><path class="cg" d="M224.0 110.0 L457.8 245.0"/><path class="cg" d="M198.0 125.0 L431.9 260.0"/><path class="cg" d="M172.1 140.0 L405.9 275.0"/><path class="cg" d="M146.1 155.0 L379.9 290.0"/><path class="cg" d="M120.1 170.0 L353.9 305.0"/><path class="cg" d="M94.1 185.0 L327.9 320.0"/><path class="cg" d="M68.1 200.0 L302.0 335.0"/><path class="b fs" d="M198.0 218.0 L276.0 263.0 L276.0 246.5 L198.0 201.5Z"/><path class="b fl" d="M343.5 224.0 L276.0 263.0 L276.0 246.5 L343.5 207.5Z"/><path class="b ft" d="M265.6 162.5 L343.5 207.5 L276.0 246.5 L198.0 201.5Z"/><path class="b fs" d="M205.8 201.5 L276.0 242.0 L276.0 225.5 L205.8 185.0Z"/><path class="b fl" d="M335.7 207.5 L276.0 242.0 L276.0 225.5 L335.7 191.0Z"/><path class="b ft" d="M265.6 150.5 L335.7 191.0 L276.0 225.5 L205.8 185.0Z"/><path class="t fs" d="M205.8 185.0 L276.0 225.5 L276.0 209.0 L205.8 168.5Z"/><path class="t fl" d="M335.7 191.0 L276.0 225.5 L276.0 209.0 L335.7 174.5Z"/><path class="t ft" d="M265.6 134.0 L335.7 174.5 L276.0 209.0 L205.8 168.5Z"/><path class="cr" d="M264.3 161.8 L316.3 191.7"/><path class="cr" d="M252.6 168.5 L294.2 192.5"/><path class="cr" d="M240.9 175.2 L290.3 203.8"/><path class="cr" d="M229.2 182.0 L260.4 200.0"/><path class="h fs" d="M205.8 128.0 L276.0 168.5 L276.0 152.0 L205.8 111.5Z"/><path class="h fl" d="M335.7 134.0 L276.0 168.5 L276.0 152.0 L335.7 117.5Z"/><path class="h ft" d="M265.6 77.0 L335.7 117.5 L276.0 152.0 L205.8 111.5Z"/><path class="cm" d="M405.9 236.0 L405.9 74.0"/><path class="cm" d="M418.9 243.5 L418.9 81.5"/><path class="cm" d="M405.9 251.0 L405.9 89.0"/><path class="cm" d="M392.9 243.5 L392.9 81.5"/><path class="cm" d="M392.9 243.5 L405.9 233.0"/><path class="cm" d="M418.9 243.5 L405.9 233.0"/><path class="cm" d="M392.9 225.5 L405.9 215.0"/><path class="cm" d="M418.9 225.5 L405.9 215.0"/><path class="cm" d="M392.9 207.5 L405.9 197.0"/><path class="cm" d="M418.9 207.5 L405.9 197.0"/><path class="cm" d="M392.9 189.5 L405.9 179.0"/><path class="cm" d="M418.9 189.5 L405.9 179.0"/><path class="cm" d="M392.9 171.5 L405.9 161.0"/><path class="cm" d="M418.9 171.5 L405.9 161.0"/><path class="cm" d="M392.9 153.5 L405.9 143.0"/><path class="cm" d="M418.9 153.5 L405.9 143.0"/><path class="cm" d="M392.9 135.5 L405.9 125.0"/><path class="cm" d="M418.9 135.5 L405.9 125.0"/><path class="cm" d="M392.9 117.5 L405.9 107.0"/><path class="cm" d="M418.9 117.5 L405.9 107.0"/><path class="cm" d="M392.9 99.5 L405.9 89.0"/><path class="cm" d="M418.9 99.5 L405.9 89.0"/><path class="cm" d="M405.9 81.5 L269.5 2.8"/><path class="cm" d="M405.9 66.5 L269.5 2.8"/><path class="cm" d="M405.9 81.5 L405.9 66.5"/><path class="cm" d="M405.9 81.5 L435.8 98.7"/><path class="b fs" d="M425.4 104.8 L438.4 112.2 L438.4 100.2 L425.4 92.8Z"/><path class="b fl" d="M447.5 107.0 L438.4 112.2 L438.4 100.2 L447.5 95.0Z"/><path class="b ft" d="M434.5 87.5 L447.5 95.0 L438.4 100.2 L425.4 92.8Z"/><path class="cm" d="M315.0 29.0 L322.7 33.5 L322.7 38.0 L315.0 33.5Z"/><path class="cc" d="M318.8 35.8 L318.8 70.3"/><path class="cc" d="M318.8 70.3 L265.6 77.0"/><path class="cc" d="M318.8 70.3 L335.7 117.5"/><path class="cc" d="M318.8 70.3 L276.0 152.0"/><path class="cc" d="M318.8 70.3 L205.8 111.5"/><path class="cd" d="M270.8 131.0 L270.8 168.5"/><g class="cartello" transform="translate(468 244)"><path class="cpalo" d="M24 64V96M220 64V96"/><clipPath id="sl-strisce"><rect x="0" y="0" width="244" height="14"/></clipPath><g clip-path="url(#sl-strisce)"><rect class="cs1" x="0" y="0" width="244" height="14"/><path class="cs2" d="M-14 14L0 0H12 L-2 14Z"/><path class="cs2" d="M10 14L24 0H36 L22 14Z"/><path class="cs2" d="M34 14L48 0H60 L46 14Z"/><path class="cs2" d="M58 14L72 0H84 L70 14Z"/><path class="cs2" d="M82 14L96 0H108 L94 14Z"/><path class="cs2" d="M106 14L120 0H132 L118 14Z"/><path class="cs2" d="M130 14L144 0H156 L142 14Z"/><path class="cs2" d="M154 14L168 0H180 L166 14Z"/><path class="cs2" d="M178 14L192 0H204 L190 14Z"/><path class="cs2" d="M202 14L216 0H228 L214 14Z"/><path class="cs2" d="M226 14L240 0H252 L238 14Z"/></g><rect class="ctav" x="0" y="14" width="244" height="50"/><text class="ctesto" x="122" y="48" text-anchor="middle">IN COSTRUZIONE</text></g></svg>';
  SL.viste.dispensa = (main) => {
    main.innerHTML = '<div class="pagina">' +
      '<header class="colonna" style="gap:10px"><div class="occhiello">SistemiLab · dispensa</div><h1 class="titolone">Dispensa <span style="color:var(--ambra)">in costruzione</span></h1>' +
      '<p class="guida">La dispensa di riferimento, <i>Architecture of Computer Systems</i> di Marzio De Corato e Danilo Bruschi, è in fase di revisione. La versione definitiva sarà pubblicata in questa sezione. Il sito ne segue fin d’ora l’edizione rivista, di cui adotta terminologia, notazione e processore del caso di studio.</p></header>' +
      '<figure class="cantiere-cornice">' + CANTIERE + '</figure></div>';
  };

  SL.viste.guida = (main) => {
    let capitoli = 0, unita = 0, prove = 0;
    SL.corso.forEach((m) => m.capitoli.forEach((c) => { if (!c.diretta) capitoli++; unita += c.unita && c.unita.length ? c.unita.length : 1; if (c.prova) prove++; }));
    const termini = Object.keys(SL.glossario).length;
    const voce = (sim, titolo, testo) => '<section class="pannello colonna" style="gap:10px"><div style="display:flex;align-items:center;gap:14px">' + SL.sim(sim, 52) + '<h2 class="titolo3" style="font-size:20px">' + E(titolo) + '</h2></div>' + testo.map((t) => '<p style="color:var(--testo2)">' + (t.html || E(t)) + '</p>').join('') + '</section>';
    const fasi = [['richiami', 'Richiami', 'Prerequisiti tratti dalle unità precedenti, di norma tre, e una domanda di verifica.'], ['idea', 'Esposizione', 'Trattazione dell’argomento, con una figura e i termini introdotti.'], ['esperimento', 'Esperimento', 'Descrizione della prova che segue e degli elementi presenti sulla scena.'], ['riproduci', 'Esecuzione guidata', 'Previsione dell’esito, esecuzione per passi, confronto fra previsione e risultato.'], ['bilancio', 'Bilancio', 'Regola conclusiva, errori frequenti, esercizi con diagnosi, indizi e svolgimento.']];
    main.innerHTML = '<div class="pagina">' +
      '<header class="colonna" style="gap:10px"><div class="occhiello">SistemiLab · guida</div><h1 class="titolone">Guida <span style="color:var(--ambra)">all’uso</span></h1>' +
      '<p class="guida">SistemiLab è il laboratorio interattivo che accompagna il corso di architettura dei sistemi. Il materiale è ordinato in ' + unita + ' unità, ciascuna dedicata a un solo argomento e costruita attorno a un esperimento eseguibile un passo alla volta. Questa pagina descrive l’organizzazione del sito e le modalità di consultazione.</p></header>' +
      percorso(false) +
      '<section class="colonna" style="gap:14px"><div class="occhiello c">Consistenza del materiale</div><div class="carte" style="grid-template-columns:repeat(auto-fit,minmax(min(190px,100%),1fr))">' +
      [['strati', SL.corso.length, 'moduli'], ['folder', capitoli, 'capitoli'], ['esperimento', unita, 'unità con esperimento'], ['bilancio', prove, 'prove di fine capitolo'], ['lente', termini, 'termini di glossario']].map((x) => '<div class="carta" style="cursor:default">' + SL.sim(x[0], 44) + '<span><span class="v" style="font:600 26px var(--tit);color:var(--chiaro)">' + x[1] + '</span><span class="w" style="font-size:14px;color:var(--testo2)">' + x[2] + '</span></span></div>').join('') + '</div></section>' +
      '<section class="colonna" style="gap:14px"><div class="occhiello c">Le cinque fasi di un’unità</div><p class="guida" style="font-size:16px">Ogni unità segue il medesimo schema. Le fasi sono numerate e si percorrono nell’ordine; ciascuna è comunque raggiungibile direttamente dalla barra posta sotto il titolo.</p><div class="carte" style="grid-template-columns:repeat(auto-fit,minmax(min(210px,100%),1fr))">' +
      fasi.map((f, k) => '<div class="carta" style="cursor:default;align-items:flex-start;padding:14px 16px">' + SL.sim(f[0], 44) + '<span><span class="k">0' + (k + 1) + '</span><span class="v" style="font-size:17px;color:var(--chiaro);font-weight:600">' + E(f[1]) + '</span><span class="w" style="font-size:14px;color:var(--testo2)">' + E(f[2]) + '</span></span></div>').join('') + '</div></section>' +
      '<div class="griglia" style="grid-template-columns:repeat(auto-fit,minmax(min(420px,100%),1fr))">' +
      voce('strati', 'Organizzazione del corso', ['Il corso comprende un modulo introduttivo e sei moduli tematici: rappresentazione dei dati, linguaggio macchina x86-64, progetto del processore, ingresso e uscita, processi e concorrenza, memoria e file system. Ogni modulo è suddiviso in capitoli, e ogni capitolo in unità.', 'La rete del corso, che costituisce la pagina principale, dispone i moduli su una linea e mostra i capitoli del modulo selezionato. L’ordine consigliato procede da sinistra a destra; l’accesso a ogni nodo resta comunque libero.']) +
      voce('esperimento', 'Il laboratorio', ['Prima dell’esecuzione è richiesta una previsione sull’esito. L’esperimento procede quindi per passi, ciascuno accompagnato da una descrizione e, dove pertinente, dal calcolo svolto; al termine la previsione è confrontata con il risultato.', 'I controlli collocati sopra la scena modificano i dati dell’esperimento, e la sequenza dei passi è ricostruita di conseguenza. Nel modo «Osserva» i passi scorrono liberamente. Nel modo «Guidato» alcuni passi richiedono una risposta prima di proseguire.']) +
      voce('bilancio', 'Esercizi e prove di fine capitolo', ['Ogni unità si conclude con esercizi a risposta numerica oppure a scelta. Una risposta errata riceve una diagnosi riferita all’errore commesso; sono inoltre disponibili tre indizi progressivi e lo svolgimento completo.', 'Ogni capitolo dispone di una prova, con almeno una domanda per ciascuna unità. Le prove sono generate in 999 varianti numerate, e il numero della variante compare nell’indirizzo della pagina: la medesima variante ripropone sempre le medesime domande, e può essere assegnata a un’intera classe.']) +
      voce('folder', 'Dispensa e approfondimenti', [{ html: 'Il sito segue la <a href="#/dispensa">dispensa di riferimento</a> nell’edizione rivista, e ne adotta la terminologia, la notazione e il processore del caso di studio. La dispensa è in costruzione, e la voce «Dispensa» della testata ne riporta lo stato. I termini del glossario riportano, dove utile, la denominazione inglese.' }, { html: 'Le ' + SL.unitaInOrdine.filter((u) => u.oltre).length + ' unità contrassegnate come approfondimento trattano argomenti che vanno oltre la <a href="#/dispensa">dispensa</a>, e la loro consultazione è facoltativa. Le domande delle prove che vi si riferiscono riportano la medesima indicazione.' }]) +
      voce('lente', 'Glossario e termini', ['I termini tecnici sono evidenziati nel testo dell’unità che li introduce. La selezione di un termine ne mostra la definizione e l’unità di provenienza. L’elenco completo è raggiungibile dalla voce «Glossario» della testata.']) +
      voce('terminale', 'Sfide in terminale', ['A ogni capitolo sono associate sfide da svolgere in un terminale. Il sito ne riporta soltanto l’identificativo e il titolo; la piattaforma sulla quale si svolgono è indicata a lezione.']) +
      voce('scudo', 'Dati e riservatezza', ['Il sito è composto da pagine statiche, prive di risorse esterne. Nessun dato è registrato nel browser né trasmesso ad altri servizi: previsioni, risposte ed esiti delle prove esistono soltanto nella pagina aperta, e vanno perduti alla sua chiusura.', 'Ogni visita riparte pertanto dalle condizioni iniziali. Il sito non tiene traccia delle unità già consultate e non impone alcun percorso.']) +
      '<section class="pannello colonna" style="gap:10px"><div style="display:flex;align-items:center;gap:14px">' + SL.sim('file', 52) + '<h2 class="titolo3" style="font-size:20px">Licenza</h2></div><p style="color:var(--testo2)">Salvo diversa indicazione, i contenuti e il codice di SistemiLab, compresi il testo e le figure della <a href="#/dispensa">dispensa</a>, sono distribuiti con licenza <a rel="license noopener noreferrer" target="_blank" href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.it">Creative Commons Attribuzione - Non commerciale - Condividi allo stesso modo 4.0 Internazionale (CC BY-NC-SA 4.0)</a>. Sono consentite la riproduzione e la modifica per scopi non commerciali, a condizione di citare gli autori e di distribuire le opere derivate con la medesima licenza.</p><p style="color:var(--testo2)">Gli esempi di codice della <a href="#/dispensa">dispensa</a> sono distribuiti con licenza MIT. I caratteri tipografici sono distribuiti con licenza SIL Open Font License 1.1.</p></section>' +
      '</div>' +
      '<div class="passi-fase"><a class="bottone" href="#/glossario">Glossario</a><a class="bottone primo" href="#/">Rete del corso</a></div></div>';
    window.scrollTo(0, 0);
    return null;
  };
})();
