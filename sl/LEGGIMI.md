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
| Capitolo 5.1, unità 5.1.1–5.1.4 | nuovo formato |
| Capitolo 5.2, unità 5.2.1–5.2.5 | nuovo formato |
| Capitolo 5.3, unità 5.3.1–5.3.5 | nuovo formato |
| Capitolo 5.4, unità 5.4.1–5.4.5 | nuovo formato |
| Capitolo 5.5, unità 5.5.1–5.5.7 | nuovo formato |
| Capitolo 5.6, unità 5.6.1–5.6.5 | nuovo formato |
| Capitolo 5.7, unità 5.7.1–5.7.5 | nuovo formato |
| Capitolo 6.1, unità 6.1.1–6.1.3 | nuovo formato |
| Capitolo 6.2, unità 6.2.1–6.2.4 | nuovo formato |
| Capitolo 6.3, unità 6.3.1–6.3.4 | nuovo formato |
| Capitolo 6.4, unità 6.4.1–6.4.4 | nuovo formato |
| Capitolo 6.5, unità 6.5.1–6.5.4 | nuovo formato |
| Capitolo 6.6, unità 6.6.1–6.6.4 | nuovo formato |
| Capitolo 6.7, unità 6.7.1–6.7.4 | nuovo formato |
| Prove di fine capitolo, capitoli 1.1–1.7, 2.1–2.7, 3.1–3.6, 4.1–4.7, 5.1–5.7 e 6.1–6.7 | nuovo formato |

Il Modulo 0 e i sei moduli del corso sono completi nel nuovo formato, e nessun capitolo rimanda più alla versione precedente. Quella versione resta consultabile da `classico.html`, raggiungibile dal collegamento «Versione precedente del sito» della pagina di ingresso.

Il capitolo 2.7 tratta la sicurezza della memoria con modelli astratti: celle con un'etichetta, indirizzi di fantasia, blocchi di due istruzioni. Lo scopo è capire i meccanismi e le difese, e le unità non contengono procedure applicabili a programmi reali.

Il Modulo III lavora sul modello Y86-64 e sui processori didattici SEQ e PIPE: sintassi AT&T, sei fasi, pipeline a cinque stadi F, D, E, M, W. I capitoli 3.5 e 3.6 adottano ovunque le stesse regole: ogni salto condizionato è previsto eseguito, una previsione sbagliata costa due cicli, un carico seguito subito dal suo uso costa un ciclo, una `ret` ne costa tre. Laboratori, esercizi e prove dipendono da queste regole, e vanno aggiornati insieme se il modello cambia.

Il Modulo IV torna alla sintassi Intel del Modulo II e lavora su modelli semplificati, dichiarati nella nota di ogni laboratorio. I principali: istruzioni di 4 byte, con `int3` di 1 byte e `SYSCALL` di 2; tabella dei vettori a partire da 0x4000 con voci di 16 byte; frame di interruzione di cinque parole da 8 byte, più 8 byte quando c'è un codice di errore; errori delle chiamate di sistema restituiti come numeri negativi in RAX. Nei capitoli 4.4–4.7 i tempi sono numeri di modello e non misure di dispositivi reali: turni di bus da cinque cicli, trasferimento del disco a 128 byte per microsecondo, lettura, programmazione e cancellazione della flash da 50, 200 e 2000 microsecondi. Nell'unità 4.4.4 i cicli della griglia sono numerati da 0, come nella versione precedente del sito; nell'unità 4.4.3 le caselle della cronologia sono contate da 1.

Il Modulo V descrive processi e thread con tracce costruite a mano. Ogni laboratorio mostra una intercalazione fra le molte possibili, scelta per far emergere il fenomeno, e lo dichiara nella propria nota. Nel capitolo 5.3 i tempi sono millisecondi di modello. Nel capitolo 5.5 una `signal` con thread in coda consegna il permesso al primo in attesa e lascia fermo il contatore. I termini `thread` e `mutex` entrano nel glossario con l'unità 5.2.5; `deadlock` con la 5.6.2 e `starvation` con la 5.6.4, dove si presentano per la prima volta, e il capitolo 5.7 li riprende. La parola «stallo» resta riservata alla pipeline del Modulo III. Nell'unità 5.7.4 «transazione» indica un gruppo di modifiche sui dati: il glossario la tiene distinta, con la voce `transazione sui dati`, dalla transazione sul bus dell'unità 4.4.1. Nell'unità 5.7.3 possessi e massimi dei tre processi sono quelli della versione precedente del sito.

