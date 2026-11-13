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
  obiettivo: 'Alla fine saprai seguire le richieste DMA in un anello di descrittori, e dire in ogni momento quali posti appartengono al driver e quali al dispositivo.',
  concetti: [['coda', 'Un anello di posti riutilizzabili'], ['lucchetto', 'Un posto ha un solo padrone'], ['dispositivo', 'Il completamento lo restituisce']],
  filigrana: ['coda', 'lucchetto', 'dispositivo'],
  richiami: {
    carte: [
      { sim: 'tabella', da: 'Dall’unità 4.7.2', t: 'Il descrittore di trasferimento', d: 'Indirizzo, lunghezza e direzione di un trasferimento affidato al dispositivo.' },
      { sim: 'interrupt', da: 'Dall’unità 4.3.4', t: 'Il raggruppamento', d: 'Un dispositivo può segnalare più eventi con un solo interrupt.' },
      { sim: 'coda', da: 'Dall’unità 4.5.3', t: 'La coda', d: 'Le richieste che un dispositivo non può servire subito restano in attesa.' }
    ],
    domanda: { d: 'Prima di proseguire: un parcheggio ha 8 posti. Arrivano 12 automobili. Quante restano fuori ad aspettare?', o: [
      { t: '4', ok: true, fb: 'Otto entrano, e 12 − 8 = 4 attendono un posto.' },
      { t: '8', fb: 'Otto sono quelle che entrano.' },
      { t: '12', fb: 'I primi otto posti vengono occupati subito.' }
    ] }
  },
  idea: {
    titolo: 'Di chi è il descrittore',
    termini: ['anello di descrittori', 'proprietà dello slot'],
    testo: [
      'Un dispositivo veloce riceve molte richieste di trasferimento, e trattarle una per volta sarebbe uno spreco. Driver e dispositivo condividono allora una serie di posti numerati, gli slot, ciascuno capace di contenere un descrittore. Il driver li riempie in ordine, e raggiunto l’ultimo torna al primo che si sia liberato. Per questo la struttura si chiama [[anello di descrittori]].',
      'Uno slot è una zona di memoria che entrambi possono leggere e scrivere, e questo crea un rischio. Se il driver modificasse un descrittore mentre il dispositivo lo sta usando, il dispositivo potrebbe trovare l’indirizzo di una richiesta insieme alla lunghezza di un’altra. La difesa è una regola di [[proprietà dello slot]]: in ogni istante uno slot appartiene a uno solo dei due, e soltanto il proprietario lo tocca.',
      'Finché prepara la richiesta, lo slot è del driver. Quando tutti i campi sono a posto, il driver annuncia al dispositivo che il descrittore è pronto: lo pubblica, e in quel momento gliene cede la proprietà. Da lì in poi deve tenere le mani lontane dallo slot e dal buffer che esso indica. La proprietà torna al driver quando il dispositivo segnala il completamento, e il driver ne prende atto.',
      { fig: 'scena', w: 720, h: 158, titolo: 'Otto slot, sette richieste, tre completamenti recuperati', nota: 'DISP segna gli slot che appartengono al dispositivo, il puntino quelli liberi: 1 mai usato e 3 recuperati.', els: SL.unita473.quadro('g', { cap: 8, rich: 7, fin: 3 }, 4, { x: 10, y: 0, wc: 76, w: 700 }) },
      'Un anello ha una capienza. Con otto slot e dodici richieste, otto vengono pubblicate e quattro restano in attesa di un posto. Sono due attese diverse: una richiesta pubblicata è in mano al dispositivo, una richiesta in attesa non è ancora partita. Ogni completamento recuperato libera uno slot, che al giro successivo potrà accogliere una delle richieste rimaste fuori.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai quanti slot ha l’anello, quante richieste deve pubblicare il driver, e quanti completamenti il driver osserva.',
      'Seguiremo gli slot nei loro passaggi di proprietà: liberi, preparati, ceduti al dispositivo, completati, recuperati. Prova 12 richieste con 8 slot e poi con 4.'
    ],
    vedrai: [
      ['coda', 'L’anello', 'In alto: gli slot numerati. Un puntino segna uno slot libero, DISP uno slot ceduto al dispositivo.'],
      ['tabella', 'I conteggi', 'In basso: richieste, richieste in attesa, slot ceduti al dispositivo, completamenti e slot liberi.']
    ]
  },
  lab: {
    titolo: 'Un giro dell’anello',
    scena: { w: 860, h: 158 },
    atti: ['L’anello', 'La pubblicazione', 'Il recupero'],
    controlli: [
      { id: 'cap', tipo: 'scelta', eti: 'Slot', opzioni: [[4, '4'], [8, '8']], valore: 8 },
      { id: 'rich', tipo: 'scelta', eti: 'Richieste', opzioni: [[3, '3'], [7, '7'], [12, '12']], valore: 7 },
      { id: 'fin', tipo: 'scelta', eti: 'Completamenti osservati', opzioni: [[0, '0'], [3, '3'], [5, '5']], valore: 3 }
    ],
    nota: 'I passi sono sempre cinque. Il modello si ferma prima di pubblicare le richieste rimaste in attesa.',
    previsione: {
      domanda: (p) => 'L’anello ha ' + p.cap + ' slot, tutti liberi. Il driver deve pubblicare ' + p.rich + ' richieste, e poi osserva ' + (p.fin === 0 ? 'nessun completamento' : 'al massimo ' + p.fin + ' completamenti') + '. Quanti slot sono liberi dopo il recupero?',
      opzioni: (p) => { const c = SL.unita473.conto(p); return Array.from(new Set([c.liberi, p.cap - c.pub, c.rit, p.cap])).sort((a, b) => a - b).map((v) => [v, String(v)]); }
    },
    confronto: (pred, esito, p) => { const c = SL.unita473.conto(p); return 'Avevi previsto ' + pred + ' slot liberi. Dopo il recupero sono ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : 'Pubblicati ' + c.pub + ', restano ' + (p.cap - c.pub) + ' liberi. I completamenti recuperati sono ' + c.rit + ', e ' + (p.cap - c.pub) + ' + ' + c.rit + ' = ' + c.liberi + '.'); },
    costruisci(p) {
      const U = SL.unita473, c = U.conto(p), passi = [];
      const quadro = (f) => U.quadro('q', p, f, { x: 20, y: 0, wc: p.cap === 8 ? 92 : 120, w: 820 });
      const hud = (f) => [['Del dispositivo', f >= 2 ? String(f >= 4 ? c.attivi : c.pub) : '0', 'a'], ['In attesa', f >= 1 ? String(c.attesa) : '·'], ['Liberi', String(f >= 4 ? c.liberi : f >= 1 ? p.cap - c.pub : p.cap), 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'L’anello vuoto', 'L’anello ha ' + p.cap + ' slot, e tutti appartengono al driver. Le richieste di trasferimento da avviare sono ' + p.rich + '.', {});
      P(1, 0, 'La preparazione', 'Il driver scrive un descrittore in ogni slot disponibile: indirizzo del buffer, lunghezza, direzione. ' + (c.attesa === 0 ? 'Tutte le ' + p.rich + ' richieste trovano posto' + (p.cap - c.pub > 0 ? ', e ne avanzano ' + (p.cap - c.pub) + ' liberi.' : '.') : 'Gli slot sono ' + p.cap + ', e ' + c.attesa + ' richieste restano in attesa di un posto.'), { calc: 'preparati ' + c.pub + ' · in attesa ' + c.attesa });
      P(2, 1, 'La pubblicazione', 'Il driver annuncia al dispositivo che i descrittori sono pronti. Con questo gesto la proprietà di ' + c.pub + ' slot passa al dispositivo, insieme ai buffer che indicano.', { calc: 'slot del dispositivo: ' + c.pub, chiedi: { d: 'Il driver si accorge di avere scritto una lunghezza sbagliata nello slot 0. Può correggerla adesso?', o: ['Sì: lo slot è nella memoria condivisa', 'No: lo slot appartiene al dispositivo'], g: 1, no: 'Dopo la pubblicazione il dispositivo potrebbe leggere lo slot in qualsiasi momento. Il driver deve attendere il completamento.' } });
      P(3, 2, 'I completamenti', c.rit === 0 ? 'Il dispositivo sta ancora lavorando, e il driver non osserva alcun completamento. Tutti gli slot pubblicati restano del dispositivo.' : 'Il dispositivo porta a termine ' + (c.rit === 1 ? 'un trasferimento e ne segnala' : c.rit + ' trasferimenti e ne segnala') + ' il completamento.' + (c.rit < p.fin ? ' Il driver poteva osservarne ' + p.fin + ', ma le richieste pubblicate erano soltanto ' + c.pub + '.' : ''), { calc: 'completati: ' + c.rit });
      P(4, 2, 'Il recupero', (c.rit === 0 ? 'Non c’è nulla da recuperare.' : 'Il driver controlla l’esito e riprende ' + (c.rit === 1 ? 'lo slot completato' : 'i ' + c.rit + ' slot completati') + ', che tornano liberi.') + ' Al dispositivo restano ' + c.attivi + ' slot. I liberi sono ' + (p.cap - c.pub) + ' + ' + c.rit + ' = ' + c.liberi + (c.attesa > 0 && c.liberi > 0 ? ', e potranno accogliere una parte delle ' + c.attesa + ' richieste in attesa.' : c.attesa > 0 ? ', e le ' + c.attesa + ' richieste in attesa devono aspettare ancora.' : '.'), { calc: p.cap + ' − ' + c.pub + ' + ' + c.rit + ' = ' + c.liberi + ' liberi', esito: [c.liberi + ' slot liberi', ''] });
      return { passi, esito: c.liberi };
    }
  },
  bilancio: {
    regola: [
      'Uno slot appartiene al driver finché viene preparato, al dispositivo dalla pubblicazione al completamento, e di nuovo al driver dopo il recupero.',
      'Pubblicati = il minore fra slot e richieste. Liberi dopo il recupero = slot − pubblicati + completamenti recuperati.'
    ],
    errori: [
      ['Modificare uno slot già pubblicato.', 'Il dispositivo potrebbe leggere un misto di campi vecchi e nuovi.'],
      ['Confondere una richiesta in attesa con una richiesta attiva.', 'In attesa: non ha ancora uno slot. Attiva: è pubblicata, e il dispositivo ci sta lavorando.'],
      ['Considerare libero uno slot appena completato.', 'Torna libero quando il driver ha osservato il completamento e lo ha recuperato.']
    ],
    saFare: ['Dico a chi appartiene uno slot in ogni fase.', 'Calcolo richieste pubblicate e richieste in attesa.', 'Calcolo gli slot liberi dopo il recupero.'],
    esercizi: [
      { d: 'Un anello ha 16 slot. Il driver pubblica 10 richieste e poi recupera 4 completamenti. Quanti slot sono liberi?', segnaposto: 'Un numero', giuste: ['10', 'dieci'],
        ok: '16 − 10 = 6 liberi dopo la pubblicazione, più i 4 recuperati.',
        diagnosi: [
          { se: ['6', 'sei'], msg: 'Sei erano liberi dopo la pubblicazione. Vanno aggiunti i 4 slot recuperati.' },
          { se: ['4', 'quattro'], msg: 'Quattro sono gli slot recuperati. C’erano già 6 slot mai usati.' },
          { se: ['12', 'dodici'], msg: 'I completamenti liberano slot fra quelli pubblicati: 16 − 10 + 4.' }
        ],
        altro: 'Il numero è diverso. Parti dagli slot rimasti liberi dopo la pubblicazione e aggiungi quelli recuperati.',
        indizi: ['Dopo la pubblicazione: 16 − 10 = 6 liberi.', 'Recuperati: 4.', '6 + 4 = 10.'],
        svolgimento: ['Liberi dopo la pubblicazione: 6.', 'Recuperati: 4.', 'Liberi: 10.'] },
      { d: 'Un anello ha 8 slot, tutti liberi. Arrivano 13 richieste. Quante restano in attesa di un posto?', segnaposto: 'Un numero', giuste: ['5', 'cinque'],
        ok: 'Otto vengono pubblicate, e 13 − 8 = 5 attendono.',
        diagnosi: [
          { se: ['8', 'otto'], msg: 'Otto sono le richieste pubblicate. Quelle in attesa sono le rimanenti.' },
          { se: ['13', 'tredici'], msg: 'Le prime otto trovano subito uno slot.' }
        ],
        altro: 'Il numero è diverso. Sottrai dalle richieste gli slot disponibili.',
        indizi: ['Gli slot sono 8.', 'Le richieste sono 13.', '13 − 8 = 5.'],
        svolgimento: ['Pubblicate: 8.', 'In attesa: 13 − 8 = 5.'] },
      { d: 'Perché il driver non deve riscrivere uno slot fra la pubblicazione e il completamento?', guida: 'Scegli la risposta.', o: [
        { t: 'Il dispositivo potrebbe leggere campi di due richieste diverse', ok: true, fb: 'Per esempio il nuovo indirizzo con la vecchia lunghezza.' },
        { t: 'Lo slot diventa di sola lettura per il processore', fb: 'La memoria resta scrivibile. È la regola di proprietà a vietarlo.' },
        { t: 'La scrittura farebbe partire un secondo interrupt', fb: 'Gli interrupt li genera il dispositivo, al completamento.' }] }
    ],
    sfida: ['cslez4_7_02_dma_02', 'Driver e gestione delle richieste']
  }
});
