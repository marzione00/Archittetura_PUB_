# SistemiLab

Questa cartella contiene il sito. La pagina di ingresso è `index.html`, nella radice del repository. Fuori da questa cartella il sito impiega soltanto la dispensa in PDF, nella cartella `materiali/`. Il repository non contiene altre versioni del sito.

Il sito è statico e non ha dipendenze esterne: caratteri, simboli e script sono tutti serviti dal repository. Nessun dato è scritto nel browser, e ogni visita riparte pertanto dalle condizioni iniziali.

## Contenuti

Il corso comprende il Modulo 0, con quattro unità prive di capitolo, e sei moduli tematici, per un totale di 41 capitoli e 208 unità. Ogni capitolo dispone di una prova di fine capitolo. Tutti i contenuti seguono il medesimo formato.

Il sito segue la dispensa di riferimento nell'edizione rivista (sorgente ACS, protocollo di revisione 1.2, ancora da validare): ne adotta la terminologia, la notazione e il processore del caso di studio. Le 43 unità il cui argomento va oltre la dispensa portano in `sl/dati/corso.js` il campo `oltre: true`; l'interfaccia le contrassegna come «Approfondimento» nella pagina del capitolo, nella testata dell'unità e nelle domande delle prove che vi si riferiscono. Il capitolo 1.7 è interamente di lettura facoltativa. Le sostituzioni lessicali adottate sono quelle del protocollo: CPU in luogo di processore logico, processo in luogo di lavoro nel senso di job (la quantità di lavoro svolta dal processore si indica come calcolo o esecuzione), time slice in luogo di quanto, `down` e `up` con il valore del semaforo, blocco in luogo di linea di cache, tempo medio di accesso in luogo di AMAT, mantissa in luogo di significando, bit map con 1 per un blocco libero, file system e inode.

Il capitolo 2.7 tratta la sicurezza della memoria con modelli astratti: celle con un'etichetta, indirizzi di fantasia, blocchi di due istruzioni. Lo scopo è capire i meccanismi e le difese, e le unità non contengono procedure applicabili a programmi reali.

Il Modulo III lavora sulla CPU del caso di studio della dispensa, nella versione a ciclo singolo e in quella con pipeline. Le istruzioni sono `halt`, `nop`, `mov` nelle forme registro-registro, costante-registro, lettura e scrittura in memoria, `add`, `sub`, `and`, `or` e `je`, scritte con la destinazione a sinistra; il solo flag è ZF, e i codici di stato sono SAOK, SHLT, SADR e SINS. Per `je` il campo ifun vale 3: è una scelta del modello, dichiarata nel modulo `SL.isa` di `sl/dati/macchina.js`. Le fasi sono sei: fetch, decode, execute, memory, write back e aggiornamento del PC. La CPU con pipeline ha cinque stadi, F, D, E, M, W, e calcola il PC prima del fetch. Le dipendenze dei dati si risolvono soltanto con istruzioni `nop`: un valore scritto nello stadio W è leggibile nello stadio D dal ciclo successivo, e fra l'istruzione che produce un registro e quella che lo legge occorrono pertanto tre istruzioni (regola delle tre istruzioni). Inoltro, stallo e previsione dei salti non sono impiegati. Laboratori, esercizi e prove dipendono da queste regole, e vanno aggiornati insieme se il modello cambia.

Il Modulo IV torna alla sintassi Intel del Modulo II e lavora su modelli semplificati, dichiarati nella nota di ogni laboratorio. I principali: istruzioni di 4 byte, con `int3` di 1 byte e `SYSCALL` di 2; tabella dei vettori a partire da 0x4000 con voci di 16 byte; frame di interruzione di cinque parole da 8 byte, più 8 byte quando c'è un codice di errore; errori delle chiamate di sistema restituiti come numeri negativi in RAX. Nei capitoli 4.4–4.7 i tempi sono numeri di modello e non misure di dispositivi reali: turni di bus da cinque cicli, trasferimento del disco a 128 byte per microsecondo, lettura, programmazione e cancellazione della flash da 50, 200 e 2000 microsecondi. Nell'unità 4.4.4 i cicli della griglia sono numerati da 0, come nella versione precedente del sito; nell'unità 4.4.3 le caselle della cronologia sono contate da 1.

