'use strict';
SL.registra('1.6.2', {
  titolo: 'Il formato IEEE 754',
  obiettivo: 'Alla fine saprai smontare una parola di 32 bit nei suoi tre campi, riconoscere a quale famiglia di numeri appartiene e ricavarne il valore.',
  concetti: [['virgola', 'Virgola mobile'], ['segno', 'Segno'], ['tabella', 'Campi']],
  filigrana: ['virgola', 'tabella', 'bit'],
  richiami: {
    carte: [
      { sim: 'virgola', da: 'Dall’unità 1.6.1', t: 'Le frazioni binarie', d: 'Dopo la virgola i pesi sono un mezzo, un quarto, un ottavo. La scrittura 1,1 vale uno e mezzo.' },
      { sim: 'tabella', da: 'Dall’unità 1.3.4', t: 'I campi', d: 'Un formato divide i bit in campi, ciascuno con una larghezza e un significato stabiliti.' },
      { sim: 'hex', da: 'Dall’unità 1.2.2', t: 'L’esadecimale', d: 'Ogni cifra esadecimale riassume quattro bit. Otto cifre descrivono una parola di 32 bit.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale il numero binario 1,01?', o: [
      { t: '1,01', fb: 'Le cifre dopo la virgola sono binarie: la seconda pesa un quarto.' },
      { t: '1,25', ok: true, fb: 'Uno, più zero mezzi, più un quarto.' },
      { t: '1,5', fb: 'Uno e mezzo si scrive 1,1. Qui la cifra a 1 è nella posizione del quarto.' }
    ] }
  },
  idea: {
    titolo: 'Una notazione scientifica in 32 bit',
    termini: ['virgola mobile', 'significando', 'esponente', 'ieee 754', 'nan'],
    testo: [
      'Un programma può avere a che fare con la massa di un atomo e con la distanza fra due stelle. Per coprire grandezze così diverse con una virgola in posizione fissa servirebbero centinaia di bit. La scienza ha risolto lo stesso problema da tempo con la notazione scientifica: la velocità della luce si scrive 3 × 10⁸ metri al secondo. Il piccolo numero in alto dice quante volte il dieci va moltiplicato per se stesso, cioè di quanti posti va spostata la virgola: 10⁸ è un 1 seguito da otto zeri.',
      'I calcolatori usano la stessa idea in base due, e la chiamano [[virgola mobile]]. Un numero viene scritto come un [[significando]], cioè le sue cifre, moltiplicato per una potenza di due. Il numero che dice quante volte moltiplicare il due per se stesso è l’[[esponente]], e sposta la virgola. Il numero cinque, per esempio, è 1,01 × 2², perché 1,25 per quattro fa cinque.',
      'Il significando viene sempre scritto con una sola cifra prima della virgola, e in binario quella cifra, se il numero è diverso da zero, può essere soltanto 1. Essendo sempre 1 è inutile conservarla: in memoria finiscono soltanto le cifre dopo la virgola.',
      'Tutti i calcolatori seguono lo stesso standard, chiamato [[ieee 754|IEEE 754]]. Nel formato a 32 bit i campi sono tre. Il primo bit è il segno, 0 per i positivi e 1 per i negativi. Gli otto bit successivi contengono l’esponente. I ventitré bit restanti contengono le cifre del significando dopo la virgola.',
      { fig: 'scena', w: 700, h: 84, titolo: 'I tre campi del formato a 32 bit', nota: 'Un bit di segno, otto di esponente, ventitré per le cifre dopo la virgola del significando.', els: [
        SL.el.box('s', 0, 8, 70, 66, '1 bit', 'S', 'att', { cls: 'stretta' }), SL.el.box('e', 80, 8, 200, 66, '8 bit', 'esponente', 'on', { cls: 'stretta' }), SL.el.box('f', 290, 8, 410, 66, '23 bit', 'cifre del significando', '', { cls: 'stretta' })] },
      'L’esponente può essere negativo, per i numeri piccoli. Per evitare un secondo bit di segno il formato lo scrive aumentato di 127: il campo contiene 127 quando l’esponente vale zero, 129 quando vale due, 126 quando vale meno uno. Per ritrovare l’esponente vero si sottrae 127 dal campo.',
      'I due valori estremi del campo esponente sono riservati. Con il campo a zero si rappresentano lo zero e i numeri piccolissimi. Con il campo a 255, cioè tutti 1, si rappresentano due casi speciali: l’infinito, quando le cifre del significando sono tutte zero, e il [[nan|NaN]], che significa «risultato privo di senso» e nasce da operazioni come zero diviso zero.',
      'Per questo la lettura di un numero in virgola mobile comincia sempre con una classificazione. Prima si guarda il campo esponente, per capire a quale famiglia appartiene la parola, e soltanto dopo si applica la formula adatta.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai una parola di 32 bit scritta in esadecimale. La apriremo in binario, separeremo i tre campi e decideremo a quale famiglia appartiene.',
      'Se è un numero normale ricaveremo l’esponente vero, ricostruiremo il significando e calcoleremo il valore. Se è un caso speciale, ci fermeremo alla classificazione.'
    ],
    vedrai: [
      ['bit', 'I 32 bit', 'In alto, divisi nei tre campi: segno, esponente, cifre del significando.'],
      ['tabella', 'I campi letti', 'Al centro: il valore di ciascun campo, man mano che lo leggiamo.'],
      ['virgola', 'Il valore', 'In basso a destra, alla fine.']
    ]
  },
  lab: {
    titolo: 'Smontare un numero in virgola mobile',
    scena: { w: 860, h: 300 },
    atti: ['La parola', 'I tre campi', 'La famiglia', 'Il valore'],
    nota: 'Un numero normale richiede dieci passi. I casi speciali si fermano alla classificazione e ne richiedono sette.',
    controlli: [{ id: 'w', tipo: 'scelta', eti: 'Parola', opzioni: [[0x3FC00000, '0x3FC00000'], [0xC0A00000, '0xC0A00000'], [0x41200000, '0x41200000'], [0x7F800000, '0x7F800000'], [0x7FC00000, '0x7FC00000'], [0, '0x00000000']], valore: 0x3FC00000 }],
    previsione: {
      domanda: (p) => 'La parola è 0x' + p.w.toString(16).toUpperCase().padStart(8, '0') + '. Letta come numero in virgola mobile a 32 bit, che cosa rappresenta?',
      opzioni: () => ['0', '1,5', '10', '−5', 'infinito', 'NaN']
    },
    confronto: (pred, esito) => 'Avevi previsto «' + pred + '». La parola rappresenta «' + esito + '». ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'infinito' || esito === 'NaN' ? 'Con il campo esponente a 255 la parola è un caso speciale: infinito se le cifre del significando sono tutte zero, NaN altrimenti.' : esito === '0' ? 'Con tutti i bit a zero la parola rappresenta lo zero.' : 'Ricostruisci i tre pezzi: il segno dal primo bit, l’esponente togliendo 127 al campo, il significando aggiungendo l’uno sottinteso.'),
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
        els.push(el.box('fa', 40, 212, 360, 74, 'famiglia', c.fam || '·', o.fam ? 'att' : c.fam ? 'on' : '', { sim: 'tabella', riga: true }));
        els.push(el.box('va', 430, 212, 390, 74, 'valore', c.val || '·', o.val ? 'att' : '', { sim: 'virgola', riga: true }));
        return els;
      };
      const hud = () => [['Segno', c.s === null ? '·' : S, 'a'], ['Campo esponente', c.e === null ? '·' : E], ['Famiglia', c.fam || '·', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Otto cifre esadecimali', 'La parola è 0x' + (p.w >>> 0).toString(16).toUpperCase().padStart(8, '0') + '. Otto cifre esadecimali descrivono 32 bit. Per leggere i campi dobbiamo vederli uno per uno.');
      aperta = true;
      P({}, 0, 'La parola in binario', 'Ogni cifra esadecimale si apre in quattro bit. I 32 bit sono divisi in tre gruppi: il primo bit, gli otto successivi e i ventitré restanti.', { calc: bit.slice(0, 1).join('') + ' ' + bit.slice(1, 9).join('') + ' ' + bit.slice(9).join('') });
      c.s = S ? 'negativo' : 'positivo';
      P({ campo: 's' }, 1, 'Il campo segno', 'Il primo bit vale ' + S + ': il numero è ' + c.s + '.', { calc: 'S = ' + S });
      c.e = E + (fam === 'normale' ? ' · esponente ?' : '');
      P({ campo: 'e' }, 1, 'Il campo esponente', 'Gli otto bit successivi sono ' + bit.slice(1, 9).join('') + ', che come numero senza segno valgono ' + E + '.', { calc: bit.slice(1, 9).join('') + ' = ' + E });
      const cifreF = bit.slice(9).join('').replace(/0+$/, '');
      c.f = F === 0 ? 'tutte zero' : cifreF + ' e poi zeri';
      P({ campo: 'f' }, 1, 'Le cifre del significando', F === 0 ? 'I ventitré bit rimanenti valgono tutti zero.' : 'I ventitré bit rimanenti cominciano con ' + cifreF + ' e proseguono con soli zeri.',
        { calc: 'F = ' + (F === 0 ? '0' : cifreF + '000…'), chiedi: { d: 'Il campo esponente vale ' + E + '. A quale famiglia appartiene la parola?', o: ['Un numero normale', 'Un caso speciale: infinito o NaN', 'Lo zero o un numero piccolissimo'], g: E === 255 ? 1 : E === 0 ? 2 : 0, no: 'Il campo esponente a 255 segnala i casi speciali, a 0 lo zero e i numeri piccolissimi. Tutti gli altri valori indicano un numero normale.' } });
      c.fam = fam === 'normale' ? 'numero normale' : fam === 'zero' ? 'zero' : fam === 'piccolissimo' ? 'numero piccolissimo' : fam === 'infinito' ? 'infinito' : 'NaN';
      P({ fam: true }, 2, 'La classificazione', fam === 'normale'
        ? 'Il campo esponente vale ' + E + ', diverso da 0 e da 255. La parola è un numero normale, e si legge con la formula: segno, significando con l’uno sottinteso, potenza di due.'
        : E === 255 ? 'Il campo esponente vale 255, tutti 1: è un caso speciale. Per distinguere bisogna guardare le cifre del significando, che qui ' + (F ? 'non sono tutte zero.' : 'sono tutte zero.')
        : 'Il campo esponente vale 0. Le cifre del significando sono tutte zero, quindi la parola rappresenta lo zero.', { calc: 'E = ' + E + ' → ' + c.fam });
      if (fam !== 'normale') {
        c.val = esito === 'infinito' ? (S ? '−infinito' : '+infinito') : esito;
        P({ val: true }, 3, fam === 'zero' ? 'Lo zero' : fam === 'infinito' ? 'L’infinito' : 'Un risultato privo di senso', fam === 'zero'
          ? 'Un significando che comincia per 1 è sempre diverso da zero. Per questo lo zero ha una scrittura riservata, con tutti i bit a zero.'
          : fam === 'infinito' ? 'Con il campo esponente a 255 e le cifre tutte a zero la parola rappresenta l’infinito. Nasce, per esempio, da una divisione di un numero per zero, oppure da un risultato troppo grande per il formato.'
          : 'Con il campo esponente a 255 e cifre diverse da zero la parola è un NaN. Indica che un’operazione non aveva un risultato sensato, come zero diviso zero. Qualunque calcolo che lo usa produce un altro NaN.');
        return { passi, esito };
      }
      c.e = E + ' · esponente ' + V(esp);
      P({ campo: 'e' }, 3, 'L’esponente vero', 'Il campo contiene l’esponente aumentato di 127. Per ritrovarlo si sottrae: ' + E + ' − 127 = ' + V(esp) + '. La potenza di due è 2 elevato a ' + V(esp) + ', cioè ' + V(Math.pow(2, esp)) + '.',
        { calc: E + ' − 127 = ' + V(esp), chiedi: { d: 'Le cifre conservate sono ' + (F === 0 ? 'tutte zero' : cifreF) + '. Aggiungendo l’uno sottinteso, come si scrive il significando in binario?', o: ['0,' + (cifreF || '0'), '1,' + (cifreF || '0'), (cifreF || '0') + ',0'], g: 1, no: 'La cifra prima della virgola è sempre 1 e non viene conservata. Le cifre del campo vanno dopo la virgola.' } });
      c.f = '1,' + (cifreF || '0') + ' = ' + V(sig);
      P({ campo: 'f' }, 3, 'Il significando', 'Davanti alle cifre conservate va rimesso l’uno sottinteso. Il significando è 1,' + (cifreF || '0') + ' in binario, cioè ' + V(sig) + '.', { calc: '1,' + (cifreF || '0') + ' = ' + V(sig) });
      c.val = V(val);
      P({ val: true }, 3, 'Il valore', 'Si moltiplica il significando per la potenza di due e si applica il segno: ' + V(sig) + ' × ' + V(Math.pow(2, esp)) + ' = ' + V(sig * Math.pow(2, esp)) + (S ? ', con il segno meno.' : '.') + ' La parola rappresenta ' + V(val) + '.', { calc: (S ? '−' : '') + V(sig) + ' × 2^' + V(esp) + ' = ' + V(val) });
      return { passi, esito };
    }
  },
  bilancio: {
    regola: [
      'Un numero in virgola mobile a 32 bit ha tre campi: un bit di segno, otto di esponente, ventitré di cifre del significando. L’esponente vero è il campo meno 127, e il significando ha un 1 sottinteso prima della virgola.',
      'La lettura comincia dalla classificazione. Il campo esponente a 255 indica infinito o NaN, a 0 lo zero e i numeri piccolissimi. Negli altri casi vale la formula dei numeri normali.'
    ],
    errori: [
      ['Usare il campo esponente così com’è.', 'Il campo contiene l’esponente aumentato di 127. Con il campo a 129 l’esponente vero è 2.'],
      ['Dimenticare l’uno sottinteso.', 'Le cifre conservate stanno dopo la virgola. Il significando è sempre uno virgola qualcosa.'],
      ['Applicare la formula ai casi speciali.', 'Con il campo esponente a 255 la parola non è un numero ordinario. Va riconosciuta prima di fare calcoli.']
    ],
    saFare: ['Divido una parola di 32 bit nei tre campi.', 'Classifico la parola guardando il campo esponente.', 'Calcolo il valore di un numero normale.'],
    esercizi: [
      { d: 'In una parola in virgola mobile a 32 bit il campo esponente contiene 130. Quanto vale l’esponente vero?', segnaposto: 'Un numero', giuste: ['3'],
        ok: 'Si sottrae 127 dal campo: 130 − 127 = 3.',
        diagnosi: [
          { se: ['130'], msg: 'Quello è il contenuto del campo. L’esponente vero si ottiene sottraendo 127.' },
          { se: ['257'], msg: 'Hai sommato 127. Il campo contiene già l’esponente aumentato di 127, quindi va sottratto.' },
          { se: ['8'], msg: 'Otto è la potenza, due alla terza. La domanda chiede l’esponente.' }
        ],
        altro: 'Il valore è diverso. Il campo contiene l’esponente vero più 127.',
        indizi: ['Il formato conserva l’esponente aumentato di 127.', 'Per tornare indietro si sottrae 127.', '130 − 127.'],
        svolgimento: ['Campo esponente: 130.', 'Esponente vero: 130 − 127 = 3.', 'La potenza di due è 2³, cioè 8.'] },
      { d: 'Una parola ha il campo esponente a 255 e le cifre del significando diverse da zero. Che cosa rappresenta?', guida: 'Scegli la risposta.', o: [
        { t: 'Un numero molto grande', fb: 'Il valore 255 è riservato ai casi speciali, e non viene letto come un esponente.' },
        { t: 'L’infinito', fb: 'L’infinito richiede cifre del significando tutte a zero.' },
        { t: 'Un NaN', ok: true, fb: 'Campo esponente a 255 e cifre diverse da zero: un risultato privo di senso.' }] }
    ],
    sfida: ['lez06_04_ieee754_single_decode', 'Leggere un numero IEEE 754 a precisione singola']
  }
});
