'use strict';
SL.unita622 = (() => {
  const esito = (p) => (p.cond === 'fuori' || p.acc === 'scrive' ? 'violazione' : p.cond === 'file' ? 'carica' : 'subito');
  const traccia = (p) => {
    const T = [], scr = p.acc === 'scrive', verbo = scr ? 'scrivere' : 'leggere', e = esito(p);
    const voce0 = p.cond === 'residente' ? 'presente 1 · frame 7' : 'presente 0', reg0 = p.cond === 'fuori' ? 'nessuna' : 'file · sola lettura';
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, istr: (scr ? 'scrive' : 'legge') + ' 0x2010', voce: voce0, kern: '·', letture: 0, ram: p.cond === 'residente' ? 'pagina 2 del file' : 'libero', fine: '·', acc: '', rosso: '' }, s, extra ? { extra } : {}));
    S(0, 'La situazione', 'Un processo ha chiesto al kernel di vedere un file come una regione della propria memoria, in sola lettura. ' + (p.cond === 'residente' ? 'La pagina 2 è già stata caricata nel frame 7.' : p.cond === 'file' ? 'La pagina 2 appartiene alla regione, e non è ancora stata caricata.' : 'La pagina 2 sta fuori da ogni regione del processo.') + ' Il programma sta per ' + verbo + ' il byte di indirizzo 0x2010.', { istr: '·' });
    S(0, 'L’istruzione chiede un byte', 'L’indirizzo 0x2010 si scompone in pagina 2 e offset 16, che in esadecimale è 0x010. Il processore passa la richiesta alla MMU.', { acc: 'i' }, { calc: '0x2010 → pagina 2 · offset 16' });
    if (p.cond === 'residente' && !scr) {
      S(1, 'La MMU consulta la voce', 'La voce della pagina 2 ha il bit di presenza a 1, il frame 7, e il permesso di lettura. La traduzione riesce senza disturbare il kernel.', { acc: 'v' }, { calc: 'presente 1 · frame 7', chiedi: { d: 'Il bit di presenza vale 1. Il kernel deve intervenire?', o: ['No: la MMU traduce da sola', 'Sì: ogni accesso passa dal kernel'], g: 0, no: 'Il kernel interviene soltanto quando la MMU non può completare la traduzione.' } });
      S(1, 'L’indirizzo fisico', 'L’indirizzo fisico è 7 × 4096 + 16 = 28 688, cioè 0x7010. Il byte viene letto dalla RAM.', { acc: 'r', fine: 'byte letto a 0x7010' }, { calc: '7 × 4096 + 16 = 28 688' });
    } else if (p.cond === 'residente') {
      S(1, 'La MMU consulta la voce', 'La voce della pagina 2 ha il bit di presenza a 1 e il frame 7. Il permesso però è di sola lettura, e l’istruzione vuole scrivere. La MMU interrompe l’istruzione e chiama il kernel.', { acc: 'v', rosso: 'v' }, { calc: 'presente 1 · scrittura vietata', chiedi: { d: 'La pagina è presente. Perché la MMU chiama comunque il kernel?', o: ['Perché l’accesso richiesto non è permesso', 'Perché la pagina va ricaricata'], g: 0, no: 'La presenza dice dove sta la pagina. Il permesso dice che cosa se ne può fare.' } });
      S(2, 'Il kernel esamina la regione', 'Il kernel trova la regione che contiene l’indirizzo. È in sola lettura, e la scrittura è vietata. Nessuna correzione è possibile.', { kern: 'regione in sola lettura', acc: 'k', rosso: 'k' }, { calc: 'accesso non ammesso' });
    } else {
      S(1, 'La MMU consulta la voce', 'La voce della pagina 2 ha il bit di presenza a 0, e quindi la pagina manca dalla RAM. La traduzione resta incompleta. L’istruzione viene interrotta, e il controllo passa al kernel: è un page fault.', { acc: 'v', rosso: 'v' }, { calc: 'presente 0 · page fault', chiedi: { d: 'Il page fault è appena avvenuto. Il programma ha già commesso un errore?', o: ['È presto per dirlo: decide il kernel, guardando le regioni', 'Sì: ha usato un indirizzo sbagliato', 'No: un page fault è sempre innocuo'], g: 0, no: 'Una pagina assente può essere una pagina legittima mai caricata, oppure un indirizzo estraneo. Lo stabilisce il kernel.' } });
      if (p.cond === 'fuori') S(2, 'Il kernel esamina le regioni', 'Il kernel cerca fra le regioni del processo quella che contiene l’indirizzo 0x2010. La ricerca fallisce: il programma ha usato un indirizzo estraneo alle sue regioni.', { kern: 'nessuna regione', acc: 'k', rosso: 'k' }, { calc: 'indirizzo estraneo' });
      else if (scr) S(2, 'Il kernel esamina le regioni', 'Il kernel trova la regione che contiene l’indirizzo: è associata al file, in sola lettura. L’istruzione voleva scrivere. L’accesso non è ammesso, e caricare la pagina sarebbe inutile.', { kern: 'regione in sola lettura', acc: 'k', rosso: 'k' }, { calc: 'accesso non ammesso' });
      else {
        S(2, 'Il kernel esamina le regioni', 'Il kernel trova la regione che contiene l’indirizzo: è associata al file, e ammette la lettura. La richiesta è legittima. Manca soltanto il contenuto.', { kern: 'lettura ammessa', acc: 'k' }, { calc: 'accesso ammesso' });
        S(2, 'Il caricamento', 'Il kernel sceglie un frame libero, il 7, e vi copia dal file i 4096 byte della pagina 2. Poi aggiorna la voce: presente 1, frame 7.', { voce: 'presente 1 · frame 7', kern: 'carica la pagina', letture: 1, ram: 'pagina 2 del file', acc: 'dr' }, { calc: 'letture dal file: 1' });
        S(2, 'L’istruzione viene ripetuta', 'Il kernel restituisce il controllo, e il processore ripete da capo l’istruzione interrotta. Questa volta la MMU trova la pagina: 7 × 4096 + 16 = 28 688, cioè 0x7010.', { voce: 'presente 1 · frame 7', kern: 'ha finito', letture: 1, ram: 'pagina 2 del file', fine: 'byte letto a 0x7010', acc: 'vr' }, { calc: '7 × 4096 + 16 = 28 688' });
      }
    }
    const u = T[T.length - 1];
    S(3, 'L’esito', e === 'subito' ? 'Il byte è stato letto subito. La pagina era residente e l’accesso permesso: il kernel non è mai stato chiamato, e il file non è stato toccato.' : e === 'carica' ? 'Il byte è stato letto, dopo un page fault e una lettura dal file. Il programma non si è accorto di nulla, salvo il tempo trascorso. La pagina è stata caricata nel momento in cui serviva: è la paginazione su richiesta.' : 'Il kernel segnala al processo una violazione, con il segnale SIGSEGV dell’unità 5.4.5. Nessuna pagina è stata caricata, e l’istruzione non verrà ripetuta.', { voce: u.voce, kern: e === 'violazione' ? 'invia SIGSEGV' : u.kern, letture: u.letture, ram: u.ram, fine: e === 'violazione' ? 'violazione' : u.fine, rosso: e === 'violazione' ? 'ke' : '' }, { esito: [e === 'subito' ? 'byte letto subito' : e === 'carica' ? 'pagina caricata · istruzione ripetuta' : 'violazione', e === 'violazione' ? 'no' : 'si'] });
    return T;
  };
  const quadro = (pre, s, o) => {
    const el = SL.el, w3 = (o.w - 20) / 3, a = (c) => s.acc.indexOf(c) >= 0, r = (c) => s.rosso.indexOf(c) >= 0, st = (c, base) => (r(c) ? 'err' : a(c) ? 'att' : base);
    return [
      el.box(pre + 'i', o.x, o.y, w3, 54, 'istruzione', s.istr, st('i', s.istr === '·' ? '' : 'on'), { cls: 'stretta' }),
      el.box(pre + 'v', o.x + w3 + 10, o.y, w3, 54, 'MMU · voce della pagina 2', s.voce, st('v', 'on'), { cls: 'stretta' }),
      el.box(pre + 'k', o.x + 2 * (w3 + 10), o.y, w3, 54, 'kernel', s.kern, st('k', s.kern === '·' ? '' : 'on'), { cls: 'stretta' }),
      el.box(pre + 'd', o.x, o.y + 64, w3, 54, 'letture dal file', String(s.letture), st('d', s.letture ? 'on' : ''), { cls: 'stretta' }),
      el.box(pre + 'r', o.x + w3 + 10, o.y + 64, w3, 54, 'RAM · frame 7', s.ram, st('r', s.ram === 'libero' ? '' : 'on'), { cls: 'stretta' }),
      el.box(pre + 'e', o.x + 2 * (w3 + 10), o.y + 64, w3, 54, 'esito', s.fine, st('e', s.fine === '·' ? '' : 'att'), { cls: 'stretta' })
    ];
  };
  return { esito, traccia, quadro };
})();
SL.registra('6.2.2', {
  titolo: 'Residenza, eccezioni e paginazione su richiesta',
  obiettivo: 'Obiettivo: seguire un accesso a una pagina dalla MMU al kernel, distinguendo il page fault che porta a caricare la pagina da quello che finisce in una violazione.',
  concetti: [['bit', 'Un bit dice se la pagina è in RAM'], ['interrupt', 'La pagina manca: decide il kernel'], ['file', 'Caricare soltanto ciò che serve']],
  filigrana: ['bit', 'interrupt', 'file'],
  richiami: {
    carte: [
      { sim: 'memory', da: 'Dall’unità 4.1.1', t: 'La pagina assente', d: 'Una pagina che il programma può usare, e che il kernel deve ancora preparare.' },
      { sim: 'conflitto', da: 'Dall’unità 4.1.2', t: 'Il fault', d: 'Una eccezione che lascia incompiuta l’istruzione, in modo che possa essere ripetuta.' },
      { sim: 'tabella', da: 'Dall’unità 6.2.1', t: 'Pagina, frame e offset', d: 'La tabella associa a ogni pagina un frame. L’offset passa immutato.' }
    ],
    domanda: { d: 'Prima di proseguire: dopo un fault, da quale istruzione riprende il programma?', o: [
      { t: 'Dalla stessa istruzione, che viene ripetuta', ok: true, fb: 'L’indirizzo salvato da un fault è quello dell’istruzione rimasta incompiuta.' },
      { t: 'Dall’istruzione successiva', fb: 'Così il programma salterebbe un’istruzione mai eseguita.' },
      { t: 'Dall’inizio del programma', fb: 'Il kernel conserva il contesto, e riprende dal punto dell’interruzione.' }
    ] }
  },
  idea: {
    titolo: 'Caricare una pagina soltanto quando qualcuno la chiede',
    termini: ['mmu', 'bit di presenza', 'page fault', 'paginazione su richiesta'],
    testo: [
      'Un programma grande usa, in ogni momento, una piccola parte delle proprie pagine. Caricarle tutte in RAM alla partenza sarebbe uno spreco di tempo e di memoria. Il kernel fa una promessa diversa: dichiara al processo quali regioni di indirizzi gli appartengono, e riempie le pagine una per volta, nel momento in cui vengono toccate. Questa tecnica si chiama [[paginazione su richiesta]].',
      'A tradurre gli indirizzi è un circuito del processore, la [[mmu|MMU]], dall’inglese memory management unit. Per ogni accesso consulta la voce della pagina nella tabella. Accanto al numero del frame, la voce contiene alcuni bit. Il più importante è il [[bit di presenza]]: vale 1 se la pagina si trova in RAM, e allora si dice residente. Vale 0 se in RAM non c’è. Altri bit dicono che cosa è permesso: leggere, scrivere, eseguire.',
      'Se il bit di presenza vale 1 e l’accesso è permesso, la MMU completa la traduzione da sola, in una frazione di nanosecondo. Se qualcosa non va, la MMU interrompe l’istruzione e solleva un’eccezione, che per le pagine si chiama [[page fault]]. È un fault nel senso dell’unità 4.1.2: l’istruzione resta incompiuta, e il kernel riceve il controllo insieme all’indirizzo che ha causato il problema.',
      { fig: 'scena', w: 720, h: 126, titolo: 'Bit di presenza a 0: la MMU si ferma e chiama il kernel', nota: 'La voce non contiene un frame. Sarà il kernel a decidere se la pagina va caricata oppure se l’indirizzo è estraneo.', els: SL.unita622.quadro('g', SL.unita622.traccia({ cond: 'file', acc: 'legge' })[2], { x: 10, y: 4, w: 700 }) },
      'A questo punto il kernel deve distinguere due casi che per la MMU sono identici. Guarda l’elenco delle regioni del processo. Se l’indirizzo cade in una regione, e l’accesso richiesto è fra quelli ammessi, la richiesta è legittima: il kernel sceglie un frame libero, vi copia il contenuto della pagina, per esempio leggendolo da un file, mette a 1 il bit di presenza e fa ripetere l’istruzione. Il programma prosegue senza accorgersi di nulla.',
      'Se invece l’indirizzo sta fuori da ogni regione, oppure l’accesso non è permesso, non c’è nulla da caricare. Il kernel segnala una violazione al processo, che di norma viene terminato. Residenza e permesso sono dunque due informazioni indipendenti: una pagina può essere ammessa e assente, oppure presente e protetta. Il page fault è il momento in cui il kernel le mette insieme.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma accede al byte di indirizzo 0x2010, nella pagina 2. Sceglierai lo stato iniziale della pagina, e se l’istruzione legge oppure scrive. La regione del file ammette soltanto la lettura.',
      'Seguiremo la richiesta attraverso la MMU e, quando serve, il kernel. Tieni d’occhio il contatore delle letture dal file: dice se la pagina è stata caricata.'
    ],
    vedrai: [
      ['cpu', 'La richiesta', 'In alto: l’istruzione, la voce della pagina vista dalla MMU, e ciò che fa il kernel.'],
      ['memory', 'Le conseguenze', 'In basso: le letture dal file, il contenuto del frame 7, e l’esito.']
    ]
  },
  lab: {
    titolo: 'Un accesso, dalla MMU al kernel',
    scena: { w: 860, h: 130 },
    atti: ['La richiesta', 'La MMU', 'Il kernel', 'L’esito'],
    controlli: [
      { id: 'cond', tipo: 'scelta', eti: 'La pagina 2 all’inizio', opzioni: [['residente', 'residente nel frame 7'], ['file', 'nella regione del file, non caricata'], ['fuori', 'fuori da ogni regione']], valore: 'file' },
      { id: 'acc', tipo: 'scelta', eti: 'L’istruzione', opzioni: [['legge', 'legge il byte'], ['scrive', 'scrive il byte']], valore: 'legge' }
    ],
    nota: 'Il numero dei passi dipende dal caso. La regione associata al file ammette soltanto la lettura.',
    previsione: {
      domanda: (p) => 'Un programma vuole ' + (p.acc === 'scrive' ? 'scrivere' : 'leggere') + ' il byte di indirizzo 0x2010, nella pagina 2. ' + (p.cond === 'residente' ? 'La pagina è residente nel frame 7, e appartiene a una regione in sola lettura.' : p.cond === 'file' ? 'La pagina appartiene a una regione associata a un file, in sola lettura, e non è ancora stata caricata.' : 'L’indirizzo sta fuori da ogni regione del processo.') + ' Come finisce la richiesta?',
      opzioni: () => [['subito', 'L’accesso riesce subito, senza il kernel'], ['carica', 'Il kernel carica la pagina, e l’istruzione viene ripetuta'], ['violazione', 'Il kernel segnala una violazione']]
    },
    confronto: (pred, esito, p) => { const N = { subito: 'l’accesso riesce subito', carica: 'il kernel carica la pagina', violazione: 'il kernel segnala una violazione' }; return 'La previsione indicava «' + N[pred] + '». L’esito è «' + N[esito] + '». ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'subito' ? 'La pagina è residente e la lettura è permessa: la MMU completa la traduzione da sola.' : esito === 'carica' ? 'La pagina manca, e l’indirizzo sta in una regione che ammette la lettura: il kernel la carica dal file.' : p.cond === 'fuori' ? 'Nessuna regione contiene l’indirizzo, e quindi non c’è nulla che il kernel possa caricare.' : 'La regione è in sola lettura. Una scrittura non è ammessa, che la pagina sia presente o no.'); },
    costruisci(p) {
      const U = SL.unita622, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Bit di presenza', s.voce.indexOf('presente 1') === 0 ? '1' : '0', 'a'], ['Letture dal file', String(s.letture), 'c'], ['Esito', s.fine === '·' ? '·' : s.fine === 'violazione' ? 'violazione' : 'byte letto']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'Bit di presenza a 1 e accesso permesso: la MMU traduce da sola. Altrimenti: page fault, e decide il kernel.',
      'Il kernel carica la pagina se l’indirizzo cade in una regione e l’accesso è ammesso. Altrimenti segnala una violazione.'
    ],
    errori: [
      ['Considerare ogni page fault un errore del programma.', 'La maggior parte dei page fault riguarda pagine legittime, caricate al primo uso.'],
      ['Confondere presenza e permesso.', 'Una pagina può essere ammessa e assente, oppure presente e protetta dalla scrittura.'],
      ['Pensare che il programma riparta dall’istruzione successiva.', 'Dopo il caricamento viene ripetuta la stessa istruzione, che questa volta riesce.']
    ],
    saFare: ['Leggere il bit di presenza di una voce.', 'Stabilire come il kernel risponde a un page fault.', 'Contare i caricamenti causati da una sequenza di accessi.'],
    esercizi: [
      { d: 'Un programma legge, nell’ordine, un byte delle pagine 5, 5, 6, 5 e 7 di una regione associata a un file. All’inizio nessuna pagina è in RAM, e la memoria libera abbonda. Quanti page fault avvengono?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Un page fault per il primo accesso a ciascuna delle pagine 5, 6 e 7.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Dopo il primo accesso la pagina è residente: i successivi li traduce la MMU da sola.' },
          { se: ['0', 'zero'], msg: 'All’inizio le pagine mancano dalla RAM: il primo accesso a ciascuna provoca un fault.' },
          { se: ['2', 'due'], msg: 'Le pagine diverse sono tre: 5, 6 e 7.' }
        ],
        altro: 'Il numero è diverso. Conta le pagine diverse toccate per la prima volta.',
        indizi: ['Il primo accesso a una pagina assente provoca un page fault.', 'Gli accessi successivi alla stessa pagina la trovano residente.', 'Pagine diverse: 5, 6, 7.'],
        svolgimento: ['Pagina 5: fault, poi residente.', 'Pagina 6: fault.', 'Pagina 7: fault.', 'Totale: 3.'] },
      { d: 'Dopo un page fault il kernel carica la pagina nel frame 9. Qual è, in decimale, l’indirizzo fisico del byte di offset 32?', segnaposto: 'Un numero', giuste: ['36896', '36 896', '0x9020'],
        ok: '9 × 4096 + 32 = 36 896.',
        diagnosi: [
          { se: ['36864', '36 864'], msg: 'Questo è l’inizio del frame 9. Aggiungi l’offset, 32.' },
          { se: ['41', 'quarantuno'], msg: 'Il frame va moltiplicato per 4096 prima di aggiungere l’offset.' }
        ],
        altro: 'Il numero è diverso. Si applichi frame × 4096 + offset.',
        indizi: ['9 × 4096 = 36 864.', 'Offset: 32.', '36 864 + 32 = 36 896.'],
        svolgimento: ['Inizio del frame 9: 36 864.', 'Indirizzo fisico: 36 896.'] },
      { d: 'Una pagina è residente, in una regione di sola lettura. Un’istruzione prova a scrivervi. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
        { t: 'La MMU chiama il kernel, che segnala una violazione', ok: true, fb: 'La pagina è presente, e l’accesso richiesto non è fra quelli permessi.' },
        { t: 'La scrittura riesce, perché la pagina è in RAM', fb: 'La presenza è insufficiente. Conta anche il permesso.' },
        { t: 'Il kernel ricarica la pagina dal file', fb: 'La pagina è già in RAM. Il problema è il tipo di accesso.' }] }
    ],
    sfida: ['cslez6_2_04_page_faults', 'Errori di pagina']
  }
});
