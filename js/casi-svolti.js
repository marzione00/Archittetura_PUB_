'use strict';
(() => {
  const P=SL.pen;
  function tape(data,labels,active=[],x=27,y=99,span=586){
    const w=span/data.length;
    return data.map((v,j)=>P.rect(x+j*w,y,w-4,53,active.includes(j)?'cell hot':'cell')+
      P.text(x+(j+.5)*w-2,y+32,v,'value','middle')+P.text(x+(j+.5)*w-2,y+75,labels[j]??'','small','middle')).join('');
  }
  function bitrow(value,n,active,y=94){
    const s=String(value).padStart(n,'0');
    return tape([...s],Array.from({length:n},(_,j)=>String(n-1-j)),active,27,y);
  }
  function track(names,k,caption){
    const w=575/names.length;
    let g=P.text(27,60,caption,'label');
    names.forEach((name,i)=>{
      const x=30+i*w;g+=P.rect(x,96,w-15,67,i===k?'cell hot':i<k?'cell active':'cell')+P.text(x+(w-15)/2,135,name,'label','middle');
      if(i<names.length-1)g+=P.arrow(x+w-15,129,x+w,129,i<k);
    });
    if(k>0)g+=P.travel('M'+(30+(k-.5)*w)+' 130 H'+(30+(k+.5)*w));return g;
  }
  function bars(items,max){
    const width=385;return items.map(([label,value,display],i)=>{const y=75+i*40;return P.text(27,y+15,label,'small')+P.rect(152,y,width,21,'cell')+P.rect(152,y,width*value/max,21,'cell active',2)+P.text(548,y+16,display,'small');}).join('');
  }
  function stacks(rsp,bytes,k,caption){
    const labels=Array.from({length:8},(_,j)=>k>=2?'0x'+(rsp+j).toString(16).toUpperCase():'+'+j);
    return P.text(26,61,caption,'label')+tape(k>=3?bytes:Array(8).fill('·'),labels,k>=3?[0]:[],25,115)+
      (k>=2?P.text(25,108,'RSP ↓','small')+P.arrow(54,75,54,110,true):'');
  }
  function fixed(id,k){
    switch(id){
      case '1.1.7':return track(['P1',k>=1?'pipe 1':'·','P2',k>=3?'pipe 2':'·','P3'],[0,0,2,4][k],'Byte A · dal produttore al consumatore');
      case '1.2.5':return bitrow(k<2?'········':'10101101',8,k===2?[0,1,2,3]:k===3?[4,5,6,7]:[])+P.text(26,61,'0xAD · pesi binari da 7 a 0','label');
      case '1.3.6':return P.text(27,55,'è · testo UTF-8 e stringa C','title')+tape(k<2?['·','·','·']:['C3','A8',k<3?'·':'00'],['offset 0','offset 1','terminatore'],k===3?[2]:k===2?[0,1]:[]);
      case '1.4.5':return bitrow((k<2?'········':'11111111')+'11111000',16,k>=2?[0,1,2,3,4,5,6,7]:[8])+P.text(26,61,'Estensione del segno · 8 → 16 bit','label');
      case '1.5.7':return bitrow(k<2?'10100101':k===2?'10100000':'10100011',8,k>=2?[4,5,6,7]:[])+P.text(26,61,k<2?'Byte iniziale A5':k===2?'A5 AND F0':'A0 OR 03','label');
      case '1.6.5':return P.text(26,63,'binary32 · distinguere le classi speciali','label')+tape(['0','11111111',k<2?'?':k===2?'0':'1'],['segno · 1 bit','esponente · 8 bit','frazione · 23 bit'],k>=2?[2]:[1]);
      case '2.1.5':return P.text(28,63,'RAX · AX occupa i due byte di peso minore','label')+tape(['11','22','33','44','55','66',k<2?'77':'AB',k<2?'88':'CD'],[7,6,5,4,3,2,1,0],k>=2?[6,7]:[]);
      case '2.2.8':return track(['a = 5',k>=2?'3a = 15':'prima LEA',k>=3?'7a = 35':'seconda LEA'],Math.max(0,k-1),'LEA · la seconda istruzione usa il risultato della prima');
      case '2.3.7':return P.text(25,55,'Array di interi · una casella occupa 4 byte','label')+tape(Array.from({length:8},(_,i)=>'i='+i),Array.from({length:8},(_,i)=>i===7&&k<3?'?':'0x'+(8192+4*i).toString(16)),k>=2?[7]:[0]);
      case '2.4.6':return bitrow(k<2?'10101011':k===2?'10100000':'00001010',8,k===3?[4,5,6,7]:[0,1,2,3])+P.text(26,62,k<2?'Campo richiesto · bit 7…4':k===2?'AND con 11110000':'Scorrimento logico a destra di 4','label');
      case '2.5.7':return P.text(26,65,k<2?'Buffer offerto alla prima write':k===2?'Prefisso accettato dal kernel':'Suffisso della richiesta successiva','label')+tape(['A','B','C','D','E'],['p','p+1','p+2','p+3','p+4'],k===2?[0,1]:k===3?[2,3,4]:[]);
      case '2.6.7':return track(['R12 = 42',k>=2?'salva 42':'salvataggio',k>=2?'R12 = 7':'temporaneo',k>=3?'R12 = 42':'ritorno'],k===0?0:k===3?3:k-1,'R12 · valore del chiamante e copia salvata');
      case '2.7.8':return stacks(0xff8,['55',...Array(7).fill('00')],k,'PUSH RAX · indirizzi crescenti da sinistra');
      case '3.1.7':{
        const stages=SL.unita['3.1.3'].calcola({a:9,b:11,c:0});
        return SL.sceneLab['3.1.3']({a:9,b:11,c:0},stages,[0,0,2,4,5][k]);
      }
      case '3.2.6':return P.text(27,63,'Latch D · Q iniziale = 0','label')+tape([0,1,1,0].map((q,i)=>k>i?'Q='+q:'·'),['EN,D = 01','EN,D = 11','EN,D = 00','EN,D = 10'],k?[k-1]:[]);
      case '3.3.7':return bitrow('01100011',8,k===2?[0,1,2,3]:k===3?[4,5,6,7]:[])+P.text(28,57,'Byte 0x63 · icode nei bit 7…4, ifun nei bit 3…0','label');
      case '3.4.6':return stacks(0xff8,['AA',...Array(7).fill('00')],k,'pushq · %rsp seleziona la nuova cima della pila');
      case '3.5.5':{
        let g=P.text(26,60,'Pipeline ideale · I1, I2 e I20','label');
        [0,1,19].forEach((start,i)=>{const y=81+i*40;g+=P.text(28,y+17,'I'+(start+1),'small');
          for(let c=0;c<24;c++){const st=c-start,visible=st>=0&&st<5&&(i===0?k>=1:i===1?k>=2:k>=3),x=81+c*22;
            g+=P.rect(x,y,20,27,visible?'cell active':'cell off',1)+(visible?P.text(x+10,y+19,'FDEMW'[st],'small','middle'):'');}
        });return g+P.text(80,222,'ciclo 1','small')+P.text(603,222,k>=3?'ciclo 24':'','small','end');
      }
      case '3.6.8':return P.text(26,64,k<3?'Stato prima del fronte':'Stato dopo il fronte','label')+tape(k<3?['I2','I1','bolla']:['·','I2','I1'],['registro D','registro E','registro M'],k>=2?[1,2]:[]);
      case '4.1.8':return P.box(28,96,146,56,'Ingresso','IF = 1','cell')+P.arrow(177,122,340,77,k===2)+P.arrow(177,122,340,167,k===3)+P.box(346,43,226,61,'Interrupt gate',k>=2?'IF = 0':'?',k===2?'cell hot':'cell')+P.box(346,140,226,61,'Trap gate',k>=3?'IF = 1':'?',k===3?'cell hot':'cell')+(k>=2?P.travel(k===2?'M177 122 L340 77':'M177 122 L340 167'):'');
      case '4.2.6':return track(['fd chiuso',k>=2?'RAX = −9':'ritorno grezzo',k>=3?'−1 / EBADF':'wrapper libc'],Math.max(0,k-1),'Il codice d’errore cambia rappresentazione al confine della libreria');
      case '4.3.5':return bars([['T = 10 µs',10,'1°'],['T = 1990 µs',k>=2?1990:0,k>=2?'199°':'·'],['T = 2000 µs',k>=3?2000:0,k>=3?'200°':'·']],2000);
      case '4.4.6':return bars([['Banda lorda',k>=2?1000:0,k>=2?'1000 MB/s':'·'],['Payload',k>=3?800:0,k>=3?'800 MB/s':'·']],1000);
      case '4.5.4':return bars([['Blocco 1',k>=2?4096:0,k>=2?'4096 B':'·'],['Blocco 2',k>=2?4096:0,k>=2?'4096 B':'·'],['Blocco 3',k>=2?1808:0,k>=2?'1808 B':'·']],4096);
      case '4.6.5':return P.text(27,66,'Ciclo medio · tempo operativo e riparazione','label')+bars([['Operativo',1000,'1000 h'],['Riparazione',k>=2?2:0,k>=2?'2 h':'·']],1002)+(k===3?P.text(27,205,'Disponibilità = 1000 / 1002 × 100 ≈ 99,80%','value'):'');
      case '4.7.6':return track(['CPU: prepara',k>=2?'DMA: 20 ms':'DMA: 8 MiB','CPU: completa'],Math.max(0,k-1),'Tempo del dispositivo e cicli della CPU');
      case '5.1.5':return track(['Core A: 0x40',k>=2?'Salva A / carica B':'cambio',k>=3?'A: PC 0x40':'ritorno ad A'],Math.max(0,k-1),'Cambio di contesto · le schede dei processi conservano PC distinti');
      case '5.2.6':return P.text(26,60,'Un unico cursore condiviso dai due descrittori','label')+tape(['A','B','C','D','E','F'],['0','1','2','3','4','5'],[k<2?0:k===2?2:5]);
      case '5.3.6':return P.text(26,60,'Core singolo · ogni cella dura 1 ms','label')+tape(Array.from({length:6},(_,j)=>j<4?(k>=2?'A':'·'):(k>=3?'B':'·')),['0–1','1–2','2–3','3–4','4–5','5–6'],k===2?[0,1,2,3]:k>=3?[4,5]:[]);
      case '5.4.6':return P.text(26,60,'Array ids · oggetti distinti fino ai join','label')+tape(['10','20','30'],k>=2?['W0 → ids[0]','W1 → ids[1]','W2 → ids[2]']:['ids[0]','ids[1]','ids[2]'],k>=2?[1]:[]);
      case '5.5.8':return track(['x = 1',k>=2?'W1 scrive 3':'turno W1',k>=3?'W2 scrive 7':'turno W2'],Math.max(0,k-1),'Mutex · ogni turno comprende lettura, calcolo e scrittura');
      case '5.6.6':return P.text(26,61,'Tre slot · prenotazione prima della pubblicazione','label')+tape([k>=3?'dato':k===2?'riservato':'libero','libero','libero'],['slot 0','slot 1','slot 2'],k>=2?[0]:[]);
      case '5.7.6':return P.text(26,61,'Tre istanze della stessa risorsa · proprietari delle istanze','label')+tape([k>=2?'libera':'A',k>=3?'libera':'B','libera'],['istanza 0','istanza 1','istanza 2'],k===2?[0,2]:k>=3?[0,1,2]:[2]);
      default:throw Error('Caso svolto sconosciuto: '+id);
    }
  }
  SL.disegnaCaso=fixed;
})();
