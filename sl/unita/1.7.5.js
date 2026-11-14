'use strict';
SL.registra('1.7.5', {
  titolo: 'Risultati numerici e scelta della rappresentazione',
  obiettivo: 'Obiettivo: scegliere fra virgola mobile e intero con scala per una grandezza, e prevedere quando una somma ripetuta in virgola mobile si allontana dal risultato esatto.',
  concetti: [['virgola', 'Virgola mobile'], ['hex', 'Virgola fissa'], ['lente', 'Scarto']],
  filigrana: ['virgola', 'lente', 'bilancio'],
  richiami: {
    carte: [
      { sim: 'virgola', da: 'Dall’unità 1.6.1', t: 'Le frazioni binarie', d: 'Dopo la virgola i pesi sono un mezzo, un quarto, un ottavo. Molte frazioni decimali, scritte in binario, diventano periodiche.' },
      { sim: 'lente', da: 'Dall’unità 1.6.3', t: 'L’arrotondamento', d: 'Dopo ogni operazione in virgola mobile il risultato è riportato sul numero rappresentabile più vicino.' },
      { sim: 'segno', da: 'Dall’unità 1.7.2', t: 'Il fattore di scala', d: 'Un intero che conta decimi rappresenta una grandezza con parte frazionaria: 215 decimi sono 21,5.' }
    ],
    domanda: { d: 'Prima di proseguire: quale di queste frazioni ha una scrittura binaria finita?', o: [
      { t: '1/5', fb: 'Un quinto in binario è periodico: 0,00110011 e così di seguito.' },
      { t: '3/8', ok: true, fb: 'Tre ottavi sono un quarto più un ottavo: in binario 0,011.' },
      { t: '1/10', fb: 'Un decimo in binario è periodico: 0,000110011 e così di seguito.' }
    ] }
  },
  idea: {
    titolo: 'Grandezze contate e grandezze misurate',
    termini: ['virgola fissa'],
    testo: [
      'Nell’unità 1.7.2 il record impiegava due rappresentazioni per due grandezze: un intero con un fattore di scala per la temperatura, la virgola mobile per la tensione. Resta da stabilire il criterio di scelta fra le due. Questa unità lo ricava da un esempio in cui la scelta errata comporta un danno economico.',
      'Un programma deve contabilizzare piccoli importi in euro. La prima soluzione impiega la virgola mobile e scrive 0,10 per dieci centesimi. La difficoltà, esaminata nell’unità 1.6.1, è che un decimo in binario è periodico: 0,000110011 e così di seguito, senza fine. In 32 bit è conservato il numero rappresentabile più vicino, che vale circa 0,1000000015. L’errore è molto piccolo, ed è presente prima di qualunque calcolo.',
      'Ogni addizione produce inoltre un risultato che va arrotondato per rientrare nelle cifre del significando, come nell’unità 1.6.3. Gli errori si sommano, talvolta si compensano, e dopo dieci addizioni di 0,10 il totale vale circa 1,0000001192 in luogo di 1.',
      'La seconda soluzione cambia l’unità di misura e conta i centesimi. Dieci centesimi sono l’intero 10, che in binario si scrive senza alcun errore, e la somma di interi è esatta finché resta entro il tipo. Il valore in euro si ricava al termine, dividendo per cento nel momento in cui deve essere mostrato. Tale tecnica, cioè un intero accompagnato da un fattore di scala stabilito una volta per tutte, prende il nome di [[virgola fissa]].',
      { fig: 'scena', w: 760, h: 96, titolo: 'Dieci addizioni di dieci centesimi', nota: 'A sinistra il calcolo in euro, in virgola mobile a 32 bit. A destra il medesimo calcolo in centesimi interi.', els: [
        SL.el.box('a', 10, 8, 160, 72, 'quota in euro', '0,1000000015', ''), SL.el.linea('l1', 170, 44, 204, 44, 'err'),
        SL.el.box('b', 204, 8, 170, 72, 'dopo dieci somme', '1,0000001192', 'err'),
        SL.el.box('c', 430, 8, 130, 72, 'in centesimi', '10', ''), SL.el.linea('l2', 560, 44, 594, 44, 'on'),
        SL.el.box('d', 594, 8, 156, 72, 'dopo dieci somme', '100', 'on')] },
      'Alcune frazioni sono esatte anche in virgola mobile. Un quarto di euro in binario è 0,01 e mezzo euro è 0,1. Si tratta di scritture finite, conservate esattamente nel significando. In generale una frazione ha scrittura binaria finita soltanto se il suo denominatore, una volta ridotta ai minimi termini, è una potenza di due. Dieci centesimi sono 1/10, e il dieci contiene il fattore 5. Venticinque centesimi sono 1/4.',
      'Ne discende il criterio di scelta. Le grandezze che si contano, come il denaro, le unità a magazzino o i decimi di grado di un termometro digitale, sono rappresentate adeguatamente da un intero con la relativa scala. Le grandezze che si misurano, come una tensione, possono essere molto piccole o molto grandi e sono rappresentate adeguatamente in virgola mobile, purché si tenga conto che ogni risultato è arrotondato.'
    ]
  },
  esperimento: {
    faremo: [
      'La medesima quota è sommata più volte in due modi, a confronto: in virgola mobile a 32 bit, come numero di euro, e in centesimi interi. I controlli fissano la quota e il numero di addizioni.',
      'A ogni addizione i due totali sono confrontati. Va osservato lo scarto, cioè la differenza fra il totale in virgola mobile e quello esatto. Dopo il caso proposto, sono istruttive la quota di 0,25 euro e la quota di 0,10 euro con cinque addizioni.'
    ],
    vedrai: [
      ['coda', 'Le quote', 'In alto: una cella per ogni quota da sommare.'],
      ['virgola', 'I due totali', 'Al centro: a sinistra il totale in virgola mobile, a destra quello in centesimi.'],
      ['lente', 'Lo scarto', 'In basso: la differenza dal totale esatto, e il confronto fra i due totali.']
    ]
  },
  lab: {
    titolo: 'La medesima somma in due rappresentazioni',
    scena: { w: 860, h: 300 },
    atti: ['La quota', 'Le addizioni', 'Il bilancio'],
    nota: 'Il numero di passi dipende dal numero di addizioni scelto.',
    controlli: [
      { id: 'q', tipo: 'scelta', eti: 'Quota', opzioni: [[10, '0,10 €'], [25, '0,25 €'], [5, '0,05 €'], [50, '0,50 €'], [1, '0,01 €']], valore: 10 },
      { id: 'n', tipo: 'num', eti: 'Numero di addizioni', min: 2, max: 12, salti: [1], valore: 10 }
    ],
    previsione: {
      domanda: (p) => 'Si somma ' + p.n + ' volte la quota di ' + (p.q / 100).toFixed(2).replace('.', ',') + ' euro: una volta in virgola mobile a 32 bit, una volta in centesimi interi. Al termine i due totali coincideranno?',
      opzioni: () => [['si', 'Sì, coincidono'], ['no', 'No, sono diversi']]
    },
    confronto: (pred, esito, p) => 'La previsione indicava che i due totali ' + (pred === 'si' ? 'coincidessero' : 'fossero diversi') + '. Al termine ' + (esito === 'si' ? 'coincidono' : 'sono diversi') + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'no' ? 'La quota contiene già in partenza un piccolo errore, e gli arrotondamenti delle addizioni ne aggiungono altri.' : p.q % 25 === 0 ? 'Questa quota ha una scrittura binaria finita, ed è quindi conservata esattamente a ogni somma.' : 'Con questo numero di addizioni gli arrotondamenti si compensano. Un’ulteriore addizione renderebbe nuovamente diversi i due totali.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const q = p.q, n = p.n, qf = Math.fround(q / 100), esatta = q % 25 === 0;
      const FR = { 10: ['1/10', 10], 25: ['1/4', 4], 5: ['1/20', 20], 50: ['1/2', 2], 1: ['1/100', 100] }[q];
      const E2 = (c) => (c / 100).toFixed(2).replace('.', ',');
      const F = (x) => (Math.round(x * 100) / 100 === x ? x.toFixed(2) : x.toFixed(10)).replace('.', ',');
      const D = (d) => (d > 0 ? '+' : '−') + Math.abs(d).toFixed(10).replace('.', ',');
      let k = 0, s = 0, c = 0;
      const uguali = () => (c % 25 === 0) && s === c / 100;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'LA QUOTA DI ' + E2(q) + ' € · DA SOMMARE ' + n + ' VOLTE', 'mono')];
        for (let j = 0; j < n; j++) els.push(el.cella('q' + j, 40 + j * 66, 34, 60, 40, E2(q), j < k ? 'on' : j === o.cur ? 'att' : '', { cls: 'minuta' }));
        const cfr = k > 0 || o.mostra;
        els.push(el.box('bf', 40, 100, 385, 88, 'in virgola mobile, 32 bit', o.f == null ? '·' : o.f, o.foc === 'f' ? 'att' : '', { sim: 'virgola', riga: true }));
        els.push(el.box('bc', 445, 100, 385, 88, 'in centesimi interi', o.c == null ? '·' : o.c, o.foc === 'c' ? 'att' : '', { sim: 'hex', riga: true }));
        els.push(el.box('bs', 40, 206, 385, 76, 'scarto dal totale esatto', !cfr ? '·' : uguali() ? 'nessuno' : D(s - c / 100) + ' €', !cfr ? '' : uguali() ? 'on' : 'err', { sim: 'lente', riga: true }));
        els.push(el.box('bu', 445, 206, 385, 76, 'i due totali', !cfr ? '·' : uguali() ? 'coincidono' : 'sono diversi', !cfr ? '' : uguali() ? 'on' : 'err', { sim: 'bilancio', riga: true }));
        return els;
      };
      const hud = () => [['Addizioni', k + ' su ' + n, 'a'], ['Centesimi', c], ['Virgola mobile', k ? F(s) : '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Il medesimo importo in due rappresentazioni', 'La quota è di ' + E2(q) + ' euro. Un programma può conservarla in virgola mobile, come numero di euro, oppure come numero intero di centesimi. La quota è sommata ' + n + ' volte in entrambi i modi.');
      P({ foc: 'c', c: q + (q === 1 ? ' centesimo' : ' centesimi') }, 0, 'La quota in centesimi', 'In centesimi la quota è l’intero ' + q + '. Un intero si scrive in binario senza alcun errore.',
        { calc: E2(q) + ' € = ' + q + (q === 1 ? ' centesimo' : ' centesimi'), chiedi: { d: 'In euro la quota è la frazione ' + FR[0] + '. La sua scrittura binaria è finita?', o: ['Sì', 'No'], g: esatta ? 0 : 1, no: 'Una frazione ha scrittura binaria finita soltanto se il suo denominatore, ridotta ai minimi termini, è una potenza di due. In questo caso il denominatore è ' + FR[1] + (esatta ? ', che è una potenza di due.' : ', che contiene il fattore 5.') } });
      P({ foc: 'f', f: F(qf) + ' €', c: q + (q === 1 ? ' centesimo' : ' centesimi') }, 0, 'La quota in virgola mobile', 'In euro la quota è la frazione ' + FR[0] + '. ' + (esatta ? 'Il denominatore è una potenza di due, e la scrittura binaria è quindi finita: la quota è conservata esattamente nei 32 bit.' : 'Il denominatore contiene il fattore 5, e la scrittura binaria è quindi periodica. Nei 32 bit è conservato il numero rappresentabile più vicino, che vale circa ' + F(qf) + ' ed è lievemente più ' + (qf > q / 100 ? 'grande' : 'piccolo') + ' della quota esatta.'),
        { calc: E2(q) + ' → ' + F(qf), esito: [esatta ? 'esatta' : 'approssimata', esatta ? 'si' : 'no'] });
      for (let j = 0; j < n; j++) {
        const sp = s, cp = c, vero = s + qf;
        s = Math.fround(vero); c += q;
        const arr = vero !== s, ug = uguali();
        const o = { cur: j, mostra: true, f: F(s) + ' €', c: c + ' centesimi = ' + E2(c) + ' €' }; const els = quadro(o); k = j + 1;
        passi.push({ atto: 1, titolo: 'Addizione ' + k + ' di ' + n,
          testo: 'In centesimi: ' + cp + ' + ' + q + ' = ' + c + '. In virgola mobile la somma ' + (arr ? 'esatta sarebbe ' + F(vero) + ', che ha più cifre di quante il significando possa conservarne. Essa è arrotondata al numero rappresentabile più vicino, ' + F(s) + '.' : 'vale ' + F(s) + ' ed è conservata nel significando senza arrotondamento.') + ' ' + (ug ? (esatta ? 'I due totali coincidono.' : 'In questo passo l’arrotondamento riporta il totale sul valore esatto. Si tratta di una compensazione fortuita, che l’addizione successiva può annullare.') : 'Lo scarto dal totale esatto è di ' + D(s - c / 100) + ' euro.'),
          calc: F(sp) + ' + ' + F(qf) + ' → ' + F(s), hud: hud(), els });
      }
      const fine = uguali();
      P({ f: F(s) + ' €', c: c + ' centesimi = ' + E2(c) + ' €' }, 2, fine ? 'I due totali coincidono' : 'I due totali sono diversi',
        fine ? (esatta ? 'Dopo ogni addizione i due totali sono rimasti uguali. La quota di ' + E2(q) + ' euro ha una scrittura binaria esatta, e nessuna somma ha richiesto un arrotondamento.' : 'Dopo ' + n + ' addizioni i due totali coincidono, per effetto di una compensazione fra arrotondamenti. Nei passi precedenti erano diversi, e un’ulteriore addizione li renderebbe nuovamente diversi. Un programma corretto esclude ogni affidamento su una coincidenza di questo tipo.')
          : 'Il totale in centesimi vale ' + c + ', cioè ' + E2(c) + ' euro, senza errore. Il totale in virgola mobile vale circa ' + F(s) + '. Lo scarto è piccolo, e tuttavia un confronto di uguaglianza con ' + E2(c) + ' darebbe esito falso, e in un registro contabile gli scarti si accumulano a ogni riga.',
        { calc: F(s) + (fine ? ' = ' : ' ≠ ') + E2(c) });
      return { passi, esito: fine ? 'si' : 'no' };
    }
  },
  bilancio: {
    regola: [
      'Una frazione decimale è conservata esattamente in virgola mobile soltanto se il suo denominatore, ridotta ai minimi termini, è una potenza di due. Le altre contengono un errore iniziale, e ogni addizione può aggiungerne.',
      'Le grandezze che si contano si conservano in un intero con un fattore di scala fisso, cioè in virgola fissa. Le grandezze che si misurano si conservano in virgola mobile, e i loro risultati vanno trattati come valori arrotondati.'
    ],
    errori: [
      ['Confrontare per uguaglianza un totale in virgola mobile.', 'Dieci addizioni di 0,10 danno circa 1,0000001192. Il confronto con 1 risulta falso.'],
      ['Fondarsi su una coincidenza.', 'Cinque addizioni di 0,10 danno esattamente 0,5 poiché gli arrotondamenti si compensano. La sesta annulla la coincidenza.'],
      ['Convertire in euro a ogni passo.', 'In virgola fissa i calcoli si eseguono sugli interi. La divisione per cento occorre soltanto quando l’importo deve essere mostrato.']
    ],
    saFare: ['Riconoscere le frazioni che la virgola mobile conserva esattamente.', 'Conservare un importo in centesimi interi e convertirlo soltanto al termine.', 'Scegliere fra intero con scala e virgola mobile in base alla grandezza.'],
    esercizi: [
      { d: 'Quale di questi importi è conservato esattamente in virgola mobile?', guida: 'Si scelga la risposta.', o: [
        { t: '0,20 €', fb: 'Venti centesimi sono 1/5, e il cinque è un fattore diverso da due. La scrittura binaria è periodica.' },
        { t: '0,75 €', ok: true, fb: 'Settantacinque centesimi sono 3/4, cioè un mezzo più un quarto: in binario 0,11.' },
        { t: '0,30 €', fb: 'Trenta centesimi sono 3/10, e il dieci contiene il fattore 5. La scrittura binaria è periodica.' }] },
      { d: 'Un programma conserva gli importi in centesimi interi, e somma tre articoli da 0,10 euro e uno da 0,05 euro. Quale intero contiene il totale?', segnaposto: 'Un numero intero', giuste: ['35', 'trentacinque', '35centesimi'],
        ok: 'In centesimi: 10 + 10 + 10 + 5 = 35. Al momento di mostrarlo, il programma scriverà 0,35 euro.',
        diagnosi: [
          { se: ['0.35', '0.35€', '0.35euro'], msg: 'Questo è l’importo in euro. Il programma conserva un intero che conta i centesimi.' },
          { se: ['3.5', '350'], msg: 'Il fattore di scala è cento: un euro vale cento centesimi.' },
          { se: ['30', 'trenta'], msg: 'Sono stati sommati i tre articoli da dieci centesimi. Manca quello da cinque.' }
        ],
        altro: 'Il numero è diverso. Si converta ogni importo in centesimi e si sommino gli interi.',
        indizi: ['0,10 euro sono 10 centesimi.', '0,05 euro sono 5 centesimi.', 'La somma è 10 + 10 + 10 + 5.'],
        svolgimento: ['Tre articoli da 0,10 euro: 3 × 10 = 30 centesimi.', 'Un articolo da 0,05 euro: 5 centesimi.', 'Totale: 30 + 5 = 35 centesimi, cioè 0,35 euro.'] }
    ]
  }
});
