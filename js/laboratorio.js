'use strict';
(() => {
  const {$,esc:E,hex:H,base,traduci,intero}=SL;
  const reg=(k,v)=>'<div class="register"><span>'+k+'</span><b>'+E(v)+'</b></div>';
  const note=(t,bad=false)=>'<div class="status'+(bad?' warn':'')+'" aria-live="polite"><p>'+t+'</p></div>';
  function table(s,selected=-1){
    return '<div class="tablewrap"><table><caption class="label">Tabella nel processo · voci da 8 byte</caption><thead><tr><th>Indice</th><th>Indirizzo voce</th><th>Valore</th></tr></thead><tbody>'+
    s.table.map((p,i)=>'<tr'+(BigInt(i)===BigInt(selected)?' class="current"':'')+'><td>'+i+'</td><td>'+H(base+BigInt(i)*8n)+'</td><td>'+String(p)+'</td></tr>').join('')+'</tbody></table></div>';
  }
  const P=SL.pen;
  function campiVA(s,highlight){
    const str=s.va.toString(2).padStart(32,'0'),split=32-s.b,dx=18.5;
    let g=P.text(23,24,'Indirizzo virtuale a 32 bit · '+H(s.va),'title');
    for(let n=0;n<str.length;n++){
      const x=23+n*dx;
      g+=P.rect(x,39,17,33,highlight?(n<split?'cell active':'cell hot'):'cell',2)+P.text(x+8.5,61,str[n],'label','middle');
    }
    return g+P.text(23,94,'VPN · '+split+' bit','small')+P.text(612,94,'Offset · '+s.b+' bit','small','end');
  }
  function disegnaPTE(s,r,k,unit){
    const stride=1n<<BigInt(s.b),va=campiVA(s,k>=1);
    if(unit===2){
      const word=r.bound?r.pte:0n,n=Math.max(8,word.toString(2).length),bits=word.toString(2).padStart(n,'0');let g=va;
      if(k<3||!r.bound)return g+P.text(25,161,r.bound?'Attendi il caricamento della voce.':'La VPN supera i limiti della tabella.','label')+P.text(25,200,'Formato: '+(s.format==='bit'?'PFN e bit valido':'PFN diretto'),'small');
      const cell=Math.min(36,525/n);
      for(let j=0;j<n;j++){const x=26+j*cell;g+=P.rect(x,123,cell-2,40,k>=4&&j===n-1&&s.format==='bit'?'cell hot':'cell active')+P.text(x+(cell-2)/2,150,bits[j],'value','middle');}
      g+=P.text(25,187,k>=4?(s.format==='bit'?'Il bit zero vale '+(word&1n)+'. Gli altri bit codificano il frame.':'Tutti i bit rappresentano il frame.'):'Voce grezza: '+word,'label');
      if(k>=4)g+=P.text(25,220,r.ok?'PFN = '+r.pfn+(k>=5?' · PA = '+H(r.value):''):'Voce invalida · RAX = '+H(r.value),'value');
      return g+(k===3?P.travel('M31 92 V120'):'');
    }
    let g=va;
    const from=r.bound?Math.max(0,Math.min(Number(r.vpn)-1,s.table.length-4)):0;
    const rows=s.table.slice(from,from+4);
    rows.forEach((val,n)=>{const j=from+n,x=25+n*145,on=k>=2&&BigInt(j)===r.vpn;
      g+=P.box(x,131,130,55,'voce '+j,on&&k>=3?String(val):'·',on?'cell active':'cell');});
    if(k>=2&&r.bound)g+=P.arrow(80,99,88+(Number(r.vpn)-from)*145,128,true);
    if(k===3&&r.bound)g+=P.travel('M80 99 L'+(88+(Number(r.vpn)-from)*145)+' 128');
    if(k>=2&&!r.bound)g+=P.text(25,217,'Indice fuori tabella · lettura interrotta','label');
    else if(k>=4)g+=P.text(25,217,r.ok?(k>=5?'PA = '+H(r.pfn*stride)+' + '+H(r.off)+' = '+H(r.value):'La voce seleziona il frame '+r.pfn):'Bit valido = 0 · traduzione interrotta','label');
    else g+=P.text(25,217,k===0?'La tabella contiene '+s.table.length+' voci.':k===1?'VPN = '+r.vpn+' · offset = '+H(r.off):'Indirizzo della voce: '+H(r.index),'label');
    return g;
  }
  function disegnaIstruzione(s,snap,regs,code){
    const ins=snap?code.split('\n')[snap.line-1].trim():'Ingresso nel frammento';
    let g=P.text(25,30,ins,'title');
    ['rdi','rsi','rax','rcx'].forEach((reg,i)=>{
      const x=26+(i%2)*305,y=i<2?60:152,change=snap&&snap.before[reg]!==regs[reg];
      g+=P.box(x,y,272,67,reg.toUpperCase(),H(regs[reg]),change?'cell hot':'cell');
    });
    if(snap?.accessed!=null)g+=P.text(324,144,'Memoria ['+H(snap.accessed)+'] → RAX','small','middle')+P.travel('M453 128 C455 146 160 130 158 151');
    else if(snap){const match=ins.match(/^mov (rax|rcx), (rsi|rdi)$/i);if(match){const x0=match[2]==='rsi'?467:162,x1=match[1]==='rcx'?467:162;g+=P.arrow(x0,128,x1,151,true)+P.travel('M'+x0+' 128 L'+x1+' 151');}}
    return g;
  }
  function disegnaIntervalli(s,access,k){
    const end=s.va+BigInt(s.width)-1n;
    let g=P.text(25,28,'Lettura di '+s.width+' byte a partire da '+H(s.va),'title');
    if(access.overflow)return g+P.box(25,100,280,70,'Ultimo indirizzo richiesto',H(end),'cell danger')+P.box(328,100,280,70,'Limite a 32 bit','0xFFFFFFFF','cell')+P.text(25,212,'La richiesta si arresta prima della lettura.','label');
    const step=550/s.width,failed=access.segments.findIndex(seg=>!seg.r.ok);
    for(let j=0;j<s.width;j++){
      const address=s.va+BigInt(j),idx=access.segments.findIndex(seg=>address>=seg.from&&address<=seg.to),seg=access.segments[idx];
      const read=k>idx&&(failed<0||idx<=failed),x=35+j*step;
      g+=P.box(x,58,step-3,54,'VA + '+j,H(address),'cell')+P.box(x,160,step-3,54,'PA',read?(seg.r.ok?H(seg.r.value+address-seg.from):'fault'):'·',read?(seg.r.ok?'cell active':'cell danger'):'cell');
      if(read){const cx=x+step/2;g+=P.arrow(cx,115,cx,156,true);if(k===idx+1)g+=P.travel('M'+cx+' 115 V156');}
    }
    return g+P.text(25,240,access.segments.length+' '+(access.segments.length===1?'pagina virtuale':'pagine virtuali')+' · da '+H(s.va)+' a '+H(end),'small');
  }

  function phases(s){
    const r=traduci(s);const st=[
      ['Ingresso','L’indirizzo virtuale è <code>'+H(r.va)+'</code>. Una pagina contiene '+2**s.b+' byte.'],
      ['Campi','Il quoziente intero di '+r.va+' / '+2**s.b+' è '+r.vpn+'. Il resto vale '+r.off+' ('+H(r.off)+').'],
      ['Limite',r.bound?'L’indice '+r.vpn+' appartiene all’intervallo da 0 a '+(s.table.length-1)+'.':'L’indice '+r.vpn+' supera l’ultima voce, '+(s.table.length-1)+'. Il controllo ferma la routine prima del caricamento.']
    ];
    if(!r.bound)return st;
    st.push(['Lettura','La voce si trova a '+H(base)+' + 8 × '+r.vpn+' = <code>'+H(r.index)+'</code>. La lettura restituisce '+r.pte+'.']);
    st.push(['Decodifica',s.format==='diretto'?'Il formato scelto memorizza direttamente il PFN '+r.pfn+'.':r.valid?'Il bit zero vale 1. Spostando '+r.pte+' a destra di un bit si ottiene il PFN '+r.pfn+'.':'Il bit zero vale 0. La routine restituisce la sentinella a 64 bit <code>0xFFFFFFFFFFFFFFFF</code>.']);
    if(r.ok)st.push(['Risultato','Base del frame = '+r.pfn+' × '+2**s.b+' = '+H(r.pfn<<BigInt(s.b))+'. Aggiungendo '+r.off+' si ottiene <code>'+H(r.value)+'</code>.']);
    return st;
  }
  function presets(unit){
    const p=unit===4?[['confine','Lettura su due pagine'],['fuori','Indice fuori tabella'],['invalida','Voce invalida'],['frame0','Frame zero']]:
    [['frame0','Frame zero'],['invalida','Voce invalida'],['libro','Pagina da 4 KiB']];
    return p.map(([k,v])=>'<button type="button" class="chip" data-case="'+k+'">'+v+'</button>').join('');
  }
  function controls(s,unit){
    const r=traduci(s);
    return '<section class="panel"><h2 id="inizio-attivita" tabindex="-1">Parametri</h2><form id="setparams"><div class="fields">'+
    '<label>Indirizzo virtuale<input id="addr" value="'+H(s.va)+'" autocomplete="off" spellcheck="false"></label>'+
    '<label>Pagina<select id="pagebits">'+[10,11,12,13,14].map(b=>'<option value="'+b+'"'+(s.b===b?' selected':'')+'>'+2**(b-10)+' KiB · '+b+' bit</option>').join('')+'</select></label>'+
    '<label>Numero di voci<input id="length" type="number" min="1" max="16" value="'+s.table.length+'"></label>'+
    (unit===4?'<label>Byte da leggere<select id="width">'+[1,2,4,8].map(v=>'<option'+(v===s.width?' selected':'')+'>'+v+'</option>').join('')+'</select></label>':'')+
    (unit===2?'<label>Formato<select id="format"><option value="bit">PFN e bit valido</option><option value="diretto"'+(s.format==='diretto'?' selected':'')+'>PFN diretto</option></select></label>':'')+
    '<button class="btn" type="submit">Applica</button></div><div class="error-msg" id="paramerr" role="alert"></div></form>'+
    '<div class="presets">'+presets(unit)+'</div><details class="unitentry spaced"><summary>Modifica una voce della tabella</summary><form id="setcell"><div class="fields spaced"><label>Indice<select id="cellidx">'+s.table.map((_,i)=>'<option value="'+i+'"'+(BigInt(i)===r.vpn?' selected':'')+'>'+i+'</option>').join('')+'</select></label><label>Valore grezzo<input id="cellvalue" value="'+String(s.table[r.bound?Number(r.vpn):0])+'"></label><button class="btn" type="submit">Scrivi nella tabella</button></div><div class="error-msg" id="cellerr" role="alert"></div></form></details></section>';
  }
  function splitBody(s,step,unit){
    const r=traduci(s),ph=phases(s),i=Math.min(step,ph.length-1);
    const future='—';
    return {max:ph.length-1,graphic:disegnaPTE(s,r,i,unit),stepTitle:ph[i][0],content:'<h2>'+E(ph[i][0])+'</h2>'+
      '<div class="twocol"><div class="box">'+table(s,i>=2&&r.bound?r.vpn:-1)+'</div><div class="box"><h3>Stato della traduzione</h3>'+
      reg('VPN',i>=1?String(r.vpn):future)+reg('Offset',i>=1?H(r.off):future)+reg('Voce letta',i>=3?String(r.pte):future)+reg('PFN',i>=4&&r.ok?String(r.pfn):future)+reg('RAX',i===ph.length-1?H(r.value):future)+'</div></div>'+
      '<div class="rail">'+ph.map(([name],j)=>'<span class="'+(j===i?'now':j<i?'done':'')+'">'+E(name)+'</span>').join('')+'</div>'+note(ph[i][1],!r.ok&&i===ph.length-1)};
  }
  function asmBody(s,step){
    const r=traduci(s),code=SL.frammento('walker',s.b);
    if(!r.bound)return {max:0,graphic:campiVA(s,true)+P.text(25,179,'VPN fuori tabella · arresto del chiamante','title'),stepTitle:'Controllo del chiamante',content:'<h2>Controllo del chiamante</h2>'+note('VPN '+r.vpn+' richiede una voce oltre la tabella di '+s.table.length+' elementi. Il chiamante arresta la prova prima di eseguire il frammento.',true)};
    const mem=new Map(s.table.map((v,i)=>[base+8n*BigInt(i),v]));
    const input={rdi:s.va,rsi:base,mem,rax:0n,rcx:0n},run=SL.esegui(code,input,true);
    const i=Math.min(step,run.trace.length),snap=i?run.trace[i-1]:null,regs=snap?snap.regs:input;
    let phrase='Prima della prima istruzione, RDI vale '+H(s.va)+' e RSI vale '+H(base)+'. I registri temporanei RAX e RCX partono da zero.';
    if(snap){
      const changes=Object.keys(snap.regs).filter(k=>snap.regs[k]!==snap.before[k]);
      phrase='Riga '+snap.line+' · <code>'+E(code.split('\n')[snap.line-1])+'</code>. ';
      if(snap.accessed!==null)phrase+='La lettura a '+H(snap.accessed)+' restituisce '+snap.regs.rax+'. ';
      phrase+=changes.length?changes.map(k=>k.toUpperCase()+' passa da '+H(snap.before[k])+' a '+H(regs[k])).join('. ')+'.':'I valori dei registri restano stabili. ';
      if(code.split('\n')[snap.line-1].startsWith('test'))phrase+=' Il flag ZF vale '+Number(snap.zf)+'.';
      if(i===run.trace.length)phrase+=r.ok?' L’indirizzo fisico simulato è '+H(r.value)+'.':' La voce invalida conduce alla sentinella a 64 bit.';
    }
    return {max:run.trace.length,graphic:disegnaIstruzione(s,snap,regs,code),stepTitle:snap?'Istruzione '+snap.line:'Stato iniziale',content:'<h2>Traccia delle istruzioni</h2><div class="twocol"><div>'+SL.codeView(code,snap?.line||0)+'</div><div class="box"><h3>Registri dopo il passo</h3>'+
      ['rdi','rsi','rax','rcx'].map(k=>reg(k.toUpperCase(),H(regs[k]))).join('')+reg('ZF',snap?String(Number(snap.zf)):'0')+'<p class="quiet-note">Il frammento riceve un indice leggibile. Il modello usa voci da otto byte e riserva il bit zero alla validità.</p></div></div>'+note(phrase)};
  }
  function boundsBody(s,step){
    const access=SL.intervalli(s);
    if(access.overflow)return {max:0,graphic:disegnaIntervalli(s,access,0),stepTitle:'Limite dello spazio virtuale',content:'<h2>Limite dello spazio virtuale</h2>'+note('L’ultimo byte supera 0xFFFFFFFF. Il controllo sull’ampiezza di 32 bit arresta la lettura.',true)};
    const parts=access.segments,firstBad=parts.findIndex(g=>!g.r.ok);
    const max=firstBad===-1?parts.length+1:firstBad+1;
    const i=Math.min(step,max);
    let phrase='Una lettura di '+s.width+' byte occupa l’intervallo da '+H(s.va)+' a '+H(s.va+BigInt(s.width)-1n)+'.';
    if(i>0&&i<=parts.length){
      const {r,from,to,last}=parts[i-1];
      phrase=r.ok?'Pagina '+r.vpn+': i byte da '+H(from)+' a '+H(to)+' corrispondono all’intervallo fisico '+H(r.value)+'–'+H(last)+'.':
        r.bound?'La PTE '+r.pte+' ha il bit di validità a zero. La routine restituisce '+H(SL.max64)+'.':
        'L’indice '+r.vpn+' richiede otto byte a partire da '+H(r.index)+'. Il controllo sul numero di voci blocca il caricamento.';
    }else if(i===max&&firstBad===-1){
      const contiguous=parts.every((v,j)=>j===0||parts[j-1].last+1n===v.r.value);
      phrase=parts.length===1?'Tutti i byte appartengono alla stessa pagina e allo stesso frame.':contiguous?'I frame scelti sono adiacenti: gli intervalli fisici si toccano.':'La lettura è contigua nello spazio virtuale e viene servita da due intervalli fisici separati.';
    }
    return {max,graphic:disegnaIntervalli(s,access,i),stepTitle:'Controllo degli intervalli',content:'<h2>Intervalli di lettura</h2><p class="sub">Il modello verifica indice e validità di ogni pagina. I frame validi sono leggibili.</p><div class="tablewrap"><table><thead><tr><th>Byte virtuali</th><th>VPN</th><th>Esito</th><th>Byte fisici</th></tr></thead><tbody>'+
      parts.map((g,j)=>'<tr class="'+(i===j+1?'current':'')+'"><td>'+H(g.from)+'–'+H(g.to)+'</td><td>'+g.r.vpn+'</td><td>'+(firstBad!==-1&&i===max&&j>firstBad?'Saltata dopo l’errore':i<=j?'Da verificare':g.r.ok?'Valida':g.r.reason==='limite'?'Fuori tabella':'Invalida')+'</td><td>'+(i>j&&g.r.ok?H(g.r.value)+'–'+H(g.last):'—')+'</td></tr>').join('')+'</tbody></table></div>'+note(phrase,i===max&&firstBad!==-1)};
  }
  function laboratorio(unit,p){
    if(unit<1||unit>4)return '';
    const defaultState=unit===4?SL.scenari('confine'):SL.iniziale();
    const initialParams=new URLSearchParams(SL.parametri(defaultState));
    for(const [key,value] of p)initialParams.set(key,value);
    let s=SL.carica(initialParams);
    if(unit!==2)s.format='bit';
    let step=Math.max(0,Math.min(40,parseInt(p.get('p')||'0',10)||0)),max=0;
    let player,guess;
    function redraw(forward=false,clearGuess=false){
      const state=unit===3?asmBody(s,step):unit===4?boundsBody(s,step):splitBody(s,step,unit);
      max=state.max;step=Math.min(step,max);
      $('special-graphic').innerHTML=SL.disegno(state.graphic,state.stepTitle);
      SL.anima($('special-graphic'),forward);
      const r=traduci(s);
      const access=unit===4?SL.intervalli(s):null;
      const target=unit===4?(access.overflow?['Esito dell’intervallo a 32 bit','oltre il limite']:['Numero di pagine virtuali coperte dalla richiesta',access.segments.length]):
        unit===2?['Frame decodificato (numero, «voce invalida» o «fuori tabella»)',r.ok?String(r.pfn):r.bound?'voce invalida':'fuori tabella']:
        unit===1?['Risultato della traduzione (indirizzo fisico o sentinella)',H(r.value)]:
        [r.bound?'Valore finale in RAX':'Esito del controllo del chiamante',r.bound?H(r.value):'arresto'];
      guess.set(target,step===max,clearGuess);player.sync();
      $('simout').innerHTML=state.content+'<div class="stepper"><span class="count">Passo '+(step+1)+' di '+(max+1)+'</span><button id="back" class="btn quiet" '+(step===0?'disabled':'')+'>← Precedente</button><button id="next" class="btn primary" '+(step>=max?'disabled':'')+'>Passo successivo →</button></div>';
      $('back').onclick=()=>{player.stop();step=Math.max(0,step-1);redraw();$('back').disabled?$('next').focus():$('back').focus();};
      $('next').onclick=()=>{player.stop();step=Math.min(max,step+1);redraw(true);$('next').disabled?$('back').focus():$('next').focus();};
      const hash='#lab/6.3.'+unit+'?'+SL.parametri(s,step);
      if(location.hash!==hash)history.replaceState(null,'',hash);
      SL.refreshShare();
    }
    function refresh(){
      player.stop();
      $('parampanel').innerHTML=controls(s,unit);
      $('setparams').onsubmit=e=>{
        e.preventDefault();
        try{
          const va=intero($('addr').value),n=Number($('length').value);if(va>0xFFFFFFFFn)throw Error('L’indirizzo massimo è 0xFFFFFFFF.');
          if(!Number.isInteger(n)||n<1||n>16)throw Error('Scegli da 1 a 16 voci.');
          const table=Array.from({length:n},(_,i)=>s.table[i]??BigInt(i*2+1));
          s={...s,va,table,b:Number($('pagebits').value),width:unit===4?Number($('width').value):1,format:unit===2?$('format').value:'bit'};
          step=0;refresh();
        }catch(err){$('paramerr').textContent=err.message;}
      };
      $('cellidx').onchange=()=>{$('cellvalue').value=String(s.table[Number($('cellidx').value)]);};
      $('setcell').onsubmit=e=>{
        e.preventDefault();
        try{const val=intero($('cellvalue').value);if(val>32767n)throw Error('Scegli una voce da 0 a 32767.');
          s.table[Number($('cellidx').value)]=val;step=0;refresh();
        }catch(err){$('cellerr').textContent=err.message;}
      };
      document.querySelectorAll('[data-case]').forEach(b=>b.onclick=()=>{s=SL.scenari(b.dataset.case);step=0;refresh();});
      redraw(false,true);
    }
    SL.after=()=>{player=SL.filmPlayer($('film-special'),()=>step,()=>max,(n,f)=>{step=n;redraw(f);});guess=SL.previsione($('guess-special'));refresh();$('reset').onclick=()=>{s=unit===4?SL.scenari('confine'):SL.iniziale();step=0;refresh();};$('share').onclick=e=>SL.share(e.currentTarget);};
    const targetEx=[1,13,17,19][unit-1],u=SL.real.units[unit-1];
    return '<div class="wrap">'+SL.bread('<a href="#mappa/6.3">6.3 · Traduzione degli indirizzi</a> / '+unit)+SL.heading(E(u.title))+
      '<div class="layout">'+SL.sidebar(unit)+'<div class="body"><div class="toolrow"><span class="label">Esperimento 6.3.'+unit+'</span><div class="examples"><button id="reset" class="chip">Ripristina esempio</button> <button id="share" class="chip">Condividi stato</button></div></div>'+SL.guidaUnita(u.id,u.experiment,u.check)+'<div id="parampanel"></div><section class="panel"><div id="guess-special">'+SL.previsioneForm()+'</div><div id="special-graphic"></div><div id="film-special">'+SL.filmBar()+'</div><div id="simout"></div></section><a class="btn" href="#esercitazioni/6.3/'+targetEx+'">Passa alle esercitazioni →</a></div></div></div>';
  }
  SL.laboratorio=laboratorio;
})();
