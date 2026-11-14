'use strict';
SL.registra('1.6.2', {
  titolo: 'Il formato IEEE 754',
  obiettivo: 'Obiettivo: scomporre una parola di 32 bit nei suoi tre campi, riconoscere la classe di numeri alla quale appartiene e ricavarne il valore.',
  concetti: [['virgola', 'Virgola mobile'], ['segno', 'Segno'], ['tabella', 'Campi']],
  filigrana: ['virgola', 'tabella', 'bit'],
  richiami: {
    carte: [
      { sim: 'virgola', da: 'Dall’unità 1.6.1', t: 'Le frazioni binarie', d: 'Dopo la virgola i pesi sono un mezzo, un quarto, un ottavo. La scrittura 1,1 vale uno e mezzo.' },
      { sim: 'tabella', da: 'Dall’unità 1.3.4', t: 'I campi', d: 'Un formato divide i bit in campi, ciascuno con una larghezza e un significato stabiliti.' },
      { sim: 'hex', da: 'Dall’unità 1.2.2', t: 'L’esadecimale', d: 'Ogni cifra esadecimale rappresenta quattro bit. Otto cifre descrivono una parola di 32 bit.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale il numero binario 1,01?', o: [
      { t: '1,01', fb: 'Le cifre dopo la virgola sono binarie: la seconda ha peso un quarto.' },
      { t: '1,25', ok: true, fb: 'Uno, più zero mezzi, più un quarto.' },
      { t: '1,5', fb: 'Uno e mezzo si scrive 1,1. In questo caso la cifra a 1 occupa la posizione del quarto.' }
    ] }
  },
  idea: {
    titolo: 'Una notazione scientifica in 32 bit',
    termini: ['virgola mobile', 'significando', 'esponente', 'ieee 754', 'nan'],
    testo: [
      'Un programma può operare tanto sulla massa di un atomo quanto sulla distanza fra due stelle. La rappresentazione di grandezze così diverse con una virgola in posizione fissa richiederebbe centinaia di bit. Le scienze sperimentali affrontano da tempo il medesimo problema con la notazione scientifica: la velocità della luce si scrive 3 × 10⁸ metri al secondo. Il numero in apice indica quante volte il dieci va moltiplicato per se stesso, cioè di quante posizioni va spostata la virgola: 10⁸ è un 1 seguito da otto zeri.',
      'I calcolatori adottano il medesimo principio in base due, sotto il nome di [[virgola mobile]]. Un numero è scritto come un [[significando]], cioè le sue cifre, moltiplicato per una potenza di due. Il numero che indica quante volte moltiplicare il due per se stesso è l’[[esponente]], e determina lo spostamento della virgola. Il numero cinque, per esempio, è 1,01 × 2², poiché 1,25 per quattro dà cinque.',
      'Il significando è sempre scritto con una sola cifra prima della virgola, e in binario tale cifra, se il numero è diverso da zero, può essere soltanto 1. Essendo sempre 1, la sua memorizzazione è superflua: in memoria sono conservate soltanto le cifre dopo la virgola.',
      'Tutti i calcolatori seguono il medesimo standard, denominato [[ieee 754|IEEE 754]]. Nel formato a 32 bit i campi sono tre. Il primo bit è il segno, 0 per i positivi e 1 per i negativi. Gli otto bit successivi contengono l’esponente. I ventitré bit restanti contengono le cifre del significando dopo la virgola.',
      { fig: 'scena', w: 700, h: 84, titolo: 'I tre campi del formato a 32 bit', nota: 'Un bit di segno, otto di esponente, ventitré per le cifre dopo la virgola del significando.', els: [
        SL.el.box('s', 0, 8, 70, 66, '1 bit', 'S', 'att', { cls: 'stretta' }), SL.el.box('e', 80, 8, 200, 66, '8 bit', 'esponente', 'on', { cls: 'stretta' }), SL.el.box('f', 290, 8, 410, 66, '23 bit', 'cifre del significando', '', { cls: 'stretta' })] },
      'L’esponente può essere negativo, per i numeri piccoli. Per evitare un secondo bit di segno il formato lo scrive aumentato di 127: il campo contiene 127 quando l’esponente vale zero, 129 quando vale due, 126 quando vale meno uno. Per ricavare l’esponente effettivo si sottrae 127 dal campo.',
      'I due valori estremi del campo esponente sono riservati. Con il campo a zero si rappresentano lo zero e i numeri di grandezza minima. Con il campo a 255, cioè tutti 1, si rappresentano due casi speciali: l’infinito, quando le cifre del significando sono tutte zero, e il [[nan|NaN]], che indica un risultato privo di significato e deriva da operazioni come zero diviso zero.',
      'Per questa ragione la lettura di un numero in virgola mobile comincia sempre con una classificazione. Si esamina dapprima il campo esponente, per stabilire la classe alla quale la parola appartiene, e soltanto in seguito si applica la formula corrispondente.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento considera una parola di 32 bit scritta in esadecimale. La parola è espansa in binario, i tre campi sono separati e si stabilisce la classe di appartenenza.',
      'Per un numero normale si ricava l’esponente effettivo, si ricostruisce il significando e si calcola il valore. Per un caso speciale la lettura si arresta alla classificazione.'
    ],
    vedrai: [
      ['bit', 'I 32 bit', 'In alto, divisi nei tre campi: segno, esponente, cifre del significando.'],
      ['tabella', 'I campi letti', 'Al centro: il valore di ciascun campo, aggiornato a ogni lettura.'],
      ['virgola', 'Il valore', 'In basso a destra, al termine.']
    ]
  },
  lab: {
    titolo: 'Scomposizione di un numero in virgola mobile',
    scena: { w: 860, h: 300 },
    atti: ['La parola', 'I tre campi', 'La classe', 'Il valore'],
    nota: 'Un numero normale richiede dieci passi. I casi speciali si arrestano alla classificazione e ne richiedono sette.',
    controlli: [{ id: 'w', tipo: 'scelta', eti: 'Parola', opzioni: [[0x3FC00000, '0x3FC00000'], [0xC0A00000, '0xC0A00000'], [0x41200000, '0x41200000'], [0x7F800000, '0x7F800000'], [0x7FC00000, '0x7FC00000'], [0, '0x00000000']], valore: 0x3FC00000 }],
    previsione: {
      domanda: (p) => 'La parola è 0x' + p.w.toString(16).toUpperCase().padStart(8, '0') + '. Letta come numero in virgola mobile a 32 bit, che cosa rappresenta?',
      opzioni: () => ['0', '1,5', '10', '−5', 'infinito', 'NaN']
    },
    confronto: (pred, esito) => 'La previsione indicava «' + pred + '». La parola rappresenta «' + esito + '». ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'infinito' || esito === 'NaN' ? 'Con il campo esponente a 255 la parola è un caso speciale: infinito se le cifre del significando sono tutte zero, NaN altrimenti.' : esito === '0' ? 'Con tutti i bit a zero la parola rappresenta lo zero.' : 'Vanno ricostruite le tre parti: il segno dal primo bit, l’esponente sottraendo 127 dal campo, il significando aggiungendo l’uno implicito.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const bit = (p.w >>> 0).toString(2).padStart(32, '0').split('').map(Number);
      const S = bit[0], E = parseInt(bit.slice(1, 9).join(''), 2), F = parseInt(bit.slice(9).join(''), 2);
      const fam = E === 255 ? (F ? 'NaN' : 'infinito') : E === 0 ? (F ? 'piccolissimo' : 'zero') : 'normale';
      const esp = E - 127, sig = 1 + F / 8388608;
      const V = (x) => String(x).replace('.', ',').replace('-', '−');
      const val = fam === 'normale' ? (S ? -1 : 1) * sig * Math.pow(2, esp) : null;
      const esito = fam === 'normale' ? V(val) : fam === 'zero' ? '0' : fam;
      const X = (i) => 40 + i * 24 + (i > 0 ? 10 : 0) + (i > 8 ? 10 : 0);
      let aperta = false, c = { s: null, e: null, f: null, fam: null, val: null };
      const quadro = (o) => {
        o = o || {};
        const els = [];
        if (aperta) bit.forEach((b, i) => { const campo = i === 0 ? 's' : i < 9 ? 'e' : 'f'; els.push(el.cella('b' + i, X(i), 44, 22, 34, String(b), o.campo === campo ? 'att' : c[campo] !== null ? (b ? 'on' : 'zero') : '', { cls: 'minuta', so: i === 0 ? 'S' : i === 1 ? 'E' : i === 9 ? 'F' : null })); });
        else els.push(el.box('hx', 40, 30, 300, 60, 'parola di 32 bit', '0x' + (p.w >>> 0).toString(16).toUpperCase().padStart(8, '0'), 'att', { cls: 'stretta' }));
        els.push(el.box('cs', 40, 116, 180, 70, 'segno', c.s === null ? '·' : c.s, o.campo === 's' ? 'att' : '', { cls: 'stretta' }));
        els.push(el.box('ce', 240, 116, 260, 70, 'campo esponente', c.e === null ? '·' : c.e, o.campo === 'e' ? 'att' : '', { cls: 'stretta' }));
        els.push(el.box('cf', 520, 116, 300, 70, 'cifre del significando', c.f === null ? '·' : c.f, o.campo === 'f' ? 'att' : '', { cls: 'stretta' }));
        els.push(el.box('fa', 40, 212, 360, 74, 'classe', c.fam || '·', o.fam ? 'att' : c.fam ? 'on' : '', { sim: 'tabella', riga: true }));
        els.push(el.box('va', 430, 212, 390, 74, 'valore', c.val || '·', o.val ? 'att' : '', { sim: 'virgola', riga: true }));
        return els;
      };
      const hud = () => [['Segno', c.s === null ? '·' : S, 'a'], ['Campo esponente', c.e === null ? '·' : E], ['Famiglia', c.fam || '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Otto cifre esadecimali', 'La parola è 0x' + (p.w >>> 0).toString(16).toUpperCase().padStart(8, '0') + '. Otto cifre esadecimali descrivono 32 bit. La lettura dei campi richiede di esaminarli singolarmente.');
      aperta = true;
      P({}, 0, 'La parola in binario', 'Ogni cifra esadecimale si espande in quattro bit. I 32 bit sono divisi in tre gruppi: il primo bit, gli otto successivi e i ventitré restanti.', { calc: bit.slice(0, 1).join('') + ' ' + bit.slice(1, 9).join('') + ' ' + bit.slice(9).join('') });
      c.s = S ? 'negativo' : 'positivo';
      P({ campo: 's' }, 1, 'Il campo segno', 'Il primo bit vale ' + S + ': il numero è ' + c.s + '.', { calc: 'S = ' + S });
      c.e = E + (fam === 'normale' ? ' · esponente ?' : '');
      P({ campo: 'e' }, 1, 'Il campo esponente', 'Gli otto bit successivi sono ' + bit.slice(1, 9).join('') + ', che come numero senza segno valgono ' + E + '.', { calc: bit.slice(1, 9).join('') + ' = ' + E });
      const cifreF = bit.slice(9).join('').replace(/0+$/, '');
      c.f = F === 0 ? 'tutte zero' : cifreF + ' e poi zeri';
      P({ campo: 'f' }, 1, 'Le cifre del significando', F === 0 ? 'I ventitré bit rimanenti valgono tutti zero.' : 'I ventitré bit rimanenti cominciano con ' + cifreF + ' e proseguono con soli zeri.',
        { calc: 'F = ' + (F === 0 ? '0' : cifreF + '000…'), chiedi: { d: 'Il campo esponente vale ' + E + '. A quale classe appartiene la parola?', o: ['Un numero normale', 'Un caso speciale: infinito o NaN', 'Lo zero o un numero di grandezza minima'], g: E === 255 ? 1 : E === 0 ? 2 : 0, no: 'Il campo esponente a 255 segnala i casi speciali, a 0 lo zero e i numeri di grandezza minima. Tutti gli altri valori indicano un numero normale.' } });
      c.fam = fam === 'normale' ? 'numero normale' : fam === 'zero' ? 'zero' : fam === 'piccolissimo' ? 'numero di grandezza minima' : fam === 'infinito' ? 'infinito' : 'NaN';
      P({ fam: true }, 2, 'La classificazione', fam === 'normale'
        ? 'Il campo esponente vale ' + E + ', diverso da 0 e da 255. La parola è un numero normale, e si legge con la formula: segno, significando con l’uno implicito, potenza di due.'
        : E === 255 ? 'Il campo esponente vale 255, tutti 1: si tratta di un caso speciale. La distinzione richiede l’esame delle cifre del significando, che in questo caso ' + (F ? 'non sono tutte zero.' : 'sono tutte zero.')
        : 'Il campo esponente vale 0. Le cifre del significando sono tutte zero, e la parola rappresenta quindi lo zero.', { calc: 'E = ' + E + ' → ' + c.fam });
      if (fam !== 'normale') {
        c.val = esito === 'infinito' ? (S ? '−infinito' : '+infinito') : esito;
        P({ val: true }, 3, fam === 'zero' ? 'Lo zero' : fam === 'infinito' ? 'L’infinito' : 'Un risultato privo di significato', fam === 'zero'
          ? 'Un significando che comincia per 1 è sempre diverso da zero. Per questa ragione lo zero ha una scrittura riservata, con tutti i bit a zero.'
          : fam === 'infinito' ? 'Con il campo esponente a 255 e le cifre tutte a zero la parola rappresenta l’infinito. Esso deriva, per esempio, dalla divisione di un numero per zero, oppure da un risultato che eccede il formato.'
          : 'Con il campo esponente a 255 e cifre diverse da zero la parola è un NaN. Esso indica che un’operazione era priva di risultato definito, come zero diviso zero. Qualunque calcolo che lo impieghi produce un altro NaN.');
        return { passi, esito };
      }
      c.e = E + ' · esponente ' + V(esp);
      P({ campo: 'e' }, 3, 'L’esponente effettivo', 'Il campo contiene l’esponente aumentato di 127. Per ricavarlo si sottrae: ' + E + ' − 127 = ' + V(esp) + '. La potenza di due è 2 elevato a ' + V(esp) + ', cioè ' + V(Math.pow(2, esp)) + '.',
        { calc: E + ' − 127 = ' + V(esp), chiedi: { d: 'Le cifre conservate sono ' + (F === 0 ? 'tutte zero' : cifreF) + '. Aggiungendo l’uno implicito, come si scrive il significando in binario?', o: ['0,' + (cifreF || '0'), '1,' + (cifreF || '0'), (cifreF || '0') + ',0'], g: 1, no: 'La cifra prima della virgola è sempre 1 e non è conservata. Le cifre del campo seguono la virgola.' } });
      c.f = '1,' + (cifreF || '0') + ' = ' + V(sig);
      P({ campo: 'f' }, 3, 'Il significando', 'Alle cifre conservate va anteposto l’uno implicito. Il significando è 1,' + (cifreF || '0') + ' in binario, cioè ' + V(sig) + '.', { calc: '1,' + (cifreF || '0') + ' = ' + V(sig) });
      c.val = V(val);
      P({ val: true }, 3, 'Il valore', 'Si moltiplica il significando per la potenza di due e si applica il segno: ' + V(sig) + ' × ' + V(Math.pow(2, esp)) + ' = ' + V(sig * Math.pow(2, esp)) + (S ? ', con il segno meno.' : '.') + ' La parola rappresenta ' + V(val) + '.', { calc: (S ? '−' : '') + V(sig) + ' × 2^' + V(esp) + ' = ' + V(val) });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Un numero in virgola mobile a 32 bit ha tre campi: un bit di segno, otto di esponente, ventitré di cifre del significando. L’esponente effettivo è il campo diminuito di 127, e il significando ha un 1 implicito prima della virgola.',
      'La lettura comincia dalla classificazione. Il campo esponente a 255 indica infinito o NaN, a 0 lo zero e i numeri di grandezza minima. Negli altri casi vale la formula dei numeri normali.'
    ],
    errori: [
      ['Impiegare il campo esponente senza correzione.', 'Il campo contiene l’esponente aumentato di 127. Con il campo a 129 l’esponente effettivo è 2.'],
      ['Omettere l’uno implicito.', 'Le cifre conservate seguono la virgola. Il significando ha sempre parte intera uguale a uno.'],
      ['Applicare la formula ai casi speciali.', 'Con il campo esponente a 255 la parola non è un numero ordinario. Va riconosciuta prima di qualunque calcolo.']
    ],
    saFare: ['Dividere una parola di 32 bit nei tre campi.', 'Classificare la parola in base al campo esponente.', 'Calcolare il valore di un numero normale.'],
    esercizi: [
      { d: 'In una parola in virgola mobile a 32 bit il campo esponente contiene 130. Quanto vale l’esponente effettivo?', segnaposto: 'Un numero', giuste: ['3'],
        ok: 'Si sottrae 127 dal campo: 130 − 127 = 3.',
        diagnosi: [
          { se: ['130'], msg: 'Il valore indicato è il contenuto del campo. L’esponente effettivo si ottiene sottraendo 127.' },
          { se: ['257'], msg: 'È stato sommato 127. Il campo contiene già l’esponente aumentato di 127, che va quindi sottratto.' },
          { se: ['8'], msg: 'Otto è la potenza, due alla terza. È richiesto l’esponente.' }
        ],
        altro: 'Il valore è diverso. Il campo contiene l’esponente effettivo più 127.',
        indizi: ['Il formato conserva l’esponente aumentato di 127.', 'Per ricavare l’esponente si sottrae 127.', '130 − 127.'],
        svolgimento: ['Campo esponente: 130.', 'Esponente effettivo: 130 − 127 = 3.', 'La potenza di due è 2³, cioè 8.'] },
      { d: 'Una parola ha il campo esponente a 255 e le cifre del significando diverse da zero. Che cosa rappresenta?', guida: 'Si scelga la risposta.', o: [
        { t: 'Un numero molto grande', fb: 'Il valore 255 è riservato ai casi speciali, ed è escluso dalla lettura come esponente.' },
        { t: 'L’infinito', fb: 'L’infinito richiede cifre del significando tutte a zero.' },
        { t: 'Un NaN', ok: true, fb: 'Campo esponente a 255 e cifre diverse da zero: un risultato privo di significato.' }] }
    ],
    sfida: ['lez06_04_ieee754_single_decode', 'Leggere un numero IEEE 754 a precisione singola']
  }
});
