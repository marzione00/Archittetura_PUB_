'use strict';
(() => {
  const unit = (id, domanda, controlli, calcola, previsione) => {
    SL.unita[id] = { teoria: SL.lezioni[id].join(' '), domanda, controlli, calcola, previsione };
  };
  function previsione(label, campo = label, passo = -1) {
    return { label, valore: (_p, passi) => Object.fromEntries(passi.at(passo).valori)[campo] };
  }
  const n = (id, label, min, max, iniziale, step = 1) => ({ id, label, min, max, step, iniziale });
  const sel = (id, label, opzioni, iniziale = opzioni[0][0]) => ({ id, label, opzioni, iniziale });
  const st = (titolo, testo, valori) => ({ titolo, testo, valori });
  const hex = x => '0x' + x.toString(16).toUpperCase();
  const fmt = x => Number(x.toFixed(6)).toLocaleString('it-IT', { maximumFractionDigits: 6 });

  // Una cache diretta con write-allocate e write-back; i contatori partono da zero.
  function cacheTrace(refs, size, sets) {
    const slots = Array(sets).fill(null);
    let hits = 0, writebacks = 0;
    return refs.map(([address, write]) => {
      const block = Math.floor(address / size);
      const index = block % sets;
      const tag = Math.floor(block / sets);
      const old = slots[index];
      const hit = old !== null && old.tag === tag;
      if (hit) hits++;
      if (!hit && old && old.dirty) writebacks++;
      const dirty = Boolean(write || (hit && old.dirty));
      slots[index] = { tag, dirty };
      return { address, write, block, index, tag, old, dirty, hit, hits, writebacks };
    });
  }
  const cacheStep = (r, i) => st('Accesso ' + (i + 1) + ' · ' + (r.write ? 'scrittura' : 'lettura'),
    'Indirizzo ' + hex(r.address) + ', blocco ' + r.block + '. ' +
    (r.hit ? 'Il tag coincide con quello della linea valida.' :
      r.old ? 'La posizione ospitava il tag ' + r.old.tag + (r.old.dirty ? ', da riscrivere in memoria.' : ', pulito e sostituibile.') :
        'La posizione era vuota. La cache carica il blocco.'),
    [['Indice', r.index], ['Tag', r.tag], ['Esito', r.hit ? 'hit' : 'miss'], ['Dirty finale', Number(r.dirty)], ['Hit cumulati', r.hits], ['Write-back cumulati', r.writebacks]]);

  unit('6.1.1',
    'Da quale livello proviene il byte del secondo caricamento?',
    [n('a', 'Indirizzo del secondo byte', 0, 127, 8)], p => {
      let t = 0;
      return [st('Prima del caricamento', 'La CPU emette una lettura all’indirizzo 0. La cache parte vuota, con due linee da 64 byte.', [['Registro R0', 'in attesa'], ['Tempo', '0 ns']]),
        ...cacheTrace([[0,false],[p.a,false]],64,2).map((r,i) => {
          const cost = r.hit ? 2 : 52; t += cost;
          return st('Caricamento ' + (i+1), (r.hit ? 'La cache consegna il byte residente' : 'La RAM rifornisce la cache, che consegna il byte') + ' e R0 riceve M[' + r.address + '].',
            [['Blocco', r.block], ['Sorgente', r.hit ? 'cache' : 'RAM'], ['Costo', cost + ' ns'], ['Tempo cumulato', t + ' ns']]);
        })];
    }, previsione('Sorgente del secondo caricamento (cache o RAM)', 'Sorgente'));

  unit('6.1.2',
    'Quante letture della seconda scansione trovano già in cache il blocco richiesto?',
    [sel('stride','Passo in interi',[['1','Un intero'],['4','Quattro interi'],['16','Sedici interi'],['32','Trentadue interi']])], p => {
      const refs = Array.from({length:8}, (_,i)=>[(i%4)*Number(p.stride)*4,false]);
      const trace=cacheTrace(refs,64,2);
      const hitPerPassata=[trace.slice(0,4),trace.slice(4)].map(passata=>passata.filter(r=>r.hit).length);
      return [st('Array allineato', 'Due scansioni di quattro interi selezionati. Ogni intero occupa quattro byte. La cache diretta contiene due linee da 64 byte.', [['Passo in byte',4*Number(p.stride)],['Indirizzi per scansione',refs.slice(0,4).map(r=>r[0]).join(', ')]]),
        ...trace.map(cacheStep),
        st('Confronto delle scansioni','Quattro richieste per scansione. Una singola linea può servire più richieste consecutive.',[['Hit nella prima scansione',hitPerPassata[0]],['Hit nella seconda scansione',hitPerPassata[1]],['Miss nella seconda scansione',4-hitPerPassata[1]]])];
    }, previsione('Hit nella seconda scansione'));

  unit('6.1.3',
    'Quanto cresce la latenza media quando aumentano i miss a parità di penalità?',
    [n('m','Miss ogni cento accessi',0,100,10),n('pen','Penalità aggiuntiva (ns)',10,100,50,10)], p => [
      st('Consultazione', 'Cento richieste interrogano la cache, a 2 ns ciascuna.', [['Costo comune','200 ns'],['Hit',100-p.m]]),
      st('Rifornimenti','Ogni miss aggiunge un trasferimento dal livello inferiore.', [['Miss',p.m],['Tempo aggiuntivo',p.m*p.pen+' ns']]),
      st('Media','Dividi il tempo totale dei cento accessi per cento.',[['Totale',200+p.m*p.pen+' ns'],['AMAT',fmt(2+p.m*p.pen/100)+' ns']])]);

  unit('6.2.1',
    'Quando A e B raggiungono lo stesso byte fisico usando il medesimo indirizzo virtuale?',
    [n('offset','Scostamento nella pagina',0,4095,100),n('frame','Frame di B per VPN 3',2,12,8)], p => [
      st('Indirizzo emesso','A e B leggono lo stesso byte virtuale in pagina 3.',[['VA',hex(3*4096+p.offset)],['Scostamento',p.offset]]),
      st('Tabella di A','La voce 3 di A indica il frame 4. La base fisica vale 4 × 4096.',[['PFN',4],['PA di A',hex(4*4096+p.offset)]]),
      st('Tabella di B','La voce 3 della seconda tabella indica il frame '+p.frame+'. '+(p.frame===4?'Entrambe le traduzioni raggiungono il medesimo byte fisico.':'Le due traduzioni raggiungono byte fisici distinti.'),[['PFN',p.frame],['PA di B',hex(p.frame*4096+p.offset)]])]);

  unit('6.2.2',
    'In quale dei tre casi il kernel deve leggere il file prima che il processo ottenga il byte?',
    [sel('cond','Pagina richiesta',[['file','Pagina di file assente'],['ram','Pagina residente e leggibile'],['fuori','Indirizzo fuori dalle regioni']])], p => {
      const present=p.cond==='ram', valid=p.cond!=='fuori';
      return [st('Richiesta','Il processo legge VPN 2, offset 16.',[['Permesso della regione',valid?'lettura':'nessuna regione'],['Present',Number(present)]]),
        st(present?'Traduzione immediata':'Eccezione sincrona',present?'La MMU trova il frame 7.':valid?'Il kernel individua nel file il contenuto della pagina e dispone la lettura verso il frame libero 7.':'Il kernel cerca la regione che copre l’indirizzo e accerta un accesso illegittimo.',[['Letture da file',Number(valid&&!present)],['Frame destinazione',valid?7:'—']]),
        st('Esito',present?'La CPU legge direttamente il byte.':valid?'Completato il trasferimento, il kernel imposta present e riavvia il caricamento.':'Il sistema segnala al processo la violazione di accesso.',[['Present finale',Number(valid)],['PA del dato',valid?hex(7*4096+16):'—'],['Istruzioni ritentate',Number(valid&&!present)]])];
    }, previsione('Letture da file', 'Letture da file', 1));

  const pages = ['A','B','A','C','D','A','C'];
  unit('6.2.3',
    'Quanti frame aggiuntivi servirebbero per tenere tutte le pagine distinte dell’ultima finestra?',
    [n('w','Ampiezza della finestra',2,5,4),n('f','Frame disponibili',1,4,3)], p=>{
      const lru=[]; let faults=0;
      return pages.map((page,i)=>{
        const pos=lru.indexOf(page), hit=pos>=0;
        const victim=!hit&&lru.length===p.f ? lru.shift() : null;
        if(hit) lru.splice(pos,1); else faults++;
        lru.push(page);
        const window=pages.slice(Math.max(0,i-p.w+1),i+1);
        const set=[...new Set(window)];
        return st('Riferimento '+(i+1)+' · '+page,hit?'La pagina è residente e diventa la più recente.':victim?'Manca la pagina. LRU espelle '+victim+'.':'Manca la pagina e un frame libero la accoglie.',
          [['Finestra',window.join(' ')],['Insieme',set.join(', ')],['Pagine distinte',set.length],['Residenti, dalla meno recente',lru.join(' ')],['Frame aggiuntivi per l’insieme',Math.max(0,set.length-p.f)],['Fault cumulati',faults]]);
      });
    }, previsione('Frame aggiuntivi per l’ultima finestra', 'Frame aggiuntivi per l’insieme'));

  unit('6.2.4',
    'Quale latenza media produce la frequenza di fault scelta?',
    [n('fault','Fault per milione di richieste',0,2000,1000,10),n('ms','Penalità per fault (ms)',1,10,1)], p=>[
      st('Intervallo osservato','Un milione di richieste richiede 100 ns di servizio ordinario ciascuna.',[['Costo ordinario','100 000 000 ns'],['Fault osservati',p.fault]]),
      st('Conversione','Un millisecondo contiene un milione di nanosecondi.',[['Penalità per fault',fmt(p.ms*1e6)+' ns'],['Penalità totale',fmt(p.fault*p.ms*1e6)+' ns']]),
      st('Costo effettivo','Ripartisci la penalità totale su un milione di richieste, poi aggiungi 100 ns.',[['Supplemento medio',fmt(p.fault*p.ms)+' ns'],['Tempo medio',fmt(100+p.fault*p.ms)+' ns']])]);

  unit('6.4.1',
    'Quante consultazioni della tabella richiedono le tre letture?',
    [sel('seq','Contesti delle tre letture',[['AAB','A, A, B'],['ABA','A, B, A'],['AAA','A, A, A']]),n('cap','Voci della TLB',1,2,2)],p=>{
      const tlb=[]; let walks=0;
      return [...p.seq].map((asid,i)=>{
        const at=tlb.indexOf(asid), hit=at>=0;
        if(hit) tlb.splice(at,1);
        else {walks++;if(tlb.length===p.cap)tlb.shift();}
        tlb.push(asid);
        const frame=asid==='A'?7:12;
        return st('Lettura '+(i+1)+' · spazio '+asid,(hit?'La TLB riusa la traduzione.':'La MMU consulta la tabella residente e inserisce la traduzione.')+' La richiesta riguarda VPN 3, offset 15, con pagine da 4 KiB. La tabella di '+asid+' associa VPN 3 al frame '+frame+'.',
          [['Esito',hit?'hit':'miss'],['Chiavi residenti LRU → MRU',tlb.map(a=>a+' / 3').join(', ')],['Consultazioni delle tabelle',walks],['PA',hex(frame*4096+15)]]);
      });
    }, previsione('Consultazioni delle tabelle'));

  unit('6.4.2',
    'Quanto spazio occupano la radice e le figlie allocate nelle regioni scelte?',
    [n('bits','Bit dell’indirizzo virtuale',24,36,32),sel('off','Dimensione della pagina',[['12','4 KiB'],['14','16 KiB']]),n('used','Regioni con pagine mappate',1,8,2)],p=>{
      const v=p.bits-Number(p.off), low=Math.floor(v/2), roots=2**(v-low), leaves=2**low;
      return [st('Conteggio delle pagine','Tolti i bit di offset, i restanti bit selezionano la pagina.',[['Bit VPN',v],['Pagine indirizzabili',2**v]]),
        st('Tabella lineare','Ogni VPN possiede uno spazio di otto byte per la propria voce.',[['Voci',2**v],['Byte',8*2**v]]),
        st('Due livelli','Ogni regione attiva richiede una figlia completa, oltre all’intera radice.',[['Voci nella radice',roots],['Voci per figlia',leaves],['Figlie allocate',p.used],['Byte complessivi',8*(roots+p.used*leaves)]])];
    });

  function walkParts(va,low) {
    const vpn=Math.floor(va/4096);
    return { high:Math.floor(vpn/2**low), low:vpn%2**low, off:va%4096 };
  }
  unit('6.4.3',
    'Quale esito produce il percorso attraverso i due livelli della tabella?',
    [n('i','Indice nella radice',0,1023,3),n('j','Indice nella figlia',0,1023,5),n('d','Offset',0,4095,77),sel('pres','Stato della foglia',[['1','Presente'],['0','Assente']])],p=>{
      const va=(p.i*1024+p.j)*4096+p.d, f=walkParts(va,10);
      const root=0x100000, child=0x300000+p.i*8192, frame=8+(p.j%32), leaf=Number(p.pres)?2*frame+1:0;
      return [st('Scomposizione','La MMU separa i campi di '+hex(va)+'.',[['Indice L1',f.high],['Indice L2',f.low],['Offset',f.off]]),
        st('Lettura della radice','La radice inizia a '+hex(root)+'. La voce scelta contiene un puntatore fisico alla figlia.',[['Indirizzo voce L1',hex(root+8*f.high)],['Base L2 letta',hex(child)]]),
        st('Lettura della foglia','Si somma alla base appena letta otto volte l’indice inferiore.',[['Indirizzo voce L2',hex(child+8*f.low)],['PTE letta',leaf],['Present',leaf%2]]),
        st('Esito',leaf?'La rimozione del bit present restituisce il PFN. Lo scostamento completa l’indirizzo.':'La MMU solleva l’eccezione di pagina assente. La traduzione si arresta alla foglia.',[['PFN',leaf?Math.floor(leaf/2):'—'],['PA',leaf?hex(Math.floor(leaf/2)*4096+f.off):'—']])];
    });

  unit('6.4.4',
    'Quanto pesa un livello di tabella in più sul tempo medio di accesso?',
    [n('levels','Livelli della tabella',1,4,2),n('hits','Hit per cento richieste',0,100,90)],p=>[
      st('Percorso di hit','La consultazione della TLB costa 1 ns e la lettura dei dati costa 50 ns.',[['Letture RAM',1],['Costo','51 ns']]),
      st('Percorso di miss','La TLB viene interrogata una volta. Il percorso legge una voce per livello e infine il dato.',[['Letture RAM',p.levels+1],['Costo',51+50*p.levels+' ns']]),
      st('Media ponderata','Distribuisci il costo delle letture supplementari su cento richieste.',[['Hit',p.hits],['Miss',100-p.hits],['Tempo medio',fmt(51+50*p.levels*(100-p.hits)/100)+' ns']])]);

  unit('6.5.1',
    'Rimosso il nome usato per la scrittura, quale byte si legge attraverso l’altro nome?',
    [sel('name','Nome usato per scrivere',[['appunti','appunti'],['copia','copia']]),n('value','Nuovo primo byte',0,255,90)],p=>{
      const other=p.name==='appunti'?'copia':'appunti';
      return [st('Creazione del collegamento','Il file appunti possiede inode 42. La creazione di copia aggiunge una seconda associazione.',[['appunti',42],['copia',42],['Link',2],['Primo byte',65]]),
        st('Scrittura','Tramite '+p.name+' si aggiorna il primo byte nel blocco dell’inode 42.',[['Letto da appunti',p.value],['Letto da copia',p.value]]),
        st('Rimozione di '+p.name,'Si elimina una sola voce di directory. Il nome '+other+' continua a raggiungere il blocco.',[['Nome residuo',other],['Link',1],['Primo byte',p.value]])];
    });

  const dirs={2:{corso:7,casa:11},7:{testo:31,dati:42},11:{testo:55}};
  const parents={2:2,7:2,11:2};
  function pathTrace(path,cwd) {
    let inode=path.startsWith('/')?2:cwd;
    const steps=[st('Punto di partenza',path.startsWith('/')?'Il percorso assoluto parte dalla radice.':'Il percorso relativo parte dalla directory corrente.',[['Percorso',path],['Inode corrente',inode]])];
    for(const part of path.split('/').filter(Boolean)){
      const old=inode;
      inode=dirs[inode] ? (part==='..'?parents[inode]:part==='.'?inode:dirs[inode][part]) : undefined;
      steps.push(st('Componente '+part,inode===undefined?'La ricerca si arresta: manca una voce utilizzabile.':part==='..'?'Si raggiunge la directory padre.':part==='.'?'Si conserva la directory corrente.':'Si consulta la voce nella directory '+old+'.',[['Inode di partenza',old],['Inode raggiunto',inode??'—']]));
      if(inode===undefined) break;
    }
    steps.push(st('Risultato',inode===undefined?'Il percorso termina con un errore di risoluzione.':'La sequenza dei componenti identifica l’oggetto finale.',[['Inode finale',inode??'—'],['Tipo',inode===undefined?'—':dirs[inode]?'directory':'file']]));
    return steps;
  }
  unit('6.5.2',
    'Quale inode identifica il percorso scelto dalla directory di partenza?',
    [sel('cwd','Directory corrente',[['7','/corso'],['11','/casa']]),sel('path','Percorso',[['./testo','./testo'],['../corso/dati','../corso/dati'],['/casa/testo','/casa/testo'],['dati','dati']])],
    p=>pathTrace(p.path,Number(p.cwd)), previsione('Inode finale (oppure —)', 'Inode finale'));

  const divUp=(v,s)=>Math.ceil(v/s);
  unit('6.5.3',
    'Quale blocco fisico contiene l’ultimo byte del file?',
    [n('size','Lunghezza del file (byte)',1,12288,4097),sel('mode','Metodo',[['cont','Contigua'],['chain','Catena FAT'],['index','Indicizzata']])],p=>{
      const count=divUp(p.size,4096), last=count-1, chain=[7,14,5].slice(0,count);
      const target=p.mode==='cont'?7+last:chain[last];
      return [st('Dimensionamento','Dividi la lunghezza per 4096 e arrotonda verso l’alto.',[['Blocchi dati',count],['Capienza',count*4096+' byte']]),
        st('Posizione logica','L’ultimo byte ha posizione S − 1 contando da zero.',[['Indice del blocco',last],['Offset interno',(p.size-1)%4096]]),
        st('Posizione fisica',p.mode==='cont'?'Il primo blocco è 7. Aggiungi l’indice logico.':p.mode==='chain'?'Dal primo blocco segui la catena '+chain.join(' → ')+'.':'La tabella contiene in ordine '+chain.join(', ')+'. Leggi la voce di indice '+last+'.',[['Blocco fisico',target],['Byte inutilizzati',count*4096-p.size]])];
    }, previsione('Blocco fisico dell’ultimo byte', 'Blocco fisico'));

  const chains={a:[3,9,5,11],b:[8,4,12,6]};
  const blocchiOccupati = new Set(Object.values(chains).flat());
  const bitmapVolume = Array.from({length: 16}, (_, i) => Number(blocchiOccupati.has(i + 2))).join('');
  unit('6.5.4',
    'Quale blocco assegnato al file contiene il byte scelto?',
    [sel('file','Primo blocco',[['a','File A · blocco 3'],['b','File B · blocco 8']]),n('pos','Posizione del byte',0,4095,2400)],p=>{
      const chain=chains[p.file], k=Math.floor(p.pos/1024);
      const steps=[st('Directory','Il file occupa quattro blocchi dati da 1024 byte. La directory indica soltanto il primo.',[['Blocco iniziale',chain[0]],['FAT del file',chain.join(' → ')+' → fine'],['Bitmap (blocchi 2–17)',bitmapVolume],['Blocchi liberi',bitmapVolume.length-blocchiOccupati.size]]),
        st('Coordinate logiche','Il quoziente seleziona il blocco nel file, il resto seleziona il byte.',[['Indice logico',k],['Offset',p.pos%1024]])];
      for(let i=0;i<k;i++)steps.push(st('Passaggio '+(i+1),'La voce FAT['+chain[i]+'] indica il blocco successivo.',[['Blocco sorgente',chain[i]],['Blocco successivo',chain[i+1]]]));
      steps.push(st('Lettura','La catena è giunta all’indice richiesto.',[['Blocco dati',chain[k]],['Offset',p.pos%1024],['Successori seguiti',k]]));
      return steps;
    }, previsione('Blocco dati'));

  function allocDiagnosis(bit,ptr){
    if(ptr&&!bit)return 'riferimento a blocco libero';
    if(bit&&!ptr)return 'blocco riservato e irraggiungibile';
    return ptr?'blocco raggiungibile e allocato':'blocco libero e irraggiungibile';
  }
  unit('6.6.1',
    'Quale contenuto del blocco 9 è visibile dal file dopo l’arresto?',
    [sel('order','Ordine durevole',[['dbi','Dati → bitmap → inode'],['idb','Inode → dati → bitmap'],['bid','Bitmap → inode → dati']]),n('cut','Scritture durevoli al crash',0,3,2)],p=>{
      const written=p.order.slice(0,p.cut);
      const bit=written.includes('b'), ptr=written.includes('i'), fresh=written.includes('d');
      return [st('Prima dell’estensione','Il blocco 9 è libero, privo di riferimenti e conserva vecchi byte.',[['Bitmap',0],['Puntatore','assente']]),
        st('Persistenza','Sopravvive il prefisso delle scritture scelto.',[['Ordine completo',[...p.order].map(c=>({d:'dati',b:'bitmap',i:'inode'})[c]).join(' → ')],['Scritture durevoli',p.cut],['Bitmap',Number(bit)],['Inode',ptr?'→ 9':'—']]),
        st('Dopo il riavvio','Il controllo classifica il blocco come '+allocDiagnosis(bit,ptr)+'.',[['Contenuto nel blocco',fresh?'nuovi dati':'vecchi dati'],['Contenuto visibile dal file',ptr?(fresh?'nuovi dati':'vecchi dati'):'nessuno']])];
    });

  unit('6.6.2',
    'Quale valore deve assumere il bit del blocco 12 dopo il controllo?',
    [sel('owner','Riferimento negli inode',[['1','Presente'],['0','Assente']]),sel('bit','Stato nella bitmap',[['0','Libero'],['1','Occupato']])],p=>{
      const owner=Number(p.owner), bit=Number(p.bit);
      return [st('Scansione degli inode','Il verificatore raccoglie i puntatori validi al blocco 12.',[['Riferimenti a 12',owner]]),
        st('Confronto','Il blocco risulta '+allocDiagnosis(bit,owner)+'.',[['Richiesto dagli inode',owner],['Bitmap osservata',bit]]),
        st('Riparazione',owner===bit?'Le due descrizioni concordano.':owner?'Imposta il bit a uno per impedire una seconda assegnazione.':'Libera il blocco orfano secondo la politica del modello.',[['Bit dopo il controllo',owner],['Bit modificati',Number(owner!==bit)]])];
    }, previsione('Bit dopo il controllo'));

  unit('6.6.3',
    'Quante immagini devono ancora cambiare nella sede definitiva al momento del recupero?',
    [n('stage','Ultimo passo durevole (0–4)',0,4,3)],p=>{
      const log=p.stage>=1, commit=p.stage>=2, a=p.stage>=3, b=p.stage>=4;
      return [st('Transazione','Le immagini iniziali dei blocchi A e B sono 2 e 4. La transazione vuole scrivere 7 e 9.',[['Passi 1 e 2','record A,B → commit'],['Passi 3 e 4','copia A → copia B']]),
        st('Al crash','Solo il prefisso indicato è durevole.',[['Record completi',log?'sì':'no'],['Commit',commit?'sì':'no'],['A su disco',a?7:2],['B su disco',b?9:4]]),
        st('Recupero',commit?'Il recupero può ripetere entrambe le immagini, comprese quelle già installate.':'La transazione priva di commit viene ignorata.',[['A finale',commit?7:2],['B finale',commit?9:4],['Immagini che richiedevano aggiornamento',commit?Number(!a)+Number(!b):0]])];
    });

  unit('6.6.4',
    'Quante scritture si contano fino al checkpoint nelle due modalità?',
    [n('data','Blocchi dati',1,8,3),n('meta','Blocchi di metadati',1,8,4),sel('mode','Modalità',[['full','Completa'],['ordered','Soli metadati, ordinata']])],p=>{
      const full=p.mode==='full', log=p.meta+(full?p.data:0);
      return [st('Prima del commit',full?'Si scrivono dati e metadati nel journal.':'Si rendono durevoli i dati nelle posizioni finali e si scrivono nel journal i metadati.',[['Scritture nel journal',log],['Scritture dati definitive',full?0:p.data],['Blocchi scritti prima del commit',log+(full?0:p.data)]]),
        st('Dopo il commit',full?'Il redo contiene tutte le immagini necessarie per installare dati e metadati.':'Il redo contiene le immagini dei metadati. I dati ordinati sono già durevoli.',[['Scritture definitive da completare',full?log:p.meta]]),
        st('Contabilità','Il commit conferma già la transazione. Il totale comprende anche il checkpoint, che installa le immagini nelle posizioni definitive.',[['Scritture totali',log+p.data+p.meta],['Dati riproducibili dal journal',full?'sì':'no']])];
    }, previsione('Scritture totali'));

  unit('6.7.1',
    'Per quali coppie di ruolo e operazione il servizio concede l’accesso?',
    [sel('role','Credenziali',[['studente','Studente autenticato'],['docente','Docente autenticato'],['anonimo','Credenziali assenti']]),sel('op','Operazione',[['lettura','Lettura'],['modifica','Modifica']])],p=>{
      const known=p.role!=='anonimo', allow=known&&(p.role==='docente'||p.op==='lettura');
      return [st('Identificazione','Il servizio esamina le credenziali della sessione.',[['Soggetto',known?p.role:'identità assente'],['Autenticazione',known?'riuscita':'richiesta']]),
        st('Politica',known?'La regola per il fascicolo associa le operazioni consentite al ruolo.':'La richiesta si ferma prima della consultazione dei diritti del ruolo.',[['Oggetto','fascicolo'],['Operazione',p.op],['Diritti del ruolo',known?(p.role==='docente'?'lettura, modifica':'lettura'):'—']]),
        st('Decisione',allow?(p.op==='lettura'?'Il servizio restituisce il fascicolo.':'Il servizio applica la modifica richiesta.'):'Il servizio rifiuta la richiesta.',[['Accesso',allow?'consentito':'negato'],['Modifiche applicate',Number(allow&&p.op==='modifica')]])];
    }, previsione('Accesso (consentito o negato)', 'Accesso'));

  unit('6.7.2',
    'Con i permessi scelti su /corso ed esiti, la richiesta di apertura riesce?',
    [sel('dir','Permessi su /corso',[['x','Solo attraversamento (x)'],['r','Solo elenco (r)'],['rx','Elenco e attraversamento (rx)']]),sel('file','Lettura su esiti',[['1','Concessa'],['0','Negata']])],p=>{
      const traverse=p.dir.includes('x'), read=p.file==='1';
      return [st('Radice','Il richiedente dispone di attraversamento sulla radice e trova corso.',[['Directory corrente','/corso'],['Nome cercato','esiti']]),
        st('Ricerca del nome',traverse?'Il bit x permette di cercare la voce esiti.':'Manca x. La risoluzione si arresta nella directory corso.',[['Permessi effettivi',p.dir],['Inode del file raggiunto',traverse?'sì':'no']]),
        st('Apertura',traverse?(read?'Il controllo di lettura sul file riesce e open restituisce un descrittore.':'La voce è raggiungibile. Il controllo di lettura sull’inode nega l’apertura.'):'Il controllo finale sul file resta ineseguito.',[['Lettura del file verificata',traverse?'sì':'no'],['Esito',traverse&&read?'aperto':'accesso negato']])];
    });

  unit('6.7.3',
    'Quali dati riesce a leggere l’osservatore nella posizione scelta?',
    [sel('where','Punto di osservazione',[['disk','Disco rimosso a macchina spenta'],['allow','Sessione sbloccata con lettura'],['deny','Sessione sbloccata senza lettura']])],p=>{
      const disk=p.where==='disk', allowed=p.where==='allow';
      return [st('Supporto','I blocchi del volume sono memorizzati in forma cifrata.',[['Posizione',disk?'dispositivo fisico':'interfaccia file'],['Volume montato',disk?'no':'sì']]),
        st('Mediazione',disk?'L’osservatore dispone del dispositivo e manca della chiave.':'Il sistema possiede la chiave del volume e valuta i diritti dell’account.',[['Chiave disponibile al sistema osservato',disk?'no':'sì'],['Controllo sul file',disk?'fuori percorso':allowed?'lettura concessa':'lettura negata']]),
        st('Osservazione',disk?'L’immagine del disco espone i blocchi cifrati.':allowed?'L’apertura autorizzata restituisce il testo in chiaro.':'Il servizio rifiuta l’apertura e restituisce un errore.',[['Risultato',disk?'testo cifrato':allowed?'testo in chiaro':'accesso negato']])];
    });

  const logbook=[
    [2,'ada','tesi','lettura','concessa'],[4,'leo','tesi','modifica','negata'],
    [6,'ada','tesi','modifica','concessa'],[8,'ada','dati','lettura','negata'],
    [9,'leo','tesi','lettura','concessa']
  ];
  unit('6.7.4',
    'Quante richieste respinte riguardano l’account e l’oggetto selezionati entro il minuto scelto?',
    [sel('user','Account',[['ada','ada'],['leo','leo']]),sel('obj','Oggetto',[['tesi','tesi'],['dati','dati']]),n('time','Minuto finale incluso',2,9,9)],p=>{
      const within=logbook.filter(e=>e[0]<=p.time), rows=within.filter(e=>e[1]===p.user&&e[2]===p.obj);
      return [st('Intervallo','I tempi sono minuti dall’avvio. Si includono gli estremi.',[['Intervallo','0–'+p.time],['Eventi nel periodo',within.length],['Registro · minuto / account / oggetto / operazione / esito',logbook.map(e=>e.join(' / ')).join('\n')]]),
        st('Filtro','Si mantengono soltanto le righe che corrispondono a entrambi i campi.',[['Account',p.user],['Oggetto',p.obj],['Righe selezionate',rows.length]]),
        st('Ricostruzione',rows.length?rows.map(e=>'Minuto '+e[0]+': '+e[3]+' '+e[4]).join('. ')+'.':'Nell’intervallo scelto manca una riga per questa coppia di account e oggetto.',[['Richieste concesse',rows.filter(e=>e[4]==='concessa').length],['Richieste negate',rows.filter(e=>e[4]==='negata').length]])];
    });

  // Ogni variante contiene i dati, le risposte verificabili e lo sviluppo completo.
  const num=(label,value,hint)=>({label,answer:String(value),numeric:true,hint});
  const choice=(label,choices,answer,hint)=>({label,choices,answer,hint});
  const ordine=(label,fasi,hint)=>({label,ordine:fasi,answer:fasi.join(' → '),numeric:false,hint});
  const variant=(consegna,campi,svolgimento,codice)=>({consegna,campi,svolgimento,...(codice?{codice}:{})});
  function prova(ch,u,id,titolo,principio,...varianti){
    (SL.prove['6.'+ch]??=[]).push({titolo,principio,unita:'6.'+ch+'.'+u,attivita:'cslez6_'+ch+'_'+id,varianti});
  }

  prova(1,1,'01_memory_technologies','Scegliere la tecnologia della cella',
    'Una cella conserva un bit, una cifra zero oppure uno. Nella SRAM, memoria statica, un circuito bistabile conserva uno fra due stati finché riceve alimentazione; nella DRAM, memoria dinamica, lo stato dipende dalla carica di un condensatore, che si disperde e richiede refresh, il ripristino periodico della carica. La latenza misura l’attesa della lettura e la densità quanti bit si raccolgono in una data area: la tecnologia della cella condiziona entrambe.',
    variant('Una cache sul chip privilegia una lettura rapida e conserva ogni bit in un circuito bistabile alimentato. Identifica la tecnologia.',
      [choice('Tecnologia',['SRAM','DRAM','Flash NAND'],'SRAM','Considera quale cella mantiene uno stato con una retroazione elettrica.')],
      ['Il requisito riguarda la latenza di un piccolo livello vicino alla CPU.','Una cella SRAM mantiene lo stato attraverso un circuito bistabile finché rimane alimentata.','La SRAM soddisfa i vincoli descritti. La superficie della cella spiega il costo per bit di questo livello.']),
    variant('Un banco di memoria principale rappresenta il bit con una carica che si disperde nel tempo. Quale tecnologia usa e quale operazione periodica richiede?',
      [choice('Tecnologia',['Flash NAND','SRAM','DRAM'],'DRAM','Individua la cella che impiega un condensatore.'),choice('Operazione',['Refresh','Cancellazione a blocchi','Commit'],'Refresh','La perdita di carica va compensata durante il funzionamento.')],
      ['La memoria principale privilegia la densità delle celle.','Il condensatore della cella DRAM accumula carica. Le correnti di perdita ne modificano il livello.','Il refresh ripristina periodicamente la carica e conserva il valore del bit per le letture successive.']));

  function locality(start,count){
    const end=start+4*count-1, first=Math.floor(start/64), last=Math.floor(end/64);
    return variant('Una scansione legge '+count+' interi consecutivi da 4 byte, a partire dall’indirizzo '+start+'. Ogni linea è di 64 byte. Quante linee distinte vengono toccate?',
      [num('Linee distinte',last-first+1,'Calcola anche l’indirizzo dell’ultimo byte incluso.')],
      ['Il primo byte è '+start+'. L’ultimo è '+start+' + 4 × '+count+' − 1 = '+end+'.','I due estremi appartengono alle linee '+first+' e '+last+' (divisione intera per 64).','L’intervallo è continuo. Il conteggio inclusivo vale '+last+' − '+first+' + 1 = '+(last-first+1)+'.']);
  }
  prova(1,2,'02_locality','Contare le linee di una scansione',
    'Una linea comprende un intervallo allineato di indirizzi consecutivi. Per contare le linee toccate servono il primo e l’ultimo byte incluso nella scansione.',locality(64,16),{
      consegna: "Una scansione legge 12 interi consecutivi da quattro byte. Il primo intero comincia all’indirizzo 44 e le linee sono di 64 byte. Per far rientrare l’intero intervallo in una sola linea si può anticipare l’inizio, mantenendolo multiplo di quattro. Trova lo spostamento minimo e il nuovo indirizzo iniziale.",
      campi: [
        num("Anticipo minimo (byte)", "28", "Confronta l’ultimo byte della scansione con l’ultimo byte della linea zero."),
        num("Nuovo indirizzo", "16", "Sottrai l’anticipo alla posizione iniziale.")
      ],
      svolgimento: [
        "I dodici interi occupano 48 byte. L’ultimo si trova a 44 + 48 − 1 = 91, nella linea che inizia a 64.",
        "Per restare nella linea zero l’ultimo byte deve scendere almeno da 91 a 63. La differenza è 28 byte.",
        "Anticipando di 28 byte si parte da 16, un multiplo di quattro, e si termina esattamente a 63. Un anticipo inferiore lascerebbe almeno un byte nella linea successiva."
      ],
      quadro: [
        {tipo:"stato", titolo:"Scansione", celle:[["Inizio", "44"], ["Interi", "12"], ["Byte per intero", "4"]]},
        {tipo:"stato", titolo:"Estremi originali", celle:[["Primo byte", "44"], ["Ultimo byte", "91"]]},
        {tipo:"confronto", titolo:"Vincolo", celle:[["Fine ammessa", "63"], ["Eccedenza", "28 byte"]]},
        {tipo:"sequenza", titolo:"Intervallo corretto", celle:[["Inizio", "16"], ["Fine", "63"]]}
      ]
    });
  function cacheExam(refs){
    const rows=cacheTrace(refs,16,2), end=rows[rows.length-1];
    return variant('Cache diretta vuota: due posizioni, linee da 16 byte, write-back con write-allocate. Traccia '+refs.map(([a,w])=>(w?'scrivi ':'leggi ')+a).join(' → ')+'. Conta hit e riscritture di vittime sporche fino all’ultimo accesso, senza svuotamento finale.',
      [num('Hit',end.hits,'L’indice è il blocco modulo due. Confronta il tag residente.'),num('Write-back',end.writebacks,'Conta soltanto le espulsioni di blocchi modificati.')],
      rows.map((r,i)=>(i+1)+'. Blocco '+r.block+', indice '+r.index+', tag '+r.tag+': '+(r.hit?'hit':r.old?'miss con espulsione del tag '+r.old.tag+(r.old.dirty?' sporco':' pulito'):'miss a posizione vuota')+'. La linea termina '+(r.dirty?'sporca.':'pulita.')).concat('Totali: '+end.hits+' hit e '+end.writebacks+' write-back.'));
  }
  prova(1,2,'03_cache_behavior','Espulsioni e blocchi sporchi',
    'Una cache diretta ammette ogni blocco in una sola posizione. Il quoziente intero dell’indirizzo diviso per i byte della linea dà il numero di blocco; dividendo quel numero per il numero di posizioni della cache, il resto dà l’indice e il quoziente il tag, che identifica il blocco residente. Un miss indica che la copia richiesta è assente. Write-allocate carica il blocco su un miss in scrittura. Write-back trattiene le modifiche nella copia, marcata Dirty, e le riscrive verso la RAM quando quella copia viene espulsa. Un hit trova già la copia richiesta.',cacheExam([[0,true],[4,false],[32,false],[16,true]]),{
      consegna: "Una cache diretta ha due posizioni e linee da 16 byte. Dopo una scrittura all’indirizzo 16 la sola linea residente è sporca. Una lettura successiva provoca la sua riscrittura in RAM. Fra gli indirizzi proposti, quale può averla causata? Quante riscritture avrebbe prodotto invece una lettura di 18?",
      campi: [
        choice("Indirizzo compatibile", ["0", "18", "48"], "48", "Cerca un blocco diverso che usi la stessa posizione."),
        num("Riscritture con lettura di 18", "0", "Verifica se 16 e 18 appartengono allo stesso blocco.")
      ],
      svolgimento: [
        "La divisione intera per 16 assegna gli indirizzi 0, 18 e 48 rispettivamente ai blocchi 0, 1 e 3.",
        "La posizione è il resto modulo due. Il blocco 3 va nella posizione 1 e richiede l’espulsione del blocco 1, modificato dalla scrittura.",
        "Una lettura di 18 incontra il blocco 1 già presente. La linea resta sporca e si contano zero scritture verso la RAM."
      ],
      quadro: [
        {tipo:"confronto", titolo:"Stato osservato", celle:[["Blocco sporco", "1"], ["Posizione", "1"]]},
        {tipo:"stato", titolo:"Mappatura", celle:[["0 → blocco", "0"], ["18 → blocco", "1"], ["48 → blocco", "3"]]},
        {tipo:"sequenza", titolo:"Causa", celle:[["Posizione del 3", "1"], ["Vittima", "blocco 1"]]},
        {tipo:"confronto", titolo:"Caso di controllo", celle:[["Indirizzo", "18"], ["Esito", "hit"], ["Riscritture", "0"]]}
      ]
    });
  function amat(hit,miss,pen){
    const result=hit+miss*pen/100;
    return variant('Cache con consultazione da '+hit+' ns, '+miss+' miss su cento richieste e penalità aggiuntiva di '+pen+' ns per miss. Calcola il tempo medio.',
      [num('AMAT in ns',result,'Attribuisci la consultazione a tutte le richieste.')],
      ['Le cento consultazioni costano 100 × '+hit+' = '+100*hit+' ns.','I rifornimenti aggiungono '+miss+' × '+pen+' = '+miss*pen+' ns.','Il totale di '+(100*hit+miss*pen)+' ns diviso per cento dà '+fmt(result)+' ns per accesso.']);
  }
  prova(1,3,'04_cache_performance','Pesare il costo di un miss',
    'Il tempo di ricerca in cache si paga anche in caso di miss. La penalità aggiuntiva incide sulla media in proporzione alla frequenza con cui viene sostenuta.',amat(2,10,50),{
      consegna: "Un contatore misura 500 ns complessivi su cento accessi. Ogni consultazione costa 2 ns e ciascun miss aggiunge 30 ns. Ricostruisci il numero di miss dal tempo totale e verifica quanti accessi sono stati hit.",
      campi: [
        num("Miss osservati", "10", "Separa il costo comune dal costo dei soli rifornimenti."),
        num("Hit osservati", "90", "Ogni accesso è classificato una volta sola.")
      ],
      svolgimento: [
        "Le cento consultazioni assorbono 100 × 2 = 200 ns, anche quando richiedono un rifornimento.",
        "Il rifornimento spiega 500 − 200 = 300 ns. Dividendo per 30 ns si ottengono dieci miss.",
        "Rimangono 100 − 10 = 90 hit. Il tempo ricostruito è 100 × 2 + 10 × 30 = 500 ns."
      ],
      quadro: [
        {tipo:"stato", titolo:"Misura", celle:[["Accessi", "100"], ["Totale", "500 ns"]]},
        {tipo:"stato", titolo:"Costo comune", celle:[["Ricerca", "2 ns"], ["100 ricerche", "200 ns"]]},
        {tipo:"stato", titolo:"Quota dei miss", celle:[["Tempo residuo", "300 ns"], ["Penalità", "30 ns"]]},
        {tipo:"sequenza", titolo:"Verifica", celle:[["Miss", "10"], ["Hit", "90"], ["Totale", "500 ns"]]}
      ]
    });
  function designs(h1,m1,h2,m2,pen){
    const a=h1+m1*pen/100,b=h2+m2*pen/100;
    return variant('Due cache hanno penalità aggiuntiva '+pen+' ns. A: hit time '+h1+' ns e '+m1+'% di miss. B: hit time '+h2+' ns e '+m2+'% di miss. A parità di altri vincoli, scegli la latenza media inferiore.',
      [choice('Progetto',['A','B'],a<b?'A':'B','Pesa la penalità separatamente per ciascun progetto.')],
      ['A richiede '+h1+' + '+m1+'/100 × '+pen+' = '+fmt(a)+' ns.','B richiede '+h2+' + '+m2+'/100 × '+pen+' = '+fmt(b)+' ns.','Il progetto '+(a<b?'A':'B')+' riduce la media di '+fmt(Math.abs(a-b))+' ns per accesso.']);
  }
  prova(1,3,'05_hierarchy_design','Progettare sotto un vincolo di latenza',
    'Una cache più rapida in caso di hit può perdere il vantaggio se deve rifornirsi spesso. Per confrontare i progetti occorre pesare la stessa penalità con la frequenza di miss di ciascuno.',designs(1,10,3,2,50),{
      consegna: "Il progetto A consulta la cache in 1 ns e ha il 10% di miss. B impiega 3 ns e ha il 2% di miss. La penalità aggiuntiva è uguale per i due progetti. A quale penalità le medie sono uguali? Se la memoria richiede poi 40 ns di penalità, quale progetto conviene?",
      campi: [
        num("Penalità di pareggio (ns)", "25", "Uguaglia le due medie in funzione della stessa incognita."),
        choice("Progetto a 40 ns", ["A", "B", "Equivalenti"], "B", "Con la penalità indicata, pesa i miss sulle rispettive frequenze.")
      ],
      svolgimento: [
        "Se p è la penalità in nanosecondi, A costa in media 1 + 0,10p e B costa 3 + 0,02p.",
        "Uguagliando i due costi si ottiene 0,08p = 2. Ne segue p = 25 ns, per cui entrambe le medie valgono 3,5 ns.",
        "Con p = 40 ns, A sale a 5 ns e B a 3,8 ns. La minore frequenza di miss di B ripaga il costo della sua consultazione."
      ],
      figuraCorrezione: {"tipo": "pareggio", "ricerca": [1, 3], "miss": [10, 2], "penalita": 40}
    });

  function procFrames(fa,fb,off){
    return variant('Due processi leggono VPN 5, offset '+off+', con pagine da 4 KiB. A mappa VPN 5 al frame '+fa+', B al frame '+fb+'. Determina gli indirizzi fisici e la relazione fra i byte.',
      [num('PA di A',fa*4096+off,'Moltiplica il PFN di A per 4096.'),num('PA di B',fb*4096+off,'La tabella di B determina la sua base.'),choice('Relazione',['Stesso byte fisico','Byte fisici distinti'],fa===fb?'Stesso byte fisico':'Byte fisici distinti','Confronta sia il frame sia l’offset.')],
      ['L’identità virtuale 5 seleziona una voce in ciascuna delle due tabelle.','A ottiene '+fa+' × 4096 + '+off+' = '+(fa*4096+off)+'. B ottiene '+fb+' × 4096 + '+off+' = '+(fb*4096+off)+'.',fa===fb?'I due indirizzi coincidono: entrambi i processi osservano lo stesso byte fisico.':'I frame differiscono e i due indirizzi fisici designano byte distinti.']);
  }
  prova(2,1,'01_address_spaces','Isolamento e condivisione della pagina',
    'Un processo è un programma in esecuzione con una propria tabella degli indirizzi. La tabella associa ogni pagina virtuale, identificata dalla VPN, a un frame, un gruppo fisico di byte della stessa grandezza. L’offset sceglie il byte all’interno del gruppo e si conserva nella traduzione. L’indirizzo fisico PA è numero del frame × byte per pagina + offset; l’indirizzo virtuale VA usa nello stesso calcolo la VPN. Un KiB equivale a 1024 byte.',procFrames(4,8,72),{
      consegna: "La pagina virtuale 5 di A e la pagina virtuale 9 di B puntano entrambe al frame 7. Una pagina ha 4096 byte. A scrive il valore 90 all’offset 12. A parità di permessi, quale VA deve leggere B per ritrovare il byte? Determina anche il PA che giustifica la risposta.",
      campi: [
        num("VA nel processo B", "36876", "Ricostruisci l’indirizzo partendo dalla VPN di B."),
        num("PA comune", "28684", "Sostituisci il numero virtuale con il frame comune.")
      ],
      svolgimento: [
        "La scrittura modifica il byte in posizione 12 del frame 7. Chi vuole ritrovare quel dato deve conservare lo stesso offset.",
        "Per B la pagina virtuale che conduce al frame è la 9. Il VA richiesto è 9 × 4096 + 12 = 36876.",
        "Entrambe le traduzioni conducono a 7 × 4096 + 12 = 28684. Se fra gli accessi il byte resta invariato, B legge 90."
      ],
      quadro: [
        {tipo:"stato", titolo:"Tabelle", celle:[["A, VPN 5", "frame 7"], ["B, VPN 9", "frame 7"]]},
        {tipo:"stato", titolo:"Byte scritto", celle:[["Frame", "7"], ["Offset", "12"]]},
        {tipo:"stato", titolo:"Indirizzo in B", celle:[["VPN", "9"], ["VA", "36876"]]},
        {tipo:"sequenza", titolo:"Verifica fisica", celle:[["PA comune", "28684"], ["Dato", "90"]]}
      ]
    });
  function pageSplit(va,b){
    const q=Math.floor(va/b), d=va%b;
    return variant('Le pagine hanno '+b+' byte. Scomponi VA '+hex(va)+' ('+va+' in decimale).',
      [num('VPN',q,'Usa il quoziente intero VA / dimensione.'),num('Offset',d,'Sottrai la base della pagina al VA.')],
      ['La pagina zero copre da zero a '+(b-1)+', quindi ogni pagina successiva inizia a un multiplo di '+b+'.','La divisione di '+va+' per '+b+' dà quoziente '+q+' e resto '+d+'.','La ricostruzione '+q+' × '+b+' + '+d+' = '+va+' conferma entrambi i campi.']);
  }
  prova(2,1,'02_paging','Separare VPN e offset',
    'L’indirizzo virtuale conta i byte dall’origine dello spazio. Quoziente e resto della divisione per la dimensione di pagina ne danno rispettivamente la pagina e la posizione interna.',pageSplit(0x3fff,4096),{
      consegna: "Un tracciatore dichiara che l’indirizzo 0x2800 ha VPN 5 e offset 0. Le sole dimensioni ammesse sono 1, 2 e 4 KiB. Individua la geometria compatibile e calcola la VPN del byte immediatamente precedente.",
      campi: [
        choice("Dimensione della pagina", ["1 KiB", "2 KiB", "4 KiB"], "2 KiB", "Un offset zero colloca l’indirizzo all’inizio della pagina di indice 5; la numerazione parte da zero."),
        num("VPN del byte precedente", "4", "Il byte precedente un inizio di pagina chiude la pagina precedente.")
      ],
      svolgimento: [
        "0x2800 equivale a 10240. Poiché l’offset è nullo, cinque dimensioni di pagina devono coprire esattamente questi byte.",
        "La divisione 10240 ÷ 5 dà 2048 byte, ossia 2 KiB.",
        "Tolto un byte si torna a 10239, che vale 4 × 2048 + 2047. È l’ultima posizione della pagina 4."
      ],
      quadro: [
        {tipo:"stato", titolo:"Dati registrati", celle:[["VA", "0x2800"], ["VPN", "5"], ["Offset", "0"]]},
        {tipo:"stato", titolo:"Equazione", celle:[["Indirizzo", "10240"], ["5 × pagina", "10240"]]},
        {tipo:"stato", titolo:"Geometria", celle:[["Dimensione", "2048 byte"], ["In KiB", "2"]]},
        {tipo:"stato", titolo:"Confine", celle:[["VA precedente", "10239"], ["VPN", "4"], ["Offset", "2047"]]}
      ]
    });
  function entry(va,pte){
    const f=Math.floor(pte/2), ok=pte%2, off=va%4096;
    return variant('Pagina da 4096 byte. La voce per VA '+hex(va)+' vale '+pte+' e codifica 2 × PFN + present. La regione è allocata e leggibile. Determina l’esito e, se presente, il PA. Usa −1 nel campo PA per una pagina assente.',
      [choice('Esito',['Accesso in RAM','Fault di assenza'],ok?'Accesso in RAM':'Fault di assenza','Leggi il bit meno significativo.'),num('PA oppure −1',ok?f*4096+off:-1,'Usa il PFN soltanto quando present vale uno.')],
      ['Il resto della divisione dell’indirizzo per 4096 dà offset '+off+'.','Il bit present è '+pte+' modulo 2 = '+ok+'.',ok?'Il PFN è ('+pte+' − 1)/2 = '+f+'. PA = '+f+' × 4096 + '+off+' = '+(f*4096+off)+'.':'La MMU segnala assenza. Il campo PFN è inutilizzabile in questo stato. Si inserisce −1.']);
  }
  prova(2,2,'03_page_tables','Interpretare una voce di pagina',
    'Il PFN è il numero del frame, il gruppo di memoria fisica che ospita la pagina. Nel formato della traccia la voce vale 2 × PFN + present: il resto della divisione per due è il bit di presenza e il quoziente è il numero del frame. Present uguale a uno permette di usare quel frame; zero richiede la gestione della pagina assente. La regione è l’intervallo virtuale assegnato al processo: il suo permesso di lettura e la presenza della pagina in RAM sono proprietà distinte.',entry(0x3007,19),entry(0x4af0,18));
  function faultExam(dirty){
    return variant('Una lettura ammessa incontra una pagina assente con copia nel file. La RAM è piena. La vittima è '+(dirty?'sporca':'pulita e ricostruibile')+'. Conta i trasferimenti di pagina su disco (letture e scritture) e indica quando riprende l’istruzione.',
      [num('Trasferimenti',dirty?2:1,'Distingui il salvataggio della vittima dalla lettura della pagina richiesta.'),choice('Ripresa',['Dopo l’installazione della nuova mappatura','Alla scelta della vittima','Prima della lettura del file'],'Dopo l’installazione della nuova mappatura','La CPU ha bisogno di una traduzione residente e utilizzabile.')],
      ['L’eccezione sospende il caricamento. Il kernel verifica la regione e sceglie la vittima.',dirty?'La vittima contiene modifiche e richiede una scrittura su disco prima del riuso del frame.':'La vittima pulita ha una copia valida. Il frame può essere riusato senza scrivere la pagina.', 'Il kernel ritira la vecchia mappatura e invalida le traduzioni interessate prima del riuso. Legge la pagina richiesta nel frame, installa la nuova mappatura e ritenta l’istruzione. '+(dirty?'Si contano una scrittura e una lettura su disco.':'L’unico trasferimento è la lettura dal file.')]);
  }
  prova(2,2,'04_page_faults','Recuperare una pagina con RAM piena',
    'Un page fault interrompe l’istruzione quando la pagina richiesta è assente dalla RAM, la memoria principale. Il kernel, la parte del sistema operativo che gestisce la memoria, sceglie una vittima da sostituire se tutti i frame sono occupati. Una vittima pulita ha già una copia utilizzabile; una sporca contiene modifiche da salvare prima del riuso. Il kernel ritira la vecchia mappatura, l’associazione fra pagina e frame, carica completamente la pagina richiesta e installa quella nuova prima di ritentare l’istruzione.',faultExam(false),{
      consegna: 'Una lettura ammessa causa un fault. Il kernel deve riutilizzare un unico frame occupato da una pagina sporca e ha già ritirato la vecchia mappatura. Il recupero è seriale. Ordina le quattro operazioni necessarie a riprendere l’istruzione e conta i trasferimenti integrali fra RAM e disco.',
      campi: [
        ordine('Sequenza del recupero',['Salvare la vittima sporca','Leggere la pagina richiesta nel frame','Installare la nuova mappatura','Ritentare l’istruzione'],'Segui la dipendenza fra il riuso del frame e la disponibilità della nuova traduzione.'),
        num('Trasferimenti di pagina',2,'Conta separatamente la scrittura della vittima e la lettura che la sostituisce.')
      ],
      svolgimento: [
        'La pagina vittima contiene modifiche. Poiché occorre riutilizzare proprio quel frame, il primo trasferimento salva le modifiche su disco prima che i byte siano sostituiti.',
        'A salvataggio concluso il kernel legge la pagina richiesta nello stesso frame. Solo dopo il completamento della lettura la nuova mappatura può rendere visibili dati completi.',
        'Installata la mappatura, il processo può ritentare la lettura. Fra disco e RAM si contano due trasferimenti di pagina, uno in scrittura e uno in lettura. Installazione e ritentativo sono passi distinti da questi trasferimenti.'
      ],
      quadro: [
        {tipo:'stato',titolo:'Il frame da riutilizzare',celle:[['Vittima','sporca'],['Nuova pagina','nel file'],['Altri frame','nessuno']],nota:'La vecchia traduzione è già stata ritirata.'},
        {tipo:'sequenza',titolo:'Salvare il contenuto unico',celle:[['Sorgente','frame'],['Destinazione','disco']],nota:'Soltanto a scrittura conclusa la copia su disco è aggiornata.'},
        {tipo:'sequenza',titolo:'Popolare il frame',celle:[['File','pagina richiesta'],['Frame','nuovi dati'],['PTE','presente']],nota:'La mappatura utilizzabile segue il completamento della lettura.'},
        {tipo:'stato',titolo:'Riprendere la lettura',celle:[['Scritture','1'],['Letture','1'],['Istruzione','ritentata']],nota:'Il modello conta i trasferimenti di pagina completati.'}
      ]
    });
  function ws(seq,w,frames){
    const window=seq.slice(-w), pages=[...new Set(window)],delta=Math.max(0,pages.length-frames);
    return variant('Traccia '+seq.join(' ')+'. All’ultimo istante considera gli ultimi '+w+' riferimenti e un budget di '+frames+' frame. Quante pagine distinte contiene la finestra e quanti frame aggiuntivi servirebbero a contenerle tutte?',
      [num('Pagine distinte',pages.length,'Le ripetizioni si contano una sola volta.'),num('Frame aggiuntivi',delta,'Confronta la cardinalità con il budget, usando zero se è sufficiente.')],
      ['Gli ultimi '+w+' riferimenti sono '+window.join(' ')+'.','Eliminando le ripetizioni resta l’insieme { '+pages.join(', ')+' }, di cardinalità '+pages.length+'.','Il deficit è max(0, '+pages.length+' − '+frames+') = '+delta+' frame.']);
  }
  prova(2,3,'05_working_set','Stimare il budget di frame',
    'Il working set conta le pagine distinte in una finestra temporale. Il confronto con i frame disponibili stabilisce se la RAM può mantenerle tutte residenti insieme.',ws(['A','B','A','C','D'],4,3),{
      consegna: "Il programma ha appena eseguito A, B, A, C, A in quest’ordine. Sono disponibili due frame. Fra le finestre finali lunghe 1, 2, 3, 4 o 5 riferimenti, qual è la più lunga il cui insieme di lavoro entra interamente nei due frame? Quale pagina provoca il primo eccesso allargando ancora la finestra?",
      campi: [
        num("Lunghezza massima", "3", "Aggiungi un riferimento alla volta, procedendo a ritroso dall’ultimo A."),
        choice("Pagina che causa l’eccesso", ["A", "B", "C"], "B", "Individua la prima pagina distinta oltre alle due già presenti.")
      ],
      svolgimento: [
        "Dall’ultima A, allargare a C A porta il conteggio a due pagine.",
        "La terza lettura a ritroso aggiunge ancora A. La finestra di tre riferimenti contiene soltanto A e C e rientra nel budget.",
        "Con quattro riferimenti entra B e le pagine distinte diventano tre. Un ulteriore ampliamento può solo mantenere o aumentare il loro numero. Il massimo è dunque tre riferimenti."
      ],
      figuraCorrezione: {"tipo": "finestra", "pagine": ["A", "B", "A", "C", "A"], "frame": 2}
    });

  function tlbExam(seq){
    const slots=[], steps=[];let hits=0;
    for(const key of seq){
      const pos=slots.indexOf(key);
      let action;
      if(pos>=0){ hits++; slots.splice(pos,1); action='hit, il riuso rinnova la priorità'; }
      else { action='miss'; if(slots.length===2)action+=', vittima '+slots.shift(); }
      slots.push(key);
      steps.push('Cerca '+key+': '+action+'. Ordine dalla meno recente: '+slots.join(', ')+'.');
    }
    return variant('TLB inizialmente vuota, due voci, rimpiazzo LRU, tutte le pagine residenti. Ogni coppia indica ASID e VPN. Esegui '+seq.join(' → ')+'.',
      [num('Hit',hits,'La chiave comprende anche lo spazio di indirizzamento.'),num('Consultazioni della tabella',seq.length-hits,'Un miss della TLB richiede una consultazione della tabella residente.')],
      [...steps,'Su '+seq.length+' richieste si contano '+hits+' hit e '+(seq.length-hits)+' consultazioni.']);
  }
  prova(4,1,'01_tlb_behavior','Ripercorrere una TLB con identificatori di spazio',
    'La TLB è una piccola memoria di traduzioni recenti. Ogni chiave contiene ASID, l’identificatore dello spazio del processo, e VPN, il numero della pagina virtuale; il risultato indica il frame fisico. Trovare la chiave è un hit, mentre un miss richiede la tabella del processo. Il criterio LRU sostituisce la voce il cui ultimo uso è più lontano nel tempo. Ogni hit rinnova la recenza della voce usata.',tlbExam(['A/2','A/2','B/2','A/3','A/2']),{
      consegna: "Dopo una lettura di A sulla VPN 3, la TLB contiene la traduzione (A,3) → frame 7. B legge la propria VPN 3 che la sua tabella associa al frame 12. Il dispositivo riporta un hit e restituisce 7. Le pagine sono residenti e le tabelle corrette. Individua il confronto mancante e il frame della lettura corretta.",
      campi: [
        choice("Difetto nel confronto", ["Omissione dell’ASID", "Controllo del bit dirty", "Offset troppo grande"], "Omissione dell’ASID", "Due pagine con lo stesso numero appartengono a spazi distinti."),
        num("Frame corretto", "12", "Segui la voce della tabella del processo che sta eseguendo.")
      ],
      svolgimento: [
        "Il numero di pagina coincide, mentre gli identificatori degli spazi sono diversi. Un confronto sulla sola VPN spiega il falso hit.",
        "Con la chiave completa si ha un miss. La ricerca nella tabella di B fornisce il frame 12.",
        "Il valore osservato 7 proviene dalla voce di A. Correggendo il confronto si impedisce di usare la traduzione di un altro processo."
      ],
      figuraCorrezione: {"tipo": "spazio", "pagina": 3, "vecchio": 7, "nuovo": 12}
    });
  const lookupCode=[
    'xor ecx, ecx','cerca:','    cmp rdi, [rsi + rcx]','    je trovato','    add rcx, 16','    cmp rcx, 64','    jb cerca','    mov rax, -1','    jmp fine','trovato:','    mov rax, [rsi + rcx + 8]','fine:'
  ].join('\n');
  function lookupExam(vpn){
    const rows=[[3,40],[8,12],[6,19],[10,7]], i=rows.findIndex(([v])=>v===vpn), found=i>=0;
    return variant('Segui il listato x86-64 Intel. RSI punta a quattro coppie (VPN, PFN), con campi da otto byte: (3,40), (8,12), (6,19), (10,7). RDI = '+vpn+'. Esprimi RAX come intero con segno e RCX come offset finale in byte.',
      [num('RAX con segno',found?rows[i][1]:-1,'Un confronto riuscito carica il campo successivo alla VPN.'),num('RCX finale',found?i*16:64,'Ogni confronto fallito avanza di un intero record.')],
      ['Ogni record occupa 8 + 8 = 16 byte. RCX parte da zero e la ricerca confronta VPN a offset 0, 16, 32 e al più 48.',
       'Per RDI = '+vpn+' vengono confrontate in ordine '+rows.slice(0,found?i+1:4).map(([v])=>v).join(', ')+'.',
       found?'Il confronto riesce a offset '+i*16+'. Il carico a offset '+(i*16+8)+' fornisce PFN '+rows[i][1]+' in RAX e lascia RCX = '+i*16+'.':'Dopo il quarto confronto RCX vale 64. CMP RCX, 64 dà uguaglianza e il flusso prosegue dopo JB. MOV RAX, -1 segnala che la VPN è assente. La ricerca ha letto esattamente quattro record.'],lookupCode);
  }
  prova(4,1,'02_tlb_lookup_assembly','Tracciare i registri della ricerca TLB',
    'Un array di coppie VPN/PFN contiene numeri di pagina virtuale e frame fisico. Ogni coppia occupa la somma dei due campi; RCX misura in byte la distanza dalla base in RSI. CMP confronta due valori aggiornando gli indicatori del processore, e JB salta se il primo è minore del secondo nell’interpretazione senza segno. Quando la VPN coincide, il carico del campo successivo restituisce il PFN in RAX; esaurite le coppie, −1 segnala la ricerca fallita.',lookupExam(10),lookupExam(9));
  function indexExam(va,b){
    const f=walkParts(va,b),high=20-b;
    return variant('VA a 32 bit '+hex(va)+', ripartizione '+high+'/'+b+'/12 dall’alto verso il basso. Restituisci i tre campi in ordine.',
      [num('Indice superiore',f.high,'Rimuovi i '+(12+b)+' bit inferiori.'),num('Indice inferiore',f.low,'Dopo lo spostamento di 12, conserva '+b+' bit.'),num('Offset',f.off,'Applica la maschera 0xFFF.')],
      ['L’indice superiore è floor('+hex(va)+' / 2^'+(12+b)+') = '+f.high+'.','Il numero di pagina è '+Math.floor(va/4096)+'. Il resto modulo '+2**b+' è '+f.low+', indice inferiore.','Gli ultimi dodici bit danno '+f.off+'. Ricomponendo ('+f.high+' × '+2**b+' + '+f.low+') × 4096 + '+f.off+' si ritrova '+hex(va)+'.']);
  }
  prova(4,3,'03_multilevel_indexes','Separare gli indici per due geometrie',
    'La ripartizione dell’indirizzo stabilisce quante posizioni assegnare a indice di radice, indice di foglia e offset. La geometria determina quindi le maschere e gli scorrimenti.',indexExam(0x67def123,12),{
      consegna: "Un walk con geometria 9/11/12 ha scelto la voce 2 della radice, la voce 3 della figlia e l’offset 4. Ricostruisci il VA. Con la ripartizione 10/10/12, quale indice superiore si ricava dallo stesso indirizzo?",
      campi: [
        num("VA ricostruito", "16789508", "La VPN vale indice superiore × 2¹¹ + indice inferiore."),
        num("Indice superiore con dieci bit in L2", "4", "Dividi il numero di pagina per 1024 e tieni il quoziente.")
      ],
      svolgimento: [
        "Il campo inferiore comprende 2048 combinazioni. Il numero di pagina è 2 × 2048 + 3 = 4099.",
        "L’indirizzo è 4099 × 4096 + 4 = 16789508, ossia 0x1003004.",
        "Con dieci bit in L2, 4099 = 4 × 1024 + 3. L’indice superiore diventa 4, mentre l’offset resta 4."
      ],
      quadro: [
        {tipo:"stato", titolo:"Campi", celle:[["L1", "2"], ["L2", "3"], ["Offset", "4"]]},
        {tipo:"stato", titolo:"Numero di pagina", celle:[["Ampiezza L2", "11 bit"], ["VPN", "4099"]]},
        {tipo:"stato", titolo:"Indirizzo", celle:[["Pagina", "4096 byte"], ["VA", "0x1003004"]]},
        {tipo:"sequenza", titolo:"Nuova geometria", celle:[["L1", "4"], ["L2", "3"], ["Offset", "4"]]}
      ]
    });
  function walkExam(va,b,leaf){
    const f=walkParts(va,b), frame=Math.floor(leaf/2), pa=frame*4096+f.off,root=0x100000,child=0x300000;
    const code=['mov rax, rdi','shr rax, '+(12+b),'mov rdx, [rsi + rax*8]','mov rcx, rdi','shr rcx, 12','and ecx, '+(2**b-1),'mov rax, [rdx + rcx*8]','shr rax, 1','shl rax, 12','mov rcx, rdi','and ecx, 4095','or rax, rcx'].join('\n');
    return variant('RDI contiene VA '+hex(va)+' esteso con zeri, RSI = '+hex(root)+'. Ripartizione '+(20-b)+'/'+b+'/12. Ogni voce occupa otto byte. La voce L1 scelta contiene '+hex(child)+'. La foglia valida vale '+leaf+' = 2 × PFN + 1. Segui i due load e restituisci il risultato.',
      [num('Indirizzo della voce L1',root+8*f.high,'Applica la scala di otto byte all’indice superiore.'),num('Indirizzo della voce L2',child+8*f.low,'Per il secondo load usa la base caricata in RDX.'),num('RAX finale (PA)',pa,'Decodifica il PFN prima di ricomporre il PA.')],
      ['I campi di VA sono '+f.high+', '+f.low+' e '+f.off+'. Il primo load legge '+hex(root)+' + 8 × '+f.high+' = '+hex(root+8*f.high)+' e salva '+hex(child)+' in RDX.',
       'La maschera '+(2**b-1)+' seleziona l’indice L2. Il secondo load legge '+hex(child)+' + 8 × '+f.low+' = '+hex(child+8*f.low)+' e porta '+leaf+' in RAX.',
       'Lo shift di un bit dà PFN '+frame+'. Il successivo shift di 12 e OR con '+f.off+' danno '+hex(pa)+' ('+pa+' in decimale).'],code);
  }
  prova(4,3,'04_two_level_walk_assembly','Seguire i due caricamenti in assembly',
    'In un percorso a due livelli il secondo caricamento usa come base il puntatore restituito dal primo. Solo la foglia contiene i bit che individuano il frame del dato.',walkExam(0xc0504d,10,27),{
      consegna: "La radice in RSI = 0x100000 porta, con L1 = 2, alla figlia in 0x300000. L2 = 3, l’offset è 5 e la foglia valida contiene 15. Le voci sono da otto byte e le pagine da 4 KiB. Nel listato Intel si è usata la base sbagliata per il secondo carico. Indica quale riga correggere, quale registro usare come base e il PA che la routine corretta consegnerà.",
      campi: [
        num("Numero della riga da correggere", "2", "Segui il puntatore caricato dal primo MOV."),
        choice("Base del secondo carico", ["RSI", "RDX", "RDI"], "RDX", "Individua il registro che ora contiene 0x300000."),
        num("PA dopo la correzione", "28677", "Decodifica 15 come 2 × PFN + 1 e aggiungi lo spostamento.")
      ],
      svolgimento: [
        "La prima riga legge la voce all’indirizzo 0x100000 + 2 × 8. Il risultato 0x300000 è la base della figlia e si trova in RDX.",
        "La seconda riga deve leggere [rdx + rcx*8]. Con RCX = 3 l’indirizzo della foglia è 0x300018. Usando RSI si leggerebbe ancora nella radice.",
        "La foglia è valida e codifica il frame (15 − 1) ÷ 2 = 7. Traslando il frame di dodici bit e inserendo 5 si ottiene 0x7005, ossia 28677."
      ],
      quadro: [
        {tipo:"stato", titolo:"Stato iniziale", celle:[["RSI", "0x100000"], ["L1", "2"], ["L2", "3"], ["Offset", "5"]]},
        {tipo:"sequenza", titolo:"Primo carico", celle:[["Indirizzo", "0x100010"], ["RDX", "0x300000"]]},
        {tipo:"stato", titolo:"Correzione", celle:[["Riga", "2"], ["Base", "RDX"], ["Lettura", "0x300018"]]},
        {tipo:"sequenza", titolo:"Traduzione", celle:[["PTE", "15"], ["Frame", "7"], ["PA", "0x7005"]]}
      ],
      codice: "mov rdx, [rsi + rax*8] ; RAX = L1, RCX = L2\nmov rax, [rsi + rcx*8]\nshr rax, 1\nshl rax, 12\nor rax, 5"
    });
  function translationTime(l,ram,t,h){
    const hit=t+ram,miss=hit+l*ram,avg=hit+(100-h)*l*ram/100;
    return variant('TLB seriale da '+t+' ns, RAM da '+ram+' ns, '+l+' livelli in RAM, tutte le pagine residenti, '+h+'% di hit. Includi l’accesso dati e calcola il costo di miss e la media.',
      [num('Costo del miss (ns)',miss,'Conta anche l’ultima lettura dei dati.'),num('Media (ns)',avg,'La consultazione TLB avviene anche durante un miss.')],
      ['Un hit costa '+t+' + '+ram+' = '+hit+' ns.','Un miss aggiunge '+l+' letture da '+ram+' ns al percorso di hit: totale '+miss+' ns.','Su cento accessi la media è ('+h+' × '+hit+' + '+(100-h)+' × '+miss+') / 100 = '+fmt(avg)+' ns.']);
  }
  prova(4,4,'05_translation_cost','Separare costo di hit, miss e media',
    'Per una pagina residente, un miss della TLB richiede letture delle tabelle prima della lettura del dato. Occorre contare separatamente queste letture e il costo della consultazione TLB.',translationTime(2,50,1,90),{
      consegna: "La RAM costa 40 ns per lettura, la TLB 2 ns. Le pagine sono residenti e i costi si sommano. Su cento accessi si contano 90 hit e si misura una media di 54 ns. Ricava quanti livelli di tabella il processore ha letto durante ciascun miss e il tempo del percorso di miss.",
      campi: [
        num("Livelli", "3", "Ricava prima il sovraccosto medio rispetto a un hit."),
        num("Tempo di miss (ns)", "162", "Aggiungi al percorso di hit tutte le letture di tabella.")
      ],
      svolgimento: [
        "Ogni accesso paga 2 + 40 = 42 ns. La differenza fra media e costo comune è 54 − 42 = 12 ns.",
        "Il supplemento riguarda il 10% delle richieste. Per ciascun miss vale 12 ÷ 0,10 = 120 ns.",
        "Con 40 ns per lettura, 120 ns corrispondono a tre livelli. Il percorso completo di miss costa 42 + 120 = 162 ns."
      ],
      quadro: [
        {tipo:"stato", titolo:"Misura", celle:[["Hit", "90%"], ["Media", "54 ns"], ["RAM", "40 ns"]]},
        {tipo:"stato", titolo:"Tempo comune", celle:[["TLB + dato", "42 ns"], ["Supplemento medio", "12 ns"]]},
        {tipo:"stato", titolo:"Peso dei miss", celle:[["Frequenza miss", "0,10"], ["Extra per miss", "120 ns"]]},
        {tipo:"stato", titolo:"Struttura ricostruita", celle:[["Livelli", "3"], ["Costo di miss", "162 ns"]]}
      ]
    });

  prova(5,1,'01_files_metadata','Collocare nome, dati e metadati',
    'La directory conserva il nome e il numero di inode associato. L’inode identifica il file, ne descrive i metadati, come la lunghezza logica, e permette di raggiungere i blocchi che contengono i byte. La richiesta stat consulta gli attributi descrittivi del file; una lettura del contenuto accede invece ai suoi blocchi dati. Rinominare una voce nella stessa directory cambia il nome mantenendo l’identità del file.',
    variant('In un file system con inode, si rinomina tesi in testo nella stessa directory. Quale struttura contiene il nuovo nome e quale identità designa il file dopo la rinomina?',
      [choice('Struttura',['Directory','Blocco dati','Bitmap'],'Directory','Il nome viene cercato nel contenitore padre.'),choice('Identità',['Stesso inode','Nuovo inode'],'Stesso inode','Una rinomina locale cambia l’associazione con il nome.')],
      ['La directory registra la coppia nome–numero di inode.','La rinomina locale sostituisce la voce tesi con la voce testo riferita allo stesso oggetto.','Il nuovo nome compare nella directory. I blocchi dati continuano ad appartenere allo stesso inode.']),
    variant('Un programma interroga tramite stat la lunghezza logica in byte e poi legge i primi quattro byte del file. Dove si trovano rispettivamente le informazioni richieste? Assumi un file ordinario con dati in blocchi esterni.',
      [choice('Lunghezza',['Inode','Nome nella directory','Blocco dati'],'Inode','È un attributo dell’oggetto condiviso dai suoi hard link.'),choice('Primi quattro byte',['Bitmap','Blocchi dati','Nome nella directory'],'Blocchi dati','Segui il riferimento al contenuto del file.')],
      ['La directory permette di ottenere l’inode associato al nome.','L’inode conserva la lunghezza logica fra i metadati del file.','La lettura associa l’offset zero al primo blocco dati e ne restituisce i primi quattro byte.']));
  function pathExam(path,cwd){
    const steps=pathTrace(path,cwd),last=steps[steps.length-1].valori[0][1];
    return variant('Radice inode 2, con corso → 7 e casa → 11. In 7 compaiono testo → 31 e dati → 42. In 11 compare testo → 55. Da CWD '+(cwd===7?'/corso':'/casa')+' risolvi '+path+'. Usa −1 per una ricerca fallita.',
      [num('Inode finale o −1',last==='—'?-1:last,'Usa la directory raggiunta al passo precedente come base.')],
      steps.map(s=>(s.titolo.startsWith('Componente ')?'Componente «'+s.titolo.slice(11)+'»':s.titolo)+': '+s.testo+' '+s.valori.map(([k,v])=>k+' = '+v).join(', ')+'.'));
  }
  prova(5,2,'02_path_resolution','Risoluzione a partire dalla directory corrente',
    'Un percorso è una successione di componenti separati da /. La barra iniziale sceglie la directory radice; negli altri casi si parte dalla directory corrente, indicata anche con CWD, current working directory. Il componente . conserva la directory raggiunta e .. risale a quella che la contiene. Ogni nome successivo viene cercato nella directory raggiunta dal componente precedente.',pathExam('../casa/testo',7),{
      consegna: "La radice contiene corso (inode 7) e casa (inode 11). Corso contiene testo (31) e dati (32), mentre casa contiene testo (41). Un programma avviato in /casa deve aprire l’inode 32. Scegli il percorso relativo utilizzabile e ricostruisci il primo inode raggiunto dopo aver lasciato casa.",
      campi: [
        choice("Percorso relativo", ["./dati", "../corso/dati", "../casa/testo"], "../corso/dati", "Risali al genitore prima di scegliere la directory sorella."),
        choice("Primo nodo dopo casa", ["Radice", "Inode 7", "Inode 32"], "Radice", "Il primo componente indica il genitore.")
      ],
      svolgimento: [
        "Il nome dati appartiene a corso. Partendo da casa occorre risalire alla radice con il componente «..».",
        "Dalla radice il componente corso individua l’inode 7, nel quale è registrato il nome desiderato.",
        "La ricerca di dati nell’inode 7 restituisce l’inode 32. Il percorso completo relativo è ../corso/dati. Il percorso ./dati cercherebbe il nome nella directory sbagliata."
      ],
      quadro: [
        {tipo:"stato", titolo:"Partenza", celle:[["Directory", "/casa"], ["Obiettivo", "inode 32"]]},
        {tipo:"stato", titolo:"Genitore", celle:[["Componente", ".."], ["Nodo", "radice"]]},
        {tipo:"stato", titolo:"Directory sorella", celle:[["Componente", "corso"], ["Inode", "7"]]},
        {tipo:"stato", titolo:"Oggetto", celle:[["Componente", "dati"], ["Inode", "32"]]}
      ]
    });
  function linksExam(open){
    return variant('I nomi a e b sono gli unici hard link all’inode 30. '+(open?'Un processo mantiene un descrittore aperto su a.':'Tutti i descrittori del file sono chiusi.')+' Il caso esclude mapping persistenti e altri riferimenti all’inode. Si eliminano prima a e poi b. Determina il link count finale e quando i blocchi diventano recuperabili.',
      [num('Link count finale',0,'Conta le voci di directory residue.'),choice('Recuperabilità',['Dopo unlink di b','Alla chiusura dell’ultimo descrittore aperto'],open?'Alla chiusura dell’ultimo descrittore aperto':'Dopo unlink di b','Valuta separatamente i riferimenti dei processi.')],
      ['Prima delle rimozioni il conteggio è 2, uno per ciascun nome.','Eliminare a lo riduce a 1. Eliminare b lo riduce a 0.',open?'Il descrittore aperto mantiene vivo l’oggetto senza nome. Alla chiusura finale i blocchi diventano recuperabili.':'Con zero link e zero riferimenti aperti, i blocchi diventano recuperabili dopo unlink di b.']);
  }
  prova(5,1,'03_links','Vita del file dopo unlink',
    'Un hard link è un nome di directory che designa un inode; il link count conta questi nomi. Un descrittore è il numero ottenuto aprendo il file, attraverso cui un processo può continuare a usarlo. Unlink rimuove il nome indicato. Un riferimento aperto o una mappatura in memoria, che rende i byte del file accessibili attraverso indirizzi del processo, può mantenere vivo l’oggetto anche dopo l’ultimo nome. Le tracce escludono queste ulteriori mappature e gli altri riferimenti oltre a quelli dichiarati.',linksExam(true),linksExam(false));
  function bitmapExam(blocks){
    const bytes=divUp(blocks,8);
    return variant('Il volume gestisce '+blocks+' blocchi. Una bitmap dedica un bit a ciascun blocco ed è memorizzata in byte interi. Determina dimensione minima e bit di riempimento.',
      [num('Byte minimi',bytes,'Arrotonda verso l’alto i gruppi di otto bit.'),num('Bit di riempimento',8*bytes-blocks,'Confronta i bit fisicamente riservati con il numero di blocchi.')],
      ['Servono '+blocks+' bit, uno per blocco.','La divisione per 8 arrotondata verso l’alto dà '+bytes+' byte.','Questi byte contengono '+(8*bytes)+' bit. I bit in eccesso sono '+(8*bytes-blocks)+'.']);
  }
  prova(5,4,'04_space_allocation','Dimensionare la bitmap di un volume',
    'Una bitmap dedica un bit a ogni blocco. I byte sono l’unità minima di memorizzazione della mappa e ciascuno contiene otto posizioni.',bitmapExam(32768),{
      consegna: "La bitmap di un volume occupa esattamente cinque byte. Un tecnico segnala che le ultime tre posizioni sono riempimento. Ricava il numero di blocchi del volume e l’indice dell’ultimo blocco, contando dal blocco zero.",
      campi: [
        num("Blocchi del volume", "37", "Sottrai le posizioni di riempimento alla capacità fisica della bitmap."),
        num("Indice massimo", "36", "Il primo blocco ha indice zero.")
      ],
      svolgimento: [
        "Cinque byte mettono a disposizione 5 × 8 = 40 posizioni.",
        "Le tre posizioni finali sono esterne alla numerazione delle risorse. I blocchi rappresentati sono 40 − 3 = 37.",
        "I 37 indici vanno da 0 a 36. Il candidato 37 ricadrebbe già nel riempimento."
      ],
      quadro: [
        {tipo:"stato", titolo:"Mappa", celle:[["Byte", "5"], ["Riempimento", "3 bit"]]},
        {tipo:"stato", titolo:"Capacità grezza", celle:[["Bit per byte", "8"], ["Posti totali", "40"]]},
        {tipo:"confronto", titolo:"Posizioni utilizzabili", celle:[["Bit validi", "37"], ["Blocchi", "37"]]},
        {tipo:"stato", titolo:"Ultimo indice", celle:[["Primo", "0"], ["Ultimo", "36"]]}
      ]
    });
  function fatExam(chain,b,pos){
    const k=Math.floor(pos/b), d=pos%b;
    return variant('La directory indica il primo blocco '+chain[0]+'. La FAT descrive '+chain.join(' → ')+' → fine. Il file riempie tutti i blocchi da '+b+' byte. Cerca il byte in posizione '+pos+' contando da zero.',
      [num('Blocco fisico',chain[k],'Il primo blocco della catena ha indice logico zero.'),num('Offset nel blocco',d,'Usa il resto della divisione per la dimensione del blocco.')],
      ['La posizione '+pos+' divisa per '+b+' dà indice '+k+' e resto '+d+'.','Dalla voce di directory segui '+k+' successori: '+chain.slice(0,k+1).join(' → ')+'.','Il blocco '+chain[k]+' contiene il byte. L’offset interno è '+d+', compreso fra 0 e '+(b-1)+'.']);
  }
  prova(5,4,'05_inode_fat','Individuare il byte nella catena FAT',
    'La FAT, file allocation table, associa al numero di ciascun blocco il numero del successivo oppure un segno di fine. La directory fornisce il primo blocco del file. Dividendo la posizione del byte per la grandezza del blocco, il quoziente intero dà l’indice logico, contato da zero, e il resto l’offset interno. Per l’indice k si seguono k collegamenti. Tornare a un blocco già visitato forma un ciclo, che ripete un tratto del file invece di raggiungerne uno nuovo.',fatExam([8,3,12,4],1024,3072),{
      consegna: "Un file di 2048 byte usa blocchi da 512 byte. La directory indica il blocco iniziale 6. La FAT contiene 6 → 10, 10 → 2, 2 → 10. Il lettore dovrebbe poter raggiungere quattro blocchi distinti. Individua il primo indice logico al quale torna un blocco già visitato e il minimo numero di voci FAT da correggere se il blocco 9, già riservato al file, contiene il quarto tratto. La sua voce è già marcata fine catena.",
      campi: [
        num("Primo indice con ripetizione", "3", "Numera da zero la sequenza dei blocchi visitati."),
        num("Voci da correggere", "1", "Il quarto blocco è già terminato. Cerca il solo collegamento entrante da riparare.")
      ],
      svolgimento: [
        "La lunghezza richiede 2048 ÷ 512 = 4 blocchi. I primi tre indici logici raggiungono rispettivamente 6, 10 e 2.",
        "La voce del blocco 2 conduce di nuovo a 10. Il quarto tratto del file coincide così con un tratto precedente.",
        "Sostituendo FAT[2] con 9 si ottiene 6 → 10 → 2 → 9. Poiché FAT[9] segnala già la fine della catena, è sufficiente modificare una voce. Il conteggio riguarda soltanto la FAT."
      ],
      figuraCorrezione: {"tipo": "catena", "catena": [6, 10, 2, 9], "errato": 10}
    });

  function snapshot(bit,ptr){
    const diagnosis=allocDiagnosis(bit,ptr);
    return variant('Dopo l’arresto, per il blocco dati 17 la bitmap vale '+bit+' (1 = allocato). La scansione completa degli inode trova '+ptr+' '+(ptr===1?'riferimento':'riferimenti')+' al blocco. Classifica lo stato e prevedi il rischio.',
      [choice('Diagnosi',['blocco riservato e irraggiungibile','riferimento a blocco libero','blocco raggiungibile e allocato'],diagnosis,'Incrocia le due fonti: chi usa il blocco e chi lo considera disponibile.'),
        choice('Rischio',['Perdita di spazio disponibile','Possibile sovrascrittura su una nuova assegnazione','Doppia registrazione dell’orario'], bit?'Perdita di spazio disponibile':'Possibile sovrascrittura su una nuova assegnazione','Considera quale decisione prenderebbe l’allocatore leggendo la bitmap.')],
      ['La bitmap classifica 17 come '+(bit?'occupato.':'disponibile per una nuova assegnazione.'),'Gli inode '+(ptr?'raggiungono il blocco: i suoi dati appartengono a un file.':'lasciano il blocco fuori dall’insieme raggiungibile.'),'La diagnosi è «'+diagnosis+'». '+(bit?'Il volume perde spazio utilizzabile fino alla riconciliazione.':'Una nuova assegnazione del blocco potrebbe sovrascrivere dati ancora raggiungibili.')]);
  }
  prova(6,1,'01_consistency','Diagnosticare uno stato persistente parziale',
    'La raggiungibilità di un blocco dipende dai puntatori dei file, mentre la bitmap guida l’allocatore. Una discordanza fra le due fonti può sottrarre spazio oppure esporre dati alla sovrascrittura.',snapshot(1,0),snapshot(0,1));
  function fsckExam(live,allocated){
    const missing=live.filter(v=>!allocated.includes(v)),lost=allocated.filter(v=>!live.includes(v));
    const show=s=>s.length?s.join(', '):'nessuno';
    return variant('Nell’area dati considerata gli inode integri raggiungono { '+live.join(', ')+' }, mentre la bitmap marca occupati { '+allocated.join(', ')+' }. Un blocco può appartenere a un solo file. Quanti bit occorre impostare e quanti azzerare per allinearla agli inode?',
      [num('Bit da impostare',missing.length,'Cerca gli elementi presenti solo nell’insieme degli inode.'),num('Bit da azzerare',lost.length,'Cerca gli elementi presenti solo nella bitmap.')],
      ['I blocchi raggiungibili segnati liberi sono: '+show(missing)+'. Si imposta il loro bit.','I blocchi occupati privi di proprietario sono: '+show(lost)+'. Si azzera il loro bit secondo la politica indicata.','Il bilancio è '+(missing.length===1?'un bit impostato':missing.length+' bit impostati')+' e '+(lost.length===1?'un bit azzerato':lost.length+' bit azzerati')+'. La bitmap finale contiene esattamente { '+live.join(', ')+' }.']);
  }
  prova(6,2,'02_fsck','Riparare la mappa dei blocchi occupati',
    'Con inode integri e un solo proprietario possibile per blocco, l’insieme dei blocchi raggiungibili è il riferimento per riparare la bitmap dell’area dati.',fsckExam([3,6,8],[3,8,11,12]),{
      consegna: "Dopo un crash, due file distinti con inode leggibili e puntatori compresi nell’area dati puntano entrambi al blocco dati 7. Il modello vieta condivisione e deduplicazione. La bitmap indica correttamente 7 come occupato. Un riparatore che allinea la mappa all’insieme dei blocchi raggiungibili dichiara conclusa la verifica. Quale vincolo resta violato? Quale informazione occorre conservare durante la scansione per scoprirlo?",
      campi: [
        choice("Vincolo violato", ["Un solo proprietario per blocco", "Allineamento del blocco", "Stato libero nella bitmap"], "Un solo proprietario per blocco", "Considera quante volte compare il blocco nei due file."),
        choice("Informazione necessaria", ["Elenco dei proprietari per blocco", "Numero di bit di riempimento", "Ultimo offset virtuale"], "Elenco dei proprietari per blocco", "Un insieme registra la presenza, mentre qui interessa la molteplicità.")
      ],
      svolgimento: [
        "L’unione dei riferimenti contiene soltanto 7. La bitmap contiene la stessa posizione, quindi la riparazione limitata ai bit lascia la mappa invariata.",
        "Il modello consente un unico proprietario. Una modifica al blocco attraverso A cambierebbe anche i dati letti da B.",
        "Una tabella dei proprietari raccoglie per 7 gli inode A e B. Il conteggio due rivela il conflitto e permette di segnalare entrambi i file prima di decidere come intervenire."
      ],
      quadro: [
        {tipo:"stato", titolo:"Osservazione", celle:[["Inode A", "7"], ["Inode B", "7"], ["Bitmap[7]", "1"]]},
        {tipo:"sequenza", titolo:"Controllo della mappa", celle:[["Raggiungibili", "{7}"], ["Occupati", "{7}"]]},
        {tipo:"confronto", titolo:"Vincolo distinto", celle:[["Proprietari", "A, B"], ["Consentiti", "1"]]},
        {tipo:"stato", titolo:"Prova diagnostica", celle:[["Blocco", "7"], ["Conteggio", "2"]]}
      ]
    });
  function orderExam(second){
    const opts=['Rendere durevoli tutti i record redo','Rendere durevole il commit','Installare le immagini nelle posizioni definitive'];
    const campi=[choice('Passo successivo',opts,opts[second?2:1],'Distingui il contenuto della transazione dalla prova che essa è stata confermata.')];
    if(second)campi.push(choice('Momento del riuso del journal',['Subito dopo il commit','Dopo l’invio delle scritture alle posizioni definitive','Dopo il checkpoint durevole che copre T'],'Dopo il checkpoint durevole che copre T','Chiediti quale copia sopravvive se il sistema si arresta subito dopo il riuso del journal.'));
    return variant(second?'Tutti i record redo e il commit di T sono durevoli. Le posizioni definitive conservano ancora le vecchie immagini. Quale operazione deve seguire e quando si potrà riusare lo spazio di journal di T?':'Un journal redo con politica di scrittura differita ha reso durevoli soltanto i record redo completi di T. Quale operazione deve precedere la prima installazione nelle posizioni definitive?',
      campi,
      ['Il protocollo rende prima durevoli le immagini nel journal, così un commit avrà sempre record completi.',second?'Anche il commit è già durevole. Il sistema può trasferire le immagini alle rispettive posizioni definitive.':'Prima della prima installazione occorre rendere durevole il commit: al riavvio il recupero saprà che T è confermata.', 'Il riuso dello spazio di T richiede che tutte le sue immagini siano durevoli nelle posizioni definitive e che il protocollo abbia registrato in sicurezza il relativo avanzamento.']);
  }
  prova(6,3,'03_write_order','Individuare la prossima scrittura consentita',
    'Una transazione raggruppa modifiche destinate a valere insieme. Il journal redo conserva record con le immagini finali dei blocchi; il commit è la conferma durevole, capace di sopravvivere a un arresto. Nella scrittura differita i record precedono il commit e l’installazione nelle sedi definitive viene dopo. Una copia ancora in memoria volatile può perdersi all’arresto. I record restano disponibili finché tutte le immagini sono durevoli nelle sedi finali e il checkpoint ha registrato il completamento: soltanto allora lo spazio può essere riutilizzato.',orderExam(false),{
      consegna: "Dopo il commit durevole di una transazione, il sistema installa A e avvia la scrittura di B. Lo spazio del journal viene riutilizzato subito, mentre B è ancora in memoria volatile. Al crash B torna al valore precedente. Individua l’azione anticipata e ordina le tre operazioni che consentirebbero il riuso dopo lo stato osservato.",
      campi: [
        choice("Azione anticipata", ["Riuso del journal", "Scrittura dei record prima del commit", "Installazione di A"], "Riuso del journal", "Cerca quale copia è stata eliminata prima della persistenza di B."),
        ordine('Ordine sicuro per lo spazio del journal',['Attendere la persistenza di B','Registrare un checkpoint durevole','Riutilizzare i record'],'A è già installato. Prima della liberazione devono essere durevoli sia il secondo blocco sia la prova del completamento.')
      ],
      svolgimento: [
        "Dopo il crash il sistema ritrova A aggiornato e B vecchio. Per completare B occorrerebbe l’immagine che è stata sovrascritta nel journal.",
        "L’invio della scrittura indica che il lavoro è iniziato. Il riuso richiede invece la conferma che anche B sia giunto in sede definitiva.",
        "Registrato in modo durevole il checkpoint successivo all’installazione, lo spazio dei record può essere riutilizzato. Prima di tale soglia il recupero può ancora averne bisogno."
      ],
      quadro: [
        {tipo:"stato", titolo:"Stato", celle:[["Commit", "durevole"], ["A", "durevole"], ["B", "volatile"]]},
        {tipo:"stato", titolo:"Perdita", celle:[["Journal", "riutilizzato"], ["B su disco", "vecchio"]]},
        {tipo:"confronto", titolo:"Ordine corretto", celle:[["Passo 1", "installare B"], ["Passo 2", "attendere persistenza"]]},
        {tipo:"stato", titolo:"Rilascio", celle:[["Immagini", "entrambe durevoli"], ["Checkpoint", "durevole"]]}
      ]
    });
  function redoExam(commit){
    return variant('Il valore durevole di X nella posizione definitiva è 4. Il journal contiene il record redo «X = 11» '+(commit?'e il suo commit durevole.':'senza un commit durevole.')+' Dopo il crash si trova ancora 4 nella posizione definitiva. Scegli la decisione e il valore dopo il recupero.',
      [choice('Decisione',['Applicare il redo','Ignorare la transazione'],commit?'Applicare il redo':'Ignorare la transazione','Cerca il punto che stabilisce la durabilità della decisione.'),num('X finale',commit?11:4,'Parti dal valore effettivamente persistito e applica solo i record confermati.')],
      ['La copia definitiva fornisce il valore iniziale del recupero: X = 4.','La scansione trova la nuova immagine X = 11 '+(commit?'e il commit che conferma T.':'priva di una conferma durevole.'),commit?'Il redo installa 11. Una seconda applicazione dello stesso record lascia X = 11.':'Il record è integro. In assenza del commit il recupero ignora la transazione e X conserva il valore 4.']);
  }
  prova(6,3,'04_journaling','Distinguere record e commit',
    'Un record redo descrive l’immagine da installare. La decisione di applicarlo dipende dalla presenza di un commit durevole per la sua transazione.',redoExam(true),redoExam(false));
  function recoveryExam(a,b){
    const av=a?12:3,bv=b?21:6;
    return variant('Due transazioni su blocchi distinti usano redo e scrittura differita. T1 porta A da 3 a 12, T2 porta B da 6 a 21. Al crash A e B contengono ancora 3 e 6. I record sono integri. Commit durevoli: '+(a&&b?'T1 e T2':a?'solo T1':'solo T2')+'. Calcola i valori finali e quelli osservati dopo una seconda esecuzione del recupero.',
      [num('A finale',av,'Esamina la decisione durevole di T1.'),num('B finale',bv,'Esamina separatamente T2.'),choice('Secondo recupero',['Stessa coppia','Entrambi i valori raddoppiano'],'Stessa coppia','I record indicano immagini finali dei blocchi.')],
      ['Per T1 il commit è '+(a?'durevole: si scrive A = 12.':'assente: resta A = 3.'),'Per T2 il commit è '+(b?'durevole: si scrive B = 21.':'assente: resta B = 6.'),'La coppia è ('+av+', '+bv+'). Ripetere assegnazioni assolute produce la stessa coppia. Il redo del modello è idempotente.']);
  }
  prova(6,3,'05_crash_recovery','Recuperare due transazioni indipendenti',
    'Quando le transazioni modificano blocchi distinti, il recupero valuta separatamente i rispettivi commit. Ripetere l’assegnazione della stessa immagine lascia invariato il valore installato.',recoveryExam(true,false),{
      consegna: "T1 assegna A = 12 al posto di 3 e T2 assegna B = 21 al posto di 6. I blocchi sono distinti, i record redo integri e le scritture definitive differite fino al recupero. Prima del recupero A e B valgono ancora 3 e 6. Dopo un recupero completo si osservano A = 3 e B = 21. Ricostruisci quali commit erano durevoli e prevedi B se il recupero viene ripetuto.",
      campi: [
        choice("Commit durevoli", ["Solo T1", "Solo T2", "Entrambi", "Nessuno"], "Solo T2", "Individua quale assegnazione ha effettivamente cambiato un valore."),
        num("B dopo il secondo recupero", "21", "Il record specifica una nuova immagine del blocco.")
      ],
      svolgimento: [
        "Se il commit di T1 fosse durevole, il recupero completo installerebbe 12. Il valore 3 esclude tale possibilità nelle ipotesi date.",
        "B è passato da 6 a 21 durante il recupero. Soltanto il record autorizzato di T2 può produrre quel cambiamento, dunque il suo commit era durevole.",
        "Ripetere il redo di T2 assegna ancora 21 al blocco B. La seconda esecuzione lascia la coppia 3 e 21."
      ],
      figuraCorrezione: {"tipo": "redoInverso", "iniziali": [3, 6], "immagini": [12, 21], "finali": [3, 21]}
    });

  const goals=['Riservatezza','Integrità','Disponibilità'];
  prova(7,1,'01_protection_goals','Riconoscere la proprietà compromessa',
    'La riservatezza riguarda chi può conoscere un contenuto, l’integrità quali modifiche sono ammissibili e la disponibilità la possibilità di usare il servizio quando necessario.',
    variant('Un account privo del diritto di visione riesce a leggere e copiare un verbale. Il servizio rimane accessibile e il documento conserva i byte originari. Quale proprietà è stata compromessa?',
      [choice('Proprietà',goals,'Riservatezza','Segui il flusso di informazione verso il destinatario.')],
      ['Il verbale è l’oggetto, l’account è il soggetto e la copia implica lettura.','La politica limita l’insieme dei destinatari. L’account ha acquisito il contenuto fuori da quell’insieme.','La proprietà violata è la riservatezza dei dati.']),
    variant('Un salvataggio autorizzato per errore cambia i voti già convalidati. Gli utenti continuano a consultare il registro e la sua visibilità resta quella prevista. Quale proprietà del contenuto si è persa?',
      [choice('Proprietà',goals,'Integrità','Confronta i valori pubblicati con quelli convalidati.')],
      ['Il controllo d’accesso ha consentito la scrittura dell’account.','Dopo la scrittura alcuni valori differiscono dai dati convalidati, anche se lettori e disponibilità del servizio restano quelli previsti.','La proprietà coinvolta è l’integrità del registro.']));
  function aclExam(member,op){
    const granted=op==='lettura'||member;
    return variant('ACL additiva per l’oggetto relazione: account Ada → lettura. Gruppo revisori → modifica. Assenza di regole deny e di altri privilegi. Ada '+(member?'appartiene al gruppo revisori.':'è esterna al gruppo revisori.')+' Richiede '+op+'. Determina i diritti effettivi e l’esito.',
      [choice('Diritti effettivi',['Lettura','Lettura e modifica'],member?'Lettura e modifica':'Lettura','Unisci soltanto le voci applicabili al soggetto.'),choice('Decisione',['Concedere','Negare'],granted?'Concedere':'Negare','Controlla se l’operazione compare nell’insieme ricavato.')],
      ['La voce individuale concede ad Ada il diritto di lettura.',member?'Ada fa parte di revisori. Si aggiunge la modifica. I diritti effettivi sono lettura e modifica.':'La voce di gruppo si applica ai revisori. Per Ada resta soltanto la lettura.', 'Per '+op+' il confronto dà '+(granted?'accesso concesso.':'accesso negato.')]);
  }
  prova(7,1,'02_acl','Comporre i diritti individuali e di gruppo',
    'Una ACL, access control list, è una lista che assegna diritti su un oggetto a account o gruppi di account. Una voce individuale si applica all’account nominato; una voce di gruppo ai suoi membri. Nella politica additiva ogni voce applicabile contribuisce all’unione dei diritti effettivi. Le tracce escludono regole deny, cioè divieti espliciti, e specificano gli eventuali vincoli sull’appartenenza ai gruppi.',aclExam(true,'modifica'),{
      consegna: "La ACL è additiva e usa soltanto queste voci: Ada → lettura, revisori → modifica, tecnici → lettura, autori → modifica. Ada legge già il file e deve ottenere la modifica. Il responsabile può aggiungerla a un solo gruppo e il regolamento vieta agli esterni l’ingresso in autori. Ada è esterna e al momento è soltanto nei tecnici. Scegli una modifica ammessa e indica quali diritti avrà sul file.",
      campi: [
        choice("Intervento", ["Aggiungerla ai revisori", "Aggiungerla agli autori", "Rimuoverla dai tecnici"], "Aggiungerla ai revisori", "Cerca un gruppo ammesso che conceda il diritto mancante."),
        choice("Diritti successivi", ["Sola modifica", "Sola lettura", "Lettura e modifica"], "Lettura e modifica", "Unisci le voci che restano applicabili.")
      ],
      svolgimento: [
        "Entrambi i gruppi aggiungerebbero la modifica secondo la ACL. La voce dei tecnici concede soltanto lettura.",
        "Il regolamento esclude autori per questo account. L’aggiunta ai revisori è l’unico intervento proposto che rispetta la regola e concede la modifica.",
        "L’unione comprende la lettura già concessa ad Ada e la modifica ereditata dai revisori. Entrambe le operazioni saranno ammesse su questo file."
      ],
      quadro: [
        {tipo:"confronto", titolo:"Vincoli", celle:[["Account", "Ada"], ["Ha", "lettura"], ["Richiede", "modifica"]]},
        {tipo:"confronto", titolo:"Voci utili", celle:[["Revisori", "modifica"], ["Autori", "modifica"]]},
        {tipo:"sequenza", titolo:"Gruppo ammesso", celle:[["Autori", "escluso"], ["Revisori", "ammesso"]]},
        {tipo:"stato", titolo:"Diritti risultanti", celle:[["Individuale", "lettura"], ["Revisori", "modifica"]]}
      ]
    });
  function dirExam(list){
    return variant('Su /archivio il richiedente dispone '+(list?'solo di r (elenco)':'solo di x (attraversamento)')+'. La radice concede x e il file noto /archivio/esiti concede r. Considera un semplice elenco dei nomi senza stat e una lettura di esiti tramite nome noto.',
      [choice('Elenco dei nomi',['Riesce','Fallisce'],list?'Riesce':'Fallisce','Leggere le voci richiede r sulla directory.'),choice('Apertura del nome noto',['Riesce','Fallisce'],list?'Fallisce':'Riesce','Per risolvere esiti occorre x su archivio.')],
      ['La radice consente di raggiungere la directory archivio.',list?'Il bit r della directory permette di leggerne l’elenco dei nomi.':'Manca r sulla directory. La richiesta di elenco fallisce.',list?'Manca x su archivio e la ricerca di esiti si arresta prima della verifica del permesso di lettura del file.':'Il bit x consente di risolvere esiti. Il bit r del file permette quindi l’apertura per lettura.']);
  }
  prova(7,2,'03_directory_access','Separare elenco e ricerca per nome',
    'Sulla directory, r permette di leggere l’elenco dei nomi e x permette di cercare un nome per raggiungerne l’oggetto. Sul file finale r permette di leggere il contenuto. Le tracce considerano il semplice elenco dei nomi; stat, la richiesta degli attributi di ciascun oggetto, richiederebbe di raggiungerlo e valutare anche il permesso di ricerca. La risoluzione del percorso deve riuscire prima che vengano esaminati i diritti sul file finale.',dirExam(true),dirExam(false));
  function cryptoExam(key){
    return variant('Un osservatore ha una copia di un volume cifrato offline '+(key?'e la chiave corretta in chiaro.':'ed è privo di chiave, copie in chiaro e credenziali utili.')+' Assumi un cifrario sicuro, formato del volume noto e assenza di ulteriori livelli di cifratura. Quale contenuto può ricostruire dai blocchi?',
      [choice('Osservazione',['Blocchi cifrati senza decifrazione praticabile','Contenuto decifrabile'],key?'Contenuto decifrabile':'Blocchi cifrati senza decifrazione praticabile','Controlla quali elementi della trasformazione inversa sono disponibili.')],
      ['La copia bit per bit fornisce i blocchi nella rappresentazione cifrata.','Per invertire la trasformazione occorrono il formato e la chiave corretta.',key?'L’osservatore li possiede entrambi. Può ricostruire il contenuto in chiaro fuori dal sistema che gestiva i permessi.':'L’osservatore conosce il formato e dispone soltanto dei blocchi cifrati. Per ricostruire i byte in chiaro gli manca la chiave.']);
  }
  prova(7,3,'04_cryptofs','Valutare l’esposizione a volume spento',
    'La cifratura a riposo conserva i blocchi del supporto in una forma trasformata, ricostruibile con la chiave corretta. Una copia offline è letta fuori dal sistema avviato che gestiva i file, per esempio dopo aver copiato il disco a macchina spenta. I permessi dei file vengono applicati dal sistema operativo quando media una richiesta; un programma che decifra direttamente la copia dei blocchi segue un percorso diverso. Per giudicare l’esposizione occorre stabilire quali copie, chiavi e interfacce abbia l’osservatore.',cryptoExam(false),{
      consegna: "Un volume cifrato è stato copiato a macchina spenta. Il rapporto afferma che i permessi dei singoli file impedirebbero ogni lettura anche a chi possedesse la chiave corretta e il formato del volume. Si assume un cifrario sicuro e una sola cifratura di volume. Scegli l’esperimento che mette alla prova l’affermazione e l’osservazione che la confuta.",
      campi: [
        choice("Esperimento", ["Decifrare la copia offline con la chiave", "Elencare soltanto i nomi cifrati", "Contare le letture negate sul server"], "Decifrare la copia offline con la chiave", "Segui l’interfaccia realmente usata dall’osservatore."),
        choice("Osservazione decisiva", ["Un blocco torna in chiaro fuori dal sistema dei file", "La lettura tramite account viene negata", "Le dimensioni dei blocchi coincidono"], "Un blocco torna in chiaro fuori dal sistema dei file", "Chiediti quale componente applicherebbe i permessi in questo percorso.")
      ],
      svolgimento: [
        "Il sistema operativo applica i permessi quando gestisce le richieste ai file. La copia grezza può essere letta anche da un programma esterno a quel sistema.",
        "Usando la chiave corretta e il formato conosciuto, l’osservatore può invertire la trasformazione sul blocco copiato.",
        "Il recupero dei byte in chiaro mostra che i permessi originali agivano su un’interfaccia diversa. Un rifiuto osservato sul server resterebbe compatibile con la lettura offline."
      ],
      quadro: [
        {tipo:"confronto", titolo:"Tesi da esaminare", celle:[["Supporto", "copia offline"], ["Chiave", "disponibile"]]},
        {tipo:"confronto", titolo:"Due percorsi", celle:[["Servizio", "controlla l’account"], ["Offline", "usa la chiave"]]},
        {tipo:"stato", titolo:"Esperimento", celle:[["Ingresso", "blocco cifrato"], ["Operazione", "decifrazione"]]},
        {tipo:"sequenza", titolo:"Conclusione", celle:[["Blocco", "leggibile"], ["ACL originale", "fuori percorso"]]}
      ]
    });
  function auditExam(account,stop){
    const rows=logbook.filter(e=>e[0]<=stop&&e[1]===account&&e[2]==='tesi'),success=rows.filter(e=>e[4]==='concessa').length;
    return variant('Registro in ordine di minuto: '+logbook.map(e=>e.join(' / ')).join(' · ')+'. Fino al minuto '+stop+' incluso, conta le richieste dell’account '+account+' su tesi e quante sono state concesse. Quale attribuzione è sostenuta dalle righe?',
      [num('Richieste selezionate',rows.length,'Applica insieme tempo, account e oggetto.'),num('Richieste concesse',success,'Conta gli esiti dopo il filtro.'),choice('Attribuzione',['Account registrato','Persona fisica identificata con certezza'],'Account registrato','Il campo soggetto identifica una sessione associata a un account.')],
      ['Il filtro mantiene i minuti '+rows.map(e=>e[0]).join(', ')+': ciascuna riga riguarda '+account+' e tesi nell’intervallo richiesto.','Le righe selezionate sono '+rows.length+'. Gli esiti concessi sono '+success+' e quelli negati '+(rows.length-success)+'.','Le evidenze attribuiscono gli eventi all’account '+account+'. Per identificare la persona servirebbero riscontri ulteriori.']);
  }
  prova(7,4,'05_auditing','Delimitare una conclusione di audit',
    'L’attribuzione di un evento dipende dai campi registrati. Il filtro temporale, l’account e l’oggetto delimitano le righe pertinenti. L’esito distingue le richieste concesse da quelle respinte.',auditExam('ada',6),{
      consegna: "Un registro autentico contiene al minuto 2 «ada / tesi / modifica / negata», al minuto 4 «ada / tesi / lettura / concessa» e al minuto 5 «leo / tesi / modifica / concessa». Il revisore scrive che Ada ha modificato tesi al minuto 2. Seleziona la riga che smentisce quella specifica conclusione e la frase che i dati consentono di sostenere.",
      campi: [
        num("Minuto del riscontro decisivo", "2", "Confronta account, operazione, oggetto e soprattutto esito con la frase del revisore."),
        choice("Conclusione documentata", ["La modifica di Ada è stata respinta", "La lettura di Ada prova una modifica", "Leo ha usato le credenziali di Ada"], "La modifica di Ada è stata respinta", "Una lettura concessa attesta un’operazione diversa da una modifica.")
      ],
      svolgimento: [
        "La riga del minuto 2 coincide per account, oggetto e operazione. L’esito è negata, perciò documenta un tentativo respinto.",
        "La riga del minuto 4 riguarda una lettura. Quella del minuto 5 registra una modifica con un altro account. Entrambe descrivono eventi distinti.",
        "L’attribuzione sostenuta dal registro riguarda la richiesta di modifica respinta per l’account ada. Per identificare una persona fisica servirebbero riscontri ulteriori."
      ],
      figuraCorrezione: {"tipo": "auditConfronto", "righe": [[2, "ada", "modifica", "negata"], [4, "ada", "lettura", "concessa"], [5, "leo", "modifica", "concessa"]]}
    });

  // Questi listati sono dati della consegna, consultabili prima della verifica.
  for (const v of SL.prove['6.4'][1].varianti) v.listato = v.codice;
  for (const v of SL.prove['6.4'][3].varianti) v.listato = v.codice;
})();
