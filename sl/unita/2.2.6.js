'use strict';
SL.registra('2.2.6', {
  titolo: 'Flag di condizione e larghezza',
  obiettivo: 'Obiettivo: ricavare i quattro flag principali dopo una sottrazione, e spiegare perché il medesimo numero può cambiare segno al variare della larghezza.',
  concetti: [['flag', 'CF, OF, SF, ZF'], ['operation', 'Sottrazione'], ['segno', 'Bit di segno e larghezza']],
  filigrana: ['flag', 'segno', 'operation'],
  richiami: {
    carte: [
      { sim: 'flag', da: 'Dall’unità 2.2.1', t: 'CF e OF', d: 'CF riguarda il risultato nella lettura senza segno, OF in quella con segno. I due flag sono indipendenti e dipendono dalla larghezza.' },
      { sim: 'operation', da: 'Dall’unità 2.2.4', t: 'SUB', d: 'L’istruzione sottrae la sorgente dalla destinazione, vi scrive la differenza e aggiorna i flag.' },
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'Il bit di segno', d: 'In complemento a due il bit più a sinistra vale 1 nei numeri negativi. Su otto bit è il bit 7, su sedici il bit 15.' }
    ],
    domanda: { d: 'Prima di proseguire: su otto bit, in complemento a due, qual è il minimo numero rappresentabile, e con quali bit?', o: [
      { t: '−128, cioè 1000 0000', ok: true, fb: 'Il bit più a sinistra ha peso −128, e con tutti gli altri a zero si ottiene il minimo.' },
      { t: '−127, cioè 1111 1111', fb: 'I bit 1111 1111 valgono −1. Il minimo si ottiene con il solo bit di segno a 1.' },
      { t: '−255, cioè 1111 1111', fb: 'Su otto bit l’intervallo con segno si estende da −128 a 127.' }
    ] }
  },
  idea: {
    titolo: 'Quattro flag per una sottrazione',
    termini: ['prestito', 'flag di segno'],
    testo: [
      'I flag principali sono quattro, e ogni operazione aritmetica li scrive tutti insieme. Nelle unità precedenti essi sono stati introdotti uno alla volta. In questa unità sono esaminati insieme nel caso della sottrazione, l’operazione su cui si fondano tutti i confronti.',
      'SUB calcola destinazione meno sorgente su w bit. Come per la somma, i bit del risultato sono i medesimi nelle due letture, e i flag indicano in quale lettura il risultato sia affidabile.',
      'Nella lettura senza segno una sottrazione fornisce un risultato errato quando il minuendo è minore del sottraendo. Nel calcolo manuale, in tale caso, si ricorre a un [[prestito]] dalla colonna a sinistra. Quando occorre un prestito oltre l’ultimo bit, il processore lo segnala con CF = 1. Dopo una sottrazione, pertanto, CF = 1 significa che il primo operando, letto senza segno, è minore del secondo.',
      'Nella lettura con segno il flag pertinente è ancora OF, che vale 1 quando la differenza esatta è esterna all’intervallo del complemento a due. L’esempio di riferimento su otto bit è −128 − 1. La differenza esatta, −129, è inferiore al minimo dell’intervallo, e i bit conservati, letti con segno, valgono +127.',
      { fig: 'celle', titolo: '0x80 − 0x01 su otto bit', nota: 'Il risultato è 0x7F. Senza segno 128 − 1 = 127, valore corretto: CF = 0. Con segno −128 − 1 dovrebbe dare −129: OF = 1.', celle: [
        { so: 'bit 7', v: '0', st: 'amb', gi: 'SF = 0' }, { so: 'bit 6', v: '1', st: 'on' }, { so: 'bit 5', v: '1', st: 'on' }, { so: 'bit 4', v: '1', st: 'on' }, { so: 'bit 3', v: '1', st: 'on' }, { so: 'bit 2', v: '1', st: 'on' }, { so: 'bit 1', v: '1', st: 'on' }, { so: 'bit 0', v: '1', st: 'on' }] },
      'Gli altri due flag descrivono direttamente i bit del risultato. ZF vale 1 quando essi sono tutti zero, cioè quando i due operandi erano uguali. Il [[flag di segno]], in sigla SF, copia il bit più a sinistra del risultato, e vale quindi 1 quando il risultato conservato, letto con segno, è negativo.',
      'La larghezza determina la posizione di tale bit. Il numero 128 scritto su otto bit ha il bit di segno a 1 e, letto con segno, vale −128. Scritto su sedici bit è 0x0080, un numero positivo in entrambe le letture. La medesima sottrazione 128 − 1 porta OF a 1 su otto bit e lo lascia a 0 su sedici.'
    ]
  },
  esperimento: {
    faremo: [
      'Il processore sottrae due configurazioni di bit su una larghezza di 8 oppure di 16 bit. I controlli fissano minuendo, sottraendo e larghezza.',
      'Operandi e risultato sono letti nei due modi, e i quattro flag sono ricavati uno alla volta. Dopo il caso proposto, è istruttivo passare a 16 bit lasciando invariati gli operandi e individuare i flag che cambiano.'
    ],
    vedrai: [
      ['hex', 'I bit', 'Nella prima riga: minuendo, sottraendo e risultato, in esadecimale.'],
      ['segno', 'Le due letture', 'Nelle due righe sottostanti: i medesimi bit letti senza segno e in complemento a due.'],
      ['flag', 'I flag', 'In basso: CF, OF, SF e ZF, evidenziati quando valgono 1.']
    ]
  },
  lab: SL.x86.labFlag('sub', [128, 5, 0, 200, 127], [1, 10, 5, 200, 255], [128, 1]),
  bilancio: {
    regola: [
      'Dopo una sottrazione su w bit: CF vale 1 se è stato necessario un prestito, cioè se il minuendo senza segno è minore del sottraendo. OF vale 1 se la differenza esatta con segno è esterna all’intervallo.',
      'SF copia il bit più a sinistra del risultato conservato. ZF vale 1 se il risultato è zero. La posizione del bit di segno dipende dalla larghezza, e con essa cambiano OF e SF.'
    ],
    errori: [
      ['Interpretare SF come «il risultato esatto è negativo».', 'SF descrive i bit conservati. Quando OF vale 1, il segno dei bit conservati è l’opposto di quello del risultato esatto.'],
      ['Impiegare CF per confrontare numeri con segno.', 'CF risponde alla domanda «minore» nella lettura senza segno. Per i numeri con segno occorrono SF e OF insieme.'],
      ['Trascurare la larghezza.', 'Il valore 128 è negativo su otto bit e positivo su sedici. Il medesimo calcolo può portare a 1 flag diversi.']
    ],
    saFare: ['Ricavare CF, OF, SF e ZF dopo una sottrazione su 8 e su 16 bit.', 'Collegare CF = 1 al confronto «minore» fra numeri senza segno.', 'Spiegare perché un flag cambia quando cambia la larghezza.'],
    esercizi: [
      { d: 'AL contiene 0x05 e il processore esegue `sub al, 0x0A`. Quali flag valgono 1?', guida: 'Si scelga la risposta.', o: [
        { t: 'CF e SF', ok: true, fb: 'Senza segno 5 è minore di 10, e occorre quindi un prestito: CF = 1. Il risultato è 0xFB, con il bit più a sinistra a 1: SF = 1. Con segno 5 − 10 = −5 rientra nell’intervallo, e quindi OF = 0.' },
        { t: 'Soltanto SF', fb: 'SF vale 1, ed è corretto. Manca CF: senza segno 5 è minore di 10, e la sottrazione richiede un prestito.' },
        { t: 'CF e OF', fb: 'Con segno la differenza esatta è −5, che rientra nell’intervallo da −128 a 127. OF resta a 0.' },
        { t: 'Nessuno', fb: 'Il risultato, 0xFB, ha il bit più a sinistra a 1, e la sottrazione senza segno ha richiesto un prestito.' }] },
      { d: 'AL contiene 0x80 e il processore esegue `sub al, 1`. Quanto vale AL dopo l’istruzione? Si risponda in esadecimale.', segnaposto: 'Due cifre esadecimali', giuste: ['0x7f', '7f', '7fh'],
        ok: 'Senza segno 128 − 1 = 127, cioè 0x7F. Con segno la differenza esatta sarebbe −129, esterna all’intervallo: OF vale 1.',
        diagnosi: [
          { se: ['0x81', '81'], msg: 'È stato sommato 1. SUB sottrae la sorgente dalla destinazione.' },
          { se: ['127'], msg: 'Il valore è corretto. La risposta è richiesta in esadecimale.' },
          { se: ['0xff', 'ff'], msg: 'Va riesaminato il prestito: sottraendo 1 da 1000 0000 si ottiene 0111 1111.' }
        ],
        altro: 'Il valore è diverso. Si scriva 0x80 in binario e si sottragga 1, con i prestiti.',
        indizi: ['In binario 0x80 è 1000 0000.', 'Sottraendo 1, il prestito percorre tutti gli zeri fino al bit 7.', 'Il risultato è 0111 1111.'],
        svolgimento: ['0x80 = 1000 0000 = 128 senza segno.', '128 − 1 = 127 = 0111 1111.', 'In esadecimale: 0x7F.', 'CF = 0, ZF = 0, SF = 0, OF = 1.'] }
    ],
    sfida: ['cslez2_2_03_random_assembly_03', 'Differenze e operazioni logiche']
  }
});
