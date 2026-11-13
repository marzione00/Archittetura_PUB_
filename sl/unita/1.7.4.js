'use strict';
SL.registra('1.7.4', {
  titolo: 'La politica di accesso come livello di rappresentazione',
  obiettivo: 'Alla fine saprai distinguere un byte di autorizzazione malformato da una richiesta ben scritta che la regola respinge, e spiegare perché la forma si controlla per prima.',
  concetti: [['bit', 'Bit riservati'], ['gate', 'Maschera'], ['privilegi', 'Politica di accesso']],
  filigrana: ['privilegi', 'gate', 'lucchetto'],
  richiami: {
    carte: [
      { sim: 'flag', da: 'Dall’unità 1.5.6', t: 'I bit di stato', d: 'Un byte può portare otto informazioni indipendenti, una per bit. I bit si numerano da destra, a partire da zero.' },
      { sim: 'gate', da: 'Dall’unità 1.5.3', t: 'Le maschere', d: 'L’AND bit a bit con una maschera conserva i bit dove la maschera vale 1 e azzera gli altri.' },
      { sim: 'porta', da: 'Dall’unità 1.5.1', t: 'AND e OR', d: 'AND vale 1 quando entrambi gli ingressi valgono 1. OR vale 1 quando almeno uno dei due vale 1.' }
    ],
    domanda: { d: 'Prima di proseguire: quanto vale 0x85 AND 0xF8? In binario i due numeri sono 1000 0101 e 1111 1000.', o: [
      { t: '0x80', ok: true, fb: 'La maschera conserva soltanto i bit nelle cinque posizioni di sinistra. Di 0x85 resta il bit 7.' },
      { t: '0x05', fb: 'Questi sono i bit che la maschera azzera. 0x05 è il risultato dell’AND con 0x07.' },
      { t: '0xFD', fb: 'Questo è il risultato dell’OR. L’AND conserva un bit soltanto se vale 1 in entrambi i numeri.' }
    ] }
  },
  idea: {
    titolo: 'Prima la forma, poi la decisione',
    termini: ['bit riservato', 'politica di accesso'],
    testo: [
      'Finora i byte hanno descritto misure. Gli stessi strumenti servono quando i byte descrivono chi può fare che cosa. La stazione meteorologica accetta anche richieste di modifica, per esempio per cambiare il nome di un sensore, e deve decidere se chi le invia ne ha il diritto.',
      'Nel nostro formato ogni richiesta è accompagnata da un byte di autorizzazione, costruito come i bit di stato dell’unità 1.5.6. Il bit 0, che chiameremo W, vale 1 se chi chiede possiede il permesso di scrittura. Il bit 1, chiamato O, vale 1 se chi chiede è il proprietario del sensore. Il bit 2, chiamato A, vale 1 se è un amministratore.',
      { fig: 'celle', titolo: 'Il byte di un amministratore con il permesso di scrittura', nota: 'Il byte vale 0x05. I cinque bit di sinistra sono riservati.', celle: [
        { so: 'bit 7', v: '0', gi: 'ris.' }, { so: 'bit 6', v: '0', gi: 'ris.' }, { so: 'bit 5', v: '0', gi: 'ris.' }, { so: 'bit 4', v: '0', gi: 'ris.' }, { so: 'bit 3', v: '0', gi: 'ris.' },
        { so: 'bit 2', v: '1', st: 'on', gi: 'A' }, { so: 'bit 1', v: '0', st: 'amb', gi: 'O' }, { so: 'bit 0', v: '1', st: 'on', gi: 'W' }] },
      'Agli altri cinque bit il formato lascia il significato da definire. Li tiene da parte per usi futuri e stabilisce che per ora devono valere zero. Un bit di questo tipo si chiama [[bit riservato]].',
      'La regola che stabilisce chi può modificare si chiama [[politica di accesso]]. La nostra chiede il permesso di scrittura e, in più, di essere il proprietario oppure un amministratore. Scritta con gli operatori del capitolo 1.5 diventa W AND (O OR A), una funzione booleana di tre ingressi.',
      'Prima di applicare la politica il programma deve chiedersi se il byte è ben formato. Un byte con un bit riservato acceso può venire da una versione più recente del formato, in cui quel bit significa qualcosa che il programma ignora. Può venire da un guasto di trasmissione. Può venire da qualcuno che prova valori a caso sperando in un errore. In tutti e tre i casi i tre bit di destra perdono la loro affidabilità.',
      'Per questo la verifica della forma precede la decisione. La [[maschera]] 0xF8 ha un 1 in ciascuna posizione riservata, e un solo AND isola i cinque bit. Se il risultato è diverso da zero il byte è malformato, e la richiesta viene rifiutata senza consultare la politica.',
      'I due rifiuti hanno significati diversi, e conviene tenerli distinti anche nei messaggi di errore. «Byte malformato» segnala un problema nei dati. «Accesso negato» segnala una richiesta ben scritta a cui la regola risponde di no.'
    ]
  },
  esperimento: {
    faremo: [
      'Arriva una richiesta di modifica con il suo byte di autorizzazione. Deciderai tu i tre bit W, O e A, e potrai accendere uno dei bit riservati.',
      'Seguiremo due verifiche in fila. La prima usa una maschera per controllare la forma del byte. La seconda isola i tre bit e applica la politica. Dopo il caso proposto, accendi il bit 7 lasciando gli altri come sono.'
    ],
    vedrai: [
      ['bit', 'Il byte', 'A sinistra, in alto: gli otto bit, con il nome di quelli che hanno un significato.'],
      ['gate', 'La maschera', 'A sinistra, sotto: la maschera dei bit riservati e il risultato dell’AND.'],
      ['privilegi', 'La politica', 'A destra: i tre bit isolati e i due passaggi della regola.']
    ]
  },
  lab: {
    titolo: 'Un byte di autorizzazione',
    scena: { w: 860, h: 366 },
    atti: ['Il byte ricevuto', 'La forma', 'I tre bit', 'La politica', 'La decisione'],
    nota: 'Il numero di passi dipende dai dati: un byte malformato viene rifiutato prima di arrivare alla politica.',
    controlli: [
      { id: 'W', tipo: 'scelta', eti: 'W · permesso di scrittura', opzioni: [[1, '1'], [0, '0']], valore: 1 },
      { id: 'O', tipo: 'scelta', eti: 'O · proprietario', opzioni: [[1, '1'], [0, '0']], valore: 0 },
      { id: 'A', tipo: 'scelta', eti: 'A · amministratore', opzioni: [[1, '1'], [0, '0']], valore: 1 },
      { id: 'R', tipo: 'scelta', eti: 'Bit riservato acceso', opzioni: [['n', 'nessuno'], [5, 'il bit 5'], [7, 'il bit 7']], valore: 'n' }
    ],
    previsione: {
      domanda: (p) => { const v = p.W | (p.O << 1) | (p.A << 2) | (p.R === 'n' ? 0 : 1 << p.R); return 'Il byte di autorizzazione vale 0x' + v.toString(16).toUpperCase().padStart(2, '0') + ', in binario ' + v.toString(2).padStart(8, '0').replace(/(....)(....)/, '$1 $2') + '. Come finirà la richiesta di modifica?'; },
      opzioni: () => [['ok', 'Modifica consentita'], ['forma', 'Rifiutata: byte malformato'], ['politica', 'Rifiutata: accesso negato']]
    },
    confronto: (pred, esito, p) => {
      const N = { ok: 'modifica consentita', forma: 'rifiuto per byte malformato', politica: 'rifiuto per accesso negato' };
      return 'Avevi previsto: ' + N[pred] + '. Esito: ' + N[esito] + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'forma' ? 'Il bit ' + p.R + ' è riservato ed è acceso. Il controllo della forma viene prima della politica e ferma la richiesta.' : esito === 'ok' ? 'I bit riservati valgono zero, il permesso di scrittura c’è e almeno uno dei due ruoli è presente.' : 'Il byte è ben formato, e la regola W AND (O OR A) dà 0 perché ' + (p.W ? 'mancano entrambi i ruoli.' : 'manca il permesso di scrittura.'));
    },
    costruisci(p) {
      const el = SL.el, passi = [];
      const v = p.W | (p.O << 1) | (p.A << 2) | (p.R === 'n' ? 0 : 1 << p.R);
      const H = (x) => '0x' + x.toString(16).toUpperCase().padStart(2, '0');
      const bit = (x) => x.toString(2).padStart(8, '0').split('').map(Number);
      const B = bit(v), M = bit(0xF8), ris = v & 0xF8, R = bit(ris), forma = ris === 0;
      const oa = p.O | p.A, pol = p.W & oa;
      const NOMI = ['ris.', 'ris.', 'ris.', 'ris.', 'ris.', 'A', 'O', 'W'];
      const stato = { forma: '·', pol: '·' };
      const X = (j) => 40 + j * 58;
      const quadro = (o) => {
        o = o || {};
        const att = o.att || [], els = [el.nota('t1', 40, 0, 'IL BYTE DI AUTORIZZAZIONE · ' + H(v), 'mono')];
        for (let j = 0; j < 8; j++) els.push(el.cella('x' + j, X(j), 46, 52, 50, String(B[j]), o.male && j < 5 && B[j] ? 'err' : att.includes(j) ? 'att' : B[j] ? 'on' : 'zero', { piccola: true, so: 'bit ' + (7 - j), gi: NOMI[j] }));
        if (o.masc || stato.forma === 'valida') {
          els.push(el.nota('t2', 40, 132, 'LA MASCHERA DEI BIT RISERVATI · 0xF8', 'mono'));
          for (let j = 0; j < 8; j++) els.push(el.cella('m' + j, X(j), 156, 52, 42, String(M[j]), o.masc === 'att' ? 'att' : M[j] ? 'on' : 'zero', { piccola: true }));
        }
        if (o.and || stato.forma === 'valida') {
          els.push(el.nota('t3', 40, 212, 'BYTE AND MASCHERA · ' + H(ris), 'mono'));
          for (let j = 0; j < 8; j++) els.push(el.cella('r' + j, X(j), 236, 52, 42, String(R[j]), R[j] ? 'err' : o.and === 'att' ? 'att' : 'zero', { piccola: true }));
        }
        const val = (x) => (x == null ? '·' : String(x));
        const st = (k, x) => (o.foc === k ? 'att' : x == null ? '' : 'on');
        els.push(el.box('bw', 540, 46, 90, 66, 'W', val(o.w), st('w', o.w)));
        els.push(el.box('bo', 640, 46, 90, 66, 'O', val(o.o), st('o', o.o)));
        els.push(el.box('ba', 740, 46, 90, 66, 'A', val(o.a), st('a', o.a)));
        els.push(el.box('boa', 540, 126, 120, 66, 'O OR A', val(o.oa), st('oa', o.oa)));
        els.push(el.box('bp', 670, 126, 160, 66, 'W AND (O OR A)', val(o.pol), st('pol', o.pol)));
        els.push(el.box('bf', 540, 206, 290, 72, 'forma del byte', o.forma || '·', o.forma ? (forma ? 'on' : 'err') : '', { sim: 'scudo', riga: true, cls: 'stretta' }));
        els.push(el.box('bd', 40, 296, 790, 62, 'decisione', o.dec || '·', o.dec ? (o.rifiuto ? 'err' : 'on') : '', { sim: 'lucchetto', riga: true }));
        return els;
      };
      const hud = () => [['Byte', H(v), 'a'], ['Forma', stato.forma], ['Politica', stato.pol, 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));
      const FORMA = forma ? 'bit riservati a zero' : 'bit riservato acceso';

      P({}, 0, 'Una richiesta di modifica', 'Qualcuno chiede di cambiare la configurazione di un sensore. La richiesta porta con sé un byte di autorizzazione, che vale ' + H(v) + '. Il formato dà un nome ai tre bit di destra e riserva gli altri cinque.');
      P({ masc: 'att' }, 1, 'La maschera dei bit riservati', 'Per isolare i bit riservati serve una maschera con un 1 in ciascuna delle loro posizioni, cioè nei cinque posti di sinistra. In binario è 1111 1000, in esadecimale 0xF8.', { calc: '1111 1000 = 0xF8' });
      P({ masc: true, and: 'att' }, 1, 'Il byte AND la maschera', 'L’operatore AND bit a bit conserva i bit del byte dove la maschera vale 1 e azzera gli altri tre. Il risultato vale ' + H(ris) + '.',
        { calc: H(v) + ' AND 0xF8 = ' + H(ris), chiedi: { d: 'Il risultato dell’AND vale ' + H(ris) + '. Il byte ha la forma prevista dal formato?', o: ['Sì', 'No'], g: forma ? 0 : 1, no: forma ? 'Il risultato è zero, quindi nessun bit riservato è acceso.' : 'Il risultato è diverso da zero, quindi almeno un bit riservato è acceso.' } });
      stato.forma = forma ? 'valida' : 'sbagliata';
      if (!forma) {
        P({ masc: true, and: true, male: true, forma: FORMA }, 1, 'La forma è sbagliata', 'Il risultato è diverso da zero: il bit ' + p.R + ', che il formato riserva, è acceso. Il byte esce dalle regole del formato.', { calc: H(ris) + ' ≠ 0', esito: ['malformato', 'no'] });
        stato.pol = 'non consultata';
        P({ masc: true, and: true, male: true, forma: FORMA, w: p.W, o: p.O, a: p.A, oa, pol, foc: 'pol' }, 3, 'Che cosa direbbe la politica da sola', 'Un programma che saltasse il controllo della forma guarderebbe soltanto i tre bit di destra, che valgono W = ' + p.W + ', O = ' + p.O + ', A = ' + p.A + '. La regola W AND (O OR A) darebbe ' + pol + ', e la modifica verrebbe ' + (pol ? 'consentita sulla base di un byte che il programma non sa interpretare per intero.' : 'negata. In questo caso i due programmi rifiuterebbero entrambi, con due motivi diversi.'),
          { calc: p.W + ' AND (' + p.O + ' OR ' + p.A + ') = ' + pol });
        P({ masc: true, and: true, male: true, forma: FORMA, dec: 'richiesta rifiutata: byte malformato', rifiuto: true }, 4, 'La richiesta è rifiutata', 'Un byte con un bit riservato acceso viene da una versione diversa del formato, da un guasto oppure da qualcuno che prova valori a caso. In tutti e tre i casi il significato degli altri bit è incerto. Il programma rifiuta la richiesta e lascia da parte la politica.', { calc: 'byte malformato' });
        return { passi, esito: 'forma' };
      }
      P({ masc: true, and: true, forma: FORMA }, 1, 'La forma è valida', 'Il risultato è zero: nessun bit riservato è acceso e il byte rispetta il formato. Da questo momento i tre bit di destra si possono leggere con fiducia.', { calc: H(ris) + ' = 0', esito: ['ben formato', 'si'] });
      P({ forma: FORMA, att: [7], w: p.W, foc: 'w' }, 2, 'Il bit W', 'Il bit 0 dice se chi chiede possiede il permesso di scrittura. Si isola con la maschera 0x01: il risultato è ' + (p.W ? 'diverso da zero, quindi W vale 1.' : 'zero, quindi W vale 0.'), { calc: H(v) + ' AND 0x01 = ' + H(v & 1) + ' → W = ' + p.W });
      P({ forma: FORMA, att: [6], w: p.W, o: p.O, foc: 'o' }, 2, 'Il bit O', 'Il bit 1 dice se chi chiede è il proprietario del sensore. La maschera è 0x02: il risultato è ' + (p.O ? 'diverso da zero, quindi O vale 1.' : 'zero, quindi O vale 0.'), { calc: H(v) + ' AND 0x02 = ' + H(v & 2) + ' → O = ' + p.O });
      P({ forma: FORMA, att: [5], w: p.W, o: p.O, a: p.A, foc: 'a' }, 2, 'Il bit A', 'Il bit 2 dice se chi chiede è un amministratore. La maschera è 0x04: il risultato è ' + (p.A ? 'diverso da zero, quindi A vale 1.' : 'zero, quindi A vale 0.'), { calc: H(v) + ' AND 0x04 = ' + H(v & 4) + ' → A = ' + p.A });
      P({ forma: FORMA, w: p.W, o: p.O, a: p.A, oa, foc: 'oa' }, 3, 'Uno dei due ruoli', 'La politica chiede che chi modifica sia il proprietario oppure un amministratore. È un OR: basta uno dei due bit. ' + (oa ? (p.O && p.A ? 'Qui valgono 1 entrambi.' : 'Qui vale 1 il bit ' + (p.O ? 'O.' : 'A.')) : 'Qui valgono 0 entrambi.'),
        { calc: 'O OR A = ' + p.O + ' OR ' + p.A + ' = ' + oa, chiedi: { d: 'La regola completa è W AND (O OR A). Con W = ' + p.W + ' e O OR A = ' + oa + ', la modifica è consentita?', o: ['Sì', 'No'], g: pol ? 0 : 1, no: pol ? 'I due ingressi dell’AND valgono 1, quindi il risultato è 1.' : 'L’AND vale 1 soltanto se entrambi gli ingressi valgono 1, e qui ' + (p.W ? 'il secondo vale 0.' : oa ? 'il primo vale 0.' : 'valgono 0 tutti e due.') } });
      stato.pol = pol ? 'consente' : 'nega';
      P({ forma: FORMA, w: p.W, o: p.O, a: p.A, oa, pol, foc: 'pol' }, 3, 'Il permesso insieme al ruolo', 'Oltre al ruolo serve il permesso di scrittura. È un AND: devono valere 1 tutti e due gli ingressi.', { calc: 'W AND (O OR A) = ' + p.W + ' AND ' + oa + ' = ' + pol, esito: [pol ? 'consente' : 'nega', pol ? 'si' : 'no'] });
      if (pol) P({ forma: FORMA, w: p.W, o: p.O, a: p.A, oa, pol, dec: 'modifica consentita' }, 4, 'La modifica è consentita', 'Il byte è ben formato e la politica risponde di sì. Il programma esegue la modifica richiesta.', { calc: 'forma valida · politica: 1' });
      else P({ forma: FORMA, w: p.W, o: p.O, a: p.A, oa, pol, dec: 'richiesta rifiutata: accesso negato', rifiuto: true }, 4, 'L’accesso è negato', 'Il byte è ben formato e la politica risponde di no, perché ' + (p.W ? 'chi chiede è privo di entrambi i ruoli.' : oa ? 'manca il permesso di scrittura.' : 'mancano sia il permesso di scrittura sia un ruolo.') + ' Il rifiuto riguarda il diritto di chi chiede, mentre i dati sono in ordine.', { calc: 'forma valida · politica: 0' });
      return { passi, esito: pol ? 'ok' : 'politica' };
    }
  },
  bilancio: {
    regola: [
      'Un byte di autorizzazione si verifica in due tempi. Prima la forma: i bit riservati devono valere zero, e una maschera lo controlla con un solo AND. Poi la politica, cioè una funzione booleana dei bit che hanno un significato.',
      'Un byte malformato viene rifiutato senza consultare la politica. I due rifiuti restano distinti: il primo riguarda i dati, il secondo il diritto di chi chiede.'
    ],
    errori: [
      ['Applicare la politica a un byte malformato.', 'Se un bit riservato è acceso, il significato degli altri bit è incerto. La risposta della politica sarebbe priva di fondamento.'],
      ['Trascurare i bit riservati perché oggi sono inutilizzati.', 'Una versione futura del formato potrebbe usarli per restringere i permessi. Un programma che li trascura concederebbe più del dovuto.'],
      ['Scambiare AND e OR nella regola.', 'W AND (O OR A) chiede il permesso insieme a uno dei due ruoli. Con W OR (O OR A) basterebbe uno qualunque dei tre bit.']
    ],
    saFare: ['Costruisco la maschera dei bit riservati di un formato.', 'Isolo un bit con una maschera e ne leggo il valore.', 'Applico una politica scritta come funzione booleana e distinguo i due tipi di rifiuto.'],
    esercizi: [
      { d: 'Nel formato di questa unità il bit 0 è W, il bit 1 è O e il bit 2 è A. Scrivi in esadecimale il byte di un amministratore con il permesso di scrittura, diverso dal proprietario.', segnaposto: 'Un byte, per esempio 0x1F', giuste: ['0x05', '05', '5', '0x5', '05h'],
        ok: 'Sono accesi il bit 2 e il bit 0: 0000 0101, cioè 0x05.',
        diagnosi: [
          { se: ['0x06', '06', '6', '0x6'], msg: '0x06 accende A e O, cioè amministratore e proprietario, e lascia spento il permesso di scrittura.' },
          { se: ['0x03', '03', '3', '0x3'], msg: '0x03 accende O e W: descrive il proprietario con il permesso di scrittura.' },
          { se: ['101', '00000101', '0b101', '0b00000101'], msg: 'I bit sono giusti. La domanda chiede il byte in esadecimale.' },
          { se: ['0x07', '07', '7', '0x7'], msg: '0x07 accende tutti e tre i bit, compreso quello del proprietario.' }
        ],
        altro: 'Il valore è diverso. Scrivi gli otto bit, accendi quelli richiesti e converti in esadecimale.',
        indizi: ['I bit da accendere sono A e W, cioè il bit 2 e il bit 0.', 'In binario il byte è 0000 0101.', 'Il bit 2 pesa 4 e il bit 0 pesa 1.'],
        svolgimento: ['Amministratore: bit 2 a 1.', 'Proprietario: bit 1 a 0.', 'Permesso di scrittura: bit 0 a 1.', 'Byte: 0000 0101 = 0x05.'] },
      { d: 'Arriva il byte 0x85, in binario 1000 0101. Che cosa fa il programma?', guida: 'Scegli la risposta.', o: [
        { t: 'Consente la modifica', fb: 'I bit W e A sono accesi, però il bit 7 è riservato e vale 1. La forma va controllata per prima.' },
        { t: 'Rifiuta: byte malformato', ok: true, fb: '0x85 AND 0xF8 dà 0x80, diverso da zero. Il bit 7 è acceso e la politica viene lasciata da parte.' },
        { t: 'Rifiuta: accesso negato', fb: 'La politica direbbe di sì, perché W e A sono accesi. Il rifiuto viene dalla forma del byte.' }] }
    ]
  }
});
