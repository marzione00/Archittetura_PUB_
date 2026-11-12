'use strict';
SL.registra('1.4.2', {
  titolo: 'Somma, sottrazione e overflow',
  obiettivo: 'Alla fine saprai sommare due byte colonna per colonna e dire se il risultato rimasto nel byte è quello giusto, per chi lo legge senza segno e per chi lo legge con segno.',
  concetti: [['operation', 'Somma'], ['pila', 'Riporto'], ['conflitto', 'Overflow']],
  filigrana: ['operation', 'pila', 'segno'],
  richiami: {
    carte: [
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Due letture dello stesso byte', d: 'Senza segno un byte va da 0 a 255. Con segno va da −128 a 127, e il bit di sinistra pesa −128.' },
      { sim: 'pila', da: 'Dall’unità 0.3', t: 'Il riporto', d: 'Una colonna che supera la cifra più alta torna indietro e passa un’unità alla colonna di sinistra.' },
      { sim: 'bit', da: 'Dall’unità 1.2.2', t: 'La scrittura binaria', d: 'In base due ogni colonna ha due sole cifre, 0 e 1, e pesa il doppio di quella alla sua destra.' }
    ],
    domanda: { d: 'Prima di proseguire: il byte 10000000 è un intero con segno. Quanto vale?', o: [
      { t: '128', fb: 'Quella è la lettura senza segno. Con segno il bit di sinistra pesa −128.' },
      { t: '−128', ok: true, fb: 'È acceso soltanto il bit di peso −128.' },
      { t: '−0', fb: 'In complemento a due lo zero ha una sola scrittura, 00000000. Il byte 10000000 vale −128.' }
    ] }
  },
  idea: {
    titolo: 'Otto colonne, e nessuna in più',
    termini: ['riporto uscente', 'overflow'],
    testo: [
      'Il processore somma due byte come si fa sulla carta: una colonna alla volta, da destra, portando il riporto alla colonna successiva. In base due le regole di una colonna sono poche. Zero più zero fa 0. Zero più uno fa 1. Uno più uno fa due, che si scrive 10: si scrive 0 e si riporta 1. Uno più uno più un riporto fa tre, che si scrive 11: si scrive 1 e si riporta 1.',
      { fig: 'celle', titolo: 'Le quattro situazioni di una colonna', nota: 'Il bit scritto resta nella colonna. Il riporto passa alla colonna di sinistra.', celle: [
        { so: '0 + 0', v: '0', gi: 'riporto 0' }, { so: '0 + 1', v: '1', st: 'on', gi: 'riporto 0' }, { so: '1 + 1', v: '0', st: 'amb', gi: 'riporto 1' }, { so: '1 + 1 + 1', v: '1', st: 'amb', gi: 'riporto 1' }] },
      'Il risultato deve stare negli stessi otto bit degli addendi. Se l’ultima colonna a sinistra produce un riporto, manca una nona cella in cui scriverlo. Quel bit esce dalla parola e si chiama [[riporto uscente]]. Nel byte restano gli otto bit bassi, come in un contachilometri a tre rotelle che dopo 999 mostra 000.',
      'Qui sta la parte più elegante del complemento a due. Il circuito che somma è uno solo, e non ha bisogno di sapere se i byte sono con segno o senza. I bit che produce vanno bene per entrambe le letture. Cambia soltanto la domanda da farsi dopo, cioè se il risultato vero entrava nel byte.',
      'Per chi legge senza segno, il risultato è sbagliato quando c’è un riporto uscente. Significa che la somma vera superava 255.',
      'Per chi legge con segno, il risultato è sbagliato quando la somma vera esce dall’intervallo da −128 a 127. Questa situazione si chiama [[overflow]], e si riconosce dai segni: due addendi dello stesso segno danno un risultato di segno opposto. Il caso classico è 127 + 1. In binario 01111111 più 00000001 fa 10000000, che con segno vale −128.',
      'I due segnali sono indipendenti. Può esserci il riporto senza overflow, l’overflow senza riporto, entrambi o nessuno. Per sapere se un risultato è buono bisogna quindi decidere prima con quale lettura lo si userà.',
      'La sottrazione non richiede un circuito a parte. Per calcolare a − b il processore scrive −b con la ricetta dell’unità 1.4.1, cioè inverte i bit di b e aggiunge uno, e poi somma.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai due byte e li sommeremo colonna per colonna, da destra. A ogni colonna vedrai il bit scritto e il riporto che passa a sinistra.',
      'Finite le otto colonne leggeremo il risultato due volte, senza segno e con segno, e per ciascuna lettura diremo se il byte contiene la somma vera.'
    ],
    vedrai: [
      ['bit', 'Le tre righe', 'I due addendi e, sotto la linea, la somma. Sopra corre la riga dei riporti.'],
      ['conflitto', 'I due segnali', 'A destra: il riporto uscente e l’overflow, accesi quando scattano.'],
      ['bilancio', 'Le due letture', 'In basso: la somma vera e quella rimasta nel byte, per ciascuna lettura.']
    ]
  },
  lab: {
    titolo: 'Sommare due byte, colonna per colonna',
    scena: { w: 860, h: 366 },
    atti: ['I due addendi', 'Le otto colonne', 'Il riporto uscente', 'Le due letture'],
    nota: 'Le colonne sono sempre otto. Cambiando gli addendi cambiano i riporti e i segnali che si accendono.',
    controlli: [
      { id: 'a', tipo: 'scelta', eti: 'Primo addendo', opzioni: [[0x23, '0x23'], [0x7F, '0x7F'], [0xF4, '0xF4'], [0x80, '0x80'], [0xFF, '0xFF']], valore: 0xF4 },
      { id: 'b', tipo: 'scelta', eti: 'Secondo addendo', opzioni: [[0x01, '0x01'], [0x12, '0x12'], [0x18, '0x18'], [0x80, '0x80']], valore: 0x18 }
    ],
    previsione: {
      domanda: (p) => { const S = (v) => String(v >= 128 ? v - 256 : v).replace('-', '−'); return 'Sommiamo ' + p.a.toString(2).padStart(8, '0') + ' e ' + p.b.toString(2).padStart(8, '0') + '. Senza segno sono ' + p.a + ' e ' + p.b + ', con segno ' + S(p.a) + ' e ' + S(p.b) + '. Quali segnali si accenderanno?'; },
      opzioni: () => [['nessuno', 'Nessuno dei due'], ['riporto', 'Soltanto il riporto uscente'], ['overflow', 'Soltanto l’overflow'], ['entrambi', 'Entrambi']]
    },
    confronto: (pred, esito) => { const N = { nessuno: 'nessun segnale', riporto: 'soltanto il riporto uscente', overflow: 'soltanto l’overflow', entrambi: 'entrambi i segnali' }, V = { nessuno: 'Nessun segnale si è acceso', riporto: 'Si è acceso soltanto il riporto uscente', overflow: 'Si è acceso soltanto l’overflow', entrambi: 'Si sono accesi entrambi i segnali' }; return 'Avevi previsto ' + N[pred] + '. ' + V[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Il riporto uscente dipende dalla somma senza segno, che deve superare 255. L’overflow dipende dalla somma con segno, che deve uscire dall’intervallo da −128 a 127.'); },
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
      const hud = (j) => [['Colonna di peso', j == null ? '·' : Math.pow(2, 7 - j), 'a'], ['Riporto in arrivo', j == null ? '·' : rip[j]], ['Somma finora', somma.map((x) => (x === null ? '·' : x)).join(''), 'c']];
      const P = (o, atto, titolo, testo, extra, j) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(j), els: quadro(o) }, extra));
      const domandaColonna = (j) => { const t = A[j] + Bb[j] + rip[j]; return { d: 'Nella colonna di peso ' + Math.pow(2, 7 - j) + ' si sommano ' + A[j] + ', ' + Bb[j] + ' e il riporto ' + rip[j] + '. Che cosa si scrive?', o: ['0, senza riporto', '1, senza riporto', '0, con riporto 1', '1, con riporto 1'], g: t, no: 'La somma della colonna è ' + t + ', che in binario si scrive ' + ['00', '01', '10', '11'][t] + ': la cifra di destra resta nella colonna, quella di sinistra è il riporto.' }; };

      P({}, 0, 'I due addendi', 'Il primo addendo è ' + H(p.a) + ', il secondo è ' + H(p.b) + '. Li sommiamo colonna per colonna partendo da destra, dove il riporto in arrivo è 0. Il circuito ignora quale lettura abbiamo in mente.', { chiedi: domandaColonna(7) });
      for (let j = 7; j >= 0; j--) {
        const t = A[j] + Bb[j] + rip[j]; somma[j] = t % 2; rip[j === 0 ? 8 : j - 1] = t >= 2 ? 1 : 0;
        const extra = { calc: A[j] + ' + ' + Bb[j] + ' + ' + rip[j] + ' = ' + t + ' → scrivo ' + somma[j] + ', riporto ' + (t >= 2 ? 1 : 0) };
        if (j === 4) extra.chiedi = domandaColonna(3);
        P({ col: j }, 1, 'La colonna di peso ' + Math.pow(2, 7 - j), 'Sommiamo ' + A[j] + ', ' + Bb[j] + ' e il riporto in arrivo ' + rip[j] + '. Il totale è ' + t + (t >= 2 ? ', che in binario si scrive ' + (t === 2 ? '10' : '11') + ': nella colonna resta ' + somma[j] + ' e un riporto ' + (j === 0 ? 'esce a sinistra.' : 'passa alla colonna di peso ' + Math.pow(2, 8 - j) + '.') : ', che entra in un bit. Nessun riporto.'), extra, j);
      }
      fRip = cout;
      P({ box: 1 }, 2, cout ? 'Un riporto esce dalla parola' : 'Nessun riporto in uscita', cout
        ? 'L’ultima colonna ha prodotto un riporto, e manca una nona cella in cui scriverlo. Il bit esce dalla parola. Nel byte restano gli otto bit bassi, ' + somma.join('') + '.'
        : 'L’ultima colonna non ha prodotto riporti. La somma sta per intero negli otto bit: ' + somma.join('') + '.',
        { calc: 'somma = ' + somma.join('') + ' = ' + H(r), chiedi: { d: 'Senza segno gli addendi valgono ' + p.a + ' e ' + p.b + ', e la loro somma vera è ' + vera + '. Entra in un byte?', o: ['Sì', 'No'], g: cout ? 1 : 0, no: 'Un byte senza segno arriva fino a 255. La somma vera è ' + vera + '.' } });
      lU = p.a + ' + ' + p.b + ' = ' + vera + (cout ? ' → ' + r : '');
      P({ box: 3 }, 3, 'La lettura senza segno', cout
        ? 'La somma vera è ' + vera + ', oltre il massimo di 255. Nel byte resta ' + vera + ' − 256, cioè ' + r + '. Per chi legge senza segno il risultato è sbagliato, e il riporto uscente lo segnala.'
        : 'La somma vera è ' + vera + ', che non supera 255. Il byte contiene proprio ' + r + ': per chi legge senza segno il risultato è corretto.',
        { calc: lU, chiedi: { d: 'Con segno gli addendi valgono ' + M(S8(p.a)) + ' e ' + M(S8(p.b)) + ', e la loro somma vera è ' + M(veraS) + '. Sta fra −128 e 127?', o: ['Sì', 'No'], g: ovf ? 1 : 0, no: 'L’intervallo con segno va da −128 a 127. La somma vera è ' + M(veraS) + '.' } });
      fOvf = ovf; lS = M(S8(p.a)) + ' + ' + M(S8(p.b)) + ' = ' + M(veraS) + (ovf ? ' → ' + M(S8(r)) : '');
      P({ box: 4 }, 3, 'La lettura con segno', ovf
        ? 'La somma vera è ' + M(veraS) + ', fuori dall’intervallo da −128 a 127. Il byte, letto con segno, dà ' + M(S8(r)) + ': due addendi ' + (S8(p.a) < 0 ? 'negativi' : 'positivi') + ' hanno prodotto un risultato ' + (S8(r) < 0 ? 'negativo' : 'non negativo') + '. È un overflow.'
        : 'La somma vera è ' + M(veraS) + ', dentro l’intervallo da −128 a 127. Il byte, letto con segno, dà proprio ' + M(S8(r)) + ': per questa lettura il risultato è corretto.', { calc: lS.replace(/\+ −/g, '− ') });
      P({}, 3, 'Lo stesso byte, due verdetti', 'Gli otto bit sono gli stessi per entrambe le letture. ' + ({ nessuno: 'Nessun segnale si è acceso: il risultato è buono comunque lo si legga.', riporto: 'Si è acceso soltanto il riporto uscente: il risultato è buono con segno e sbagliato senza segno.', overflow: 'Si è acceso soltanto l’overflow: il risultato è buono senza segno e sbagliato con segno.', entrambi: 'Si sono accesi entrambi i segnali: il risultato è sbagliato per tutte e due le letture.' })[esito], { calc: 'riporto uscente: ' + (cout ? 'sì' : 'no') + ' · overflow: ' + (ovf ? 'sì' : 'no') });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'La somma di due byte si calcola colonna per colonna e conserva otto bit. Un riporto oltre l’ultima colonna esce dalla parola.',
      'Senza segno il risultato è sbagliato quando c’è un riporto uscente. Con segno è sbagliato quando c’è overflow, cioè quando due addendi dello stesso segno danno un risultato di segno opposto.'
    ],
    errori: [
      ['Confondere riporto uscente e overflow.', 'Sono due segnali distinti, legati a due letture diverse. Uno può accendersi senza l’altro.'],
      ['Cercare l’overflow fra addendi di segno diverso.', 'Un positivo più un negativo resta sempre dentro l’intervallo. L’overflow richiede addendi dello stesso segno.'],
      ['Pensare che il circuito conosca il segno.', 'I bit prodotti sono gli stessi. A decidere se sono giusti è la lettura scelta da chi li usa.']
    ],
    saFare: ['Sommo due byte in binario portando i riporti.', 'Riconosco un riporto uscente e ne spiego il significato.', 'Riconosco un overflow dai segni degli addendi e del risultato.'],
    esercizi: [
      { d: 'Su otto bit si calcola `0x7F + 0x01`. Quanto vale il byte ottenuto, letto con segno?', segnaposto: 'Un numero', giuste: ['-128', '−128'],
        ok: 'La somma è 10000000. Con segno vale −128: è il caso classico di overflow.',
        diagnosi: [
          { se: ['128'], msg: 'Quella è la lettura senza segno, ed è corretta. Con segno il bit di sinistra pesa −128.' },
          { se: ['127'], msg: 'Il primo addendo vale 127. Aggiungendo uno tutti i bit cambiano.' },
          { se: ['0'], msg: 'Zero sarebbe il risultato di 0xFF + 0x01. Qui il primo addendo è 01111111.' }
        ],
        altro: 'Il valore è diverso. Somma 01111111 e 00000001 colonna per colonna, poi leggi il risultato con il peso −128.',
        indizi: ['Nella prima colonna a destra 1 + 1 fa 0 con riporto 1.', 'Il riporto risale sette colonne e si ferma nell’ottava.', 'Il risultato è 10000000.'],
        svolgimento: ['01111111 + 00000001: il riporto attraversa le sette colonne di destra.', 'Il risultato è 10000000, senza riporto uscente.', 'Con segno vale −128. La somma vera, 128, era fuori dall’intervallo.'] },
      { d: 'Su otto bit si calcola `0xF4 + 0x18`. Senza segno sono 244 e 24, con segno −12 e 24. Quali segnali si accendono?', guida: 'Scegli la risposta.', o: [
        { t: 'Riporto uscente sì, overflow no', ok: true, fb: 'Senza segno 268 supera 255. Con segno −12 + 24 = 12 sta nell’intervallo.' },
        { t: 'Riporto uscente no, overflow sì', fb: 'La somma senza segno è 268, oltre 255: il riporto esce. Gli addendi con segno hanno segni diversi, quindi l’overflow è escluso.' },
        { t: 'Entrambi', fb: 'Gli addendi con segno sono uno negativo e uno positivo. La loro somma resta sempre nell’intervallo.' }] }
    ],
    sfida: ['lez04_04_fixed_width_add_sub', 'Somma e sottrazione a larghezza fissa']
  }
});
