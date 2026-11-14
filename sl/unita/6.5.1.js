'use strict';
SL.unita651 = (() => {
  const VECCHIO = 65, NUOVO = 90;
  const esito = (p) => (p.rim === 'due' ? 'nulla' : 'nuovo');
  // f: 0 inizio · 1 scrittura · 2 lettura dall'altro nome · 3 prima rimozione · 4 seconda rimozione
  const stato = (p, f) => { const altro = p.nome === 'appunti' ? 'copia' : 'appunti', nomi = ['appunti', 'copia'].filter((n) => !(f >= 3 && n === p.nome) && !(f >= 4 && n === altro)); return { altro, nomi, link: nomi.length, byte: f >= 1 ? NUOVO : VECCHIO, vivo: nomi.length > 0 }; };
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], s = stato(p, f), wn = o.w * 0.26, wi = o.w * 0.34, wb = o.w * 0.26, xi = o.x + wn + (o.w - wn - wi - wb) / 2, xb = o.x + o.w - wb;
    ['appunti', 'copia'].forEach((n, k) => { const c = s.nomi.indexOf(n) >= 0, y = o.y + k * 64, uso = (f === 1 && n === p.nome) || (f === 2 && n === s.altro);
      els.push(el.box(pre + 'n' + k, o.x, y, wn, 54, 'directory · voce', c ? n + ' → inode 42' : n + ' · rimossa', c ? (uso ? 'att' : 'on') : 'err', { cls: 'stretta' }));
      if (c) els.push(el.linea(pre + 'l' + k, o.x + wn, y + 27, xi, o.y + 59, uso ? 'att' : 'on')); });
    els.push(el.box(pre + 'i', xi, o.y + 32, wi, 54, s.vivo ? 'inode 42 · metadati' : 'inode 42 · liberato', s.vivo ? 'collegamenti ' + s.link + ' · blocco 7' : 'collegamenti 0', !s.vivo ? 'err' : f >= 3 ? 'att' : 'on', { cls: 'stretta' }));
    if (s.vivo) els.push(el.linea(pre + 'lb', xi + wi, o.y + 59, xb, o.y + 59, f === 1 || f === 2 ? 'att' : 'on'));
    els.push(el.box(pre + 'b', xb, o.y + 32, wb, 54, s.vivo ? 'blocco 7 · dati' : 'blocco 7 · libero', s.vivo ? 'primo byte ' + s.byte : 'riutilizzabile', !s.vivo ? 'zero' : f === 1 || f === 2 ? 'att' : 'on', { cls: 'stretta' }));
    return els;
  };
  return { VECCHIO, NUOVO, esito, stato, quadro };
})();
SL.registra('6.5.1', {
  titolo: 'File, metadati e nomi nelle directory',
  obiettivo: 'Obiettivo: distinguere il nome di un file dal file stesso, seguire due nomi fino al medesimo inode, e stabilire che cosa accade ai dati quando un nome è rimosso.',
  concetti: [['file', 'Il nome non è il file'], ['inode', 'Un inode descrive il file'], ['folder', 'Due nomi, i medesimi dati']],
  filigrana: ['inode', 'folder', 'file'],
  richiami: {
    carte: [
      { sim: 'file', da: 'Dall’unità 1.1.1', t: 'Il file', d: 'Una sequenza di dati conservata su disco sotto un nome.' },
      { sim: 'folder', da: 'Dall’unità 1.1.4', t: 'La directory', d: 'Un contenitore di file e di altre directory.' },
      { sim: 'byte', da: 'Dall’unità 4.5.2', t: 'Il blocco logico', d: 'Una delle porzioni di uguale dimensione, numerate da zero, in cui un disco si presenta al software che lo impiega.' }
    ],
    domanda: { d: 'Prima di proseguire: un disco si presenta come una sequenza di blocchi numerati. Che cosa manca, in tale sequenza, perché si possa parlare di «file»?', o: [
      { t: 'Un’organizzazione che indichi quali blocchi formano ciascun file, e sotto quale nome', ok: true, fb: 'È il compito del file system, l’argomento di questo capitolo.' },
      { t: 'Nulla, poiché ogni blocco è un file', fb: 'Un file può occupare molti blocchi, oppure una parte di uno solo.' },
      { t: 'Un processore più veloce', fb: 'La velocità è irrilevante: manca una struttura che assegni un significato ai blocchi.' }
    ] }
  },
  idea: {
    titolo: 'Un file ha un numero prima di avere un nome',
    termini: ['metadati', 'inode', 'hard link', 'unlink'],
    testo: [
      'Nel Modulo I un file era «una sequenza di dati sotto un nome». L’unità esamina il modo in cui il sistema la realizza, a partire da una sequenza di blocchi numerati. Occorrono tre elementi distinti, conservati in tre strutture diverse: i dati, la descrizione del file, e il nome.',
      'I dati si trovano in alcuni blocchi del disco. La descrizione del file comprende la lunghezza, il proprietario, i permessi, le date, e soprattutto l’elenco dei blocchi che contengono i dati. Tali informazioni, che descrivono il file senza farne parte, prendono il nome di [[metadati]]. Il sistema li conserva in una struttura di piccole dimensioni, l’[[inode]], e ogni inode ha un numero. Per il sistema il file coincide con il suo inode: l’inode 42, per esempio.',
      'Nell’inode è assente un elemento: il nome. I nomi si trovano nelle directory. Una directory è un elenco di voci, e ogni voce associa un nome a un numero di inode. L’apertura di «appunti» consiste nel cercare tale nome nella directory, leggere il numero associato, raggiungere l’inode con tale numero, e da questo i blocchi.',
      { fig: 'scena', w: 720, h: 130, titolo: 'Due nomi nella directory, un solo inode', nota: 'Le voci «appunti» e «copia» conducono entrambe all’inode 42, che indica il blocco 7. I dati esistono in copia unica.', els: SL.unita651.quadro('g', { nome: 'appunti', rim: 'una' }, 0, { x: 10, y: 4, w: 700 }) },
      'Da tale separazione discende una possibilità: due voci di directory possono contenere il medesimo numero di inode. Ciascuna è un [[hard link]], cioè un collegamento diretto all’inode. I due nomi sono equivalenti: nessuno dei due è «l’originale», e nessuno è una copia. Una modifica scritta nel file attraverso un nome si legge attraverso l’altro, poiché i blocchi raggiunti sono i medesimi. L’inode conserva il numero delle voci che lo indicano.',
      'Il medesimo contatore spiega la cancellazione. L’operazione che rimuove un nome da una directory prende il nome di [[unlink]]: rimuove il collegamento, e decrementa di uno il contatore. Finché il contatore resta maggiore di zero il file continua a esistere, raggiungibile dai nomi residui. Quando scende a zero nessun nome conduce più all’inode, e il sistema libera l’inode e i suoi blocchi. La cancellazione di un file consiste pertanto nella rimozione del suo ultimo nome.'
    ]
  },
  esperimento: {
    faremo: [
      'Una directory contiene due nomi, «appunti» e «copia», che indicano il medesimo inode. Il primo byte del file vale 65. L’esperimento scrive 90 attraverso un nome, legge attraverso l’altro, e quindi rimuove uno o entrambi i nomi.',
      'I controlli fissano il nome impiegato per la scrittura, che è anche il primo a essere rimosso, e la rimozione di uno solo dei nomi oppure di entrambi. Il contatore dei collegamenti va seguito a ogni passo.'
    ],
    vedrai: [
      ['folder', 'Le voci della directory', 'A sinistra: i due nomi, ciascuno con il numero di inode a cui conduce.'],
      ['inode', 'L’inode', 'Al centro: l’inode 42, con il contatore dei collegamenti e il blocco dei dati.'],
      ['byte', 'Il blocco dei dati', 'A destra: il blocco 7, con il valore del primo byte.']
    ]
  },
  lab: {
    titolo: 'Due nomi per il medesimo file',
    scena: { w: 860, h: 130 },
    atti: ['Due nomi', 'Scrivere e leggere', 'Rimuovere'],
    controlli: [
      { id: 'nome', tipo: 'scelta', eti: 'Nome impiegato per scrivere, e quindi rimosso', opzioni: [['appunti', 'appunti'], ['copia', 'copia']], valore: 'appunti' },
      { id: 'rim', tipo: 'scelta', eti: 'Nomi rimossi', opzioni: [['una', 'soltanto tale nome'], ['due', 'tutti e due']], valore: 'una' }
    ],
    nota: 'Il numero dei passi dipende dalle rimozioni. Il file occupa un solo blocco, il 7, e il suo primo byte vale 65.',
    previsione: {
      domanda: (p) => { const altro = p.nome === 'appunti' ? 'copia' : 'appunti'; return '«appunti» e «copia» indicano il medesimo inode, e il primo byte del file vale 65. Un programma scrive 90 in luogo del primo byte attraverso «' + p.nome + '», e quindi rimuove «' + p.nome + '»' + (p.rim === 'due' ? ' e anche «' + altro + '».' : '.') + ' Al termine, che cosa si legge del primo byte?'; },
      opzioni: () => [['nuovo', '90, attraverso il nome residuo'], ['vecchio', '65, attraverso il nome residuo'], ['nulla', 'Nulla, poiché il file non esiste più']]
    },
    confronto: (pred, esito, p) => { const N = { nuovo: 'si legge 90', vecchio: 'si legge 65', nulla: 'il file non esiste più' }; return 'La previsione indicava «' + N[pred] + '». Al termine ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'nulla' ? 'Rimosso anche il secondo nome, il contatore dei collegamenti scende a zero, e il sistema libera inode e blocco.' : pred === 'vecchio' ? 'I due nomi indicano il medesimo inode e il medesimo blocco: una copia separata dei dati non esiste.' : 'La rimozione ha eliminato un nome. L’altro nome conduce ancora all’inode, e il contatore vale 1.'); },
    costruisci(p) {
      const U = SL.unita651, passi = [], altro = p.nome === 'appunti' ? 'copia' : 'appunti';
      const P = (f, atto, titolo, testo, extra) => { const s = U.stato(p, f); passi.push(Object.assign({ atto, titolo, testo, hud: [['Collegamenti', String(s.link), 'a'], ['Primo byte', s.vivo ? String(s.byte) : '·', 'c'], ['Nomi', s.nomi.length ? s.nomi.join(', ') : 'nessuno']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra)); };
      P(0, 0, 'Due nomi, un inode', 'La directory contiene due voci, «appunti» e «copia», entrambe con il numero 42. L’inode 42 conta 2 collegamenti, e indica il blocco 7, il cui primo byte vale 65.', {});
      P(1, 1, 'Scrittura attraverso «' + p.nome + '»', 'Il programma apre «' + p.nome + '»: la voce conduce all’inode 42, e l’inode al blocco 7. Il programma scrive 90 in luogo del primo byte. Il blocco è modificato, mentre le voci della directory sono invariate.', { calc: 'blocco 7 · primo byte 65 → 90', chiedi: { d: 'Che cosa si legge ora aprendo l’altro nome, «' + altro + '»?', o: ['90, poiché i dati sono i medesimi', '65, poiché «' + altro + '» dispone di una propria copia'], g: 0, no: 'Anche «' + altro + '» conduce all’inode 42, e pertanto al blocco 7.' } });
      P(2, 1, 'Lettura attraverso «' + altro + '»', 'Il programma apre «' + altro + '». La voce conduce al medesimo inode 42, e al medesimo blocco 7. Il primo byte vale 90.', { calc: '«' + altro + '» → inode 42 → blocco 7 → 90' });
      P(3, 2, 'unlink di «' + p.nome + '»', 'Il programma rimuove il nome «' + p.nome + '». La voce è eliminata dalla directory, e il contatore dei collegamenti scende da 2 a 1. Inode e blocco restano invariati, raggiungibili attraverso «' + altro + '».', Object.assign({ calc: 'collegamenti 2 → 1' }, p.rim === 'una' ? { esito: ['90, attraverso «' + altro + '»', 'si'] } : {}));
      if (p.rim === 'due') P(4, 2, 'unlink di «' + altro + '»', 'Il programma rimuove anche «' + altro + '». Il contatore scende da 1 a 0: nessun nome conduce più all’inode 42. Il sistema libera l’inode e segna il blocco 7 come riutilizzabile. Il file non esiste più.', { calc: 'collegamenti 1 → 0 · inode e blocco liberati', esito: ['il file non esiste più', ''] });
      return { passi, esito: U.esito(p) };
    }
  },
  bilancio: {
    regola: [
      'Una voce di directory associa un nome a un numero di inode. L’inode contiene i metadati e l’elenco dei blocchi, e i dati si trovano nei blocchi.',
      'unlink rimuove un nome e decrementa il contatore dei collegamenti. Quando il contatore vale zero, il sistema libera inode e blocchi.'
    ],
    errori: [
      ['Ritenere che il nome si trovi all’interno del file.', 'Il nome si trova nella directory. L’inode non conserva i propri nomi, e ne registra soltanto il numero.'],
      ['Confondere un hard link con una copia.', 'Un secondo nome lascia i dati in copia unica: conduce al medesimo inode e ai medesimi blocchi.'],
      ['Ritenere che la rimozione di un nome cancelli sempre i dati.', 'I dati sono liberati soltanto quando il contatore dei collegamenti scende a zero.']
    ],
    saFare: ['Seguire un nome fino all’inode e ai blocchi.', 'Aggiornare il contatore dei collegamenti dopo link e unlink.', 'Stabilire quando i dati di un file sono liberati.'],
    esercizi: [
      { d: 'Un inode ha 1 collegamento. Sono creati altri 2 hard link, e quindi è rimosso uno dei tre nomi. Quanto vale il contatore dei collegamenti?', segnaposto: 'Un numero', giuste: ['2', 'due'],
        ok: '1 + 2 − 1 = 2.',
        diagnosi: [
          { se: ['3', 'tre'], msg: 'Tre è il valore prima della rimozione. Ogni unlink rimuove un collegamento.' },
          { se: ['0', 'zero'], msg: 'È stato rimosso un solo nome, e ne restano altri due.' },
          { se: ['1', 'uno'], msg: 'I nuovi collegamenti sono due, e la rimozione è una sola.' }
        ],
        altro: 'Il numero è diverso. Si aggiunga 1 per ogni hard link creato e si sottragga 1 per ogni nome rimosso.',
        indizi: ['Valore iniziale: 1.', 'Due nuovi hard link: 3.', 'Una rimozione: 2.'],
        svolgimento: ['1 + 2 = 3.', '3 − 1 = 2.'] },
      { d: 'Un file di 10 000 byte ha due nomi, creati con un hard link. Quanto spazio occupano complessivamente i suoi dati sul disco?', guida: 'Si scelga la risposta.', o: [
        { t: 'Quello di un solo file da 10 000 byte', ok: true, fb: 'I due nomi conducono ai medesimi blocchi.' },
        { t: 'Il doppio, 20 000 byte', fb: 'Sarebbe vero per una copia. Un hard link aggiunge soltanto una voce di directory.' },
        { t: 'Nessuno, fino all’apertura del file', fb: 'I blocchi sono occupati dal momento della scrittura dei dati.' }] },
      { d: 'Dove si trova il nome di un file?', guida: 'Si scelga la risposta.', o: [
        { t: 'In una voce di directory, accanto al numero di inode', ok: true, fb: 'Per questa ragione il medesimo inode può avere più nomi.' },
        { t: 'Nell’inode, insieme agli altri metadati', fb: 'L’inode contiene lunghezza, permessi e blocchi. Dei nomi conserva soltanto il conteggio.' },
        { t: 'Nel primo blocco dei dati', fb: 'I blocchi contengono soltanto il contenuto del file.' }] }
    ],
    sfida: ['cslez6_5_01_files_metadata', 'File e metadati']
  }
});
