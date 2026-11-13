'use strict';
SL.registra('2.4.3', {
  titolo: 'Impacchettare campi e costruire valori vincolati',
  obiettivo: 'Alla fine saprai riunire due valori in un byte con uno scorrimento, una maschera e un OR, e dire che cosa accade quando un valore è troppo grande per il suo campo.',
  concetti: [['byte', 'Due campi in un byte'], ['scudo', 'La maschera come vincolo'], ['porta', 'Riunire con OR']],
  filigrana: ['byte', 'scudo', 'porta'],
  richiami: {
    carte: [
      { sim: 'operation', da: 'Dall’unità 2.4.1', t: 'SHL', d: 'Sposta i bit verso sinistra e fa entrare zeri da destra. I bit che superano il bordo escono dal registro.' },
      { sim: 'porta', da: 'Dall’unità 2.4.2', t: 'AND e OR con una maschera', d: 'AND lascia passare i bit dove la maschera vale 1 e azzera gli altri. OR accende i bit dove la maschera vale 1.' },
      { sim: 'hex', da: 'Dall’unità 1.2.2', t: 'Cifra esadecimale', d: 'Ogni cifra esadecimale corrisponde a quattro bit, e vale da 0 a 15.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale `0xA0 OR 0x05`?', o: [
      { t: '0xA5', ok: true, fb: 'I due byte hanno bit accesi in metà diverse. OR li riunisce senza che l’uno disturbi l’altro.' },
      { t: '0x00', fb: 'Questo è il risultato di AND: nessuna colonna ha entrambi i bit a 1. OR chiede che ne basti uno.' },
      { t: '0xAF', fb: 'La metà bassa di 0x05 è 0101, e passa tale e quale: la cifra bassa del risultato è 5.' }
    ] }
  },
  idea: {
    titolo: 'Due numeri piccoli in un solo byte',
    termini: ['semibyte', 'impacchettamento'],
    testo: [
      'Un byte ha otto bit, e molte informazioni ne chiedono meno. Due numeri compresi fra 0 e 15 stanno in quattro bit ciascuno e possono dividersi un byte: uno nella metà alta, l’altro nella metà bassa. Ciascuna metà è un [[semibyte]] e corrisponde a una cifra esadecimale. Riunire più valori piccoli in una sola parola si chiama [[impacchettamento]]: è ciò che faceva il byte di autorizzazione dell’unità 1.7.4.',
      'Le mosse sono tre. Lo scorrimento porta il primo valore nella metà alta: `shl al, 4`. La maschera 0x0F pulisce il secondo, azzerando tutto ciò che supera i quattro bit: `and dl, 0x0F`. Infine OR riunisce le due metà. Poiché i due valori occupano posizioni diverse, nessun bit dell’uno disturba l’altro.',
      { fig: 'celle', titolo: 'I valori 10 e 5 riuniti nel byte 0xA5', nota: 'La metà alta contiene 1010, cioè 10, la cifra A. La metà bassa contiene 0101, cioè 5.', celle: [
        { so: 'bit 7', v: '1', st: 'amb' }, { so: 'bit 6', v: '0', st: 'amb' }, { so: 'bit 5', v: '1', st: 'amb' }, { so: 'bit 4', v: '0', st: 'amb' }, { so: 'bit 3', v: '0', st: 'on' }, { so: 'bit 2', v: '1', st: 'on' }, { so: 'bit 1', v: '0', st: 'on' }, { so: 'bit 0', v: '1', st: 'on' }] },
      'La maschera impone un vincolo: qualunque numero arrivi, nel campo entrano quattro bit. Senza la maschera, un valore troppo grande trabocca nel campo vicino e lo altera. Con la maschera il danno resta confinato, ma il valore viene troncato in silenzio: 37 diventa 5. Per questo un programma accurato controlla prima l’intervallo, come nel capitolo 1.7, e tiene la maschera come seconda difesa.',
      'Il percorso inverso usa gli stessi strumenti. Il campo basso si rilegge con `and al, 0x0F`, quello alto con `shr al, 4`.',
      'In un registro di un byte lo scorrimento a sinistra espelle da solo i bit in eccesso del primo valore. In un registro più largo quei bit resterebbero al loro posto, più in alto, e anche il primo valore andrebbe mascherato.'
    ]
  },
  esperimento: {
    faremo: [
      'AL contiene il valore destinato al campo alto e DL quello destinato al campo basso. Sceglierai i due valori, alcuni dei quali superano 15, e se usare la maschera.',
      'Seguiremo le istruzioni una alla volta e rileggeremo il byte ottenuto. Dopo il caso proposto, togli la maschera e scegli per DL un valore maggiore di 15.'
    ],
    vedrai: [
      ['bit', 'Tre file di bit', 'Al centro: AL, DL e il byte finale. Una linea verticale separa il campo alto dal campo basso.'],
      ['operation', 'Le istruzioni', 'A destra: le istruzioni, una per passo.'],
      ['lente', 'La rilettura', 'In basso: i due valori che si rileggono dal byte finale.']
    ]
  },
  lab: {
    titolo: 'Un byte costruito da due valori',
    scena: { w: 860, h: 352 },
    atti: ['Due valori, un byte', 'Il campo alto al suo posto', 'Il campo basso', 'L’unione', 'La rilettura'],
    controlli: [
      { id: 'h', tipo: 'scelta', eti: 'Valore per il campo alto', opzioni: [[9, '9'], [3, '3'], [12, '12'], [26, '26']], valore: 9 },
      { id: 'l', tipo: 'scelta', eti: 'Valore per il campo basso', opzioni: [[5, '5'], [9, '9'], [37, '37'], [248, '248']], valore: 5 },
      { id: 'm', tipo: 'scelta', eti: 'Maschera su DL', opzioni: [['si', 'presente'], ['no', 'assente']], valore: 'si' }
    ],
    nota: 'I valori 26, 37 e 248 superano 15 e chiedono più di quattro bit.',
    previsione: {
      domanda: (p) => 'AL contiene ' + p.h + ' e DL contiene ' + p.l + '. Il programma esegue `shl al, 4`, ' + (p.m === 'si' ? '`and dl, 0x0F`, ' : '') + '`or al, dl`. Quale byte conterrà AL?',
      opzioni: (p) => { const U = SL.unita243; return Array.from(new Set([U.esito(p), U.esito({ h: p.h, l: p.l, m: p.m === 'si' ? 'no' : 'si' }), ((p.l & 15) << 4) | (p.h & 15), (p.h | p.l) & 255, (p.h & 15) << 4])).slice(0, 4).sort((a, b) => a - b).map(U.H); }
    },
    confronto: (pred, esito, p) => { const U = SL.unita243; return 'Avevi previsto ' + pred + '. AL contiene ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Dopo lo scorrimento AL vale ' + U.H((p.h << 4) & 255) + '. ' + (p.m === 'si' ? 'La maschera riduce DL a ' + U.H(p.l & 15) + ', e OR riunisce le due metà.' : 'DL entra nell’OR così com’è, con il valore ' + U.H(p.l) + (p.l > 15 ? ', e i suoi bit alti finiscono nel campo alto.' : '.'))); },
    costruisci(p) {
      const el = SL.el, X = SL.x86, U = SL.unita243, passi = [], M = p.m === 'si';
      const a1 = (p.h << 4) & 255, d1 = M ? p.l & 15 : p.l, r = a1 | d1, guasti = [4, 5, 6, 7].filter((b) => ((d1 >> b) & 1) && !((a1 >> b) & 1));
      const LIS = [['il campo alto al suo posto', 'shl al, 4']].concat(M ? [['la pulizia del campo basso', 'and dl, 0x0F']] : []).concat([['l’unione', 'or al, dl']]);
      const st = { al: p.h, dl: p.l, r: null };
      const quadro = (o) => {
        const els = [el.nota('t1', 110, 0, 'CAMPO ALTO', 'mono'), el.nota('t2', 350, 0, 'CAMPO BASSO', 'mono'), el.linea('div', 347, 24, 347, 264, ''),
          el.nota('n1', 20, 66, 'AL', 'mono'), el.nota('n2', 20, 146, 'DL', 'mono'), el.nota('n3', 20, 226, 'esito', 'mono')];
        X.bit('a', st.al, { x: 110, y: 50, passo: 60, att: o.al || [] }).forEach((e) => els.push(e));
        X.bit('d', st.dl, { x: 110, y: 130, passo: 60, indici: false, att: o.dl || [] }).forEach((e) => { if (o.sporchi && o.sporchi.includes(Number(e.id.slice(1)) >= 0 ? 7 - Number(e.id.slice(1)) : -1)) e.st = 'err'; els.push(e); });
        if (st.r == null) for (let j = 0; j < 8; j++) els.push(el.cella('r' + j, 110 + j * 60, 210, 54, 50, '·', 'off', { piccola: true }));
        else X.bit('r', st.r, { x: 110, y: 210, passo: 60, indici: false, att: o.fine ? [] : [0, 1, 2, 3, 4, 5, 6, 7].filter((b) => !guasti.includes(b)) }).forEach((e) => { if (guasti.includes(7 - Number(e.id.slice(1)))) e.st = 'err'; els.push(e); });
        X.listato('li', LIS, o.riga, { x: 610, y: 36, w: 230, passo: 62 }).forEach((e) => els.push(e));
        els.push(el.box('ril', 20, 284, 570, 58, 'i due valori riletti dal byte', o.fine ? 'campo alto ' + (r >> 4) + ' · campo basso ' + (r & 15) : '·', o.fine ? (guasti.length ? 'err' : 'on') : '', { cls: 'stretta' }),
          el.box('fin', 610, 284, 230, 58, 'AL alla fine', st.r == null ? '·' : U.H(st.r), o.fine ? 'att' : st.r != null ? 'on' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['AL', U.H(st.al), 'a'], ['DL', U.H(st.dl)], ['Byte finale', st.r == null ? '·' : U.H(st.r), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const GRANDE = (v) => v > 15;

      P({}, 0, 'Due valori, un byte', 'AL contiene ' + p.h + ', destinato al campo alto, e DL contiene ' + p.l + ', destinato al campo basso. Ogni campo è largo quattro bit e accoglie numeri da 0 a 15. ' + (GRANDE(p.h) && GRANDE(p.l) ? 'Entrambi i valori superano 15.' : GRANDE(p.h) ? 'Il valore ' + p.h + ' supera 15, e in quattro bit entra soltanto in parte.' : GRANDE(p.l) ? 'Il valore ' + p.l + ' supera 15, e in quattro bit entra soltanto in parte.' : 'Entrambi i valori rientrano nell’intervallo.'),
        { chiedi: { d: 'Di quante posizioni deve scorrere AL perché il suo valore occupi il campo alto?', o: ['2', '4', '8'], g: 1, no: 'Il campo alto comincia dal bit 4. I bit di AL devono salire di quattro posizioni.' } });
      st.al = a1;
      P({ riga: 0, al: [4, 5, 6, 7] }, 1, 'Il campo alto al suo posto', 'SHL fa salire i bit di AL di quattro posizioni, e nel campo basso entrano zeri. AL vale ora ' + U.H(a1) + '. ' + (GRANDE(p.h) ? 'Il valore ' + p.h + ' occupava cinque bit: il più alto è uscito dal registro, e nel campo sono rimasti i quattro bit bassi, che valgono ' + (p.h & 15) + '.' : 'Il valore ' + p.h + ' sta per intero nei quattro bit del campo.'), { calc: X.bin8(p.h) + ' → ' + X.bin8(a1) });
      if (M) {
        st.dl = d1;
        P({ riga: 1, dl: [0, 1, 2, 3] }, 2, 'La pulizia del campo basso', 'La maschera 0x0F, in binario 0000 1111, lascia passare i quattro bit bassi di DL e azzera gli altri. ' + (GRANDE(p.l) ? 'Il valore ' + p.l + ' aveva bit accesi nella metà alta: sono stati cancellati, e DL vale ora ' + d1 + '.' : 'Il valore ' + p.l + ' stava già in quattro bit, e DL resta uguale.'), { calc: X.bin8(p.l) + ' AND 0000 1111 = ' + X.bin8(d1), chiedi: U.domandaOr(p) });
      } else {
        P({ sporchi: GRANDE(p.l) ? [4, 5, 6, 7].filter((b) => (p.l >> b) & 1) : [] }, 2, 'Nessuna pulizia', 'Il programma salta la maschera e usa DL così com’è. ' + (GRANDE(p.l) ? 'Il valore ' + p.l + ' ha bit accesi anche nella metà alta, ' + X.bin8(p.l).slice(0, 4) + ', che cadono nelle colonne del campo alto.' : 'Il valore ' + p.l + ' sta in quattro bit, e la metà alta di DL è già a zero.'), { calc: 'DL = ' + X.bin8(p.l), chiedi: U.domandaOr(p) });
      }
      st.r = r;
      P({ riga: LIS.length - 1 }, 3, guasti.length ? 'Un’unione che altera il campo alto' : 'L’unione', 'OR confronta le due file colonna per colonna e accende il bit quando almeno uno dei due vale 1. ' + (guasti.length ? 'Nel campo alto AL portava ' + X.bin8(a1).slice(0, 4) + ', e il risultato contiene ' + X.bin8(r).slice(0, 4) + ': ' + (guasti.length === 1 ? 'il bit ' + guasti[0] + ' è stato acceso' : 'i bit ' + guasti.slice().reverse().join(', ') + ' sono stati accesi') + ' da DL.' : (d1 & 0xF0) ? 'Anche DL ha bit accesi nel campo alto, ma cadono su colonne in cui AL vale già 1. Il campo alto risulta giusto per coincidenza: con un altro valore sarebbe stato alterato.' : 'Le due file hanno bit accesi in metà diverse, e nessuna colonna riceve contributi da entrambe.') + ' Il byte vale ' + U.H(r) + '.', { calc: X.bin8(a1) + ' OR ' + X.bin8(d1) + ' = ' + X.bin8(r) });
      P({ riga: LIS.length - 1, fine: true }, 4, 'La rilettura', 'Dal byte ' + U.H(r) + ' si rileggono ' + (r >> 4) + ' nel campo alto e ' + (r & 15) + ' nel campo basso. ' + (guasti.length ? 'Il campo alto doveva contenere ' + (p.h & 15) + ': il valore troppo grande destinato all’altro campo lo ha alterato.' : !GRANDE(p.h) && !GRANDE(p.l) ? 'Sono i due valori di partenza: l’impacchettamento ha conservato tutto.' : 'I campi sono integri, ma ' + (GRANDE(p.h) && GRANDE(p.l) ? 'i valori ' + p.h + ' e ' + p.l + ' sono stati troncati' : 'il valore ' + (GRANDE(p.h) ? p.h : p.l) + ' è stato troncato') + ' senza alcun avviso. Un controllo dell’intervallo, prima di impacchettare, lo avrebbe segnalato.'),
        { calc: U.H(r) + ' → ' + (r >> 4) + ' e ' + (r & 15), esito: ['AL = ' + U.H(r), guasti.length ? 'no' : 'si'] });
      return { passi, esito: U.H(r) };
    }
  },
  bilancio: {
    regola: [
      'Per riunire due valori in un byte: lo scorrimento porta il primo nel campo alto, la maschera limita il secondo ai suoi quattro bit, OR li unisce.',
      'La maschera protegge il campo vicino ma tronca il valore. Per sapere se un valore è accettabile serve un controllo dell’intervallo.'
    ],
    errori: [
      ['Riunire con OR un valore senza maschera.', 'Con 9 nel campo alto e 37 nel campo basso si ottiene 0x95 soltanto con la maschera. Senza, il bit 5 di 37 altera il campo alto, e il byte vale 0xB5.'],
      ['Credere che la maschera corregga il valore.', 'La maschera riduce 37 a 5. Il campo vicino è salvo, ma il dato è cambiato senza alcun avviso.'],
      ['Dimenticare lo scorrimento.', 'Senza `shl al, 4` i due valori occupano le stesse colonne, e OR li mescola.']
    ],
    saFare: ['Riunisco due valori di quattro bit in un byte.', 'Prevedo l’effetto di un valore troppo grande, con e senza maschera.', 'Rileggo i due campi con AND e SHR.'],
    esercizi: [
      { d: 'AL contiene 0x07 e DL contiene 0x9C. Quale byte contiene AL dopo `shl al, 4`, `and dl, 0x0F` e `or al, dl`? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x3E', giuste: ['0x7c', '7c', '7ch'],
        ok: 'Lo scorrimento porta 7 nel campo alto: 0x70. La maschera riduce 0x9C a 0x0C. L’unione dà 0x7C.',
        diagnosi: [
          { se: ['0xfc', 'fc'], msg: 'Così DL entra nell’OR senza maschera. La seconda istruzione azzera la sua metà alta: 0x9C diventa 0x0C.' },
          { se: ['0xc7', 'c7'], msg: 'I due campi sono scambiati. Lo scorrimento riguarda AL, che finisce nel campo alto.' },
          { se: ['0x9f', '9f'], msg: 'Manca lo scorrimento di AL, che porta 7 nel campo alto: 0x07 diventa 0x70.' }
        ],
        altro: 'Il byte è diverso. Esegui le tre istruzioni una alla volta, in binario oppure sulle cifre esadecimali.',
        indizi: ['Dopo `shl al, 4`, AL vale 0x70.', 'Dopo `and dl, 0x0F`, DL vale 0x0C.', 'OR riunisce 0x70 e 0x0C.'],
        svolgimento: ['`shl al, 4`: 0000 0111 diventa 0111 0000, cioè 0x70.', '`and dl, 0x0F`: 1001 1100 diventa 0000 1100, cioè 0x0C.', '`or al, dl`: 0111 0000 OR 0000 1100 = 0111 1100.', 'AL = 0x7C.'] },
      { d: 'AL contiene il byte 0xB6, formato da due campi di quattro bit. Quale istruzione lascia in AL il valore del campo alto?', guida: 'Scegli la risposta.', o: [
        { t: 'shr al, 4', ok: true, fb: 'I quattro bit alti scendono nelle posizioni basse e a sinistra entrano zeri: AL vale 0x0B, cioè 11.' },
        { t: 'and al, 0x0F', fb: 'La maschera 0x0F conserva la metà bassa: AL varrebbe 0x06, il campo basso.' },
        { t: 'shl al, 4', fb: 'Lo scorrimento a sinistra espelle proprio il campo alto: AL varrebbe 0x60.' }] }
    ],
    sfida: ['cslez2_4_02_random_assembly_02', 'Modificare bit e combinare semibyte']
  }
});
SL.unita243 = (() => {
  const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
  const esito = (p) => ((p.h << 4) & 255) | (p.m === 'si' ? p.l & 15 : p.l);
  const domandaOr = (p) => { const r = esito(p), o = Array.from(new Set([r, esito({ h: p.h, l: p.l, m: p.m === 'si' ? 'no' : 'si' }), ((p.l & 15) << 4) | (p.h & 15)])).sort((a, b) => a - b); return { d: 'AL contiene ' + H((p.h << 4) & 255) + ' e DL contiene ' + H(p.m === 'si' ? p.l & 15 : p.l) + '. Quale byte produrrà `or al, dl`?', o: o.map(H), g: o.indexOf(r), no: 'OR accende ogni colonna in cui almeno uno dei due bit vale 1: ' + SL.x86.bin8((p.h << 4) & 255) + ' OR ' + SL.x86.bin8(p.m === 'si' ? p.l & 15 : p.l) + ' = ' + SL.x86.bin8(r) + '.' }; };
  return { H, esito, domandaOr };
})();
