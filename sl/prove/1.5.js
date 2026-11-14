'use strict';
/* Prova del capitolo 1.5: una domanda per unità. */
(() => {
  const I = SL.scritture.intero, X = SL.scritture.esa;
  const H = (v) => '0x' + v.toString(16).toUpperCase().padStart(2, '0');
  const BIN = (v) => v.toString(2).padStart(8, '0').replace(/(....)(....)/, '$1 $2');
  const PORTA = { AND: (a, b) => a & b, OR: (a, b) => a | b, XOR: (a, b) => a ^ b };

  SL.registraProva('1.5', { domande: [
    // 1.5.1 · le righe a 1 di una piccola cascata
    (r) => {
      let p1, p2, righe, uno;
      do {
        p1 = r.scegli(['AND', 'OR', 'XOR']); p2 = r.scegli(['AND', 'OR', 'XOR']);
        righe = []; for (let k = 0; k < 8; k++) { const a = k >> 2, b = (k >> 1) & 1, c = k & 1, m = PORTA[p1](a, b); righe.push([a, b, c, m, PORTA[p2](m, c)]); }
        uno = righe.filter((x) => x[4] === 1).length;
      } while (p1 === p2 && p1 === 'XOR');
      return { u: '1.5.1', d: 'Un circuito calcola `(A ' + p1 + ' B) ' + p2 + ' C`. Quante delle otto righe della sua tabella di verità hanno uscita 1?', segnaposto: 'Un numero da 0 a 8', giuste: I(uno),
        ok: 'Le righe con uscita 1 sono ' + uno + ': ' + righe.filter((x) => x[4] === 1).map((x) => '' + x[0] + x[1] + x[2]).join(', ') + '.',
        diagnosi: [
          { se: I(8 - uno), msg: 'Sono state contate le righe con uscita 0. Sono richieste quelle con uscita 1.' },
          { se: I(righe.filter((x) => x[3] === 1).length), msg: 'Questo è il conteggio per la sola porta ' + p1 + '. La sua uscita entra poi nella porta ' + p2 + ', insieme a C.' }
        ],
        altro: 'Il numero è diverso. Si scrivano le otto righe, si calcoli dapprima A ' + p1 + ' B e si combini poi il risultato con C.',
        indizi: ['Con tre ingressi le righe sono otto, da 000 a 111.', 'In ogni riga si risolve prima la porta ' + p1 + ', poi la porta ' + p2 + '.', 'La colonna A ' + p1 + ' B vale 1 in ' + righe.filter((x) => x[3] === 1).length + ' righe su otto.'],
        svolgimento: righe.map((x) => 'A B C = ' + x[0] + ' ' + x[1] + ' ' + x[2] + ': A ' + p1 + ' B = ' + x[3] + ', uscita ' + x[4] + '.').concat(['Righe con uscita 1: ' + uno + '.']) };
    },
    // 1.5.2 · il mintermine di una riga
    (r) => {
      const v = [r.int(0, 1), r.int(0, 1), r.int(0, 1)], nomi = ['A', 'B', 'C'];
      const termine = (bit, lega) => bit.map((b, k) => (b ? '' : 'NOT ') + nomi[k]).join(' ' + lega + ' ');
      const inv = v.map((b) => 1 - b), sbaglio = v.slice(); const j = r.int(0, 2); sbaglio[j] = 1 - sbaglio[j];
      return { u: '1.5.2', d: 'Una funzione ha tre ingressi, A, B e C. Qual è il mintermine che riconosce la riga A = ' + v[0] + ', B = ' + v[1] + ', C = ' + v[2] + '?', o: [
        { t: termine(v, 'AND'), ok: true, fb: 'Gli ingressi che nella riga valgono 0 attraversano una NOT. La AND vale 1 soltanto con tale combinazione.' },
        { t: termine(inv, 'AND'), fb: 'Le NOT sono collocate in modo errato: vanno poste sugli ingressi che nella riga valgono 0. Questo termine riconosce la riga ' + inv.join(' ') + '.' },
        { t: termine(v, 'OR'), fb: 'Un mintermine è una AND. Con la OR l’uscita varrebbe 1 in sette righe su otto.' },
        { t: termine(sbaglio, 'AND'), fb: 'Va riesaminato l’ingresso ' + nomi[j] + '. Questo termine riconosce la riga ' + sbaglio.join(' ') + '.' }] };
    },
    // 1.5.3 · un operatore bit a bit con una maschera
    (r) => {
      const x = r.int(0x11, 0xEE), m = r.scegli([0x0F, 0xF0, 0x3C, 0x81, 0xC3, 0x55]), op = r.scegli(['&', '|', '^']);
      const ris = { '&': x & m, '|': x | m, '^': x ^ m }, NOME = { '&': 'AND', '|': 'OR', '^': 'XOR' }, altri = ['&', '|', '^'].filter((o) => o !== op);
      const FA = { '&': 'conserva i bit dove la maschera vale 1 e azzera gli altri', '|': 'accende i bit dove la maschera vale 1 e lascia invariati gli altri', '^': 'inverte i bit dove la maschera vale 1 e lascia invariati gli altri' };
      return { u: '1.5.3', d: 'Quanto vale `' + H(x) + ' ' + op + ' ' + H(m) + '`? Si scriva il risultato in esadecimale.', segnaposto: 'Due cifre esadecimali', giuste: X(ris[op], 2),
        ok: 'La ' + NOME[op] + ' ' + FA[op] + '. Colonna per colonna: ' + BIN(x) + ' ' + op + ' ' + BIN(m) + ' = ' + BIN(ris[op]) + '.',
        diagnosi: altri.map((o) => ({ se: X(ris[o], 2), msg: 'Questo è il risultato dell’operatore ' + o + ', cioè della ' + NOME[o] + '. L’operatore ' + op + ' è la ' + NOME[op] + ', che ' + FA[op] + '.' }))
          .concat([{ se: [ris[op].toString(2).padStart(8, '0')], msg: 'I bit sono corretti. Il risultato è richiesto in esadecimale.' }]),
        altro: 'Il risultato è diverso. Si scrivano i due byte in binario, uno sotto l’altro, e si applichi la ' + NOME[op] + ' a ogni colonna.',
        indizi: ['In binario i due byte sono ' + BIN(x) + ' e ' + BIN(m) + '.', 'L’operatore ' + op + ' è la ' + NOME[op] + ', applicata colonna per colonna e senza riporti.', 'La ' + NOME[op] + ' ' + FA[op] + '.'],
        svolgimento: [H(x) + ' = ' + BIN(x) + '.', H(m) + ' = ' + BIN(m) + '.', NOME[op] + ' colonna per colonna: ' + BIN(ris[op]) + '.', 'In esadecimale: ' + H(ris[op]) + '.'] };
    },
    // 1.5.4 · la durata di un impulso transitorio
    (r) => {
      const d = r.int(1, 6), inv = r.int(0, 3) === 0 ? r.int(1, d) : d + r.int(1, 6), giusto = Math.max(0, inv - d);
      return { u: '1.5.4', d: 'Nel circuito A OR NOT A il ramo diretto ha un ritardo di ' + d + ' ns e il ramo invertito di ' + inv + ' ns. Quando A scende a 0, per quanti nanosecondi l’uscita resta a 0?', segnaposto: 'Un numero di nanosecondi', giuste: I(giusto).concat([giusto + 'ns']),
        ok: giusto ? 'Lo 0 arriva dal ramo diretto dopo ' + d + ' ns, e l’1 dal ramo invertito dopo ' + inv + ' ns. Nel frattempo i due ingressi della OR valgono 0: ' + inv + ' − ' + d + ' = ' + giusto + ' ns.' : 'Il ramo invertito porta il proprio 1 dopo ' + inv + ' ns, quando il ramo diretto porta ancora l’1 precedente' + (inv === d ? ' oppure lo sta sostituendo nel medesimo istante' : '') + '. La OR ha sempre almeno un ingresso a 1, e l’uscita resta a 1.',
        diagnosi: [
          { se: I(d + inv), msg: 'I due rami operano contemporaneamente. È rilevante la differenza fra i ritardi.' },
          { se: I(inv), msg: 'Per i primi ' + d + ' ns il ramo diretto porta ancora l’1 precedente, e l’uscita è corretta.' },
          { se: giusto ? ['0'] : I(Math.abs(inv - d)), msg: giusto ? 'Il ramo invertito è il più lento. Fra l’arrivo dello 0 e l’arrivo dell’1 la OR riceve due ingressi a 0.' : 'In questo caso il ramo invertito è veloce almeno quanto quello diretto. Il nuovo 1 giunge prima che il precedente venga meno, e l’uscita resta a 1.' }
        ],
        altro: 'Il numero è diverso. Si segnino sull’asse del tempo l’arrivo dello 0 del ramo diretto e l’arrivo dell’1 del ramo invertito.',
        indizi: ['Il ramo diretto porta lo 0 dopo ' + d + ' ns.', 'Il ramo invertito porta l’1 dopo ' + inv + ' ns.', 'L’uscita vale 0 soltanto mentre entrambi gli ingressi della OR valgono 0.'],
        svolgimento: ['Arrivo dello 0 dal ramo diretto: ' + d + ' ns.', 'Arrivo dell’1 dal ramo invertito: ' + inv + ' ns.', giusto ? 'Fra i due istanti la OR riceve 0 e 0: l’uscita resta a 0 per ' + inv + ' − ' + d + ' = ' + giusto + ' ns.' : 'Il nuovo 1 giunge prima che il precedente venga meno: l’uscita resta a 1, e i nanosecondi a 0 sono 0.'] };
    },
    // 1.5.5 · i riporti in una fila di sommatori
    (r) => {
      let x = 0, y = 0;
      do { x = r.int(1, 15); y = r.int(1, 15); } while (x + y < 6);
      const b = (v) => v.toString(2).padStart(4, '0');
      let c = 0, riporti = 0; const passi = [];
      for (let k = 0; k < 4; k++) { const a = (x >> k) & 1, d = (y >> k) & 1, s = a + d + c, esce = s >= 2 ? 1 : 0; passi.push('Colonna ' + (k + 1) + ' da destra: ' + a + ' + ' + d + ' + riporto ' + c + ' = ' + s + ', quindi somma ' + (s & 1) + ' e riporto ' + esce + '.'); c = esce; riporti += esce; }
      const uniComuni = (x & y).toString(2).replace(/0/g, '').length;
      return { u: '1.5.5', d: 'Quattro sommatori completi in serie calcolano `' + b(x) + ' + ' + b(y) + '`. Quanti di essi producono un riporto in uscita?', segnaposto: 'Un numero da 0 a 4', giuste: I(riporti),
        ok: 'Un sommatore produce un riporto quando almeno due dei suoi tre ingressi valgono 1. In questo caso ciò avviene in ' + riporti + (riporti === 1 ? ' colonna.' : ' colonne.'),
        diagnosi: [
          { se: I(uniComuni), msg: 'Sono state contate le colonne in cui entrambi i bit valgono 1. Un riporto in arrivo può produrne un altro anche dove uno solo dei due bit vale 1.' },
          { se: I(4 - riporti), msg: 'Sono stati contati i sommatori privi di riporto. Sono richiesti quelli che lo producono.' }
        ],
        altro: 'Il numero è diverso. Si proceda da destra, una colonna alla volta, trasferendo ogni riporto al sommatore successivo.',
        indizi: ['Si comincia dalla colonna più a destra, con riporto in arrivo 0.', 'Un sommatore produce un riporto quando almeno due dei suoi tre ingressi valgono 1.', 'Il riporto di una colonna è uno degli ingressi della colonna successiva.'],
        svolgimento: passi.concat(['Sommatori con riporto in uscita: ' + riporti + '.']) };
    },
    // 1.5.6 · interrogare un byte di stato
    (r) => {
      const maschera = r.scegli([0x03, 0x05, 0x06, 0x0C, 0x30, 0x41, 0x82, 0x07, 0x0E]);
      const caso = r.int(0, 2);
      let stato = 0;
      for (let giri = 0; giri < 500; giri++) { stato = r.int(0x01, 0xFE); const e = stato & maschera; if ((caso === 0 && e === maschera) || (caso === 1 && e !== 0 && e !== maschera) || (caso === 2 && e === 0)) break; }
      const e = stato & maschera, tutti = e === maschera, nessuno = e === 0;
      const SPIEGA = 'In binario lo stato è ' + BIN(stato) + ' e la maschera ' + BIN(maschera) + '. La AND dà ' + H(e) + (tutti ? ', uguale alla maschera.' : nessuno ? ', cioè zero.' : ', diverso da zero e diverso dalla maschera.');
      return { u: '1.5.6', d: 'Un byte di stato vale `' + H(stato) + '` e la maschera dei bit richiesti vale `' + H(maschera) + '`. Che cosa indica il risultato di `stato & maschera`?', o: [
        { t: 'I bit richiesti sono tutti accesi', ok: tutti, fb: SPIEGA + (tutti ? '' : ' La condizione «tutti accesi» richiede un risultato uguale alla maschera.') },
        { t: 'Alcuni bit richiesti sono accesi, altri no', ok: !tutti && !nessuno, fb: SPIEGA + (!tutti && !nessuno ? '' : tutti ? ' Tutti i bit richiesti risultano accesi.' : ' Nessuno dei bit richiesti risulta acceso.') },
        { t: 'Nessuno dei bit richiesti è acceso', ok: nessuno, fb: SPIEGA + (nessuno ? '' : ' Un risultato diverso da zero indica che almeno un bit richiesto è acceso.') }] };
    }
  ] });
})();