Il Modulo VI lavora su modelli numerici dichiarati nella nota di ogni laboratorio. Capitolo 6.1: una consultazione della cache costa 2 ns e un rifornimento dalla memoria 50 ns; la cache dell'unità 6.1.2 ha una sola posizione ammessa per ogni blocco da 64 byte. Capitoli 6.2 e 6.4: pagine e frame da 4096 byte; nell'unità 6.2.4 il servizio ordinario di una richiesta costa 100 ns; nell'unità 6.4.4 la TLB costa 1 ns e ogni lettura di memoria 50 ns. Capitolo 6.3: pagine da 1024 byte nelle unità 6.3.1–6.3.3 e da 4096 byte nella 6.3.4, voci da 8 byte che valgono 2 × PFN + valid, tabella a partire da 0x100000, e 0xFFFFFFFFFFFFFFFF come valore di errore della traduzione. Capitolo 6.5: blocchi da 4096 byte nell'unità 6.5.3 e da 1024 byte nella 6.5.4, dove i blocchi dati del volume sono numerati da 2 a 17. Capitolo 6.6: l'estensione di un file richiede tre scritture, cioè dati, bitmap e inode, e dopo un arresto sopravvive un prefisso di quelle scritture; il conto del journaling esclude i record di servizio, come il commit. Capitolo 6.7: il cifrario dell'unità 6.7.3 è uno XOR con una chiave di un byte, usato soltanto per mostrare i byte, e l'esperimento assume un cifrario sicuro; le unità trattano la protezione con modelli astratti e non contengono procedure applicabili a sistemi reali. La parola «frame» resta riservata al frame di pila del Modulo II, e il frame della memoria fisica entra nel glossario come «frame fisico». La parola «sentinella» resta riservata alla protezione della pila del capitolo 2.7, e l'esito di una traduzione fallita si chiama «valore di errore». La parola «transazione» indica dal capitolo 4.4 il trasferimento su un bus; il gruppo di modifiche dei capitoli 5.7 e 6.6 è la «transazione sui dati».

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
sl/js/rete.js         rete del corso in tre dimensioni, pagina di capitolo, glossario, guida all'uso
sl/js/avvio.js        collegamento dei percorsi e sequenza di avvio
sl/dati/corso.js      mappa di moduli, capitoli e unità
sl/dati/glossario.js  termini, definizioni e unità che li introduce
sl/dati/telemetria.js il record «TLM1» usato dal capitolo 1.7: codifica, campi, disegno dei byte
sl/dati/macchina.js   strumenti dei Moduli II, III e IV: registri x86-64, flag, tracce, listati, file di bit, pila, codifica Y86-64, diagrammi di pipeline, flusso di un'eccezione
sl/unita/<id>.js      un file per unità, caricato soltanto quando serve
sl/prove/<cap>.js     un file per capitolo con i generatori delle domande
sl/strumenti/         controlli sui contenuti
```

I percorsi sono `#/` (rete), `#/m/<modulo>`, `#/c/<capitolo>`, `#/u/<unità>/<fase>`, `#/p/<capitolo>/<variante>`, `#/glossario` e `#/guida`.

## Sequenza di avvio e guida

A ogni apertura della pagina compare una sequenza di avvio di circa quattro secondi, che riassume il contenuto del sito e si interrompe con un tasto o con un clic. Poiché il sito non conserva alcun dato, la sequenza non può sapere di essere già stata vista e si ripresenta a ogni caricamento; non compare quando il sistema richiede la riduzione del movimento, né sotto il controllo di uno strumento automatico. I numeri mostrati sono calcolati dalla mappa del corso. La pagina `#/guida` descrive in forma estesa l'organizzazione del sito e le modalità di consultazione.

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

Lo strumento non richiede installazioni. Per ogni unità genera i passi dell'esperimento con tutte le combinazioni dei comandi e verifica che l'esito sia fra le previsioni offerte, che le domande guidate abbiano una risposta valida e che gli esercizi siano completi. Poi controlla le regole di scrittura e, in sezioni distinte, il registro dei testi e la sicurezza del codice. Le regole di scrittura sono due. La prima riguarda l'ordine: un termine del glossario non deve comparire prima dell'unità che lo introduce, e gli usi anticipati ammessi sono elencati nello strumento con il loro motivo. La seconda riguarda lo stile: lo strumento segnala le lineette lunghe, le correzioni del tipo «non questo, ma quello», le formule di raccordo e le frasi scisse ripetute.

Per le prove di fine capitolo lo strumento compone tutte le 999 varianti e verifica ogni domanda: una sola opzione corretta, risposte scritte presenti, diagnosi che non coprono una risposta giusta, tre indizi, svolgimento, e almeno una domanda per ogni unità del capitolo. I testi delle domande passano dagli stessi controlli di ordine e di stile.

Il resoconto riporta anche, per ogni unità, il numero minimo e massimo di passi e l'indice di leggibilità Gulpease del testo dell'idea. Per ogni prova riporta quante formulazioni diverse produce la domanda meno varia.

## Registro dei testi

I testi adottano il registro accademico in forma impersonale: nella teoria, nei laboratori e negli esercizi. Sono esclusi la seconda persona, la prima persona plurale, le analogie tratte dalla vita quotidiana, il lessico colloquiale, i superlativi e le formule a effetto; le consegne degli esercizi hanno la forma «si calcoli», «si scelga». Lo strumento dei controlli riporta nella sezione «REGISTRO ACCADEMICO» il numero delle segnalazioni per modulo, e con l'opzione `--registro` ne elenca il dettaglio. Le parti già riscritte sono dichiarate nell'elenco `REGISTRO_FATTO` dello strumento: per esse ogni segnalazione è riportata come difetto da correggere.

