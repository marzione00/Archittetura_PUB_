'use strict';
SL.registra('2.5.3', {
  titolo: 'I/O tramite descrittori di file',
  obiettivo: 'Alla fine saprai usare i valori restituiti da read e da write: quanti byte passare alla scrittura, e come proseguire quando la scrittura si ferma prima.',
  concetti: [['file', 'Descrittori'], ['memory', 'Il buffer'], ['puntatore', 'Trasferimenti parziali']],
  filigrana: ['file', 'memory', 'puntatore'],
  richiami: {
    carte: [
      { sim: 'gate', da: 'Dall’unità 2.5.1', t: 'Il servizio write', d: 'Numero 1. Riceve il descrittore in RDI, l’indirizzo dei byte in RSI e il loro numero in RDX. Restituisce in RAX i byte scritti.' },
      { sim: 'input', da: 'Dalle unità 1.1.1 e 1.7.6', t: 'Canali standard', d: 'Alla partenza un programma trova già aperti un ingresso, da cui leggere, e un’uscita, su cui scrivere.' },
      { sim: 'puntatore', da: 'Dall’unità 2.3.5', t: 'Puntatore', d: 'Un valore che contiene un indirizzo. Sommandogli un numero di byte lo si fa avanzare nella memoria.' }
    ],
    domanda: { d: 'Prima di proseguire: che cosa contiene RAX dopo una chiamata a write andata a buon fine?', o: [
      { t: 'Il numero di byte scritti', ok: true, fb: 'Il kernel scrive in RAX quanti byte ha davvero consegnato.' },
      { t: 'Il numero del servizio, cioè 1', fb: 'Quello è il contenuto di RAX prima di SYSCALL. Al ritorno il kernel lo ha sostituito con il risultato.' },
      { t: 'L’indirizzo del messaggio', fb: 'L’indirizzo sta in RSI. In RAX torna il numero di byte scritti.' }
    ] }
  },
  idea: {
    titolo: 'Il kernel dice quanti byte, il programma deve ascoltare',
    termini: ['descrittore di file', 'buffer', 'trasferimento parziale'],
    testo: [
      'Per il kernel un file aperto, il terminale e perfino un collegamento di rete sono la stessa cosa: un canale da cui leggere o su cui scrivere byte. Il programma indica ciascun canale con un numero piccolo, il [[descrittore di file]]. Tre descrittori sono già aperti alla partenza: lo 0 è l’ingresso standard, l’1 è l’uscita standard, il 2 è l’uscita riservata ai messaggi di errore. Gli altri si ottengono aprendo un file.',
      'I servizi fondamentali sono due, read e write, con i numeri 0 e 1. Ricevono gli stessi tre argomenti: il descrittore, l’indirizzo di una zona di memoria, un numero di byte. La zona di memoria che fa da deposito temporaneo si chiama [[buffer]]. Il servizio read la riempie con i byte letti, il servizio write ne preleva i byte da scrivere.',
      'Il terzo argomento è un massimo. Entrambi i servizi restituiscono il numero di byte davvero trasferiti, che può essere più piccolo: è un [[trasferimento parziale]]. Una lettura si ferma prima se il file sta finendo, o se dal terminale è arrivata una riga corta. Una scrittura si ferma prima se la destinazione è momentaneamente piena.',
      { fig: 'celle', titolo: 'Un buffer di otto byte dopo una lettura che ne ha restituiti cinque', nota: 'Le prime cinque celle contengono i byte letti. Le ultime tre contengono ciò che c’era prima, e non vanno usate.', celle: [
        { so: '0x7000', v: 'L', st: 'on' }, { so: '0x7001', v: 'I', st: 'on' }, { so: '0x7002', v: 'N', st: 'on' }, { so: '0x7003', v: 'U', st: 'on' }, { so: '0x7004', v: 'X', st: 'on' }, { so: '0x7005', v: '?', st: '' }, { so: '0x7006', v: '?', st: '' }, { so: '0x7007', v: '?', st: '' }] },
      'Quando una lettura restituisce 0, il file è finito. È il segnale con cui un programma capisce di avere letto tutto.',
      'Un programma corretto si fida soltanto del valore restituito. Dopo una lettura passa alla scrittura il numero ricevuto, perché le celle del buffer oltre quel punto contengono byte vecchi. Dopo una scrittura parziale ripete la chiamata per i byte rimasti: fa avanzare l’indirizzo di quanti byte sono stati scritti e riduce il conteggio della stessa quantità.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma copia dati da un file all’uscita standard, usando un buffer di 8 byte che comincia a 0x7000. Sceglierai quanti byte restano nel file e quanti l’uscita ne accetta alla prima scrittura.',
      'Seguiremo una lettura e la scrittura che la segue, guardando ogni volta il valore restituito in RAX. Dopo il caso proposto, scegli un’uscita che accetti tutti i byte e confronta il numero di passi.'
    ],
    vedrai: [
      ['file', 'Il file e l’uscita', 'In alto i byte che restano nel file, in basso quelli già arrivati all’uscita.'],
      ['memory', 'Il buffer', 'Al centro: le otto celle del buffer con i loro indirizzi, e un segno sotto la cella indicata da RSI.'],
      ['register', 'I registri', 'A destra: RAX, RSI e RDX, e il numero di byte ancora da scrivere.']
    ]
  },
  lab: {
    titolo: 'Una lettura, una scrittura, e ciò che resta',
    scena: { w: 860, h: 372 },
    atti: ['La lettura', 'La scrittura', 'Il resto', 'Tre numeri'],
    controlli: [
      { id: 'cap', tipo: 'scelta', eti: 'Byte rimasti nel file', opzioni: [[3, '3'], [5, '5'], [8, '8'], [12, '12']], valore: 5 },
      { id: 'out', tipo: 'scelta', eti: 'Byte accettati dall’uscita', opzioni: [[2, '2'], [5, '5'], [8, '8']], valore: 2 }
    ],
    nota: 'Il numero di passi dipende dai dati: se la prima scrittura è completa, nulla resta da ripetere.',
    previsione: {
      domanda: (p) => 'Nel file restano ' + p.cap + ' byte. Il programma chiede a read 8 byte e passa a write tutti quelli ricevuti. L’uscita ne accetta al più ' + p.out + '. Quanti byte restano da scrivere dopo la prima write?',
      opzioni: (p) => { const r = Math.min(8, p.cap), w = Math.min(r, p.out); return Array.from(new Set([r - w, 8 - w, r, 0, w])).slice(0, 4).sort((a, b) => a - b).map((v) => [v, String(v)]); }
    },
    confronto: (pred, esito, p) => { const r = Math.min(8, p.cap), w = Math.min(r, p.out); return 'Avevi previsto ' + pred + '. Restano ' + esito + ' byte. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'La lettura restituisce ' + r + ' byte, ed è questo il numero passato alla scrittura. L’uscita ne accetta ' + w + ', e ne restano ' + r + ' − ' + w + ' = ' + (r - w) + '.'); },
    costruisci(p) {
      const el = SL.el, passi = [], FILE = 'LINUXSYSTEMS'.slice(0, p.cap), r = Math.min(8, p.cap), w1 = Math.min(r, p.out), resto = r - w1, HA = (a) => '0x' + a.toString(16).toUpperCase();
      const st = { letti: 0, scritti: 0, rax: null, rsi: '0x7000', rdx: 8, call: '·' };
      const quadro = (o) => {
        const els = [el.nota('n1', 20, 0, 'FILE, DESCRITTORE 3 · I BYTE RIMASTI', 'mono'), el.nota('n2', 20, 92, 'BUFFER DEL PROGRAMMA', 'mono'), el.nota('n3', 20, 218, 'USCITA, DESCRITTORE 1', 'mono')];
        for (let j = 0; j < p.cap; j++) els.push(el.cella('f' + j, 20 + j * 46, 24, 40, 40, FILE[j], j < st.letti ? 'off' : o.leggo ? (j < r ? 'att' : '') : 'on', { piccola: true }));
        for (let j = 0; j < 8; j++) els.push(el.cella('b' + j, 20 + j * 68, 118, 62, 44, j < st.letti ? FILE[j] : '?', j >= st.letti ? '' : j < st.scritti ? 'on' : 'att', { piccola: true, gi: HA(0x7000 + j) }));
        els.push(el.cursore('cur', 20 + (parseInt(st.rsi, 16) - 0x7000) * 68, 188, 62));
        for (let j = 0; j < 8; j++) els.push(el.cella('u' + j, 20 + j * 46, 242, 40, 40, j < st.scritti ? FILE[j] : '·', j < st.scritti ? (o.scrivo && j >= o.scrivo[0] ? 'att' : 'on') : 'off', { piccola: true }));
        els.push(el.box('rax', 600, 24, 240, 58, 'RAX', st.rax == null ? '·' : String(st.rax), o.rax ? 'att' : '', { cls: 'stretta' }),
          el.box('rsi', 600, 92, 240, 58, 'RSI, da dove', st.rsi, o.rsi ? 'att' : 'on', { cls: 'stretta' }),
          el.box('rdx', 600, 160, 240, 58, 'RDX, quanti al massimo', String(st.rdx), o.rdx ? 'att' : 'on', { cls: 'stretta' }),
          el.box('res', 600, 228, 240, 58, 'byte ancora da scrivere', String(st.letti - st.scritti), o.resto ? 'att' : '', { cls: 'stretta' }),
          el.box('call', 20, 304, 820, 58, 'chiamata e valore restituito', st.call, o.call ? 'att' : '', { cls: 'stretta' }));
        return els;
      };
      const hud = () => [['Letti', String(st.letti), 'a'], ['Scritti', String(st.scritti)], ['Da scrivere', String(st.letti - st.scritti), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      const o0 = Array.from(new Set([r, 8, p.cap])).sort((a, b) => a - b);
      st.call = 'read(3, 0x7000, 8)';
      P({ leggo: true, call: true, rdx: true }, 0, 'La richiesta di lettura', 'Il programma chiede al kernel di leggere dal descrittore 3 e di depositare i byte nel buffer, che comincia a 0x7000 e ha posto per 8 byte. RSI contiene l’indirizzo del buffer, RDX il massimo che il programma è disposto a ricevere.',
        { calc: 'read(3, 0x7000, 8)', chiedi: { d: 'Nel file restano ' + p.cap + ' byte e la richiesta è di 8. Quanti byte restituirà read?', o: o0.map(String), g: o0.indexOf(r), no: p.cap < 8 ? 'Il file ne ha soltanto ' + p.cap + ': la lettura si ferma lì e restituisce ' + r + '.' : 'Il programma ha chiesto al massimo 8 byte: la lettura si ferma a 8.' } });
      st.letti = r; st.rax = r; st.call = 'read(3, 0x7000, 8) → ' + r;
      P({ rax: true, call: true }, 0, r < 8 ? 'Una lettura più corta della richiesta' : 'I byte nel buffer', 'In RAX torna ' + r + ': i byte che il kernel ha davvero copiato nel buffer. ' + (p.cap < 8 ? 'Nel file ne restavano soltanto ' + p.cap + ', e la lettura si è fermata prima della richiesta. È un esito regolare. Le ultime ' + (8 - r) + ' celle del buffer contengono ancora ciò che c’era prima.' : p.cap > 8 ? 'Il buffer è pieno. Nel file restano altri ' + (p.cap - 8) + ' byte, che verranno letti al prossimo giro.' : 'Il buffer è pieno, e il file è stato letto per intero.'), { calc: 'RAX = ' + r });
      const o2 = Array.from(new Set([w1, r, p.out])).sort((a, b) => a - b);
      st.rdx = r; st.call = 'write(1, 0x7000, ' + r + ')';
      P({ rdx: true, call: true }, 1, 'La richiesta di scrittura', 'Il conteggio da passare a write è il valore restituito dalla lettura, ' + r + '. ' + (r < 8 ? 'Con 8 finirebbero in uscita anche le celle che la lettura ha lasciato com’erano.' : 'Qui coincide con la capienza del buffer, ma il numero giusto resta quello restituito.') + ' Il programma copia RAX in RDX e chiede la scrittura sul descrittore 1.',
        { calc: 'write(1, 0x7000, ' + r + ')', chiedi: { d: 'L’uscita accetta al più ' + p.out + ' byte, e la richiesta è di ' + r + '. Quanti byte restituirà write?', o: o2.map(String), g: o2.indexOf(w1), no: w1 < r ? 'L’uscita ne accetta soltanto ' + p.out + ': la scrittura si ferma lì e restituisce ' + w1 + '.' : 'L’uscita può accettarli tutti: la scrittura restituisce ' + r + '.' } });
      st.scritti = w1; st.rax = w1; st.call = 'write(1, 0x7000, ' + r + ') → ' + w1;
      const o3 = [0x7000, 0x7000 + w1, 0x7000 + r];
      P({ rax: true, call: true, resto: true, scrivo: [0] }, 1, resto ? 'Una scrittura parziale' : 'Una scrittura completa', 'In RAX torna ' + w1 + ': i byte che l’uscita ha accettato. ' + (resto ? 'Ne erano stati offerti ' + r + ', e ' + resto + (resto === 1 ? ' aspetta' : ' aspettano') + ' ancora nel buffer. Anche questo è un esito regolare: sta al programma accorgersene e proseguire.' : 'Erano tutti quelli offerti, e nel buffer non resta nulla da scrivere.'),
        Object.assign({ calc: 'RAX = ' + w1 }, resto ? { chiedi: { d: 'I primi ' + w1 + ' byte sono già in uscita. Da quale indirizzo deve ripartire la scrittura?', o: o3.map(HA), g: 1, no: 'Il primo byte ancora da scrivere si trova ' + w1 + ' posizioni dopo l’inizio del buffer: 0x7000 + ' + w1 + ' = ' + HA(0x7000 + w1) + '.' } } : {}));
      if (resto) {
        st.rsi = HA(0x7000 + w1); st.rdx = resto; st.call = 'write(1, ' + st.rsi + ', ' + resto + ')';
        P({ rsi: true, rdx: true, call: true }, 2, 'Avanzare e ridurre', 'Il programma somma RAX a RSI e lo sottrae da RDX. L’indirizzo avanza di ' + w1 + ' byte, fino a ' + st.rsi + ', e il conteggio scende a ' + resto + '. I due registri descrivono ora la parte del messaggio ancora da scrivere.', { calc: '0x7000 + ' + w1 + ' = ' + st.rsi + ' · ' + r + ' − ' + w1 + ' = ' + resto });
        st.scritti = r; st.rax = resto; st.call = 'write(1, ' + st.rsi + ', ' + resto + ') → ' + resto;
        P({ rax: true, call: true, resto: true, scrivo: [w1] }, 2, 'Il resto in uscita', 'La seconda scrittura parte dal punto giusto e l’uscita accetta ' + (resto === 1 ? 'l’ultimo byte.' : 'gli ultimi ' + resto + ' byte.') + ' In RAX torna ' + resto + ', pari al conteggio richiesto: tutti i byte letti sono arrivati a destinazione, ciascuno una volta sola.', { calc: 'RAX = ' + resto });
      }
      P({ resto: true }, 3, 'Tre numeri da tenere distinti', 'I byte chiesti alla lettura erano 8, quelli letti ' + r + ', quelli accettati dalla prima scrittura ' + w1 + '. Sono tre numeri che descrivono tre momenti. Un programma che copia dati ripete questo schema finché una lettura restituisce 0, segno che il file è finito.', { calc: 'chiesti 8 · letti ' + r + ' · scritti subito ' + w1, esito: ['restavano ' + resto + ' byte', 'si'] });
      return { passi, esito: resto };
    }
  },
  bilancio: {
    regola: [
      'I servizi read e write ricevono un descrittore, l’indirizzo di un buffer e un numero massimo di byte. Restituiscono in RAX i byte davvero trasferiti, che possono essere meno. Una lettura che restituisce 0 segnala la fine del file.',
      'Alla scrittura va passato il numero restituito dalla lettura. Dopo una scrittura parziale l’indirizzo avanza dei byte scritti e il conteggio si riduce della stessa quantità.'
    ],
    errori: [
      ['Scrivere tanti byte quanti ne contiene il buffer.', 'Se la lettura ha restituito 5 byte su 8, le ultime tre celle contengono dati vecchi. Vanno scritti 5 byte.'],
      ['Ignorare il valore restituito da write.', 'Una scrittura di 5 byte che ne restituisce 2 ne ha lasciati 3 nel buffer. Senza una seconda chiamata vanno perduti.'],
      ['Ripetere la scrittura dall’inizio del buffer.', 'I primi byte sono già usciti. Ripartendo da capo comparirebbero due volte.']
    ],
    saFare: ['Leggo il valore restituito da read e lo uso come conteggio per write.', 'Riconosco una scrittura parziale dal valore restituito.', 'Calcolo indirizzo e conteggio della scrittura successiva.'],
    esercizi: [
      { d: 'Un programma chiede a read 16 byte, e nel file ne restano 10. La scrittura che segue riceve tutti i byte letti, e l’uscita ne accetta 4. Quanti byte restano da scrivere?', segnaposto: 'Un numero', giuste: ['6', 'sei'],
        ok: 'La lettura restituisce 10 byte. La scrittura ne offre 10 e ne consegna 4: ne restano 6.',
        diagnosi: [
          { se: ['12'], msg: 'Così il conto parte da 16, i byte richiesti. La lettura ne ha restituiti 10, ed è quello il numero offerto alla scrittura.' },
          { se: ['10'], msg: 'Dieci sono i byte letti. Quattro sono già stati scritti.' },
          { se: ['4'], msg: 'Quattro sono i byte scritti. La domanda riguarda quelli rimasti.' }
        ],
        altro: 'Il numero è diverso. Calcola prima quanti byte restituisce la lettura, poi togli quelli scritti.',
        indizi: ['La lettura restituisce il più piccolo fra i byte richiesti e quelli disponibili.', 'I byte letti sono 10.', '10 − 4.'],
        svolgimento: ['Lettura: richiesti 16, disponibili 10. Restituiti 10.', 'Scrittura: offerti 10, accettati 4.', 'Restano 10 − 4 = 6 byte.'] },
      { d: 'Una scrittura di 10 byte a partire dall’indirizzo 0x7000 restituisce 4. Come vanno impostati RSI e RDX per la chiamata successiva?', guida: 'Scegli la risposta.', o: [
        { t: 'RSI = 0x7004, RDX = 6', ok: true, fb: 'L’indirizzo avanza dei 4 byte già scritti, e il conteggio scende a 10 − 4 = 6.' },
        { t: 'RSI = 0x7000, RDX = 6', fb: 'Il conteggio è giusto. Ripartendo da 0x7000, però, i primi byte uscirebbero una seconda volta e gli ultimi resterebbero nel buffer.' },
        { t: 'RSI = 0x7004, RDX = 10', fb: 'L’indirizzo è giusto. Con un conteggio di 10 la scrittura andrebbe oltre la fine dei dati, fino a 0x700D.' }] }
    ],
    sfida: ['cslez2_5_02_random_assembly_02', 'Lettura in un buffer e scrittura di porzioni']
  }
});
