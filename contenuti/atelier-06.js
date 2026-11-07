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
  const variant=(consegna,campi,svolgimento,codice)=>({consegna,campi,svolgimento,...(codice?{codice}:{})});
  function prova(ch,u,id,titolo,principio,...varianti){
    (SL.prove['6.'+ch]??=[]).push({titolo,principio,unita:'6.'+ch+'.'+u,attivita:'cslez6_'+ch+'_'+id,varianti});
  }

  prova(1,1,'01_memory_technologies','Scegliere la tecnologia della cella',
    'Il supporto fisico del bit condiziona latenza, densità e necessità di mantenimento. Per identificare una tecnologia di memoria si parte dal fenomeno che conserva lo stato della cella.',
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
    'Una linea comprende un intervallo allineato di indirizzi consecutivi. Per contare le linee toccate servono il primo e l’ultimo byte incluso nella scansione.',locality(64,16),locality(60,18));
  function cacheExam(refs){
    const rows=cacheTrace(refs,16,2), end=rows[rows.length-1];
    return variant('Cache diretta vuota: due posizioni, linee da 16 byte, write-back con write-allocate. Traccia '+refs.map(([a,w])=>(w?'scrivi ':'leggi ')+a).join(' → ')+'. Conta hit e riscritture di vittime sporche fino all’ultimo accesso, senza svuotamento finale.',
      [num('Hit',end.hits,'L’indice è il blocco modulo due. Confronta il tag residente.'),num('Write-back',end.writebacks,'Conta soltanto le espulsioni di blocchi modificati.')],
      rows.map((r,i)=>(i+1)+'. Blocco '+r.block+', indice '+r.index+', tag '+r.tag+': '+(r.hit?'hit':r.old?'miss con espulsione del tag '+r.old.tag+(r.old.dirty?' sporco':' pulito'):'miss a posizione vuota')+'. La linea termina '+(r.dirty?'sporca.':'pulita.')).concat('Totali: '+end.hits+' hit e '+end.writebacks+' write-back.'));
  }
  prova(1,2,'03_cache_behavior','Espulsioni e blocchi sporchi',
    'L’indice di una cache diretta sceglie l’unica posizione disponibile per un blocco. Il tag identifica il blocco residente. Con write-allocate un miss in scrittura carica il blocco. Con write-back le modifiche rimangono nella linea contrassegnata dal bit dirty fino alla sua espulsione.',cacheExam([[0,true],[4,false],[32,false],[16,true]]),cacheExam([[16,true],[48,true],[18,false],[20,false],[0,false]]));
  function amat(hit,miss,pen){
    const result=hit+miss*pen/100;
    return variant('Cache con consultazione da '+hit+' ns, '+miss+' miss su cento richieste e penalità aggiuntiva di '+pen+' ns per miss. Calcola il tempo medio.',
      [num('AMAT in ns',result,'Attribuisci la consultazione a tutte le richieste.')],
      ['Le cento consultazioni costano 100 × '+hit+' = '+100*hit+' ns.','I rifornimenti aggiungono '+miss+' × '+pen+' = '+miss*pen+' ns.','Il totale di '+(100*hit+miss*pen)+' ns diviso per cento dà '+fmt(result)+' ns per accesso.']);
  }
  prova(1,3,'04_cache_performance','Pesare il costo di un miss',
    'Il tempo di ricerca in cache si paga anche in caso di miss. La penalità aggiuntiva incide sulla media in proporzione alla frequenza con cui viene sostenuta.',amat(2,10,50),amat(3,5,30));
  function designs(h1,m1,h2,m2,pen){
    const a=h1+m1*pen/100,b=h2+m2*pen/100;
    return variant('Due cache hanno penalità aggiuntiva '+pen+' ns. A: hit time '+h1+' ns e '+m1+'% di miss. B: hit time '+h2+' ns e '+m2+'% di miss. A parità di altri vincoli, scegli la latenza media inferiore.',
      [choice('Progetto',['A','B'],a<b?'A':'B','Pesa la penalità separatamente per ciascun progetto.')],
      ['A richiede '+h1+' + '+m1+'/100 × '+pen+' = '+fmt(a)+' ns.','B richiede '+h2+' + '+m2+'/100 × '+pen+' = '+fmt(b)+' ns.','Il progetto '+(a<b?'A':'B')+' riduce la media di '+fmt(Math.abs(a-b))+' ns per accesso.']);
  }
  prova(1,3,'05_hierarchy_design','Progettare sotto un vincolo di latenza',
    'Una cache più rapida in caso di hit può perdere il vantaggio se deve rifornirsi spesso. Per confrontare i progetti occorre pesare la stessa penalità con la frequenza di miss di ciascuno.',designs(1,10,3,2,50),designs(1,5,3,2,20));

  function procFrames(fa,fb,off){
    return variant('Due processi leggono VPN 5, offset '+off+', con pagine da 4 KiB. A mappa VPN 5 al frame '+fa+', B al frame '+fb+'. Determina gli indirizzi fisici e la relazione fra i byte.',
      [num('PA di A',fa*4096+off,'Moltiplica il PFN di A per 4096.'),num('PA di B',fb*4096+off,'La tabella di B determina la sua base.'),choice('Relazione',['Stesso byte fisico','Byte fisici distinti'],fa===fb?'Stesso byte fisico':'Byte fisici distinti','Confronta sia il frame sia l’offset.')],
      ['L’identità virtuale 5 seleziona una voce in ciascuna delle due tabelle.','A ottiene '+fa+' × 4096 + '+off+' = '+(fa*4096+off)+'. B ottiene '+fb+' × 4096 + '+off+' = '+(fb*4096+off)+'.',fa===fb?'I due indirizzi coincidono: entrambi i processi osservano lo stesso byte fisico.':'I frame differiscono e i due indirizzi fisici designano byte distinti.']);
  }
  prova(2,1,'01_address_spaces','Isolamento e condivisione della pagina',
    'L’offset sceglie il byte entro una pagina. La tabella attiva per un processo decide quale frame fisico ospita quella pagina virtuale.',procFrames(4,8,72),procFrames(7,7,4095));
  function pageSplit(va,b){
    const q=Math.floor(va/b), d=va%b;
    return variant('Le pagine hanno '+b+' byte. Scomponi VA '+hex(va)+' ('+va+' in decimale).',
      [num('VPN',q,'Usa il quoziente intero VA / dimensione.'),num('Offset',d,'Sottrai la base della pagina al VA.')],
      ['La pagina zero copre da zero a '+(b-1)+', quindi ogni pagina successiva inizia a un multiplo di '+b+'.','La divisione di '+va+' per '+b+' dà quoziente '+q+' e resto '+d+'.','La ricostruzione '+q+' × '+b+' + '+d+' = '+va+' conferma entrambi i campi.']);
  }
  prova(2,1,'02_paging','Separare VPN e offset',
    'L’indirizzo virtuale conta i byte dall’origine dello spazio. Quoziente e resto della divisione per la dimensione di pagina ne danno rispettivamente la pagina e la posizione interna.',pageSplit(0x3fff,4096),pageSplit(0x2800,2048));
  function entry(va,pte){
    const f=Math.floor(pte/2), ok=pte%2, off=va%4096;
    return variant('Pagina da 4096 byte. La voce per VA '+hex(va)+' vale '+pte+' e codifica 2 × PFN + present. La regione è allocata e leggibile. Determina l’esito e, se presente, il PA. Usa −1 nel campo PA per una pagina assente.',
      [choice('Esito',['Accesso in RAM','Fault di assenza'],ok?'Accesso in RAM':'Fault di assenza','Leggi il bit meno significativo.'),num('PA oppure −1',ok?f*4096+off:-1,'Usa il PFN soltanto quando present vale uno.')],
      ['Il resto della divisione dell’indirizzo per 4096 dà offset '+off+'.','Il bit present è '+pte+' modulo 2 = '+ok+'.',ok?'Il PFN è ('+pte+' − 1)/2 = '+f+'. PA = '+f+' × 4096 + '+off+' = '+(f*4096+off)+'.':'La MMU segnala assenza. Il campo PFN è inutilizzabile in questo stato. Si inserisce −1.']);
  }
  prova(2,2,'03_page_tables','Interpretare una voce di pagina',
    'Il bit di presenza indica se la traduzione può usare il frame della voce. Il permesso della regione e la residenza in RAM sono proprietà distinte.',entry(0x3007,19),entry(0x4af0,18));
  function faultExam(dirty){
    return variant('Una lettura ammessa incontra una pagina assente con copia nel file. La RAM è piena. La vittima è '+(dirty?'sporca':'pulita e ricostruibile')+'. Conta i trasferimenti di pagina su disco (letture e scritture) e indica quando riprende l’istruzione.',
      [num('Trasferimenti',dirty?2:1,'Distingui il salvataggio della vittima dalla lettura della pagina richiesta.'),choice('Ripresa',['Dopo l’installazione della nuova mappatura','Alla scelta della vittima','Prima della lettura del file'],'Dopo l’installazione della nuova mappatura','La CPU ha bisogno di una traduzione residente e utilizzabile.')],
      ['L’eccezione sospende il caricamento. Il kernel verifica la regione e sceglie la vittima.',dirty?'La vittima contiene modifiche e richiede una scrittura su disco prima del riuso del frame.':'La vittima pulita ha una copia valida. Il frame può essere riusato senza scrivere la pagina.', 'Il kernel ritira la vecchia mappatura e invalida le traduzioni interessate prima del riuso. Legge la pagina richiesta nel frame, installa la nuova mappatura e ritenta l’istruzione. '+(dirty?'Si contano una scrittura e una lettura su disco.':'L’unico trasferimento è la lettura dal file.')]);
  }
  prova(2,2,'04_page_faults','Recuperare una pagina con RAM piena',
    'Quando la RAM è piena, il rimpiazzo deve preservare le modifiche della vittima prima di riutilizzarne il frame. Il caricamento della pagina richiesta precede il ritentativo.',faultExam(false),faultExam(true));
  function ws(seq,w,frames){
    const window=seq.slice(-w), pages=[...new Set(window)],delta=Math.max(0,pages.length-frames);
    return variant('Traccia '+seq.join(' ')+'. All’ultimo istante considera gli ultimi '+w+' riferimenti e un budget di '+frames+' frame. Quante pagine distinte contiene la finestra e quanti frame aggiuntivi servirebbero a contenerle tutte?',
      [num('Pagine distinte',pages.length,'Le ripetizioni si contano una sola volta.'),num('Frame aggiuntivi',delta,'Confronta la cardinalità con il budget, usando zero se è sufficiente.')],
      ['Gli ultimi '+w+' riferimenti sono '+window.join(' ')+'.','Eliminando le ripetizioni resta l’insieme { '+pages.join(', ')+' }, di cardinalità '+pages.length+'.','Il deficit è max(0, '+pages.length+' − '+frames+') = '+delta+' frame.']);
  }
  prova(2,3,'05_working_set','Stimare il budget di frame',
    'Il working set conta le pagine distinte in una finestra temporale. Il confronto con i frame disponibili stabilisce se la RAM può mantenerle tutte residenti insieme.',ws(['A','B','A','C','D'],4,3),ws(['B','C','B','B','A'],3,3));

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
    'Una TLB con identificatori di spazio conserva coppie ASID/VPN. Due accessi alla stessa pagina numerica in processi diversi richiedono traduzioni distinte.',tlbExam(['A/2','A/2','B/2','A/3','A/2']),tlbExam(['A/1','B/1','A/1','A/2','A/1']));
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
    'Un array di coppie VPN/PFN si può cercare confrontando la VPN di ciascuna voce. Il passo del puntatore comprende entrambi i campi del record.',lookupExam(10),lookupExam(9));
  function indexExam(va,b){
    const f=walkParts(va,b),high=20-b;
    return variant('VA a 32 bit '+hex(va)+', ripartizione '+high+'/'+b+'/12 dall’alto verso il basso. Restituisci i tre campi in ordine.',
      [num('Indice superiore',f.high,'Rimuovi i '+(12+b)+' bit inferiori.'),num('Indice inferiore',f.low,'Dopo lo spostamento di 12, conserva '+b+' bit.'),num('Offset',f.off,'Applica la maschera 0xFFF.')],
      ['L’indice superiore è floor('+hex(va)+' / 2^'+(12+b)+') = '+f.high+'.','Il numero di pagina è '+Math.floor(va/4096)+'. Il resto modulo '+2**b+' è '+f.low+', indice inferiore.','Gli ultimi dodici bit danno '+f.off+'. Ricomponendo ('+f.high+' × '+2**b+' + '+f.low+') × 4096 + '+f.off+' si ritrova '+hex(va)+'.']);
  }
  prova(4,3,'03_multilevel_indexes','Separare gli indici per due geometrie',
    'La ripartizione dell’indirizzo stabilisce quante posizioni assegnare a indice di radice, indice di foglia e offset. La geometria determina quindi le maschere e gli scorrimenti.',indexExam(0x67def123,12),indexExam(0x45678234,11));
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
    'In un percorso a due livelli il secondo caricamento usa come base il puntatore restituito dal primo. Solo la foglia contiene i bit che individuano il frame del dato.',walkExam(0xc0504d,10,27),walkExam(0xfabfff,8,45));
  function translationTime(l,ram,t,h){
    const hit=t+ram,miss=hit+l*ram,avg=hit+(100-h)*l*ram/100;
    return variant('TLB seriale da '+t+' ns, RAM da '+ram+' ns, '+l+' livelli in RAM, tutte le pagine residenti, '+h+'% di hit. Includi l’accesso dati e calcola il costo di miss e la media.',
      [num('Costo del miss (ns)',miss,'Conta anche l’ultima lettura dei dati.'),num('Media (ns)',avg,'La consultazione TLB avviene anche durante un miss.')],
      ['Un hit costa '+t+' + '+ram+' = '+hit+' ns.','Un miss aggiunge '+l+' letture da '+ram+' ns al percorso di hit: totale '+miss+' ns.','Su cento accessi la media è ('+h+' × '+hit+' + '+(100-h)+' × '+miss+') / 100 = '+fmt(avg)+' ns.']);
  }
  prova(4,4,'05_translation_cost','Separare costo di hit, miss e media',
    'Per una pagina residente, un miss della TLB richiede letture delle tabelle prima della lettura del dato. Occorre contare separatamente queste letture e il costo della consultazione TLB.',translationTime(2,50,1,90),translationTime(3,80,2,95));

  prova(5,1,'01_files_metadata','Collocare nome, dati e metadati',
    'Il nome è conservato nella directory. L’inode identifica il file, ne descrive i metadati e permette di raggiungere i blocchi che contengono i byte letti.',
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
      steps.map(s=>s.titolo+'. '+s.testo+' '+s.valori.map(([k,v])=>k+' = '+v).join(', ')+'.'));
  }
  prova(5,2,'02_path_resolution','Risoluzione a partire dalla directory corrente',
    'Ogni componente di un percorso viene risolto nella directory raggiunta dal precedente. La directory iniziale è la radice per i percorsi assoluti e quella corrente per i relativi.',pathExam('../casa/testo',7),pathExam('./dati',11));
  function linksExam(open){
    return variant('I nomi a e b sono gli unici hard link all’inode 30. '+(open?'Un processo mantiene un descrittore aperto su a.':'Tutti i descrittori del file sono chiusi.')+' Il caso esclude mapping persistenti e altri riferimenti all’inode. Si eliminano prima a e poi b. Determina il link count finale e quando i blocchi diventano recuperabili.',
      [num('Link count finale',0,'Conta le voci di directory residue.'),choice('Recuperabilità',['Dopo unlink di b','Alla chiusura dell’ultimo descrittore aperto'],open?'Alla chiusura dell’ultimo descrittore aperto':'Dopo unlink di b','Valuta separatamente i riferimenti dei processi.')],
      ['Prima delle rimozioni il conteggio è 2, uno per ciascun nome.','Eliminare a lo riduce a 1. Eliminare b lo riduce a 0.',open?'Il descrittore aperto mantiene vivo l’oggetto senza nome. Alla chiusura finale i blocchi diventano recuperabili.':'Con zero link e zero riferimenti aperti, i blocchi diventano recuperabili dopo unlink di b.']);
  }
  prova(5,1,'03_links','Vita del file dopo unlink',
    'I nomi nella directory e i descrittori aperti mantengono riferimenti di natura diversa. Dopo unlink il file può restare accessibile attraverso un descrittore già aperto.',linksExam(true),linksExam(false));
  function bitmapExam(blocks){
    const bytes=divUp(blocks,8);
    return variant('Il volume gestisce '+blocks+' blocchi. Una bitmap dedica un bit a ciascun blocco ed è memorizzata in byte interi. Determina dimensione minima e bit di riempimento.',
      [num('Byte minimi',bytes,'Arrotonda verso l’alto i gruppi di otto bit.'),num('Bit di riempimento',8*bytes-blocks,'Confronta i bit fisicamente riservati con il numero di blocchi.')],
      ['Servono '+blocks+' bit, uno per blocco.','La divisione per 8 arrotondata verso l’alto dà '+bytes+' byte.','Questi byte contengono '+(8*bytes)+' bit. I bit in eccesso sono '+(8*bytes-blocks)+'.']);
  }
  prova(5,4,'04_space_allocation','Dimensionare la bitmap di un volume',
    'Una bitmap dedica un bit a ogni blocco. I byte sono l’unità minima di memorizzazione della mappa e ciascuno contiene otto posizioni.',bitmapExam(32768),bitmapExam(32771));
  function fatExam(chain,b,pos){
    const k=Math.floor(pos/b), d=pos%b;
    return variant('La directory indica il primo blocco '+chain[0]+'. La FAT descrive '+chain.join(' → ')+' → fine. Il file riempie tutti i blocchi da '+b+' byte. Cerca il byte in posizione '+pos+' contando da zero.',
      [num('Blocco fisico',chain[k],'Il primo blocco della catena ha indice logico zero.'),num('Offset nel blocco',d,'Usa il resto della divisione per la dimensione del blocco.')],
      ['La posizione '+pos+' divisa per '+b+' dà indice '+k+' e resto '+d+'.','Dalla voce di directory segui '+k+' successori: '+chain.slice(0,k+1).join(' → ')+'.','Il blocco '+chain[k]+' contiene il byte. L’offset interno è '+d+', compreso fra 0 e '+(b-1)+'.']);
  }
  prova(5,4,'05_inode_fat','Individuare il byte nella catena FAT',
    'Nella FAT la directory fornisce il primo blocco del file. Le voci successive permettono di raggiungere il blocco logico desiderato seguendo un collegamento per volta.',fatExam([8,3,12,4],1024,3072),fatExam([6,10,2,9],512,1023));

  function snapshot(bit,ptr){
    const diagnosis=allocDiagnosis(bit,ptr);
    return variant('Dopo l’arresto, per il blocco dati 17 la bitmap vale '+bit+' (1 = allocato). La scansione completa degli inode trova '+ptr+' riferimenti al blocco. Classifica lo stato e prevedi il rischio.',
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
      ['I blocchi raggiungibili segnati liberi sono: '+show(missing)+'. Si imposta il loro bit.','I blocchi occupati privi di proprietario sono: '+show(lost)+'. Si azzera il loro bit secondo la politica indicata.','Il bilancio è '+missing.length+' bit impostati e '+lost.length+' azzerati. La bitmap finale contiene esattamente { '+live.join(', ')+' }.']);
  }
  prova(6,2,'02_fsck','Riparare la mappa dei blocchi occupati',
    'Con inode integri e un solo proprietario possibile per blocco, l’insieme dei blocchi raggiungibili è il riferimento per riparare la bitmap dell’area dati.',fsckExam([3,6,8],[3,8,11,12]),fsckExam([2,4,7,9],[4,9]));
  function orderExam(second){
    const opts=['Rendere durevoli tutti i record redo','Rendere durevole il commit','Installare le immagini nelle posizioni definitive'];
    const campi=[choice('Passo successivo',opts,opts[second?2:1],'Distingui il contenuto della transazione dalla prova che essa è stata confermata.')];
    if(second)campi.push(choice('Momento del riuso del journal',['Subito dopo il commit','Dopo l’invio delle scritture alle posizioni definitive','Dopo il checkpoint durevole che copre T'],'Dopo il checkpoint durevole che copre T','Chiediti quale copia sopravvive se il sistema si arresta subito dopo il riuso del journal.'));
    return variant(second?'Tutti i record redo e il commit di T sono durevoli. Le posizioni definitive conservano ancora le vecchie immagini. Quale operazione deve seguire e quando si potrà riusare lo spazio di journal di T?':'Un journal redo con politica di scrittura differita ha reso durevoli soltanto i record redo completi di T. Quale operazione deve precedere la prima installazione nelle posizioni definitive?',
      campi,
      ['Il protocollo rende prima durevoli le immagini nel journal, così un commit avrà sempre record completi.',second?'Anche il commit è già durevole. Il sistema può trasferire le immagini alle rispettive posizioni definitive.':'Prima della prima installazione occorre rendere durevole il commit: al riavvio il recupero saprà che T è confermata.', 'Il riuso dello spazio di T richiede che tutte le sue immagini siano durevoli nelle posizioni definitive e che il protocollo abbia registrato in sicurezza il relativo avanzamento.']);
  }
  prova(6,3,'03_write_order','Individuare la prossima scrittura consentita',
    'Nel redo a scrittura differita i record precedono il commit. I record devono restare disponibili finché tutte le relative immagini sono state installate in modo durevole e il checkpoint è registrato.',orderExam(false),orderExam(true));
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
    'Quando le transazioni modificano blocchi distinti, il recupero valuta separatamente i rispettivi commit. Ripetere l’assegnazione della stessa immagine lascia invariato il valore installato.',recoveryExam(true,false),recoveryExam(false,true));

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
    'In una ACL additiva ciascuna voce applicabile contribuisce ai diritti effettivi. Una regola individuale e una regola di gruppo possono riguardare lo stesso account.',aclExam(true,'modifica'),aclExam(false,'modifica'));
  function dirExam(list){
    return variant('Su /archivio il richiedente dispone '+(list?'solo di r (elenco)':'solo di x (attraversamento)')+'. La radice concede x e il file noto /archivio/esiti concede r. Considera un semplice elenco dei nomi senza stat e una lettura di esiti tramite nome noto.',
      [choice('Elenco dei nomi',['Riesce','Fallisce'],list?'Riesce':'Fallisce','Leggere le voci richiede r sulla directory.'),choice('Apertura del nome noto',['Riesce','Fallisce'],list?'Fallisce':'Riesce','Per risolvere esiti occorre x su archivio.')],
      ['La radice consente di raggiungere la directory archivio.',list?'Il bit r della directory permette di leggerne l’elenco dei nomi.':'Manca r sulla directory. La richiesta di elenco fallisce.',list?'Manca x su archivio e la ricerca di esiti si arresta prima della verifica del permesso di lettura del file.':'Il bit x consente di risolvere esiti. Il bit r del file permette quindi l’apertura per lettura.']);
  }
  prova(7,2,'03_directory_access','Separare elenco e ricerca per nome',
    'Elencare i nomi e cercarne uno già noto richiedono permessi diversi sulla directory. Dopo la risoluzione del nome intervengono i diritti sull’oggetto raggiunto.',dirExam(true),dirExam(false));
  function cryptoExam(key){
    return variant('Un osservatore ha una copia di un volume cifrato offline '+(key?'e la chiave corretta in chiaro.':'ed è privo di chiave, copie in chiaro e credenziali utili.')+' Assumi un cifrario sicuro, formato del volume noto e assenza di ulteriori livelli di cifratura. Quale contenuto può ricostruire dai blocchi?',
      [choice('Osservazione',['Blocchi cifrati senza decifrazione praticabile','Contenuto decifrabile'],key?'Contenuto decifrabile':'Blocchi cifrati senza decifrazione praticabile','Controlla quali elementi della trasformazione inversa sono disponibili.')],
      ['La copia bit per bit fornisce i blocchi nella rappresentazione cifrata.','Per invertire la trasformazione occorrono il formato e la chiave corretta.',key?'L’osservatore li possiede entrambi. Può ricostruire il contenuto in chiaro fuori dal sistema che gestiva i permessi.':'L’osservatore conosce il formato e dispone soltanto dei blocchi cifrati. Per ricostruire i byte in chiaro gli manca la chiave.']);
  }
  prova(7,3,'04_cryptofs','Valutare l’esposizione a volume spento',
    'La cifratura a riposo protegge i blocchi del supporto attraverso una chiave. La capacità di osservare i blocchi cifrati e quella di ricostruirne il contenuto dipendono dai mezzi dell’osservatore.',cryptoExam(false),cryptoExam(true));
  function auditExam(account,stop){
    const rows=logbook.filter(e=>e[0]<=stop&&e[1]===account&&e[2]==='tesi'),success=rows.filter(e=>e[4]==='concessa').length;
    return variant('Registro in ordine di minuto: '+logbook.map(e=>e.join(' / ')).join(' · ')+'. Fino al minuto '+stop+' incluso, conta le richieste dell’account '+account+' su tesi e quante sono state concesse. Quale attribuzione è sostenuta dalle righe?',
      [num('Richieste selezionate',rows.length,'Applica insieme tempo, account e oggetto.'),num('Richieste concesse',success,'Conta gli esiti dopo il filtro.'),choice('Attribuzione',['Account registrato','Persona fisica identificata con certezza'],'Account registrato','Il campo soggetto identifica una sessione associata a un account.')],
      ['Il filtro mantiene i minuti '+rows.map(e=>e[0]).join(', ')+': ciascuna riga riguarda '+account+' e tesi nell’intervallo richiesto.','Le righe selezionate sono '+rows.length+'. Gli esiti concessi sono '+success+' e quelli negati '+(rows.length-success)+'.','Le evidenze attribuiscono gli eventi all’account '+account+'. Per identificare la persona servirebbero riscontri ulteriori.']);
  }
  prova(7,4,'05_auditing','Delimitare una conclusione di audit',
    'L’attribuzione di un evento dipende dai campi registrati. Il filtro temporale, l’account e l’oggetto delimitano le righe pertinenti. L’esito distingue le richieste concesse da quelle respinte.',auditExam('ada',6),auditExam('leo',8));

  // Questi listati sono dati della consegna, consultabili prima della verifica.
  for (const v of SL.prove['6.4'][1].varianti) v.listato = v.codice;
  for (const v of SL.prove['6.4'][3].varianti) v.listato = v.codice;
})();