Il Modulo V descrive processi e thread con tracce costruite a mano. Ogni laboratorio mostra una intercalazione fra le molte possibili, scelta per far emergere il fenomeno, e lo dichiara nella propria nota. Nel capitolo 5.3 i tempi sono millisecondi di modello. Nei capitoli 5.5 e 5.6 le operazioni sui semafori sono `down` e `up`, e i sinonimi P e V, wait e signal compaiono una sola volta: una `up` con thread in coda risveglia il primo in attesa e lascia invariato il valore del semaforo. I termini `thread` e `mutex` entrano nel glossario con l'unità 5.2.5; `deadlock` con la 5.6.2 e `starvation` con la 5.6.4, dove si presentano per la prima volta, e il capitolo 5.7 li riprende. Nell'unità 5.7.4 «transazione» indica un gruppo di modifiche sui dati: il glossario la tiene distinta, con la voce `transazione sui dati`, dalla transazione sul bus dell'unità 4.4.1. Nell'unità 5.7.3 possessi e massimi dei tre processi sono quelli della versione precedente del sito.

Il Modulo VI lavora su modelli numerici dichiarati nella nota di ogni laboratorio. Capitolo 6.1: una consultazione della cache costa 2 ns e un rifornimento dalla memoria 50 ns; la cache dell'unità 6.1.2 ha una sola posizione ammessa per ogni blocco da 64 byte. Capitoli 6.2 e 6.4: pagine e frame da 4096 byte; nell'unità 6.2.4 il servizio ordinario di una richiesta costa 100 ns; nell'unità 6.4.4 la TLB costa 1 ns e ogni lettura di memoria 50 ns. Capitolo 6.3: pagine da 1024 byte nelle unità 6.3.1–6.3.3 e da 4096 byte nella 6.3.4, voci da 8 byte che valgono 2 × PFN + valid, tabella a partire da 0x100000, e 0xFFFFFFFFFFFFFFFF come valore di errore della traduzione. Capitolo 6.5: blocchi da 4096 byte nell'unità 6.5.3 e da 1024 byte nella 6.5.4, dove i blocchi dati del volume sono numerati da 2 a 17. Capitolo 6.5: la bit map dei blocchi vale 1 per un blocco libero e 0 per un blocco occupato. Capitolo 6.6: l'estensione di un file richiede tre scritture, cioè dati, bit map e inode, e dopo un arresto sopravvive un prefisso di quelle scritture; il conto del journaling esclude i record di servizio, come il commit. Capitolo 6.7: il cifrario dell'unità 6.7.3 è uno XOR con una chiave di un byte, usato soltanto per mostrare i byte, e l'esperimento assume un cifrario sicuro; le unità trattano la protezione con modelli astratti e non contengono procedure applicabili a sistemi reali. La parola «frame» resta riservata al frame di pila del Modulo II, e il frame della memoria fisica entra nel glossario come «frame fisico». La parola «sentinella» resta riservata alla protezione della pila del capitolo 2.7, e l'esito di una traduzione fallita si chiama «valore di errore». La parola «transazione» indica dal capitolo 4.4 il trasferimento su un bus; il gruppo di modifiche dei capitoli 5.7 e 6.6 è la «transazione sui dati».

## Struttura

