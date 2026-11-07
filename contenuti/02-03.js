'use strict';
SL.catalogo.push({
  "id": "2.3",
  "title": "Indirizzi, array e disposizione dei dati",
  "units": [
    {
      "id": "2.3.1",
      "title": "Indirizzi, valori e ampiezza degli accessi",
      "experiment": "Lascia l’offset a 4. Scegli in successione 1, 2 e 4 byte e ricostruisci EAX leggendo le celle a indirizzi crescenti.",
      "skill": "Distinguere indirizzo e contenuto",
      "check": "Il primo byte conserva peso uno in tutte le letture. Allargando l’accesso si aggiungono i contributi dei byte successivi con pesi 256, 256² e 256³."
    },
    {
      "id": "2.3.2",
      "title": "Formare un indirizzo efficace",
      "experiment": "Mantieni la base e l’indice iniziali, cambia la scala da 4 a 8 e confronta l’offset netto. Ripeti modificando soltanto lo spiazzamento.",
      "skill": "Valutare un indirizzo composto",
      "check": "La scala moltiplica l’indice. Lo spiazzamento si somma in byte dopo il prodotto e sposta l’indirizzo finale della stessa quantità."
    },
    {
      "id": "2.3.3",
      "title": "Array e matrici contigue",
      "experiment": "Seleziona riga 2 e colonna 3. Spostati di una colonna e poi, tornando alla colonna 3, di una riga. Confronta gli indirizzi.",
      "skill": "Calcolare l’offset in ordine per righe",
      "check": "Passare alla colonna seguente aggiunge la dimensione di un intero. Passare alla riga seguente aggiunge la dimensione di cinque interi perché la matrice ha cinque colonne."
    },
    {
      "id": "2.3.4",
      "title": "Strutture, allineamento e riempimento",
      "experiment": "Seleziona la struttura di indice 1. Scambia l’ordine di char e int e confronta il riempimento interno, quello in coda e il tipo del secondo membro.",
      "skill": "Misurare il padding tra campi",
      "check": "Con char davanti, il riempimento precede int. Con int davanti, il riempimento segue char. Nei due casi il passo dell’array rispetta lo stesso allineamento."
    },
    {
      "id": "2.3.5",
      "title": "Validità degli oggetti e aliasing",
      "experiment": "Mantieni p sull’elemento 2. Prova q sugli indici 2, 1 e 4, confrontando l’autorizzazione alla scrittura e il valore poi letto attraverso p.",
      "skill": "Verificare le precondizioni di accesso",
      "check": "La scrittura influenza la lettura da p quando i puntatori designano la stessa cella. Con q all’indice 4, il controllo riconosce il limite e salta la scrittura."
    },
    {
      "id": "2.3.6",
      "title": "Codificare e riconoscere i calcoli di indirizzo",
      "experiment": "Lascia RCX a 3 e cambia la scala. Confronta il campo scala del byte SIB e l’indirizzo. Poi varia RCX a scala fissa.",
      "skill": "Decodificare l’indirizzamento scalato",
      "check": "Cambiare scala modifica sia i bit dell’istruzione sia l’indirizzo efficace. Cambiare il contenuto di RCX modifica soltanto l’indirizzo calcolato all’esecuzione."
    },
    {
      "id": "2.3.7",
      "title": "Problemi svolti",
      "experiment": "Con base 0x2000 e interi di quattro byte, indica il primo byte dell’elemento di indice 7 e ricostruisci il calcolo sulla striscia di memoria.",
      "skill": "Convertire un indice di array in un indirizzo",
      "check": "L’indice conta gli elementi che precedono quello scelto. Moltiplicandolo per il passo si ottiene lo spostamento in byte da sommare alla base.",
      "kind": "esercizi"
    },
    {
      "id": "2.3.8",
      "title": "Esercizi",
      "experiment": "Passa da «Scrivere usando un indirizzo calcolato» a «Due letture per seguire un puntatore». Annota per ogni accesso l’indirizzo, il numero di byte e il contenuto trasferito.",
      "skill": "Separare indirizzo della voce, puntatore letto e dato finale",
      "check": "L’indirizzo di una voce e il puntatore memorizzato nella voce compaiono in passi diversi. Quel puntatore può poi fornire la base per una seconda lettura.",
      "kind": "esercizi"
    },
    {
      "id": "2.3.9",
      "title": "Soluzioni",
      "experiment": "Nello svolgimento «Caricare e interpretare una word» ricomponi i due byte, poi confronta MOVZX e MOVSX per entrambe le tracce.",
      "skill": "Verificare le estensioni di una word little-endian",
      "check": "MOVZX riempie di zeri i bit aggiunti. MOVSX replica il bit 15. Le due estensioni coincidono quando quel bit è zero e divergono quando vale uno.",
      "kind": "soluzioni"
    }
  ],
  "pwn": [
    {
      "id": "cslez2_3_01_random_assembly_01",
      "title": "Caricamenti di diversa larghezza",
      "format": "assembly",
      "variants": [
        "m2.3.load-qword",
        "m2.3.load-byte",
        "m2.3.load-word",
        "m2.3.load-dword"
      ]
    },
    {
      "id": "cslez2_3_02_random_assembly_02",
      "title": "Scritture e calcolo di indirizzi con LEA",
      "format": "assembly",
      "variants": [
        "m2.3.store-qword",
        "m2.3.store-byte",
        "m2.3.lea-displacement",
        "m2.3.lea-index2"
      ]
    },
    {
      "id": "cslez2_3_03_random_assembly_03",
      "title": "Indici, spiazzamenti e doppia indirezione",
      "format": "assembly",
      "variants": [
        "m2.3.lea-index4-disp",
        "m2.3.array-element",
        "m2.3.double-indirect",
        "m2.3.copy-memory"
      ]
    },
    {
      "id": "cslez2_3_04_random_assembly_04",
      "title": "Scambi e aggiornamenti di elementi",
      "format": "assembly",
      "variants": [
        "m2.3.swap-memory",
        "m2.3.sum-elements",
        "m2.3.increment-element",
        "m2.3.store-indexed"
      ]
    },
    {
      "id": "cslez2_3_05_random_assembly_05",
      "title": "Estremi di array, larghezze e indici",
      "format": "assembly",
      "variants": [
        "m2.3.end-pointer",
        "m2.3.load-selected-width",
        "m2.3.reverse-two",
        "m2.3.byte-to-index"
      ]
    }
  ]
});
