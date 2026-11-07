'use strict';
window.SL = { catalogo: [], lezioni: Object.create(null), esercizi: [], unita: Object.create(null), prove: Object.create(null) };
(() => {
  const max64 = (1n << 64n) - 1n;
  function intero(s) {
    const text = String(s).trim();
    if (!/^(?:[0-9]+|0x[0-9a-f]+|0b[01]+)$/i.test(text) || text.length > 70)
      throw Error('Usa un intero positivo o zero, in decimale, esadecimale (0x) o binario (0b).');
    return BigInt(text);
  }
  const hex = x => '0x' + BigInt(x).toString(16).toUpperCase();
  const base = 0x100000n;
  const standard = [3n, 9n, 41n, 35n, 19n, 0n, 7n, 47n];
  function iniziale() { return {va: 0xC33n,b: 10,table:[...standard],width:1,format:'bit'}; }
  function traduci(s, va=s.va) {
    const mask = (1n << BigInt(s.b)) - 1n, vpn=va >> BigInt(s.b), off=va & mask;
    const r = {va,vpn,off,mask,index:base+8n*vpn,bound:vpn<BigInt(s.table.length)};
    if (!r.bound) return {...r,ok:false,reason:'limite',value:max64};
    r.pte=s.table[Number(vpn)];
    r.valid=s.format==='diretto' || (r.pte&1n)===1n;
    if (!r.valid) return {...r,ok:false,reason:'validità',value:max64};
    r.pfn=s.format==='diretto'?r.pte:r.pte>>1n;
    r.value=(r.pfn << BigInt(s.b)) | off;
    return {...r,ok:true};
  }
  function intervalli(s) {
    const ultimo=s.va+BigInt(s.width)-1n;
    if (ultimo>0xFFFFFFFFn) return {overflow:true,segments:[]};
    const segments=[];
    let from=s.va;
    while (from<=ultimo) {
      const r=traduci(s,from);
      const endPage=from | r.mask;
      const to=endPage<ultimo?endPage:ultimo;
      segments.push({from,to,r,last:r.ok?r.value+to-from:null});
      from=to+1n;
    }
    return {overflow:false,segments};
  }
  function scenari(nome) {
    const s=iniziale();
    if(nome==='frame0')s.table[3]=1n;
    if(nome==='invalida')s.table[3]=34n;
    if(nome==='fuori')s.table=s.table.slice(0,3);
    if(nome==='confine'){s.b=12;s.va=0x1FFCn;s.width=8;s.table[1]=19n;s.table[2]=41n;}
    if(nome==='libro'){s.b=12;s.va=0x4567n;}
    return s;
  }
  function carica(p) {
    const s=iniziale();
    try {
      if(p.has('va')) {s.va=intero(p.get('va'));if(s.va>0xFFFFFFFFn)throw Error();}
      if(p.has('b')) {s.b=Number(p.get('b'));if(![10,11,12,13,14].includes(s.b))throw Error();}
      if(p.has('w')) {s.width=Number(p.get('w'));if(![1,2,4,8].includes(s.width))throw Error();}
      if(p.has('t')) {const cells=p.get('t').split(',');if(cells.length>16||cells.length<1)throw Error();
        s.table=cells.map(intero);if(s.table.some(x=>x>32767n))throw Error();}
      if(p.get('f')==='diretto')s.format='diretto';
      return s;
    }catch{return iniziale();}
  }
  function parametri(s,step=0) {
    return new URLSearchParams({va:hex(s.va),b:s.b,t:s.table.map(String).join(','),w:s.width,f:s.format,p:step}).toString();
  }
  Object.assign(SL,{max64,intero,hex,base,iniziale,traduci,intervalli,scenari,carica,parametri});
})();