```
index.html            pagina unica del sito
materiali/            dispensa in PDF e relativa nota di licenza
sl/icona.svg          icona della scheda del browser
sl/css/sito.css       foglio di stile
sl/font/              caratteri (Chakra Petch, IBM Plex Sans, IBM Plex Mono) con le loro licenze
sl/js/nucleo.js       spazio dei nomi SL, testo, percorsi, caricamento delle unità
sl/js/simboli.js      i 56 simboli isometrici
sl/js/scena.js        palco degli esperimenti: elementi con identificativo stabile e transizioni
sl/js/laboratorio.js  previsione, passi, modi «Osserva» e «Guidato»
sl/js/unita.js        le cinque fasi di un'unità, figure ed esercizi
sl/js/prova.js        prove di fine capitolo: varianti, pagina, riepilogo
sl/js/rete.js         rete del corso in tre dimensioni, pagina di capitolo, glossario, guida all'uso
sl/js/intro.js        introduzione a schede, con il faro sugli elementi della pagina
sl/js/avvio.js        collegamento dei percorsi e apertura dell'introduzione
sl/dati/corso.js      mappa di moduli, capitoli e unità
sl/dati/glossario.js  termini, definizioni e unità che li introduce
sl/dati/telemetria.js il record «TLM1» usato dal capitolo 1.7: codifica, campi, disegno dei byte
sl/dati/intro.js      testi, pagine ed elementi illuminati dell'introduzione
sl/dati/macchina.js   strumenti dei Moduli II, III e IV: registri x86-64, flag, tracce, listati, file di bit, pila, CPU del caso di studio (SL.isa: codifica, fasi, esecuzione), diagrammi di pipeline, flusso di un'eccezione
sl/unita/<id>.js      un file per unità, caricato soltanto quando serve
sl/prove/<cap>.js     un file per capitolo con i generatori delle domande
sl/strumenti/         controlli sui contenuti
```

I percorsi sono `#/` (rete), `#/m/<modulo>`, `#/c/<capitolo>`, `#/u/<unità>/<fase>`, `#/p/<capitolo>/<variante>`, `#/glossario` e `#/guida`.

## Orientamento

Il sito è pensato per essere consultato senza altre indicazioni. Gli elementi che lo rendono autosufficiente sono cinque.

- **Introduzione.** All'apertura della pagina principale compare un'introduzione a schede, descritta nella sezione seguente.
- **Pagina principale.** Sotto il titolo compare il riquadro «Percorso di studio», con i tre passi dello studio e i collegamenti all'unità 0.1, all'unità sull'uso del laboratorio, alla guida e all'introduzione. Il riquadro è prodotto dalla funzione `percorso` di `sl/js/rete.js`, che ricava numeri e identificativi dalla mappa del corso, ed è ripetuto nella pagina `#/guida`. Le linguette «Moduli del corso» selezionano un modulo senza passare dalla rete, che sugli schermi stretti risulta ridotta.
- **Scheda del modulo.** Ogni modulo di `sl/dati/corso.js` porta il campo `intro`, con tre parti: `tema` (argomento), `premesse` (prerequisiti) ed `esiti` (elenco di quanto si è in grado di svolgere al termine). I controlli verificano che il campo sia completo, che rispetti il registro dei testi e che ogni capitolo citato fra i prerequisiti sia davvero richiamato da almeno un'unità del modulo.
- **Pagina del capitolo.** Il capitolo è presentato in tre passi: unità, prova, sfide in terminale. Per ogni unità la pagina mostra l'obiettivo, e sotto la guida elenca i capitoli richiamati. Entrambi i dati sono letti dai file delle unità (`obiettivo` e `richiami.carte[].da`, nella forma «Dall’unità x.y.z»), caricati in anticipo all'apertura del capitolo: non esistono copie da tenere allineate.
- **Pagina dell'unità.** L'occhiello indica la posizione dell'unità nel capitolo, e ogni fase si apre con la riga «Attività della fase», che dichiara che cosa occorre fare. Al termine dell'ultima unità di un capitolo il comando principale conduce alla prova; la prova conduce al capitolo successivo.

L'indirizzo `#/` mostra la pagina principale completa; l'indirizzo `#/m/<modulo>` mostra il medesimo contenuto senza il riquadro del percorso, così che la scheda del modulo sia raggiungibile con meno scorrimento.

