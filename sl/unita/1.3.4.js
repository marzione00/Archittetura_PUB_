'use strict';
SL.registra('1.3.4', {
  titolo: 'Formati binari, validazione e contesto',
  obiettivo: 'Obiettivo: leggere un messaggio composto di campi, e motivare il confronto fra una lunghezza dichiarata e i byte effettivamente ricevuti prima del suo impiego.',
  concetti: [['tabella', 'Campo'], ['puntatore', 'Cursore'], ['scudo', 'Validazione']],
  filigrana: ['scudo', 'tabella', 'file'],
  richiami: {
    carte: [
      { sim: 'pixel', da: 'Dalle unità 1.3.1 e 1.3.3', t: 'I soli byte sono insufficienti', d: 'La rilettura di un’immagine o di un suono richiede dati ulteriori: la larghezza, la frequenza, il numero di canali.' },
      { sim: 'char', da: 'Dall’unità 1.2.4', t: 'I codici ASCII', d: 'Le lettere maiuscole hanno codici da 65 a 90: la P è 0x50, la N è 0x4E, la G è 0x47.' },
      { sim: 'puntatore', da: 'Dall’unità 1.1.2', t: 'Lo spostamento', d: 'La posizione di un byte si indica con la distanza dal primo, che ha spostamento zero.' }
    ],
    domanda: { d: 'Prima di proseguire: un programma riceve i byte di un suono senza conoscere la frequenza di campionamento. Che cosa gli manca?', o: [
      { t: 'Nulla, i byte sono sufficienti', fb: 'I medesimi byte, riprodotti con una frequenza diversa, producono un suono accelerato o rallentato.' },
      { t: 'Una parte dell’accordo', ok: true, fb: 'La frequenza fa parte dell’accordo fra chi scrive e chi legge. In sua assenza i byte restano numeri privi di significato.' },
      { t: 'Altri byte del suono', fb: 'I campioni sono tutti presenti. Manca l’informazione necessaria a interpretarli.' }
    ] }
  },
  idea: {
    titolo: 'Il file dichiara, il lettore verifica',
    termini: ['campo', 'larghezza', 'intestazione', 'firma', 'validazione', 'cursore'],
    testo: [
      'Nelle unità precedenti alcune informazioni restavano esterne ai dati: la larghezza dell’immagine, la frequenza del suono. Un formato completo le colloca all’interno del file, e stabilisce quali dati compaiano, in quale ordine e con quanti byte ciascuno. Ogni dato prende il nome di [[campo]], e il numero di byte che esso occupa è la sua [[larghezza]].',
      'Molti formati cominciano con un’[[intestazione]], cioè con un gruppo di campi che descrive quanto segue. L’intestazione di un’immagine dichiara larghezza e altezza in pixel; quella di un suono dichiara frequenza, profondità e canali.',
      'Spesso i primi byte costituiscono una [[firma]] che identifica il formato. Ogni immagine PNG comincia con i byte `89 50 4E 47`, e gli ultimi tre sono le lettere P, N, G in ASCII. Ogni documento PDF comincia con `25 50 44 46`, cioè con i caratteri «%PDF». Il nome del file e la relativa estensione sono soltanto un’indicazione esterna, mentre la firma appartiene al contenuto.',
      'I dati di lunghezza variabile, come un testo, sono di norma preceduti da un campo che ne dichiara la lunghezza, per esempio «seguono 4 byte». Letto tale numero, il lettore conosce il punto in cui termina il dato e comincia il campo successivo.',
      { fig: 'celle', titolo: 'Un messaggio con tipo, lunghezza e contenuto', nota: 'Il primo campo indica che il contenuto è un testo, il secondo che è lungo quattro byte.', celle: [
        { so: 'tipo', v: '01', st: 'amb', gi: 'byte 0' }, { so: 'lunghezza', v: '04', st: 'amb', gi: 'byte 1' }, { so: 'contenuto', v: 'S', st: 'on', gi: 'byte 2' }, { so: '', v: 'A', st: 'on', gi: 'byte 3' }, { so: '', v: 'L', st: 'on', gi: 'byte 4' }, { so: '', v: 'U', st: 'on', gi: 'byte 5' }] },
      'Una lunghezza dichiarata è un’affermazione, che può risultare falsa. Il file può essere giunto incompleto, oppure può essere stato costruito deliberatamente per indurre in errore il programma. Prima di leggere il contenuto, il lettore confronta la lunghezza dichiarata con i byte effettivamente disponibili. Tale controllo prende il nome di [[validazione]].',
      'Per tenere traccia del punto raggiunto, il lettore mantiene un [[cursore]], cioè il numero del prossimo byte da leggere. Quando un campo è accettato il cursore avanza della larghezza del campo. Quando è rifiutato il cursore resta fermo e il lettore segnala l’errore.',
      'Un lettore che omette la validazione legge oltre la fine dei dati ricevuti e considera valido quanto trova in memoria nelle celle successive. Numerosi difetti di sicurezza, fra i più gravi mai individuati, hanno avuto questa origine.'
    ]
  },
  esperimento: {
    faremo: [
      'Un lettore riceve un messaggio composto di tre campi: un byte di tipo, un byte di lunghezza e il contenuto. I controlli fissano la lunghezza dichiarata e il numero dei byte di contenuto effettivamente giunti.',
      'Il cursore è seguito campo per campo. Il passaggio decisivo è il confronto fra la lunghezza dichiarata e i byte rimasti. Dopo il caso proposto, è istruttivo dichiarare più byte di quelli giunti.'
    ],
    vedrai: [
      ['memory', 'Il messaggio ricevuto', 'In alto: i soli byte effettivamente giunti.'],
      ['puntatore', 'Il cursore', 'La barra sotto i byte, che indica il prossimo byte da leggere.'],
      ['scudo', 'Il controllo', 'In basso: la lunghezza dichiarata, i byte rimasti e l’esito del confronto.']
    ]
  },
  lab: {
    titolo: 'Un campo con la lunghezza dichiarata',
    scena: { w: 860, h: 300 },
    atti: ['Il messaggio', 'I campi di larghezza fissa', 'La validazione', 'L’esito'],
    nota: 'Il numero di passi dipende dai dati: un campo accettato viene consumato un byte alla volta.',
    controlli: [
      { id: 'L', tipo: 'num', eti: 'Lunghezza dichiarata', min: 0, max: 6, salti: [1], valore: 4 },
      { id: 'R', tipo: 'num', eti: 'Byte di contenuto ricevuti', min: 0, max: 6, salti: [1], valore: 5 }
    ],
    previsione: {
      domanda: (p) => 'Il messaggio ricevuto contiene ' + (2 + p.R) + ' byte: due di intestazione e ' + p.R + ' di contenuto. Il campo lunghezza dichiara ' + p.L + '. Su quale byte si troverà il cursore al termine della lettura?',
      opzioni: (p) => { const s = new Set([p.L <= p.R ? 2 + p.L : 2, 2, 2 + p.L, 2 + p.R, 0]); return Array.from(s).sort((a, b) => a - b); }
    },
    confronto: (pred, esito, p) => 'La previsione indicava il cursore sul byte ' + pred + '. Si è fermato sul byte ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.L > p.R ? 'Il campo dichiara ' + p.L + ' byte e ne sono giunti ' + p.R + '. Il lettore lo rifiuta e il cursore resta dopo l’intestazione.' : 'Il campo è stato accettato, e il cursore avanza quindi di ' + p.L + ' oltre i due byte di intestazione. I byte ricevuti in eccesso appartengono al campo successivo.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const TESTO = 'SALUTI'.split('');
      const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
      const tot = 2 + p.R, ok = p.L <= p.R;
      let cur = 0, letti = 0, dich = null;
      const quadro = (o) => {
        o = o || {};
        const els = [el.nota('t1', 40, 0, 'IL MESSAGGIO RICEVUTO · ' + tot + ' BYTE', 'mono')];
        for (let k = 0; k < tot; k++) els.push(el.cella('m' + k, 40 + k * 90, 46, 80, 58, k === 0 ? '0x01' : k === 1 ? H(p.L) : TESTO[k - 2], o.att === k ? 'att' : k < cur ? 'on' : '', { piccola: true, so: 'byte ' + k, gi: k === 0 ? 'tipo' : k === 1 ? 'lunghezza' : null }));
        if (o.oltre) for (let k = tot; k < 2 + p.L; k++) els.push(el.cella('x' + k, 40 + k * 90, 46, 80, 58, '?', 'err', { piccola: true, so: 'byte ' + k, gi: 'mai ricevuto' }));
        els.push(el.cursore('cu', 40 + cur * 90, 136, 80));
        els.push(el.box('b1', 40, 196, 230, 76, 'lunghezza dichiarata', dich === null ? '·' : String(dich), o.box === 1 ? 'att' : '', { sim: 'tabella', riga: true }));
        els.push(el.box('b2', 300, 196, 230, 76, 'byte rimasti', dich === null ? '·' : String(tot - cur), o.box === 2 ? 'att' : '', { sim: 'memory', riga: true }));
        els.push(el.box('b3', 560, 196, 270, 76, 'esito', o.esito || '·', o.esito ? (o.male ? 'err' : 'on') : '', { sim: 'scudo', riga: true }));
        return els;
      };
      const hud = () => [['Cursore', 'byte ' + cur, 'a'], ['Lunghezza dichiarata', dich === null ? '·' : dich], ['Byte del campo letti', letti, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({}, 0, 'Ricezione del messaggio', 'Il lettore ha ricevuto ' + tot + ' byte, il cui contenuto è ancora ignoto. Il cursore è sul byte 0. Il formato stabilisce che il messaggio comincia con due campi larghi un byte: il tipo e la lunghezza.');
      P({ box: 2 }, 1, 'L’intestazione è completa', 'Anche i campi di larghezza fissa vanno verificati. L’intestazione richiede due byte e il lettore ne ha ricevuti ' + tot + ', e può quindi leggerla.', { calc: '2 ≤ ' + tot + ' ?', esito: ['sì', 'si'] });
      cur = 1;
      P({ att: 0 }, 1, 'Il campo tipo', 'Il primo byte vale 0x01, che in questo formato significa «testo». Il campo è largo un byte, e il cursore avanza quindi di uno.', { calc: 'cursore: 0 + 1 = 1' });
      cur = 2; dich = p.L;
      P({ att: 1, box: 1 }, 1, 'Il campo lunghezza', 'Il secondo byte vale ' + H(p.L) + ': il messaggio dichiara un contenuto di ' + p.L + ' byte. Il cursore avanza di uno e si ferma sul byte 2, dove il contenuto dovrebbe cominciare.',
        { calc: 'cursore: 1 + 1 = 2', chiedi: { d: 'Il campo dichiara ' + p.L + ' byte. Dopo il cursore ne restano ' + p.R + '. Il lettore può consumare il contenuto?', o: ['Sì, i byte sono tutti disponibili', 'No, ne mancano'], g: ok ? 0 : 1, no: ok ? 'I byte rimasti sono ' + p.R + ' e ne occorrono ' + p.L + ': sono sufficienti.' : 'I byte rimasti sono ' + p.R + ' e ne occorrono ' + p.L + ': ne mancano ' + (p.L - p.R) + '.' } });
      P({ box: 2, esito: ok ? 'campo accettato' : 'campo rifiutato', male: !ok }, 2, 'Il confronto', 'Prima di accedere al contenuto, il lettore confronta la lunghezza dichiarata con i byte rimasti dopo il cursore. ' + (ok ? 'Ne occorrono ' + p.L + ' e ne sono disponibili ' + p.R + ', e il campo può quindi essere letto per intero.' : 'Ne occorrono ' + p.L + ' e ne sono disponibili ' + p.R + ', e il campo è quindi incompleto.'),
        { calc: p.L + ' ≤ ' + p.R + ' ?', esito: [ok ? 'sì' : 'no', ok ? 'si' : 'no'] });
      if (ok) {
        for (let k = 0; k < p.L; k++) {
          const o = { att: cur, esito: 'campo accettato' }; const q = quadro(o); letti++; cur++;
          passi.push({ atto: 3, titolo: 'Byte ' + (k + 1) + ' di ' + p.L + ' del contenuto', testo: 'Il lettore consuma il carattere «' + TESTO[k] + '» e il cursore avanza sul byte ' + cur + '.', calc: 'cursore: ' + (cur - 1) + ' + 1 = ' + cur, hud: hud(), els: q });
        }
        P({ esito: 'campo accettato' }, 3, 'Il campo è stato consumato', (p.L === 0 ? 'Il contenuto dichiarato è lungo zero byte, e il campo è quindi completo senza ulteriori letture. ' : 'Il contenuto letto è «' + TESTO.slice(0, p.L).join('') + '». ') + 'Il cursore è sul byte ' + cur + (p.R > p.L ? ', e ' + (p.R - p.L === 1 ? 'il byte rimasto appartiene' : 'i ' + (p.R - p.L) + ' byte rimasti appartengono') + ' al campo successivo.' : ', alla fine del messaggio.'), { calc: 'cursore finale = 2 + ' + p.L + ' = ' + cur });
      } else {
        P({ esito: 'campo rifiutato', male: true, oltre: true }, 3, 'Un lettore privo di validazione', 'Un lettore privo di validazione leggerebbe ' + p.L + ' byte a partire dal cursore. ' + (p.L - p.R === 1 ? 'L’ultimo cadrebbe' : 'Gli ultimi ' + (p.L - p.R) + ' cadrebbero') + ' oltre la fine dei dati ricevuti, su celle di memoria che contengono altri dati.', { calc: 'byte mai ricevuti: ' + p.L + ' − ' + p.R + ' = ' + (p.L - p.R) });
        P({ esito: 'campo rifiutato', male: true }, 3, 'Il lettore con validazione si arresta', 'Il campo viene rifiutato e nessun byte del contenuto viene consumato. Il cursore resta sul byte 2 e il lettore segnala che il messaggio è incompleto.', { calc: 'cursore finale = 2' });
      }
      return { passi, esito: cur };
    }
  },
  bilancio: {
    regola: [
      'Un formato elenca i campi di un file: quali sono, in che ordine, con quale larghezza. L’intestazione descrive i dati che seguono.',
      'Una lunghezza dichiarata va confrontata con i byte effettivamente disponibili. Il cursore avanza soltanto quando il campo è completo.'
    ],
    errori: [
      ['Accettare senza verifica la lunghezza dichiarata.', 'Il numero scritto nel file può essere errato o falso. Fa fede soltanto quanto è stato effettivamente ricevuto.'],
      ['Accettare senza verifica l’estensione.', 'Il nome di un file può essere modificato liberamente. Il formato si riconosce dai primi byte del contenuto.'],
      ['Far avanzare il cursore su un campo rifiutato.', 'Dopo un rifiuto il cursore resta invariato, poiché altrimenti la lettura successiva partirebbe da un punto privo di significato.']
    ],
    saFare: ['Riconoscere i campi di un messaggio e la loro larghezza.', 'Confrontare una lunghezza dichiarata con i byte disponibili.', 'Indicare la posizione del cursore dopo un campo accettato e dopo un campo rifiutato.'],
    esercizi: [
      { d: 'Un lettore ha ricevuto 10 byte e ne ha già consumati 4. Il campo successivo dichiara una lunghezza di 7. Quanti byte mancano per poterlo leggere?', segnaposto: 'Un numero di byte', giuste: ['1', 'uno'],
        ok: 'Restano 10 − 4 = 6 byte e ne occorrono 7.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Sei sono i byte rimasti. È richiesto il numero dei byte mancanti per raggiungere i 7 dichiarati.' },
          { se: ['3', 'tre'], msg: 'I byte consumati sono stati sottratti dalla lunghezza dichiarata. Vanno calcolati dapprima i byte rimasti, da confrontare poi con 7.' },
          { se: ['0', 'zero'], msg: 'I byte rimasti sono meno di quelli dichiarati, e il campo è quindi incompleto.' }
        ],
        altro: 'Il numero è diverso. Si calcoli quanti byte restano dopo il cursore e li si confronti con la lunghezza dichiarata.',
        indizi: ['Il cursore è sul byte 4.', 'I byte rimasti sono 10 − 4.', 'Ne occorrono 7 e ne sono disponibili 6.'],
        svolgimento: ['Byte rimasti: 10 − 4 = 6.', 'Byte dichiarati: 7.', 'Byte mancanti: 7 − 6 = 1. Il campo va rifiutato.'] },
      { d: 'Un file si chiama foto.png e comincia con i byte `25 50 44 46`, cioè con i caratteri «%PDF». Che cosa contiene?', guida: 'Si scelga la risposta.', o: [
        { t: 'Un’immagine PNG', fb: 'Un’immagine PNG comincia con i byte 89 50 4E 47. Il nome del file può essere stato cambiato.' },
        { t: 'Un documento PDF con un nome ingannevole', ok: true, fb: 'La firma appartiene al contenuto e identifica un PDF, qualunque sia il nome del file.' },
        { t: 'Impossibile stabilirlo', fb: 'I primi byte sono una firma riconoscibile, e bastano a identificare il formato.' }] }
    ],
    sfida: ['lez03_05_multi_interpretation', 'Formato e interpretazione dei dati']
  }
});
