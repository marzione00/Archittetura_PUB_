'use strict';
SL.esercizi = [
  {
    "id": "6.3.1",
    "title": "Separare pagina e spostamento",
    "kind": "campi",
    "skill": "Scomporre un indirizzo a 12 bit di offset",
    "principio": "Se una pagina contiene una potenza di due di byte, i bit alti del VA rappresentano il numero di pagina virtuale e quelli bassi la distanza dall’inizio della pagina.",
    "prompt": "Un indirizzo virtuale vale 0x34567. Con pagine di 4096 byte, ricava il numero di pagina virtuale (VPN) e lo spostamento in byte. Ricomponi l’indirizzo e scrivine il valore decimale.",
    "fields": [
      {
        "label": "Numero di pagina virtuale",
        "answer": "52",
        "accept": [],
        "numeric": true,
        "hint": "Una pagina occupa 4096 byte. Calcola il quoziente intero tra indirizzo e dimensione di pagina."
      },
      {
        "label": "Spostamento in byte",
        "answer": "1383",
        "accept": [],
        "numeric": true,
        "hint": "Usa il resto della divisione per 4096, oppure applica la maschera 0xFFF."
      },
      {
        "label": "Indirizzo ricostruito, in decimale",
        "answer": "214375",
        "accept": [],
        "numeric": true,
        "hint": "Moltiplica il numero di pagina per i byte di una pagina, poi aggiungi lo spostamento."
      }
    ],
    "steps": [
      "Una pagina contiene 4096 = 2^12 byte. I 12 bit meno significativi indicano la posizione del byte nella pagina.",
      "Il quoziente intero di 214375 ÷ 4096 è 52. Il resto vale 1383 = 0x567 e rientra fra 0 e 4095.",
      "La ricomposizione dà 52 × 4096 + 1383 = 214375 = 0x34567. Il quoziente individua la pagina e il resto individua il byte."
    ],
    "variants": [
      {
        "prompt": "Un tracciatore descrive due byte mediante le coppie (VPN 91, offset 960) e (VPN 91, offset 963). Le pagine misurano 4096 byte. Quale intervallo di indirizzi virtuali, estremi inclusi, basterebbe leggere per raccogliere entrambi? Calcola l’inizio e la lunghezza minima.",
        "fields": [
          {
            "label": "Primo VA",
            "answer": "373696",
            "numeric": true,
            "hint": "Calcola la base comune della pagina e aggiungi lo spostamento minore."
          },
          {
            "label": "Lunghezza minima in byte",
            "answer": "4",
            "numeric": true,
            "hint": "Includi sia il primo sia l’ultimo indirizzo."
          }
        ],
        "steps": [
          "Il numero di pagina è uguale per entrambi. La base corrispondente è 91 × 4096 = 372736.",
          "Aggiungendo gli offset si ottengono gli indirizzi 373696 e 373699.",
          "Poiché la distanza è tre, per includere anche il primo byte occorrono 373699 − 373696 + 1 = 4 byte."
        ],
        "quadro": [
          {
            "titolo": "Coppie",
            "celle": [
              [
                "VPN",
                "91"
              ],
              [
                "Offset A",
                "960"
              ],
              [
                "Offset B",
                "963"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Base comune",
            "celle": [
              [
                "Pagina",
                "4096 B"
              ],
              [
                "Base",
                "372736"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          },
          {
            "titolo": "Intervallo",
            "celle": [
              [
                "Primo VA",
                "373696"
              ],
              [
                "Ultimo VA",
                "373699"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          },
          {
            "titolo": "Lunghezza",
            "celle": [
              [
                "Estremi inclusi",
                "entrambi"
              ],
              [
                "Byte",
                "4"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ]
      }
    ]
  },
  {
    "id": "6.3.2",
    "title": "Ricostruire e normalizzare un indirizzo",
    "kind": "campi",
    "skill": "Controllare l’intervallo dell’offset",
    "principio": "L’offset valido appartiene alla pagina individuata dalla VPN. Un conteggio che oltrepassa il confine si può normalizzare trasferendo le pagine intere alla VPN e conservando il resto.",
    "prompt": "Una traccia registra VPN 10 e offset 943 per pagine di 1024 byte. Ricostruisci l’indirizzo. Un secondo record conserva VPN 10 e usa offset 1024. Valuta il record e normalizza la posizione del byte.",
    "fields": [
      {
        "label": "Primo indirizzo, in decimale",
        "answer": "11183",
        "accept": [],
        "numeric": true,
        "hint": "Ogni pagina precedente contribuisce con una pagina intera di byte."
      },
      {
        "label": "Primo indirizzo, in esadecimale",
        "answer": "0x2BAF",
        "accept": [],
        "numeric": true,
        "hint": "Scrivi il valore con prefisso 0x. Un gruppo di quattro bit corrisponde a una cifra esadecimale."
      },
      {
        "label": "Secondo record",
        "answer": "Spostamento pari a una pagina intera",
        "accept": [],
        "numeric": false,
        "choices": [
          "Rappresentazione già normalizzata",
          "Spostamento pari a una pagina intera",
          "VPN oltre il limite dei registri"
        ],
        "hint": "Lo spostamento più grande che appartiene alla pagina è la sua dimensione meno uno."
      },
      {
        "label": "VPN normalizzata",
        "answer": "11",
        "accept": [],
        "numeric": true,
        "hint": "Trasferisci una pagina completa nella parte alta dell’indirizzo."
      },
      {
        "label": "Offset normalizzato",
        "answer": "0",
        "accept": [],
        "numeric": true,
        "hint": "Calcola il resto dello spostamento dopo il trasferimento della pagina completa."
      }
    ],
    "steps": [
      "Per il primo record, 10 × 1024 + 943 = 11183 = 0x2BAF. L’offset 943 appartiene all’intervallo 0…1023.",
      "Nel secondo record, l’offset 1024 supera il limite 1023. Aritmeticamente sposta il byte all’inizio della pagina successiva.",
      "10 × 1024 + 1024 = 11 × 1024 + 0 = 11264 = 0x2C00. La coppia normalizzata è quindi (11, 0)."
    ],
    "variants": [
      {
        "prompt": "Il registro di traccia usa pagine da 1024 byte. Dopo un avanzamento di 18 byte riporta VPN 22 e offset 8. Da quale coppia normalizzata era partito? Motiva il passaggio di pagina conteggiando i byte che mancavano al confine.",
        "fields": [
          {
            "label": "VPN iniziale",
            "answer": "21",
            "numeric": true,
            "hint": "Prova a sottrarre 18 all’offset finale di 8."
          },
          {
            "label": "Offset iniziale",
            "answer": "1014",
            "numeric": true,
            "hint": "Prendi a prestito una pagina intera."
          },
          {
            "label": "Distanza dal confine iniziale",
            "answer": "10",
            "numeric": true,
            "hint": "Misura la distanza fra il byte di partenza e l’inizio della pagina 22."
          }
        ],
        "steps": [
          "Rispetto all’inizio della pagina 22 il punto di partenza cade dieci byte prima, poiché 8 − 18 = −10.",
          "La pagina precedente è la 21. Misurando dalla sua base, la posizione iniziale vale 1024 − 10 = 1014.",
          "Dieci byte di avanzamento portano dalla posizione 1014 all’inizio della pagina 22. Gli otto rimanenti conducono alla posizione finale descritta."
        ],
        "quadro": [
          {
            "titolo": "Dopo l’avanzamento",
            "celle": [
              [
                "VPN finale",
                "22"
              ],
              [
                "Offset finale",
                "8"
              ],
              [
                "Avanzamento",
                "18 B"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Sottrazione",
            "celle": [
              [
                "8 − 18",
                "−10"
              ],
              [
                "Riferimento",
                "base pagina 22"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          },
          {
            "titolo": "Prestito",
            "celle": [
              [
                "VPN iniziale",
                "21"
              ],
              [
                "Offset",
                "1024 − 10"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          },
          {
            "titolo": "Controllo",
            "celle": [
              [
                "Al confine",
                "10 B"
              ],
              [
                "Oltre il confine",
                "8 B"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ]
      }
    ]
  },
  {
    "id": "6.3.3",
    "title": "Verificare i campi con pagine da 2 KiB",
    "kind": "campi",
    "skill": "Separare un campo che attraversa una cifra esadecimale",
    "principio": "Una cifra esadecimale rappresenta quattro bit. Quando l’offset termina all’interno di una cifra, la divisione intera per la dimensione di pagina permette di separare i campi senza ambiguità.",
    "prompt": "Per il VA 0x7CDE, un listato che dovrebbe usare pagine da 2048 byte propone VPN = 7 e offset = 0xCDE. Individua l’ampiezza di offset che ha prodotto i due campi e ricava la VPN e lo spostamento corretti.",
    "fields": [
      {
        "label": "Bit usati per errore",
        "answer": "12",
        "numeric": true,
        "hint": "L’offset proposto coincide con le ultime tre cifre esadecimali."
      },
      {
        "label": "VPN corretta",
        "answer": "15",
        "numeric": true,
        "hint": "Dividi 0x7CDE per 2048 e tieni il quoziente."
      },
      {
        "label": "Offset corretto",
        "answer": "1246",
        "numeric": true,
        "hint": "La maschera per undici bit è 0x7FF."
      }
    ],
    "steps": [
      "La separazione 7 | CDE assegna dodici bit all’offset, cioè quattro per ciascuna cifra esadecimale. Descrive una pagina da 4096 byte.",
      "Per la pagina dichiarata da 2048 byte servono undici bit. Il quoziente intero di 31966 ÷ 2048 è 15 e il resto è 1246.",
      "La somma 30720 + 1246 restituisce 31966, ossia 0x7CDE. Il resto corretto è più piccolo di 2048 e vale 0x4DE."
    ],
    "variants": [
      {
        "prompt": "Due VA distano 2048 byte. Il primo è 0x4E89. Le pagine hanno 2048 byte e si resta nello spazio ammesso. Senza scomporre il secondo da capo, indica quali campi cambiano e ricava il secondo VA.",
        "fields": [
          {
            "label": "Variazione dei campi",
            "answer": "VPN cresce di uno, offset invariato",
            "choices": [
              "Entrambi i campi crescono di uno",
              "VPN cresce di uno, offset invariato",
              "VPN invariata, offset azzerato"
            ],
            "hint": "Un avanzamento lungo una pagina intera aggiunge un quoziente completo."
          },
          {
            "label": "Secondo VA",
            "answer": "22153",
            "numeric": true,
            "hint": "Aggiungi 0x800 al primo indirizzo."
          }
        ],
        "steps": [
          "Il primo indirizzo vale 20105, cioè 9 × 2048 + 1673. Un avanzamento di 2048 byte incrementa il quoziente di uno.",
          "Si conserva il resto 1673, che continua a rientrare fra 0 e 2047. Il numero di pagina passa da 9 a 10.",
          "Si ottiene 10 × 2048 + 1673 = 22153, pari a 0x5689. Sottraendo 0x4E89 si ritrova 0x800."
        ],
        "quadro": [
          {
            "titolo": "Traslazione",
            "celle": [
              [
                "VA iniziale",
                "0x4E89"
              ],
              [
                "Distanza",
                "0x800"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Quoziente e resto",
            "celle": [
              [
                "Primo VA",
                "9 × 2048 + 1673"
              ],
              [
                "Passo",
                "1 pagina"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          },
          {
            "titolo": "Invariante",
            "celle": [
              [
                "VPN finale",
                "10"
              ],
              [
                "Offset finale",
                "1673"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          },
          {
            "titolo": "Verifica",
            "celle": [
              [
                "Nuovo VA",
                "0x5689"
              ],
              [
                "Differenza",
                "2048 B"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ]
      }
    ],
    "quadro": [
      {
        "titolo": "Rapporto da verificare",
        "celle": [
          [
            "VA",
            "0x7CDE"
          ],
          [
            "VPN proposta",
            "7"
          ],
          [
            "Offset proposto",
            "0xCDE"
          ]
        ],
        "nota": ""
      },
      {
        "titolo": "Geometria implicita",
        "celle": [
          [
            "Tre cifre hex",
            "12 bit"
          ],
          [
            "Pagina implicita",
            "4096 B"
          ]
        ],
        "nota": ""
      },
      {
        "titolo": "Correzione",
        "celle": [
          [
            "Pagina",
            "2048 B"
          ],
          [
            "Bit offset",
            "11"
          ]
        ],
        "nota": ""
      },
      {
        "titolo": "Controllo",
        "celle": [
          [
            "15 × 2048",
            "30720"
          ],
          [
            "Somma",
            "31966"
          ]
        ],
        "nota": ""
      }
    ]
  },
  {
    "id": "6.3.4",
    "title": "Una lettura oltre il confine di pagina",
    "kind": "campi",
    "skill": "Tradurre separatamente due intervalli virtuali",
    "principio": "Ogni pagina virtuale ha una propria traduzione e propri permessi. Un accesso a più byte può richiedere due controlli distinti, anche se gli indirizzi virtuali sono consecutivi.",
    "prompt": "Una lettura di 8 byte comincia a 0x1FFC. Una pagina contiene 4096 byte. La pagina virtuale 1 è leggibile e punta al frame 9. La pagina 2 è leggibile e punta al frame 20. Individua i due tratti fisici. Tutti gli estremi sono inclusivi.",
    "fields": [
      {
        "label": "Ultimo indirizzo virtuale",
        "answer": "0x2003",
        "accept": [],
        "numeric": true,
        "hint": "Per una lettura di n byte, l’ultimo indirizzo è il primo più n − 1."
      },
      {
        "label": "Byte nella prima pagina",
        "answer": "4",
        "accept": [],
        "numeric": true,
        "hint": "Sottrai l’offset iniziale alla dimensione della pagina."
      },
      {
        "label": "Primo tratto fisico: inizio",
        "answer": "0x9FFC",
        "accept": [],
        "numeric": true,
        "hint": "Alla base del primo frame aggiungi l’offset del primo byte."
      },
      {
        "label": "Primo tratto fisico: fine",
        "answer": "0x9FFF",
        "accept": [],
        "numeric": true,
        "hint": "L’ultimo byte del primo frame ha offset pari alla dimensione di pagina meno uno."
      },
      {
        "label": "Secondo tratto fisico: inizio",
        "answer": "0x14000",
        "accept": [],
        "numeric": true,
        "hint": "Il secondo tratto inizia a offset zero nel frame indicato dalla seconda traduzione."
      },
      {
        "label": "Secondo tratto fisico: fine",
        "answer": "0x14003",
        "accept": [],
        "numeric": true,
        "hint": "Conta soltanto i byte che rimangono dopo il primo tratto."
      },
      {
        "label": "Quale verifica serve al passaggio di pagina?",
        "answer": "Consultare la mappatura e i permessi della seconda pagina",
        "accept": [],
        "numeric": false,
        "choices": [
          "Ripetere la lettura con ordine dei byte invertito",
          "Incrementare il numero del primo frame",
          "Consultare la mappatura e i permessi della seconda pagina"
        ],
        "hint": "Due pagine virtuali adiacenti possono puntare a frame distanti."
      }
    ],
    "steps": [
      "L’intervallo virtuale completo è 0x1FFC…0x2003. I primi 4 byte occupano 0x1FFC…0x1FFF nella pagina 1 e gli ultimi 4 occupano 0x2000…0x2003 nella pagina 2.",
      "Nella prima traduzione il frame 9 ha base 0x9000. Gli offset 0xFFC…0xFFF diventano gli indirizzi fisici 0x9FFC…0x9FFF.",
      "Nella seconda traduzione il frame 20 ha base 0x14000. Gli offset 0…3 danno 0x14000…0x14003. Gli intervalli fisici contengono in totale 4+4=8 byte.",
      "Dopo 0x9FFF, l’indirizzo fisico successivo della lettura è 0x14000. Per ottenerlo occorre tradurre la seconda pagina e verificarne il permesso di lettura."
    ],
    "variants": [
      {
        "prompt": "Una lettura di otto byte comincia a 0x5FFD con pagine da 4096 byte. La pagina 5 è leggibile e mappata sul frame 3, la pagina 6 è presente e vieta la lettura a questo processo. Il controllore valida l’intero intervallo prima di restituire dati. Trova il primo VA per cui manca il permesso, il numero di byte del tratto iniziale leggibile e l’esito della richiesta completa.",
        "fields": [
          {
            "label": "Primo VA privo di permesso",
            "answer": "24576",
            "numeric": true,
            "hint": "Cerca la base della pagina che segue 0x5FFF."
          },
          {
            "label": "Byte nel tratto iniziale",
            "answer": "3",
            "numeric": true,
            "hint": "Conta gli indirizzi inclusi da 0x5FFD fino alla fine della pagina."
          },
          {
            "label": "Esito della richiesta",
            "answer": "Rifiutata per protezione",
            "choices": [
              "Rifiutata per protezione",
              "Completata per otto byte",
              "Caricamento da disco per assenza"
            ],
            "hint": "Considera la verifica preventiva sull’intero intervallo."
          }
        ],
        "steps": [
          "Gli indirizzi 0x5FFD, 0x5FFE e 0x5FFF appartengono alla pagina 5. Contandoli si ottengono tre byte leggibili.",
          "Il quarto byte richiede un accesso alla pagina 6, all’indirizzo 0x6000. La pagina è residente e il permesso di lettura manca.",
          "La verifica preventiva respinge l’intera richiesta. La presenza del secondo frame rende inutile un caricamento da disco, che lascerebbe invariato il permesso."
        ],
        "figuraCorrezione": {
          "tipo": "permesso",
          "primo": 24573,
          "lunghezza": 8,
          "pagina": 4096
        }
      }
    ]
  },
  {
    "id": "6.3.5",
    "title": "Comporre l’indirizzo fisico",
    "kind": "campi",
    "skill": "Comporre la base del frame e l’offset",
    "principio": "Il PFN conta frame fisici interi; moltiplicarlo per i byte della pagina dà la base fisica. Con pagine da 2^b byte, SHL di b posizioni effettua questa moltiplicazione e lascia a zero i b bit inferiori. AND con la maschera 2^b − 1 conserva dal VA soltanto quei b bit, l’offset. OR accende una posizione se è accesa in almeno uno dei due operandi: quando base e offset occupano campi separati, li compone come una somma. I registri di ingresso vanno copiati nei registri di lavoro prima di modificarli.",
    "prompt": "RDI contiene l’indirizzo virtuale 0x9025 a 32 bit senza segno. RSI contiene il numero di frame 6. Ogni pagina occupa 4096 byte. Il PFN occupa al massimo 14 bit. Scrivi in RAX l’indirizzo fisico per ogni ingresso ammesso. Usa RCX come registro di lavoro e conserva RDI e RSI. Scegli i parametri delle istruzioni SHL e AND, poi prevedi RAX.",
    "fields": [
      {
        "label": "Bit da spostare a sinistra sul PFN",
        "answer": "12",
        "accept": [],
        "numeric": true,
        "hint": "La base di un frame è il PFN moltiplicato per i byte di una pagina."
      },
      {
        "label": "Maschera dei bit di offset",
        "answer": "0xFFF",
        "accept": [],
        "numeric": true,
        "hint": "Scrivi una sequenza di uno per ciascun bit di offset."
      },
      {
        "label": "Indirizzo fisico in RAX",
        "answer": "0x6025",
        "accept": [],
        "numeric": true,
        "hint": "Combina la base del frame e lo spostamento della VA."
      }
    ],
    "steps": [
      "4096 = 2^12. Lo shift di 12 posizioni porta il PFN 6 alla base 24576 = 0x6000. In quella base i 12 bit inferiori sono zero.",
      "La maschera 0xFFF conserva i bit di offset. Applicandola si ottiene 0x9025 & 0xFFF = 0x25 = 37. La scrittura in ECX azzera i 32 bit alti di RCX.",
      "Le due parti occupano campi disgiunti. OR compone 0x6000 | 0x25 = 0x6025 = 24613. RDI e RSI conservano i valori iniziali."
    ],
    "code": "mov rax, rsi\nshl rax, 12\nmov rcx, rdi\nand ecx, 4095\nor rax, rcx",
    "variants": [
      {
        "prompt": "Scrivi una routine generale per pagine da 4096 byte. RDI contiene un VA senza segno a 32 bit e RSI un PFN fino a 14 bit. In RAX si attende il PA. Usa RCX come registro di lavoro e conserva RDI e RSI. Nel caso di prova RDI vale 0xACED e RSI vale 11. Un collega ha calcolato 0xB000. Localizza il campo perduto, indica il suo valore e prevedi il risultato corretto.",
        "fields": [
          {
            "label": "Campo omesso",
            "answer": "Offset",
            "choices": [
              "PFN",
              "Offset",
              "VPN"
            ],
            "hint": "L’indirizzo proposto è allineato alla base del frame."
          },
          {
            "label": "Campo da reinserire",
            "answer": "3309",
            "numeric": true,
            "hint": "Isola i dodici bit bassi del VA."
          },
          {
            "label": "PA della prova",
            "answer": "48365",
            "numeric": true,
            "hint": "Somma lo spostamento alla base del frame."
          }
        ],
        "steps": [
          "L’uscita proposta coincide con il frame 11 spostato a sinistra di dodici bit. Essa identifica il primo byte del frame.",
          "Il VA termina in 0xCED. Per riottenere il byte richiesto bisogna conservare questi dodici bit con AND in una copia del VA.",
          "La OR fra 0xB000 e 0xCED dà 0xBCED. La routine effettua lo shift su una copia del PFN e conserva i registri di ingresso."
        ],
        "code": "mov rax, rsi\nshl rax, 12\nmov rcx, rdi\nand ecx, 4095\nor rax, rcx",
        "bits": 12,
        "va": "0xACED",
        "pfn": 11,
        "family": "compose",
        "quadro": [
          {
            "titolo": "Uscita osservata",
            "celle": [
              [
                "VA",
                "0xACED"
              ],
              [
                "PFN",
                "11"
              ],
              [
                "Uscita",
                "0xB000"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Base del frame",
            "celle": [
              [
                "11 × 4096",
                "0xB000"
              ],
              [
                "Offset osservato",
                "0"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Campo mancante",
            "celle": [
              [
                "VA AND 0xFFF",
                "0xCED"
              ],
              [
                "Offset",
                "3309"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Composizione",
            "celle": [
              [
                "Base",
                "0xB000"
              ],
              [
                "PA",
                "0xBCED"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ]
      }
    ],
    "bits": 12,
    "va": "0x9025",
    "pfn": 6,
    "family": "compose"
  },
  {
    "id": "6.3.6",
    "title": "I due estremi del frame",
    "kind": "campi",
    "skill": "Provare il primo e l’ultimo byte di un frame",
    "principio": "A frame fissato, gli offset estremi individuano il primo e l’ultimo byte raggiungibili. Questi due casi permettono di verificare insieme l’allineamento e l’ampiezza della maschera.",
    "prompt": "Collauda la routine fornita agli estremi di un frame. Le pagine sono da 1024 byte e il campione usa RDI = 0x2425 e RSI = 6. Scegli, nella stessa pagina virtuale del campione, i due VA che raggiungono il primo e l’ultimo byte del frame 6. Calcola la distanza tra i due PA. Puoi eseguire direttamente il listato nell’editor. La routine deve funzionare anche con gli altri ingressi ammessi e conservare RDI e RSI.",
    "fields": [
      {
        "label": "VA per il primo byte del frame",
        "answer": "0x2400",
        "numeric": true,
        "hint": "Sostituisci con zero gli ultimi dieci bit del VA campione."
      },
      {
        "label": "VA per l’ultimo byte del frame",
        "answer": "0x27FF",
        "numeric": true,
        "hint": "All’inizio di pagina aggiungi 1024 − 1."
      },
      {
        "label": "Distanza fra gli estremi fisici, in byte",
        "answer": "1023",
        "numeric": true,
        "hint": "Il conteggio dei byte include entrambi gli estremi, la distanza è la loro differenza."
      }
    ],
    "steps": [
      "Il quoziente intero di 0x2425 diviso 1024 è 9. La pagina 9 si estende da 9 × 1024 = 0x2400 a 0x2400 + 1023 = 0x27FF.",
      "A entrambi gli ingressi si assegna il medesimo PFN 6. Con offset zero il PA è 6 × 1024 = 0x1800. All’altro estremo i dieci bit a uno aggiungono 0x3FF.",
      "La differenza 0x1BFF − 0x1800 vale 1023. Aggiungendo uno per includere entrambi gli estremi si ritrova la capienza del frame. Il listato calcola entrambi gli esiti con la stessa maschera."
    ],
    "code": "mov rax, rsi\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx",
    "variants": [
      {
        "prompt": "Scrivi una routine generale per pagine da 1024 byte. RDI contiene un VA senza segno a 32 bit e RSI un PFN fino a 14 bit. In RAX si attende il PA. Usa RCX come registro di lavoro e conserva RDI e RSI. Nel caso di prova RDI vale 0x16D0 e RSI vale 11. Un rapporto sostiene che la lettura di 16 byte a partire dal VA della prova termini ancora nello stesso frame, assumendo una mappatura valida per tutta la pagina. Quanti byte rimangono da quel VA fino alla fine della pagina, includendo il byte iniziale? Quale PA chiude la lettura di 16 byte?",
        "fields": [
          {
            "label": "Byte disponibili inclusi",
            "answer": "304",
            "numeric": true,
            "hint": "La pagina contiene 1024 byte e il VA ha offset 0x2D0."
          },
          {
            "label": "PA dell’ultimo byte richiesto",
            "answer": "11999",
            "numeric": true,
            "hint": "Il sedicesimo byte ha distanza 15 dal primo PA."
          }
        ],
        "steps": [
          "Con 1024 byte per pagina, l’offset è 0x2D0, pari a 720. Dalla posizione 720 fino a 1023 sono disponibili 1024 − 720 = 304 byte.",
          "La routine genera la base 11 × 1024 = 0x2C00 e incorpora lo spostamento. Il primo PA è 0x2ED0.",
          "La lettura interessa 16 dei 304 byte disponibili. L’ultimo PA è 0x2ED0 + 15 = 0x2EDF e resta nel frame 11."
        ],
        "code": "mov rax, rsi\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx",
        "bits": 10,
        "va": "0x16D0",
        "pfn": 11,
        "family": "compose",
        "quadro": [
          {
            "titolo": "Richiesta",
            "celle": [
              [
                "VA",
                "0x16D0"
              ],
              [
                "PFN",
                "11"
              ],
              [
                "Lunghezza",
                "16 B"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Margine disponibile",
            "celle": [
              [
                "Offset",
                "0x2D0"
              ],
              [
                "Byte residui",
                "304"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Prima traduzione",
            "celle": [
              [
                "Base frame",
                "0x2C00"
              ],
              [
                "Primo PA",
                "0x2ED0"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Intervallo",
            "celle": [
              [
                "Ultimo PA",
                "0x2EDF"
              ],
              [
                "Frame",
                "11"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          }
        ],
        "starter": ""
      }
    ],
    "bits": 10,
    "va": "0x2425",
    "pfn": 6,
    "family": "compose",
    "quadro": [
      {
        "titolo": "Progettare due ingressi",
        "celle": [
          [
            "VA campione",
            "0x2425"
          ],
          [
            "Pagina",
            "1024 B"
          ],
          [
            "Frame",
            "6"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Pagina del campione",
        "celle": [
          [
            "Primo VA",
            "0x2400"
          ],
          [
            "Ultimo VA",
            "0x27FF"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Estremi del frame",
        "celle": [
          [
            "PA minimo",
            "0x1800"
          ],
          [
            "PA massimo",
            "0x1BFF"
          ]
        ],
        "tipo": "confronto",
        "nota": ""
      },
      {
        "titolo": "Distanza e capienza",
        "celle": [
          [
            "Distanza",
            "1023 B"
          ],
          [
            "Capienza",
            "1024 B"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      }
    ],
    "starter": "mov rax, rsi\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx"
  },
  {
    "id": "6.3.7",
    "title": "I bit della VPN nel risultato",
    "kind": "campi",
    "skill": "Diagnosticare una maschera errata",
    "principio": "Il PA, indirizzo fisico, affianca numero di frame e offset. OR mette a uno ogni bit acceso in almeno uno degli operandi; se la copia del VA contiene ancora i bit della VPN, può quindi alterare il campo del frame. AND conserva invece un bit soltanto quando entrambi gli operandi hanno uno. Una maschera con b uno a destra, pari a 2^b − 1, isola esattamente l’offset di una pagina da 2^b byte; una maschera più corta ne perde alcune posizioni.",
    "prompt": "Ripara il listato che combina la base fisica con una copia integrale dell’indirizzo virtuale. Il VA in RDI è 0x24025, il PFN in RSI è 6, le pagine misurano 16384 byte. Prima della correzione prevedi quale valore produce la OR. Indica poi quale campo di RCX va eliminato prima di eseguire OR, mantenendo intatti gli ingressi. Controlla la routine con i diversi VA del banco.",
    "fields": [
      {
        "label": "RAX del listato iniziale",
        "answer": "0x3C025",
        "numeric": true,
        "hint": "Calcola 6 × 16384 e applica OR a tutta la parola 0x24025."
      },
      {
        "label": "Campo di RCX da eliminare",
        "answer": "I bit della VPN",
        "choices": [
          "I bit della VPN",
          "I bit dell’offset",
          "Soltanto il bit meno significativo"
        ],
        "hint": "Il frame deve provenire interamente da RSI."
      }
    ],
    "steps": [
      "Lo shift di RSI di quattordici bit produce 0x18000. RCX contiene ancora 0x24025, compresi i bit che identificano la pagina virtuale.",
      "Calcolando OR sulle due parole si ottiene 0x3C025. I bit della VPN occupano posizioni che nel PA competono al frame.",
      "Una AND di RCX con 0x3FFF conserva soltanto l’offset 0x25. La OR con la base fisica produce ora 0x18025. Poiché si lavora sulle copie, RDI e RSI restano intatti."
    ],
    "code": "mov rax, rsi\nshl rax, 14\nmov rcx, rdi\nand ecx, 16383\nor rax, rcx",
    "variants": [
      {
        "prompt": "Scrivi una routine generale per pagine da 16384 byte. RDI contiene un VA senza segno a 32 bit e RSI un PFN fino a 14 bit. In RAX si attende il PA. Usa RCX come registro di lavoro e conserva RDI e RSI. Nel caso di prova RDI vale 0x3E025 e RSI vale 4. Il frammento corretto deve usare tutti i bit dell’offset. Se si sostituisce la maschera con 0xFFF, quanti bit dell’offset dichiarato si perdono? Calcola poi il PA errato e quello corretto sul caso della prova.",
        "fields": [
          {
            "label": "Bit dell’offset persi",
            "answer": "2",
            "numeric": true,
            "hint": "Confronta la larghezza di una pagina da 16 KiB con dodici bit."
          },
          {
            "label": "PA con maschera corta",
            "answer": "65573",
            "numeric": true,
            "hint": "Conserva la base del frame 4 e soltanto le tre cifre inferiori del VA."
          },
          {
            "label": "PA corretto",
            "answer": "73765",
            "numeric": true,
            "hint": "Applica al VA la maschera completa 0x3FFF."
          }
        ],
        "steps": [
          "La dimensione 16384 è 2¹⁴. La maschera corretta 0x3FFF usa quattordici bit, mentre 0xFFF ne conserva dodici e perde le posizioni 12 e 13.",
          "Il frame 4 ha base 0x10000. Con la maschera corta rimane 0x025 e il PA sarebbe 0x10025.",
          "Il valore di prova ha il bit 13 impostato. Conservandolo si ottiene l’offset 0x2025 e quindi 0x12025. Gli ingressi vanno copiati prima di modificarli."
        ],
        "code": "mov rax, rsi\nshl rax, 14\nmov rcx, rdi\nand ecx, 16383\nor rax, rcx",
        "bits": 14,
        "va": "0x3E025",
        "pfn": 4,
        "family": "compose",
        "quadro": [
          {
            "titolo": "Vincoli",
            "celle": [
              [
                "Pagina",
                "16 KiB"
              ],
              [
                "VA",
                "0x3E025"
              ],
              [
                "PFN",
                "4"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Maschere",
            "celle": [
              [
                "Richiesti",
                "14 bit"
              ],
              [
                "Conservati",
                "12 bit"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Difetto",
            "celle": [
              [
                "Offset corto",
                "0x025"
              ],
              [
                "PA errato",
                "0x10025"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Ripristino",
            "celle": [
              [
                "Offset vero",
                "0x2025"
              ],
              [
                "PA corretto",
                "0x12025"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ],
        "starter": ""
      }
    ],
    "bits": 14,
    "va": "0x24025",
    "pfn": 6,
    "family": "compose",
    "quadro": [
      {
        "titolo": "Valori che entrano in OR",
        "celle": [
          [
            "PFN",
            "6"
          ],
          [
            "VA",
            "0x24025"
          ],
          [
            "Pagina",
            "16 KiB"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Due parole sovrapposte",
        "celle": [
          [
            "Base fisica",
            "0x18000"
          ],
          [
            "RCX iniziale",
            "0x24025"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Esito scorretto",
        "celle": [
          [
            "OR integrale",
            "0x3C025"
          ],
          [
            "Campo estraneo",
            "VPN"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Riparazione",
        "celle": [
          [
            "Maschera",
            "0x3FFF"
          ],
          [
            "RCX dopo AND",
            "0x25"
          ],
          [
            "PA",
            "0x18025"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      }
    ],
    "starter": "mov rax, rsi\nshl rax, 14\nmov rcx, rdi\n; Manca la selezione del campo che deve entrare in OR.\nor rax, rcx"
  },
  {
    "id": "6.3.8",
    "title": "Il più grande indirizzo rappresentabile",
    "kind": "campi",
    "skill": "Dimostrare il limite superiore del PA",
    "principio": "La larghezza di un indirizzo fisico composto dipende dai bit del PFN e dai bit dell’offset. L’ultimo byte indirizzabile corrisponde all’ultimo offset dell’ultimo frame.",
    "prompt": "Dimensiona il risultato per tutti gli ingressi ammessi. Una pagina misura 2048 byte e il PFN ha al massimo 14 bit. Ricava il massimo PA, la larghezza minima in bit e il più piccolo tipo sufficiente fra quelli proposti. Il frammento completo nell’editor usa RDI per il VA e RSI per il PFN. Puoi usarlo per verificare il contratto anche sul campione 0x4825, frame 6.",
    "fields": [
      {
        "label": "Massimo PA ammesso",
        "answer": "33554431",
        "numeric": true,
        "hint": "Il massimo usa contemporaneamente il frame e l’offset più grandi."
      },
      {
        "label": "Larghezza minima in bit",
        "answer": "25",
        "numeric": true,
        "hint": "I bit del PFN e quelli dell’offset occupano campi contigui."
      },
      {
        "label": "Tipo sufficiente più piccolo",
        "answer": "Intero senza segno a 32 bit",
        "choices": [
          "Intero senza segno a 16 bit",
          "Intero senza segno a 32 bit",
          "Intero senza segno a 64 bit"
        ],
        "hint": "Scegli fra le larghezze disponibili."
      }
    ],
    "steps": [
      "Un campo di quattordici bit raggiunge 2¹⁴ − 1 = 16383. La pagina da 2048 byte ha undici bit di offset e l’ultima posizione è 2047.",
      "I due campi si affiancano. Il massimo vale 16383 × 2048 + 2047 = 33554431, cioè 2²⁵ − 1.",
      "Il primo tipo disponibile che contiene i venticinque bit è quello senza segno da 32 bit. La grandezza del solo campione visibile sarebbe insufficiente a dimostrare la validità per l’intero dominio."
    ],
    "code": "mov rax, rsi\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx",
    "variants": [
      {
        "prompt": "Scrivi una routine generale per pagine da 2048 byte. RDI contiene un VA senza segno a 32 bit e RSI un PFN fino a 14 bit. In RAX si attende il PA. Usa RCX come registro di lavoro e conserva RDI e RSI. Nel caso di prova RDI vale 0x5751 e RSI vale 12. Il destinatario vorrebbe memorizzare il PA in 16 bit. Verifica se il singolo caso di prova vi rientra e costruisci il primo controesempio variando il PFN a offset zero. Qual è il minimo PFN che produce un PA troppo grande per il destinatario?",
        "fields": [
          {
            "label": "PA del caso di prova",
            "answer": "26449",
            "numeric": true,
            "hint": "Ricava l’offset con la maschera 0x7FF."
          },
          {
            "label": "Primo PFN che supera 16 bit",
            "answer": "32",
            "numeric": true,
            "hint": "Dividi il primo PA oltre 0xFFFF per 2048."
          }
        ],
        "steps": [
          "La base 12 × 2048 vale 0x6000. Aggiungendo l’offset 0x751 si ottiene 0x6751, che rientra nei sedici bit.",
          "Un intero senza segno a sedici bit arriva a 65535. Con offset zero il primo PA escluso è 65536, che è una base di frame.",
          "Il PFN 65536 ÷ 2048 = 32 è ammesso dal vincolo di quattordici bit. L’esempio dimostra che una singola traduzione piccola è insufficiente a convalidare il tipo proposto."
        ],
        "code": "mov rax, rsi\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx",
        "bits": 11,
        "va": "0x5751",
        "pfn": 12,
        "family": "compose",
        "quadro": [
          {
            "titolo": "Proposta",
            "celle": [
              [
                "Tipo",
                "16 bit"
              ],
              [
                "Pagina",
                "2048 B"
              ],
              [
                "PFN prova",
                "12"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Caso favorevole",
            "celle": [
              [
                "Offset",
                "0x751"
              ],
              [
                "PA",
                "0x6751"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Limite del tipo",
            "celle": [
              [
                "Massimo",
                "65535"
              ],
              [
                "Primo escluso",
                "65536"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Controesempio",
            "celle": [
              [
                "PFN",
                "32"
              ],
              [
                "PA",
                "0x10000"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ],
        "starter": ""
      }
    ],
    "bits": 11,
    "va": "0x4825",
    "pfn": 6,
    "family": "compose",
    "quadro": [
      {
        "titolo": "Limiti del contratto",
        "celle": [
          [
            "PFN",
            "14 bit"
          ],
          [
            "Pagina",
            "2048 B"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Estremi dei due campi",
        "celle": [
          [
            "PFN massimo",
            "16383"
          ],
          [
            "Offset massimo",
            "2047"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Ultimo indirizzo",
        "celle": [
          [
            "PFN alto",
            "14 bit"
          ],
          [
            "Offset basso",
            "11 bit"
          ],
          [
            "Massimo PA",
            "33554431"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Scelta del tipo",
        "celle": [
          [
            "Minimo",
            "25 bit"
          ],
          [
            "Tipo scelto",
            "32 bit"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      }
    ],
    "starter": "mov rax, rsi\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx"
  },
  {
    "id": "6.3.9",
    "title": "Prelevare una voce indicizzata",
    "kind": "campi",
    "skill": "Caricare il PFN dalla tabella",
    "principio": "In una tabella uniforme, indice × byte per voce misura la distanza dalla base. MOV con parentesi quadre legge il contenuto all’indirizzo così calcolato. RAX è un registro da 64 bit; EAX ne indica i 32 bit inferiori. Un carico in RAX legge otto byte, mentre un carico in EAX ne legge quattro e azzera anche la metà superiore di RAX. Per restituire una voce intera, la larghezza del carico deve coincidere con quella dichiarata per la voce.",
    "prompt": "Il registro RDI contiene 0x7013, RSI punta alla tabella in 0x200000. Una pagina occupa 4096 byte. La tabella è leggibile. Scrivi un frammento che restituisca in RAX tutti i 64 bit della voce relativa all’indirizzo virtuale in RDI. Conserva RDI e RSI. Ogni voce di 8 byte contiene direttamente un PFN. La voce 7 contiene 23. Completa la traccia del caricamento indicizzato.",
    "fields": [
      {
        "label": "VPN",
        "answer": "7",
        "accept": [],
        "numeric": true,
        "hint": "Dividi l’indirizzo virtuale per i byte di una pagina e conserva il quoziente intero."
      },
      {
        "label": "Indirizzo della voce",
        "answer": "0x200038",
        "accept": [],
        "numeric": true,
        "hint": "Conta otto byte per ogni voce precedente e aggiungi la base della tabella."
      },
      {
        "label": "PFN restituito in RAX",
        "answer": "23",
        "accept": [],
        "numeric": true,
        "hint": "Consulta il contenuto memorizzato nella voce selezionata."
      }
    ],
    "steps": [
      "Spostando RDI di 12 bit a destra si ottiene il quoziente intero della divisione per la dimensione di pagina. La VPN vale 0x7013 >> 12 = 7. L’offset scartato vale 19.",
      "La voce ha indice 7. La sua posizione è 7 × 8 = 56 = 0x38 byte dopo la base. L’indirizzo della voce è 0x200000 + 0x38 = 0x200038.",
      "MOV RAX, [RSI + RAX*8] legge otto byte a 0x200038. RAX assume il valore 23 conservato in quella voce. Nel listato, RAX passa dalla VPN al PFN."
    ],
    "code": "mov rax, rdi\nshr rax, 12\nmov rax, [rsi + rax*8]",
    "variants": [
      {
        "prompt": "RDI contiene il VA a 32 bit, RSI la base della tabella leggibile di voci da otto byte e le pagine misurano 4096 byte. Scrivi una routine che restituisca in RAX i 64 bit della voce indicizzata, conservando RDI e RSI. Per la prova RDI vale 0xC02A, RSI vale 0x300000 e la voce richiesta contiene 41. Per verificare la larghezza del caricamento, confronta la voce di prova con una seconda voce ipotetica di valore 0x100000029. Quanti bit devono essere letti? Quale valore darebbe per questa seconda voce un MOV in EAX e quale deve restituire il MOV in RAX?",
        "fields": [
          {
            "label": "Larghezza richiesta in bit",
            "answer": "64",
            "numeric": true,
            "hint": "La singola voce occupa otto byte."
          },
          {
            "label": "Risultato del carico in EAX",
            "answer": "41",
            "numeric": true,
            "hint": "Conserva soltanto gli otto caratteri esadecimali inferiori."
          },
          {
            "label": "Risultato a larghezza piena",
            "answer": "0x100000029",
            "numeric": true,
            "hint": "Il caricamento a otto byte conserva anche il bit in posizione 32."
          }
        ],
        "steps": [
          "Gli otto byte della voce contengono sessantaquattro bit. Quando la voce vale 41 le due istruzioni possono sembrare equivalenti.",
          "La parte bassa della seconda voce vale 0x29. Un MOV in EAX carica soltanto trentadue bit e azzera la metà superiore di RAX, lasciando 41.",
          "Il MOV a sessantaquattro bit preserva la parte alta e restituisce 0x100000029. Il frammento deve applicare questa larghezza a qualunque voce indirizzata."
        ],
        "code": "mov rax, rdi\nshr rax, 12\nmov rax, [rsi + rax*8]",
        "bits": 12,
        "va": "0xC02A",
        "pfn": 41,
        "family": "lookup",
        "base": "0x300000",
        "pte": 41,
        "quadro": [
          {
            "titolo": "Contratto",
            "celle": [
              [
                "Voce prova",
                "41"
              ],
              [
                "Seconda voce",
                "0x100000029"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Larghezza",
            "celle": [
              [
                "Byte per voce",
                "8"
              ],
              [
                "Bit per voce",
                "64"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Carico corto",
            "celle": [
              [
                "Bit bassi",
                "0x29"
              ],
              [
                "RAX",
                "41"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Carico completo",
            "celle": [
              [
                "Parte alta",
                "1"
              ],
              [
                "RAX",
                "0x100000029"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ]
      }
    ],
    "bits": 12,
    "va": "0x7013",
    "pfn": 23,
    "family": "lookup",
    "base": "0x200000",
    "pte": 23
  },
  {
    "id": "6.3.10",
    "title": "L’indirizzo della voce e il suo contenuto",
    "kind": "campi",
    "skill": "Distinguere LEA e MOV in una lettura indicizzata",
    "principio": "LEA calcola l’indirizzo risultante da base, indice e scala; MOV con un operando fra parentesi quadre legge i byte a quell’indirizzo. La posizione della voce e il suo contenuto sono quindi valori distinti. I numeri preceduti da 0x sono in base sedici. Nel listato RAX contiene 64 bit, otto byte: usarlo come destinazione del MOV permette di restituire l’intera voce prevista dal contratto. Spostare la tabella conservandone il contenuto cambia gli indirizzi delle letture e conserva i valori restituiti.",
    "prompt": "Correggi l’ultima istruzione del listato. Il debugger mostra una LEA e il chiamante riceve un indirizzo dove si aspetta il contenuto di una voce. Con pagine da 1024 byte, RDI = 0x1C13 e RSI = 0x200000, la voce 7 di otto byte contiene 23. Prevedi il valore prodotto dalla LEA e sostituiscila nell’editor con un carico della larghezza corretta. Conserva RDI e RSI.",
    "fields": [
      {
        "label": "RAX con la LEA difettosa",
        "answer": "0x200038",
        "numeric": true,
        "hint": "La LEA combina la base e l’indice scalato senza accedere ai byte della voce."
      },
      {
        "label": "Sostituzione della LEA",
        "answer": "MOV RAX, [RSI + RAX*8]",
        "choices": [
          "MOV RAX, [RSI + RAX*8]",
          "MOV EAX, [RSI + RAX*8]",
          "MOV RAX, RSI"
        ],
        "hint": "La specifica richiede tutti gli otto byte."
      }
    ],
    "steps": [
      "La LEA calcola 0x200000 + 7 × 8 = 0x200038. Il registro riceve questa posizione senza leggere la memoria.",
      "Nella cella localizzata è registrato 23. Per restituirlo bisogna fare di 0x200038 l’indirizzo di un accesso in memoria.",
      "MOV RAX, [RSI + RAX*8] carica l’intera voce. Una scrittura in EAX restituirebbe soltanto i 32 bit inferiori, sebbene nel caso di 23 la differenza resti nascosta."
    ],
    "code": "mov rax, rdi\nshr rax, 10\nmov rax, [rsi + rax*8]",
    "variants": [
      {
        "prompt": "RDI contiene il VA a 32 bit, RSI la base della tabella leggibile di voci da otto byte e le pagine misurano 1024 byte. Scrivi una routine che restituisca in RAX i 64 bit della voce indicizzata, conservando RDI e RSI. Per la prova RDI vale 0x102A, RSI vale 0x300000 e la voce richiesta contiene 61. Nella traccia corretta la lettura di memoria avviene a 0x300020, mentre nel registro RAX alla fine compare 61. Quale sarebbe il risultato in RAX se il chiamante spostasse tutta la tabella a 0x400000, copiando senza modifiche le voci? Indica anche il nuovo indirizzo dal quale viene letto il dato.",
        "fields": [
          {
            "label": "Nuovo indirizzo della voce",
            "answer": "4194336",
            "numeric": true,
            "hint": "La VPN conserva il medesimo indice dopo la copia."
          },
          {
            "label": "RAX dopo la rilocazione",
            "answer": "61",
            "numeric": true,
            "hint": "La tabella è stata copiata integralmente."
          }
        ],
        "steps": [
          "Con pagine da 1024 byte, la VPN è 4. La voce di indice 4 si trova a 4 × 8 = 32 byte dalla base.",
          "La nuova base più 0x20 dà 0x400020. LEA potrebbe produrre questo indirizzo, mentre MOV lo usa per accedere alla memoria.",
          "Poiché la copia contiene gli stessi otto byte nella voce 4, il risultato resta 61. Una variazione di RAX pari allo spostamento della tabella denuncerebbe la restituzione di un indirizzo."
        ],
        "code": "mov rax, rdi\nshr rax, 10\nmov rax, [rsi + rax*8]",
        "bits": 10,
        "va": "0x102A",
        "pfn": 61,
        "family": "lookup",
        "base": "0x300000",
        "pte": 61,
        "quadro": [
          {
            "titolo": "Rilocazione",
            "celle": [
              [
                "Vecchia base",
                "0x300000"
              ],
              [
                "Nuova base",
                "0x400000"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Indice",
            "celle": [
              [
                "VA",
                "0x102A"
              ],
              [
                "VPN",
                "4"
              ],
              [
                "Offset voce",
                "32 B"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Lettura",
            "celle": [
              [
                "Vecchio",
                "0x300020"
              ],
              [
                "Nuovo",
                "0x400020"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Risultato",
            "celle": [
              [
                "Valore copiato",
                "61"
              ],
              [
                "RAX",
                "61"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          }
        ],
        "starter": ""
      }
    ],
    "bits": 10,
    "va": "0x1C13",
    "pfn": 23,
    "family": "lookup",
    "base": "0x200000",
    "pte": 23,
    "quadro": [
      {
        "titolo": "Difetto segnalato",
        "celle": [
          [
            "Indice dopo SHR",
            "7"
          ],
          [
            "Base",
            "0x200000"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Indirizzo calcolato",
        "celle": [
          [
            "Scala",
            "8"
          ],
          [
            "Distanza",
            "56 B"
          ],
          [
            "LEA",
            "0x200038"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Operazione richiesta",
        "celle": [
          [
            "Qui",
            "0x200038"
          ],
          [
            "Contenuto",
            "23"
          ]
        ],
        "tipo": "confronto",
        "nota": ""
      },
      {
        "titolo": "Correzione",
        "celle": [
          [
            "Destinazione",
            "RAX"
          ],
          [
            "Accesso",
            "8 B"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      }
    ],
    "starter": "mov rax, rdi\nshr rax, 10\nlea rax, [rsi + rax*8]"
  },
  {
    "id": "6.3.11",
    "title": "Scegliere shift e scala",
    "kind": "campi",
    "skill": "Associare le unità di misura ai fattori di scala",
    "principio": "SHR sposta i bit a destra: per un indirizzo senza segno, spostarlo di b posizioni equivale alla divisione intera per 2^b. Se la pagina contiene 2^b byte, il risultato è la VPN. La scala dell’operando in memoria moltiplica invece la VPN per i byte occupati da una voce e localizza la lettura rispetto alla base. Dimensione di pagina e dimensione di voce fissano dunque due fattori distinti del calcolo.",
    "prompt": "Completa i due fattori indipendenti del listato. Il prototipo usa uno shift di 12 e una scala di 4; la tabella reale ha voci di otto byte e le pagine da 2048 byte. Sostituisci entrambi i valori nell’editor. Per controllare che le modifiche abbiano agito nei posti previsti, calcola la distanza in byte dalla base con RDI = 0x3813. RSI contiene la base e deve restare intatto come RDI.",
    "fields": [
      {
        "label": "Shift da usare",
        "answer": "11",
        "numeric": true,
        "hint": "Conta i bit che distinguono le 2048 posizioni interne."
      },
      {
        "label": "Scala da usare",
        "answer": "8",
        "numeric": true,
        "hint": "La distanza tra due voci della tabella è la larghezza di una voce."
      },
      {
        "label": "Distanza corretta dalla base",
        "answer": "56",
        "numeric": true,
        "hint": "Moltiplica la VPN ricavata dal campione per la scala corretta."
      }
    ],
    "steps": [
      "La larghezza della pagina è 2¹¹. Rimuovendo gli undici bit inferiori da 0x3813 si ottiene VPN 7. Lo shift 12 darebbe invece VPN 3.",
      "Ogni riga occupa otto byte. Nel MOV la scala corretta è pertanto otto. Questa scelta dipende dal formato della tabella e resta indipendente dalla dimensione di pagina.",
      "Il prodotto 7 × 8 sposta la lettura di 56 byte rispetto alla base 0x200000. Nel campione la voce a 0x200038 contiene 23. La verifica con altri ingressi controlla entrambi i fattori."
    ],
    "code": "mov rax, rdi\nshr rax, 11\nmov rax, [rsi + rax*8]",
    "variants": [
      {
        "prompt": "RDI contiene il VA a 32 bit, RSI la base della tabella leggibile di voci da otto byte e le pagine misurano 2048 byte. Scrivi una routine che restituisca in RAX i 64 bit della voce indicizzata, conservando RDI e RSI. Per la prova RDI vale 0x182A, RSI vale 0x300000 e la voce richiesta contiene 9. Un prototipo corretto per la pagina usa poi la scala 4 al posto di 8 nella lettura. A quale indirizzo tenterà il carico con i dati della prova? Trova il primo VA per cui quella scala sbagliata cambia l’indirizzo della voce rispetto alla scala corretta.",
        "fields": [
          {
            "label": "Indirizzo calcolato dal prototipo",
            "answer": "3145740",
            "numeric": true,
            "hint": "Il VA 0x182A appartiene alla pagina 3."
          },
          {
            "label": "Primo VA che distingue le scale",
            "answer": "2048",
            "numeric": true,
            "hint": "Nella pagina zero entrambe le scale moltiplicano zero."
          }
        ],
        "steps": [
          "Lo shift di undici bit dà VPN 3. La scala proposta avanza di 3 × 4 = 12 byte e porta a 0x30000C, invece che a 0x300018.",
          "Finché il VA appartiene alla pagina zero, sia 4 × 0 sia 8 × 0 valgono zero. Una prova limitata a quella pagina lascerebbe passare l’errore.",
          "All’indirizzo 2048 comincia la pagina 1. La scala quattro raggiunge la base più 4, quella corretta la base più 8. Il confronto riguarda gli indirizzi, a prescindere dai dati eventualmente letti."
        ],
        "code": "mov rax, rdi\nshr rax, 11\nmov rax, [rsi + rax*8]",
        "bits": 11,
        "va": "0x182A",
        "pfn": 9,
        "family": "lookup",
        "base": "0x300000",
        "pte": 9,
        "quadro": [
          {
            "titolo": "Ipotesi",
            "celle": [
              [
                "Scala proposta",
                "4"
              ],
              [
                "Voce",
                "8 B"
              ],
              [
                "Pagina",
                "2048 B"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Caso in prova",
            "celle": [
              [
                "VPN",
                "3"
              ],
              [
                "Offset errato",
                "12 B"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Indici indistinguibili",
            "celle": [
              [
                "VPN",
                "0"
              ],
              [
                "Offset tabella",
                "0 B"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Primo test utile",
            "celle": [
              [
                "VA",
                "2048"
              ],
              [
                "VPN",
                "1"
              ],
              [
                "Offset corretto",
                "8 B"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ],
        "starter": ""
      }
    ],
    "bits": 11,
    "va": "0x3813",
    "pfn": 23,
    "family": "lookup",
    "base": "0x200000",
    "pte": 23,
    "quadro": [
      {
        "titolo": "Prototipo",
        "celle": [
          [
            "Shift iniziale",
            "12"
          ],
          [
            "Scala iniziale",
            "4"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Primo fattore",
        "celle": [
          [
            "Pagina",
            "2048 B"
          ],
          [
            "Shift",
            "11"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Secondo fattore",
        "celle": [
          [
            "Voce",
            "8 B"
          ],
          [
            "Scala",
            "8"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Controllo del campione",
        "celle": [
          [
            "Indice",
            "7"
          ],
          [
            "Distanza",
            "56 B"
          ],
          [
            "Lettura",
            "0x200038"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      }
    ],
    "starter": "mov rax, rdi\nshr rax, 12\nmov rax, [rsi + rax*4]"
  },
  {
    "id": "6.3.12",
    "title": "Due voci adiacenti",
    "kind": "campi",
    "skill": "Controllare il cambio di VPN al confine",
    "principio": "Due byte ai lati di un confine di pagina hanno VPN consecutive e offset ai due estremi dell’intervallo. La tabella può associare le due pagine a frame distanti.",
    "prompt": "Progetta la coppia di prove che attraversa il confine fra la pagina virtuale 7 e la pagina 8 usando due VA consecutivi. Ogni pagina misura 8192 byte e la tabella contiene voci dirette da otto byte. Individua i due VA e scegli l’assegnazione dei PFN che rende distinguibile la lettura erronea della stessa voce in entrambi i casi. Il codice nell’editor è completo e conserva RDI e RSI.",
    "fields": [
      {
        "label": "Ultimo VA della pagina 7",
        "answer": "0xFFFF",
        "numeric": true,
        "hint": "L’inizio della pagina 8 è il primo indirizzo oltre la pagina 7."
      },
      {
        "label": "Primo VA della pagina 8",
        "answer": "0x10000",
        "numeric": true,
        "hint": "Moltiplica l’indice 8 per la dimensione di pagina."
      },
      {
        "label": "Dati discriminanti per la prova",
        "answer": "Voci 7 e 8 con PFN distinti",
        "choices": [
          "Voci 7 e 8 con PFN distinti",
          "Voci 7 e 8 con lo stesso PFN",
          "Sola variazione del contenuto di RAX prima del carico"
        ],
        "hint": "Un errore di selezione si osserva nel risultato se la voce alternativa restituisce un altro dato."
      }
    ],
    "steps": [
      "La pagina 8 inizia a 8 × 8192 = 65536 = 0x10000. Il byte che la precede ha VA 0xFFFF e chiude la pagina 7.",
      "Lo shift di tredici bit deve produrre gli indici 7 e 8. Nel MOV i due indirizzi della tabella sono separati da otto byte, mentre i due VA differiscono di un solo byte.",
      "Con due PFN distinti, leggere due volte la voce 7 ripete un risultato che nel secondo test dovrebbe cambiare. Due PFN uguali renderebbero invece le uscite indistinguibili benché siano state lette posizioni sbagliate."
    ],
    "code": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]",
    "variants": [
      {
        "prompt": "RDI contiene il VA a 32 bit, RSI la base della tabella leggibile di voci da otto byte e le pagine misurano 8192 byte. Scrivi una routine che restituisca in RAX i 64 bit della voce indicizzata, conservando RDI e RSI. Per la prova RDI vale 0xA02A, RSI vale 0x300000 e la voce richiesta contiene 31. I due VA 0xA02A e 0xBFFF devono utilizzare la stessa voce. Indica il primo VA successivo che ne cambia l’indirizzo, poi calcola l’aumento dell’indirizzo della voce fra quei due accessi di confine. Verifica anche il valore di RAX per il caso iniziale.",
        "fields": [
          {
            "label": "Primo VA della pagina successiva",
            "answer": "49152",
            "numeric": true,
            "hint": "Le pagine sono larghe 0x2000 byte."
          },
          {
            "label": "Incremento nella tabella in byte",
            "answer": "8",
            "numeric": true,
            "hint": "L’indice aumenta di uno."
          },
          {
            "label": "RAX per il VA di partenza",
            "answer": "31",
            "numeric": true,
            "hint": "Il lookup restituisce il contenuto della voce diretta."
          }
        ],
        "steps": [
          "Gli indirizzi da 0xA000 a 0xBFFF appartengono alla pagina 5. Il VA di prova legge la voce a 0x300000 + 5 × 8 e restituisce 31.",
          "Il primo indirizzo successivo è 0xC000. A quel punto lo shift di tredici bit restituisce VPN 6.",
          "Fra le due letture al confine l’indirizzo virtuale cresce di un byte e l’indirizzo della voce cresce di otto byte. La dimensione della pagina determina quando cambia la voce, la sua larghezza determina di quanto."
        ],
        "code": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]",
        "bits": 13,
        "va": "0xA02A",
        "pfn": 31,
        "family": "lookup",
        "base": "0x300000",
        "pte": 31,
        "quadro": [
          {
            "titolo": "Coppia iniziale",
            "celle": [
              [
                "Primo VA",
                "0xA02A"
              ],
              [
                "Secondo VA",
                "0xBFFF"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Stessa pagina",
            "celle": [
              [
                "VPN",
                "5"
              ],
              [
                "Voce",
                "0x300028"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Confine virtuale",
            "celle": [
              [
                "Fine",
                "0xBFFF"
              ],
              [
                "Inizio seguente",
                "0xC000"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Passaggio nella tabella",
            "celle": [
              [
                "Prima",
                "0x300028"
              ],
              [
                "Dopo",
                "0x300030"
              ],
              [
                "Distanza",
                "8 B"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ],
        "starter": ""
      }
    ],
    "bits": 13,
    "va": "0xE013",
    "pfn": 23,
    "family": "lookup",
    "base": "0x200000",
    "pte": 23,
    "quadro": [
      {
        "titolo": "Prova sui bordi",
        "celle": [
          [
            "Pagina sinistra",
            "7"
          ],
          [
            "Pagina destra",
            "8"
          ],
          [
            "Dimensione",
            "8 KiB"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Due ingressi",
        "celle": [
          [
            "Primo VA",
            "0xFFFF"
          ],
          [
            "Secondo VA",
            "0x10000"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Due letture",
        "celle": [
          [
            "Primo indice",
            "7"
          ],
          [
            "Secondo indice",
            "8"
          ],
          [
            "Distanza fra voci",
            "8 B"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Capacità del test",
        "celle": [
          [
            "PFN diversi",
            "errore visibile"
          ],
          [
            "PFN uguali",
            "errore nascosto"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      }
    ],
    "starter": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]"
  },
  {
    "id": "6.3.13",
    "title": "Il bit che decide il ramo",
    "kind": "campi",
    "skill": "Leggere la validità di una PTE codificata",
    "principio": "La voce codificata PTE = 2 × PFN + valid usa il bit a destra per la validità e quelli superiori per il numero del frame. TEST RAX, 1 esegue AND con una parola che ha acceso il solo bit basso; conserva RAX e imposta ZF, l’indicatore di zero, a uno quando quel bit è zero. JZ salta quando ZF vale uno. Il test della validità deve precedere SHR, che estrae il PFN eliminando il bit basso: anche il frame zero può essere una destinazione valida.",
    "prompt": "Il formato della voce è PTE = (PFN << 1) | valid. La memoria contiene la PTE 42. Un controllo accetta ogni voce con valore diverso da zero. Determina il bit di validità e il ramo corretto.",
    "fields": [
      {
        "label": "Bit di validità",
        "answer": "0",
        "accept": [],
        "numeric": true,
        "hint": "Isola il bit meno significativo con una maschera di valore 1."
      },
      {
        "label": "Valore del campo alto",
        "answer": "21",
        "accept": [],
        "numeric": true,
        "hint": "Sposta la PTE di un bit a destra, mantenendo separata la decisione di validità."
      },
      {
        "label": "Azione della routine",
        "answer": "Seguire il ramo di errore",
        "accept": [],
        "numeric": false,
        "choices": [
          "Comporre subito il PA con il campo alto",
          "Seguire il ramo di errore",
          "Usare il frame zero"
        ],
        "hint": "La decisione dipende esclusivamente da valid."
      }
    ],
    "steps": [
      "42 in binario è 101010. Il prodotto logico 42 & 1 dà zero, il valore del bit di validità.",
      "Il campo alto vale 42 >> 1 = 21. La voce è invalida e quei bit possono contenere dati residui. La routine termina sul ramo di errore.",
      "TEST RAX, 1 imposta ZF a 1 quando il bit di validità è zero. JZ trasferisce il controllo al ramo di errore. Un test sull’intera parola avrebbe accettato 42."
    ],
    "variants": [
      {
        "prompt": "Nel formato PTE = 2 × PFN + valid il frame zero può ospitare dati. Una routine decide il successo dopo aver fatto SHR sulla PTE e poi controlla se il PFN è diverso da zero. Costruisci la più piccola PTE valida che la routine respinge per errore e indica l’ordine corretto dei controlli.",
        "fields": [
          {
            "label": "Prima PTE valida respinta",
            "answer": "1",
            "numeric": true,
            "hint": "Un frame zero ha tutti i bit alti a zero."
          },
          {
            "label": "Ordine corretto",
            "answer": "Testare il bit zero prima di estrarre il PFN",
            "choices": [
              "Testare il PFN e poi la PTE",
              "Testare il bit zero prima di estrarre il PFN",
              "Richiedere un PFN positivo"
            ],
            "hint": "Il bit di validità viene eliminato dallo shift."
          }
        ],
        "steps": [
          "Per ottenere la voce valida più piccola si prende PFN = 0 e valid = 1. La PTE vale uno.",
          "Lo shift elimina l’unico bit a uno e produce zero. La routine respinge una mappatura effettivamente valida.",
          "Il test va eseguito sul bit meno significativo della voce grezza. Quando vale uno si può estrarre il PFN, anche se questo ha valore zero."
        ],
        "quadro": [
          {
            "titolo": "Ipotesi",
            "celle": [
              [
                "Accetta se",
                "PFN ≠ 0"
              ],
              [
                "PTE",
                "2 × PFN + valid"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Caso limite",
            "celle": [
              [
                "PFN",
                "0"
              ],
              [
                "Valid",
                "1"
              ],
              [
                "PTE",
                "1"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Falso rifiuto",
            "celle": [
              [
                "PTE >> 1",
                "0"
              ],
              [
                "Controllo",
                "respinge"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Riparazione",
            "celle": [
              [
                "Prima",
                "PTE AND 1"
              ],
              [
                "Poi",
                "PTE >> 1"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          }
        ]
      }
    ]
  },
  {
    "id": "6.3.14",
    "title": "Localizzare una PTE fisica",
    "kind": "campi",
    "skill": "Calcolare l’indirizzo di una voce da base e VPN",
    "principio": "L’indice di una tabella lineare è un numero di voci. Per raggiungere la PTE si converte l’indice in byte e si aggiunge la base fisica della tabella.",
    "prompt": "Una tabella lineare fisica inizia a 0x180000 e contiene voci di otto byte. Il numero di pagina richiesto è 0x36. Calcola lo spostamento nella tabella e l’indirizzo fisico della voce, in entrambe le basi.",
    "fields": [
      {
        "label": "Spostamento in byte",
        "answer": "432",
        "accept": [],
        "numeric": true,
        "hint": "Converti l’indice esadecimale e moltiplicalo per la dimensione della voce."
      },
      {
        "label": "Indirizzo della PTE, in esadecimale",
        "answer": "0x1801B0",
        "accept": [],
        "numeric": true,
        "hint": "Aggiungi lo spostamento alla base mantenendo la stessa base numerica."
      },
      {
        "label": "Indirizzo della PTE, in decimale",
        "answer": "1573296",
        "accept": [],
        "numeric": true,
        "hint": "Parti dalla base espressa in decimale e aggiungi lo stesso spostamento."
      }
    ],
    "steps": [
      "0x36 corrisponde a 54. Per raggiungere la voce occorrono 54 × 8 = 432 byte = 0x1B0.",
      "Il calcolo in esadecimale dà 0x180000 + 0x1B0 = 0x1801B0. In decimale equivale a 1572864 + 432 = 1573296.",
      "L’indirizzo ottenuto identifica la PTE. Una lettura della voce fornisce i campi da cui ricavare il frame del dato."
    ],
    "variants": [
      {
        "prompt": "Una tabella lineare ha base fisica 0x240000 e voci da otto byte. Il monitor segnala che l’ultimo caricamento è partito da 0x240148. Ricava la VPN scelta. Se il monitor avesse registrato 0x24014B, quell’indirizzo sarebbe l’inizio di una voce o un byte interno? Indica lo spostamento rispetto all’inizio della voce.",
        "fields": [
          {
            "label": "VPN",
            "answer": "41",
            "numeric": true,
            "hint": "Sottrai la base e dividi per otto."
          },
          {
            "label": "Posizione di 0x24014B",
            "answer": "Byte interno",
            "choices": [
              "Inizio di una voce",
              "Byte interno"
            ],
            "hint": "Calcola il resto modulo otto dalla base."
          },
          {
            "label": "Spostamento interno",
            "answer": "3",
            "numeric": true,
            "hint": "Confronta i due indirizzi consecutivi nel record."
          }
        ],
        "steps": [
          "0x148 equivale a 328 byte. Dividendo per otto si ottiene 41 con resto zero. Il carico cade all’inizio della voce 41.",
          "Per 0x24014B la differenza cresce a 331 byte. Il quoziente resta 41 e il resto diventa 3.",
          "Il byte con offset 3 è il quarto byte della voce, poiché il primo ha offset zero. Un caricamento di voce allineato dovrebbe cominciare tre byte prima."
        ],
        "quadro": [
          {
            "titolo": "Monitor",
            "celle": [
              [
                "Base",
                "0x240000"
              ],
              [
                "Carico",
                "0x240148"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Indice ricostruito",
            "celle": [
              [
                "Differenza",
                "0x148"
              ],
              [
                "VPN",
                "41"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Secondo indirizzo",
            "celle": [
              [
                "Differenza",
                "331 B"
              ],
              [
                "Resto modulo 8",
                "3"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Interpretazione",
            "celle": [
              [
                "Voce",
                "41"
              ],
              [
                "Byte interno",
                "3"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ]
      }
    ]
  },
  {
    "id": "6.3.15",
    "title": "Due letture dipendenti",
    "kind": "campi",
    "skill": "Calcolare la latenza lungo la dipendenza",
    "principio": "La PTE è la voce della tabella che fornisce il numero del frame del dato. Il secondo accesso deve quindi attendere il risultato del primo: nel modello seriale le due letture avvengono una dopo l’altra e le durate si sommano. Le durate sono espresse in ns, nanosecondi, ciascuno pari a un miliardesimo di secondo. Se la traduzione è già disponibile, rimangono il tempo per consultarla e quello per leggere il dato.",
    "prompt": "Nel modello a un livello, ogni accesso alla RAM richiede 75 ns. Il processore deve leggere prima la PTE e poi il dato. Entrambi sono residenti. TLB, cache e altri costi sono esclusi. Calcola la latenza complessiva.",
    "fields": [
      {
        "label": "Accessi alla RAM",
        "answer": "2",
        "accept": [],
        "numeric": true,
        "hint": "Conta separatamente la lettura della mappatura e quella del dato."
      },
      {
        "label": "Latenza complessiva in ns",
        "answer": "150",
        "accept": [],
        "numeric": true,
        "hint": "La seconda lettura usa il frame restituito dalla prima."
      },
      {
        "label": "Dipendenza fra le due letture",
        "answer": "Per indirizzare il dato occorre prima conoscere il PFN",
        "accept": [],
        "numeric": false,
        "choices": [
          "La lettura del dato fornisce la VPN",
          "Le due letture possono partire insieme",
          "Per indirizzare il dato occorre prima conoscere il PFN"
        ],
        "hint": "Quale informazione manca per comporre il PA del dato?"
      }
    ],
    "steps": [
      "Tra 0 e 75 ns viene letta la PTE all’indirizzo calcolato dalla base e dalla VPN. La PTE fornisce il PFN.",
      "Il processore combina PFN e offset. La lettura del dato si svolge tra 75 e 150 ns.",
      "La dipendenza sul PFN rende seriali i due accessi. Il tempo totale in questo modello è 75 + 75 = 150 ns."
    ],
    "variants": [
      {
        "prompt": "In due misure il tempo di accesso alla RAM è 58 ns. Una traduzione a un livello con tabella residente richiede 116 ns, incluso il dato. Nella seconda misura la traduzione è già disponibile e il dato è in RAM. Il cronometro misura 70 ns complessivi. Le fasi sono seriali. Ricava la durata della consultazione della traduzione pronta e il risparmio rispetto alla prima misura.",
        "fields": [
          {
            "label": "Tempo di consultazione (ns)",
            "answer": "12",
            "numeric": true,
            "hint": "Scorpora dai 70 ns il tempo di lettura del dato."
          },
          {
            "label": "Risparmio (ns)",
            "answer": "46",
            "numeric": true,
            "hint": "Confronta le due misure che includono lo stesso dato."
          }
        ],
        "steps": [
          "Nel primo percorso le due letture sono dipendenti. I 116 ns corrispondono a 58 ns per la voce e 58 ns per il dato.",
          "Nel percorso corto il dato richiede ancora 58 ns. Il resto, pari a 70 − 58 = 12 ns, misura la ricerca della traduzione già disponibile.",
          "Il guadagno è 116 − 70 = 46 ns. La differenza coincide con la lettura di voce evitata meno il tempo che è occorso per consultare la traduzione pronta."
        ],
        "quadro": [
          {
            "titolo": "Due misure",
            "celle": [
              [
                "Tabella",
                "116 ns"
              ],
              [
                "Traduzione pronta",
                "70 ns"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Percorso lungo",
            "celle": [
              [
                "PTE",
                "58 ns"
              ],
              [
                "Dato",
                "58 ns"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Costo nascosto",
            "celle": [
              [
                "Misura",
                "70 ns"
              ],
              [
                "Dato",
                "58 ns"
              ],
              [
                "Ricerca",
                "12 ns"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Risparmio",
            "celle": [
              [
                "Differenza",
                "46 ns"
              ],
              [
                "Verifica",
                "58 − 12"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          }
        ]
      }
    ]
  },
  {
    "id": "6.3.16",
    "title": "Cambiare lo spazio di indirizzamento",
    "kind": "campi",
    "skill": "Selezionare la radice e il contesto della TLB",
    "principio": "Un processo è un programma in esecuzione con il proprio spazio di indirizzi. Nel cambio di contesto il processore passa da un processo a un altro e il registro PTBR deve indicare la tabella del nuovo spazio. La TLB conserva alcune traduzioni recenti: l’ASID, identificatore dello spazio, permette di associare ciascuna voce al processo corretto. Se la chiave usa soltanto la VPN, invalidare le voci precedenti significa renderle inutilizzabili prima della nuova richiesta, così la ricerca consulterà la tabella corretta.",
    "prompt": "Il processo P lascia la CPU a Q. Per la VPN 3, la tabella di P punta al frame 9 e quella di Q al frame 17. La TLB contiene ancora una traduzione di P. Scegli la radice da installare nel registro di base delle tabelle (PTBR) e come gestire il cambio di contesto.",
    "fields": [
      {
        "label": "Contenuto del PTBR per Q",
        "answer": "Base della tabella di Q",
        "accept": [],
        "numeric": false,
        "choices": [
          "Indirizzo del suo frame dati",
          "Base della tabella di Q",
          "Base della tabella di P"
        ],
        "hint": "Il PTBR identifica la tabella usata dal percorso di traduzione."
      },
      {
        "label": "Gestione delle traduzioni già in TLB",
        "answer": "Distinguere gli spazi con un identificatore valido oppure invalidare le voci del contesto precedente",
        "accept": [],
        "numeric": false,
        "choices": [
          "Distinguere gli spazi con un identificatore valido oppure invalidare le voci del contesto precedente",
          "Conservare ogni voce usando solo la VPN come chiave",
          "Usare sempre la traduzione più recente di P"
        ],
        "hint": "La stessa VPN ha qui due traduzioni. Occorre distinguere i proprietari delle voci."
      },
      {
        "label": "Frame atteso quando è in esecuzione Q",
        "answer": "17",
        "accept": [],
        "numeric": true,
        "hint": "Segui la mappatura associata alla radice del processo che ha ottenuto la CPU."
      }
    ],
    "steps": [
      "La VPN 3 appartiene sia allo spazio di P sia a quello di Q. Nel primo spazio identifica il frame 9. Nel secondo identifica il frame 17.",
      "Il sistema seleziona nel PTBR la radice della tabella di Q. Una ricerca in tale tabella segue la mappatura di Q.",
      "Una TLB indicizzata soltanto dalla VPN potrebbe ancora produrre il frame 9. Un identificatore di spazio di indirizzamento valido distingue le voci di P da quelle di Q. In sua assenza, il cambio di contesto richiede l’invalidazione appropriata.",
      "Durante l’esecuzione di Q, sia una ricerca in tabella sia una traduzione recuperata dalla TLB devono portare al frame 17."
    ],
    "variants": [
      {
        "prompt": "Q subentra a P e il registro PTBR contiene già la base corretta di Q. La vecchia TLB è indicizzata dalla sola VPN. Per VPN 6, P usava il frame 4 e Q richiede il frame 22. Dopo il cambio la prima lettura raggiunge ancora il frame 4. Quale stato spiega l’errore? Quale azione, fra quelle proposte, ripristina l’isolamento prima della lettura?",
        "fields": [
          {
            "label": "Origine del frame 4",
            "answer": "Voce TLB ereditata da P",
            "choices": [
              "Voce TLB ereditata da P",
              "Contenuto del PTBR di Q",
              "Offset interno della pagina"
            ],
            "hint": "La tabella di Q è corretta. Cerca il percorso che può evitarne la consultazione."
          },
          {
            "label": "Rimedio sul sistema descritto",
            "answer": "Invalidare la voce obsoleta prima del riuso",
            "choices": [
              "Riscrivere lo stesso PTBR",
              "Invalidare la voce obsoleta prima del riuso",
              "Aumentare l’offset di uno"
            ],
            "hint": "La TLB descritta ignora l’identità del processo."
          }
        ],
        "steps": [
          "Una ricerca nella tabella fornirebbe il frame 22. Il valore 4 corrisponde invece al precedente spazio di P.",
          "La voce di P soddisfa ancora il confronto sulla VPN. Finché viene usata, il processore evita il percorso che consultava la radice corretta.",
          "Invalidata la voce prima del nuovo accesso, il miss richiede la tabella di Q, che restituisce 22. In un’architettura diversa si potrebbero distinguere le chiavi dei due spazi con identificatori appropriati."
        ],
        "quadro": [
          {
            "titolo": "Cambio",
            "celle": [
              [
                "PTBR",
                "radice Q"
              ],
              [
                "VPN",
                "6"
              ],
              [
                "PA osservato",
                "nel frame 4"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Esame della radice",
            "celle": [
              [
                "Tabella Q",
                "frame 22"
              ],
              [
                "Valore osservato",
                "frame 4"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Origine",
            "celle": [
              [
                "Chiave in TLB",
                "solo VPN"
              ],
              [
                "Vecchia voce",
                "6 → 4"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Rimedio",
            "celle": [
              [
                "Prima",
                "invalidare"
              ],
              [
                "Nuovo walk",
                "frame 22"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ]
      }
    ]
  },
  {
    "id": "6.3.17",
    "title": "Traduzione completa con pagine da 4 KiB",
    "kind": "assembly",
    "skill": "Scrivere un traduttore con controllo di validità",
    "principio": "Il contratto descrive gli ingressi della routine, il risultato e i registri da conservare. Qui RDI contiene il VA, RSI la base della tabella e RAX deve restituire il PA oppure la sentinella di errore. Una sentinella è una configurazione convenuta, in questo caso 64 bit a uno. Dopo il carico, TEST del bit basso e il flag ZF stabiliscono la validità; SHR di un bit estrae poi il PFN dalla PTE. Solo sul ramo valido il frame viene moltiplicato per i byte di pagina e composto con l’offset.",
    "prompt": "Scrivi il frammento generale per pagine da 4096 byte. RDI contiene il VA e RSI la base di una tabella leggibile con voci da otto byte. Ogni PTE è (PFN << 1) | valid, con PFN a 14 bit. Consegna in RAX il PA della mappatura valida oppure 0xFFFFFFFFFFFFFFFF sul ramo di errore. Puoi usare RCX e modificare i flag. Conserva RDI e RSI. Traccia poi VA 0x3033 con PTE 35 e PTE 34.",
    "fields": [
      {
        "label": "Risultato con PTE 35",
        "answer": "0x11033",
        "accept": [],
        "numeric": true,
        "hint": "Separa la VPN, controlla il bit 0, ricava il PFN e aggiungi l’offset alla base del frame."
      },
      {
        "label": "RAX sul ramo di errore",
        "answer": "0xFFFFFFFFFFFFFFFF",
        "accept": [
          "18446744073709551615",
          "-1"
        ],
        "numeric": true,
        "hint": "Il contratto richiede un valore di 64 bit con ogni bit a uno."
      }
    ],
    "steps": [
      "La divisione di 0x3033 per 4096 dà VPN 3 e resto 51 = 0x33. La voce selezionata comincia 3 × 8 = 24 byte dopo la base della tabella.",
      "Con PTE 35, il bit 0 vale 1. Lo shift di un bit restituisce PFN 17. La base del frame è 17 × 4096 = 0x11000. La maschera 0xFFF estrae 0x33 dal VA. OR compone 0x11033 = 69683.",
      "Con PTE 34, il bit 0 vale 0. TEST seguito da JZ porta al ramo di errore. MOV RAX, -1 scrive tutti i 64 bit a uno. Il salto dopo il percorso valido scavalca quel ramo."
    ],
    "code": "mov rax, rdi\nshr rax, 12\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 12\nmov rcx, rdi\nand ecx, 4095\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
    "bits": 12,
    "va": "0x3033",
    "pte": 35,
    "invalidPte": 34,
    "variants": [
      {
        "prompt": "Per pagine da 4096 byte, RDI contiene il VA a 32 bit e RSI la base di una tabella leggibile con voci di otto byte. La voce contiene 2 × PFN + valid, con PFN a 14 bit. Scrivi una routine generale che restituisca in RAX il PA oppure la sentinella 0xFFFFFFFFFFFFFFFF per una voce invalida. Conserva RDI e RSI. Nel caso della prova il VA è 0x202B, la base è 0x200000 e la PTE valida vale 23. Una routine candidata usa la PTE valida direttamente come PFN. Indica il PA errato, localizza l’operazione mancante e ricava il PA corretto. Verifica nell’editor anche il ramo di errore previsto dal contratto.",
        "fields": [
          {
            "label": "PA della routine difettosa",
            "answer": "94251",
            "numeric": true,
            "hint": "Usa 23 come frame e conserva l’offset 0x2B."
          },
          {
            "label": "Operazione mancante",
            "answer": "SHR di un bit dopo il test",
            "choices": [
              "SHR di un bit dopo il test",
              "SHL di un bit prima del test",
              "ADD di una pagina al VA"
            ],
            "hint": "La PTE codifica insieme frame e validità."
          },
          {
            "label": "PA corretto",
            "answer": "45099",
            "numeric": true,
            "hint": "Il PFN è il quoziente intero della PTE per due."
          }
        ],
        "steps": [
          "Trattando la voce 23 come un numero di frame si ottiene 23 × 4096 + 43 = 0x1702B. La cifra di validità è ancora incorporata nel numero.",
          "Il bit zero autorizza il ramo valido. Uno shift logico a destra di un bit estrae poi il frame 11.",
          "Il frame 11 spostato di dodici bit, unito all’offset 43, dà 0xB02B. Nel ramo invalido la routine restituisce tutti gli uno in RAX e lascia intatti gli ingressi."
        ],
        "code": "mov rax, rdi\nshr rax, 12\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 12\nmov rcx, rdi\nand ecx, 4095\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
        "bits": 12,
        "va": "0x202B",
        "pte": 23,
        "invalidPte": 22,
        "family": "walker",
        "pfn": 11,
        "base": "0x200000",
        "quadro": [
          {
            "titolo": "Campione",
            "celle": [
              [
                "VA",
                "0x202B"
              ],
              [
                "PTE",
                "23"
              ],
              [
                "Offset",
                "0x2B"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Uscita difettosa",
            "celle": [
              [
                "Frame usato",
                "23"
              ],
              [
                "PA",
                "0x1702B"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Decodifica",
            "celle": [
              [
                "Valid",
                "1"
              ],
              [
                "PFN",
                "11"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Esiti",
            "celle": [
              [
                "PA valido",
                "0xB02B"
              ],
              [
                "PTE pari",
                "sentinella"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ]
      }
    ],
    "family": "walker",
    "pfn": 17,
    "base": "0x200000"
  },
  {
    "id": "6.3.18",
    "title": "Una mappatura valida nel frame zero",
    "kind": "assembly",
    "skill": "Separare frame zero e fallimento",
    "principio": "Una pagina può essere mappata al frame fisico numero zero. La validità dipende dal bit dedicato e può coesistere con un PFN nullo.",
    "prompt": "Ripara il controllo di validità del traduttore. Il prototipo esegue TEST RAX, RAX sulla voce grezza e salta all’errore soltanto se tutta la voce vale zero. Con pagine da 1024 byte e RDI = 0xC33, confronta la PTE 1 con la PTE 14. Individua quella che provoca una falsa accettazione e scegli il test sostitutivo. Nell’editor applica la correzione. La routine deve conservare RDI e RSI, restituendo il PA oppure la sentinella a 64 bit.",
    "fields": [
      {
        "label": "PTE accettata per errore",
        "answer": "14",
        "numeric": true,
        "hint": "Fra le voci proposte cerca una parola diversa da zero che abbia bit basso nullo."
      },
      {
        "label": "Istruzione corretta",
        "answer": "TEST RAX, 1",
        "choices": [
          "TEST RAX, 1",
          "CMP RAX, 0",
          "TEST RAX, RAX"
        ],
        "hint": "La decisione riguarda un bit della PTE ancora grezza."
      },
      {
        "label": "PA per PTE 1",
        "answer": "0x33",
        "numeric": true,
        "hint": "Il frame zero lascia come risultato il solo offset."
      }
    ],
    "steps": [
      "Le due parole sono entrambe diverse da zero. La PTE 14 ha però bit basso zero, quindi il suo ramo corretto è l’errore. Il test su tutta la parola la accetta per errore.",
      "TEST RAX, 1 porta nel flag di zero l’esito relativo al solo bit di validità, lasciando la voce integra. A quel punto JZ sceglie correttamente il ramo di errore.",
      "Per PTE 1 il test autorizza la traduzione e lo shift fornisce frame zero. L’offset di 0xC33 nella pagina da 1024 byte vale 0x33, che è anche il PA. La routine deve accettare questo caso e respingere la PTE 14."
    ],
    "code": "mov rax, rdi\nshr rax, 10\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
    "bits": 10,
    "va": "0xC33",
    "pte": 1,
    "invalidPte": 14,
    "variants": [
      {
        "prompt": "Per pagine da 1024 byte, RDI contiene il VA a 32 bit e RSI la base di una tabella leggibile con voci di otto byte. La voce contiene 2 × PFN + valid, con PFN a 14 bit. Scrivi una routine generale che restituisca in RAX il PA oppure la sentinella 0xFFFFFFFFFFFFFFFF per una voce invalida. Conserva RDI e RSI. Nel caso della prova il VA è 0x140A, la base è 0x200000 e la PTE valida vale 19. Il collaudo comprende anche due altre voci per lo stesso VA, PTE = 1 e PTE = 0. Un revisore propone di trattarle allo stesso modo poiché il campo frame vale zero in entrambe. Ricava i due risultati a 64 bit e indica quale informazione li distingue.",
        "fields": [
          {
            "label": "RAX per PTE 1",
            "answer": "10",
            "numeric": true,
            "hint": "La base del frame zero è zero e l’offset del VA è dieci."
          },
          {
            "label": "RAX per PTE 0",
            "answer": "0xFFFFFFFFFFFFFFFF",
            "numeric": true,
            "hint": "Il ramo di errore scrive una sentinella su tutti i bit."
          },
          {
            "label": "Informazione decisiva",
            "answer": "Il bit basso della voce grezza",
            "choices": [
              "Il bit basso della voce grezza",
              "La base della tabella",
              "Il segno del VA"
            ],
            "hint": "Confronta le due voci prima dello shift."
          }
        ],
        "steps": [
          "Le due voci, dopo lo shift di un bit, forniscono entrambe PFN = 0. Occorre quindi recuperare la validità dal bit basso prima dello shift.",
          "Per PTE 1 il bit basso vale uno. Con pagine da 1024 byte l’offset di 0x140A è 10, dunque l’indirizzo fisico restituito è 10.",
          "Per PTE 0 manca la validità. La routine restituisce 0xFFFFFFFFFFFFFFFF. Il test sul solo frame avrebbe confuso questo caso con quello precedente."
        ],
        "code": "mov rax, rdi\nshr rax, 10\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
        "bits": 10,
        "va": "0x140A",
        "pte": 19,
        "invalidPte": 18,
        "family": "walker",
        "pfn": 9,
        "base": "0x200000",
        "quadro": [
          {
            "titolo": "Confronto",
            "celle": [
              [
                "VA",
                "0x140A"
              ],
              [
                "PTE A",
                "1"
              ],
              [
                "PTE B",
                "0"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Campo condiviso",
            "celle": [
              [
                "PFN A",
                "0"
              ],
              [
                "PFN B",
                "0"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Frame zero valido",
            "celle": [
              [
                "Bit",
                "1"
              ],
              [
                "Offset",
                "10"
              ],
              [
                "PA",
                "10"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          },
          {
            "titolo": "Voce invalida",
            "celle": [
              [
                "Bit",
                "0"
              ],
              [
                "RAX",
                "tutti uno"
              ]
            ],
            "nota": "",
            "tipo": "confronto"
          }
        ],
        "starter": ""
      }
    ],
    "family": "walker",
    "pfn": 0,
    "base": "0x200000",
    "quadro": [
      {
        "titolo": "Due campioni",
        "celle": [
          [
            "PTE A",
            "1"
          ],
          [
            "PTE B",
            "14"
          ],
          [
            "Test",
            "tutta la parola"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Falso successo",
        "celle": [
          [
            "PTE 14",
            "1110₂"
          ],
          [
            "Bit valido",
            "0"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Modifica locale",
        "celle": [
          [
            "Test",
            "RAX AND 1"
          ],
          [
            "Salto",
            "se zero"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Controllo positivo",
        "celle": [
          [
            "PTE 1",
            "frame 0 valido"
          ],
          [
            "Offset",
            "0x33"
          ],
          [
            "PA",
            "0x33"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      }
    ],
    "starter": "mov rax, rdi\nshr rax, 10\nmov rax, [rsi + rax*8]\ntest rax, rax\njz .Linvalid\nshr rax, 1\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:"
  },
  {
    "id": "6.3.19",
    "title": "La voce oltre la fine della tabella",
    "kind": "assembly",
    "skill": "Controllare la precondizione di leggibilità",
    "principio": "Un array è una successione di elementi uguali numerati da zero. Se contiene N voci, gli indici validi vanno da zero a N − 1 e la fine esclusiva è il primo byte successivo all’ultima voce. Il chiamante è il programma che richiede la traduzione: conoscendo la lunghezza deve controllare VPN < N prima del carico. La routine chiamata esamina invece il bit di validità di una voce già leggibile. Limite dell’array e validità del contenuto proteggono due passaggi diversi.",
    "prompt": "Esamina il controllo del chiamante prima di usare il traduttore. La tabella ha sei voci indicizzate da zero e usa pagine da 2048 byte. Il chiamante propone di ammettere VPN ≤ 6. Costruisci il primo VA che supera il limite pur soddisfacendo quella regola e scegli la condizione corretta. Il traduttore già presente nell’editor va verificato su tabelle leggibili: il campione della routine è RDI = 0x1833 e RSI punta a una tabella che comprende la voce richiesta.",
    "fields": [
      {
        "label": "Primo VA accettato indebitamente",
        "answer": "0x3000",
        "numeric": true,
        "hint": "Cerca il primo byte della pagina con indice pari al numero di voci."
      },
      {
        "label": "Condizione per entrare nella routine",
        "answer": "VPN < numero di voci",
        "choices": [
          "VPN ≤ numero di voci",
          "VPN < numero di voci",
          "Offset < numero di voci"
        ],
        "hint": "Una tabella di lunghezza sei contiene gli indici da zero a cinque."
      },
      {
        "label": "Dove applicare il controllo",
        "answer": "Nel chiamante, prima di leggere la PTE",
        "choices": [
          "Dopo il test del bit valido",
          "Dopo il caricamento della PTE",
          "Nel chiamante, prima di leggere la PTE"
        ],
        "hint": "Il frammento riceve soltanto VA e base, e il suo contratto presuppone una voce leggibile."
      }
    ],
    "steps": [
      "I sei indici disponibili sono 0, 1, 2, 3, 4 e 5. Con VPN 6 la condizione proposta consente ancora di entrare, benché l’indice sia esterno.",
      "La prima posizione della pagina 6 è 6 × 2048 = 12288, ossia 0x3000. Tutti i VA più piccoli appartengono a una delle prime sei pagine.",
      "Il chiamante, che conosce la lunghezza, deve rifiutare l’indice prima del carico. L’editor verifica separatamente il frammento con voci leggibili, comprese quelle presenti in memoria che codificano validità zero."
    ],
    "code": "mov rax, rdi\nshr rax, 11\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
    "bits": 11,
    "va": "0x1833",
    "pte": 35,
    "invalidPte": 34,
    "variants": [
      {
        "prompt": "Per pagine da 2048 byte, RDI contiene il VA a 32 bit e RSI la base di una tabella leggibile con voci di otto byte. La voce contiene 2 × PFN + valid, con PFN a 14 bit. Scrivi una routine generale che restituisca in RAX il PA oppure la sentinella 0xFFFFFFFFFFFFFFFF per una voce invalida. Conserva RDI e RSI. Nel caso della prova il VA è 0x201D, la base è 0x200000 e la PTE valida vale 25. Prima di invocare la routine, il chiamante deve accertarsi che la voce sia compresa nell’array. Per il VA della prova, trova la lunghezza minima della tabella in voci e l’indirizzo esclusivo di fine array a tale lunghezza. Nell’editor usa poi il contratto di tabella leggibile.",
        "fields": [
          {
            "label": "Numero minimo di voci",
            "answer": "5",
            "numeric": true,
            "hint": "L’indice zero designa la prima voce."
          },
          {
            "label": "Fine esclusiva della tabella",
            "answer": "2097192",
            "numeric": true,
            "hint": "Aggiungi alla base il numero totale di voci moltiplicato per otto."
          }
        ],
        "steps": [
          "0x201D diviso per 2048 dà quoziente 4. Un array di quattro elementi fermerebbe il chiamante prima del caricamento, perché ammette soltanto gli indici da zero a tre.",
          "Per rendere accessibile la voce 4 occorrono cinque voci. Esse occupano 5 × 8 = 40 byte.",
          "Gli otto byte della voce vanno da 0x200020 a 0x200027. Il primo byte esterno alla tabella minima è 0x200028. Una volta verificata la lunghezza, il frammento può caricare la PTE e controllarne il bit di validità."
        ],
        "code": "mov rax, rdi\nshr rax, 11\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
        "bits": 11,
        "va": "0x201D",
        "pte": 25,
        "invalidPte": 24,
        "family": "walker",
        "pfn": 12,
        "base": "0x200000",
        "quadro": [
          {
            "titolo": "Campione",
            "celle": [
              [
                "VA",
                "0x201D"
              ],
              [
                "Pagina",
                "2048 B"
              ],
              [
                "Base",
                "0x200000"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Indice richiesto",
            "celle": [
              [
                "VPN",
                "4"
              ],
              [
                "Voce",
                "quinta"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Lunghezza minima",
            "celle": [
              [
                "Minimo",
                "5 voci"
              ],
              [
                "Capienza",
                "40 B"
              ]
            ],
            "nota": "",
            "tipo": "stato"
          },
          {
            "titolo": "Estremi",
            "celle": [
              [
                "Voce 4",
                "0x200020"
              ],
              [
                "Fine esclusiva",
                "0x200028"
              ]
            ],
            "nota": "",
            "tipo": "sequenza"
          }
        ],
        "starter": ""
      }
    ],
    "family": "walker",
    "pfn": 17,
    "base": "0x200000",
    "quadro": [
      {
        "titolo": "Limite dichiarato",
        "celle": [
          [
            "Lunghezza",
            "6 voci"
          ],
          [
            "Pagina",
            "2048 B"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Primo indice esterno",
        "celle": [
          [
            "Ultimo indice",
            "5"
          ],
          [
            "Primo esterno",
            "6"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Controesempio minimo",
        "celle": [
          [
            "VPN",
            "6"
          ],
          [
            "Offset",
            "0"
          ],
          [
            "VA",
            "0x3000"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Confine del contratto",
        "celle": [
          [
            "Chiamante",
            "VPN < 6"
          ],
          [
            "Routine chiamata",
            "tabella leggibile"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      }
    ],
    "starter": "mov rax, rdi\nshr rax, 11\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:"
  },
  {
    "id": "6.3.20",
    "title": "La larghezza della sentinella",
    "kind": "assembly",
    "skill": "Restituire una sentinella a 64 bit",
    "principio": "RAX è un registro x86-64 da 64 bit; EAX ne indica i 32 bit inferiori. Scrivere EAX azzera anche la metà alta di RAX. MOV copia il valore nella destinazione scritta per prima; −1, rappresentato in complemento a due, occupa tutti i bit a uno alla larghezza scelta. Per riconoscere una sentinella di 64 uno il controllo deve esaminare l’intero RAX, poiché la sola metà bassa coincide dopo MOV EAX, −1 e MOV RAX, −1.",
    "prompt": "Correggi esclusivamente il ramo di errore del listato. Dovrebbe restituire sessantaquattro bit a uno quando il bit di validità della PTE vale zero. Il programmatore ha scritto MOV EAX, -1. Ricostruisci il RAX effettivo come due metà da 32 bit e ripara l’istruzione nell’editor. Con pagine da 8192 byte il ramo valido fornito combina già frame e offset. Conserva RDI e RSI.",
    "fields": [
      {
        "label": "Metà alta prodotta dal listato difettoso",
        "answer": "0",
        "numeric": true,
        "hint": "Una scrittura a EAX estende il risultato verso RAX azzerando la metà superiore."
      },
      {
        "label": "Metà bassa prodotta",
        "answer": "0xFFFFFFFF",
        "numeric": true,
        "hint": "Considera la rappresentazione di −1 su 32 bit."
      },
      {
        "label": "Riparazione del ramo di errore",
        "answer": "MOV RAX, -1",
        "choices": [
          "MOV EAX, -1",
          "MOV RAX, -1",
          "MOV EAX, 0"
        ],
        "hint": "Il contratto richiede la larghezza intera del registro di ritorno."
      }
    ],
    "steps": [
      "La scrittura a EAX colloca la rappresentazione di −1 su trentadue bit nella metà bassa del registro. Le sue otto cifre esadecimali sono tutte F.",
      "Nella modalità a 64 bit la scrittura in EAX azzera la metà alta di RAX. Il valore effettivamente restituito è quindi 0x00000000FFFFFFFF.",
      "Usando MOV RAX, -1 si scrivono entrambi i campi. Il banco verifica la sentinella completa sul ramo invalido e il PA sul ramo valido, insieme alla conservazione di RDI e RSI."
    ],
    "code": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 13\nmov rcx, rdi\nand ecx, 8191\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
    "bits": 13,
    "va": "0x6033",
    "pte": 35,
    "invalidPte": 34,
    "variants": [
      {
        "prompt": "Per pagine da 8192 byte, RDI contiene il VA a 32 bit e RSI la base di una tabella leggibile con voci di otto byte. La voce contiene 2 × PFN + valid, con PFN a 14 bit. Scrivi una routine generale che restituisca in RAX il PA oppure la sentinella 0xFFFFFFFFFFFFFFFF per una voce invalida. Conserva RDI e RSI. Nel caso della prova il VA è 0x4021, la base è 0x200000 e la PTE valida vale 27. Un test confronta soltanto EAX con 0xFFFFFFFF quando il frammento segue il ramo invalido. Un programma candidato usa MOV EAX, -1 invece di MOV RAX, -1. Stabilisci se il test lo accetterebbe, poi indica quali 32 bit superiori misurare per distinguerlo dalla routine corretta e il loro valore atteso sul ramo valido del campione.",
        "fields": [
          {
            "label": "Verdetto del test sui 32 bit bassi",
            "answer": "Accetta entrambe le routine",
            "choices": [
              "Accetta entrambe le routine",
              "Respinge entrambe",
              "Respinge solo il candidato"
            ],
            "hint": "Entrambe le scritture fissano a uno tutti i bit di EAX."
          },
          {
            "label": "Metà alta corretta sul ramo invalido",
            "answer": "0xFFFFFFFF",
            "numeric": true,
            "hint": "La sentinella richiesta contiene sessantaquattro uno."
          },
          {
            "label": "Metà alta sul ramo valido",
            "answer": "0",
            "numeric": true,
            "hint": "Il PFN del campione è 13 e il PA occupa meno di 32 bit."
          }
        ],
        "steps": [
          "Entrambe le scritture lasciano EAX uguale a 0xFFFFFFFF. Il test proposto accetta anche il candidato che ha azzerato la metà alta di RAX.",
          "Sul ramo invalido si devono confrontare tutti i 64 bit. La metà alta attesa è 0xFFFFFFFF, mentre il candidato vi lascia zero.",
          "Nel caso valido la voce 27 identifica il frame 13. La base è 13 × 8192 = 0x1A000 e l’offset è 0x21. Il PA 0x1A021 ha metà alta zero. Un test sui due rami controlla quindi entrambe le configurazioni."
        ],
        "code": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 13\nmov rcx, rdi\nand ecx, 8191\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
        "bits": 13,
        "va": "0x4021",
        "pte": 27,
        "invalidPte": 26,
        "family": "walker",
        "pfn": 13,
        "base": "0x200000",
        "figuraCorrezione": {
          "tipo": "sentinella"
        },
        "starter": "",
        "quadro": null
      }
    ],
    "family": "walker",
    "pfn": 17,
    "base": "0x200000",
    "quadro": [
      {
        "titolo": "Ramo da verificare",
        "celle": [
          [
            "PTE",
            "pari"
          ],
          [
            "Istruzione",
            "MOV EAX, −1"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Parte scritta",
        "celle": [
          [
            "Bit 31…0",
            "FFFFFFFF"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      },
      {
        "titolo": "Estensione implicita",
        "celle": [
          [
            "Bit 63…32",
            "00000000"
          ],
          [
            "Bit 31…0",
            "FFFFFFFF"
          ]
        ],
        "tipo": "confronto",
        "nota": ""
      },
      {
        "titolo": "Riparazione",
        "celle": [
          [
            "Destinazione",
            "RAX"
          ],
          [
            "Alto",
            "FFFFFFFF"
          ],
          [
            "Basso",
            "FFFFFFFF"
          ]
        ],
        "tipo": "stato",
        "nota": ""
      }
    ],
    "starter": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 13\nmov rcx, rdi\nand ecx, 8191\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov eax, -1\n.Ldone:"
  }
];
