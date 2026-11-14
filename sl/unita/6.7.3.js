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
    els.push(el.nota(pre + 't0', o.x, o.y, 'IL DISCO · i byte del documento nella forma registrata', 'mono', f === 0 ? 'att' : ''));
    sulDisco(p).forEach((b, k) => els.push(el.cella(pre + 'd' + k, o.x + k * (wc + 6), o.y + 24, wc, 32, H(b), f === 0 || (f === 4 && disco) ? 'att' : cif ? 'on' : 'zero', { piccola: true })));
    els.push(el.box(pre + 'v', x3, o.y + 12, w3, 54, 'volume', cif ? 'cifrato · chiave 2A' : 'in chiaro', f === 0 ? 'att' : 'on', { cls: 'stretta' }));
    els.push(el.box(pre + 'o', o.x, o.y + 78, w3, 54, 'l’osservatore', f >= 1 ? (disco ? 'legge il disco rimosso' : 'in una sessione') : '·', f === 1 ? 'att' : f > 1 ? 'on' : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'k', o.x + w3 + 10, o.y + 78, w3, 54, 'la chiave', f >= 2 ? (!cif ? 'nessuna: volume in chiaro' : disco ? 'assente: sistema spento' : 'nella memoria del kernel') : '·', f >= 2 ? (!cif ? 'zero' : disco ? 'err' : f === 2 ? 'att' : 'on') : '', { cls: 'stretta' }));
    els.push(el.box(pre + 'p', x3, o.y + 78, w3, 54, 'controllo dei permessi', f >= 3 ? (disco ? 'omesso: kernel spento' : p.dove === 'ok' ? 'lettura concessa' : 'lettura negata') : '·', f >= 3 ? (disco ? 'zero' : p.dove === 'ok' ? (f === 3 ? 'att' : 'on') : 'err') : '', { cls: 'stretta' }));
    els.push(el.nota(pre + 't1', o.x, o.y + 144, 'CHE COSA OTTIENE L’OSSERVATORE · i quattro byte', 'mono', f === 4 ? 'att' : ''));
    [0, 1, 2, 3].forEach((k) => els.push(el.cella(pre + 'r' + k, o.x + k * (wc + 6), o.y + 168, wc, 32, f >= 4 ? (e === 'errore' ? '' : e === 'chiaro' ? PAROLA[k] : H(cifrato[k])) : '', f >= 4 ? (e === 'errore' ? 'err' : e === 'chiaro' ? 'att' : 'on') : '', { piccola: true })));
    els.push(el.box(pre + 'e', x3, o.y + 156, w3, 54, 'esito', f >= 4 ? (e === 'chiaro' ? 'testo in chiaro' : e === 'cifrato' ? 'testo cifrato' : '−13 · EACCES') : '·', f >= 4 ? (e === 'errore' ? 'err' : 'att') : '', { cls: 'stretta' }));
    return els;
  };
  return { PAROLA, CHIAVE, H, chiaro, cifrato, sulDisco, esito, fila, quadro };
})();
SL.registra('6.7.3', {
  titolo: 'Cifratura e posizione dell’avversario',
  obiettivo: 'Obiettivo: stabilire che cosa ottiene un osservatore del documento, secondo il punto da cui vi accede: dal disco rimosso, oppure attraverso una sessione del sistema acceso.',
  concetti: [['lente', 'La posizione dell’osservatore è determinante'], ['chiave', 'Senza chiave, byte privi di significato'], ['scudo', 'Permessi e cifratura coprono avversari diversi']],
  filigrana: ['chiave', 'disco', 'scudo'],
  richiami: {
    carte: [
      { sim: 'privilegi', da: 'Dall’unità 6.7.2', t: 'I controlli del kernel', d: 'A ogni open il kernel controlla i permessi lungo il percorso e sul file.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'Lo XOR', d: 'Vale 1 quando i due bit sono diversi, e 0 quando sono uguali.' },
      { sim: 'inode', da: 'Dall’unità 6.5.1', t: 'I permessi si trovano nell’inode', d: 'Sono metadati, registrati sul disco insieme al resto del file system.' }
    ],
    domanda: { d: 'Prima di proseguire: quale componente applica i permessi di un file, quando un programma ne richiede l’apertura?', o: [
      { t: 'Il kernel, durante la open', ok: true, fb: 'I permessi sono dati scritti nell’inode, letti e applicati dal kernel.' },
      { t: 'Il disco, che rifiuta di consegnare i blocchi', fb: 'Il disco consegna qualunque blocco gli sia richiesto. La decisione spetta al kernel.' },
      { t: 'Il programma stesso', fb: 'Un programma potrebbe ignorarli. Per questa ragione la decisione spetta al kernel.' }
    ] }
  },
  idea: {
    titolo: 'La posizione dell’osservatore',
    termini: ['testo in chiaro', 'testo cifrato', 'chiave di cifratura', 'cifratura a riposo'],
    testo: [
      'I permessi dell’unità precedente si fondano su un presupposto implicito: sono efficaci finché alle richieste risponde il kernel. L’apertura di un file con una open passa necessariamente dal kernel. La rimozione del disco da una macchina spenta, e il suo collegamento a un altro calcolatore, consente invece di leggere i blocchi direttamente, senza alcun controllo. I permessi sono scritti negli inode, e un inode, letto come semplice blocco, è un dato ordinario.',
      'Contro questo secondo avversario occorre una difesa diversa: la registrazione sul disco dei byte in una forma trasformata. I byte originali prendono il nome di [[testo in chiaro]], quelli trasformati di [[testo cifrato]]. La trasformazione dipende da un segreto, la [[chiave di cifratura]]: con la chiave è possibile risalire dal testo cifrato a quello in chiaro, mentre senza la chiave si ottengono byte privi di significato. Quando la trasformazione protegge i dati conservati su un supporto si parla di [[cifratura a riposo]].',
      'Il principio è illustrato da un cifrario dimostrativo: ogni byte è combinato con la chiave attraverso lo XOR dell’unità 1.5.1. La parola VOTO è composta dai byte ' + SL.unita673.fila(SL.unita673.chiaro) + '. Con la chiave 2A divengono ' + SL.unita673.fila(SL.unita673.cifrato) + '. Lo XOR ha una proprietà utile: applicato una seconda volta con la medesima chiave restituisce il byte di partenza. Un cifrario tanto semplice è violato in pochi tentativi, poiché le chiavi possibili sono soltanto 256. I cifrari reali seguono il medesimo schema, con chiavi di centinaia di bit e trasformazioni che resistono anche a un avversario che conosce il procedimento. L’esperimento assume un cifrario sicuro, e una chiave rimasta segreta.',
      { fig: 'scena', w: 720, h: 218, titolo: 'Il disco rimosso da una macchina spenta, con il volume cifrato', nota: 'L’osservatore legge i blocchi senza passare dal kernel. La chiave è assente, e i byte ottenuti sono quelli registrati: testo cifrato.', els: SL.unita673.quadro('g', { dove: 'disco', vol: 'cifrato' }, 4, { x: 10, y: 4, w: 700 }) },
      'Quando la macchina è accesa la situazione è diversa. All’avvio un utente sblocca il volume fornendo la chiave, e da quel momento il kernel la conserva in memoria: a ogni lettura decifra i blocchi, a ogni scrittura li cifra. Per i programmi l’operazione è trasparente, e una sessione autorizzata riceve il documento in chiaro. Ne segue che la cifratura a riposo è inefficace contro un avversario che opera in una sessione, posizione in cui la decisione spetta di nuovo ai permessi. Una sessione con la lettura negata riceve un errore. Una sessione con la lettura concessa riceve il testo in chiaro, indipendentemente dalla cifratura del volume.',
      'Le due difese coprono pertanto avversari in posizioni diverse: i permessi respingono le richieste che passano dal kernel, mentre la cifratura protegge dalla lettura diretta del supporto. Per stabilire che cosa ottiene un osservatore occorre anzitutto stabilirne la posizione.'
    ]
  },
  esperimento: {
    faremo: [
      'Un documento contiene la parola VOTO. I controlli fissano la posizione dell’osservatore che tenta di leggerlo, e lo stato del volume, cifrato oppure in chiaro.',
      'L’esperimento segue la chiave e il controllo dei permessi, fino ai byte ottenuti. Con il disco rimosso e il volume in chiaro i permessi del file sono presenti, e nessun componente li applica.'
    ],
    vedrai: [
      ['disco', 'Il disco', 'In alto: i quattro byte nella forma registrata, e lo stato del volume.'],
      ['chiave', 'Le difese', 'Al centro: la posizione dell’osservatore, la chiave, e il controllo dei permessi.'],
      ['output', 'Il risultato', 'In basso: i byte che l’osservatore ottiene, e l’esito.']
    ]
  },
  lab: {
    titolo: 'Il medesimo documento, da tre posizioni',
    scena: { w: 860, h: 218 },
    atti: ['Il documento', 'L’osservatore', 'I permessi', 'Il risultato'],
    controlli: [
      { id: 'dove', tipo: 'scelta', eti: 'Osservatore', opzioni: [['disco', 'disco rimosso a macchina spenta'], ['ok', 'sessione con lettura concessa'], ['no', 'sessione con lettura negata']], valore: 'disco' },
      { id: 'vol', tipo: 'scelta', eti: 'Volume', opzioni: [['cifrato', 'cifrato'], ['chiaro', 'in chiaro']], valore: 'cifrato' }
    ],
    nota: 'I passi sono sempre cinque. Il cifrario dimostrativo ha lo scopo di rendere visibili i byte: l’esperimento assume un cifrario sicuro e una chiave rimasta segreta.',
    previsione: {
      domanda: (p) => 'Un documento contiene la parola VOTO, su un volume ' + (p.vol === 'cifrato' ? 'cifrato' : 'in chiaro') + '. ' + (p.dove === 'disco' ? 'Un avversario rimuove il disco a macchina spenta e ne legge i blocchi.' : 'La macchina è accesa, e un programma richiede l’apertura del documento da una sessione che ha la lettura ' + (p.dove === 'ok' ? 'concessa.' : 'negata.')) + ' Che cosa ottiene?',
      opzioni: () => [['chiaro', 'Il documento in chiaro'], ['cifrato', 'Byte cifrati, illeggibili senza la chiave'], ['errore', 'Un errore di apertura, e nessun byte']]
    },
    confronto: (pred, esito, p) => { const N = { chiaro: 'il documento in chiaro', cifrato: 'byte cifrati', errore: 'un errore di apertura' }; return 'La previsione indicava ' + N[pred] + '. L’osservatore ottiene ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.dove === 'disco' ? (p.vol === 'cifrato' ? 'La lettura del disco rimosso evita il kernel e i suoi controlli, e fornisce i byte nella forma registrata, cioè cifrati.' : 'La lettura del disco rimosso evita il kernel: i permessi restano scritti nell’inode, e nessun componente li applica. Il volume è in chiaro, e i byte sono quelli del documento.') : p.dove === 'ok' ? 'La sessione passa dal kernel, che concede la lettura' + (p.vol === 'cifrato' ? ' e decifra i blocchi con la chiave conservata in memoria.' : '.') : 'La sessione passa dal kernel, che nega la lettura' + (p.vol === 'cifrato' ? '. Il volume era sbloccato: la richiesta è respinta dai permessi.' : '.')); },
    costruisci(p) {
      const U = SL.unita673, e = U.esito(p), cif = p.vol === 'cifrato', disco = p.dove === 'disco', passi = [];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: [['Chiave', f >= 2 ? (!cif ? 'nessuna' : disco ? 'assente' : 'in memoria') : '·', 'a'], ['Permessi', f >= 3 ? (disco ? 'omessi' : p.dove === 'ok' ? 'concessi' : 'negati') : '·'], ['Ottiene', f >= 4 ? (e === 'chiaro' ? 'in chiaro' : e === 'cifrato' ? 'cifrato' : 'errore') : '·', 'c']], els: U.quadro('b', p, f, { x: 20, y: 4, w: 820 }) }, extra));
      P(0, 0, 'Il documento', 'Il documento contiene la parola VOTO: quattro caratteri, cioè i byte ' + U.fila(U.chiaro) + '. ' + (cif ? 'Il volume è cifrato. Ogni byte è registrato dopo lo XOR con la chiave 2A, e sul disco si trovano ' + U.fila(U.cifrato) + '.' : 'Il volume è in chiaro: sul disco si trovano i medesimi byte.'), { calc: cif ? U.fila(U.chiaro) + ' XOR 2A → ' + U.fila(U.cifrato) : 'sul disco: ' + U.fila(U.chiaro) });
      P(1, 1, 'L’osservatore', disco ? 'Un avversario rimuove il disco a macchina spenta, e lo collega a un proprio calcolatore, da cui legge i blocchi direttamente, in successione.' : 'La macchina è accesa, e il sistema ha aperto il volume all’avvio. L’osservatore opera all’interno di una sessione: per raggiungere il documento deve richiedere una open al kernel.', {});
      P(2, 1, 'La chiave', !cif ? 'Il volume è in chiaro: per leggerne i blocchi nessuna chiave è necessaria.' : disco ? 'La chiave si trovava nella memoria del sistema, che è spento. Sul disco è assente, e l’osservatore ne è privo.' : 'All’avvio un utente ha sbloccato il volume, fornendo la chiave. Da quel momento il kernel la conserva in memoria, e decifra i blocchi a ogni lettura.', { calc: 'chiave: ' + (!cif ? 'nessuna' : disco ? 'assente' : 'nella memoria del kernel') });
      P(3, 2, 'I permessi', disco ? 'I permessi del file sono scritti nell’inode, e sono applicati dal kernel. In questo caso il kernel è spento, e il controllo è omesso: l’osservatore legge i blocchi senza alcuna open.' : 'Il kernel controlla il permesso di lettura dell’account sul documento. ' + (p.dove === 'ok' ? 'È concesso.' : 'È negato.'), Object.assign({ calc: 'permessi: ' + (disco ? 'omessi' : p.dove === 'ok' ? 'lettura concessa' : 'lettura negata') }, disco ? { chiedi: { d: 'Il documento ha i permessi 0600. Tali permessi impediscono la lettura del disco rimosso?', o: ['No, li applica soltanto il kernel in funzione', 'Sì, sono scritti sul disco'], g: 0, no: 'Sono scritti sul disco, come dati, e sono applicati dal kernel, che in questo caso è spento.' } } : {}));
      P(4, 3, 'I byte ottenuti', disco ? (cif ? 'L’osservatore ottiene ' + U.fila(U.cifrato) + ': testo cifrato. Senza la chiave, e con un cifrario sicuro, da questi byte il documento resta illeggibile.' : 'L’osservatore ottiene ' + U.fila(U.chiaro) + ', cioè VOTO: testo in chiaro. I permessi sono rimasti sul disco, senza alcun componente che li applicasse.') : p.dove === 'ok' ? (cif ? 'Il kernel legge i blocchi, li decifra con la chiave, e consegna VOTO alla sessione: testo in chiaro. Per una sessione autorizzata la cifratura è trasparente.' : 'Il kernel legge i blocchi e consegna VOTO alla sessione: testo in chiaro.') : 'La open restituisce −13, EACCES, e la sessione non ottiene alcun byte del documento. ' + (cif ? 'Il volume era sbloccato: la richiesta è stata respinta dai permessi, e la cifratura è in questo caso irrilevante.' : 'La richiesta è stata respinta dai permessi.'), { esito: [e === 'chiaro' ? 'testo in chiaro' : e === 'cifrato' ? 'testo cifrato' : 'errore di apertura', ''] });
      return { passi, esito: e };
    }
  },
  bilancio: {
    regola: [
      'I permessi respingono le richieste che passano dal kernel. La cifratura a riposo protegge dalla lettura del supporto senza la chiave.',
      'Con il volume sbloccato il kernel decifra per le sessioni autorizzate: in tale posizione la decisione spetta ai permessi.'
    ],
    errori: [
      ['Ritenere che i permessi proteggano un disco rimosso.', 'Sono dati scritti negli inode, applicati dal kernel soltanto quando è in funzione.'],
      ['Ritenere che la cifratura a riposo protegga da una sessione autorizzata.', 'Con il volume sbloccato il kernel consegna il testo in chiaro alle sessioni che hanno il permesso.'],
      ['Stabilire che cosa ottiene un osservatore senza averne determinato la posizione.', 'Il medesimo documento appare cifrato, in chiaro, oppure irraggiungibile, secondo il punto di osservazione.']
    ],
    saFare: ['Distinguere testo in chiaro e testo cifrato.', 'Indicare quale difesa agisce in ogni posizione dell’osservatore.', 'Applicare il cifrario dimostrativo a un byte.'],
    esercizi: [
      { d: 'Con il cifrario dimostrativo, il byte in chiaro 0x4E è cifrato con la chiave 0x2A. Quale byte è registrato sul disco? Si risponda in esadecimale.', segnaposto: 'Per esempio 0x1F', giuste: ['0x64', '64', '64h'],
        ok: '0100 1110 XOR 0010 1010 = 0110 0100, cioè 0x64.',
        diagnosi: [
          { se: ['0x6e', '6e', '6eh'], msg: 'Questo è l’OR. Lo XOR vale 0 dove i due bit sono uguali, anche quando valgono entrambi 1.' },
          { se: ['0x0a', '0a', 'a', '0xa', '0ah'], msg: 'Questo è l’AND. Lo XOR vale 1 dove i due bit sono diversi.' },
          { se: ['0x78', '78', '78h'], msg: 'Questa è la somma. Lo XOR opera un bit per volta, senza riporti.' }
        ],
        altro: 'Il valore è diverso. Si scrivano i due byte in binario, uno sotto l’altro, e si confrontino i bit di ogni colonna.',
        indizi: ['0x4E = 0100 1110, e 0x2A = 0010 1010.', 'Bit uguali forniscono 0, bit diversi forniscono 1: 0110 0100.', '0110 0100 = 0x64.'],
        svolgimento: ['0x4E = 0100 1110.', '0x2A = 0010 1010.', 'XOR: 0110 0100.', 'In esadecimale: 0x64.'] },
      { d: 'Un portatile è sottratto mentre è spento. Il volume è cifrato, e la chiave è rimasta segreta. Che cosa ottiene un avversario che ne legge il disco?', guida: 'Si scelga la risposta.', o: [
        { t: 'Testo cifrato', ok: true, fb: 'I blocchi sono registrati in forma cifrata, e la chiave è assente.' },
        { t: 'Testo in chiaro', fb: 'Occorrerebbe la chiave, che a macchina spenta è assente dal disco.' },
        { t: 'Un errore di apertura', fb: 'L’errore è restituito dal kernel a una open. La lettura del disco rimosso evita il kernel.' }] },
      { d: 'Un volume è in chiaro, e un file ha i permessi 0600. Un avversario rimuove il disco a macchina spenta e ne legge i blocchi. Che cosa ottiene dal file?', guida: 'Si scelga la risposta.', o: [
        { t: 'Il contenuto in chiaro, poiché i permessi sono applicati dal kernel, che è spento', ok: true, fb: 'È il caso da cui protegge la cifratura a riposo.' },
        { t: 'Un errore di apertura, per effetto dei permessi', fb: 'I permessi sono dati nell’inode. Senza il kernel in funzione nessun componente li applica.' },
        { t: 'Testo cifrato', fb: 'Il volume è in chiaro: i byte registrati sono quelli del documento.' }] }
    ],
    sfida: ['cslez6_7_04_cryptofs', 'Cifratura del file system']
  }
});
