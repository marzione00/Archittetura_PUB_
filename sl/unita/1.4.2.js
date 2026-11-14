'use strict';
SL.registra('1.4.2', {
  titolo: 'Somma, sottrazione e overflow',
  obiettivo: 'Obiettivo: sommare due byte colonna per colonna e stabilire se il risultato contenuto nel byte sia corretto, nella lettura senza segno e nella lettura con segno.',
  concetti: [['operation', 'Somma'], ['pila', 'Riporto'], ['conflitto', 'Overflow']],
  filigrana: ['operation', 'pila', 'segno'],
  richiami: {
    carte: [
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Due letture dello stesso byte', d: 'Senza segno un byte va da 0 a 255. Con segno va da −128 a 127, e il bit di sinistra ha peso −128.' },
      { sim: 'pila', da: 'Dall’unità 0.3', t: 'Il riporto', d: 'Una colonna che supera la cifra più alta ritorna a zero e trasferisce un’unità alla colonna di sinistra.' },
      { sim: 'bit', da: 'Dall’unità 1.2.2', t: 'La scrittura binaria', d: 'In base due ogni colonna ha due sole cifre, 0 e 1, e ha peso doppio rispetto a quella alla sua destra.' }
    ],
    domanda: { d: 'Prima di proseguire: il byte 10000000 è un intero con segno. Quanto vale?', o: [
      { t: '128', fb: 'Il valore indicato è la lettura senza segno. Con segno il bit di sinistra ha peso −128.' },
      { t: '−128', ok: true, fb: 'Vale 1 soltanto il bit di peso −128.' },
      { t: '−0', fb: 'In complemento a due lo zero ha una sola scrittura, 00000000. Il byte 10000000 vale −128.' }
    ] }
  },
  idea: {
    titolo: 'Otto colonne e nessuna ulteriore',
    termini: ['riporto uscente', 'overflow'],
    testo: [
      'Il processore somma due byte secondo il procedimento dell’addizione in colonna: una colonna alla volta, da destra, trasferendo il riporto alla colonna successiva. In base due le regole di una colonna sono quattro: zero più zero dà 0; zero più uno dà 1; uno più uno dà due, che si scrive 10, sicché si scrive 0 e si riporta 1; uno più uno più un riporto dà tre, che si scrive 11, sicché si scrive 1 e si riporta 1.',
      { fig: 'celle', titolo: 'Le quattro situazioni di una colonna', nota: 'Il bit scritto resta nella colonna. Il riporto passa alla colonna di sinistra.', celle: [
        { so: '0 + 0', v: '0', gi: 'riporto 0' }, { so: '0 + 1', v: '1', st: 'on', gi: 'riporto 0' }, { so: '1 + 1', v: '0', st: 'amb', gi: 'riporto 1' }, { so: '1 + 1 + 1', v: '1', st: 'amb', gi: 'riporto 1' }] },
      'Il risultato deve essere contenuto nei medesimi otto bit degli addendi. Se l’ultima colonna a sinistra produce un riporto, manca una nona cella in cui scriverlo. Tale bit esce dalla parola e prende il nome di [[riporto uscente]]. Nel byte restano gli otto bit bassi, come in un contatore decimale a tre ruote che dopo 999 indica 000.',
      'In ciò risiede la proprietà più rilevante del complemento a due. Il circuito che esegue la somma è unico, e opera indipendentemente dal fatto che i byte siano con segno o senza segno. I bit prodotti sono validi per entrambe le letture. Varia soltanto la verifica successiva, che accerta se il risultato esatto fosse rappresentabile nel byte.',
      'Nella lettura senza segno il risultato è errato in presenza di un riporto uscente, il quale indica che la somma esatta superava 255.',
      'Nella lettura con segno il risultato è errato quando la somma esatta è esterna all’intervallo da −128 a 127. Tale situazione prende il nome di [[overflow]], e si riconosce dai segni: due addendi dello stesso segno forniscono un risultato di segno opposto. Il caso tipico è 127 + 1. In binario 01111111 più 00000001 dà 10000000, che con segno vale −128.',
      'I due segnali sono indipendenti: può presentarsi il riporto senza overflow, l’overflow senza riporto, entrambi o nessuno dei due. La correttezza di un risultato può quindi essere stabilita soltanto dopo aver fissato la lettura con la quale esso sarà impiegato.',
      'La sottrazione è eseguita dal medesimo circuito. Per calcolare a − b il processore scrive −b con il procedimento dell’unità 1.4.1, cioè inverte i bit di b e aggiunge uno, ed esegue poi la somma.'
    ]
  },
  esperimento: {
    faremo: [
      'Due byte sono sommati colonna per colonna, da destra. Per ogni colonna sono mostrati il bit scritto e il riporto che passa a sinistra.',
      'Terminate le otto colonne il risultato è letto due volte, senza segno e con segno, e per ciascuna lettura si stabilisce se il byte contenga la somma esatta.'
    ],
    vedrai: [
      ['bit', 'Le tre righe', 'I due addendi e, sotto la linea, la somma. Sopra è disposta la riga dei riporti.'],
      ['conflitto', 'I due segnali', 'A destra: il riporto uscente e l’overflow, accesi quando si verificano.'],
      ['bilancio', 'Le due letture', 'In basso: la somma esatta e quella contenuta nel byte, per ciascuna lettura.']
    ]
  },
  lab: {
    titolo: 'Addizione di due byte colonna per colonna',
    scena: { w: 860, h: 366 },
    atti: ['I due addendi', 'Le otto colonne', 'Il riporto uscente', 'Le due letture'],
    nota: 'Le colonne sono sempre otto. Cambiando gli addendi cambiano i riporti e i segnali che si accendono.',
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Primo addendo', opzioni: [[0x23, '0x23'], [0x7F, '0x7F'], [0xF4, '0xF4'], [0x80, '0x80'], [0xFF, '0xFF']], valore: 0xF4 },
      { id: 'b', tipo: 'scelta', eti: 'Secondo addendo', opzioni: [[0x01, '0x01'], [0x12, '0x12'], [0x18, '0x18'], [0x80, '0x80']], valore: 0x18 }
    ],
    previsione: {
      domanda: (p) => { const S = (v) => String(v >= 128 ? v - 256 : v).replace('-', '−'); return 'Si sommano ' + p.a.toString(2).padStart(8, '0') + ' e ' + p.b.toString(2).padStart(8, '0') + '. Senza segno sono ' + p.a + ' e ' + p.b + ', con segno ' + S(p.a) + ' e ' + S(p.b) + '. Quali segnali si accenderanno?'; },
      opzioni: () => [['nessuno', 'Nessuno dei due'], ['riporto', 'Soltanto il riporto uscente'], ['overflow', 'Soltanto l’overflow'], ['entrambi', 'Entrambi']]
    },
    confronto: (pred, esito) => { const N = { nessuno: 'nessun segnale', riporto: 'soltanto il riporto uscente', overflow: 'soltanto l’overflow', entrambi: 'entrambi i segnali' }, V = { nessuno: 'Nessun segnale si è acceso', riporto: 'Si è acceso soltanto il riporto uscente', overflow: 'Si è acceso soltanto l’overflow', entrambi: 'Si sono accesi entrambi i segnali' }; return 'La previsione indicava ' + N[pred] + '. ' + V[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il riporto uscente dipende dalla somma senza segno, che deve superare 255. L’overflow dipende dalla somma con segno, che deve uscire dall’intervallo da −128 a 127.'); },
    costruisci(p) {
      const el = SL.el, passi = [];
      const M = (v) => String(v).replace('-', '−');
      const B8 = (v) => v.toString(2).padStart(8, '0').split('').map(Number);
      const S8 = (v) => (v >= 128 ? v - 256 : v);
      const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
      const A = B8(p.a), Bb = B8(p.b), vera = p.a + p.b, r = vera % 256, cout = vera > 255 ? 1 : 0;
      const veraS = S8(p.a) + S8(p.b), ovf = veraS < -128 || veraS > 127;
      const esito = cout && ovf ? 'entrambi' : cout ? 'riporto' : ovf ? 'overflow' : 'nessuno';
      const somma = Array(8).fill(null), rip = Array(9).fill(null);   // rip[j]: riporto che entra nella colonna j; rip[8] è l'uscente
      rip[7] = 0;
      let fRip = null, fOvf = null, lU = null, lS = null;
      const X = (j) => 172 + j * 64;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('n0', 40, 34, 'riporti', 'mono'), el.nota('n1', 40, 86, 'A = ' + H(p.a), 'mono'), el.nota('n2', 40, 142, 'B = ' + H(p.b), 'mono'), el.nota('n3', 40, 214, 'somma', 'mono', 'att'),
          el.linea('li', 172, 188, 674, 188, 'att')];
        for (let j = 0; j < 8; j++) {
          els.push(el.cella('c' + j, X(j) + 12, 28, 30, 28, rip[j] === null ? '' : String(rip[j]), rip[j] ? (o.col === j ? 'att' : 'on') : 'zero', { cls: 'minuta' }));
          els.push(el.cella('a' + j, X(j), 70, 54, 48, String(A[j]), o.col === j ? 'att' : A[j] ? 'on' : 'zero', { piccola: true }));
          els.push(el.cella('b' + j, X(j), 126, 54, 48, String(Bb[j]), o.col === j ? 'att' : Bb[j] ? 'on' : 'zero', { piccola: true }));
          els.push(el.cella('s' + j, X(j), 198, 54, 52, somma[j] === null ? '·' : String(somma[j]), o.col === j ? 'att' : somma[j] ? 'on' : 'zero', { piccola: true }));
        }
        if (rip[8] !== null) els.push(el.cella('cx', 108, 28, 46, 28, String(rip[8]), rip[8] ? 'err' : 'zero', { cls: 'minuta', so: 'esce' }));
        els.push(el.box('f1', 708, 34, 144, 70, 'riporto uscente', fRip === null ? '·' : fRip ? 'sì' : 'no', fRip ? 'err' : o.box === 1 ? 'att' : '', { cls: 'stretta' }));
        els.push(el.box('f2', 708, 120, 144, 70, 'overflow', fOvf === null ? '·' : fOvf ? 'sì' : 'no', fOvf ? 'err' : o.box === 2 ? 'att' : '', { cls: 'stretta' }));
        els.push(el.box('l1', 40, 276, 380, 76, 'lettura senza segno', lU || '·', o.box === 3 ? (cout ? 'err' : 'on') : '', { sim: 'bilancio', riga: true }));
        els.push(el.box('l2', 450, 276, 380, 76, 'lettura con segno', lS || '·', o.box === 4 ? (ovf ? 'err' : 'on') : '', { sim: 'segno', riga: true }));
        return els;
      };
      const hud = (j) => [['Colonna di peso', j == null ? '·' : Math.pow(2, 7 - j), 'a'], ['Riporto in arrivo', j == null ? '·' : rip[j]], ['Totale parziale', somma.map((x) => (x === null ? '·' : x)).join(''), 'c']];
      const P = (o, atto, titolo, testo, extra, j) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(j), els: quadro(o) }, extra));
      const domandaColonna = (j) => { const t = A[j] + Bb[j] + rip[j]; return { d: 'Nella colonna di peso ' + Math.pow(2, 7 - j) + ' si sommano ' + A[j] + ', ' + Bb[j] + ' e il riporto ' + rip[j] + '. Che cosa si scrive?', o: ['0, senza riporto', '1, senza riporto', '0, con riporto 1', '1, con riporto 1'], g: t, no: 'La somma della colonna è ' + t + ', che in binario si scrive ' + ['00', '01', '10', '11'][t] + ': la cifra di destra resta nella colonna, quella di sinistra è il riporto.' }; };

      P({}, 0, 'I due addendi', 'Il primo addendo è ' + H(p.a) + ', il secondo è ' + H(p.b) + '. La somma procede colonna per colonna a partire da destra, dove il riporto in arrivo è 0. Il circuito opera indipendentemente dalla lettura prevista.', { chiedi: domandaColonna(7) });
      for (let j = 7; j >= 0; j--) {
        const t = A[j] + Bb[j] + rip[j]; somma[j] = t % 2; rip[j === 0 ? 8 : j - 1] = t >= 2 ? 1 : 0;
        const extra = { calc: A[j] + ' + ' + Bb[j] + ' + ' + rip[j] + ' = ' + t + ' → si scrive ' + somma[j] + ', riporto ' + (t >= 2 ? 1 : 0) };
        if (j === 4) extra.chiedi = domandaColonna(3);
        P({ col: j }, 1, 'La colonna di peso ' + Math.pow(2, 7 - j), 'Si sommano ' + A[j] + ', ' + Bb[j] + ' e il riporto in arrivo ' + rip[j] + '. Il totale è ' + t + (t >= 2 ? ', che in binario si scrive ' + (t === 2 ? '10' : '11') + ': nella colonna resta ' + somma[j] + ' e un riporto ' + (j === 0 ? 'esce a sinistra.' : 'passa alla colonna di peso ' + Math.pow(2, 8 - j) + '.') : ', valore rappresentabile con un bit. Nessun riporto.'), extra, j);
      }
      fRip = cout;
      P({ box: 1 }, 2, cout ? 'Un riporto esce dalla parola' : 'Nessun riporto in uscita', cout
        ? 'L’ultima colonna ha prodotto un riporto, e manca una nona cella in cui scriverlo. Il bit esce dalla parola. Nel byte restano gli otto bit bassi, ' + somma.join('') + '.'
        : 'L’ultima colonna è priva di riporto. La somma è contenuta per intero negli otto bit: ' + somma.join('') + '.',
        { calc: 'somma = ' + somma.join('') + ' = ' + H(r), chiedi: { d: 'Senza segno gli addendi valgono ' + p.a + ' e ' + p.b + ', e la loro somma esatta è ' + vera + '. È rappresentabile in un byte?', o: ['Sì', 'No'], g: cout ? 1 : 0, no: 'Un byte senza segno giunge fino a 255. La somma esatta è ' + vera + '.' } });
      lU = p.a + ' + ' + p.b + ' = ' + vera + (cout ? ' → ' + r : '');
      P({ box: 3 }, 3, 'La lettura senza segno', cout
        ? 'La somma esatta è ' + vera + ', oltre il massimo di 255. Nel byte resta ' + vera + ' − 256, cioè ' + r + '. Nella lettura senza segno il risultato è errato, e il riporto uscente lo segnala.'
        : 'La somma esatta è ' + vera + ', valore entro il massimo di 255. Il byte contiene esattamente ' + r + ': nella lettura senza segno il risultato è corretto.',
        { calc: lU, chiedi: { d: 'Con segno gli addendi valgono ' + M(S8(p.a)) + ' e ' + M(S8(p.b)) + ', e la loro somma esatta è ' + M(veraS) + '. È compresa fra −128 e 127?', o: ['Sì', 'No'], g: ovf ? 1 : 0, no: 'L’intervallo con segno va da −128 a 127. La somma esatta è ' + M(veraS) + '.' } });
      fOvf = ovf; lS = M(S8(p.a)) + ' + ' + M(S8(p.b)) + ' = ' + M(veraS) + (ovf ? ' → ' + M(S8(r)) : '');
      P({ box: 4 }, 3, 'La lettura con segno', ovf
        ? 'La somma esatta è ' + M(veraS) + ', esterna all’intervallo da −128 a 127. Il byte, letto con segno, fornisce ' + M(S8(r)) + ': due addendi ' + (S8(p.a) < 0 ? 'negativi' : 'positivi') + ' hanno prodotto un risultato ' + (S8(r) < 0 ? 'negativo' : 'non negativo') + ', e si ha pertanto un overflow.'
        : 'La somma esatta è ' + M(veraS) + ', interna all’intervallo da −128 a 127. Il byte, letto con segno, fornisce esattamente ' + M(S8(r)) + ': per questa lettura il risultato è corretto.', { calc: lS.replace(/\+ −/g, '− ') });
      P({}, 3, 'Il medesimo byte, due esiti', 'Gli otto bit sono gli stessi per entrambe le letture. ' + ({ nessuno: 'Nessun segnale si è acceso: il risultato è corretto in entrambe le letture.', riporto: 'Si è acceso soltanto il riporto uscente: il risultato è corretto con segno ed errato senza segno.', overflow: 'Si è acceso soltanto l’overflow: il risultato è corretto senza segno ed errato con segno.', entrambi: 'Si sono accesi entrambi i segnali: il risultato è errato in entrambe le letture.' })[esito], { calc: 'riporto uscente: ' + (cout ? 'sì' : 'no') + ' · overflow: ' + (ovf ? 'sì' : 'no') });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'La somma di due byte si calcola colonna per colonna e conserva otto bit. Un riporto oltre l’ultima colonna esce dalla parola.',
      'Senza segno il risultato è errato in presenza di un riporto uscente. Con segno è errato in presenza di overflow, cioè quando due addendi dello stesso segno forniscono un risultato di segno opposto.'
    ],
    errori: [
      ['Confondere riporto uscente e overflow.', 'Si tratta di due segnali distinti, legati a due letture diverse. Ciascuno può accendersi indipendentemente dall’altro.'],
      ['Cercare l’overflow fra addendi di segno diverso.', 'La somma di un positivo e di un negativo resta sempre entro l’intervallo. L’overflow richiede addendi dello stesso segno.'],
      ['Ritenere che il circuito conosca il segno.', 'I bit prodotti sono i medesimi. La loro correttezza dipende dalla lettura adottata da chi li impiega.']
    ],
    saFare: ['Sommare due byte in binario trasferendo i riporti.', 'Riconoscere un riporto uscente e illustrarne il significato.', 'Riconoscere un overflow dai segni degli addendi e del risultato.'],
    esercizi: [
      { d: 'Su otto bit si calcola `0x7F + 0x01`. Quanto vale il byte ottenuto, letto con segno?', segnaposto: 'Un numero', giuste: ['-128', '−128'],
        ok: 'La somma è 10000000. Con segno vale −128: è il caso tipico di overflow.',
        diagnosi: [
          { se: ['128'], msg: 'Il valore indicato è la lettura senza segno, ed è corretto. Con segno il bit di sinistra ha peso −128.' },
          { se: ['127'], msg: 'Il primo addendo vale 127. Aggiungendo uno tutti i bit cambiano.' },
          { se: ['0'], msg: 'Zero sarebbe il risultato di 0xFF + 0x01. In questo caso il primo addendo è 01111111.' }
        ],
        altro: 'Il valore è diverso. Si sommino 01111111 e 00000001 colonna per colonna, e si legga poi il risultato con il peso −128.',
        indizi: ['Nella prima colonna a destra 1 + 1 dà 0 con riporto 1.', 'Il riporto risale sette colonne e si arresta nell’ottava.', 'Il risultato è 10000000.'],
        svolgimento: ['01111111 + 00000001: il riporto attraversa le sette colonne di destra.', 'Il risultato è 10000000, senza riporto uscente.', 'Con segno vale −128. La somma esatta, 128, era esterna all’intervallo.'] },
      { d: 'Su otto bit si calcola `0xF4 + 0x18`. Senza segno sono 244 e 24, con segno −12 e 24. Quali segnali si accendono?', guida: 'Si scelga la risposta.', o: [
        { t: 'Riporto uscente sì, overflow no', ok: true, fb: 'Senza segno 268 supera 255. Con segno −12 + 24 = 12 rientra nell’intervallo.' },
        { t: 'Riporto uscente no, overflow sì', fb: 'La somma senza segno è 268, oltre 255: il riporto esce. Gli addendi con segno hanno segni diversi, e l’overflow è quindi escluso.' },
        { t: 'Entrambi', fb: 'Gli addendi con segno sono uno negativo e uno positivo. La loro somma resta sempre nell’intervallo.' }] }
    ],
    sfida: ['lez04_04_fixed_width_add_sub', 'Somma e sottrazione a larghezza fissa']
  }
});
