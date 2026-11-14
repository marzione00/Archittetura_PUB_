'use strict';
SL.unita673 = (() => {
  const PAROLA = 'VOTO', CHIAVE = 0x2A;
  const H = (v) => v.toString(16).toUpperCase().padStart(2, '0');
  const chiaro = PAROLA.split('').map((c) => c.charCodeAt(0));
  const cifrato = chiaro.map((b) => b ^ CHIAVE);
  const sulDisco = (p) => (p.vol === 'cifrato' ? cifrato : chiaro);
  const esito = (p) => (p.dove === 'disco' ? (p.vol === 'cifrato' ? 'cifrato' : 'chiaro') : p.dove === 'ok' ? 'chiaro' : 'errore');
  const fila = (l) => l.map(H).join(' ');
  // f: 0 documento e volume · 1 posizione dell’osservatore · 2 chiave · 3 permessi · 4 ciò che ottiene
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], e = esito(p), w3 = (o.w - 20) / 3, x3 = o.x + 2 * (w3 + 10), wc = (2 * w3 + 10 - 18) / 4, cif = p.vol === 'cifrato', disco = p.dove === 'disco';
    els.push(el.nota(pre + 't0', o.x, o.y, 'IL DISCO · i byte del documento come sono registrati', 'mono', f === 0 ? 'att' : ''));
    sulDisco(p).forEach((b, k) => els.push(el.cella(pre + 'd' + k, o.x + k * (wc + 6), o.y + 24, wc, 32, H(b), f === 0 || (f === 4 && disco) ? 'att' : cif ? 'on' : 'zero', { piccola: true })));
    els.push(el.box(pre + 'v', x3, o.y + 12, w3, 54, 'volume', cif ? 'cifrato · chiave 2A' : 'in chiaro', f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'o', o.x, o.y + 78, w3, 54, 'l’osservatore', f >= 1 ? (disco ? 'legge il disco rimosso' : 'dentro una sessione') : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'k', o.x + w3 + 10, o.y + 78, w3, 54, 'la chiave', f >= 2 ? (!cif ? 'nessuna: volume in chiaro' : disco ? 'assente: sistema spento' : 'nella memoria del kernel') : '·', f >= 2 ? (!cif ? 'zero' : disco ? 'err' : f === 2 ? 'att' : 'on') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'p', x3, o.y + 78, w3, 54, 'controllo dei permessi', f >= 3 ? (disco ? 'saltato: kernel spento' : p.dove === 'ok' ? 'lettura concessa' : 'lettura negata') : '·', f >= 3 ? (disco ? 'zero' : p.dove === 'ok' ? (f === 3 ? 'att' : 'on') : 'err') : '', { cls: 'stretta' }));
    els.push(el.nota(pre + 't1', o.x, o.y + 144, 'CHE COSA OTTIENE L’OSSERVATORE · i quattro byte', 'mono', f === 4 ? 'att' : ''));
    [0, 1, 2, 3].forEach((k) => els.push(el.cella(pre + 'r' + k, o.x + k * (wc + 6), o.y + 168, wc, 32, f >= 4 ? (e === 'errore' ? '' : e === 'chiaro' ? PAROLA[k] : H(cifrato[k])) : '', f >= 4 ? (e === 'errore' ? 'err' : e === 'chiaro' ? 'att' : 'on') : '', { piccola: true })));
    els.push(el.box(pre + 'e', x3, o.y + 156, w3, 54, 'esito', f >= 4 ? (e === 'chiaro' ? 'testo in chiaro' : e === 'cifrato' ? 'testo cifrato' : '−13 · EACCES') : '·', f >= 4 ? (e === 'errore' ? 'err' : 'att') : '', { cls: 'stretta' }));
    return els;
  };
  return { PAROLA, CHIAVE, H, chiaro, cifrato, sulDisco, esito, fila, quadro };
})();
SL.registra('6.7.3', {
  titolo: 'Cifratura e posizione dell’avversario',
  obiettivo: 'Obiettivo: dire che cosa ottiene un osservatore del documento, secondo il punto da cui lo guarda: dal disco rimosso, oppure attraverso una sessione del sistema acceso.',
  concetti: [['lente', 'Conta dove sta chi guarda'], ['chiave', 'Senza chiave, byte senza significato'], ['scudo', 'Permessi e cifratura coprono avversari diversi']],
  filigrana: ['chiave', 'disco', 'scudo'],
  richiami: {
    carte: [
      { sim: 'privilegi', da: 'Dall’unità 6.7.2', t: 'I controlli del kernel', d: 'A ogni open il kernel controlla i permessi lungo il percorso e sul file.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'Lo XOR', d: 'Vale 1 quando i due bit sono diversi, e 0 quando sono uguali.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'I permessi stanno nell’inode', d: 'Sono metadati, registrati sul disco insieme al resto del file system.' }
    ],
    domanda: { d: 'Prima di proseguire: chi fa rispettare i permessi di un file, quando un programma chiede di aprirlo?', o: [
      { t: 'Il kernel, durante la open', ok: true, fb: 'I permessi sono dati scritti nell’inode. A leggerli e ad applicarli è il kernel.' },
      { t: 'Il disco, che rifiuta di consegnare i blocchi', fb: 'Il disco consegna qualunque blocco gli venga chiesto. La decisione è del kernel.' },
      { t: 'Il programma stesso', fb: 'Un programma potrebbe ignorarli. Per questo la decisione spetta al kernel.' }
    ] }
  },
  idea: {
    titolo: 'Dove sta chi guarda',
    termini: ['testo in chiaro', 'testo cifrato', 'chiave di cifratura', 'cifratura a riposo'],
    testo: [
      'I permessi dell’unità precedente hanno un presupposto che passa inosservato: funzionano finché a rispondere alle richieste è il kernel. Chi apre un file con una open trova il kernel sulla propria strada. Chi svita il disco da una macchina spenta e lo collega a un altro calcolatore legge i blocchi direttamente, e sulla propria strada trova soltanto dei byte. I permessi sono scritti negli inode, e un inode, letto come semplice blocco, è un dato come gli altri.',
      'Contro questo secondo avversario serve una difesa diversa: registrare sul disco i byte in una forma trasformata. I byte originali si chiamano [[testo in chiaro]], quelli trasformati [[testo cifrato]]. La trasformazione dipende da un segreto, la [[chiave di cifratura]]: chi la possiede può tornare dal testo cifrato a quello in chiaro, e chi ne è privo vede byte senza significato. Quando la trasformazione protegge i dati fermi su un supporto si parla di [[cifratura a riposo]].',
      'Per vedere l’idea usiamo un cifrario giocattolo: ogni byte viene combinato con la chiave attraverso lo XOR dell’unità 1.5.1. La parola VOTO è fatta dei byte ' + SL.unita673.fila(SL.unita673.chiaro) + '. Con la chiave 2A diventano ' + SL.unita673.fila(SL.unita673.cifrato) + '. Lo XOR ha una proprietà comoda: applicato una seconda volta con la stessa chiave restituisce il byte di partenza. Un cifrario così semplice cede in pochi tentativi, perché le chiavi possibili sono soltanto 256. I cifrari veri seguono lo stesso schema, con chiavi di centinaia di bit e trasformazioni che resistono anche a chi conosce il procedimento. Nell’esperimento assumeremo un cifrario sicuro, e una chiave rimasta segreta.',
      { fig: 'scena', w: 720, h: 218, titolo: 'Il disco rimosso da una macchina spenta, con il volume cifrato', nota: 'L’osservatore legge i blocchi senza passare dal kernel. La chiave è assente, e i byte ottenuti sono quelli registrati: testo cifrato.', els: SL.unita673.quadro('g', { dove: 'disco', vol: 'cifrato' }, 4, { x: 10, y: 4, w: 700 }) },
      'Quando la macchina è accesa la situazione cambia. All’avvio qualcuno sblocca il volume fornendo la chiave, e da quel momento il kernel la tiene in memoria: a ogni lettura decifra i blocchi, a ogni scrittura li cifra. Per i programmi tutto è trasparente, e una sessione autorizzata riceve il documento in chiaro. Ne segue che la cifratura a riposo lascia scoperto chi entra in una sessione: lì tornano a decidere i permessi. Una sessione con la lettura negata riceve un errore. Una sessione con la lettura concessa riceve il testo in chiaro, che il volume sia cifrato oppure no.',
      'Le due difese coprono dunque avversari in posizioni diverse. I permessi fermano chi passa dal kernel. La cifratura ferma chi lo aggira prendendo il supporto. Prima di dire che cosa vede un osservatore, bisogna stabilire dove si trova.'
    ]
  },
  esperimento: {
    faremo: [
      'Un documento contiene la parola VOTO. Sceglierai la posizione di chi cerca di leggerlo, e se il volume è cifrato oppure in chiaro.',
      'Seguiremo la chiave e il controllo dei permessi, fino ai byte ottenuti. Prova il disco rimosso con il volume in chiaro: i permessi del file ci sono, e nessuno li applica.'
    ],
    vedrai: [
      ['disco', 'Il disco', 'In alto: i quattro byte come sono registrati, e lo stato del volume.'],
      ['chiave', 'Le difese', 'Al centro: la posizione dell’osservatore, la chiave, e il controllo dei permessi.'],
      ['output', 'Il risultato', 'In basso: i byte che l’osservatore ottiene, e l’esito.']
    ]
  },
  lab: {
    titolo: 'Lo stesso documento, da tre posizioni',
    scena: { w: 860, h: 218 },
    atti: ['Il documento', 'L’osservatore', 'I permessi', 'Il risultato'],
    controlli: [
      { id: 'dove', tipo: 'scelta', eti: 'Osservatore', opzioni: [['disco', 'disco rimosso a macchina spenta'], ['ok', 'sessione con lettura concessa'], ['no', 'sessione con lettura negata']], valore: 'disco' },
      { id: 'vol', tipo: 'scelta', eti: 'Volume', opzioni: [['cifrato', 'cifrato'], ['chiaro', 'in chiaro']], valore: 'cifrato' }
    ],
    nota: 'I passi sono sempre cinque. Il cifrario giocattolo serve a mostrare i byte: l’esperimento assume un cifrario sicuro e una chiave rimasta segreta.',
    previsione: {
      domanda: (p) => 'Un documento contiene la parola VOTO, su un volume ' + (p.vol === 'cifrato' ? 'cifrato' : 'in chiaro') + '. ' + (p.dove === 'disco' ? 'Qualcuno rimuove il disco a macchina spenta e ne legge i blocchi.' : 'La macchina è accesa, e un programma chiede di aprire il documento da una sessione che ha la lettura ' + (p.dove === 'ok' ? 'concessa.' : 'negata.')) + ' Che cosa ottiene?',
      opzioni: () => [['chiaro', 'Il documento in chiaro'], ['cifrato', 'Byte cifrati, illeggibili senza la chiave'], ['errore', 'Un errore di apertura, e nessun byte']]
    },
    confronto: (pred, esito, p) => { const N = { chiaro: 'il documento in chiaro', cifrato: 'byte cifrati', errore: 'un errore di apertura' }; return 'La previsione indicava ' + N[pred] + '. L’osservatore ottiene ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.dove === 'disco' ? (p.vol === 'cifrato' ? 'Chi legge il disco rimosso evita il kernel e i suoi controlli. Trova i byte come sono registrati, cioè cifrati.' : 'Chi legge il disco rimosso evita il kernel: i permessi restano scritti nell’inode, e nessuno li applica. Il volume è in chiaro, e i byte sono quelli del documento.') : p.dove === 'ok' ? 'La sessione passa dal kernel, che concede la lettura' + (p.vol === 'cifrato' ? ' e decifra i blocchi con la chiave tenuta in memoria.' : '.') : 'La sessione passa dal kernel, che nega la lettura' + (p.vol === 'cifrato' ? '. Il volume era sbloccato: a fermare la richiesta sono i permessi.' : '.')); },
    costruisci(p) {
      const U = SL.unita673, e = U.esito(p), cif = p.vol === 'cifrato', disco = p.dove === 'disco', passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Chiave', f >= 2 ? (!cif ? 'nessuna' : disco ? 'assente' : 'in memoria') : '·', 'a'], ['Permessi', f >= 3 ? (disco ? 'saltati' : p.dove === 'ok' ? 'concessi' : 'negati') : '·'], ['Ottiene', f >= 4 ? (e === 'chiaro' ? 'in chiaro' : e === 'cifrato' ? 'cifrato' : 'errore') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'Il documento', 'Il documento contiene la parola VOTO: quattro caratteri, cioè i byte ' + U.fila(U.chiaro) + '. ' + (cif ? 'Il volume è cifrato. Ogni byte è registrato dopo lo XOR con la chiave 2A, e sul disco si trovano ' + U.fila(U.cifrato) + '.' : 'Il volume è in chiaro: sul disco si trovano gli stessi byte.'), { calc: cif ? U.fila(U.chiaro) + ' XOR 2A → ' + U.fila(U.cifrato) : 'sul disco: ' + U.fila(U.chiaro) });
      P(1, 1, 'L’osservatore', disco ? 'Qualcuno rimuove il disco a macchina spenta, e lo collega a un proprio calcolatore. Da lì legge i blocchi direttamente, uno dopo l’altro.' : 'La macchina è accesa, e il sistema ha aperto il volume all’avvio. L’osservatore lavora dentro una sessione: per arrivare al documento deve chiedere una open al kernel.', {});
      P(2, 1, 'La chiave', !cif ? 'Il volume è in chiaro: per leggerne i blocchi nessuna chiave è necessaria.' : disco ? 'La chiave stava nella memoria del sistema, che ora è spento. Sul disco è assente, e l’osservatore ne è privo.' : 'All’avvio qualcuno ha sbloccato il volume, fornendo la chiave. Da allora il kernel la tiene in memoria, e decifra i blocchi a ogni lettura.', { calc: 'chiave: ' + (!cif ? 'nessuna' : disco ? 'assente' : 'nella memoria del kernel') });
      P(3, 2, 'I permessi', disco ? 'I permessi del file sono scritti nell’inode, e a farli rispettare è il kernel. Qui il kernel è spento, e il controllo viene saltato: l’osservatore legge i blocchi senza passare da alcuna open.' : 'Il kernel controlla il permesso di lettura dell’account sul documento. ' + (p.dove === 'ok' ? 'È concesso.' : 'È negato.'), Object.assign({ calc: 'permessi: ' + (disco ? 'saltati' : p.dove === 'ok' ? 'lettura concessa' : 'lettura negata') }, disco ? { chiedi: { d: 'Il documento ha i permessi 0600. Fermano chi legge il disco rimosso?', o: ['No: li applica soltanto il kernel in funzione', 'Sì: sono scritti sul disco'], g: 0, no: 'Sono scritti sul disco, come dati. Ad applicarli è il kernel, che qui è spento.' } } : {}));
      P(4, 3, 'Che cosa ottiene', disco ? (cif ? 'L’osservatore ottiene ' + U.fila(U.cifrato) + ': testo cifrato. Senza la chiave, e con un cifrario sicuro, da questi byte il documento resta illeggibile.' : 'L’osservatore ottiene ' + U.fila(U.chiaro) + ', cioè VOTO: testo in chiaro. I permessi sono rimasti sul disco, senza nessuno che li applicasse.') : p.dove === 'ok' ? (cif ? 'Il kernel legge i blocchi, li decifra con la chiave, e consegna VOTO alla sessione: testo in chiaro. Per chi è autorizzato la cifratura è trasparente.' : 'Il kernel legge i blocchi e consegna VOTO alla sessione: testo in chiaro.') : 'La open restituisce −13, EACCES, e la sessione resta senza un solo byte del documento. ' + (cif ? 'Il volume era sbloccato: a fermare la richiesta sono stati i permessi, e la cifratura qui è fuori gioco.' : 'A fermare la richiesta sono stati i permessi.'), { esito: [e === 'chiaro' ? 'testo in chiaro' : e === 'cifrato' ? 'testo cifrato' : 'errore di apertura', ''] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'I permessi fermano chi passa dal kernel. La cifratura a riposo ferma chi legge il supporto senza possedere la chiave.',
      'Con il volume sbloccato il kernel decifra per le sessioni autorizzate: lì a decidere sono i permessi.'
    ],
    errori: [
      ['Credere che i permessi proteggano un disco rimosso.', 'Sono dati scritti negli inode. Li applica il kernel, e soltanto quando è in funzione.'],
      ['Credere che la cifratura a riposo protegga da una sessione autorizzata.', 'Con il volume sbloccato il kernel consegna il testo in chiaro a chi ha il permesso.'],
      ['Dire che cosa vede un osservatore senza averne stabilito la posizione.', 'Lo stesso documento appare cifrato, in chiaro, oppure irraggiungibile, secondo il punto di osservazione.']
    ],
    saFare: ['Distinguere testo in chiaro e testo cifrato.', 'Indicare quale difesa agisce in ogni posizione dell’osservatore.', 'Applicare il cifrario giocattolo a un byte.'],
    esercizi: [
      { d: 'Con il cifrario giocattolo, il byte in chiaro 0x4E viene cifrato con la chiave 0x2A. Quale byte viene registrato sul disco? Rispondi in esadecimale.', segnaposto: 'Per esempio 0x1F', giuste: ['0x64', '64', '64h'],
        ok: '0100 1110 XOR 0010 1010 = 0110 0100, cioè 0x64.',
        diagnosi: [
          { se: ['0x6e', '6e', '6eh'], msg: 'Questo è l’OR. Lo XOR dà 0 dove i due bit sono uguali, anche quando valgono entrambi 1.' },
          { se: ['0x0a', '0a', 'a', '0xa', '0ah'], msg: 'Questo è l’AND. Lo XOR dà 1 dove i due bit sono diversi.' },
          { se: ['0x78', '78', '78h'], msg: 'Questa è la somma. Lo XOR lavora un bit alla volta, senza riporti.' }
        ],
        altro: 'Il valore è diverso. Si scrivano i due byte in binario, uno sotto l’altro, e si confrontino i bit di ogni colonna.',
        indizi: ['0x4E = 0100 1110, e 0x2A = 0010 1010.', 'Bit uguali danno 0, bit diversi danno 1: 0110 0100.', '0110 0100 = 0x64.'],
        svolgimento: ['0x4E = 0100 1110.', '0x2A = 0010 1010.', 'XOR: 0110 0100.', 'In esadecimale: 0x64.'] },
      { d: 'Un portatile viene rubato mentre è spento. Il volume è cifrato, e la chiave è rimasta segreta. Che cosa ottiene chi ne legge il disco?', guida: 'Si scelga la risposta.', o: [
        { t: 'Testo cifrato', ok: true, fb: 'I blocchi sono registrati in forma cifrata, e la chiave è assente.' },
        { t: 'Testo in chiaro', fb: 'Servirebbe la chiave, che a macchina spenta è assente dal disco.' },
        { t: 'Un errore di apertura', fb: 'L’errore lo restituisce il kernel a una open. Chi legge il disco rimosso evita il kernel.' }] },
      { d: 'Un volume è in chiaro. Un file ha i permessi 0600. Qualcuno rimuove il disco a macchina spenta e ne legge i blocchi. Che cosa ottiene dal file?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il contenuto in chiaro: i permessi li applica il kernel, che qui è spento', ok: true, fb: 'È il caso che la cifratura a riposo serve a coprire.' },
        { t: 'Un errore di apertura, per via dei permessi', fb: 'I permessi sono dati nell’inode. Senza il kernel in funzione nessuno li applica.' },
        { t: 'Testo cifrato', fb: 'Il volume è in chiaro: i byte registrati sono quelli del documento.' }] }
    ],
    sfida: ['cslez6_7_04_cryptofs', 'Cifratura del file system']
  }
});