Stato della riscrittura: sono conformi l'interfaccia, la guida e i Moduli 0, I, II e III (114 unità, 20 prove di capitolo, 323 voci di glossario, scopi e guide dei capitoli). Nei Moduli IV-VI sono state convertite in modo meccanico le formule ricorrenti (obiettivi, competenze, confronto della previsione, consegne, indizi); l'esposizione, le descrizioni dei passi e i commenti alle risposte sono ancora da riscrivere, modulo per modulo. La costante `REGISTRO_FATTO` in `sl/strumenti/controlli.js` elenca i prefissi già riscritti, per i quali ogni segnalazione è riportata come errore da correggere. Le stringhe visibili degli script dell'interfaccia, comprese quelle inserite in frammenti HTML, sono verificate a parte con `node sl/strumenti/controlli_interfaccia.js`.

## Sicurezza

Il sito è statico, privo di dipendenze esterne e di dati conservati: le classi di vulnerabilità pertinenti sono quelle del codice eseguito nel browser. Le misure adottate sono le seguenti.

- Politica di sicurezza dei contenuti in `index.html`: sono ammessi soltanto script, fogli di stile, caratteri e immagini serviti dal sito; sono esclusi script in linea, richieste di rete, oggetti incorporati, riquadri e invii di moduli. Gli stili in linea restano ammessi, perché le scene li impiegano per posizionare gli elementi.
- Nessun gestore di evento in linea e nessuna costruzione di codice da stringhe (`eval`, `new Function`, temporizzatori con codice testuale).
- Le parti dell'indirizzo sono accettate soltanto se brevi e composte da lettere, cifre, punti e trattini; identificativi di unità e di capitolo sono confrontati con la mappa del corso prima di ogni uso, e verificati di nuovo prima di comporre l'indirizzo di uno script da caricare.
- Ogni testo inserito nella pagina passa da una funzione di protezione dei caratteri speciali; le ricerche nel glossario e nei registri delle unità non raggiungono le proprietà ereditate degli oggetti.
- I collegamenti aperti in una nuova scheda portano `rel="noopener noreferrer"`, e la pagina dichiara `referrer` uguale a `no-referrer`.
- `classico.html` riceve una politica analoga, che ammette gli script in linea perché la versione precedente genera gestori di evento nel proprio HTML.

Lo strumento dei controlli verifica queste regole a ogni esecuzione (sezione «SICUREZZA»): risorse esterne, usi non ammessi, gestori in linea, presenza e contenuto della politica. Restano fuori dalla portata del sito le intestazioni HTTP, che GitHub Pages non consente di impostare: la direttiva `frame-ancestors` non è quindi applicabile, e l'inclusione della pagina in un riquadro di un altro sito resta possibile. Il sito è privo di sessioni, credenziali e azioni con effetti, sicché tale inclusione non espone alcun dato. Nelle impostazioni del repository conviene verificare che l'opzione «Enforce HTTPS» di GitHub Pages sia attiva.

## Sfide PWN

Il sito mostra soltanto gli identificativi e i titoli delle sfide. L'indirizzo della piattaforma non compare in nessun file.

## Licenza

Salvo diversa indicazione, contenuti e codice del sito sono distribuiti con licenza Creative Commons Attribuzione - Non commerciale - Condividi allo stesso modo 4.0 Internazionale (CC BY-NC-SA 4.0). La licenza comprende il testo e le figure della dispensa (`materiali/dispensa.pdf`); gli esempi di codice della dispensa restano sotto licenza MIT, come dichiarato in `materiali/NOTICE-dispensa.txt`. La nota di licenza compare nel piè di pagina, nella guida e nel file `LICENZA.md` della radice; il testo legale completo è nel file `LICENSE`. Il collegamento alla sintesi della licenza è l'unico indirizzo esterno ammesso dai controlli di sicurezza.

## Sfondo

Lo script `sl/js/sfondo.js` disegna su una tela fissa, posta dietro i contenuti, un reticolo esagonale percorso da onde di attivazione. Un velo attenua il disegno sotto la colonna centrale, e i pannelli del sito restano opachi. Lo sfondo è attivo dai 900 px di larghezza in su; al di sotto, e in stampa, tela e velo sono nascosti e il disegno è sospeso. La soglia compare due volte, nella costante `LARGHEZZA_MINIMA` dello script e nella regola `@media` di `sito.css`, e va modificata in entrambi i punti; l'intensità si regola con la costante `FORZA`. Il disegno si arresta quando la scheda del browser è nascosta, e si riduce a un fotogramma fermo con la preferenza di sistema per il movimento ridotto e durante le verifiche automatiche. Lo script non conserva dati e non effettua richieste di rete.

## Caratteri

I caratteri nella cartella `sl/font/` sono distribuiti con licenza SIL Open Font License 1.1. I testi delle licenze si trovano nella stessa cartella.
