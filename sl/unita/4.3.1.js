'use strict';
SL.unita431 = (() => {
  const FINE = 4, H = SL.kern.H;
  // fase: 0 il comando · 1 la conversione · 2 la prima lettura di STATUS · 3 attesa oppure via libera · 4 la lettura di DATA · 5 READY torna a 0
  const quadro = (pre, p, f, o) => {
    const el = SL.el, els = [], t = p.t, presto = t < FINE, letto = Math.max(FINE, t), passo = o.w / 9;
    const ora = [0, 1, t, presto ? FINE : t, letto, 8][f], pronto = f >= 5 ? 0 : f >= 3 ? 1 : f === 2 ? (presto ? 0 : 1) : 0;
    for (let k = 0; k <= 8; k++) {
      const visto = k <= ora, v = k >= FINE && k <= letto ? 1 : 0;
      els.push(el.cella(pre + 'c' + k, o.x + k * passo, o.y, passo - 6, o.hc, visto ? String(v) : '·', !visto ? 'off' : k === ora && f >= 2 && f <= 4 ? 'att' : v ? 'on' : 'zero', { piccola: true, so: 'ciclo ' + k }));
    }
    if (f >= 2) els.push(el.nota(pre + 'n1', o.x + t * passo, o.y + o.hc + 6, '↑ STATUS', 'mono minuta', f < 4 ? 'att' : ''));
    if (f >= 4) els.push(el.nota(pre + 'n2', o.x + letto * passo, o.y + o.hc + (letto === t ? 24 : 6), '↑ DATA', 'mono minuta', 'att'));
    if (o.conti) {
      const y2 = o.y + o.hc + 52, w = (o.w - 6 - 3 * o.gap) / 4;
      els.push(el.box(pre + 'q1', o.x, y2, w, o.h, 'registro COMMAND', 'START', f === 0 ? 'att' : 'on', { cls: 'stretta' }),
        el.box(pre + 'q2', o.x + w + o.gap, y2, w, o.h, 'registro STATUS', 'READY = ' + pronto, f === 2 || f === 5 ? 'att' : pronto ? 'on' : 'zero', { cls: 'stretta' }),
        el.box(pre + 'q3', o.x + 2 * (w + o.gap), y2, w, o.h, 'registro DATA', f >= 4 ? H(p.d) : '·', f === 4 ? 'att' : f > 4 ? 'on' : '', { cls: 'stretta' }),
        el.box(pre + 'q4', o.x + 3 * (w + o.gap), y2, w, o.h, 'il driver', ['scrive START', 'fa altro', 'legge STATUS', presto ? 'attende' : 'può leggere', 'legge DATA', 'ha il campione'][f], f >= 2 && f <= 4 ? 'att' : 'on', { cls: 'stretta' }));
    }
    return els;
  };
  return { FINE, H, quadro };
})();
SL.registra('4.3.1', {
  titolo: 'Interfaccia del controller e notifiche',
  obiettivo: 'Alla fine saprai descrivere come un driver comanda una periferica attraverso i registri del suo controller, e in quale momento può leggere il dato richiesto.',
  concetti: [['dispositivo', 'Il controller fra periferica e processore'], ['register', 'Comando, stato, dato'], ['clock', 'Troppo presto, troppo tardi']],
  filigrana: ['dispositivo', 'register', 'clock'],
  richiami: {
    carte: [
      { sim: 'dispositivo', da: 'Dall’unità 1.1.1', t: 'I dispositivi', d: 'Le parti del calcolatore che lo mettono in comunicazione con l’esterno.' },
      { sim: 'privilegi', da: 'Dall’unità 2.5.1', t: 'Il kernel', d: 'La sola parte del sistema che può comandare i dispositivi.' },
      { sim: 'bit', da: 'Dall’unità 2.1.1', t: 'Un flag', d: 'Un bit che ricorda una condizione: vale 1 quando la condizione è vera.' }
    ],
    domanda: { d: 'Prima di proseguire: un termometro digitale impiega 4 cicli del proprio orologio per misurare. Se la misura parte al ciclo 0, da quale ciclo il numero è disponibile?', o: [
      { t: 'Dal ciclo 4', ok: true, fb: 'La misura occupa i cicli 0, 1, 2 e 3, e il risultato è pronto all’inizio del ciclo 4.' },
      { t: 'Dal ciclo 0', fb: 'Al ciclo 0 la misura è appena cominciata.' },
      { t: 'Dal ciclo 3', fb: 'Durante il ciclo 3 la misura è ancora in corso.' }
    ] }
  },
  idea: {
    titolo: 'Parlare con una periferica',
    termini: ['controller del dispositivo', 'driver', 'registro del dispositivo'],
    testo: [
      'Una periferica, per esempio un sensore di temperatura, non è collegata direttamente al processore. In mezzo c’è un circuito, il [[controller del dispositivo|controller]], che la comanda e ne conserva i risultati. Il processore parla con il controller, e il controller parla con la periferica.',
      'Il controller espone alcune caselle in cui il processore può leggere e scrivere, i [[registro del dispositivo|registri del dispositivo]]. Portano lo stesso nome dei registri del processore. Si trovano però nel controller, e hanno compiti fissi. In questo esempio sono tre. Scrivendo START nel registro COMMAND si avvia una misura. Il registro STATUS contiene un bit, READY, che vale 0 mentre la misura è in corso e passa a 1 quando il numero è disponibile. Il registro DATA contiene il numero.',
      'Il programma del kernel che conosce questi registri, e sa in quale ordine usarli, si chiama [[driver]]. Ogni tipo di periferica ha il proprio. Il resto del kernel chiede al driver «una misura», e ignora come sia fatto il controller.',
      { fig: 'scena', w: 720, h: 96, titolo: 'Il bit READY durante una misura avviata al ciclo 0', nota: 'La misura finisce al ciclo 4. Il driver legge STATUS al ciclo 2, attende, e legge DATA al ciclo 4.', els: SL.unita431.quadro('g', { t: 2, d: 0x41 }, 5, { x: 10, y: 22, w: 700, hc: 30 }) },
      'La misura richiede tempo, e il driver deve rispettarlo. Se legge DATA quando READY vale ancora 0, trova un valore vecchio oppure privo di senso. Prima legge STATUS: con READY a 0 attende, con READY a 1 preleva il dato. In questo controller la lettura di DATA consuma il campione, e READY torna a 0 fino alla misura successiva.',
      'Resta un problema, che sarà il tema delle prossime unità. Il driver non sa quando READY passerà a 1. Se guarda troppo presto deve tornare a guardare. Se guarda troppo tardi il dato è rimasto fermo ad aspettarlo.'
    ]
  },
  esperimento: {
    faremo: [
      'Al ciclo 0 il driver avvia una misura, che il controller completa al ciclo 4. Sceglierai in quale ciclo il driver va a leggere lo stato per la prima volta, e quale valore ha misurato il sensore.',
      'Seguiremo il bit READY ciclo per ciclo, e vedremo quando il driver riesce a prelevare il dato. Dopo il caso proposto, fai arrivare il driver al ciclo 6.'
    ],
    vedrai: [
      ['clock', 'I cicli del dispositivo', 'In alto: una casella per ciclo, con il valore del bit READY.'],
      ['register', 'I tre registri', 'In basso: COMMAND, STATUS e DATA, come li vede il driver.'],
      ['dispositivo', 'Il driver', 'In basso a destra: che cosa sta facendo il driver.']
    ]
  },
  lab: {
    titolo: 'Una misura, dal comando al dato',
    scena: { w: 860, h: 222 },
    atti: ['Il comando', 'La misura', 'La lettura dello stato', 'Il dato'],
    controlli: [
      { id: 't', tipo: 'scelta', eti: 'Prima lettura di STATUS', opzioni: [[1, 'al ciclo 1'], [2, 'al ciclo 2'], [4, 'al ciclo 4'], [6, 'al ciclo 6']], valore: 2 },
      { id: 'd', tipo: 'scelta', eti: 'Valore misurato', opzioni: [[0x41, '0x41'], [0x7C, '0x7C']], valore: 0x41 }
    ],
    nota: 'I passi sono sempre sei. La misura parte al ciclo 0 e termina al ciclo 4.',
    previsione: {
      domanda: (p) => 'Il driver avvia la misura al ciclo 0. Il controller la completa al ciclo 4. Il driver legge STATUS per la prima volta al ciclo ' + p.t + '. In quale ciclo riesce a leggere il dato?',
      opzioni: (p) => Array.from(new Set([p.t, 4, p.t + 4])).sort((a, b) => a - b).map((v) => [v, 'Al ciclo ' + v])
    },
    confronto: (pred, esito, p) => 'Avevi previsto il ciclo ' + pred + '. Il driver legge il dato al ciclo ' + esito + '. ' + (pred === esito ? 'La previsione coincide con l’esito.' : p.t < 4 ? 'Al ciclo ' + p.t + ' READY vale ancora 0. Il driver deve attendere la fine della misura, al ciclo 4.' : 'Il dato è pronto dal ciclo 4, e il driver lo preleva quando arriva, al ciclo ' + p.t + '.'),
    costruisci(p) {
      const U = SL.unita431, H = U.H, passi = [], t = p.t, presto = t < U.FINE, letto = Math.max(U.FINE, t);
      const quadro = (f) => [SL.el.nota('t0', 20, 0, 'BIT READY, CICLO PER CICLO', 'mono')].concat(U.quadro('q', p, f, { x: 20, y: 40, w: 826, hc: 34, conti: true, h: 58, gap: 14 }));
      const hud = (f) => [['Ciclo', String([0, 1, t, presto ? U.FINE : t, letto, letto][f]), 'a'], ['READY', String(f >= 5 ? 0 : f >= 3 ? 1 : f === 2 ? (presto ? 0 : 1) : 0)], ['Dato letto', f >= 4 ? H(p.d) : '·', 'c']];
      const P = (f, atto, titolo, testo, extra) => passi.push(Object.assign({ atto, titolo, testo, hud: hud(f), els: quadro(f) }, extra));

      P(0, 0, 'Il comando', 'Al ciclo 0 il driver scrive START nel registro COMMAND. Il controller avvia la misura e mette READY a 0, per segnalare che il dato deve ancora arrivare.', { calc: 'COMMAND = START · READY = 0' });
      P(1, 1, 'La misura', 'Il sensore sta convertendo la temperatura in un numero. Servono 4 cicli del dispositivo. Il driver nel frattempo è libero, e il registro DATA non contiene nulla di utile.', { calc: 'misura in corso fino al ciclo 4',
        chiedi: { d: 'Al ciclo ' + t + ' il driver leggerà STATUS. Quanto varrà READY?', o: ['0', '1'], g: presto ? 0 : 1, no: presto ? 'La misura termina al ciclo 4. Al ciclo ' + t + ' è ancora in corso, e READY vale 0.' : 'La misura è terminata al ciclo 4. Al ciclo ' + t + ' READY vale 1.' } });
      P(2, 2, 'La prima lettura di STATUS', 'Al ciclo ' + t + ' il driver legge il registro STATUS. ' + (presto ? 'READY vale 0: la misura è ancora in corso. Leggere DATA adesso darebbe un valore senza significato.' : t === U.FINE ? 'READY vale 1: la misura è appena terminata, e il dato è disponibile.' : 'READY vale 1: la misura è terminata al ciclo 4, e il dato attende da ' + (t - U.FINE) + ' cicli.'), { calc: 'ciclo ' + t + ': READY = ' + (presto ? 0 : 1) });
      P(3, 2, presto ? 'L’attesa' : 'Via libera', presto ? 'Il driver deve attendere, e tornare a leggere STATUS. Al ciclo 4 la misura termina, READY passa a 1 e il dato compare nel registro DATA.' : 'Con READY a 1 il driver può procedere subito alla lettura del dato.', { calc: presto ? 'attesa di ' + (U.FINE - t) + (U.FINE - t === 1 ? ' ciclo' : ' cicli') : 'nessuna attesa' });
      P(4, 3, 'La lettura di DATA', 'Al ciclo ' + letto + ' il driver legge il registro DATA e ottiene ' + H(p.d) + ', cioè ' + p.d + ' in base dieci.' + (t > U.FINE ? ' Il dato era pronto dal ciclo 4: il ritardo del driver ha aggiunto ' + (t - U.FINE) + ' cicli.' : ''), { calc: 'ciclo ' + letto + ': DATA = ' + H(p.d), esito: ['lettura al ciclo ' + letto, 'si'] });
      P(5, 3, 'READY torna a 0', 'La lettura ha consumato il campione. Il controller riporta READY a 0, e il registro DATA è libero per la misura successiva, che partirà con un nuovo START.', { calc: 'READY = 0', esito: ['lettura al ciclo ' + letto, 'si'] });
      return { passi, esito: letto };
    }
  },
  bilancio: {
    regola: [
      'Un driver comanda una periferica leggendo e scrivendo i registri del suo controller: COMMAND per avviare una operazione, STATUS per conoscerne lo stato, DATA per prelevare il risultato.',
      'Il dato va letto soltanto quando READY vale 1. Un controllo fatto troppo presto obbliga ad attendere, uno fatto troppo tardi lascia il dato fermo.'
    ],
    errori: [
      ['Leggere DATA senza guardare STATUS.', 'Con READY a 0 il registro DATA contiene un valore vecchio, oppure privo di senso.'],
      ['Confondere i registri del dispositivo con quelli del processore.', 'Stanno nel controller, e ciascuno ha un compito fisso stabilito dal costruttore.'],
      ['Pensare che il dato resti leggibile per sempre.', 'In questo controller la lettura consuma il campione, e READY torna a 0.']
    ],
    saFare: ['Descrivo il compito di COMMAND, STATUS e DATA.', 'Dico quando il driver può leggere il dato.', 'Calcolo il ritardo di una lettura tardiva.'],
    esercizi: [
      { d: 'Un controller completa una misura 6 cicli dopo il comando, dato al ciclo 0. Il driver legge STATUS al ciclo 9, trova READY a 1 e legge subito DATA. Di quanti cicli ha ritardato la lettura rispetto al primo momento possibile?', segnaposto: 'Un numero', giuste: ['3', 'tre'],
        ok: 'Il dato era pronto dal ciclo 6, e la lettura avviene al ciclo 9: 9 − 6 = 3 cicli.',
        diagnosi: [
          { se: ['9', 'nove'], msg: 'Nove è il ciclo della lettura. Il ritardo si conta da quando il dato era pronto.' },
          { se: ['6', 'sei'], msg: 'Sei è il ciclo in cui il dato diventa pronto.' },
          { se: ['0', 'zero'], msg: 'Il dato era pronto prima dell’arrivo del driver.' }
        ],
        altro: 'Il numero è diverso. Sottrai il ciclo in cui il dato è pronto dal ciclo della lettura.',
        indizi: ['Il dato è pronto dal ciclo 6.', 'Il driver lo legge al ciclo 9.', '9 − 6.'],
        svolgimento: ['Dato pronto: ciclo 6.', 'Lettura: ciclo 9.', 'Ritardo: 3 cicli.'] },
      { d: 'Lo stesso driver legge STATUS al ciclo 2 e trova READY a 0. Che cosa deve fare?', guida: 'Scegli la risposta.', o: [
        { t: 'Attendere, e leggere di nuovo STATUS più tardi', ok: true, fb: 'La misura è in corso. Il dato sarà valido soltanto quando READY passerà a 1.' },
        { t: 'Leggere comunque DATA', fb: 'Con READY a 0 il registro DATA non contiene il risultato di questa misura.' },
        { t: 'Scrivere di nuovo START', fb: 'La misura è già in corso. Un secondo comando la farebbe ripartire, oppure verrebbe ignorato.' }] },
      { d: 'Quale parte del sistema conosce l’ordine in cui usare i registri di un controller?', guida: 'Scegli la risposta.', o: [
        { t: 'Il driver di quella periferica', ok: true, fb: 'Il driver racchiude la conoscenza del controller. Il resto del kernel gli chiede il servizio.' },
        { t: 'Il programma dell’utente', fb: 'Nel modo utente i registri dei dispositivi sono irraggiungibili. Il programma chiede al kernel.' },
        { t: 'Il processore', fb: 'Il processore esegue le istruzioni del driver. Il significato dei registri sta nel driver.' }] }
    ],
    sfida: ['cslez4_3_01_io_interrupts_01', 'Registri di comando, stato e dati']
  }
});
