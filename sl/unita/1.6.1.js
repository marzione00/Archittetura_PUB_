'use strict';
SL.registra('1.6.1', {
  titolo: 'Frazioni binarie, scala e precisione',
  obiettivo: 'Alla fine saprai scrivere in binario un numero con la virgola, e spiegare perché alcune frazioni semplicissime, come un decimo, non si possono scrivere esattamente.',
  concetti: [['virgola', 'Virgola'], ['bilancio', 'Pesi'], ['lente', 'Precisione']],
  filigrana: ['virgola', 'bilancio', 'bit'],
  richiami: {
    carte: [
      { sim: 'bilancio', da: 'Dalle unità 0.3 e 1.2.2', t: 'I pesi delle posizioni', d: 'Ogni posizione ha un peso. Spostandosi verso sinistra il peso si moltiplica per la base: per dieci nel decimale, per due nel binario.' },
      { sim: 'bit', da: 'Dall’unità 1.2.2', t: 'Leggere un numero binario', d: 'Il valore è la somma dei pesi delle posizioni che contengono 1.' },
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'La larghezza è fissata', d: 'Un numero occupa un numero stabilito di bit. Ciò che non entra va perduto.' }
    ],
    domanda: { d: 'Prima di proseguire: nel numero decimale 0,25 quanto pesa la posizione occupata dalla cifra 5?', o: [
      { t: 'Un decimo', fb: 'Un decimo è il peso della prima posizione dopo la virgola, quella del 2.' },
      { t: 'Un centesimo', ok: true, fb: 'La seconda posizione dopo la virgola pesa un centesimo: 0,25 è due decimi più cinque centesimi.' },
      { t: 'Cinque', fb: 'Cinque è la cifra. Il suo peso dipende dalla posizione, che qui è la seconda dopo la virgola.' }
    ] }
  },
  idea: {
    titolo: 'I pesi continuano dopo la virgola',
    termini: ['frazione binaria', 'precisione'],
    testo: [
      'Nella scrittura decimale i pesi proseguono oltre le unità. Dopo la virgola continuano a rimpicciolire: un decimo, un centesimo, un millesimo, ciascuno dieci volte più piccolo del precedente. Il numero 0,25 significa due decimi più cinque centesimi.',
      'In binario succede lo stesso, con il due al posto del dieci. Dopo la virgola i pesi sono un mezzo, un quarto, un ottavo, un sedicesimo, ciascuno la metà del precedente. Un numero scritto così si chiama [[frazione binaria]]. La scrittura 0,101 vale un mezzo più un ottavo, cioè 0,625.',
      { fig: 'celle', titolo: 'Il numero binario 0,101', nota: 'Un mezzo più un ottavo: 0,5 + 0,125 = 0,625.', celle: [
        { so: '1/2', v: '1', st: 'on', gi: '0,5' }, { so: '1/4', v: '0', gi: '0,25' }, { so: '1/8', v: '1', st: 'on', gi: '0,125' }] },
      'Per trovare le cifre binarie di una frazione esiste una ricetta semplice: si raddoppia. Se il doppio arriva a 1 o lo supera, la cifra è 1 e si toglie l’unità; altrimenti la cifra è 0. Si ripete con quello che resta. Il raddoppio funziona perché sposta la virgola di un posto, e porta la prima cifra dopo la virgola nella posizione delle unità, dove si può leggere.',
      'Con 0,625 la ricetta finisce presto. Il doppio è 1,25: cifra 1, resta 0,25. Il doppio è 0,5: cifra 0. Il doppio è 1: cifra 1, e non resta nulla. Le cifre sono 1, 0, 1.',
      'Con altre frazioni la ricetta non finisce mai. Un decimo, in binario, è 0,000110011 e prosegue ripetendo all’infinito il gruppo 0011. Capita anche nel decimale: un terzo si scrive 0,333 senza fine. In binario hanno una scrittura finita soltanto le frazioni che, ridotte ai minimi termini, hanno per denominatore 2, 4, 8, 16 o un altro numero ottenuto moltiplicando il due per se stesso. Questi numeri si chiamano potenze di due.',
      'Un calcolatore dispone di un numero fissato di bit, e deve troncare le scritture infinite. Il numero di cifre che conserva si chiama [[precisione]]. Un decimo viene quindi memorizzato con un piccolo errore. Di solito l’errore è invisibile, ma si accumula: sommando dieci volte un decimo si ottiene un numero vicinissimo a uno e diverso da uno.'
    ]
  },
  esperimento: {
    faremo: [
      'Sceglierai una frazione e ne cercheremo le cifre binarie con la ricetta del raddoppio. Ogni cifra richiede due mosse: il raddoppio, e poi la lettura della cifra con il calcolo del resto.',
      'Avremo otto posizioni dopo la virgola. Alcune frazioni si esauriscono prima; altre le riempiono tutte e lasciano ancora un resto.'
    ],
    vedrai: [
      ['virgola', 'Il resto', 'In alto a sinistra: la parte di numero ancora da scrivere.'],
      ['bit', 'Le otto posizioni', 'Al centro, con i pesi scritti sopra: un mezzo, un quarto, e così via.'],
      ['bilancio', 'La somma dei pesi', 'In basso: il valore delle cifre scritte finora, da confrontare con la frazione di partenza.']
    ]
  },
  lab: {
    titolo: 'Una frazione, un raddoppio alla volta',
    scena: { w: 860, h: 320 },
    atti: ['La frazione', 'I raddoppi', 'Il bilancio'],
    nota: 'Il numero di passi dipende dalla frazione: due per ogni cifra binaria trovata, fino a otto cifre.',
    controlli: [{ id: 'f', tipo: 'scelta', eti: 'Frazione', opzioni: [['5/8', '0,625'], ['3/8', '0,375'], ['13/16', '0,8125'], ['1/10', '0,1'], ['1/5', '0,2']], valore: '5/8' }],
    previsione: {
      domanda: (p) => 'Scriveremo in binario il numero ' + ({ '5/8': '0,625', '3/8': '0,375', '13/16': '0,8125', '1/10': '0,1', '1/5': '0,2' })[p.f] + '. Quante cifre dopo la virgola serviranno per scriverlo esattamente?',
      opzioni: () => [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [8, '8'], ['mai', 'Non basta nessun numero di cifre']]
    },
    confronto: (pred, esito) => (pred === 'mai' ? 'Avevi previsto una scrittura senza fine. ' : 'Avevi previsto ' + pred + (pred === 1 ? ' cifra. ' : ' cifre. ')) + (esito === 'mai' ? 'La scrittura prosegue senza fine: dopo otto cifre resta ancora un pezzo da scrivere, e i resti si ripetono. ' : 'Le cifre necessarie sono ' + esito + '. ') + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'mai' ? 'Il denominatore di questa frazione contiene il fattore cinque, che nessuna potenza di due può assorbire.' : 'Il denominatore della frazione è una potenza di due. Le cifre che servono sono tante quante le volte in cui il due va moltiplicato per se stesso per ottenerlo.'),
    costruisci(p) {
      const el = SL.el, passi = [];
      const parti = p.f.split('/').map(Number);
      let num = parti[0];
      const den = parti[1];
      const D = (n, d) => String(Math.round((n / d) * 1e6) / 1e6).replace('.', ',');
      const PESI = ['1/2', '1/4', '1/8', '1/16', '1/32', '1/64', '1/128', '1/256'];
      const cifre = [], visti = [num];
      let somma = 0, ciclo = null;                       // somma in 256-esimi
      const quadro = (o) => {
        o = o || {};
        const els = [
          el.box('re', 40, 14, 250, 76, o.doppio != null ? 'doppio del resto' : 'resto da scrivere', o.doppio != null ? D(o.doppio, den) : D(num, den), o.att === 're' ? 'att' : num === 0 ? 'on' : '', { sim: 'virgola', riga: true }),
          el.nota('z', 40, 152, '0,', 'forte'),
          el.box('so', 40, 232, 420, 76, 'somma dei pesi scritti', D(somma, 256), o.att === 'so' ? 'att' : '', { sim: 'bilancio', riga: true }),
          el.box('or', 490, 232, 340, 76, 'frazione di partenza', D(parti[0], den), '', { sim: 'lente', riga: true })
        ];
        PESI.forEach((w, j) => els.push(el.cella('c' + j, 96 + j * 90, 134, 76, 60, cifre[j] == null ? '·' : String(cifre[j]), o.cifra === j ? 'att' : cifre[j] == null ? 'off' : cifre[j] ? 'on' : 'zero', { so: w })));
        return els;
      };
      const hud = () => [['Cifre scritte', cifre.length, 'a'], ['Resto', D(num, den)], ['Somma dei pesi', D(somma, 256), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ att: 're' }, 0, 'La frazione da scrivere', 'Vogliamo scrivere ' + D(num, den) + ' con cifre binarie dopo la virgola. All’inizio il resto da scrivere è l’intero numero, e le otto posizioni sono vuote.',
        { chiedi: { d: 'La prima mossa raddoppia ' + D(num, den) + '. Il doppio è ' + D(2 * num, den) + '. Quale cifra va nella posizione che pesa un mezzo?', o: ['0', '1'], g: 2 * num >= den ? 1 : 0, no: 'La cifra è 1 quando il doppio arriva a 1 o lo supera, cioè quando il numero contiene almeno un mezzo.' } });
      for (let j = 0; j < 8 && num !== 0; j++) {
        const doppio = 2 * num, bit = doppio >= den ? 1 : 0;
        P({ att: 're', doppio, cifra: j }, 1, 'Raddoppio per la posizione ' + PESI[j], 'Il resto è ' + D(num, den) + '. Il suo doppio è ' + D(doppio, den) + (bit ? ', che arriva a 1 o lo supera.' : ', che resta sotto 1.'), { calc: D(num, den) + ' × 2 = ' + D(doppio, den) });
        cifre.push(bit); num = doppio - bit * den; somma += bit * (256 >> (j + 1));
        const ripete = num !== 0 && visti.includes(num);
        if (ripete && ciclo === null) ciclo = j;
        visti.push(num);
        P({ cifra: j, att: 'so' }, 1, 'La cifra di peso ' + PESI[j] + ' è ' + bit, (bit ? 'Il doppio conteneva un’unità: la cifra è 1, e tolta l’unità resta ' + D(num, den) + '.' : 'Il doppio era minore di 1: la cifra è 0, e il resto è il doppio stesso, ' + D(num, den) + '.') + (num === 0 ? ' Il resto è zero e la scrittura è completa.' : ripete ? ' Questo resto è già comparso: da qui in poi le cifre si ripeteranno.' : ''),
          Object.assign({ calc: bit ? D(doppio, den) + ' − 1 = ' + D(num, den) : 'resto = ' + D(num, den) }, j === 1 && num !== 0 ? { chiedi: { d: 'Il resto è ' + D(num, den) + ' e il suo doppio è ' + D(2 * num, den) + '. Quale sarà la prossima cifra?', o: ['0', '1'], g: 2 * num >= den ? 1 : 0, no: 'La cifra è 1 quando il doppio arriva a 1 o lo supera.' } } : {}));
      }
      const esatta = num === 0;
      P({ att: 'so' }, 2, esatta ? 'La scrittura è esatta' : 'Le posizioni sono finite, il resto no', esatta
        ? 'Le cifre trovate sono 0,' + cifre.join('') + '. La somma dei loro pesi è ' + D(somma, 256) + ', identica alla frazione di partenza. Sono bastate ' + cifre.length + ' cifre.'
        : 'Abbiamo riempito le otto posizioni con 0,' + cifre.join('') + ' e resta ancora ' + D(num, den) + ' da scrivere. La somma dei pesi è ' + D(somma, 256) + ', vicina a ' + D(parti[0], den) + ' senza raggiungerlo.', { calc: '0,' + cifre.join('') + ' = ' + D(somma, 256) });
      if (!esatta) P({ att: 'so' }, 2, 'L’errore che rimane', 'La differenza fra la frazione e ciò che abbiamo scritto è ' + D(parti[0] * 256 - somma * den, den * 256) + '. Con più posizioni l’errore si riduce senza mai annullarsi, perché i resti continuano a ripetersi, e con loro le cifre.', { calc: D(parti[0], den) + ' − ' + D(somma, 256) + ' = ' + D(parti[0] * 256 - somma * den, den * 256) });
      return { passi, esito: esatta ? cifre.length : 'mai' };
    }
  },
  bilancio: {
    regola: [
      'Dopo la virgola i pesi binari sono un mezzo, un quarto, un ottavo, e così via. Le cifre si trovano raddoppiando: se il doppio arriva a 1 la cifra è 1 e si toglie l’unità.',
      'Hanno una scrittura binaria finita soltanto le frazioni il cui denominatore, ridotto ai minimi termini, è una potenza di due. Le altre vengono troncate alla precisione disponibile.'
    ],
    errori: [
      ['Aspettarsi che 0,1 sia esatto.', 'Un decimo ha una scrittura decimale brevissima e una scrittura binaria infinita. In memoria è sempre approssimato.'],
      ['Leggere i pesi come decimi.', 'In binario 0,1 vale un mezzo, e 0,01 vale un quarto.'],
      ['Dimenticare di togliere l’unità.', 'Dopo una cifra 1 il resto è il doppio meno uno. Proseguendo con il doppio intero le cifre successive escono sbagliate.']
    ],
    saFare: ['Leggo una frazione binaria sommando i pesi dopo la virgola.', 'Trovo le cifre binarie di una frazione con il raddoppio.', 'Riconosco le frazioni che non hanno una scrittura binaria finita.'],
    esercizi: [
      { d: 'Come si scrive in binario il numero decimale 0,75? Indica soltanto le cifre dopo la virgola.', segnaposto: 'Cifre binarie', giuste: ['11', '0.11', '0,11'],
        ok: 'Il doppio di 0,75 è 1,5: cifra 1, resta 0,5. Il doppio di 0,5 è 1: cifra 1, resta zero.',
        diagnosi: [
          { se: ['75', '0.75'], msg: 'Quelle sono le cifre decimali. In binario le posizioni dopo la virgola pesano un mezzo e un quarto.' },
          { se: ['101', '0.101'], msg: 'La scrittura 0,101 vale un mezzo più un ottavo, cioè 0,625.' },
          { se: ['1', '0.1'], msg: 'Una cifra sola dà un mezzo. Ne manca un quarto per arrivare a 0,75.' }
        ],
        altro: 'Le cifre sono diverse. Applica il raddoppio due volte, togliendo l’unità quando compare.',
        indizi: ['0,75 è un mezzo più un quarto.', 'Il doppio di 0,75 è 1,5: la prima cifra è 1 e resta 0,5.', 'Il doppio di 0,5 è 1: la seconda cifra è 1 e non resta nulla.'],
        svolgimento: ['0,75 × 2 = 1,5 → cifra 1, resto 0,5.', '0,5 × 2 = 1 → cifra 1, resto 0.', 'La scrittura è 0,11.'] },
      { d: 'Quale di queste frazioni ha una scrittura binaria finita?', guida: 'Scegli la risposta.', o: [
        { t: 'Un terzo', fb: 'Il denominatore tre non è una potenza di due. In binario un terzo è 0,010101 senza fine.' },
        { t: 'Tre sedicesimi', ok: true, fb: 'Sedici è due alla quarta: bastano quattro cifre, 0,0011.' },
        { t: 'Un decimo', fb: 'Dieci contiene il fattore cinque. In binario un decimo ripete all’infinito il gruppo 0011.' }] }
    ],
    sfida: ['lez06_01_fractional_binary', 'Frazioni binarie e pesi posizionali']
  }
});
