# SistemiLab

Laboratorio interattivo del corso di architettura dei sistemi, in lingua italiana. Accompagna la dispensa *Architecture of Computer Systems* di Marzio De Corato e Danilo Bruschi.

Indirizzo pubblico: <https://marzione00.github.io/Archittetura_PUB_/>

## Contenuto

Il sito comprende 7 moduli, 41 capitoli e 210 unità. Ogni unità tratta un solo argomento in cinque fasi (richiami, esposizione, esperimento, esecuzione guidata, bilancio) ed è costruita attorno a un esperimento eseguibile un passo alla volta. Ogni capitolo dispone di una prova di fine capitolo in 999 varianti numerate, e il glossario conta 592 termini.

All'apertura della pagina principale un'introduzione di 16 schede illustra l'organizzazione del sito e l'impiego del laboratorio, illuminando di volta in volta l'elemento descritto; il comando «Salta intro» la chiude. La pagina principale indica quindi il percorso di studio: il Modulo 0, privo di prerequisiti, e quindi i Moduli da I a VI nell'ordine della rete del corso. Ogni modulo è presentato da una scheda con argomento, prerequisiti ed esiti attesi; ogni capitolo elenca le proprie unità con il relativo obiettivo, seguite dalla prova e dalle sfide in terminale. Il sito non conserva alcun dato nel browser e non effettua richieste verso altri servizi.

## Struttura del repository

| Percorso | Contenuto |
| --- | --- |
| `index.html` | pagina unica del sito |
| `sl/` | codice, dati, unità, prove, caratteri, icona e strumenti di controllo; la descrizione completa è in `sl/LEGGIMI.md` |
| `materiali/` | dispensa in PDF e note di licenza della dispensa |
| `LICENSE`, `LICENZA.md` | licenza e relative note |
| `.nojekyll` | file richiesto da GitHub Pages per servire le cartelle senza elaborazione |

## Consultazione in locale

Il sito è composto da file statici e non richiede alcuna installazione. Per la consultazione in locale è sufficiente un server statico avviato nella radice del repository, per esempio:

```
python3 -m http.server 8000
```

La pagina si apre quindi all'indirizzo `http://localhost:8000/`.

## Pubblicazione

La pubblicazione avviene con GitHub Pages: in **Settings → Pages** si seleziona **Deploy from a branch**, con il ramo che contiene i file e la cartella `/(root)`. Il file `index.html` deve trovarsi nella radice, allo stesso livello della cartella `sl`.

## Controlli

I controlli sui contenuti richiedono soltanto Node.js, senza dipendenze:

```
node sl/strumenti/controlli.js
node sl/strumenti/controlli_interfaccia.js
```

Il primo verifica la struttura delle unità, gli esperimenti con tutte le combinazioni dei controlli, le 999 varianti di ogni prova, l'ordine dei termini del glossario, il registro dei testi e la sicurezza del codice. Il secondo verifica il registro delle stringhe visibili dell'interfaccia. Le regole sono descritte in `sl/LEGGIMI.md`.

## Licenza

Salvo diversa indicazione, i contenuti e il codice di SistemiLab, compresi il testo e le figure della dispensa, sono distribuiti con licenza Creative Commons Attribuzione - Non commerciale - Condividi allo stesso modo 4.0 Internazionale (CC BY-NC-SA 4.0). Gli esempi di codice della dispensa sono distribuiti con licenza MIT; i caratteri tipografici con licenza SIL Open Font License 1.1. I dettagli sono in `LICENZA.md`.