## Introduzione e guida

A ogni apertura della pagina principale compare un'introduzione di 16 schede, divisa in due parti. Le prime dieci schede, sulla pagina principale, presentano il sito, il metodo, il percorso di studio, i moduli, la rete, la scheda del modulo, l'elenco dei capitoli, la testata e la gestione dei dati; le ultime sei, sull'unità 0.4, illustrano le fasi di un'unità, la previsione, i controlli, l'esecuzione per passi e il bilancio. Ogni scheda illumina l'elemento della pagina al quale si riferisce, e oscura il resto. Il componente è `sl/js/intro.js`; testi, pagine ed elementi illuminati sono in `sl/dati/intro.js`, e i numeri citati nei testi sono calcolati dalla mappa del corso.

La prima scheda offre il comando «Salta intro»; le successive si chiudono con il pulsante posto nell'angolo superiore o con il tasto Esc, e si scorrono anche con le frecce della tastiera. Poiché il sito non conserva alcun dato, l'introduzione non può sapere di essere già stata letta e si ripresenta a ogni caricamento della pagina principale. Non compare quando l'indirizzo aperto è quello di un modulo, di un capitolo, di un'unità o di un'altra pagina interna, né sotto il controllo di uno strumento automatico; con la riduzione del movimento attiva compare senza animazioni. Si riapre dal comando «Introduzione al sito» del riquadro «Percorso di studio», presente anche nella pagina `#/guida`.

Mentre l'introduzione è aperta, la pagina sottostante è resa inerte (attributo `inert`), sicché il fuoco e i clic restano nella scheda. Nella scheda dedicata alla previsione resta attivo soltanto il riquadro illuminato, e il comando «Scheda successiva» si attiva dopo la scelta di un valore. La posizione della scheda è scelta in quest'ordine: sotto o sopra l'elemento, quando entrambi entrano nella finestra; accanto all'elemento, sugli schermi larghi; accostata al bordo inferiore, dal lato opposto all'elemento. Uno spazio provvisorio in fondo alla pagina consente di portare in alto anche gli ultimi elementi. La chiusura riconduce al comando «Inizio del percorso», che riceve il fuoco; l'ultima scheda apre l'unità 0.1. Un cambio di indirizzo non richiesto dall'introduzione, per esempio con il tasto «indietro» del browser, la chiude.

I controlli verificano per ogni scheda la completezza, l'esistenza della pagina indicata, i segnaposto, un'estensione compresa fra 40 e 110 parole e il registro dei testi. La pagina `#/guida` descrive in forma estesa l'organizzazione del sito e le modalità di consultazione.

## Aggiungere un'unità

1. Dichiarare l'unità in `sl/dati/corso.js`, dentro il suo capitolo. Un capitolo dichiara `guida`, l'elenco `unita` con almeno due unità, `prova: true` e l'elenco `sfide`; i controlli segnalano come errore l'assenza di uno di tali campi. Un modulo nuovo richiede anche il campo `intro`, descritto nella sezione «Orientamento».
2. Creare `sl/unita/<id>.js` partendo da un'unità esistente. Le sezioni sono `richiami`, `idea`, `esperimento`, `lab` e `bilancio`.
3. Aggiungere a `sl/dati/glossario.js` i termini elencati in `idea.termini`, ciascuno con l'unità che lo introduce. Nel testo dell'idea il termine si evidenzia con `[[termine]]` oppure `[[termine|forma mostrata]]`.
4. Avviare i controlli.

L'esperimento è descritto dalla funzione `lab.costruisci(p)`, che riceve i valori dei controlli e restituisce l'elenco dei passi e l'esito. I passi nascono dai dati, quindi il loro numero cambia con i valori scelti. Ogni passo elenca gli elementi presenti sulla scena; un elemento che conserva lo stesso identificativo fra due passi si sposta e cambia stato con una transizione.

## Prove di fine capitolo

