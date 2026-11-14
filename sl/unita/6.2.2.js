'use strict';
SL.unita622 = (() => {
  const esito = (p) => (p.cond === 'fuori' || p.acc === 'scrive' ? 'violazione' : p.cond === 'file' ? 'carica' : 'subito');
  const traccia = (p) => {
    const T = [], scr = p.acc === 'scrive', verbo = scr ? 'scrivere' : 'leggere', e = esito(p);
    const voce0 = p.cond === 'residente' ? 'presente 1 · frame 7' : 'presente 0';
    const S = (atto, titolo, testo, s, extra) => T.push(Object.assign({ atto, titolo, testo, istr: (scr ? 'scrive' : 'legge') + ' 0x2010', voce: voce0, kern: '·', letture: 0, ram: p.cond === 'residente' ? 'pagina 2 del file' : 'libero', fine: '·', acc: '', rosso: '' }, s, extra ? { extra } : {}));
    S(0, 'La situazione', 'Un processo ha richiesto al kernel di disporre di un file come regione della propria memoria, in sola lettura. ' + (p.cond === 'residente' ? 'La pagina 2 è già stata caricata nel frame 7.' : p.cond === 'file' ? 'La pagina 2 appartiene alla regione, ed è ancora da caricare.' : 'La pagina 2 è esterna a ogni regione del processo.') + ' Il programma si accinge a ' + verbo + ' il byte di indirizzo 0x2010.', { istr: '·' });
    S(0, 'L’istruzione richiede un byte', 'L’indirizzo 0x2010 si scompone in pagina 2 e offset 16, che in esadecimale è 0x010. Il processore trasmette la richiesta alla MMU.', { acc: 'i' }, { calc: '0x2010 → pagina 2 · offset 16' });
    if (p.cond === 'residente' && !scr) {
      S(1, 'La MMU consulta la voce', 'La voce della pagina 2 ha il bit di presenza a 1, il frame 7, e il permesso di lettura. La traduzione riesce senza l’intervento del kernel.', { acc: 'v' }, { calc: 'presente 1 · frame 7', chiedi: { d: 'Il bit di presenza vale 1. Il kernel deve intervenire?', o: ['No, la MMU traduce in autonomia', 'Sì, ogni accesso transita dal kernel'], g: 0, no: 'Il kernel interviene soltanto quando la MMU non può completare la traduzione.' } });
      S(1, 'L’indirizzo fisico', 'L’indirizzo fisico è 7 × 4096 + 16 = 28 688, cioè 0x7010. Il byte è letto dalla RAM.', { acc: 'r', fine: 'byte letto a 0x7010' }, { calc: '7 × 4096 + 16 = 28 688' });
    } else if (p.cond === 'residente') {
      S(1, 'La MMU consulta la voce', 'La voce della pagina 2 ha il bit di presenza a 1 e il frame 7. Il permesso è tuttavia di sola lettura, mentre l’istruzione richiede una scrittura. La MMU interrompe l’istruzione e invoca il kernel.', { acc: 'v', rosso: 'v' }, { calc: 'presente 1 · scrittura vietata', chiedi: { d: 'La pagina è presente. Per quale ragione la MMU invoca comunque il kernel?', o: ['L’accesso richiesto non è permesso', 'La pagina va ricaricata'], g: 0, no: 'La presenza indica dove si trova la pagina, mentre il permesso indica gli accessi consentiti.' } });
      S(2, 'Il kernel esamina la regione', 'Il kernel individua la regione che contiene l’indirizzo: è in sola lettura, e la scrittura è vietata. Nessuna correzione è possibile.', { kern: 'regione in sola lettura', acc: 'k', rosso: 'k' }, { calc: 'accesso non ammesso' });
    } else {
      S(1, 'La MMU consulta la voce', 'La voce della pagina 2 ha il bit di presenza a 0, e pertanto la pagina è assente dalla RAM. La traduzione resta incompleta: l’istruzione è interrotta, e il controllo passa al kernel. Si tratta di un page fault.', { acc: 'v', rosso: 'v' }, { calc: 'presente 0 · page fault', chiedi: { d: 'Il page fault si è appena verificato. Il programma ha già commesso un errore?', o: ['È ancora indeterminato, e lo stabilisce il kernel esaminando le regioni', 'Sì, ha impiegato un indirizzo errato', 'No, un page fault è sempre innocuo'], g: 0, no: 'Una pagina assente può essere una pagina legittima mai caricata, oppure un indirizzo estraneo. Lo stabilisce il kernel.' } });
      if (p.cond === 'fuori') S(2, 'Il kernel esamina le regioni', 'Il kernel cerca fra le regioni del processo quella che contiene l’indirizzo 0x2010. La ricerca fallisce: il programma ha impiegato un indirizzo estraneo alle proprie regioni.', { kern: 'nessuna regione', acc: 'k', rosso: 'k' }, { calc: 'indirizzo estraneo' });
      else if (scr) S(2, 'Il kernel esamina le regioni', 'Il kernel individua la regione che contiene l’indirizzo: è associata al file, in sola lettura, mentre l’istruzione richiedeva una scrittura. L’accesso non è ammesso, e il caricamento della pagina sarebbe inutile.', { kern: 'regione in sola lettura', acc: 'k', rosso: 'k' }, { calc: 'accesso non ammesso' });
      else {
        S(2, 'Il kernel esamina le regioni', 'Il kernel individua la regione che contiene l’indirizzo: è associata al file, e ammette la lettura. La richiesta è legittima, e manca soltanto il contenuto.', { kern: 'lettura ammessa', acc: 'k' }, { calc: 'accesso ammesso' });
        S(2, 'Il caricamento', 'Il kernel seleziona un frame libero, il 7, vi copia dal file i 4096 byte della pagina 2, e aggiorna quindi la voce: presente 1, frame 7.', { voce: 'presente 1 · frame 7', kern: 'carica la pagina', letture: 1, ram: 'pagina 2 del file', acc: 'dr' }, { calc: 'letture dal file: 1' });
        S(2, 'L’istruzione è ripetuta', 'Il kernel restituisce il controllo, e il processore ripete dall’inizio l’istruzione interrotta. In questa esecuzione la MMU trova la pagina: 7 × 4096 + 16 = 28 688, cioè 0x7010.', { voce: 'presente 1 · frame 7', kern: 'ha terminato', letture: 1, ram: 'pagina 2 del file', fine: 'byte letto a 0x7010', acc: 'vr' }, { calc: '7 × 4096 + 16 = 28 688' });
      }
    }
    const u = T[T.length - 1];
    S(3, 'L’esito', e === 'subito' ? 'Il byte è stato letto immediatamente. La pagina era residente e l’accesso permesso: il kernel non è mai stato invocato, e il file non è stato letto.' : e === 'carica' ? 'Il byte è stato letto, dopo un page fault e una lettura dal file. Per il programma l’unico effetto osservabile è il tempo trascorso. La pagina è stata caricata nel momento in cui era richiesta: è la paginazione su richiesta.' : 'Il kernel segnala al processo una violazione, con il segnale SIGSEGV dell’unità 5.4.5. Nessuna pagina è stata caricata, e l’istruzione non sarà ripetuta.', { voce: u.voce, kern: e === 'violazione' ? 'invia SIGSEGV' : u.kern, letture: u.letture, ram: u.ram, fine: e === 'violazione' ? 'violazione' : u.fine, rosso: e === 'violazione' ? 'ke' : '' }, { esito: [e === 'subito' ? 'byte letto immediatamente' : e === 'carica' ? 'pagina caricata · istruzione ripetuta' : 'violazione', e === 'violazione' ? 'no' : 'si'] });
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
  obiettivo: 'Obiettivo: seguire un accesso a una pagina dalla MMU al kernel, distinguendo il page fault che conduce al caricamento della pagina da quello che termina in una violazione.',
  concetti: [['bit', 'Un bit indica se la pagina è in RAM'], ['interrupt', 'La pagina è assente: decide il kernel'], ['file', 'Caricare soltanto il necessario']],
  filigrana: ['bit', 'interrupt', 'file'],
  richiami: {
    carte: [
      { sim: 'memory', da: 'Dall’unità 4.1.1', t: 'La pagina assente', d: 'Una pagina che il programma può impiegare, e che il kernel deve ancora predisporre.' },
      { sim: 'conflitto', da: 'Dall’unità 4.1.2', t: 'Il fault', d: 'Una eccezione che lascia incompiuta l’istruzione, in modo che possa essere ripetuta.' },
      { sim: 'tabella', da: 'Dall’unità 6.2.1', t: 'Pagina, frame e offset', d: 'La tabella associa a ogni pagina un frame. L’offset resta invariato.' }
    ],
    domanda: { d: 'Prima di proseguire: dopo un fault, da quale istruzione riprende il programma?', o: [
      { t: 'Dalla medesima istruzione, che è ripetuta', ok: true, fb: 'L’indirizzo salvato da un fault è quello dell’istruzione rimasta incompiuta.' },
      { t: 'Dall’istruzione successiva', fb: 'In tal caso il programma ometterebbe un’istruzione mai eseguita.' },
      { t: 'Dall’inizio del programma', fb: 'Il kernel conserva il contesto, e riprende dal punto dell’interruzione.' }
    ] }
  },
  idea: {
    titolo: 'Il caricamento di una pagina soltanto alla prima richiesta',
    termini: ['mmu', 'bit di presenza', 'page fault', 'paginazione su richiesta'],
    testo: [
      'Un programma di grandi dimensioni impiega, in ogni momento, una piccola parte delle proprie pagine. Il caricamento di tutte le pagine in RAM all’avvio comporterebbe uno spreco di tempo e di memoria. Il kernel adotta una strategia diversa: dichiara al processo quali regioni di indirizzi gli appartengono, e riempie le pagine una per volta, nel momento del primo accesso. La tecnica prende il nome di [[paginazione su richiesta]].',
      'La traduzione degli indirizzi è affidata a un circuito del processore, la [[mmu|MMU]], dall’inglese memory management unit, che per ogni accesso consulta la voce della pagina nella tabella. Accanto al numero del frame, la voce contiene alcuni bit. Il principale è il [[bit di presenza]]: vale 1 se la pagina si trova in RAM, e in tal caso la pagina è detta residente, mentre vale 0 se la pagina è assente dalla RAM. Altri bit indicano gli accessi permessi: lettura, scrittura, esecuzione.',
      'Se il bit di presenza vale 1 e l’accesso è permesso, la MMU completa la traduzione in autonomia, in una frazione di nanosecondo. Se una delle due condizioni è violata, la MMU interrompe l’istruzione e solleva un’eccezione, che per le pagine prende il nome di [[page fault]]. Si tratta di un fault nel senso dell’unità 4.1.2: l’istruzione resta incompiuta, e il kernel riceve il controllo insieme all’indirizzo che ha causato l’eccezione.',
      { fig: 'scena', w: 720, h: 126, titolo: 'Bit di presenza a 0: la MMU si arresta e invoca il kernel', nota: 'La voce non contiene un frame. Spetta al kernel stabilire se la pagina va caricata oppure se l’indirizzo è estraneo.', els: SL.unita622.quadro('g', SL.unita622.traccia({ cond: 'file', acc: 'legge' })[2], { x: 10, y: 4, w: 700 }) },
      'Il kernel deve allora distinguere due casi che per la MMU sono identici, e a tal fine esamina l’elenco delle regioni del processo. Se l’indirizzo ricade in una regione, e l’accesso richiesto è fra quelli ammessi, la richiesta è legittima: il kernel seleziona un frame libero, vi copia il contenuto della pagina, per esempio leggendolo da un file, pone a 1 il bit di presenza e dispone la ripetizione dell’istruzione. Il programma prosegue senza alcun effetto osservabile oltre al tempo trascorso.',
      'Se invece l’indirizzo è esterno a ogni regione, oppure l’accesso non è permesso, nessuna pagina può essere caricata. Il kernel segnala una violazione al processo, che di norma è terminato. Residenza e permesso sono pertanto due informazioni indipendenti: una pagina può essere ammessa e assente, oppure presente e protetta. Il page fault è il momento in cui il kernel le esamina congiuntamente.'
    ]
  },
  esperimento: {
    faremo: [
      'Un programma accede al byte di indirizzo 0x2010, nella pagina 2. I controlli fissano lo stato iniziale della pagina, e il tipo di accesso dell’istruzione, lettura oppure scrittura. La regione del file ammette soltanto la lettura.',
      'L’esperimento segue la richiesta attraverso la MMU e, quando è necessario, il kernel. Il contatore delle letture dal file indica se la pagina è stata caricata.'
    ],
    vedrai: [
      ['cpu', 'La richiesta', 'In alto: l’istruzione, la voce della pagina consultata dalla MMU, e l’azione del kernel.'],
      ['memory', 'Le conseguenze', 'In basso: le letture dal file, il contenuto del frame 7, e l’esito.']
    ]
  },
  lab: {
    titolo: 'Un accesso, dalla MMU al kernel',
    scena: { w: 860, h: 130 },
    atti: ['La richiesta', 'La MMU', 'Il kernel', 'L’esito'],
    controlli: [
      { id: 'cond', tipo: 'scelta', eti: 'La pagina 2 all’inizio', opzioni: [['residente', 'residente nel frame 7'], ['file', 'nella regione del file, da caricare'], ['fuori', 'esterna a ogni regione']], valore: 'file' },
      { id: 'acc', tipo: 'scelta', eti: 'L’istruzione', opzioni: [['legge', 'legge il byte'], ['scrive', 'scrive il byte']], valore: 'legge' }
    ],
    nota: 'Il numero dei passi dipende dal caso. La regione associata al file ammette soltanto la lettura.',
    previsione: {
      domanda: (p) => 'Un programma deve ' + (p.acc === 'scrive' ? 'scrivere' : 'leggere') + ' il byte di indirizzo 0x2010, nella pagina 2. ' + (p.cond === 'residente' ? 'La pagina è residente nel frame 7, e appartiene a una regione in sola lettura.' : p.cond === 'file' ? 'La pagina appartiene a una regione associata a un file, in sola lettura, ed è ancora da caricare.' : 'L’indirizzo è esterno a ogni regione del processo.') + ' Quale esito ha la richiesta?',
      opzioni: () => [['subito', 'L’accesso riesce immediatamente, senza il kernel'], ['carica', 'Il kernel carica la pagina, e l’istruzione è ripetuta'], ['violazione', 'Il kernel segnala una violazione']]
    },
    confronto: (pred, esito, p) => { const N = { subito: 'l’accesso riesce immediatamente', carica: 'il kernel carica la pagina', violazione: 'il kernel segnala una violazione' }; return 'La previsione indicava «' + N[pred] + '». L’esito è «' + N[esito] + '». ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'subito' ? 'La pagina è residente e la lettura è permessa: la MMU completa la traduzione in autonomia.' : esito === 'carica' ? 'La pagina è assente, e l’indirizzo ricade in una regione che ammette la lettura: il kernel la carica dal file.' : p.cond === 'fuori' ? 'Nessuna regione contiene l’indirizzo, e pertanto il kernel non dispone di alcuna pagina da caricare.' : 'La regione è in sola lettura. Una scrittura non è ammessa, indipendentemente dalla presenza della pagina.'); },
    costruisci(p) {
      const U = SL.unita622, T = U.traccia(p);
      const passi = T.map((s) => Object.assign({ atto: s.atto, titolo: s.titolo, testo: s.testo, hud: [['Bit di presenza', s.voce.indexOf('presente 1') === 0 ? '1' : '0', 'a'], ['Letture dal file', String(s.letture), 'c'], ['Esito', s.fine === '·' ? '·' : s.fine === 'violazione' ? 'violazione' : 'byte letto']], els: U.quadro('b', s, { x: 20, y: 4, w: 820 }) }, s.extra || {}));
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'Bit di presenza a 1 e accesso permesso: la MMU traduce in autonomia. Altrimenti: page fault, e decide il kernel.',
      'Il kernel carica la pagina se l’indirizzo ricade in una regione e l’accesso è ammesso. Altrimenti segnala una violazione.'
    ],
    errori: [
      ['Considerare ogni page fault un errore del programma.', 'La maggior parte dei page fault riguarda pagine legittime, caricate al primo accesso.'],
      ['Confondere presenza e permesso.', 'Una pagina può essere ammessa e assente, oppure presente e protetta dalla scrittura.'],
      ['Ritenere che il programma riprenda dall’istruzione successiva.', 'Dopo il caricamento è ripetuta la medesima istruzione, che alla seconda esecuzione riesce.']
    ],
    saFare: ['Leggere il bit di presenza di una voce.', 'Stabilire come il kernel risponde a un page fault.', 'Contare i caricamenti causati da una sequenza di accessi.'],
    esercizi: [
      { d: 'Un programma legge, nell’ordine, un byte delle pagine 5, 5, 6, 5 e 7 di una regione associata a un file. Inizialmente nessuna pagina è in RAM, e la memoria libera è abbondante. Quanti page fault si verificano?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Un page fault per il primo accesso a ciascuna delle pagine 5, 6 e 7.',
        diagnosi: [
          { se: ['5', 'cinque'], msg: 'Dopo il primo accesso la pagina è residente: i successivi sono tradotti dalla MMU in autonomia.' },
          { se: ['0', 'zero'], msg: 'Inizialmente le pagine sono assenti dalla RAM: il primo accesso a ciascuna provoca un fault.' },
          { se: ['2', 'due'], msg: 'Le pagine distinte sono tre: 5, 6 e 7.' }
        ],
        altro: 'Il numero è diverso. Si contino le pagine distinte al loro primo accesso.',
        indizi: ['Il primo accesso a una pagina assente provoca un page fault.', 'Gli accessi successivi alla medesima pagina la trovano residente.', 'Pagine distinte: 5, 6, 7.'],
        svolgimento: ['Pagina 5: fault, quindi residente.', 'Pagina 6: fault.', 'Pagina 7: fault.', 'Totale: 3.'] },
      { d: 'Dopo un page fault il kernel carica la pagina nel frame 9. Qual è, in decimale, l’indirizzo fisico del byte di offset 32?', segnaposto: 'Un numero', giuste: ['36896', '36 896', '0x9020'],
        ok: '9 × 4096 + 32 = 36 896.',
        diagnosi: [
          { se: ['36864', '36 864'], msg: 'Questo è l’inizio del frame 9. Va aggiunto l’offset, 32.' },
          { se: ['41', 'quarantuno'], msg: 'Il frame va moltiplicato per 4096 prima di aggiungere l’offset.' }
        ],
        altro: 'Il numero è diverso. Si applichi frame × 4096 + offset.',
        indizi: ['9 × 4096 = 36 864.', 'Offset: 32.', '36 864 + 32 = 36 896.'],
        svolgimento: ['Inizio del frame 9: 36 864.', 'Indirizzo fisico: 36 896.'] },
      { d: 'Una pagina è residente, in una regione di sola lettura. Un’istruzione tenta una scrittura su di essa. Che cosa accade?', guida: 'Si scelga la risposta.', o: [
        { t: 'La MMU invoca il kernel, che segnala una violazione', ok: true, fb: 'La pagina è presente, e l’accesso richiesto non è fra quelli permessi.' },
        { t: 'La scrittura riesce, poiché la pagina è in RAM', fb: 'La presenza è insufficiente, poiché è rilevante anche il permesso.' },
        { t: 'Il kernel ricarica la pagina dal file', fb: 'La pagina è già in RAM. L’ostacolo è il tipo di accesso.' }] }
    ],
    sfida: ['cslez6_2_04_page_faults', 'Errori di pagina']
  }
});
