# SistemiLab, nuova versione

Questa cartella contiene il nuovo sito. La pagina di ingresso è `index.html`, nella radice del repository. La versione precedente resta raggiungibile da `classico.html` e continua a usare le cartelle `js/`, `css/`, `contenuti/` e `assets/`, che non sono state toccate.

Il sito è statico e non ha dipendenze esterne: caratteri, simboli e script sono tutti serviti dal repository. Nessun dato viene scritto nel browser, quindi ogni visita riparte da zero.

## Stato dei contenuti

| Parte | Stato |
| --- | --- |
| Modulo 0, unità 0.1–0.4 | nuovo formato |
| Capitolo 1.1, unità 1.1.1–1.1.6 | nuovo formato |
| Capitolo 1.2, unità 1.2.1–1.2.4 | nuovo formato |
| Capitolo 1.3, unità 1.3.1–1.3.5 | nuovo formato |
| Capitolo 1.4, unità 1.4.1–1.4.4 | nuovo formato |
| Capitolo 1.5, unità 1.5.1–1.5.6 | nuovo formato |
| Capitolo 1.6, unità 1.6.1–1.6.4 | nuovo formato |
| Capitolo 1.7, unità 1.7.1–1.7.7 | nuovo formato |
| Capitolo 2.1, unità 2.1.1–2.1.4 | nuovo formato |
| Capitolo 2.2, unità 2.2.1–2.2.7 | nuovo formato |
| Capitolo 2.3, unità 2.3.1–2.3.6 | nuovo formato |
| Capitolo 2.4, unità 2.4.1–2.4.5 | nuovo formato |
| Capitolo 2.5, unità 2.5.1–2.5.6 | nuovo formato |
| Capitolo 2.6, unità 2.6.1–2.6.6 | nuovo formato |
| Capitolo 2.7, unità 2.7.1–2.7.7 | nuovo formato |
| Capitolo 3.1, unità 3.1.1–3.1.6 | nuovo formato |
| Capitolo 3.2, unità 3.2.1–3.2.5 | nuovo formato |
| Capitolo 3.3, unità 3.3.1–3.3.6 | nuovo formato |
| Capitolo 3.4, unità 3.4.1–3.4.5 | nuovo formato |
| Capitolo 3.5, unità 3.5.1–3.5.4 | nuovo formato |
| Capitolo 3.6, unità 3.6.1–3.6.7 | nuovo formato |
| Capitolo 4.1, unità 4.1.1–4.1.7 | nuovo formato |
| Capitolo 4.2, unità 4.2.1–4.2.5 | nuovo formato |
| Capitolo 4.3, unità 4.3.1–4.3.4 | nuovo formato |
| Capitolo 4.4, unità 4.4.1–4.4.5 | nuovo formato |
| Capitolo 4.5, unità 4.5.1–4.5.3 | nuovo formato |
| Capitolo 4.6, unità 4.6.1–4.6.4 | nuovo formato |
| Capitolo 4.7, unità 4.7.1–4.7.5 | nuovo formato |
| Prove di fine capitolo, capitoli 1.1–1.7, 2.1–2.7, 3.1–3.6 e 4.1–4.7 | nuovo formato |
| Moduli V e VI | versione precedente, aperta da `classico.html` |

I Moduli I, II, III e IV sono completi. Per i capitoli non ancora riscritti la rete del corso rimanda alla versione precedente.

Il capitolo 2.7 tratta la sicurezza della memoria con modelli astratti: celle con un'etichetta, indirizzi di fantasia, blocchi di due istruzioni. Lo scopo è capire i meccanismi e le difese, e le unità non contengono procedure applicabili a programmi reali.

Il Modulo III lavora sul modello Y86-64 e sui processori didattici SEQ e PIPE: sintassi AT&T, sei fasi, pipeline a cinque stadi F, D, E, M, W. I capitoli 3.5 e 3.6 adottano ovunque le stesse regole: ogni salto condizionato è previsto eseguito, una previsione sbagliata costa due cicli, un carico seguito subito dal suo uso costa un ciclo, una `ret` ne costa tre. Laboratori, esercizi e prove dipendono da queste regole, e vanno aggiornati insieme se il modello cambia.

Il Modulo IV torna alla sintassi Intel del Modulo II e lavora su modelli semplificati, dichiarati nella nota di ogni laboratorio. I principali: istruzioni di 4 byte, con `int3` di 1 byte e `SYSCALL` di 2; tabella dei vettori a partire da 0x4000 con voci di 16 byte; frame di interruzione di cinque parole da 8 byte, più 8 byte quando c'è un codice di errore; errori delle chiamate di sistema restituiti come numeri negativi in RAX. Nei capitoli 4.4–4.7 i tempi sono numeri di modello e non misure di dispositivi reali: turni di bus da cinque cicli, trasferimento del disco a 128 byte per microsecondo, lettura, programmazione e cancellazione della flash da 50, 200 e 2000 microsecondi. Nell'unità 4.4.4 i cicli della griglia sono numerati da 0, come nella versione precedente del sito; nell'unità 4.4.3 le caselle della cronologia sono contate da 1.

## Struttura