Ogni capitolo dispone di una prova: la sua voce in `sl/dati/corso.js` porta `prova: true`, ed esiste il file `sl/prove/<capitolo>.js`. Il file registra un elenco di generatori. Ogni generatore riceve una sorgente di numeri ripetibili e restituisce una domanda nello stesso formato degli esercizi delle unità, con in più il campo `u`, cioè l'unità da rivedere in caso di errore.

Le varianti sono numerate da 1 a 999 e il numero compare nell'indirizzo: la stessa variante ripresenta sempre le stesse domande, quindi si può assegnare a una classe intera. Aprendo `#/p/<capitolo>` senza numero, la pagina ne sceglie uno a caso. Il riepilogo distingue le risposte giuste al primo tentativo da quelle arrivate dopo un errore o un indizio, ed elenca le unità da rivedere. Vive soltanto nella pagina aperta.

## Controlli

```
node sl/strumenti/controlli.js
node sl/strumenti/controlli.js --tutto
```

Lo strumento non richiede installazioni. Per ogni unità genera i passi dell'esperimento con tutte le combinazioni dei controlli e verifica che l'esito sia fra le previsioni offerte, che le domande guidate abbiano una risposta valida e che gli esercizi siano completi. Poi controlla le regole di scrittura e, in sezioni distinte, il registro dei testi e la sicurezza del codice. Le regole di scrittura sono due. La prima riguarda l'ordine: un termine del glossario non deve comparire prima dell'unità che lo introduce, e gli usi anticipati ammessi sono elencati nello strumento con il loro motivo. La seconda riguarda lo stile: lo strumento segnala le lineette lunghe, le correzioni del tipo «non questo, ma quello», le formule di raccordo e le frasi scisse ripetute.

Per le prove di fine capitolo lo strumento compone tutte le 999 varianti e verifica ogni domanda: una sola opzione corretta, risposte scritte presenti, diagnosi che non coprono una risposta giusta, tre indizi, svolgimento, e almeno una domanda per ogni unità del capitolo. I testi delle domande passano dagli stessi controlli di ordine e di stile.

Il resoconto riporta anche, per ogni unità, il numero minimo e massimo di passi e l'indice di leggibilità Gulpease del testo dell'idea. Per ogni prova riporta quante formulazioni diverse produce la domanda meno varia.

## Registro dei testi

I testi adottano il registro accademico in forma impersonale: nella teoria, nei laboratori e negli esercizi. Sono esclusi la seconda persona, la prima persona plurale, le analogie tratte dalla vita quotidiana, il lessico colloquiale, i superlativi e le formule a effetto; le consegne degli esercizi hanno la forma «si calcoli», «si scelga». Lo strumento dei controlli riporta nella sezione «REGISTRO ACCADEMICO» il numero delle segnalazioni per modulo, e con l'opzione `--registro` ne elenca il dettaglio. Le parti già riscritte sono dichiarate nell'elenco `REGISTRO_FATTO` dello strumento: per esse ogni segnalazione è riportata come difetto da correggere.

Stato della riscrittura: sono conformi l'interfaccia, la guida e tutti i moduli, da 0 a VI (208 unità, 41 prove di capitolo, 578 voci di glossario, scopi e guide dei capitoli, presentazioni dei moduli). La costante `REGISTRO_FATTO` in `sl/strumenti/controlli.js` elenca i prefissi già riscritti, per i quali ogni segnalazione è riportata come errore da correggere. L'elenco comprende anche i file `sl/dati/corso.js` e `sl/dati/glossario.js`, per i quali il controllo non riporta segnalazioni residue. I nomi dei termini del glossario sono esclusi dalla sola regola «imperativo», poiché sono sintagmi nominali che possono coincidere con forme verbali (per esempio «Porta logica», «Sintesi di un circuito», «Controlla e poi agisci»). Le stringhe visibili degli script dell'interfaccia, comprese quelle inserite in frammenti HTML, sono verificate a parte con `node sl/strumenti/controlli_interfaccia.js`.

