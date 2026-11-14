'use strict';
SL.registra('2.2.1', {
  titolo: 'Larghezza, segno e aritmetica a precisione fissa',
  obiettivo: 'Obiettivo: prevedere il risultato di una somma su una larghezza fissata e stabilire, per ciascuna delle due letture dei bit, se il risultato sia corretto.',
  concetti: [['operation', 'Aritmetica modulare'], ['flag', 'CF: senza segno'], ['segno', 'OF: con segno']],
  filigrana: ['flag', 'segno', 'alu'],
  richiami: {
    carte: [
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Il complemento a due', d: 'Su otto bit, una configurazione con il bit di segno a 1 vale la lettura senza segno meno 256.' },
      { sim: 'conflitto', da: 'Dall’unità 1.4.2', t: 'Riporto uscente e overflow', d: 'Senza segno una somma è errata quando esce un riporto. Con segno è errata quando il risultato esatto è esterno all’intervallo.' },
      { sim: 'flag', da: 'Dall’unità 2.1.1', t: 'Il flag CF', d: 'Dopo una ADD il flag CF vale 1 se la somma ha prodotto un riporto oltre l’ultimo bit della destinazione.' }
    ],
    domanda: { d: 'Prima di proseguire: il byte 1000 0000 quanto vale nelle due letture, senza segno e in complemento a due?', o: [
      { t: '128 e −128', ok: true, fb: 'Senza segno il bit più a sinistra ha peso 128. In complemento a due ha peso −128.' },
      { t: '128 e −0', fb: 'Il complemento a due ha un solo zero. Il bit più a sinistra, da solo, vale −128.' },
      { t: '−128 e 128', fb: 'Le due letture sono scambiate: senza segno il byte vale 128.' }
    ] }
  },
  idea: {
    titolo: 'I medesimi bit, due letture, due flag',
    termini: ['aritmetica modulare', 'flag di overflow'],
    testo: [
      'Un’istruzione aritmetica opera su una larghezza determinata: 8, 16, 32 oppure 64 bit, secondo la vista impiegata come destinazione. La larghezza è indicata con la lettera w. Con w bit le combinazioni sono 2 elevato a w, e una somma conserva soltanto i w bit più bassi del risultato esatto.',
      'In termini numerici, il valore conservato è il resto della divisione del risultato esatto per 2 elevato a w. Tale modo di contare, nel quale dopo l’ultimo numero si riparte da zero, prende il nome di [[aritmetica modulare]]. Con otto bit il modulo è 256, e 250 + 10 dà 4. Con sedici bit il modulo è 65 536, e la medesima somma dà 260.',
      'Il processore prescinde dal fatto che i bit sommati rappresentino numeri senza segno oppure numeri in complemento a due. Il circuito è il medesimo nei due casi, e i bit del risultato sono corretti in entrambe le letture finché il risultato esatto resta nell’intervallo.',
      'Gli intervalli sono tuttavia due, uno per lettura, e una somma può essere esterna all’uno e interna all’altro. Per questa ragione il processore mantiene due flag distinti. CF, già introdotto, riguarda la lettura senza segno: vale 1 quando il risultato esatto supera il massimo, cioè 2 elevato a w meno 1. Il [[flag di overflow]], in sigla OF, riguarda la lettura con segno: vale 1 quando il risultato esatto è esterno all’intervallo del complemento a due.',
      { fig: 'celle', titolo: '127 + 1 su otto bit', nota: 'Senza segno i bit valgono 128, il risultato corretto: CF = 0. Con segno valgono −128, mentre la somma esatta era +128: OF = 1.', celle: [
        { so: 'bit 7', v: '1', st: 'amb', gi: 'segno' }, { so: 'bit 6', v: '0' }, { so: 'bit 5', v: '0' }, { so: 'bit 4', v: '0' }, { so: 'bit 3', v: '0' }, { so: 'bit 2', v: '0' }, { so: 'bit 1', v: '0' }, { so: 'bit 0', v: '0' }] },
      'L’esempio di riferimento è 127 + 1 su otto bit. I bit del risultato sono 1000 0000. Letti senza segno valgono 128, che è la somma corretta, e CF resta a 0. Letti con segno valgono −128, mentre la somma esatta era +128, oltre il massimo dell’intervallo, che è 127. OF vale 1.',
      'Il programma conosce il significato dei propri dati e considera il flag pertinente. Un conteggio di oggetti richiede CF. Un calcolo su numeri che possono essere negativi richiede OF.',
      'La larghezza modifica l’intero giudizio. La medesima somma 127 + 1 eseguita su sedici bit dà 128 in entrambe le letture, poiché a sedici bit il bit di segno è il bit 15 e l’intervallo con segno si estende fino a 32 767.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore somma due configurazioni di bit su una larghezza di 8 oppure di 16 bit. I controlli fissano gli addendi e la larghezza.',
      'Gli addendi e il risultato sono letti in due modi, senza segno e con segno, e per ciascuna lettura si stabilisce se il risultato conservato sia corretto. Dopo il caso proposto, è istruttivo passare a 16 bit lasciando invariati gli addendi.'
    ],
    vedrai: [
      ['hex', 'I bit', 'Nella prima riga: gli addendi e il risultato, in esadecimale.'],
      ['segno', 'Le due letture', 'Nelle due righe sottostanti: i medesimi bit letti senza segno e in complemento a due.'],
      ['flag', 'I flag', 'In basso: CF, relativo alla lettura senza segno, e OF, relativo a quella con segno.']
    ]
  },
  lab: SL.x86.labFlag('add', [127, 255, 128, 200, 100], [1, 128, 100, 56, 255], [127, 1]),
  bilancio: {
    regola: [
      'Una somma su w bit conserva il resto della divisione del risultato esatto per 2 elevato a w. I bit ottenuti sono i medesimi per la lettura senza segno e per quella con segno.',
      'CF vale 1 quando il risultato esatto senza segno supera il massimo. OF vale 1 quando il risultato esatto con segno è esterno all’intervallo del complemento a due. I due flag sono indipendenti, e il loro valore dipende dalla larghezza.'
    ],
    errori: [
      ['Impiegare CF per i numeri con segno.', 'Su otto bit −1 + 1 porta CF a 1 e fornisce il risultato corretto, 0. Per i numeri con segno il flag pertinente è OF.'],
      ['Ritenere che esistano due istruzioni di somma.', 'ADD è una sola. La somma dei medesimi bit fornisce il medesimo risultato, e le due letture si distinguono soltanto nei flag.'],
      ['Giudicare senza conoscere la larghezza.', 'La somma 127 + 1 è esterna all’intervallo con segno su otto bit e vi rientra ampiamente su sedici.']
    ],
    saFare: ['Calcolare il risultato conservato da una somma su 8 e su 16 bit.', 'Stabilire il valore di CF e di OF dopo una somma.', 'Indicare il flag che un programma deve considerare, secondo il tipo dei propri dati.'],
    esercizi: [
      { d: 'AL contiene 0xFF e il processore esegue `add al, 1`. Quali flag valgono 1 fra CF e OF?', guida: 'Si scelga la risposta.', o: [
        { t: 'Soltanto CF', ok: true, fb: 'Senza segno 255 + 1 supera 255, e il riporto esce. Con segno −1 + 1 dà 0, che rientra nell’intervallo.' },
        { t: 'Soltanto OF', fb: 'Con segno gli addendi sono −1 e 1, e la somma esatta, 0, rientra nell’intervallo. L’errore riguarda la lettura senza segno.' },
        { t: 'CF e OF', fb: 'La lettura con segno è corretta: −1 + 1 = 0. Soltanto quella senza segno supera il massimo.' },
        { t: 'Nessuno dei due', fb: 'Senza segno la somma esatta è 256, che eccede gli otto bit. Il riporto esce e porta CF a 1.' }] },
      { d: 'AX contiene 0xFFF8 e il processore esegue `add ax, 0x10`. Quanto vale AX dopo l’istruzione? Si risponda in esadecimale.', segnaposto: 'Quattro cifre esadecimali', giuste: ['0x0008', '0008', '0x8', '8', '0x08', '08'],
        ok: 'La somma esatta è 0x10008, che richiede diciassette bit. In AX restano le quattro cifre basse, 0x0008, e CF vale 1.',
        diagnosi: [
          { se: ['0x10008', '10008'], msg: 'Cinque cifre esadecimali superano i sedici bit di AX. Nel registro restano le quattro cifre basse.' },
          { se: ['0xfff8', 'fff8'], msg: 'Questo è il contenuto di partenza. ADD scrive il risultato nella destinazione.' },
          { se: ['0x1008', '1008'], msg: 'Va riesaminata la somma delle cifre: 0xFFF8 + 0x10 dà 0x10008, con tre zeri intermedi.' }
        ],
        altro: 'Il valore è diverso. Si sommi in esadecimale e si conservino le quattro cifre basse.',
        indizi: ['0xFFF8 + 0x8 fa 0x10000.', 'Restano da sommare altri 0x8: 0x10008.', 'AX dispone di quattro cifre esadecimali.'],
        svolgimento: ['Valore esatto della somma: 0xFFF8 + 0x10 = 0x10008.', 'Su sedici bit restano le quattro cifre basse: 0x0008.', 'Il riporto è uscito, e quindi CF = 1. Con segno −8 + 16 = 8, valore interno all’intervallo: OF = 0.'] }
    ]
  }
});
