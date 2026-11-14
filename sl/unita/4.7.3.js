'use strict';
SL.unita473 = (() => {
  const conto = (p) => { const pub = Math.min(p.cap, p.rich), rit = Math.min(pub, p.fin); return { pub, rit, attesa: p.rich - pub, attivi: pub - rit, liberi: p.cap - pub + rit }; };
  // fase: 0 l'anello vuoto · 1 la preparazione · 2 la pubblicazione · 3 i completamenti · 4 il recupero
  const quadro = (pre, p, f, o) => {
    const el = SL.el, c = conto(p), els = [], passo = o.wc + 4;
    els.push(el.nota(pre + 't', o.x, o.y, 'ANELLO DI DESCRITTORI · ' + p.cap + ' slot', 'mono'));
    for (let k = 0; k < p.cap; k++) {
      const usato = k < c.pub, finito = k < c.rit;
      const txt = !usato || f === 0 ? '·' : f === 1 ? 'prep' : f === 2 ? 'DISP' : f === 3 ? (finito ? 'fatto' : 'DISP') : finito ? '·' : 'DISP';
      const st = !usato || f === 0 ? '' : f === 1 ? 'on' : f === 2 ? 'att' : f === 3 ? (finito ? 'zero' : 'att') : finito ? '' : 'att';
      els.push(el.cella(pre + 's' + k, o.x + k * passo, o.y + 42, o.wc, 34, txt, st, { so: 'slot ' + k, piccola: true }));
    }
    const w5 = (o.w - 40) / 5;
    [['richieste', String(p.rich), 0], ['in attesa', f >= 1 ? String(c.attesa) : '·', 1], ['ceduti', f >= 2 ? String(f >= 4 ? c.attivi : c.pub) : '·', 2], ['completati', f >= 3 ? String(c.rit) : '·', 3], ['slot liberi', f >= 4 ? String(c.liberi) : f >= 1 ? String(p.cap - c.pub) : String(p.cap), 4]].forEach((r, k) => els.push(el.box(pre + 'q' + k, o.x + k * (w5 + 10), o.y + 96, w5, 54, r[0], r[1], f === r[2] ? 'att' : f > r[2] ? 'on' : k === 4 ? 'on' : '', { cls: 'stretta' })));
    return els;
  };
  return { conto, quadro };
})();
SL.registra('4.7.3', {
  titolo: 'Interfacce, descrittori e proprietà dei buffer',
  obiettivo: 'Obiettivo: seguire le richieste DMA in un anello di descrittori, e indicare in ogni istante quali slot appartengono al driver e quali al dispositivo.',
  concetti: [['coda', 'Un anello di slot riutilizzabili'], ['lucchetto', 'Uno slot ha un solo proprietario'], ['dispositivo', 'Il completamento restituisce lo slot']],
  filigrana: ['coda', 'lucchetto', 'dispositivo'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 4.7.2', t: 'Il descrittore di trasferimento', d: 'Indirizzo, lunghezza e direzione di un trasferimento affidato al dispositivo.' },
      { sim: 'interrupt', da: 'Dall’unità 4.3.4', t: 'Il raggruppamento', d: 'Un dispositivo può segnalare più eventi con un solo interrupt.' },
      { sim: 'coda', da: 'Dall’unità 4.5.3', t: 'La coda', d: 'Le richieste che un dispositivo non può servire immediatamente restano in attesa.' }
    ],
    domanda: { d: 'Prima di proseguire: una struttura dispone di 8 posizioni libere, e deve accogliere 12 richieste. Quante richieste restano in attesa?', o: [
      { t: '4', ok: true, fb: 'Otto richieste sono accolte, e 12 − 8 = 4 attendono una posizione.' },
      { t: '8', fb: 'Otto sono le richieste accolte.' },
      { t: '12', fb: 'Le prime otto posizioni sono occupate immediatamente.' }
    ] }
  },
  idea: {
    titolo: 'La proprietà del descrittore',
    termini: ['anello di descrittori', 'proprietà dello slot'],
    testo: [
      'Un dispositivo veloce riceve molte richieste di trasferimento, e il loro trattamento una per volta sarebbe inefficiente. Driver e dispositivo condividono pertanto una serie di posizioni numerate, gli slot, ciascuna in grado di contenere un descrittore. Il driver li riempie in ordine, e raggiunto l’ultimo torna al primo che sia stato liberato. Per tale ragione la struttura prende il nome di [[anello di descrittori]].',
      'Uno slot è una zona di memoria che entrambi possono leggere e scrivere, e ciò comporta un rischio. Se il driver modificasse un descrittore mentre il dispositivo lo impiega, il dispositivo potrebbe leggere l’indirizzo di una richiesta insieme alla lunghezza di un’altra. La protezione consiste in una regola di [[proprietà dello slot]]: in ogni istante uno slot appartiene a uno solo dei due, e soltanto il proprietario vi accede.',
      'Durante la preparazione della richiesta lo slot appartiene al driver. Quando tutti i campi sono completi, il driver segnala al dispositivo che il descrittore è pronto: lo pubblica, e in tale istante gliene cede la proprietà. Da quel momento il driver deve astenersi dall’accedere allo slot e al buffer che esso indica. La proprietà torna al driver quando il dispositivo segnala il completamento, e il driver lo registra.',
      { fig: 'scena', w: 720, h: 158, titolo: 'Otto slot, sette richieste, tre completamenti recuperati', nota: 'DISP indica gli slot che appartengono al dispositivo, il punto quelli liberi: 1 mai impiegato e 3 recuperati.', els: SL.unita473.quadro('g', { cap: 8, rich: 7, fin: 3 }, 4, { x: 10, y: 0, wc: 76, w: 700 }) },
      'Un anello ha una capienza limitata. Con otto slot e dodici richieste, otto sono pubblicate e quattro restano in attesa di uno slot. Le due attese sono di natura diversa: una richiesta pubblicata è affidata al dispositivo, mentre una richiesta in attesa deve ancora essere avviata. Ogni completamento recuperato libera uno slot, che in seguito potrà accogliere una delle richieste rimaste escluse.'
    ]
  },
  esperimento: {
    faremo: [
      'I controlli fissano il numero di slot dell’anello, le richieste che il driver deve pubblicare e i completamenti che il driver osserva.',
      'L’esperimento segue gli slot nei loro passaggi di proprietà: liberi, preparati, ceduti al dispositivo, completati, recuperati. È istruttivo esaminare 12 richieste con 8 slot e poi con 4.'
    ],
    vedrai: [
      ['coda', 'L’anello', 'In alto: gli slot numerati. Un punto indica uno slot libero, DISP uno slot ceduto al dispositivo.'],
      ['tabella', 'I conteggi', 'In basso: richieste, richieste in attesa, slot ceduti al dispositivo, completamenti e slot liberi.']
    ]
  },
  lab: {
    titolo: 'Un ciclo dell’anello',
    scena: { w: 860, h: 158 },
    atti: ['L’anello', 'La pubblicazione', 'Il recupero'],
    controlli: [
      { id: 'cap', tipo: 'scelta', eti: 'Slot', opzioni: [[4, '4'], [8, '8']], valore: 8 },
      { id: 'rich', tipo: 'scelta', eti: 'Richieste', opzioni: [[3, '3'], [7, '7'], [12, '12']], valore: 7 },
      { id: 'fin', tipo: 'scelta', eti: 'Completamenti osservati', opzioni: [[0, '0'], [3, '3'], [5, '5']], valore: 3 }
    ],
    nota: 'I passi sono sempre cinque. Il modello si arresta prima della pubblicazione delle richieste rimaste in attesa.',
    previsione: {
      domanda: (p) => 'L’anello ha ' + p.cap + ' slot, tutti liberi. Il driver deve pubblicare ' + p.rich + ' richieste, e poi osserva ' + (p.fin === 0 ? 'nessun completamento' : 'al massimo ' + p.fin + ' completamenti') + '. Quanti slot sono liberi dopo il recupero?',
      opzioni: (p) => { const c = SL.unita473.conto(p); return Array.from(new Set([c.liberi, p.cap - c.pub, c.rit, p.cap])).sort((a, b) => a - b).map((v) => [v, String(v)]); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita473.conto(p); return 'La previsione indicava ' + pred + ' slot liberi. Dopo il recupero sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Pubblicati ' + c.pub + ', restano ' + (p.cap - c.pub) + ' liberi. I completamenti recuperati sono ' + c.rit + ', e ' + (p.cap - c.pub) + ' + ' + c.rit + ' = ' + c.liberi + '.'); },
    costruisci(p) {
      const U = SL.unita473, c = U.conto(p), passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wc: p.cap === 8 ? 92 : 120, w: 820 });
      const hud = (f) => [['Del dispositivo', f >= 2 ? String(f >= 4 ? c.attivi : c.pub) : '0', 'a'], ['In attesa', f >= 1 ? String(c.attesa) : '·'], ['Liberi', String(f >= 4 ? c.liberi : f >= 1 ? p.cap - c.pub : p.cap), 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'L’anello vuoto', 'L’anello ha ' + p.cap + ' slot, e tutti appartengono al driver. Le richieste di trasferimento da avviare sono ' + p.rich + '.', {});
      P(1, 0, 'La preparazione', 'Il driver scrive un descrittore in ogni slot disponibile: indirizzo del buffer, lunghezza, direzione. ' + (c.attesa === 0 ? 'Tutte le ' + p.rich + ' richieste trovano uno slot' + (p.cap - c.pub > 0 ? ', e ne restano ' + (p.cap - c.pub) + ' liberi.' : '.') : 'Gli slot sono ' + p.cap + ', e ' + c.attesa + ' richieste restano in attesa di uno slot.'), { calc: 'preparati ' + c.pub + ' · in attesa ' + c.attesa });
      P(2, 1, 'La pubblicazione', 'Il driver segnala al dispositivo che i descrittori sono pronti. Con questa operazione la proprietà di ' + c.pub + ' slot passa al dispositivo, insieme ai buffer che indicano.', { calc: 'slot del dispositivo: ' + c.pub, chiedi: { d: 'Il driver rileva di avere scritto una lunghezza errata nello slot 0. Può correggerla in questo istante?', o: ['Sì, lo slot è nella memoria condivisa', 'No, lo slot appartiene al dispositivo'], g: 1, no: 'Dopo la pubblicazione il dispositivo potrebbe leggere lo slot in qualsiasi momento. Il driver deve attendere il completamento.' } });
      P(3, 2, 'I completamenti', c.rit === 0 ? 'Il dispositivo è ancora in attività, e il driver non osserva alcun completamento. Tutti gli slot pubblicati restano del dispositivo.' : 'Il dispositivo porta a termine ' + (c.rit === 1 ? 'un trasferimento e ne segnala' : c.rit + ' trasferimenti e ne segnala') + ' il completamento.' + (c.rit < p.fin ? ' Il driver poteva osservarne ' + p.fin + ', e tuttavia le richieste pubblicate erano soltanto ' + c.pub + '.' : ''), { calc: 'completati: ' + c.rit });
      P(4, 2, 'Il recupero', (c.rit === 0 ? 'Nessuno slot è da recuperare, e al dispositivo restano ' : 'Il driver verifica l’esito e riprende ' + (c.rit === 1 ? 'lo slot completato' : 'i ' + c.rit + ' slot completati') + ', che tornano liberi. Al dispositivo restano ') + c.attivi + ' slot. I liberi sono ' + (p.cap - c.pub) + ' + ' + c.rit + ' = ' + c.liberi + (c.attesa > 0 && c.liberi > 0 ? ', e potranno accogliere una parte delle ' + c.attesa + ' richieste in attesa.' : c.attesa > 0 ? ', e le ' + c.attesa + ' richieste in attesa devono attendere ancora.' : '.'), { calc: p.cap + ' − ' + c.pub + ' + ' + c.rit + ' = ' + c.liberi + ' liberi', esito: [c.liberi + ' slot liberi', ''] });
      return { passi, esito: c.liberi };
    }
  },
  bilancio: {
    regola: [
      'Uno slot appartiene al driver durante la preparazione, al dispositivo dalla pubblicazione al completamento, e di nuovo al driver dopo il recupero.',
      'Pubblicati = il minore fra slot e richieste. Liberi dopo il recupero = slot − pubblicati + completamenti recuperati.'
    ],
    errori: [
      ['Modificare uno slot già pubblicato.', 'Il dispositivo potrebbe leggere una combinazione di campi precedenti e nuovi.'],
      ['Confondere una richiesta in attesa con una richiesta attiva.', 'Una richiesta in attesa è ancora priva di slot. Una richiesta attiva è pubblicata, ed è in corso di servizio presso il dispositivo.'],
      ['Considerare libero uno slot appena completato.', 'Lo slot torna libero quando il driver ha osservato il completamento e lo ha recuperato.']
    ],
    saFare: ['Indicare a chi appartiene uno slot in ogni fase.', 'Calcolare richieste pubblicate e richieste in attesa.', 'Calcolare gli slot liberi dopo il recupero.'],
    esercizi: [
      { d: 'Un anello ha 16 slot. Il driver pubblica 10 richieste e poi recupera 4 completamenti. Quanti slot sono liberi?', segnaposto: 'Un numero', giuste: ['10', 'dieci'],
        ok: '16 − 10 = 6 liberi dopo la pubblicazione, più i 4 recuperati.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Sei erano liberi dopo la pubblicazione. Vanno aggiunti i 4 slot recuperati.' },
          { se: ['4', 'quattro'], msg: 'Quattro sono gli slot recuperati. Erano già presenti 6 slot mai impiegati.' },
          { se: ['12', 'dodici'], msg: 'I completamenti liberano slot fra quelli pubblicati: 16 − 10 + 4.' }
        ],
        altro: 'Il numero è diverso. Si parta dagli slot rimasti liberi dopo la pubblicazione e si aggiungano quelli recuperati.',
        indizi: ['Dopo la pubblicazione: 16 − 10 = 6 liberi.', 'Recuperati: 4.', '6 + 4 = 10.'],
        svolgimento: ['Liberi dopo la pubblicazione: 6.', 'Recuperati: 4.', 'Liberi: 10.'] },
      { d: 'Un anello ha 8 slot, tutti liberi. Giungono 13 richieste. Quante restano in attesa di uno slot?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Otto sono pubblicate, e 13 − 8 = 5 attendono.',
        diagnosi: [
          { se: ['8', 'otto'], msg: 'Otto sono le richieste pubblicate. Quelle in attesa sono le rimanenti.' },
          { se: ['13', 'tredici'], msg: 'Le prime otto trovano immediatamente uno slot.' }
        ],
        altro: 'Il numero è diverso. Si sottraggano dalle richieste gli slot disponibili.',
        indizi: ['Gli slot sono 8.', 'Le richieste sono 13.', '13 − 8 = 5.'],
        svolgimento: ['Pubblicate: 8.', 'In attesa: 13 − 8 = 5.'] },
      { d: 'Per quale ragione il driver deve astenersi dal riscrivere uno slot fra la pubblicazione e il completamento?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il dispositivo potrebbe leggere campi di due richieste diverse', ok: true, fb: 'Per esempio il nuovo indirizzo con la lunghezza precedente.' },
        { t: 'Lo slot diviene di sola lettura per il processore', fb: 'La memoria resta scrivibile. Il divieto deriva dalla regola di proprietà.' },
        { t: 'La scrittura produrrebbe un secondo interrupt', fb: 'Gli interrupt sono generati dal dispositivo, al completamento.' }] }
    ],
    sfida: ['cslez4_7_02_dma_02', 'Driver e gestione delle richieste']
  }
});