## Sicurezza

Il sito è statico, privo di dipendenze esterne e di dati conservati: le classi di vulnerabilità pertinenti sono quelle del codice eseguito nel browser. Le misure adottate sono le seguenti.

- Politica di sicurezza dei contenuti in `index.html`: sono ammessi soltanto script, fogli di stile, caratteri e immagini serviti dal sito; sono esclusi script in linea, richieste di rete, oggetti incorporati, riquadri e invii di moduli. Gli stili in linea restano ammessi, perché le scene li impiegano per posizionare gli elementi.
- Nessun gestore di evento in linea e nessuna costruzione di codice da stringhe (`eval`, `new Function`, temporizzatori con codice testuale).
- Le parti dell'indirizzo sono accettate soltanto se brevi e composte da lettere, cifre, punti e trattini; identificativi di unità e di capitolo sono confrontati con la mappa del corso prima di ogni uso, e verificati di nuovo prima di comporre l'indirizzo di uno script da caricare.
- Ogni testo inserito nella pagina passa da una funzione di protezione dei caratteri speciali; le ricerche nel glossario e nei registri delle unità non raggiungono le proprietà ereditate degli oggetti.
- I collegamenti aperti in una nuova scheda portano `rel="noopener noreferrer"`, e la pagina dichiara `referrer` uguale a `no-referrer`.

Lo strumento dei controlli verifica queste regole a ogni esecuzione (sezione «SICUREZZA»): risorse esterne, usi non ammessi, gestori in linea, presenza e contenuto della politica. Restano fuori dalla portata del sito le intestazioni HTTP, che GitHub Pages non consente di impostare: la direttiva `frame-ancestors` non è quindi applicabile, e l'inclusione della pagina in un riquadro di un altro sito resta possibile. Il sito è privo di sessioni, credenziali e azioni con effetti, sicché tale inclusione non espone alcun dato. Nelle impostazioni del repository conviene verificare che l'opzione «Enforce HTTPS» di GitHub Pages sia attiva.

## Sfide PWN

Il sito mostra soltanto gli identificativi e i titoli delle sfide. L'indirizzo della piattaforma non compare in nessun file.

## Licenza

Salvo diversa indicazione, contenuti e codice del sito sono distribuiti con licenza Creative Commons Attribuzione - Non commerciale - Condividi allo stesso modo 4.0 Internazionale (CC BY-NC-SA 4.0). La licenza comprende il testo e le figure della dispensa (`materiali/dispensa.pdf`); gli esempi di codice della dispensa restano sotto licenza MIT, come dichiarato in `materiali/NOTICE-dispensa.txt`. La nota di licenza compare nel piè di pagina, nella guida e nel file `LICENZA.md` della radice; il testo legale completo è nel file `LICENSE`. Il collegamento alla sintesi della licenza è l'unico indirizzo esterno ammesso dai controlli di sicurezza.

## Sfondo

Lo script `sl/js/sfondo.js` disegna su una tela fissa, posta dietro i contenuti, un reticolo esagonale percorso da onde di attivazione. Un velo attenua il disegno sotto la colonna centrale, e i pannelli del sito restano opachi. Lo sfondo è attivo dai 900 px di larghezza in su; al di sotto, e in stampa, tela e velo sono nascosti e il disegno è sospeso. La soglia compare due volte, nella costante `LARGHEZZA_MINIMA` dello script e nella regola `@media` di `sito.css`, e va modificata in entrambi i punti; l'intensità si regola con la costante `FORZA`. Il disegno si arresta quando la scheda del browser è nascosta, e si riduce a un fotogramma fermo con la preferenza di sistema per il movimento ridotto e durante le verifiche automatiche. Lo script non conserva dati e non effettua richieste di rete.

## Caratteri

I caratteri nella cartella `sl/font/` sono distribuiti con licenza SIL Open Font License 1.1. I testi delle licenze si trovano nella stessa cartella.
