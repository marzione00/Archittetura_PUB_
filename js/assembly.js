'use strict';
// Interprete didattico deterministico del sottoinsieme Intel usato nel cap. 6.3.
// Il programma può leggere soltanto le celle assegnate al modello.
(() => {
  const {max64,intero}=SL;
  const aliases={rax:'rax',rcx:'rcx',rdi:'rdi',rsi:'rsi',eax:'rax',ecx:'rcx',edi:'rdi',esi:'rsi'};
  const allowed=new Set(['mov','lea','and','or','xor','add','sub','shl','shr','cmp','test','jmp','je','jz','jne','jnz','jb','jae','nop','ret']);
  const word=/^-?(?:0x[0-9a-f]+|0b[01]+|[0-9]+)$/i;
  const memory=/^(?:qword\s+ptr\s+)?\[\s*(?:rax|rcx|rdi|rsi)(?:\s*\+\s*(?:rax|rcx|rdi|rsi)(?:\s*\*\s*[1248])?)?(?:\s*[+-]\s*(?:0x[0-9a-f]+|[0-9]+))?\s*\]$/;
  function literal(s){return s.startsWith('-')?-intero(s.slice(1)):intero(s);}
  function verificaForma(op,args,line) {
    if(op==='nop'||op==='ret'||op.startsWith('j'))return;
    const [a,b]=args, known=s=>Object.hasOwn(aliases,s);
    const stop=msg=>{throw Error('Riga '+line+' · '+msg);};
    if(!known(a))stop('La destinazione richiede uno dei registri del modello.');
    if(op==='lea'||b.includes('[')){
      if(!memory.test(b))stop('Usa [base + indice*scala + spostamento] con registri a 64 bit.');
      const tail=b.replace(/\s/g,'').match(/([+-])((?:0x[0-9a-f]+|\d+))\]$/);
      if(tail){const disp=literal((tail[1]==='-'?'-':'')+tail[2]);if(disp < -2147483648n || disp>2147483647n)stop('Lo spostamento deve entrare in 32 bit con segno.');}
      if(op!=='lea'&&(op!=='mov'||a[0]!=='r'))stop('La lettura della tabella usa MOV con destinazione a 64 bit.');
      return;
    }
    if(op==='shl'||op==='shr'){
      if(!word.test(b)||literal(b)<0n||literal(b)>255n)stop('Il conteggio dello shift richiede un immediato da 0 a 255.');
      return;
    }
    if(known(b)){if((a[0]==='e')!==(b[0]==='e'))stop('Gli operandi richiedono la stessa larghezza.');return;}
    if(!word.test(b))stop('Usa un registro disponibile o un immediato intero.');
    const n=literal(b),wide=a[0]==='r'&&op==='mov';
    const low=wide?-(1n<<63n):-(1n<<31n);
    const high=wide?max64:a[0]==='r'?(1n<<31n)-1n:(1n<<32n)-1n;
    // Anche la notazione esadecimale a 64 bit può denotare un imm32 esteso con segno.
    if(!wide && a[0]==='r' && n>high && n<=max64 && BigInt.asIntN(64,n)>=low && BigInt.asIntN(64,n)<0n)return;
    if(n<low||n>high)stop('Immediato fuori dall’intervallo accettato per questa istruzione.');
  }
  function programma(src) {
    if(src.length>8000)throw Error('Limite del programma: 8000 caratteri.');
    const lines=[],labels=new Map();
    src.split(/\r?\n/).forEach((raw,i)=>{
      let row=raw.split(';')[0].trim().toLowerCase();
      const label=row.match(/^([.a-z_][.\w]*):/);
      if(label){if(labels.has(label[1]))throw Error('Etichetta duplicata alla riga '+(i+1));
        labels.set(label[1],lines.length);row=row.slice(label[0].length).trim();}
      if(!row)return;
      const m=row.match(/^(\w+)(?:\s+(.+))?$/);
      if(!m||!allowed.has(m[1]))throw Error('Istruzione sconosciuta alla riga '+(i+1)+'.');
      const args=m[2]?m[2].split(',').map(x=>x.trim()):[];
      const need=['ret','nop'].includes(m[1])?0:m[1].startsWith('j')?1:2;
      if(args.length!==need||args.some(x=>!x))throw Error('Controlla gli operandi alla riga '+(i+1)+'.');
      verificaForma(m[1],args,i+1);
      lines.push({op:m[1],args,line:i+1});
    });
    if(!lines.length||lines.length>128)throw Error('Inserisci da 1 a 128 istruzioni.');
    for(const x of lines)if(x.op.startsWith('j')&&!labels.has(x.args[0]))throw Error('Etichetta assente: '+x.args[0]);
    return {lines,labels};
  }
  function esegui(src,inputs,keepTrace=false) {
    const {lines,labels}=typeof src==='string'?programma(src):src;
    const regs={rax:inputs.rax??0xABCDEF56n,rcx:inputs.rcx??0x938476n,rdi:inputs.rdi,rsi:inputs.rsi};
    const trace=[];let ip=0,ticks=0,zf=Boolean(inputs.zf),cf=Boolean(inputs.cf);
    function reg(s){if(!Object.hasOwn(aliases,s))throw Error('Registro fuori modello: '+s);return s;}
    function get(s){reg(s);return s[0]==='e'?BigInt.asUintN(32,regs[aliases[s]]):regs[aliases[s]];}
    function set(s,v){reg(s);regs[aliases[s]]=BigInt.asUintN(s[0]==='e'?32:64,v);}
    function imm(s){return s.startsWith('-')?-intero(s.slice(1)):intero(s);}
    function addr(s){
      const m=s.replace(/^qword\s+ptr\s+/,'').match(/^\[([^\]]+)\]$/);if(!m)throw Error('Indirizzo atteso fra parentesi quadre.');
      const tok=m[1].replace(/\s/g,'').replace(/-/g,'+-').split('+').filter(Boolean);
      let val=0n;
      for(const t of tok){const f=t.split('*');if(f.length>2)throw Error('Espressione di indirizzo errata.');
        const a=Object.hasOwn(aliases,f[0])?get(f[0]):imm(f[0]);
        if(f.length===2&&(!Object.hasOwn(aliases,f[0])||!['1','2','4','8'].includes(f[1])))throw Error('Scala ammessa: 1, 2, 4 oppure 8.');
        val+=a*(f[1]?BigInt(f[1]):1n);}
      return BigInt.asUintN(64,val);
    }
    function val(s){
      if(s.includes('[')){const a=addr(s);if(!inputs.mem?.has(a))throw Error('Lettura fuori tabella a '+SL.hex(a)+'.');return inputs.mem.get(a);}
      return Object.hasOwn(aliases,s)?get(s):imm(s);
    }
    while(ip<lines.length){
      if(++ticks>256)throw Error('Raggiunto il limite di 256 passi: controlla i salti.');
      const {op,args:[a,b],line}=lines[ip++];const before={...regs};let accessed=null;
      try{
        if(op==='ret'){ip=lines.length;}
        else if(op.startsWith('j')){const jump=op==='jmp'||(['jz','je'].includes(op)&&zf)||(['jnz','jne'].includes(op)&&!zf)||(op==='jb'&&cf)||(op==='jae'&&!cf);if(jump)ip=labels.get(a);}
        else if(op==='lea'){set(a,addr(b));}
        else if(op!=='nop'){
          if(b.includes('['))accessed=addr(b);
          const x=get(a),w=a[0]==='e'?32:64,mask=(1n<<BigInt(w))-1n,y=BigInt.asUintN(w,val(b));
          if(Object.hasOwn(aliases,b)&&(a[0]==='e')!==(b[0]==='e'))throw Error('Gli operandi richiedono la stessa larghezza.');
          let v;
          switch(op){
            case 'mov':set(a,y);break;
            case 'test':zf=(x&y)===0n;cf=false;break;
            case 'cmp':zf=x===y;cf=x<y;break;
            case 'and':v=x&y;cf=false;break;case 'or':v=x|y;cf=false;break;case 'xor':v=x^y;cf=false;break;
            case 'add':v=x+y;cf=v>mask;break;case 'sub':v=x-y;cf=x<y;break;
            case 'shl':case 'shr':{
              const k=y&BigInt(w-1);if(k===0n){set(a,x);}else{const bit=op==='shl'?BigInt(w)-k:k-1n;cf=((x>>bit)&1n)===1n;v=op==='shl'?x<<k:x>>k;}break;}
          }
          if(v!==undefined){set(a,v);zf=get(a)===0n;}
        }
      }catch(e){throw Error('Riga '+line+' · '+e.message);}
      if(keepTrace)trace.push({line,regs:{...regs},before,zf,cf,accessed});
    }
    return {regs,trace,ticks};
  }
  function frammento(fam,b){
    if(fam==='componi')return ['mov rax, rsi','shl rax, '+b,'mov rcx, rdi','and ecx, '+((2**b)-1),'or rax, rcx'].join('\n');
    if(fam==='cerca')return ['mov rax, rdi','shr rax, '+b,'mov rax, [rsi + rax*8]'].join('\n');
    return ['mov rax, rdi','shr rax, '+b,'mov rax, [rsi + rax*8]','test rax, 1','jz .errore','shr rax, 1','shl rax, '+b,'mov rcx, rdi','and ecx, '+((2**b)-1),'or rax, rcx','jmp .fine','.errore:','mov rax, -1','.fine:'].join('\n');
  }
  // Simula l’array leggibile senza allocare milioni di celle per le VPN alte.
  function tabellaDiProva(base, vpn, voce, codificata) {
    const lunghezza=vpn<7n?8n:vpn+1n;
    return {
      has(addr) {
        const offset=addr-base;
        return offset>=0n && offset%8n===0n && offset/8n<lunghezza;
      },
      get(addr) {
        const i=(addr-base)/8n;
        if(i===vpn)return voce;
        const frame=(i*101n+73n)%16384n;
        return codificata?2n*frame+1n:frame;
      }
    };
  }
  function* casiDiProva(fam,b,sample){
    const stride=1n<<BigInt(b), ultimoVPN=0xFFFFFFFFn/stride;
    const basi=[0x200000n,0x300000n,0x200004028n];
    if(sample){
      const va=BigInt(sample.va),frame=BigInt(sample.pfn),base=BigInt(sample.base??0x200000n);
      yield {va,frame,valid:1n,base};
      if(fam==='walker'){
        yield {va,frame:BigInt(sample.invalidPte)>>1n,valid:0n,base};
        yield {va,frame:0n,valid:1n,base};
      }
    }
    let i=0;
    for(const vpn of [0n,1n,3n,7n,12n,ultimoVPN])
      for(const off of [0n,1n,51n,stride/2n,stride-1n])
        for(const frame of [0n,6n,17n,16383n])
          for(const valid of fam==='walker'?[0n,1n]:[1n]){
            yield {va:vpn*stride+off,frame,valid,base:basi[i++%basi.length]};
          }
    // Nel lookup diretto l’intera voce di otto byte è il dato richiesto.
    if(fam==='cerca')yield {va:stride*5n+2n,frame:0x123456789n,valid:1n,base:basi[2]};
  }
  function ingressoCaso(fam,stride,{va,frame,valid,base},indice){
    const value=fam==='walker'?2n*frame+valid:frame;
    const mem=fam==='componi'?new Map():tabellaDiProva(base,va/stride,value,fam==='walker');
    return {rdi:va,rsi:fam==='componi'?frame:base,mem,
      rax:BigInt.asUintN(64,0x9E3779B97F4A7C15n*BigInt(indice+1)),
      rcx:BigInt.asUintN(64,0xD1B54A32D192ED03n*BigInt(indice+2)),
      zf:indice%2===0,cf:indice%4<2};
  }
  function ingressoEsercizio(fam,sample){
    const primo=casiDiProva(fam,sample.bits,sample).next().value;
    return ingressoCaso(fam,1n<<BigInt(sample.bits),primo,0);
  }
  function provaCodice(src,fam,b,sample=null){
    const program=programma(src),stride=1n<<BigInt(b);
    let passed=0;
    for(const caso of casiDiProva(fam,b,sample)){
      const {va,frame,valid,base}=caso,off=va%stride;
      const input=ingressoCaso(fam,stride,caso,passed);
      const expect=fam==='cerca'?frame:fam==='walker'&&valid===0n?max64:frame*stride+off;
      const data={passed,va,frame,valid,expect,base};
      let result;
      try{result=esegui(program,input);}
      catch(e){return {...data,ok:false,why:e.message};}
      if(result.regs.rax!==expect||result.regs.rdi!==input.rdi||result.regs.rsi!==input.rsi)
        return {...data,ok:false,why:result.regs.rax!==expect?'Il valore in RAX diverge dal risultato atteso.':'Alla fine RDI e RSI devono conservare gli ingressi.',actual:result.regs.rax};
      passed++;
    }
    return {ok:true,passed};
  }
  Object.assign(SL,{programma,esegui,frammento,provaCodice,ingressoEsercizio});
})();
