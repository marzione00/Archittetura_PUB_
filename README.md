# SistemiLab — Architettura dei sistemi

Sito didattico in italiano per lo studio di *Architecture of Computer Systems*. Il laboratorio e le esercitazioni seguono i 41 capitoli delle sei parti del libro. Il sito si esegue nel browser con file statici e comprende la dispensa in PDF.

## Avvio e pubblicazione

1. Estrarre il contenuto dello ZIP. Aprire `index.html` per studiare in locale.
2. Per GitHub Pages caricare il contenuto estratto nella radice del repository, compreso `.nojekyll`. Il file `index.html` deve trovarsi allo stesso livello delle cartelle `assets`, `contenuti`, `css`, `js` e `materiali`.
3. In **Settings → Pages**, selezionare **Deploy from a branch**, il branch che contiene i file e **/(root)**. Salvare e aprire l’indirizzo fornito da GitHub.

La consegna separata `SistemiLab.html` racchiude le stesse attività, le figure e il PDF in un solo file, apribile anche offline. I collegamenti al libro puntano alla pagina fisica del PDF. Il posizionamento dipende dal visualizzatore PDF del dispositivo.

## Uso didattico

- **Laboratorio interattivo.** Scegliere una parte, un capitolo e una sottounità. Ogni lezione introduce i termini necessari e sviluppa un esempio prima dei comandi. Il lessico in **Termini e simboli** si apre nella pagina. **Vai all’attività** porta direttamente ai parametri o alla traccia. Il procedimento indica i comandi da usare. La voce **Da osservare** identifica un cambiamento o una relazione da verificare durante la prova. Puoi avanzare di un passo, tornare indietro, riprodurre la sequenza o ingrandire la figura su telefono. **Fissa per confronto** conserva i dati di riferimento durante l’esperimento. Dopo una modifica, **Applica i parametri** permette di confrontare lo stesso passo delle due esecuzioni. Il capitolo 6.3 dispone di un banco dedicato per modificare bit, voci di tabella e indirizzi.
- **Esercitazioni guidate.** La pagina della prova espone il principio necessario per interpretare la consegna. Ogni esercizio comprende due tracce con dati specifici e una ricostruzione animata. In modalità guidata i campi si aprono in sequenza. In allenamento si può lavorare in qualsiasi ordine. La prova autonoma rende disponibile lo svolgimento dopo la prima consegna. Le soluzioni del capitolo sono anche consultabili come raccolta.
- **Raccordo PWN.** Gli esercizi coprono le competenze delle 200 attività di riferimento. Il repertorio associa ogni attività agli identificativi delle varianti del corso. La correzione avviene localmente, la consegna ufficiale attraverso il runner del corso. Il capitolo integrativo 1.7 offre un percorso trasversale autonomo.
- **Codice assembly.** Nel capitolo 6.3 dodici esercizi e le rispettive varianti includono un interprete locale x86-64 in sintassi Intel, con registri RAX, RCX, RDI e RSI e relativi alias a 32 bit. Il banco verifica il risultato in RAX e la conservazione di RDI e RSI. Le prove includono i dati assegnati, tabelle collocate a basi diverse e indirizzi virtuali ai limiti del modello. I limiti sono 128 istruzioni sorgente e 256 passi per esecuzione. Le memorie dei casi di prova sono sintetiche. Negli altri capitoli le tracce verificano valori, passaggi e decisioni e possono contenere listati di riferimento.
- **Stato personale.** Le tracce completate sono registrate nel browser quando il dispositivo consente il salvataggio. Le risposte in corso restano nella memoria della scheda. I collegamenti agli esperimenti comprendono parametri e passo selezionato.

## Organizzazione dei sorgenti

- `contenuti/NN-NN.js` — titoli delle unità, procedimenti, riscontri e raccordi con le attività del corso.
- `contenuti/lessico.js` — voci di consultazione associate ai termini presenti nella lezione.
- `contenuti/teoria-01.js` … `teoria-06.js` — lezioni in paragrafi, ordinate per capitolo e unità, comprese le simulazioni di modulo.
- `contenuti/atelier-01.js` … `atelier-06.js` — parametri, modelli di esecuzione, esercizi e soluzioni per ciascuna parte.
- `contenuti/esercizi-06-03.js` — venti esercizi sulla traduzione degli indirizzi e relative varianti.
- `contenuti/percorsi.js` — introduzioni ai capitoli, dati iniziali e svolgimenti dei 33 problemi guidati.
- `js/scene-01.js` … `scene-06.js` e `js/prove-animate-01.js` … `prove-animate-06.js` — disegni dei laboratori e ricostruzioni delle varianti.
- `contenuti/pagine.js` — corrispondenza tra numeri di capitolo o sottounità e pagine del PDF incluso.
- `js/esperimenti.js` e `js/esercitazioni.js` — visualizzazione delle tracce, confronti e correzione. `js/modello.js`, `js/laboratorio.js`, `js/assembly.js` e `js/esercizi-63.js` costituiscono il banco specializzato del capitolo 6.3.
- `js/base.js` e `js/avvio.js` — indice, navigazione e collegamenti condivisibili.
- `css/sito.css` e `assets/*.svg` — tipografia, tavole vettoriali e impaginazione.

## Attribuzioni

Il PDF di *Architecture of Computer Systems* riporta come autori Marzio De Corato e Danilo Bruschi. Il registro PWN deriva dalla mappa didattica del corso. Le dichiarazioni di licenza del materiale originale sono in `materiali/NOTICE-dispensa.txt`. Le tavole SVG accompagnano il laboratorio.

