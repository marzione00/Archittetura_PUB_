'use strict';
SL.registra('1.3.5', {
  titolo: 'Un metodo per decodificare i dati',
  obiettivo: 'Obiettivo: analizzare una fila di byte di formato ignoto mediante cinque domande poste in ordine costante, e leggere correttamente un campo di due byte.',
  concetti: [['lente', 'Metodo'], ['puntatore', 'Cursore'], ['byte', 'Ordine dei byte']],
  filigrana: ['lente', 'byte', 'tabella'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 1.3.4', t: 'Campo, larghezza, cursore', d: 'Un campo occupa un certo numero di byte. Il cursore avanza di tale larghezza soltanto quando il campo è completo.' },
      { sim: 'memory', da: 'Dall’unità 1.2.3', t: 'L’ordine dei byte', d: 'In little-endian il byte meno significativo occupa l’indirizzo più basso. In big-endian lo occupa il più significativo.' },
      { sim: 'char', da: 'Dall’unità 1.2.4', t: 'Numero o carattere', d: 'Lo stesso byte 0x48 è il numero 72 oppure la lettera H, secondo la codifica dichiarata.' }
    ],
    domanda: { d: 'Prima di proseguire: i byte `34 12`, in quest’ordine, vengono letti come un numero little-endian. Quale byte ha il peso maggiore?', o: [
      { t: 'Il primo, 0x34', fb: 'In little-endian il primo byte è il meno significativo. Il peso maggiore va al secondo.' },
      { t: 'Il secondo, 0x12', ok: true, fb: 'Il numero è 0x1234: il byte all’indirizzo più alto è il più significativo.' },
      { t: 'Hanno lo stesso peso', fb: 'In un numero di due byte uno vale 256 volte l’altro.' }
    ] }
  },
  idea: {
    titolo: 'Cinque domande in ordine costante',
    termini: [],
    testo: [
      'Il capitolo ha esaminato la lettura di immagini, caratteri, suoni e messaggi. In ciascun caso i passaggi erano i medesimi, benché i dati fossero diversi. È opportuno enunciarli in forma generale, poiché valgono per qualunque fila di byte, compresi i formati non ancora incontrati.',
      'La prima domanda riguarda l’inizio del campo, cioè lo spostamento al quale esso comincia. La risposta è fornita dal formato oppure dal cursore, che conserva il punto in cui è terminato il campo precedente.',
      'La seconda domanda riguarda la larghezza. Un carattere ASCII occupa un byte, un canale di colore uno, un campione di un CD due. La larghezza può essere fissata dal formato oppure dichiarata da un campo precedente.',
      'La terza domanda riguarda la disponibilità dei byte. La somma di spostamento e larghezza deve restare entro i byte disponibili. Si tratta della validazione dell’unità 1.3.4, che precede qualunque calcolo: un valore ricavato da byte inesistenti è più dannoso dell’assenza di un valore.',
      'La quarta domanda riguarda l’ordine dei byte, ed è rilevante per i numeri che occupano più di un byte. I medesimi due byte forniscono due numeri diversi in little-endian e in big-endian.',
      'La quinta domanda riguarda il significato dei byte: un numero, un carattere, un colore. Soltanto a questo punto si calcola il valore. Il cursore avanza quindi della larghezza del campo, e il procedimento riprende dalla prima domanda.',
      { fig: 'scena', w: 700, h: 76, titolo: 'Le cinque domande', nota: 'L’ordine è vincolante: la disponibilità si verifica prima del calcolo, il significato si stabilisce per ultimo.', els: [
        SL.el.box('q1', 0, 6, 128, 60, '1', 'dove', 'on', { cls: 'stretta' }), SL.el.box('q2', 143, 6, 128, 60, '2', 'quanto', 'on', { cls: 'stretta' }), SL.el.box('q3', 286, 6, 128, 60, '3', 'ci sono', 'att', { cls: 'stretta' }),
        SL.el.box('q4', 429, 6, 128, 60, '4', 'che ordine', 'on', { cls: 'stretta' }), SL.el.box('q5', 572, 6, 128, 60, '5', 'che cosa', 'on', { cls: 'stretta' }),
        SL.el.linea('a', 128, 36, 143, 36, 'on'), SL.el.linea('b', 271, 36, 286, 36, 'on'), SL.el.linea('c', 414, 36, 429, 36, 'on'), SL.el.linea('d', 557, 36, 572, 36, 'on')] },
      'L’omissione di una domanda produce errori caratteristici. L’omissione della terza comporta la lettura oltre la fine dei dati. L’omissione della quarta fornisce un numero plausibile ed errato, che costituisce l’errore più difficile da individuare.'
    ]
  },
  esperimento: {
    faremo: [
      'L’esperimento dispone di sei byte, privi di ogni altra informazione. Scelti uno spostamento e una regola di lettura, le cinque domande sono applicate a un campo di due byte.',
      'È istruttivo anche lo spostamento 5: in tal caso il campo comincia sull’ultimo byte disponibile, e la terza domanda arresta la lettura.'
    ],
    vedrai: [
      ['memory', 'I sei byte', 'A sinistra, in esadecimale, con il cursore sotto.'],
      ['lente', 'Le cinque domande', 'A destra. Ogni domanda riceve la propria risposta, dall’alto verso il basso.'],
      ['tabella', 'Il valore', 'In basso a sinistra, una volta risolte tutte le domande.']
    ]
  },
  lab: {
    titolo: 'Lettura di un campo di due byte',
    scena: { w: 860, h: 300 },
    atti: ['I byte', 'Inizio, larghezza, disponibilità', 'Ordine e significato', 'Avanzamento del cursore'],
    nota: 'Se i byte sono incompleti la lettura si arresta alla terza domanda, e i passi si riducono.',
    controlli: [
      { id: 'o', tipo: 'num', eti: 'Spostamento', min: 0, max: 5, salti: [1], valore: 2 },
      { id: 'r', tipo: 'scelta', eti: 'Lettura', opzioni: [['le', 'Numero little-endian'], ['be', 'Numero big-endian'], ['txt', 'Testo ASCII']], valore: 'le' }
    ],
    previsione: {
      domanda: (p) => 'I sei byte sono 48 69 34 12 01 00. Si legge un campo di due byte allo spostamento ' + p.o + ', come ' + ({ le: 'numero little-endian', be: 'numero big-endian', txt: 'testo ASCII' })[p.r] + '. Che cosa si ottiene?',
      opzioni: (p) => { const B = [0x48, 0x69, 0x34, 0x12, 0x01, 0x00]; const C = (v) => (v >= 32 && v < 127 ? String.fromCharCode(v) : '·'); if (p.o > 4) return ['non leggibile', String(B[5]), String(B[4] + 256 * B[5])]; const a = B[p.o], b = B[p.o + 1]; return [String(a + 256 * b), String(256 * a + b), C(a) + C(b), 'non leggibile']; }
    },
    confronto: (pred, esito, p) => 'La previsione indicava «' + pred + '». Il risultato è «' + esito + '». ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'non leggibile' ? 'Allo spostamento 5 resta un solo byte, e il campo ne richiede due.' : pred === 'non leggibile' ? 'Il campo termina entro i sei byte disponibili, ed è quindi leggibile.' : p.r === 'txt' ? 'Con la lettura come testo ogni byte è un carattere a sé, senza pesi.' : 'È stato adottato l’ordine opposto: in ' + (p.r === 'le' ? 'little-endian ha peso maggiore il secondo byte.' : 'big-endian ha peso maggiore il primo byte.')),
    costruisci(p) {
      const el = SL.el, passi = [];
      const B = [0x48, 0x69, 0x34, 0x12, 0x01, 0x00];
      const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
      const C = (v) => (v >= 32 && v < 127 ? String.fromCharCode(v) : '·');
      const ok = p.o + 2 <= 6, a = B[p.o], b = B[p.o + 1];
      const NOME = { le: 'little-endian', be: 'big-endian', txt: 'testo ASCII' }[p.r];
      const val = !ok ? 'non leggibile' : p.r === 'le' ? String(a + 256 * b) : p.r === 'be' ? String(256 * a + b) : C(a) + C(b);
      const risp = [null, null, null, null, null];
      let cur = p.o, campo = false;
      const DOM = ['inizio del campo', 'larghezza', 'disponibilità', 'ordine dei byte', 'significato'];
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'I SEI BYTE DISPONIBILI', 'mono')];
        B.forEach((v, k) => els.push(el.cella('m' + k, 40 + k * 86, 46, 78, 58, H(v), campo && (k === p.o || k === p.o + 1) ? (o.pesa === k ? 'att' : 'on') : '', { piccola: true, so: 'spost. ' + k, gi: o.pesi && (k === p.o || k === p.o + 1) ? o.pesi[k - p.o] : null })));
        if (campo && !ok) els.push(el.cella('mx', 40 + 6 * 86, 46, 78, 58, '?', 'err', { piccola: true, so: 'spost. 6', gi: 'manca' }));
        els.push(el.cursore('cu', 40 + cur * 86, 140, 78));
        DOM.forEach((d, k) => els.push(el.box('q' + k, 660, 2 + k * 58, 190, 52, (k + 1) + ' · ' + d, risp[k] === null ? '·' : risp[k], o.dom === k ? (o.male ? 'err' : 'att') : risp[k] === null ? 'off' : 'on', { cls: 'stretta' })));
        els.push(el.box('va', 40, 196, 420, 76, 'valore letto', o.valore || '·', o.valore ? (o.male ? 'err' : 'att') : '', { sim: 'tabella', riga: true }));
        return els;
      };
      const hud = () => [['Cursore', 'spost. ' + cur, 'a'], ['Lettura', NOME], ['Domande risolte', risp.filter((x) => x !== null).length + ' di 5', 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Sei byte privi di etichetta', 'Sono dati sei byte: 48, 69, 34, 12, 01, 00. In sé essi sono privi di indicazioni su ciò che rappresentano. Le cinque domande sono applicate a un campo di due byte.');
      risp[0] = 'spost. ' + p.o;
      P({ dom: 0 }, 1, 'Prima domanda: inizio del campo', 'Il campo comincia allo spostamento ' + p.o + '. Il cursore si porta su tale byte.', { calc: 'inizio = ' + p.o });
      risp[1] = '2 byte'; campo = true;
      P({ dom: 1 }, 1, 'Seconda domanda: larghezza', 'Il campo è largo due byte: occupa gli spostamenti ' + p.o + ' e ' + (p.o + 1) + '. Il primo byte dopo il campo si trova allo spostamento ' + (p.o + 2) + '.',
        { calc: p.o + ' + 2 = ' + (p.o + 2), chiedi: { d: 'Il campo termina allo spostamento ' + (p.o + 2) + ' escluso, e i byte disponibili sono 6. Il campo è interamente disponibile?', o: ['Sì', 'No'], g: ok ? 0 : 1, no: ok ? 'Il campo occupa gli spostamenti ' + p.o + ' e ' + (p.o + 1) + ', entrambi minori di 6.' : 'Il campo richiede anche lo spostamento 6, e l’ultimo byte disponibile è allo spostamento 5.' } });
      risp[2] = ok ? 'sì' : 'no';
      if (!ok) {
        P({ dom: 2, male: true, valore: 'non leggibile' }, 1, 'Terza domanda: disponibilità dei byte', 'Il campo si estenderebbe fino allo spostamento 6, mentre i byte disponibili terminano al 5. Manca un byte, e la lettura si arresta quindi a questo punto. Nessun valore è calcolato e il cursore resta invariato.', { calc: p.o + ' + 2 ≤ 6 ?', esito: ['no', 'no'] });
        return { passi, esito: val };
      }
      P({ dom: 2 }, 1, 'Terza domanda: disponibilità dei byte', 'La somma di spostamento e larghezza è ' + (p.o + 2) + ', valore che rientra nei 6 byte disponibili. Il campo è completo e la lettura può proseguire.',
        Object.assign({ calc: p.o + ' + 2 ≤ 6 ?', esito: ['sì', 'si'] }, p.r === 'txt' ? {} : { chiedi: { d: 'Si leggono ' + H(a) + ' e ' + H(b) + ' come numero ' + NOME + '. Quale dei due byte ha il peso maggiore?', o: ['Il primo, ' + H(a), 'Il secondo, ' + H(b)], g: p.r === 'le' ? 1 : 0, no: p.r === 'le' ? 'In little-endian il byte all’indirizzo più basso è il meno significativo. Ha peso maggiore il secondo.' : 'In big-endian il byte all’indirizzo più basso è il più significativo. Ha peso maggiore il primo.' } }));
      risp[3] = p.r === 'txt' ? 'uno alla volta' : NOME;
      P({ dom: 3, pesa: p.r === 'le' ? p.o + 1 : p.r === 'be' ? p.o : null, pesi: p.r === 'txt' ? ['1°', '2°'] : p.r === 'le' ? ['× 1', '× 256'] : ['× 256', '× 1'] }, 2, 'Quarta domanda: ordine dei byte', p.r === 'txt'
        ? 'Nella lettura come testo ogni byte è un carattere a sé. I pesi sono estranei al calcolo, e i caratteri si leggono nell’ordine degli spostamenti.'
        : 'La regola è ' + NOME + ', quindi il byte ' + (p.r === 'le' ? 'allo spostamento più alto, ' + H(b) + ',' : 'allo spostamento più basso, ' + H(a) + ',') + ' è il più significativo e contribuisce con 256 volte il proprio valore.');
      risp[4] = val;
      P({ dom: 4, valore: val, pesi: p.r === 'txt' ? ['1°', '2°'] : p.r === 'le' ? ['× 1', '× 256'] : ['× 256', '× 1'] }, 2, 'Quinta domanda: significato', p.r === 'txt'
        ? 'Secondo la tabella ASCII, ' + H(a) + (C(a) === '·' ? ' è un comando privo di segno stampabile' : ' è il carattere «' + C(a) + '»') + ' e ' + H(b) + (C(b) === '·' ? ' è un comando privo di segno stampabile' : ' è il carattere «' + C(b) + '»') + '. I comandi sono rappresentati con un punto.'
        : 'Il numero vale ' + (p.r === 'le' ? b + ' × 256 + ' + a : a + ' × 256 + ' + b) + ', cioè ' + val + '. In esadecimale si scrive 0x' + (p.r === 'le' ? H(b).slice(2) + H(a).slice(2) : H(a).slice(2) + H(b).slice(2)) + '.',
        { calc: p.r === 'txt' ? H(a) + ' → «' + C(a) + '»   ' + H(b) + ' → «' + C(b) + '»' : (p.r === 'le' ? b + ' × 256 + ' + a : a + ' × 256 + ' + b) + ' = ' + val });
      P({ valore: val, pesi: p.r === 'le' ? ['× 256', '× 1'] : ['× 1', '× 256'] }, 2, 'La medesima coppia in un’altra lettura', p.r === 'txt'
        ? 'I medesimi due byte, interpretati come numero little-endian, varrebbero ' + (a + 256 * b) + '. I byte sono identici: il risultato dipende dalla regola dichiarata dal formato.'
        : 'Con la convenzione opposta, ' + (p.r === 'le' ? 'big-endian' : 'little-endian') + ', i medesimi due byte varrebbero ' + (p.r === 'le' ? 256 * a + b : a + 256 * b) + '. Nessuno dei due numeri è errato in sé, e soltanto il formato stabilisce quale sia quello inteso.', { calc: p.r === 'txt' ? b + ' × 256 + ' + a + ' = ' + (a + 256 * b) : (p.r === 'le' ? a + ' × 256 + ' + b + ' = ' + (256 * a + b) : b + ' × 256 + ' + a + ' = ' + (a + 256 * b)) });
      cur = p.o + 2;
      P({ valore: val }, 3, 'Avanzamento del cursore', 'Il campo è stato letto per intero. Il cursore avanza della larghezza del campo e si ferma allo spostamento ' + cur + (cur === 6 ? ', alla fine dei dati.' : ', pronto per il campo successivo.'), { calc: 'cursore: ' + p.o + ' + 2 = ' + cur });
      return { passi, esito: val };
    }
  },
  bilancio: {
    regola: [
      'Ogni campo si legge rispondendo a cinque domande: dove comincia, quanto è largo, se i byte sono tutti disponibili, in quale ordine vanno considerati, che cosa significano.',
      'La verifica di disponibilità precede il calcolo. Dopo la lettura il cursore avanza della larghezza del campo.'
    ],
    errori: [
      ['Calcolare prima di verificare.', 'Un valore ottenuto da byte mancanti ha l’apparenza di un valore valido pur essendo privo di fondamento. La terza domanda precede la quarta e la quinta.'],
      ['Presupporre l’ordine dei byte.', 'I medesimi due byte valgono 4660 oppure 13 330 secondo la convenzione. Il formato deve dichiararla.'],
      ['Far avanzare il cursore del valore letto.', 'Il cursore avanza della larghezza del campo, che in questo caso è 2, qualunque numero sia stato letto.']
    ],
    saFare: ['Elencare le cinque domande nell’ordine corretto.', 'Leggere due byte come numero nelle due convenzioni.', 'Riconoscere un campo non leggibile e motivarne la ragione.'],
    esercizi: [
      { d: 'Un campo di due byte contiene `10 02`, in quest’ordine, ed è un numero little-endian. Quanto vale in base dieci?', segnaposto: 'Un numero', giuste: ['528'],
        ok: 'Il secondo byte ha il peso maggiore: 2 × 256 + 16 = 528.',
        diagnosi: [
          { se: ['4098'], msg: 'Il peso maggiore è stato attribuito al primo byte, come in big-endian. In little-endian ha peso maggiore il secondo.' },
          { se: ['18'], msg: 'I due byte sono stati sommati. Il più significativo va dapprima moltiplicato per 256.' },
          { se: ['1002', '210', '0210'], msg: 'Le cifre esadecimali sono state accostate. È richiesto il valore in base dieci.' }
        ],
        altro: 'Il valore è diverso. Si stabilisca quale byte ha il peso maggiore, lo si moltiplichi per 256 e si aggiunga l’altro.',
        indizi: ['In little-endian il primo byte è il meno significativo.', '0x10 vale 16 e 0x02 vale 2.', 'Il numero è 2 × 256 + 16.'],
        svolgimento: ['Byte meno significativo: 0x10, cioè 16.', 'Byte più significativo: 0x02, cioè 2, con peso 256.', '2 × 256 + 16 = 512 + 16 = 528.'] },
      { d: 'Un lettore ha stabilito dove comincia un campo e quanto è largo. Qual è il passaggio successivo?', guida: 'Si scelga la risposta.', o: [
        { t: 'Calcolare il valore', fb: 'Il calcolo interviene alla quinta domanda. Occorre prima stabilire se i byte esistono e in quale ordine vanno considerati.' },
        { t: 'Verificare che i byte siano tutti disponibili', ok: true, fb: 'È la terza domanda. In caso di risposta negativa la lettura si arresta senza alcun calcolo.' },
        { t: 'Far avanzare il cursore', fb: 'Il cursore avanza al termine, quando il campo è stato letto per intero.' }] }
    ],
    sfida: ['lez03_01_same_bits_two_meanings', 'Interpretare una sequenza di bit']
  }
});
