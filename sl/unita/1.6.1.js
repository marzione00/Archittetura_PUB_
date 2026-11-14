'use strict';
SL.registra('1.6.1', {
  titolo: 'Frazioni binarie, scala e precisione',
  obiettivo: 'Obiettivo: scrivere in binario un numero con parte frazionaria, e motivare l’impossibilità di rappresentare esattamente alcune frazioni elementari, come un decimo.',
  concetti: [['virgola', 'Virgola'], ['bilancio', 'Pesi'], ['lente', 'Precisione']],
  filigrana: ['virgola', 'bilancio', 'bit'],
  richiami: {
    carte: [
      { sim: 'bilancio', da: 'Dalle unità 0.3 e 1.2.2', t: 'I pesi delle posizioni', d: 'Ogni posizione ha un peso. Spostandosi verso sinistra il peso si moltiplica per la base: per dieci nel decimale, per due nel binario.' },
      { sim: 'bit', da: 'Dall’unità 1.2.2', t: 'Leggere un numero binario', d: 'Il valore è la somma dei pesi delle posizioni che contengono 1.' },
      { sim: 'segno', da: 'Dall’unità 1.4.1', t: 'La larghezza è fissata', d: 'Un numero occupa una quantità stabilita di bit. Quanto eccede va perduto.' }
    ],
    domanda: { d: 'Prima di proseguire: nel numero decimale 0,25 quale peso ha la posizione occupata dalla cifra 5?', o: [
      { t: 'Un decimo', fb: 'Un decimo è il peso della prima posizione dopo la virgola, quella del 2.' },
      { t: 'Un centesimo', ok: true, fb: 'La seconda posizione dopo la virgola ha peso un centesimo: 0,25 è due decimi più cinque centesimi.' },
      { t: 'Cinque', fb: 'Cinque è la cifra. Il suo peso dipende dalla posizione, che qui è la seconda dopo la virgola.' }
    ] }
  },
  idea: {
    titolo: 'I pesi oltre la virgola',
    termini: ['frazione binaria', 'precisione'],
    testo: [
      'Nella scrittura decimale i pesi proseguono oltre le unità. Dopo la virgola essi continuano a decrescere: un decimo, un centesimo, un millesimo, ciascuno pari a un decimo del precedente. Il numero 0,25 indica due decimi più cinque centesimi.',
      'In binario vale la medesima regola, con il due in luogo del dieci. Dopo la virgola i pesi sono un mezzo, un quarto, un ottavo, un sedicesimo, ciascuno la metà del precedente. Un numero scritto in questa forma prende il nome di [[frazione binaria]]. La scrittura 0,101 vale un mezzo più un ottavo, cioè 0,625.',
      { fig: 'celle', titolo: 'Il numero binario 0,101', nota: 'Un mezzo più un ottavo: 0,5 + 0,125 = 0,625.', celle: [
        { so: '1/2', v: '1', st: 'on', gi: '0,5' }, { so: '1/4', v: '0', gi: '0,25' }, { so: '1/8', v: '1', st: 'on', gi: '0,125' }] },
      'Le cifre binarie di una frazione si determinano con un procedimento elementare, il raddoppio. Se il doppio raggiunge o supera 1, la cifra è 1 e si sottrae l’unità; in caso contrario la cifra è 0. Il procedimento si ripete sul resto. Il raddoppio è efficace poiché sposta la virgola di una posizione, e porta la prima cifra dopo la virgola nella posizione delle unità, dove può essere letta.',
      'Con 0,625 il procedimento termina in tre passi. Il doppio è 1,25, e si ottiene la cifra 1 con resto 0,25. Il doppio di 0,25 è 0,5, e si ottiene la cifra 0. Il doppio di 0,5 è 1, e si ottiene la cifra 1 con resto nullo. Le cifre sono 1, 0, 1.',
      'Con altre frazioni il procedimento è privo di termine. Un decimo, in binario, è 0,000110011 e prosegue ripetendo indefinitamente il gruppo 0011. Lo stesso avviene nella scrittura decimale, dove un terzo si scrive 0,333 senza fine. In binario hanno una scrittura finita soltanto le frazioni che, ridotte ai minimi termini, hanno per denominatore 2, 4, 8, 16 o un altro numero ottenuto moltiplicando il due per se stesso. Tali numeri prendono il nome di potenze di due.',
      'Un calcolatore dispone di una quantità fissata di bit, e deve troncare le scritture infinite. Il numero di cifre conservate prende il nome di [[precisione]]. Un decimo è quindi memorizzato con un errore di piccola entità. Tale errore è di norma impercettibile, e tuttavia si accumula: sommando dieci volte un decimo si ottiene un numero molto prossimo a uno e diverso da uno.'
    ]
  },
  esperimento: {
    faremo: [
      'Scelta una frazione, se ne determinano le cifre binarie con il procedimento del raddoppio. Ogni cifra richiede due passaggi: il raddoppio, e la lettura della cifra con il calcolo del resto.',
      'Sono disponibili otto posizioni dopo la virgola. Alcune frazioni si esauriscono prima; altre le occupano tutte e lasciano ancora un resto.'
    ],
    vedrai: [
      ['virgola', 'Il resto', 'In alto a sinistra: la parte di numero ancora da scrivere.'],
      ['bit', 'Le otto posizioni', 'Al centro, con i pesi indicati sopra: un mezzo, un quarto, e così di seguito.'],
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
      domanda: (p) => 'Si scrive in binario il numero ' + ({ '5/8': '0,625', '3/8': '0,375', '13/16': '0,8125', '1/10': '0,1', '1/5': '0,2' })[p.f] + '. Quante cifre dopo la virgola occorreranno per scriverlo esattamente?',
      opzioni: () => [[1, '1'], [2, '2'], [3, '3'], [4, '4'], [8, '8'], ['mai', 'Nessun numero di cifre è sufficiente']]
    },
    confronto: (pred, esito) => (pred === 'mai' ? 'La previsione indicava una scrittura senza fine. ' : 'La previsione indicava ' + pred + (pred === 1 ? ' cifra. ' : ' cifre. ')) + (esito === 'mai' ? 'La scrittura prosegue senza fine: dopo otto cifre resta ancora una parte da scrivere, e i resti si ripetono. ' : 'Le cifre necessarie sono ' + esito + '. ') + (pred === esito ? 'La previsione coincide con l’esito.' : esito === 'mai' ? 'Il denominatore di questa frazione contiene il fattore cinque, assente da ogni potenza di due.' : 'Il denominatore della frazione è una potenza di due. Le cifre necessarie sono tante quante le volte in cui il due va moltiplicato per se stesso per ottenerlo.'),
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
      const hud = () => [['Cifre scritte', cifre.length, 'a'], ['Resto', D(num, den)], ['Totale dei pesi', D(somma, 256), 'c']];
      const P = (o, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(), els: quadro(o) }, extra));

      P({ att: 're' }, 0, 'La frazione da scrivere', 'Si deve scrivere ' + D(num, den) + ' con cifre binarie dopo la virgola. All’inizio il resto da scrivere è l’intero numero, e le otto posizioni sono vuote.',
        { chiedi: { d: 'Il primo passaggio raddoppia ' + D(num, den) + '. Il doppio è ' + D(2 * num, den) + '. Quale cifra va nella posizione di peso un mezzo?', o: ['0', '1'], g: 2 * num >= den ? 1 : 0, no: 'La cifra è 1 quando il doppio raggiunge o supera 1, cioè quando il numero contiene almeno un mezzo.' } });
      for (let j = 0; j < 8 && num !== 0; j++) {
        const doppio = 2 * num, bit = doppio >= den ? 1 : 0;
        P({ att: 're', doppio, cifra: j }, 1, 'Raddoppio per la posizione ' + PESI[j], 'Il resto è ' + D(num, den) + '. Il suo doppio è ' + D(doppio, den) + (bit ? ', che raggiunge o supera 1.' : ', che resta inferiore a 1.'), { calc: D(num, den) + ' × 2 = ' + D(doppio, den) });
        cifre.push(bit); num = doppio - bit * den; somma += bit * (256 >> (j + 1));
        const ripete = num !== 0 && visti.includes(num);
        if (ripete && ciclo === null) ciclo = j;
        visti.push(num);
        P({ cifra: j, att: 'so' }, 1, 'La cifra di peso ' + PESI[j] + ' è ' + bit, (bit ? 'Il doppio conteneva un’unità: la cifra è 1, e sottratta l’unità resta ' + D(num, den) + '.' : 'Il doppio era minore di 1: la cifra è 0, e il resto è il doppio stesso, ' + D(num, den) + '.') + (num === 0 ? ' Il resto è zero e la scrittura è completa.' : ripete ? ' Questo resto è già comparso: da questo punto le cifre si ripetono.' : ''),
          Object.assign({ calc: bit ? D(doppio, den) + ' − 1 = ' + D(num, den) : 'resto = ' + D(num, den) }, j === 1 && num !== 0 ? { chiedi: { d: 'Il resto è ' + D(num, den) + ' e il suo doppio è ' + D(2 * num, den) + '. Quale sarà la prossima cifra?', o: ['0', '1'], g: 2 * num >= den ? 1 : 0, no: 'La cifra è 1 quando il doppio raggiunge o supera 1.' } } : {}));
      }
      const esatta = num === 0;
      P({ att: 'so' }, 2, esatta ? 'La scrittura è esatta' : 'Posizioni esaurite, resto non nullo', esatta
        ? 'Le cifre trovate sono 0,' + cifre.join('') + '. La somma dei loro pesi è ' + D(somma, 256) + ', identica alla frazione di partenza. Sono state sufficienti ' + cifre.length + ' cifre.'
        : 'Le otto posizioni sono state occupate con 0,' + cifre.join('') + ' e resta ancora ' + D(num, den) + ' da scrivere. La somma dei pesi è ' + D(somma, 256) + ', vicina a ' + D(parti[0], den) + ' senza raggiungerlo.', { calc: '0,' + cifre.join('') + ' = ' + D(somma, 256) });
      if (!esatta) P({ att: 'so' }, 2, 'L’errore residuo', 'La differenza fra la frazione e il valore scritto è ' + D(parti[0] * 256 - somma * den, den * 256) + '. Con più posizioni l’errore si riduce senza mai annullarsi, poiché i resti continuano a ripetersi, e con essi le cifre.', { calc: D(parti[0], den) + ' − ' + D(somma, 256) + ' = ' + D(parti[0] * 256 - somma * den, den * 256) });
      return { passi, esito: esatta ? cifre.length : 'mai' };
    }
  },
  bilancio: {
    regola: [
      'Dopo la virgola i pesi binari sono un mezzo, un quarto, un ottavo, e così di seguito. Le cifre si determinano raddoppiando: se il doppio raggiunge 1 la cifra è 1 e si sottrae l’unità.',
      'Hanno una scrittura binaria finita soltanto le frazioni il cui denominatore, ridotto ai minimi termini, è una potenza di due. Le altre vengono troncate alla precisione disponibile.'
    ],
    errori: [
      ['Attendersi che 0,1 sia esatto.', 'Un decimo ha una scrittura decimale di una sola cifra e una scrittura binaria infinita. In memoria è sempre approssimato.'],
      ['Leggere i pesi come decimi.', 'In binario 0,1 vale un mezzo, e 0,01 vale un quarto.'],
      ['Omettere la sottrazione dell’unità.', 'Dopo una cifra 1 il resto è il doppio meno uno. Proseguendo con il doppio intero le cifre successive risultano errate.']
    ],
    saFare: ['Leggere una frazione binaria sommando i pesi dopo la virgola.', 'Determinare le cifre binarie di una frazione con il raddoppio.', 'Riconoscere le frazioni prive di una scrittura binaria finita.'],
    esercizi: [
      { d: 'Come si scrive in binario il numero decimale 0,75? Si indichino soltanto le cifre dopo la virgola.', segnaposto: 'Cifre binarie', giuste: ['11', '0.11', '0,11'],
        ok: 'Il doppio di 0,75 è 1,5: cifra 1, resta 0,5. Il doppio di 0,5 è 1: cifra 1, resta zero.',
        diagnosi: [
          { se: ['75', '0.75'], msg: 'Le cifre indicate sono quelle decimali. In binario le posizioni dopo la virgola hanno peso un mezzo e un quarto.' },
          { se: ['101', '0.101'], msg: 'La scrittura 0,101 vale un mezzo più un ottavo, cioè 0,625.' },
          { se: ['1', '0.1'], msg: 'Una sola cifra dà un mezzo. Manca un quarto per raggiungere 0,75.' }
        ],
        altro: 'Le cifre sono diverse. Si applichi il raddoppio due volte, sottraendo l’unità quando compare.',
        indizi: ['0,75 è un mezzo più un quarto.', 'Il doppio di 0,75 è 1,5: la prima cifra è 1 e resta 0,5.', 'Il doppio di 0,5 è 1: la seconda cifra è 1 e il resto è nullo.'],
        svolgimento: ['0,75 × 2 = 1,5 → cifra 1, resto 0,5.', '0,5 × 2 = 1 → cifra 1, resto 0.', 'La scrittura è 0,11.'] },
      { d: 'Quale di queste frazioni ha una scrittura binaria finita?', guida: 'Si scelga la risposta.', o: [
        { t: 'Un terzo', fb: 'Il denominatore tre non è una potenza di due. In binario un terzo è 0,010101 senza fine.' },
        { t: 'Tre sedicesimi', ok: true, fb: 'Sedici è due alla quarta: sono sufficienti quattro cifre, 0,0011.' },
        { t: 'Un decimo', fb: 'Dieci contiene il fattore cinque. In binario un decimo ripete all’infinito il gruppo 0011.' }] }
    ],
    sfida: ['lez06_01_fractional_binary', 'Frazioni binarie e pesi posizionali']
  }
});
