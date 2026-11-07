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
        "prompt": "Un indirizzo virtuale vale 0x5B3C1. Con pagine di 4096 byte, ricava il numero di pagina virtuale (VPN) e lo spostamento in byte. Ricomponi l’indirizzo e scrivine il valore decimale.",
        "fields": [
          {
            "label": "Numero di pagina virtuale",
            "answer": "91",
            "accept": [],
            "numeric": true,
            "hint": "Una pagina occupa 4096 byte. Calcola il quoziente intero tra indirizzo e dimensione di pagina."
          },
          {
            "label": "Spostamento in byte",
            "answer": "961",
            "accept": [],
            "numeric": true,
            "hint": "Usa il resto della divisione per 4096, oppure applica la maschera 0xFFF."
          },
          {
            "label": "Indirizzo ricostruito, in decimale",
            "answer": "373697",
            "accept": [],
            "numeric": true,
            "hint": "Moltiplica il numero di pagina per i byte di una pagina, poi aggiungi lo spostamento."
          }
        ],
        "steps": [
          "Una pagina contiene 4096 = 2^12 byte. I 12 bit meno significativi indicano la posizione del byte nella pagina.",
          "Il quoziente intero di 373697 ÷ 4096 è 91. Il resto vale 961 = 0x3C1 e rientra fra 0 e 4095.",
          "La ricomposizione dà 91 × 4096 + 961 = 373697 = 0x5B3C1. Il quoziente individua la pagina e il resto individua il byte."
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
        "prompt": "Una traccia registra VPN 21 e offset 671 per pagine di 1024 byte. Ricostruisci l’indirizzo. Un secondo record conserva VPN 21 e usa offset 1024. Valuta il record e normalizza la posizione del byte.",
        "fields": [
          {
            "label": "Primo indirizzo, in decimale",
            "answer": "22175",
            "accept": [],
            "numeric": true,
            "hint": "Ogni pagina precedente contribuisce con una pagina intera di byte."
          },
          {
            "label": "Primo indirizzo, in esadecimale",
            "answer": "0x569F",
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
            "answer": "22",
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
          "Per il primo record, 21 × 1024 + 671 = 22175 = 0x569F. L’offset 671 appartiene all’intervallo 0…1023.",
          "Nel secondo record, l’offset 1024 supera il limite 1023. Aritmeticamente sposta il byte all’inizio della pagina successiva.",
          "21 × 1024 + 1024 = 22 × 1024 + 0 = 22528 = 0x5800. La coppia normalizzata è quindi (22, 0)."
        ]
      }
    ]
  },
  {
    "id": "6.3.3",
    "title": "Divisione con pagine da 2 KiB",
    "kind": "campi",
    "skill": "Separare un campo che attraversa una cifra esadecimale",
    "principio": "Una cifra esadecimale rappresenta quattro bit. Quando l’offset termina all’interno di una cifra, la divisione intera per la dimensione di pagina permette di separare i campi senza ambiguità.",
    "prompt": "Un indirizzo virtuale vale 0x7CDE. Con pagine di 2048 byte, ricava il numero di pagina virtuale (VPN) e lo spostamento in byte. Ricomponi l’indirizzo e scrivine il valore decimale.",
    "fields": [
      {
        "label": "Numero di pagina virtuale",
        "answer": "15",
        "accept": [],
        "numeric": true,
        "hint": "Una pagina occupa 2048 byte. Calcola il quoziente intero tra indirizzo e dimensione di pagina."
      },
      {
        "label": "Spostamento in byte",
        "answer": "1246",
        "accept": [],
        "numeric": true,
        "hint": "Usa il resto della divisione per 2048, oppure applica la maschera 0x7FF."
      },
      {
        "label": "Indirizzo ricostruito, in decimale",
        "answer": "31966",
        "accept": [],
        "numeric": true,
        "hint": "Moltiplica il numero di pagina per i byte di una pagina, poi aggiungi lo spostamento."
      }
    ],
    "steps": [
      "Una pagina contiene 2048 = 2^11 byte. Gli 11 bit meno significativi indicano la posizione del byte nella pagina.",
      "Il quoziente intero di 31966 ÷ 2048 è 15. Il resto vale 1246 = 0x4DE e rientra fra 0 e 2047.",
      "La ricomposizione dà 15 × 2048 + 1246 = 31966 = 0x7CDE. Il quoziente individua la pagina e il resto individua il byte."
    ],
    "variants": [
      {
        "prompt": "Un indirizzo virtuale vale 0x4E89. Con pagine di 2048 byte, ricava il numero di pagina virtuale (VPN) e lo spostamento in byte. Ricomponi l’indirizzo e scrivine il valore decimale.",
        "fields": [
          {
            "label": "Numero di pagina virtuale",
            "answer": "9",
            "accept": [],
            "numeric": true,
            "hint": "Una pagina occupa 2048 byte. Calcola il quoziente intero tra indirizzo e dimensione di pagina."
          },
          {
            "label": "Spostamento in byte",
            "answer": "1673",
            "accept": [],
            "numeric": true,
            "hint": "Usa il resto della divisione per 2048, oppure applica la maschera 0x7FF."
          },
          {
            "label": "Indirizzo ricostruito, in decimale",
            "answer": "20105",
            "accept": [],
            "numeric": true,
            "hint": "Moltiplica il numero di pagina per i byte di una pagina, poi aggiungi lo spostamento."
          }
        ],
        "steps": [
          "Una pagina contiene 2048 = 2^11 byte. Gli 11 bit meno significativi indicano la posizione del byte nella pagina.",
          "Il quoziente intero di 20105 ÷ 2048 è 9. Il resto vale 1673 = 0x689 e rientra fra 0 e 2047.",
          "La ricomposizione dà 9 × 2048 + 1673 = 20105 = 0x4E89. Il quoziente individua la pagina e il resto individua il byte."
        ]
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
        "prompt": "Una lettura di 8 byte comincia a 0x5FFD. Una pagina contiene 4096 byte. La pagina virtuale 5 è leggibile e punta al frame 3. La pagina 6 è leggibile e punta al frame 12. Individua i due tratti fisici. Tutti gli estremi sono inclusivi.",
        "fields": [
          {
            "label": "Ultimo indirizzo virtuale",
            "answer": "0x6004",
            "accept": [],
            "numeric": true,
            "hint": "Per una lettura di n byte, l’ultimo indirizzo è il primo più n − 1."
          },
          {
            "label": "Byte nella prima pagina",
            "answer": "3",
            "accept": [],
            "numeric": true,
            "hint": "Sottrai l’offset iniziale alla dimensione della pagina."
          },
          {
            "label": "Primo tratto fisico: inizio",
            "answer": "0x3FFD",
            "accept": [],
            "numeric": true,
            "hint": "Alla base del primo frame aggiungi l’offset del primo byte."
          },
          {
            "label": "Primo tratto fisico: fine",
            "answer": "0x3FFF",
            "accept": [],
            "numeric": true,
            "hint": "L’ultimo byte del primo frame ha offset pari alla dimensione di pagina meno uno."
          },
          {
            "label": "Secondo tratto fisico: inizio",
            "answer": "0xC000",
            "accept": [],
            "numeric": true,
            "hint": "Il secondo tratto inizia a offset zero nel frame indicato dalla seconda traduzione."
          },
          {
            "label": "Secondo tratto fisico: fine",
            "answer": "0xC004",
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
          "L’intervallo virtuale completo è 0x5FFD…0x6004. I primi 3 byte occupano 0x5FFD…0x5FFF nella pagina 5. Gli ultimi 5 occupano 0x6000…0x6004 nella pagina 6.",
          "Nella prima traduzione il frame 3 ha base 0x3000. Gli offset 0xFFD…0xFFF diventano gli indirizzi fisici 0x3FFD…0x3FFF.",
          "Nella seconda traduzione il frame 12 ha base 0xC000. Gli offset 0…4 danno 0xC000…0xC004. Gli intervalli fisici contengono in totale 3+5=8 byte.",
          "Dopo 0x3FFF, l’indirizzo fisico successivo della lettura è 0xC000. Per ottenerlo occorre tradurre la seconda pagina e verificarne il permesso di lettura."
        ]
      }
    ]
  },
  {
    "id": "6.3.5",
    "title": "Comporre l’indirizzo fisico",
    "kind": "campi",
    "skill": "Comporre la base del frame e l’offset",
    "principio": "Il numero di frame conta pagine fisiche intere. Per esprimere la base in byte lo si moltiplica per i byte per pagina. Dal corrispondente indirizzo virtuale si conserva l’offset.",
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
        "prompt": "RDI contiene l’indirizzo virtuale 0xACED a 32 bit senza segno. RSI contiene il numero di frame 11. Ogni pagina occupa 4096 byte. Il PFN occupa al massimo 14 bit. Scrivi in RAX l’indirizzo fisico per ogni ingresso ammesso. Usa RCX come registro di lavoro e conserva RDI e RSI. Scegli i parametri delle istruzioni SHL e AND, poi prevedi RAX.",
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
            "answer": "0xBCED",
            "accept": [],
            "numeric": true,
            "hint": "Combina la base del frame e lo spostamento della VA."
          }
        ],
        "steps": [
          "4096 = 2^12. Lo shift di 12 posizioni porta il PFN 11 alla base 45056 = 0xB000. In quella base i 12 bit inferiori sono zero.",
          "La maschera 0xFFF conserva i bit di offset. Applicandola si ottiene 0xACED & 0xFFF = 0xCED = 3309. La scrittura in ECX azzera i 32 bit alti di RCX.",
          "Le due parti occupano campi disgiunti. OR compone 0xB000 | 0xCED = 0xBCED = 48365. RDI e RSI conservano i valori iniziali."
        ],
        "code": "mov rax, rsi\nshl rax, 12\nmov rcx, rdi\nand ecx, 4095\nor rax, rcx",
        "bits": 12,
        "va": "0xACED",
        "pfn": 11,
        "family": "compose"
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
    "prompt": "RDI contiene l’indirizzo virtuale 0x2425 a 32 bit senza segno. RSI contiene il numero di frame 6. Ogni pagina occupa 1024 byte. Il PFN occupa al massimo 14 bit. Scrivi in RAX l’indirizzo fisico per ogni ingresso ammesso. Usa RCX come registro di lavoro e conserva RDI e RSI. Calcola anche gli indirizzi ottenuti per il primo e l’ultimo byte dello stesso frame.",
    "fields": [
      {
        "label": "Bit da spostare a sinistra sul PFN",
        "answer": "10",
        "accept": [],
        "numeric": true,
        "hint": "La base di un frame è il PFN moltiplicato per i byte di una pagina."
      },
      {
        "label": "Maschera dei bit di offset",
        "answer": "0x3FF",
        "accept": [],
        "numeric": true,
        "hint": "Scrivi una sequenza di uno per ciascun bit di offset."
      },
      {
        "label": "Indirizzo fisico in RAX",
        "answer": "0x1825",
        "accept": [],
        "numeric": true,
        "hint": "Combina la base del frame e lo spostamento della VA."
      },
      {
        "label": "PA con offset zero",
        "answer": "0x1800",
        "accept": [],
        "numeric": true,
        "hint": "Il primo byte del frame coincide con la sua base."
      },
      {
        "label": "PA con offset massimo",
        "answer": "0x1BFF",
        "accept": [],
        "numeric": true,
        "hint": "Aggiungi alla base il massimo offset ammesso."
      }
    ],
    "steps": [
      "1024 = 2^10. Lo shift di 10 posizioni porta il PFN 6 alla base 6144 = 0x1800. In quella base i 10 bit inferiori sono zero.",
      "La maschera 0x3FF conserva i bit di offset. Applicandola si ottiene 0x2425 & 0x3FF = 0x25 = 37. La scrittura in ECX azzera i 32 bit alti di RCX.",
      "Le due parti occupano campi disgiunti. OR compone 0x1800 | 0x25 = 0x1825 = 6181. RDI e RSI conservano i valori iniziali.",
      "Gli offset estremi danno 0x1800 + 0 = 0x1800 e 0x1800 + 0x3FF = 0x1BFF. Confrontare questi estremi mette in evidenza maschere troppo strette o bit della VPN copiati nel risultato. Una seconda VA con lo stesso offset e una VPN diversa deve dare lo stesso PA per il PFN fissato."
    ],
    "code": "mov rax, rsi\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx",
    "variants": [
      {
        "prompt": "RDI contiene l’indirizzo virtuale 0x16D0 a 32 bit senza segno. RSI contiene il numero di frame 11. Ogni pagina occupa 1024 byte. Il PFN occupa al massimo 14 bit. Scrivi in RAX l’indirizzo fisico per ogni ingresso ammesso. Usa RCX come registro di lavoro e conserva RDI e RSI. Calcola anche gli indirizzi ottenuti per il primo e l’ultimo byte dello stesso frame.",
        "fields": [
          {
            "label": "Bit da spostare a sinistra sul PFN",
            "answer": "10",
            "accept": [],
            "numeric": true,
            "hint": "La base di un frame è il PFN moltiplicato per i byte di una pagina."
          },
          {
            "label": "Maschera dei bit di offset",
            "answer": "0x3FF",
            "accept": [],
            "numeric": true,
            "hint": "Scrivi una sequenza di uno per ciascun bit di offset."
          },
          {
            "label": "Indirizzo fisico in RAX",
            "answer": "0x2ED0",
            "accept": [],
            "numeric": true,
            "hint": "Combina la base del frame e lo spostamento della VA."
          },
          {
            "label": "PA con offset zero",
            "answer": "0x2C00",
            "accept": [],
            "numeric": true,
            "hint": "Il primo byte del frame coincide con la sua base."
          },
          {
            "label": "PA con offset massimo",
            "answer": "0x2FFF",
            "accept": [],
            "numeric": true,
            "hint": "Aggiungi alla base il massimo offset ammesso."
          }
        ],
        "steps": [
          "1024 = 2^10. Lo shift di 10 posizioni porta il PFN 11 alla base 11264 = 0x2C00. In quella base i 10 bit inferiori sono zero.",
          "La maschera 0x3FF conserva i bit di offset. Applicandola si ottiene 0x16D0 & 0x3FF = 0x2D0 = 720. La scrittura in ECX azzera i 32 bit alti di RCX.",
          "Le due parti occupano campi disgiunti. OR compone 0x2C00 | 0x2D0 = 0x2ED0 = 11984. RDI e RSI conservano i valori iniziali.",
          "Gli offset estremi danno 0x2C00 + 0 = 0x2C00 e 0x2C00 + 0x3FF = 0x2FFF. Confrontare questi estremi mette in evidenza maschere troppo strette o bit della VPN copiati nel risultato. Una seconda VA con lo stesso offset e una VPN diversa deve dare lo stesso PA per il PFN fissato."
        ],
        "code": "mov rax, rsi\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx",
        "bits": 10,
        "va": "0x16D0",
        "pfn": 11,
        "family": "compose"
      }
    ],
    "bits": 10,
    "va": "0x2425",
    "pfn": 6,
    "family": "compose"
  },
  {
    "id": "6.3.7",
    "title": "I bit della VPN nel risultato",
    "kind": "campi",
    "skill": "Diagnosticare una maschera errata",
    "principio": "Frame e offset occupano campi disgiunti nell’indirizzo fisico. Copiare nell’OR bit appartenenti alla VPN può cambiare il frame, mentre una maschera troppo corta perde parte dell’offset.",
    "prompt": "RDI contiene l’indirizzo virtuale 0x24025 a 32 bit senza segno. RSI contiene il numero di frame 6. Ogni pagina occupa 16384 byte. Il PFN occupa al massimo 14 bit. Scrivi in RAX l’indirizzo fisico per ogni ingresso ammesso. Usa RCX come registro di lavoro e conserva RDI e RSI. Una versione esegue OR direttamente con l’intera VA. Individua il risultato difettoso e scegli la correzione.",
    "fields": [
      {
        "label": "Bit da spostare a sinistra sul PFN",
        "answer": "14",
        "accept": [],
        "numeric": true,
        "hint": "La base di un frame è il PFN moltiplicato per i byte di una pagina."
      },
      {
        "label": "Maschera dei bit di offset",
        "answer": "0x3FFF",
        "accept": [],
        "numeric": true,
        "hint": "Scrivi una sequenza di uno per ciascun bit di offset."
      },
      {
        "label": "Indirizzo fisico in RAX",
        "answer": "0x18025",
        "accept": [],
        "numeric": true,
        "hint": "Combina la base del frame e lo spostamento della VA."
      },
      {
        "label": "RAX con OR sull’intera VA",
        "answer": "0x3C025",
        "accept": [],
        "numeric": true,
        "hint": "Applica OR bit a bit tra la base del frame e tutti i bit di RDI."
      },
      {
        "label": "Effetto di una maschera 0xFFF",
        "answer": "Perde i bit 12 e 13 di un offset da 14 bit",
        "accept": [],
        "numeric": false,
        "choices": [
          "Perde i bit 12 e 13 di un offset da 14 bit",
          "Conserva tutti i 14 bit di offset",
          "Raddoppia la base del frame"
        ],
        "hint": "Confronta il numero di bit a uno nelle due maschere."
      }
    ],
    "steps": [
      "16384 = 2^14. Lo shift di 14 posizioni porta il PFN 6 alla base 98304 = 0x18000. In quella base i 14 bit inferiori sono zero.",
      "La maschera 0x3FFF conserva i bit di offset. Applicandola si ottiene 0x24025 & 0x3FFF = 0x25 = 37. La scrittura in ECX azzera i 32 bit alti di RCX.",
      "Le due parti occupano campi disgiunti. OR compone 0x18000 | 0x25 = 0x18025 = 98341. RDI e RSI conservano i valori iniziali.",
      "La versione difettosa produce 0x18000 | 0x24025 = 0x3C025. Copia nel campo fisico anche alcuni bit del numero di pagina virtuale. Il frame letto dall’indirizzo errato è 15.",
      "Con 16 KiB servono 14 bit di offset. La maschera 0xFFF conserva solo i primi 12. Per esempio, un offset 0x3000 diverrebbe 0. Il listato corretto usa 0x3FFF."
    ],
    "code": "mov rax, rsi\nshl rax, 14\nmov rcx, rdi\nand ecx, 16383\nor rax, rcx",
    "variants": [
      {
        "prompt": "RDI contiene l’indirizzo virtuale 0x3E025 a 32 bit senza segno. RSI contiene il numero di frame 4. Ogni pagina occupa 16384 byte. Il PFN occupa al massimo 14 bit. Scrivi in RAX l’indirizzo fisico per ogni ingresso ammesso. Usa RCX come registro di lavoro e conserva RDI e RSI. Una versione esegue OR direttamente con l’intera VA. Individua il risultato difettoso e scegli la correzione.",
        "fields": [
          {
            "label": "Bit da spostare a sinistra sul PFN",
            "answer": "14",
            "accept": [],
            "numeric": true,
            "hint": "La base di un frame è il PFN moltiplicato per i byte di una pagina."
          },
          {
            "label": "Maschera dei bit di offset",
            "answer": "0x3FFF",
            "accept": [],
            "numeric": true,
            "hint": "Scrivi una sequenza di uno per ciascun bit di offset."
          },
          {
            "label": "Indirizzo fisico in RAX",
            "answer": "0x12025",
            "accept": [],
            "numeric": true,
            "hint": "Combina la base del frame e lo spostamento della VA."
          },
          {
            "label": "RAX con OR sull’intera VA",
            "answer": "0x3E025",
            "accept": [],
            "numeric": true,
            "hint": "Applica OR bit a bit tra la base del frame e tutti i bit di RDI."
          },
          {
            "label": "Effetto di una maschera 0xFFF",
            "answer": "Perde i bit 12 e 13 di un offset da 14 bit",
            "accept": [],
            "numeric": false,
            "choices": [
              "Perde i bit 12 e 13 di un offset da 14 bit",
              "Conserva tutti i 14 bit di offset",
              "Raddoppia la base del frame"
            ],
            "hint": "Confronta il numero di bit a uno nelle due maschere."
          }
        ],
        "steps": [
          "16384 = 2^14. Lo shift di 14 posizioni porta il PFN 4 alla base 65536 = 0x10000. In quella base i 14 bit inferiori sono zero.",
          "La maschera 0x3FFF conserva i bit di offset. Applicandola si ottiene 0x3E025 & 0x3FFF = 0x2025 = 8229. La scrittura in ECX azzera i 32 bit alti di RCX.",
          "Le due parti occupano campi disgiunti. OR compone 0x10000 | 0x2025 = 0x12025 = 73765. RDI e RSI conservano i valori iniziali.",
          "La versione difettosa produce 0x10000 | 0x3E025 = 0x3E025. Copia nel campo fisico anche alcuni bit del numero di pagina virtuale. Il frame letto dall’indirizzo errato è 15.",
          "Con 16 KiB servono 14 bit di offset. La maschera 0xFFF conserva solo i primi 12. Per esempio, un offset 0x3000 diverrebbe 0. Il listato corretto usa 0x3FFF."
        ],
        "code": "mov rax, rsi\nshl rax, 14\nmov rcx, rdi\nand ecx, 16383\nor rax, rcx",
        "bits": 14,
        "va": "0x3E025",
        "pfn": 4,
        "family": "compose"
      }
    ],
    "bits": 14,
    "va": "0x24025",
    "pfn": 6,
    "family": "compose"
  },
  {
    "id": "6.3.8",
    "title": "Il più grande indirizzo rappresentabile",
    "kind": "campi",
    "skill": "Dimostrare il limite superiore del PA",
    "principio": "La larghezza di un indirizzo fisico composto dipende dai bit del PFN e dai bit dell’offset. L’ultimo byte indirizzabile corrisponde all’ultimo offset dell’ultimo frame.",
    "prompt": "RDI contiene l’indirizzo virtuale 0x4825 a 32 bit senza segno. RSI contiene il numero di frame 6. Ogni pagina occupa 2048 byte. Il PFN occupa al massimo 14 bit. Scrivi in RAX l’indirizzo fisico per ogni ingresso ammesso. Usa RCX come registro di lavoro e conserva RDI e RSI. Dopo la traccia, usa i limiti dei campi per trovare il massimo PA di tutta la routine.",
    "fields": [
      {
        "label": "Bit da spostare a sinistra sul PFN",
        "answer": "11",
        "accept": [],
        "numeric": true,
        "hint": "La base di un frame è il PFN moltiplicato per i byte di una pagina."
      },
      {
        "label": "Maschera dei bit di offset",
        "answer": "0x7FF",
        "accept": [],
        "numeric": true,
        "hint": "Scrivi una sequenza di uno per ciascun bit di offset."
      },
      {
        "label": "Indirizzo fisico in RAX",
        "answer": "0x3025",
        "accept": [],
        "numeric": true,
        "hint": "Combina la base del frame e lo spostamento della VA."
      },
      {
        "label": "Massimo PA ammesso",
        "answer": "33554431",
        "accept": [],
        "numeric": true,
        "hint": "Combina il massimo PFN a 14 bit con il massimo offset."
      },
      {
        "label": "Bit necessari per il PA massimo",
        "answer": "25",
        "accept": [],
        "numeric": true,
        "hint": "Somma la larghezza del PFN a quella dell’offset."
      },
      {
        "label": "Tipo sufficiente a contenere ogni risultato",
        "answer": "Intero senza segno a 32 bit",
        "accept": [],
        "numeric": false,
        "choices": [
          "Intero senza segno a 16 bit",
          "Intero senza segno a 32 bit",
          "Intero senza segno a 24 bit"
        ],
        "hint": "Confronta l’ampiezza disponibile con la somma dei due campi."
      }
    ],
    "steps": [
      "2048 = 2^11. Lo shift di 11 posizioni porta il PFN 6 alla base 12288 = 0x3000. In quella base i 11 bit inferiori sono zero.",
      "La maschera 0x7FF conserva i bit di offset. Applicandola si ottiene 0x4825 & 0x7FF = 0x25 = 37. La scrittura in ECX azzera i 32 bit alti di RCX.",
      "Le due parti occupano campi disgiunti. OR compone 0x3000 | 0x25 = 0x3025 = 12325. RDI e RSI conservano i valori iniziali.",
      "Il massimo si ha con PFN = 2¹⁴ − 1 = 16383 e offset = 2047. Il PA vale 16383 × 2048 + 2047 = 33554431 = 0x1FFFFFF. Per il risultato occorrono 25 bit. Un intero senza segno a 32 bit copre l’intero intervallo."
    ],
    "code": "mov rax, rsi\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx",
    "variants": [
      {
        "prompt": "RDI contiene l’indirizzo virtuale 0x5751 a 32 bit senza segno. RSI contiene il numero di frame 12. Ogni pagina occupa 2048 byte. Il PFN occupa al massimo 14 bit. Scrivi in RAX l’indirizzo fisico per ogni ingresso ammesso. Usa RCX come registro di lavoro e conserva RDI e RSI. Dopo la traccia, usa i limiti dei campi per trovare il massimo PA di tutta la routine.",
        "fields": [
          {
            "label": "Bit da spostare a sinistra sul PFN",
            "answer": "11",
            "accept": [],
            "numeric": true,
            "hint": "La base di un frame è il PFN moltiplicato per i byte di una pagina."
          },
          {
            "label": "Maschera dei bit di offset",
            "answer": "0x7FF",
            "accept": [],
            "numeric": true,
            "hint": "Scrivi una sequenza di uno per ciascun bit di offset."
          },
          {
            "label": "Indirizzo fisico in RAX",
            "answer": "0x6751",
            "accept": [],
            "numeric": true,
            "hint": "Combina la base del frame e lo spostamento della VA."
          },
          {
            "label": "Massimo PA ammesso",
            "answer": "33554431",
            "accept": [],
            "numeric": true,
            "hint": "Combina il massimo PFN a 14 bit con il massimo offset."
          },
          {
            "label": "Bit necessari per il PA massimo",
            "answer": "25",
            "accept": [],
            "numeric": true,
            "hint": "Somma la larghezza del PFN a quella dell’offset."
          },
          {
            "label": "Tipo sufficiente a contenere ogni risultato",
            "answer": "Intero senza segno a 32 bit",
            "accept": [],
            "numeric": false,
            "choices": [
              "Intero senza segno a 16 bit",
              "Intero senza segno a 32 bit",
              "Intero senza segno a 24 bit"
            ],
            "hint": "Confronta l’ampiezza disponibile con la somma dei due campi."
          }
        ],
        "steps": [
          "2048 = 2^11. Lo shift di 11 posizioni porta il PFN 12 alla base 24576 = 0x6000. In quella base i 11 bit inferiori sono zero.",
          "La maschera 0x7FF conserva i bit di offset. Applicandola si ottiene 0x5751 & 0x7FF = 0x751 = 1873. La scrittura in ECX azzera i 32 bit alti di RCX.",
          "Le due parti occupano campi disgiunti. OR compone 0x6000 | 0x751 = 0x6751 = 26449. RDI e RSI conservano i valori iniziali.",
          "Il massimo si ha con PFN = 2¹⁴ − 1 = 16383 e offset = 2047. Il PA vale 16383 × 2048 + 2047 = 33554431 = 0x1FFFFFF. Per il risultato occorrono 25 bit. Un intero senza segno a 32 bit copre l’intero intervallo."
        ],
        "code": "mov rax, rsi\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx",
        "bits": 11,
        "va": "0x5751",
        "pfn": 12,
        "family": "compose"
      }
    ],
    "bits": 11,
    "va": "0x4825",
    "pfn": 6,
    "family": "compose"
  },
  {
    "id": "6.3.9",
    "title": "Prelevare una voce indicizzata",
    "kind": "campi",
    "skill": "Caricare il PFN dalla tabella",
    "principio": "In una tabella di voci uniformi, l’indice seleziona un elemento e la scala lo converte in uno spostamento in byte. Il caricamento restituisce il contenuto dell’elemento selezionato.",
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
        "prompt": "Il registro RDI contiene 0xC02A, RSI punta alla tabella in 0x300000. Una pagina occupa 4096 byte. La tabella è leggibile. Scrivi un frammento che restituisca in RAX tutti i 64 bit della voce relativa all’indirizzo virtuale in RDI. Conserva RDI e RSI. Ogni voce di 8 byte contiene direttamente un PFN. La voce 12 contiene 41. Completa la traccia del caricamento indicizzato.",
        "fields": [
          {
            "label": "VPN",
            "answer": "12",
            "accept": [],
            "numeric": true,
            "hint": "Dividi l’indirizzo virtuale per i byte di una pagina e conserva il quoziente intero."
          },
          {
            "label": "Indirizzo della voce",
            "answer": "0x300060",
            "accept": [],
            "numeric": true,
            "hint": "Conta otto byte per ogni voce precedente e aggiungi la base della tabella."
          },
          {
            "label": "PFN restituito in RAX",
            "answer": "41",
            "accept": [],
            "numeric": true,
            "hint": "Consulta il contenuto memorizzato nella voce selezionata."
          }
        ],
        "steps": [
          "Spostando RDI di 12 bit a destra si ottiene il quoziente intero della divisione per la dimensione di pagina. La VPN vale 0xC02A >> 12 = 12. L’offset scartato vale 42.",
          "La voce ha indice 12. La sua posizione è 12 × 8 = 96 = 0x60 byte dopo la base. L’indirizzo della voce è 0x300000 + 0x60 = 0x300060.",
          "MOV RAX, [RSI + RAX*8] legge otto byte a 0x300060. RAX assume il valore 41 conservato in quella voce. Nel listato, RAX passa dalla VPN al PFN."
        ],
        "code": "mov rax, rdi\nshr rax, 12\nmov rax, [rsi + rax*8]",
        "bits": 12,
        "va": "0xC02A",
        "pfn": 41,
        "family": "lookup",
        "base": "0x300000",
        "pte": 41
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
    "principio": "LEA calcola un indirizzo effettivo. MOV con un operando in memoria legge i byte a quell’indirizzo. Posizione della voce e contenuto della voce sono due valori distinti.",
    "prompt": "Il registro RDI contiene 0x1C13, RSI punta alla tabella in 0x200000. Una pagina occupa 1024 byte. La tabella è leggibile. Scrivi un frammento che restituisca in RAX tutti i 64 bit della voce relativa all’indirizzo virtuale in RDI. Conserva RDI e RSI. Ogni voce di 8 byte contiene direttamente un PFN. La voce 7 contiene 23. Il listato difettoso termina con LEA RAX, [RSI + RAX*8]. Prevedi anche il risultato di LEA e scegli l’istruzione che effettua la lettura.",
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
      },
      {
        "label": "RAX restituito da LEA",
        "answer": "0x200038",
        "accept": [],
        "numeric": true,
        "hint": "LEA calcola l’indirizzo effettivo della voce."
      },
      {
        "label": "Istruzione per leggere il PFN",
        "answer": "MOV RAX, [RSI + RAX*8]",
        "accept": [],
        "numeric": false,
        "choices": [
          "LEA RAX, [RSI + RAX*8]",
          "MOV RAX, [RSI + RAX*8]",
          "MOV RAX, RSI"
        ],
        "hint": "La coppia di parentesi quadre nel secondo operando di MOV identifica la sorgente in memoria."
      }
    ],
    "steps": [
      "Spostando RDI di 10 bit a destra si ottiene il quoziente intero della divisione per la dimensione di pagina. La VPN vale 0x1C13 >> 10 = 7. L’offset scartato vale 19.",
      "La voce ha indice 7. La sua posizione è 7 × 8 = 56 = 0x38 byte dopo la base. L’indirizzo della voce è 0x200000 + 0x38 = 0x200038.",
      "MOV RAX, [RSI + RAX*8] legge otto byte a 0x200038. RAX assume il valore 23 conservato in quella voce. Nel listato, RAX passa dalla VPN al PFN.",
      "LEA si ferma al calcolo dell’indirizzo effettivo e restituisce 0x200038. La lettura mediante MOV produce 23. Il risultato richiesto è il contenuto della voce."
    ],
    "code": "mov rax, rdi\nshr rax, 10\nmov rax, [rsi + rax*8]",
    "variants": [
      {
        "prompt": "Il registro RDI contiene 0x102A, RSI punta alla tabella in 0x300000. Una pagina occupa 1024 byte. La tabella è leggibile. Scrivi un frammento che restituisca in RAX tutti i 64 bit della voce relativa all’indirizzo virtuale in RDI. Conserva RDI e RSI. Ogni voce di 8 byte contiene direttamente un PFN. La voce 4 contiene 61. Il listato difettoso termina con LEA RAX, [RSI + RAX*8]. Prevedi anche il risultato di LEA e scegli l’istruzione che effettua la lettura.",
        "fields": [
          {
            "label": "VPN",
            "answer": "4",
            "accept": [],
            "numeric": true,
            "hint": "Dividi l’indirizzo virtuale per i byte di una pagina e conserva il quoziente intero."
          },
          {
            "label": "Indirizzo della voce",
            "answer": "0x300020",
            "accept": [],
            "numeric": true,
            "hint": "Conta otto byte per ogni voce precedente e aggiungi la base della tabella."
          },
          {
            "label": "PFN restituito in RAX",
            "answer": "61",
            "accept": [],
            "numeric": true,
            "hint": "Consulta il contenuto memorizzato nella voce selezionata."
          },
          {
            "label": "RAX restituito da LEA",
            "answer": "0x300020",
            "accept": [],
            "numeric": true,
            "hint": "LEA calcola l’indirizzo effettivo della voce."
          },
          {
            "label": "Istruzione per leggere il PFN",
            "answer": "MOV RAX, [RSI + RAX*8]",
            "accept": [],
            "numeric": false,
            "choices": [
              "LEA RAX, [RSI + RAX*8]",
              "MOV RAX, [RSI + RAX*8]",
              "MOV RAX, RSI"
            ],
            "hint": "La coppia di parentesi quadre nel secondo operando di MOV identifica la sorgente in memoria."
          }
        ],
        "steps": [
          "Spostando RDI di 10 bit a destra si ottiene il quoziente intero della divisione per la dimensione di pagina. La VPN vale 0x102A >> 10 = 4. L’offset scartato vale 42.",
          "La voce ha indice 4. La sua posizione è 4 × 8 = 32 = 0x20 byte dopo la base. L’indirizzo della voce è 0x300000 + 0x20 = 0x300020.",
          "MOV RAX, [RSI + RAX*8] legge otto byte a 0x300020. RAX assume il valore 61 conservato in quella voce. Nel listato, RAX passa dalla VPN al PFN.",
          "LEA si ferma al calcolo dell’indirizzo effettivo e restituisce 0x300020. La lettura mediante MOV produce 61. Il risultato richiesto è il contenuto della voce."
        ],
        "code": "mov rax, rdi\nshr rax, 10\nmov rax, [rsi + rax*8]",
        "bits": 10,
        "va": "0x102A",
        "pfn": 61,
        "family": "lookup",
        "base": "0x300000",
        "pte": 61
      }
    ],
    "bits": 10,
    "va": "0x1C13",
    "pfn": 23,
    "family": "lookup",
    "base": "0x200000",
    "pte": 23
  },
  {
    "id": "6.3.11",
    "title": "Scegliere shift e scala",
    "kind": "campi",
    "skill": "Associare le unità di misura ai fattori di scala",
    "principio": "Lo shift per ricavare la VPN dipende dai byte per pagina. La scala dell’operando in memoria dipende dai byte per voce della tabella.",
    "prompt": "Il registro RDI contiene 0x3813, RSI punta alla tabella in 0x200000. Una pagina occupa 2048 byte. La tabella è leggibile. Scrivi un frammento che restituisca in RAX tutti i 64 bit della voce relativa all’indirizzo virtuale in RDI. Conserva RDI e RSI. Ogni voce di 8 byte contiene direttamente un PFN. La voce 7 contiene 23. Un programmatore usa i byte di una pagina come scala dell’indice. Stabilisci shift e scala corretti.",
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
      },
      {
        "label": "Shift per ricavare la VPN",
        "answer": "11",
        "accept": [],
        "numeric": true,
        "hint": "Trova la potenza di due che esprime la dimensione della pagina."
      },
      {
        "label": "Scala dell’indice nella tabella",
        "answer": "8",
        "accept": [],
        "numeric": true,
        "hint": "Misura la distanza, in byte, tra due voci adiacenti dell’array."
      }
    ],
    "steps": [
      "Spostando RDI di 11 bit a destra si ottiene il quoziente intero della divisione per la dimensione di pagina. La VPN vale 0x3813 >> 11 = 7. L’offset scartato vale 19.",
      "La voce ha indice 7. La sua posizione è 7 × 8 = 56 = 0x38 byte dopo la base. L’indirizzo della voce è 0x200000 + 0x38 = 0x200038.",
      "MOV RAX, [RSI + RAX*8] legge otto byte a 0x200038. RAX assume il valore 23 conservato in quella voce. Nel listato, RAX passa dalla VPN al PFN.",
      "La dimensione 2048 descrive una pagina e determina lo shift di 11. La distanza tra due elementi dell’array vale 8 e determina la scala. Una scala 2048 condurrebbe a 0x203800, fuori dalla voce richiesta."
    ],
    "code": "mov rax, rdi\nshr rax, 11\nmov rax, [rsi + rax*8]",
    "variants": [
      {
        "prompt": "Il registro RDI contiene 0x182A, RSI punta alla tabella in 0x300000. Una pagina occupa 2048 byte. La tabella è leggibile. Scrivi un frammento che restituisca in RAX tutti i 64 bit della voce relativa all’indirizzo virtuale in RDI. Conserva RDI e RSI. Ogni voce di 8 byte contiene direttamente un PFN. La voce 3 contiene 9. Un programmatore usa i byte di una pagina come scala dell’indice. Stabilisci shift e scala corretti.",
        "fields": [
          {
            "label": "VPN",
            "answer": "3",
            "accept": [],
            "numeric": true,
            "hint": "Dividi l’indirizzo virtuale per i byte di una pagina e conserva il quoziente intero."
          },
          {
            "label": "Indirizzo della voce",
            "answer": "0x300018",
            "accept": [],
            "numeric": true,
            "hint": "Conta otto byte per ogni voce precedente e aggiungi la base della tabella."
          },
          {
            "label": "PFN restituito in RAX",
            "answer": "9",
            "accept": [],
            "numeric": true,
            "hint": "Consulta il contenuto memorizzato nella voce selezionata."
          },
          {
            "label": "Shift per ricavare la VPN",
            "answer": "11",
            "accept": [],
            "numeric": true,
            "hint": "Trova la potenza di due che esprime la dimensione della pagina."
          },
          {
            "label": "Scala dell’indice nella tabella",
            "answer": "8",
            "accept": [],
            "numeric": true,
            "hint": "Misura la distanza, in byte, tra due voci adiacenti dell’array."
          }
        ],
        "steps": [
          "Spostando RDI di 11 bit a destra si ottiene il quoziente intero della divisione per la dimensione di pagina. La VPN vale 0x182A >> 11 = 3. L’offset scartato vale 42.",
          "La voce ha indice 3. La sua posizione è 3 × 8 = 24 = 0x18 byte dopo la base. L’indirizzo della voce è 0x300000 + 0x18 = 0x300018.",
          "MOV RAX, [RSI + RAX*8] legge otto byte a 0x300018. RAX assume il valore 9 conservato in quella voce. Nel listato, RAX passa dalla VPN al PFN.",
          "La dimensione 2048 descrive una pagina e determina lo shift di 11. La distanza tra due elementi dell’array vale 8 e determina la scala. Una scala 2048 condurrebbe a 0x301800, fuori dalla voce richiesta."
        ],
        "code": "mov rax, rdi\nshr rax, 11\nmov rax, [rsi + rax*8]",
        "bits": 11,
        "va": "0x182A",
        "pfn": 9,
        "family": "lookup",
        "base": "0x300000",
        "pte": 9
      }
    ],
    "bits": 11,
    "va": "0x3813",
    "pfn": 23,
    "family": "lookup",
    "base": "0x200000",
    "pte": 23
  },
  {
    "id": "6.3.12",
    "title": "Due voci adiacenti",
    "kind": "campi",
    "skill": "Controllare il cambio di VPN al confine",
    "principio": "Due byte ai lati di un confine di pagina hanno VPN consecutive e offset ai due estremi dell’intervallo. La tabella può associare le due pagine a frame distanti.",
    "prompt": "Il registro RDI contiene 0xE013, RSI punta alla tabella in 0x200000. Una pagina occupa 8192 byte. La tabella è leggibile. Scrivi un frammento che restituisca in RAX tutti i 64 bit della voce relativa all’indirizzo virtuale in RDI. Conserva RDI e RSI. Ogni voce di 8 byte contiene direttamente un PFN. La voce 7 contiene 23. Calcola il confine tra le pagine virtuali 7 e 8, poi trova gli indirizzi delle due voci adiacenti.",
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
      },
      {
        "label": "Ultimo VA della pagina 7",
        "answer": "0xFFFF",
        "accept": [],
        "numeric": true,
        "hint": "Parti dalla base della pagina successiva e togli un byte."
      },
      {
        "label": "Primo VA della pagina 8",
        "answer": "0x10000",
        "accept": [],
        "numeric": true,
        "hint": "Moltiplica il nuovo numero di pagina per la dimensione della pagina."
      },
      {
        "label": "Indirizzo della voce 8",
        "answer": "0x200040",
        "accept": [],
        "numeric": true,
        "hint": "Sposta di una voce l’indirizzo individuato per la VPN precedente."
      }
    ],
    "steps": [
      "Spostando RDI di 13 bit a destra si ottiene il quoziente intero della divisione per la dimensione di pagina. La VPN vale 0xE013 >> 13 = 7. L’offset scartato vale 19.",
      "La voce ha indice 7. La sua posizione è 7 × 8 = 56 = 0x38 byte dopo la base. L’indirizzo della voce è 0x200000 + 0x38 = 0x200038.",
      "MOV RAX, [RSI + RAX*8] legge otto byte a 0x200038. RAX assume il valore 23 conservato in quella voce. Nel listato, RAX passa dalla VPN al PFN.",
      "La pagina 7 copre VA da 0xE000 a 0xFFFF. Il byte 0x10000 apre la pagina 8.",
      "Il passaggio da 0xFFFF a 0x10000 cambia l’indice da 7 a 8. Gli indirizzi delle rispettive voci passano da 0x200038 a 0x200040, distanti otto byte."
    ],
    "code": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]",
    "variants": [
      {
        "prompt": "Il registro RDI contiene 0xA02A, RSI punta alla tabella in 0x300000. Una pagina occupa 8192 byte. La tabella è leggibile. Scrivi un frammento che restituisca in RAX tutti i 64 bit della voce relativa all’indirizzo virtuale in RDI. Conserva RDI e RSI. Ogni voce di 8 byte contiene direttamente un PFN. La voce 5 contiene 31. Calcola il confine tra le pagine virtuali 5 e 6, poi trova gli indirizzi delle due voci adiacenti.",
        "fields": [
          {
            "label": "VPN",
            "answer": "5",
            "accept": [],
            "numeric": true,
            "hint": "Dividi l’indirizzo virtuale per i byte di una pagina e conserva il quoziente intero."
          },
          {
            "label": "Indirizzo della voce",
            "answer": "0x300028",
            "accept": [],
            "numeric": true,
            "hint": "Conta otto byte per ogni voce precedente e aggiungi la base della tabella."
          },
          {
            "label": "PFN restituito in RAX",
            "answer": "31",
            "accept": [],
            "numeric": true,
            "hint": "Consulta il contenuto memorizzato nella voce selezionata."
          },
          {
            "label": "Ultimo VA della pagina 5",
            "answer": "0xBFFF",
            "accept": [],
            "numeric": true,
            "hint": "Parti dalla base della pagina successiva e togli un byte."
          },
          {
            "label": "Primo VA della pagina 6",
            "answer": "0xC000",
            "accept": [],
            "numeric": true,
            "hint": "Moltiplica il nuovo numero di pagina per la dimensione della pagina."
          },
          {
            "label": "Indirizzo della voce 6",
            "answer": "0x300030",
            "accept": [],
            "numeric": true,
            "hint": "Sposta di una voce l’indirizzo individuato per la VPN precedente."
          }
        ],
        "steps": [
          "Spostando RDI di 13 bit a destra si ottiene il quoziente intero della divisione per la dimensione di pagina. La VPN vale 0xA02A >> 13 = 5. L’offset scartato vale 42.",
          "La voce ha indice 5. La sua posizione è 5 × 8 = 40 = 0x28 byte dopo la base. L’indirizzo della voce è 0x300000 + 0x28 = 0x300028.",
          "MOV RAX, [RSI + RAX*8] legge otto byte a 0x300028. RAX assume il valore 31 conservato in quella voce. Nel listato, RAX passa dalla VPN al PFN.",
          "La pagina 5 copre VA da 0xA000 a 0xBFFF. Il byte 0xC000 apre la pagina 6.",
          "Il passaggio da 0xBFFF a 0xC000 cambia l’indice da 5 a 6. Gli indirizzi delle rispettive voci passano da 0x300028 a 0x300030, distanti otto byte."
        ],
        "code": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]",
        "bits": 13,
        "va": "0xA02A",
        "pfn": 31,
        "family": "lookup",
        "base": "0x300000",
        "pte": 31
      }
    ],
    "bits": 13,
    "va": "0xE013",
    "pfn": 23,
    "family": "lookup",
    "base": "0x200000",
    "pte": 23
  },
  {
    "id": "6.3.13",
    "title": "Il bit che decide il ramo",
    "kind": "campi",
    "skill": "Leggere la validità di una PTE codificata",
    "principio": "Una voce codificata usa un bit per la validità e gli altri per il frame. Per interpretarla occorre esaminare separatamente i due campi.",
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
        "prompt": "Il formato della voce è PTE = (PFN << 1) | valid. La memoria contiene la PTE 62. Un controllo accetta ogni voce con valore diverso da zero. Determina il bit di validità e il ramo corretto.",
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
            "answer": "31",
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
          "62 in binario è 111110. Il prodotto logico 62 & 1 dà zero, il valore del bit di validità.",
          "Il campo alto vale 62 >> 1 = 31. La voce è invalida e quei bit possono contenere dati residui. La routine termina sul ramo di errore.",
          "TEST RAX, 1 imposta ZF a 1 quando il bit di validità è zero. JZ trasferisce il controllo al ramo di errore. Un test sull’intera parola avrebbe accettato 62."
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
        "prompt": "Una tabella lineare fisica inizia a 0x240000 e contiene voci di otto byte. Il numero di pagina richiesto è 0x29. Calcola lo spostamento nella tabella e l’indirizzo fisico della voce, in entrambe le basi.",
        "fields": [
          {
            "label": "Spostamento in byte",
            "answer": "328",
            "accept": [],
            "numeric": true,
            "hint": "Converti l’indice esadecimale e moltiplicalo per la dimensione della voce."
          },
          {
            "label": "Indirizzo della PTE, in esadecimale",
            "answer": "0x240148",
            "accept": [],
            "numeric": true,
            "hint": "Aggiungi lo spostamento alla base mantenendo la stessa base numerica."
          },
          {
            "label": "Indirizzo della PTE, in decimale",
            "answer": "2359624",
            "accept": [],
            "numeric": true,
            "hint": "Parti dalla base espressa in decimale e aggiungi lo stesso spostamento."
          }
        ],
        "steps": [
          "0x29 corrisponde a 41. Per raggiungere la voce occorrono 41 × 8 = 328 byte = 0x148.",
          "Il calcolo in esadecimale dà 0x240000 + 0x148 = 0x240148. In decimale equivale a 2359296 + 328 = 2359624.",
          "L’indirizzo ottenuto identifica la PTE. Una lettura della voce fornisce i campi da cui ricavare il frame del dato."
        ]
      }
    ]
  },
  {
    "id": "6.3.15",
    "title": "Due letture dipendenti",
    "kind": "campi",
    "skill": "Calcolare la latenza lungo la dipendenza",
    "principio": "Il secondo accesso richiede un indirizzo che dipende dal valore letto nel primo. Con memoria e traduzione seriali, la durata totale segue l’ordine delle due letture.",
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
        "prompt": "Nel modello a un livello, ogni accesso alla RAM richiede 58 ns. Il processore deve leggere prima la PTE e poi il dato. Entrambi sono residenti. TLB, cache e altri costi sono esclusi. Calcola la latenza complessiva.",
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
            "answer": "116",
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
          "Tra 0 e 58 ns viene letta la PTE all’indirizzo calcolato dalla base e dalla VPN. La PTE fornisce il PFN.",
          "Il processore combina PFN e offset. La lettura del dato si svolge tra 58 e 116 ns.",
          "La dipendenza sul PFN rende seriali i due accessi. Il tempo totale in questo modello è 58 + 58 = 116 ns."
        ]
      }
    ]
  },
  {
    "id": "6.3.16",
    "title": "Cambiare lo spazio di indirizzamento",
    "kind": "campi",
    "skill": "Selezionare la radice e il contesto della TLB",
    "principio": "Una traduzione è associata a una pagina di un determinato spazio di indirizzamento. Durante un cambio di processo deve rimanere coerente sia la radice attiva sia l’identità delle voci TLB riutilizzate.",
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
        "prompt": "Il processo P lascia la CPU a Q. Per la VPN 6, la tabella di P punta al frame 4 e quella di Q al frame 22. La TLB contiene ancora una traduzione di P. Scegli la radice da installare nel registro di base delle tabelle (PTBR) e come gestire il cambio di contesto.",
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
            "answer": "22",
            "accept": [],
            "numeric": true,
            "hint": "Segui la mappatura associata alla radice del processo che ha ottenuto la CPU."
          }
        ],
        "steps": [
          "La VPN 6 appartiene sia allo spazio di P sia a quello di Q. Nel primo spazio identifica il frame 4. Nel secondo identifica il frame 22.",
          "Il sistema seleziona nel PTBR la radice della tabella di Q. Una ricerca in tale tabella segue la mappatura di Q.",
          "Una TLB indicizzata soltanto dalla VPN potrebbe ancora produrre il frame 4. Un identificatore di spazio di indirizzamento valido distingue le voci di P da quelle di Q. In sua assenza, il cambio di contesto richiede l’invalidazione appropriata.",
          "Durante l’esecuzione di Q, sia una ricerca in tabella sia una traduzione recuperata dalla TLB devono portare al frame 22."
        ]
      }
    ]
  },
  {
    "id": "6.3.17",
    "title": "Traduzione completa con pagine da 4 KiB",
    "kind": "assembly",
    "skill": "Scrivere un traduttore con controllo di validità",
    "principio": "La routine di traduzione legge una voce, verifica il bit di validità e compone il risultato solo sul ramo ammesso. Il contratto fissa il registro di ritorno e i registri da conservare.",
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
        "prompt": "Scrivi il frammento generale per pagine da 4096 byte. RDI contiene il VA e RSI la base di una tabella leggibile con voci da otto byte. Ogni PTE è (PFN << 1) | valid, con PFN a 14 bit. Consegna in RAX il PA della mappatura valida oppure 0xFFFFFFFFFFFFFFFF sul ramo di errore. Puoi usare RCX e modificare i flag. Conserva RDI e RSI. Traccia poi VA 0x202B con PTE 23 e PTE 22.",
        "fields": [
          {
            "label": "Risultato con PTE 23",
            "answer": "0xB02B",
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
          "La divisione di 0x202B per 4096 dà VPN 2 e resto 43 = 0x2B. La voce selezionata comincia 2 × 8 = 16 byte dopo la base della tabella.",
          "Con PTE 23, il bit 0 vale 1. Lo shift di un bit restituisce PFN 11. La base del frame è 11 × 4096 = 0xB000. La maschera 0xFFF estrae 0x2B dal VA. OR compone 0xB02B = 45099.",
          "Con PTE 22, il bit 0 vale 0. TEST seguito da JZ porta al ramo di errore. MOV RAX, -1 scrive tutti i 64 bit a uno. Il salto dopo il percorso valido scavalca quel ramo."
        ],
        "code": "mov rax, rdi\nshr rax, 12\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 12\nmov rcx, rdi\nand ecx, 4095\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
        "bits": 12,
        "va": "0x202B",
        "pte": 23,
        "invalidPte": 22,
        "family": "walker",
        "pfn": 11,
        "base": "0x200000"
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
    "prompt": "Scrivi il frammento generale per pagine da 1024 byte. RDI contiene il VA e RSI la base di una tabella leggibile con voci da otto byte. Ogni PTE è (PFN << 1) | valid, con PFN a 14 bit. Consegna in RAX il PA della mappatura valida oppure 0xFFFFFFFFFFFFFFFF sul ramo di errore. Puoi usare RCX e modificare i flag. Conserva RDI e RSI. Traccia poi VA 0xC33 con PTE 35 e PTE 34. Ripeti anche con PTE 1 allo stesso VA.",
    "fields": [
      {
        "label": "Risultato con PTE 35",
        "answer": "0x4433",
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
      },
      {
        "label": "RAX con PTE 1",
        "answer": "0x33",
        "accept": [],
        "numeric": true,
        "hint": "Controlla separatamente il bit di validità e il valore del PFN."
      }
    ],
    "steps": [
      "La divisione di 0xC33 per 1024 dà VPN 3 e resto 51 = 0x33. La voce selezionata comincia 3 × 8 = 24 byte dopo la base della tabella.",
      "Con PTE 35, il bit 0 vale 1. Lo shift di un bit restituisce PFN 17. La base del frame è 17 × 1024 = 0x4400. La maschera 0x3FF estrae 0x33 dal VA. OR compone 0x4433 = 17459.",
      "Con PTE 34, il bit 0 vale 0. TEST seguito da JZ porta al ramo di errore. MOV RAX, -1 scrive tutti i 64 bit a uno. Il salto dopo il percorso valido scavalca quel ramo.",
      "Per PTE 1, valid = 1 e PFN = 1 >> 1 = 0. La base fisica del frame zero è 0. Il risultato valido coincide con lo spostamento, 0x33 = 51."
    ],
    "code": "mov rax, rdi\nshr rax, 10\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
    "bits": 10,
    "va": "0xC33",
    "pte": 35,
    "invalidPte": 34,
    "variants": [
      {
        "prompt": "Scrivi il frammento generale per pagine da 1024 byte. RDI contiene il VA e RSI la base di una tabella leggibile con voci da otto byte. Ogni PTE è (PFN << 1) | valid, con PFN a 14 bit. Consegna in RAX il PA della mappatura valida oppure 0xFFFFFFFFFFFFFFFF sul ramo di errore. Puoi usare RCX e modificare i flag. Conserva RDI e RSI. Traccia poi VA 0x140A con PTE 19 e PTE 18. Ripeti anche con PTE 1 allo stesso VA.",
        "fields": [
          {
            "label": "Risultato con PTE 19",
            "answer": "0x240A",
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
          },
          {
            "label": "RAX con PTE 1",
            "answer": "0xA",
            "accept": [],
            "numeric": true,
            "hint": "Controlla separatamente il bit di validità e il valore del PFN."
          }
        ],
        "steps": [
          "La divisione di 0x140A per 1024 dà VPN 5 e resto 10 = 0xA. La voce selezionata comincia 5 × 8 = 40 byte dopo la base della tabella.",
          "Con PTE 19, il bit 0 vale 1. Lo shift di un bit restituisce PFN 9. La base del frame è 9 × 1024 = 0x2400. La maschera 0x3FF estrae 0xA dal VA. OR compone 0x240A = 9226.",
          "Con PTE 18, il bit 0 vale 0. TEST seguito da JZ porta al ramo di errore. MOV RAX, -1 scrive tutti i 64 bit a uno. Il salto dopo il percorso valido scavalca quel ramo.",
          "Per PTE 1, valid = 1 e PFN = 1 >> 1 = 0. La base fisica del frame zero è 0. Il risultato valido coincide con lo spostamento, 0xA = 10."
        ],
        "code": "mov rax, rdi\nshr rax, 10\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 10\nmov rcx, rdi\nand ecx, 1023\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
        "bits": 10,
        "va": "0x140A",
        "pte": 19,
        "invalidPte": 18,
        "family": "walker",
        "pfn": 9,
        "base": "0x200000"
      }
    ],
    "family": "walker",
    "pfn": 17,
    "base": "0x200000"
  },
  {
    "id": "6.3.19",
    "title": "La voce oltre la fine della tabella",
    "kind": "assembly",
    "skill": "Controllare la precondizione di leggibilità",
    "principio": "La validità del contenuto di una voce si verifica dopo averla letta. Il limite dell’array richiede un controllo precedente alla lettura, basato sul numero di voci disponibili.",
    "prompt": "Scrivi il frammento generale per pagine da 2048 byte. RDI contiene il VA e RSI la base di una tabella leggibile con voci da otto byte. Ogni PTE è (PFN << 1) | valid, con PFN a 14 bit. Consegna in RAX il PA della mappatura valida oppure 0xFFFFFFFFFFFFFFFF sul ramo di errore. Puoi usare RCX e modificare i flag. Conserva RDI e RSI. Traccia poi VA 0x1833 con PTE 35 e PTE 34. Per l’ultima verifica ipotizza che il chiamante fornisca soltanto 3 voci. Stabilisci dove deve avvenire il controllo del limite.",
    "fields": [
      {
        "label": "Risultato con PTE 35",
        "answer": "0x8833",
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
      },
      {
        "label": "Tabella con 3 voci",
        "answer": "Prima del caricamento, rifiutare la VPN pari alla lunghezza",
        "accept": [],
        "numeric": false,
        "choices": [
          "Acquisire la PTE, poi controllare il PFN",
          "Prima del caricamento, rifiutare la VPN pari alla lunghezza",
          "Accettare un valore dispari letto oltre la tabella"
        ],
        "hint": "Gli indici ammessi vanno da zero alla lunghezza meno uno."
      }
    ],
    "steps": [
      "La divisione di 0x1833 per 2048 dà VPN 3 e resto 51 = 0x33. La voce selezionata comincia 3 × 8 = 24 byte dopo la base della tabella.",
      "Con PTE 35, il bit 0 vale 1. Lo shift di un bit restituisce PFN 17. La base del frame è 17 × 2048 = 0x8800. La maschera 0x7FF estrae 0x33 dal VA. OR compone 0x8833 = 34867.",
      "Con PTE 34, il bit 0 vale 0. TEST seguito da JZ porta al ramo di errore. MOV RAX, -1 scrive tutti i 64 bit a uno. Il salto dopo il percorso valido scavalca quel ramo.",
      "Una tabella di 3 voci ha indici da 0 a 2. La lettura a base+24 comincerebbe al primo byte oltre la tabella. Per questo frammento il chiamante garantisce una voce leggibile. Una funzione che riceve la lunghezza deve confrontare VPN e lunghezza prima di eseguire MOV dalla memoria."
    ],
    "code": "mov rax, rdi\nshr rax, 11\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
    "bits": 11,
    "va": "0x1833",
    "pte": 35,
    "invalidPte": 34,
    "variants": [
      {
        "prompt": "Scrivi il frammento generale per pagine da 2048 byte. RDI contiene il VA e RSI la base di una tabella leggibile con voci da otto byte. Ogni PTE è (PFN << 1) | valid, con PFN a 14 bit. Consegna in RAX il PA della mappatura valida oppure 0xFFFFFFFFFFFFFFFF sul ramo di errore. Puoi usare RCX e modificare i flag. Conserva RDI e RSI. Traccia poi VA 0x201D con PTE 25 e PTE 24. Per l’ultima verifica ipotizza che il chiamante fornisca soltanto 4 voci. Stabilisci dove deve avvenire il controllo del limite.",
        "fields": [
          {
            "label": "Risultato con PTE 25",
            "answer": "0x601D",
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
          },
          {
            "label": "Tabella con 4 voci",
            "answer": "Prima del caricamento, rifiutare la VPN pari alla lunghezza",
            "accept": [],
            "numeric": false,
            "choices": [
              "Acquisire la PTE, poi controllare il PFN",
              "Prima del caricamento, rifiutare la VPN pari alla lunghezza",
              "Accettare un valore dispari letto oltre la tabella"
            ],
            "hint": "Gli indici ammessi vanno da zero alla lunghezza meno uno."
          }
        ],
        "steps": [
          "La divisione di 0x201D per 2048 dà VPN 4 e resto 29 = 0x1D. La voce selezionata comincia 4 × 8 = 32 byte dopo la base della tabella.",
          "Con PTE 25, il bit 0 vale 1. Lo shift di un bit restituisce PFN 12. La base del frame è 12 × 2048 = 0x6000. La maschera 0x7FF estrae 0x1D dal VA. OR compone 0x601D = 24605.",
          "Con PTE 24, il bit 0 vale 0. TEST seguito da JZ porta al ramo di errore. MOV RAX, -1 scrive tutti i 64 bit a uno. Il salto dopo il percorso valido scavalca quel ramo.",
          "Una tabella di 4 voci ha indici da 0 a 3. La lettura a base+32 comincerebbe al primo byte oltre la tabella. Per questo frammento il chiamante garantisce una voce leggibile. Una funzione che riceve la lunghezza deve confrontare VPN e lunghezza prima di eseguire MOV dalla memoria."
        ],
        "code": "mov rax, rdi\nshr rax, 11\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 11\nmov rcx, rdi\nand ecx, 2047\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
        "bits": 11,
        "va": "0x201D",
        "pte": 25,
        "invalidPte": 24,
        "family": "walker",
        "pfn": 12,
        "base": "0x200000"
      }
    ],
    "family": "walker",
    "pfn": 17,
    "base": "0x200000"
  },
  {
    "id": "6.3.20",
    "title": "La larghezza della sentinella",
    "kind": "assembly",
    "skill": "Restituire una sentinella a 64 bit",
    "principio": "In x86-64 una scrittura in EAX azzera la metà alta di RAX. La larghezza della scrittura incide quindi sul confronto del risultato con una sentinella di 64 bit.",
    "prompt": "Scrivi il frammento generale per pagine da 8192 byte. RDI contiene il VA e RSI la base di una tabella leggibile con voci da otto byte. Ogni PTE è (PFN << 1) | valid, con PFN a 14 bit. Consegna in RAX il PA della mappatura valida oppure 0xFFFFFFFFFFFFFFFF sul ramo di errore. Puoi usare RCX e modificare i flag. Conserva RDI e RSI. Traccia poi VA 0x6033 con PTE 35 e PTE 34. Determina inoltre quale differente valore a 64 bit produrrebbe MOV EAX, -1 sul ramo di errore.",
    "fields": [
      {
        "label": "Risultato con PTE 35",
        "answer": "0x22033",
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
      },
      {
        "label": "RAX dopo MOV EAX, -1",
        "answer": "0x00000000FFFFFFFF",
        "accept": [],
        "numeric": true,
        "hint": "Una scrittura in EAX azzera i 32 bit superiori di RAX."
      }
    ],
    "steps": [
      "La divisione di 0x6033 per 8192 dà VPN 3 e resto 51 = 0x33. La voce selezionata comincia 3 × 8 = 24 byte dopo la base della tabella.",
      "Con PTE 35, il bit 0 vale 1. Lo shift di un bit restituisce PFN 17. La base del frame è 17 × 8192 = 0x22000. La maschera 0x1FFF estrae 0x33 dal VA. OR compone 0x22033 = 139315.",
      "Con PTE 34, il bit 0 vale 0. TEST seguito da JZ porta al ramo di errore. MOV RAX, -1 scrive tutti i 64 bit a uno. Il salto dopo il percorso valido scavalca quel ramo.",
      "MOV EAX, -1 scrive 0xFFFFFFFF nella metà bassa e azzera la metà alta di RAX. Il registro intero varrebbe 0x00000000FFFFFFFF. Un confronto a 64 bit con la sentinella 0xFFFFFFFFFFFFFFFF distinguerebbe i due valori."
    ],
    "code": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 13\nmov rcx, rdi\nand ecx, 8191\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
    "bits": 13,
    "va": "0x6033",
    "pte": 35,
    "invalidPte": 34,
    "variants": [
      {
        "prompt": "Scrivi il frammento generale per pagine da 8192 byte. RDI contiene il VA e RSI la base di una tabella leggibile con voci da otto byte. Ogni PTE è (PFN << 1) | valid, con PFN a 14 bit. Consegna in RAX il PA della mappatura valida oppure 0xFFFFFFFFFFFFFFFF sul ramo di errore. Puoi usare RCX e modificare i flag. Conserva RDI e RSI. Traccia poi VA 0x4021 con PTE 27 e PTE 26. Determina inoltre quale differente valore a 64 bit produrrebbe MOV EAX, -1 sul ramo di errore.",
        "fields": [
          {
            "label": "Risultato con PTE 27",
            "answer": "0x1A021",
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
          },
          {
            "label": "RAX dopo MOV EAX, -1",
            "answer": "0x00000000FFFFFFFF",
            "accept": [],
            "numeric": true,
            "hint": "Una scrittura in EAX azzera i 32 bit superiori di RAX."
          }
        ],
        "steps": [
          "La divisione di 0x4021 per 8192 dà VPN 2 e resto 33 = 0x21. La voce selezionata comincia 2 × 8 = 16 byte dopo la base della tabella.",
          "Con PTE 27, il bit 0 vale 1. Lo shift di un bit restituisce PFN 13. La base del frame è 13 × 8192 = 0x1A000. La maschera 0x1FFF estrae 0x21 dal VA. OR compone 0x1A021 = 106529.",
          "Con PTE 26, il bit 0 vale 0. TEST seguito da JZ porta al ramo di errore. MOV RAX, -1 scrive tutti i 64 bit a uno. Il salto dopo il percorso valido scavalca quel ramo.",
          "MOV EAX, -1 scrive 0xFFFFFFFF nella metà bassa e azzera la metà alta di RAX. Il registro intero varrebbe 0x00000000FFFFFFFF. Un confronto a 64 bit con la sentinella 0xFFFFFFFFFFFFFFFF distinguerebbe i due valori."
        ],
        "code": "mov rax, rdi\nshr rax, 13\nmov rax, [rsi + rax*8]\ntest rax, 1\njz .Linvalid\nshr rax, 1\nshl rax, 13\nmov rcx, rdi\nand ecx, 8191\nor rax, rcx\njmp .Ldone\n.Linvalid:\nmov rax, -1\n.Ldone:",
        "bits": 13,
        "va": "0x4021",
        "pte": 27,
        "invalidPte": 26,
        "family": "walker",
        "pfn": 13,
        "base": "0x200000"
      }
    ],
    "family": "walker",
    "pfn": 17,
    "base": "0x200000"
  }
];