```
index.html            pagina unica del nuovo sito
classico.html         pagina unica della versione precedente
sl/css/sito.css       foglio di stile
sl/font/              caratteri (Chakra Petch, IBM Plex Sans, IBM Plex Mono) con le loro licenze
sl/js/nucleo.js       spazio dei nomi SL, testo, percorsi, caricamento delle unità
sl/js/simboli.js      i 56 simboli isometrici
sl/js/scena.js        palco degli esperimenti: elementi con identificativo stabile e transizioni
sl/js/laboratorio.js  previsione, passi, modi «Osserva» e «Guidato»
sl/js/unita.js        le cinque fasi di un'unità, figure ed esercizi
sl/js/prova.js        prove di fine capitolo: varianti, pagina, riepilogo
sl/js/rete.js         rete del corso in tre dimensioni, pagina di capitolo, glossario
sl/dati/corso.js      mappa di moduli, capitoli e unità
sl/dati/glossario.js  termini, definizioni e unità che li introduce
sl/dati/telemetria.js il record «TLM1» usato dal capitolo 1.7: codifica, campi, disegno dei byte
sl/dati/macchina.js   strumenti dei Moduli II, III e IV: registri x86-64, flag, tracce, listati, file di bit, pila, codifica Y86-64, diagrammi di pipeline, flusso di un'eccezione
sl/unita/<id>.js      un file per unità, caricato soltanto quando serve
sl/prove/<cap>.js     un file per capitolo con i generatori delle domande
sl/strumenti/         controlli sui contenuti
```

I percorsi sono `#/` (rete), `#/m/<modulo>`, `#/c/<capitolo>`, `#/u/<unità>/<fase>`, `#/p/<capitolo>/<variante>` e `#/glossario`.

## Aggiungere un'unità

1. Dichiarare l'unità in `sl/dati/corso.js`, dentro il suo capitolo. Un capitolo passa al nuovo formato con `stato: 'nuovo'` e l'elenco `unita`.
2. Creare `sl/unita/<id>.js` partendo da un'unità esistente. Le sezioni sono `richiami`, `idea`, `esperimento`, `lab` e `bilancio`.
3. Aggiungere a `sl/dati/glossario.js` i termini elencati in `idea.termini`, ciascuno con l'unità che lo introduce. Nel testo dell'idea il termine si evidenzia con `[[termine]]` oppure `[[termine|forma mostrata]]`.
4. Avviare i controlli.

L'esperimento è descritto dalla funzione `lab.costruisci(p)`, che riceve i valori dei comandi e restituisce l'elenco dei passi e l'esito. I passi nascono dai dati, quindi il loro numero cambia con i valori scelti. Ogni passo elenca gli elementi presenti sulla scena; un elemento che conserva lo stesso identificativo fra due passi si sposta e cambia stato con una transizione.

## Prove di fine capitolo

Un capitolo ha una prova quando la sua voce in `sl/dati/corso.js` porta `prova: true` ed esiste il file `sl/prove/<capitolo>.js`. Il file registra un elenco di generatori. Ogni generatore riceve una sorgente di numeri ripetibili e restituisce una domanda nello stesso formato degli esercizi delle unità, con in più il campo `u`, cioè l'unità da rivedere in caso di errore.

Le varianti sono numerate da 1 a 999 e il numero compare nell'indirizzo: la stessa variante ripresenta sempre le stesse domande, quindi si può assegnare a una classe intera. Aprendo `#/p/<capitolo>` senza numero, la pagina ne sceglie uno a caso. Il riepilogo distingue le risposte giuste al primo tentativo da quelle arrivate dopo un errore o un indizio, ed elenca le unità da rivedere. Vive soltanto nella pagina aperta.

## Controlli

```
node sl/strumenti/controlli.js
node sl/strumenti/controlli.js --tutto
```

Lo strumento non richiede installazioni. Per ogni unità genera i passi dell'esperimento con tutte le combinazioni dei comandi e verifica che l'esito sia fra le previsioni offerte, che le domande guidate abbiano una risposta valida e che gli esercizi siano completi. Poi controlla due regole di scrittura. La prima riguarda l'ordine: un termine del glossario non deve comparire prima dell'unità che lo introduce, e gli usi anticipati ammessi sono elencati nello strumento con il loro motivo. La seconda riguarda lo stile: lo strumento segnala le lineette lunghe, le correzioni del tipo «non questo, ma quello», le formule di raccordo e le frasi scisse ripetute.

Per le prove di fine capitolo lo strumento compone tutte le 999 varianti e verifica ogni domanda: una sola opzione corretta, risposte scritte presenti, diagnosi che non coprono una risposta giusta, tre indizi, svolgimento, e almeno una domanda per ogni unità del capitolo. I testi delle domande passano dagli stessi controlli di ordine e di stile.

Il resoconto riporta anche, per ogni unità, il numero minimo e massimo di passi e l'indice di leggibilità Gulpease del testo dell'idea. Per ogni prova riporta quante formulazioni diverse produce la domanda meno varia.

## Sfide PWN

Il sito mostra soltanto gli identificativi e i titoli delle sfide. L'indirizzo della piattaforma non compare in nessun file.

## Caratteri

I caratteri nella cartella `sl/font/` sono distribuiti con licenza SIL Open Font License 1.1. I testi delle licenze si trovano nella stessa cartella.
