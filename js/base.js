'use strict';
(() => {
  const partNames=['Rappresentazione dei dati','Programmazione x86-64','Organizzazione del processore','I/O e archiviazione','Processi e concorrenza','Memoria, file e protezione'];
  const roman=['I','II','III','IV','V','VI'];
  const $=id=>document.getElementById(id);
  function esc(v){return String(v??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));}
  const E=esc;
  function bread(last) {return '<div class="crumb"><a href="#indice">Inizio</a> / '+last+'</div>';}
  const moduleSymbols=['input','register','cpu','storage','process','gate'];
  function emblem(kind,cls=''){
    return '<svg class="ui-symbol '+E(cls)+'" viewBox="0 0 80 80" aria-hidden="true" focusable="false"><path d="M17 2H4V16M63 78H76V64" fill="none" stroke="#766341"/>'+SL.symbols.glyph(kind,8,8,64)+'</svg>';
  }
  function heading(title,desc=''){
    const view=SL.view||{},mod=view.module||0;
    const labels={laboratorio:'Laboratorio interattivo',lab:'Esperimento',modulo:'Simulazione d’insieme',esercitazioni:'Esercitazioni guidate',soluzioni:'Svolgimenti',problema:'Problema svolto',mappa:'Indice degli argomenti'};
    const label=(mod?'Modulo '+roman[mod-1]+' / ':'')+(labels[view.section]||'Architettura dei sistemi');
    const kind=mod?moduleSymbols[mod-1]:view.section==='esercitazioni'?'gate':'cpu';
    return '<div class="pagehead"><div class="pagehead-copy"><div class="page-kicker">'+E(label)+'</div><h1>'+title+'</h1>'+(desc?'<p>'+desc+'</p>':'')+'</div><div class="page-emblem">'+emblem(kind)+'</div></div>';
  }
  const real=SL.catalogo.find(c=>c.id==='6.3');
  const famNames=['VPN e offset','Composizione di PA','Lettura della tabella','Controllo della traduzione','Traduzione completa'];
  const chapters=new Map(SL.catalogo.map(c=>[c.id,c]));
  const fold=x=>String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
  const unitChapter=id=>chapters.get(id.split('.').slice(0,2).join('.'));
  const isLab=u=>!!SL.unita[u.id] || /^6\.3\.[1-4]$/.test(u.id);
  for(const c of SL.catalogo)for(const u of c.units){
    if(!isLab(u))u.theory=SL.lezioni[u.id].join(' ');
  }
  const practiceCount=c=>c.id==='6.3'?SL.esercizi.length:(SL.prove[c.id]||[]).length;
  function unitLink(u){
    if(isLab(u))return '#lab/'+u.id;
    const id=unitChapter(u.id).id;
    if(/svolt/i.test(u.title))return '#problema/'+u.id;
    return (u.kind==='soluzioni'?'#soluzioni/':'#esercitazioni/')+id;
  }
  function bookTag(id,label='Leggi nella dispensa'){
    const page=SL.pagine[id];
    return '<a class="textlink book" data-book data-page="'+(page||'')+'" href="materiali/dispensa.pdf'+(page?'#page='+page:'')+'" target="_blank" rel="noopener">'+E(label)+' ↗</a>';
  }
  function lessico(testo){
    const voci=SL.lessico.filter(([termine])=>termine.test(testo)).sort((a,b)=>a[1].localeCompare(b[1],'it'));
    if(!voci.length)return '';
    const righe=voci.map(([,nome,spiegazione])=>'<dt>'+E(nome)+'</dt><dd>'+E(spiegazione)+'</dd>').join('');
    return '<details class="lessico"><summary>Termini e simboli</summary><dl>'+righe+'</dl></details>';
  }
  function guidaUnita(id){
    const guida=SL.guide[id],testo=guida.teoria;
    const libro=SL.pagine[id]?bookTag(id,'§ '+id+' nella dispensa'):'';
    const paragrafi=testo.map(t=>'<p>'+E(t)+'</p>').join('');
    const procedura=guida.procedura?'<div class="procedura-guida"><h3>Come svolgere l’attività</h3>'+listaPassi(guida.procedura)+'</div>':'';
    return '<section class="panel theory guida-unita" data-unita="'+E(id)+'"><div class="scopo-guida"><span class="label">Il problema da studiare</span><p data-scopo>'+E(guida.scopo)+'</p></div><div class="toolrow"><h2>La teoria, passo per passo</h2><div class="azioni-teoria"><button type="button" class="chip" data-salta-teoria>Vai all’attività ↓</button>'+libro+'</div></div><div class="lezione" data-principio>'+paragrafi+'</div>'+lessico([guida.scopo,...testo,guida.lettura].join(' '))+procedura+'</section>';
  }
  function listaPassi(passi){return '<ol class="passi-guida" data-azione>'+passi.map(t=>'<li>'+E(t)+'</li>').join('')+'</ol>';}
  function introduzioneUnita(id){
    return '<div class="introduzione-attivita" data-introduzione="'+E(id)+'">'+SL.guide[id].introduzione.map(t=>'<p>'+E(t)+'</p>').join('')+'</div>';
  }
  function letturaUnita(id){return '<div class="lettura-figura"><h3>Leggere la simulazione</h3><p data-lettura>'+E(SL.guide[id].lettura)+'</p></div>';}
  function esitoUnita(id){
    const g=SL.guide[id];
    return '<section class="panel esito-guida" data-guida-esito><h2>Risultato dell’esempio guidato</h2><p data-riscontro>'+E(g.risultato)+'</p><h3>Il ragionamento</h3><p>'+E(g.ragionamento)+'</p><h3>La relazione da comprendere</h3><p data-conclusione>'+E(g.conclusione)+'</p></section>';
  }
  function titoloTraccia(capitolo,numero,variante){
    const scheda=SL.schedeProve[capitolo+'/'+numero];
    const titolo=scheda?.obiettivi[variante];
    return 'Traccia '+(variante+1)+(titolo?' · '+titolo:'');
  }
  function chiaveTraccia(capitolo,numero,variante){
    const chiave=capitolo+(capitolo==='6.3'?'.':'/')+numero+'/'+variante;
    const edizione=SL.schedeProve[capitolo+'/'+numero]?.edizioni?.[variante]||1;
    return edizione===1?chiave:chiave+'@'+edizione;
  }
  // I progressi sono preferenze locali: si accettano solo le tracce correnti.
  // I limiti precedono il parsing per contenere il costo di dati alterati.
  function registroProgressi(storageKey,chiavi){
    const ammesse=new Set(chiavi),sessione=new Set();
    function completate(){
      const risultato=new Set(sessione);
      try{
        const raw=localStorage.getItem(storageKey);
        if(typeof raw!=='string'||raw.length>65536)return risultato;
        const dati=JSON.parse(raw);
        if(!Array.isArray(dati)||dati.length>1024)return risultato;
        for(const k of dati)if(typeof k==='string'&&ammesse.has(k))risultato.add(k);
      }catch{/* I progressi della scheda restano disponibili. */}
      return risultato;
    }
    function segna(k){
      if(!ammesse.has(k))return;
      sessione.add(k);
      try{localStorage.setItem(storageKey,JSON.stringify([...completate()]));}
      catch{/* La scheda conserva il risultato anche a memoria persistente esaurita. */}
    }
    return {completate,segna};
  }
  function principioProva(text){
    return '<p class="principio-prova" data-principio-prova><strong>Principio.</strong> '+E(text)+'</p>';
  }
  function home(){
    const labs=SL.catalogo.flatMap(c=>c.units).filter(isLab).length;
    const count=SL.catalogo.reduce((a,c)=>a+practiceCount(c),0);
    return '<section class="hero"><div class="wrap hero-inner"><div class="hero-copy"><div class="hero-kicker">SistemiLab / Atlante interattivo</div><h1>Architettura <span>dei sistemi</span></h1><p>Segui un dato dai circuiti al sistema operativo. Cambia gli ingressi e ricostruisci ciò che accade, un passo alla volta.</p><div class="actions"><a class="btn primary" href="#laboratorio">Apri il laboratorio →</a><a class="btn quiet" href="#esercitazioni">Vai alle esercitazioni</a></div><div class="hero-stats"><span><b>06</b>moduli</span><span><b>'+labs+'</b>esperimenti</span><span><b>'+count+'</b>esercizi</span></div></div><img class="hero-art" src="assets/hero.svg" alt="Rete di nodi che collega bit, processore, memoria, periferiche, processi e file system"></div></section>'+
      '<div class="wrap"><section class="section"><div class="sechead"><h2>Ambienti di studio</h2></div><div class="paths">'+
      '<a class="pathcard" href="#laboratorio"><div><h3>Laboratorio interattivo</h3><p>Parti da una domanda, consulta il modello e osserva gli effetti di ogni scelta sulla macchina.</p><div class="go">'+labs+' esperimenti animati →</div></div><img src="assets/lab.svg" alt=""></a>'+
      '<a class="pathcard warm" href="#esercitazioni"><div><h3>Esercitazioni guidate</h3><p>Prepara le attività PWN con tracce verificabili, indizi mirati e svolgimenti che esplicitano il ragionamento.</p><div class="go">'+count+' esercizi con varianti →</div></div><img src="assets/pwn.svg" alt=""></a></div></section>'+
      '<section class="section"><div class="sechead"><h2>Simulazioni dei moduli</h2><small>41 capitoli</small></div><div class="mapgrid">'+partNames.map((name,i)=>'<a class="partcard" href="#modulo/'+(i+1)+'"><span class="module-mark">'+emblem(moduleSymbols[i])+'<span class="partno">'+roman[i]+'</span></span><span class="part-copy"><strong>'+E(name)+'</strong><small>'+SL.catalogo.filter(c=>c.id.startsWith((i+1)+'.')).length+' capitoli · apri la simulazione</small></span></a>').join('')+'</div></section></div>';
  }
  const sectionNames={mappa:'Indice della dispensa',laboratorio:'Laboratorio interattivo',esercitazioni:'Esercitazioni guidate'};
  function rowsFor(c,section){
    if(section==='esercitazioni'){
      if(c.id==='6.3')return SL.esercizi.map((x,i)=>({name:x.title,info:x.principio+' '+c.pwn[Math.floor(i/4)].id,link:'#esercitazioni/6.3/'+(i+1)}));
      return (SL.prove[c.id]||[]).map((x,i)=>({name:x.titolo,info:x.principio+' '+x.unita+' '+x.attivita+' '+(c.pwn.find(p=>p.id===x.attivita)?.title||''),link:'#esercitazioni/'+c.id+'/'+(i+1)}));
    }
    return c.units.filter(u=>section==='mappa'||isLab(u)).map(u=>({name:u.id+' · '+u.title,info:[SL.guide[u.id].scopo,...SL.lezioni[u.id],SL.guide[u.id].lettura].join(' '),link:unitLink(u)}));
  }
  function directory(section,target='',params){
    const c=chapters.get(target);
    if(c)return section==='esercitazioni'?SL.practiceList(c,params):chapterView(c,section);
    const part=Number(target.replace('parte-',''))||0;
    const label=sectionNames[section];
    const description={mappa:'Apri un capitolo per trovare gli esperimenti, gli esercizi e le pagine corrispondenti del libro.',laboratorio:'Scegli una sottounità. In ogni esperimento puoi leggere la spiegazione, cambiare i dati e seguire la traccia passo dopo passo.',esercitazioni:'Scegli un capitolo o cerca una competenza PWN. Ogni esercizio comprende due tracce, indizi e uno svolgimento completo.'}[section];
    const rows=SL.catalogo.map(c=>({c,items:rowsFor(c,section)}));
    function draw(){
      const q=fold($('cerca').value.trim()), selected=Number($('parte').value);
      const html=partNames.map((name,i)=>{
        if(selected&&selected!==i+1)return '';
        const items=rows.filter(({c})=>c.id.startsWith((i+1)+'.')).map(({c,items})=>{
          const hits=q?items.filter(x=>fold(x.name+' '+x.info).includes(q)):[];
          if(q&&!fold(c.id+' '+c.title+' '+name).includes(q)&&!hits.length)return '';
          const note=items.length+' '+({esercitazioni:'esercizi',mappa:'sottounità',laboratorio:'esperimenti'}[section]);
          return '<a class="chapterrow" href="#'+section+'/'+c.id+'"><span class="number">'+c.id+'</span><span>'+E(c.title)+'</span><span class="after">'+note+'<span class="route-arrow" aria-hidden="true">↗</span></span></a>'+hits.map(x=>'<a class="searchhit" href="'+x.link+'">↳ '+E(x.name)+'</a>').join('');
        }).join('');
        return items?'<section class="mapsection"><div class="module-heading">'+emblem(moduleSymbols[i])+'<div><span class="label">Modulo '+roman[i]+'</span><h2>'+E(name)+'</h2></div></div>'+(section!=='esercitazioni'&&!q?'<a class="textlink" href="#modulo/'+(i+1)+'">Simulazione d’insieme · '+E(SL.moduliAnimati[i+1].titolo)+' →</a>':'')+items+'</section>':'';
      }).join('');
      $('elenco-capitoli').innerHTML=html||'<p class="status">Nessuna corrispondenza. Prova con «registro», «cache» oppure il numero del capitolo.</p>';
    }
    SL.after=()=>{draw();$('cerca').oninput=draw;$('parte').onchange=draw;};
    return '<div class="wrap">'+bread(label)+heading(label,description)+'<div class="catalogfilter"><label>Cerca per argomento o numero<input id="cerca" type="search" placeholder="Ad esempio: cache"></label><label>Parte<select id="parte"><option value="0">Tutte le parti</option>'+partNames.map((n,i)=>'<option value="'+(i+1)+'"'+(part===i+1?' selected':'')+'>'+roman[i]+' · '+E(n)+'</option>').join('')+'</select></label></div><div id="elenco-capitoli"></div></div>';
  }
  function chapterView(c,section){
    const list=section==='laboratorio'?c.units.filter(isLab):c.units;
    return '<div class="wrap">'+bread('<a href="#'+section+'">'+sectionNames[section]+'</a> / Capitolo '+c.id)+heading(E(c.id+' · '+c.title),E(SL.domandeCapitolo[c.id]))+'<div class="toolrow chapter-actions"><a class="btn primary" href="'+unitLink(c.units.find(isLab))+'">Primo esperimento →</a><a class="btn quiet" href="#esercitazioni/'+c.id+'">Esercitazioni del capitolo</a>'+bookTag(c.id)+'</div><section class="panel unit-catalogue"><h2>'+ (section==='laboratorio'?'Esperimenti':'Sottounità')+'</h2>'+list.map(u=>'<div class="unitpair"><a href="'+unitLink(u)+'"><span class="accent mono">'+u.id+'</span> '+E(u.title)+' →</a>'+bookTag(u.id,'Libro')+'</div>').join('')+'</section></div>';
  }
  function chapterNav(c,active){
    const opts=c.units.map(u=>'<option value="'+unitLink(u)+'"'+(u.id===active?' selected':'')+'>'+E(u.id+' · '+u.title)+'</option>').join('');
    return '<div class="mobile-units"><label>Sottounità del capitolo '+c.id+'<select onchange="location.hash=this.value">'+opts+'</select></label></div><aside class="side"><div class="side-heading">'+emblem(moduleSymbols[Number(c.id[0])-1])+'<h2>Capitolo '+c.id+'</h2></div>'+c.units.map(u=>'<a href="'+unitLink(u)+'"'+(u.id===active?' class="on" aria-current="page"':'')+'><span class="sid">'+u.id+'</span><span>'+E(u.title)+'</span></a>').join('')+'<hr><a href="#mappa/'+c.id+'">Indice del capitolo ↗</a></aside>';
  }
  function modNav(id){
    const rows=SL.catalogo.filter(c=>c.id.startsWith(id+'.'));
    return '<div class="mobile-units"><label>Capitoli del modulo<select onchange="if(this.value)location.hash=this.value"><option value="">Scegli un capitolo</option>'+rows.map(c=>'<option value="#laboratorio/'+c.id+'">'+E(c.id+' · '+c.title)+'</option>').join('')+'</select></label></div><aside class="side"><div class="side-heading">'+emblem(moduleSymbols[id-1])+'<h2>Modulo '+roman[id-1]+'</h2></div>'+rows.map(c=>'<a href="#laboratorio/'+c.id+'"><span class="sid">'+c.id+'</span><span>'+E(c.title)+'</span></a>').join('')+'</aside>';
  }
  function sidebar(unit){return chapterNav(real,'6.3.'+unit);}
  function linksFamily(g,current,params=''){
    return '<div class="examples">'+Array.from({length:4},(_,i)=>{const n=g*4+i+1;return '<a class="'+(current===n?'on':'')+'" href="#esercitazioni/6.3/'+n+params+'">6.3.'+n+'</a>';}).join('')+'</div>';
  }
  function codeView(code,line=0){return '<div class="codeview" aria-label="Listato con numeri di riga">'+code.split('\n').map((v,i)=>'<div class="'+(i+1===line?'active-line':'')+'"><i>'+String(i+1).padStart(2,'0')+'</i>'+E(v)+'</div>').join('')+'</div>';}
  function share(btn){
    const offline=['file:','blob:'].includes(location.protocol);
    const value=offline?location.hash:location.href;
    let field=btn.parentElement.querySelector('[data-share-state]');
    if(!field){
      field=document.createElement('input');field.readOnly=true;field.dataset.shareState='';
      field.setAttribute('aria-label',offline?'Percorso allo stato corrente':'Collegamento allo stato corrente');
      btn.after(field);
    }
    field.value=value;field.select();
    if(!offline&&navigator.clipboard?.writeText)navigator.clipboard.writeText(value).catch(()=>{});

  }
  function refreshShare(){
    const field=document.querySelector('[data-share-state]');
    if(field)field.value=['file:','blob:'].includes(location.protocol)?location.hash:location.href;
  }
  Object.assign(SL,{emblem,moduleSymbols,modNav,refreshShare,$,esc,home,directory,sidebar,chapterNav,chapters,isLab,unitChapter,unitLink,practiceCount,titoloTraccia,chiaveTraccia,registroProgressi,guidaUnita,introduzioneUnita,letturaUnita,esitoUnita,listaPassi,principioProva,bread,heading,bookTag,partNames,roman,famNames,linksFamily,codeView,share,real});
})();
