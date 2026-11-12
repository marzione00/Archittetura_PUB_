'use strict';
SL.registra('1.3.5', {
  titolo: 'Un metodo per decodificare i dati',
  obiettivo: 'Alla fine saprai affrontare una fila di byte sconosciuta con cinque domande poste sempre nello stesso ordine, e leggere un campo di due byte senza sbagliare.',
  concetti: [['lente', 'Metodo'], ['puntatore', 'Cursore'], ['byte', 'Ordine dei byte']],
  filigrana: ['lente', 'byte', 'tabella'],
  richiami: {
    carte: [
      { sim: 'puntatore', da: 'Dall’unità 1.3.4', t: 'Campo, larghezza, cursore', d: 'Un campo occupa un certo numero di byte. Il cursore avanza di quella larghezza soltanto quando il campo è completo.' },
      { sim: 'memory', da: 'Dall’unità 1.2.3', t: 'L’ordine dei byte', d: 'In little-endian il byte meno significativo sta all’indirizzo più basso. In big-endian ci sta il più significativo.' },
      { sim: 'char', da: 'Dall’unità 1.2.4', t: 'Numero o carattere', d: 'Lo stesso byte 0x48 è il numero 72 oppure la lettera H, secondo la codifica dichiarata.' }
    ],
    domanda: { d: 'Prima di proseguire: i byte `34 12`, in quest’ordine, vengono letti come un numero little-endian. Quale byte pesa di più?', o: [
      { t: 'Il primo, 0x34', fb: 'In little-endian il primo byte è il meno significativo. Il peso maggiore va al secondo.' },
      { t: 'Il secondo, 0x12', ok: true, fb: 'Il numero è 0x1234: il byte all’indirizzo più alto è il più significativo.' },
      { t: 'Pesano uguale', fb: 'In un numero di due byte uno vale 256 volte l’altro.' }
    ] }
  },
  idea: {
    titolo: 'Cinque domande, sempre nello stesso ordine',
    termini: [],
    testo: [
      'In questo capitolo abbiamo letto immagini, caratteri, suoni e messaggi. Ogni volta i passi erano gli stessi, anche se i dati cambiavano. Conviene metterli in fila una volta per tutte, perché valgono per qualunque fila di byte, compresi i formati che incontrerai per la prima volta.',
      'La prima domanda è dove comincia il campo, cioè a quale spostamento. La risposta viene dal formato oppure dal cursore, che ricorda dove è finito il campo precedente.',
      'La seconda domanda è quanto è largo. Un carattere ASCII occupa un byte, un canale di colore uno, un campione di un CD due. La larghezza può essere fissata dal formato o dichiarata da un campo che precede.',
      'La terza domanda è se i byte ci sono tutti. Spostamento più larghezza deve restare entro i byte disponibili. È la validazione dell’unità 1.3.4, e viene prima di qualunque calcolo: un valore ricavato da byte che non esistono è peggio di nessun valore.',
      'La quarta domanda riguarda l’ordine, e conta per i numeri che occupano più di un byte. Gli stessi due byte danno due numeri diversi in little-endian e in big-endian.',
      'La quinta domanda è che cosa significano quei byte: un numero, un carattere, un colore. Soltanto a questo punto si calcola il valore. Poi il cursore avanza della larghezza del campo, e si ricomincia dalla prima domanda.',
      { fig: 'scena', w: 700, h: 76, titolo: 'Le cinque domande', nota: 'L’ordine conta: la disponibilità si verifica prima di calcolare, il significato si decide per ultimo.', els: [
        SL.el.box('q1', 0, 6, 128, 60, '1', 'dove', 'on', { cls: 'stretta' }), SL.el.box('q2', 143, 6, 128, 60, '2', 'quanto', 'on', { cls: 'stretta' }), SL.el.box('q3', 286, 6, 128, 60, '3', 'ci sono', 'att', { cls: 'stretta' }),
        SL.el.box('q4', 429, 6, 128, 60, '4', 'che ordine', 'on', { cls: 'stretta' }), SL.el.box('q5', 572, 6, 128, 60, '5', 'che cosa', 'on', { cls: 'stretta' }),
        SL.el.linea('a', 128, 36, 143, 36, 'on'), SL.el.linea('b', 271, 36, 286, 36, 'on'), SL.el.linea('c', 414, 36, 429, 36, 'on'), SL.el.linea('d', 557, 36, 572, 36, 'on')] },
      'Saltare una domanda produce errori tipici. Chi dimentica la terza legge oltre la fine dei dati. Chi dimentica la quarta ottiene un numero plausibile e sbagliato, che è l’errore più difficile da scoprire.'
    ]
  },
  esperimento: {
    faremo: [
      'Abbiamo sei byte e nessun’altra informazione. Sceglierai uno spostamento e una regola di lettura, e applicheremo le cinque domande a un campo di due byte.',
      'Prova anche lo spostamento 5: lì il campo comincia sull’ultimo byte disponibile, e la terza domanda ferma tutto.'
    ],
    vedrai: [
      ['memory', 'I sei byte', 'A sinistra, in esadecimale, con il cursore sotto.'],
      ['lente', 'Le cinque domande', 'A destra. Ogni domanda riceve la sua risposta, dall’alto verso il basso.'],
      ['tabella', 'Il valore', 'In basso a sinistra, quando tutte le domande avranno avuto risposta.']
    ]
  },
  lab: {
    titolo: 'Leggere un campo di due byte',
    scena: { w: 860, h: 300 },
    atti: ['I byte', 'Dove, quanto, ci sono', 'Che ordine, che cosa', 'Il cursore avanza'],
    nota: 'Se i byte non ci sono tutti la lettura si ferma alla terza domanda, e i passi sono meno.',
    controlli: [
      { id: 'o', tipo: 'num', eti: 'Spostamento', min: 0, max: 5, salti: [1], valore: 2 },
      { id: 'r', tipo: 'scelta', eti: 'Lettura', opzioni: [['le', 'Numero little-endian'], ['be', 'Numero big-endian'], ['txt', 'Testo ASCII']], valore: 'le' }
    ],
    previsione: {
      domanda: (p) => 'I sei byte sono 48 69 34 12 01 00. Leggiamo un campo di due byte allo spostamento ' + p.o + ', come ' + ({ le: 'numero little-endian', be: 'numero big-endian', txt: 'testo ASCII' })[p.r] + '. Che cosa otteniamo?',
      opzioni: (p) => { const B = [0x48, 0x69, 0x34, 0x12, 0x01, 0x00]; const C = (v) => (v >= 32 && v < 127 ? String.fromCharCode(v) : '·'); if (p.o > 4) return ['non leggibile', String(B[5]), String(B[4] + 256 * B[5])]; const a = B[p.o], b = B[p.o + 1]; return [String(a + 256 * b), String(256 * a + b), C(a) + C(b), 'non leggibile']; }
    },
    confronto: (pred, esito, p) => 'Avevi previsto «' + pred + '». Il risultato è «' + esito + '». ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'non leggibile' ? 'Allo spostamento 5 resta un byte solo, e il campo ne chiede due.' : pred === 'non leggibile' ? 'Il campo finisce entro i sei byte disponibili, quindi si può leggere.' : p.r === 'txt' ? 'Con la lettura come testo ogni byte è un carattere a sé, senza pesi.' : 'Hai usato l’ordine opposto: in ' + (p.r === 'le' ? 'little-endian pesa di più il secondo byte.' : 'big-endian pesa di più il primo byte.')),
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
      const DOM = ['dove comincia', 'quanto è largo', 'i byte ci sono', 'in che ordine', 'che cosa significa'];
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

      P({}, 0, 'Sei byte senza etichette', 'Abbiamo sei byte: 48, 69, 34, 12, 01, 00. Da soli non dicono che cosa rappresentano. Applichiamo le cinque domande a un campo di due byte.');
      risp[0] = 'spost. ' + p.o;
      P({ dom: 0 }, 1, 'Prima domanda: dove comincia', 'Il campo comincia allo spostamento ' + p.o + '. Il cursore si porta su quel byte.', { calc: 'inizio = ' + p.o });
      risp[1] = '2 byte'; campo = true;
      P({ dom: 1 }, 1, 'Seconda domanda: quanto è largo', 'Il campo è largo due byte: occupa gli spostamenti ' + p.o + ' e ' + (p.o + 1) + '. Il primo byte dopo il campo si trova allo spostamento ' + (p.o + 2) + '.',
        { calc: p.o + ' + 2 = ' + (p.o + 2), chiedi: { d: 'Il campo finisce allo spostamento ' + (p.o + 2) + ' escluso, e i byte disponibili sono 6. Il campo è tutto disponibile?', o: ['Sì', 'No'], g: ok ? 0 : 1, no: ok ? 'Il campo occupa gli spostamenti ' + p.o + ' e ' + (p.o + 1) + ', entrambi minori di 6.' : 'Il campo chiede anche lo spostamento 6, e l’ultimo byte disponibile è allo spostamento 5.' } });
      risp[2] = ok ? 'sì' : 'no';
      if (!ok) {
        P({ dom: 2, male: true, valore: 'non leggibile' }, 1, 'Terza domanda: i byte ci sono', 'Il campo arriverebbe allo spostamento 6 e i byte disponibili finiscono al 5. Manca un byte, quindi la lettura si ferma qui. Nessun valore viene calcolato e il cursore resta dov’era.', { calc: p.o + ' + 2 ≤ 6 ?', esito: ['no', 'no'] });
        return { passi, esito: val };
      }
      P({ dom: 2 }, 1, 'Terza domanda: i byte ci sono', 'Spostamento più larghezza dà ' + (p.o + 2) + ', che rientra nei 6 byte disponibili. Il campo è completo e si può proseguire.',
        Object.assign({ calc: p.o + ' + 2 ≤ 6 ?', esito: ['sì', 'si'] }, p.r === 'txt' ? {} : { chiedi: { d: 'Leggiamo ' + H(a) + ' e ' + H(b) + ' come numero ' + NOME + '. Quale dei due byte pesa di più?', o: ['Il primo, ' + H(a), 'Il secondo, ' + H(b)], g: p.r === 'le' ? 1 : 0, no: p.r === 'le' ? 'In little-endian il byte all’indirizzo più basso è il meno significativo. Pesa di più il secondo.' : 'In big-endian il byte all’indirizzo più basso è il più significativo. Pesa di più il primo.' } }));
      risp[3] = p.r === 'txt' ? 'uno alla volta' : NOME;
      P({ dom: 3, pesa: p.r === 'le' ? p.o + 1 : p.r === 'be' ? p.o : null, pesi: p.r === 'txt' ? ['1°', '2°'] : p.r === 'le' ? ['× 1', '× 256'] : ['× 256', '× 1'] }, 2, 'Quarta domanda: in che ordine', p.r === 'txt'
        ? 'Nella lettura come testo ogni byte è un carattere a sé. I pesi restano fuori dal conto, e i caratteri si leggono nell’ordine degli spostamenti.'
        : 'La regola è ' + NOME + ', quindi il byte ' + (p.r === 'le' ? 'allo spostamento più alto, ' + H(b) + ',' : 'allo spostamento più basso, ' + H(a) + ',') + ' è il più significativo e vale 256 volte il suo valore.');
      risp[4] = val;
      P({ dom: 4, valore: val, pesi: p.r === 'txt' ? ['1°', '2°'] : p.r === 'le' ? ['× 1', '× 256'] : ['× 256', '× 1'] }, 2, 'Quinta domanda: che cosa significa', p.r === 'txt'
        ? 'Secondo la tabella ASCII, ' + H(a) + (C(a) === '·' ? ' è un comando senza segno stampabile' : ' è il carattere «' + C(a) + '»') + ' e ' + H(b) + (C(b) === '·' ? ' è un comando senza segno stampabile' : ' è il carattere «' + C(b) + '»') + '. I comandi sono mostrati con un punto.'
        : 'Il numero vale ' + (p.r === 'le' ? b + ' × 256 + ' + a : a + ' × 256 + ' + b) + ', cioè ' + val + '. In esadecimale si scrive 0x' + (p.r === 'le' ? H(b).slice(2) + H(a).slice(2) : H(a).slice(2) + H(b).slice(2)) + '.',
        { calc: p.r === 'txt' ? H(a) + ' → «' + C(a) + '»   ' + H(b) + ' → «' + C(b) + '»' : (p.r === 'le' ? b + ' × 256 + ' + a : a + ' × 256 + ' + b) + ' = ' + val });
      P({ valore: val, pesi: p.r === 'le' ? ['× 256', '× 1'] : ['× 1', '× 256'] }, 2, 'La stessa coppia, letta in un altro modo', p.r === 'txt'
        ? 'Gli stessi due byte, presi per un numero little-endian, varrebbero ' + (a + 256 * b) + '. I byte sono identici: a cambiare il risultato è la regola dichiarata dal formato.'
        : 'Con la convenzione opposta, ' + (p.r === 'le' ? 'big-endian' : 'little-endian') + ', gli stessi due byte varrebbero ' + (p.r === 'le' ? 256 * a + b : a + 256 * b) + '. Nessuno dei due numeri è sbagliato in sé, e soltanto il formato dice quale sia quello voluto.', { calc: p.r === 'txt' ? b + ' × 256 + ' + a + ' = ' + (a + 256 * b) : (p.r === 'le' ? a + ' × 256 + ' + b + ' = ' + (256 * a + b) : b + ' × 256 + ' + a + ' = ' + (a + 256 * b)) });
      cur = p.o + 2;
      P({ valore: val }, 3, 'Il cursore avanza', 'Il campo è stato letto per intero. Il cursore avanza della sua larghezza e si ferma allo spostamento ' + cur + (cur === 6 ? ', alla fine dei dati.' : ', pronto per il campo successivo.'), { calc: 'cursore: ' + p.o + ' + 2 = ' + cur });
      return { passi, esito: val };
    }
  },
  bilancio: {
    regola: [
      'Ogni campo si legge con cinque domande: dove comincia, quanto è largo, se i byte ci sono tutti, in che ordine vanno presi, che cosa significano.',
      'La verifica di disponibilità viene prima del calcolo. Dopo la lettura il cursore avanza della larghezza del campo.'
    ],
    errori: [
      ['Calcolare prima di verificare.', 'Un valore ottenuto da byte mancanti sembra valido e non lo è. La terza domanda viene prima della quarta e della quinta.'],
      ['Dare per scontato l’ordine dei byte.', 'Gli stessi due byte valgono 4660 oppure 13 330 secondo la convenzione. Il formato deve dichiararla.'],
      ['Far avanzare il cursore del valore letto.', 'Il cursore avanza della larghezza del campo, che qui è 2, qualunque numero sia stato letto.']
    ],
    saFare: ['Elenco le cinque domande nell’ordine giusto.', 'Leggo due byte come numero nelle due convenzioni.', 'Riconosco quando un campo non si può leggere e spiego perché.'],
    esercizi: [
      { d: 'Un campo di due byte contiene `10 02`, in quest’ordine, ed è un numero little-endian. Quanto vale in base dieci?', segnaposto: 'Un numero', giuste: ['528'],
        ok: 'Il secondo byte pesa di più: 2 × 256 + 16 = 528.',
        diagnosi: [
          { se: ['4098'], msg: 'Hai dato il peso maggiore al primo byte, come in big-endian. In little-endian pesa di più il secondo.' },
          { se: ['18'], msg: 'Hai sommato i due byte. Il più significativo va prima moltiplicato per 256.' },
          { se: ['1002', '210', '0210'], msg: 'Hai accostato le cifre esadecimali. La domanda chiede il valore in base dieci.' }
        ],
        altro: 'Il valore è diverso. Stabilisci quale byte pesa di più, moltiplicalo per 256 e aggiungi l’altro.',
        indizi: ['In little-endian il primo byte è il meno significativo.', '0x10 vale 16 e 0x02 vale 2.', 'Il numero è 2 × 256 + 16.'],
        svolgimento: ['Byte meno significativo: 0x10, cioè 16.', 'Byte più significativo: 0x02, cioè 2, con peso 256.', '2 × 256 + 16 = 512 + 16 = 528.'] },
      { d: 'Un lettore ha stabilito dove comincia un campo e quanto è largo. Qual è la mossa successiva?', guida: 'Scegli la risposta.', o: [
        { t: 'Calcolare il valore', fb: 'Il calcolo arriva alla quinta domanda. Prima bisogna sapere se i byte esistono e in che ordine vanno presi.' },
        { t: 'Verificare che i byte ci siano tutti', ok: true, fb: 'È la terza domanda. Se la risposta è no, la lettura si ferma senza calcolare nulla.' },
        { t: 'Far avanzare il cursore', fb: 'Il cursore avanza alla fine, quando il campo è stato letto per intero.' }] }
    ],
    sfida: ['lez03_01_same_bits_two_meanings', 'Interpretare una sequenza di bit']
  }
});
