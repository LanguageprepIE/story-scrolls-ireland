/* A short, optional bilingual glossary for the accessible scroll reader. */
(function(){
'use strict';
const definitions={
en:{
lir:['Lir','Father of four children who are turned into swans.','Person'],
fionnuala:['Fionnuala','Lir’s eldest child. She protects her brothers.','Person'],
aoife:['Aoife','Lir’s second wife. She casts the spell on the children.','Person'],
derravaragh:['Lough Derravaragh','A real lake in Ireland where the children become swans.','Place'],
moyle:['Sea of Moyle','The cold sea where the swans spend part of their long journey.','Place'],
fionn:['Fionn','A young apprentice who receives the gift of knowledge.','Person'],
finegas:['Finegas','A poet who teaches Fionn and waits for a magical salmon.','Person'],
boyne:['River Boyne','A real river in Ireland where the salmon story takes place.','Place'],
salmon:['Salmon of Knowledge','A magical fish that gives Fionn unusual wisdom.','Magical being'],
tuatha:['Tuatha Dé Danann','A magical people from old Irish legends.','Mythical people'],
dagda:['The Dagda','A powerful figure who owns a magical harp.','Person'],
uaithne:['Uaithne','The Dagda’s musician, taken prisoner by the Fomorians.','Person'],
fomorians:['Fomorians','The enemies who steal the Dagda’s harp.','Mythical people'],
lugh:['Lugh','A warrior who helps the Dagda recover his harp.','Person'],
ogma:['Ogma','A strong warrior who joins the Dagda and Lugh.','Person'],
bres:['Bres','A Fomorian leader who claims that the harp belongs to his people.','Person'],
harp:['The Dagda’s harp','A magical instrument that can make listeners cry, laugh or sleep.','Magical object']
},
es:{
lir:['Lir','Padre de cuatro hijos que son convertidos en cisnes.','Personaje'],
fionnuala:['Fionnuala','La hija mayor de Lir. Protege a sus tres hermanos.','Personaje'],
aoife:['Aoife','Segunda esposa de Lir. Lanza el hechizo sobre los niños.','Personaje'],
derravaragh:['Lago Derravaragh','Lago real de Irlanda donde los niños se convierten en cisnes.','Lugar'],
moyle:['Mar de Moyle','Mar frío donde los cisnes pasan una parte de su largo viaje.','Lugar'],
fionn:['Fionn','Joven aprendiz que recibe el don del conocimiento.','Personaje'],
finegas:['Finegas','Poeta que enseña a Fionn y espera un salmón mágico.','Personaje'],
boyne:['Río Boyne','Río real de Irlanda donde transcurre la historia del salmón.','Lugar'],
salmon:['Salmón del conocimiento','Pez mágico que concede a Fionn una sabiduría especial.','Ser mágico'],
tuatha:['Tuatha Dé Danann','Pueblo mágico que aparece en antiguas leyendas irlandesas.','Pueblo legendario'],
dagda:['El Dagda','Figura poderosa que posee un arpa mágica.','Personaje'],
uaithne:['Uaithne','Músico del Dagda, capturado por los fomorianos.','Personaje'],
fomorians:['Fomorianos','Enemigos que roban el arpa del Dagda.','Pueblo legendario'],
lugh:['Lugh','Guerrero que ayuda al Dagda a recuperar su arpa.','Personaje'],
ogma:['Ogma','Guerrero fuerte que acompaña al Dagda y a Lugh.','Personaje'],
bres:['Bres','Jefe fomoriano que afirma que el arpa ahora pertenece a los suyos.','Personaje'],
harp:['El arpa del Dagda','Instrumento mágico que puede hacer llorar, reír o dormir.','Objeto mágico']
}};
const storyTerms={
'children-of-lir':[['lir',['Lir']],['fionnuala',['Fionnuala']],['aoife',['Aoife']],['derravaragh',['Derravaragh']],['moyle',['Moyle']]],
'salmon-of-knowledge':[['fionn',['Fionn']],['finegas',['Finegas']],['boyne',['Boyne']],['salmon',['Salmon of Knowledge','Salmón del Conocimiento']]],
'dagdas-harp':[['tuatha',['Tuatha Dé Danann']],['dagda',['Dagda']],['uaithne',['Uaithne']],['fomorians',['Fomorians','fomorianos']],['lugh',['Lugh']],['ogma',['Ogma']],['bres',['Bres']],['harp',['Daur Dá Bláo','Cóir Cetharchair']]]
};
function escape(s){return String(s).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;')}
function pattern(form){return new RegExp('(?<![\\p{L}\\p{N}])'+form.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')+'(?![\\p{L}\\p{N}])','iu')}
function mark(paragraph,sectionIndex,paragraphIndex,sections,storyId,lang){
 const hits=[];
 for(const [id,forms] of storyTerms[storyId]||[]){
  const occurrence=forms.map(form=>pattern(form).exec(paragraph)).find(Boolean);
  if(!occurrence)continue;
  let used=false;
  outer:for(let i=0;i<=sectionIndex;i++)for(let j=0;j<(i===sectionIndex?paragraphIndex:sections[i].paragraphs.length);j++){
   if(forms.some(form=>pattern(form).test(sections[i].paragraphs[j]))){used=true;break outer}
  }
  if(!used)hits.push({id,at:occurrence.index,text:occurrence[0]});
 }
 hits.sort((a,b)=>a.at-b.at);
 let p=0,html='';
 for(const hit of hits){if(hit.at<p)continue;
  html+=escape(paragraph.slice(p,hit.at));
  html+='<button class="scroll-term" type="button" data-scroll-term="'+hit.id+'" aria-label="'+escape(hit.text)+(lang==='es'?', ver explicación':', read explanation')+'">'+escape(hit.text)+'</button>';
  p=hit.at+hit.text.length;
 }
 return html+escape(paragraph.slice(p));
}
function popup(lang){
 return '<dialog class="scroll-gloss-dialog" id="scrollGlossDialog" aria-labelledby="scrollGlossTitle"><div class="scroll-gloss-content"><button type="button" class="scroll-gloss-close" data-scroll-close aria-label="'+(lang==='es'?'Cerrar':'Close')+'">×</button><p class="scroll-gloss-label">'+(lang==='es'?'EN POCAS PALABRAS':'IN A FEW WORDS')+'</p><h3 id="scrollGlossTitle"></h3><p id="scrollGlossMeaning"></p><button type="button" class="scroll-gloss-link" data-action="glossary" data-gloss-from-card="1">'+(lang==='es'?'Ver glosario':'Open glossary')+' →</button></div></dialog>';
}
function glossary(lang){
 const items=Object.entries(definitions[lang]).sort((a,b)=>a[1][0].replace(/^(?:the |el |la |los |las )/i,'').localeCompare(b[1][0].replace(/^(?:the |el |la |los |las )/i,''),lang,{sensitivity:'base'}));
 return '<section class="scroll-glossary"><h2>'+(lang==='es'?'Palabras y personajes':'Words and characters')+'</h2><p>'+(lang==='es'?'Un pequeño glosario de las tres leyendas. Puedes consultarlo cuando quieras.':'A short glossary for the three stories. Open it whenever you like.')+'</p><div class="scroll-gloss-entries">'+items.map(([id,item])=>'<article class="scroll-gloss-entry" id="gloss-'+id+'"><p class="scroll-gloss-category">'+escape(item[2])+'</p><h3>'+escape(item[0])+'</h3><p>'+escape(item[1])+'</p></article>').join('')+'</div><button class="button secondary" data-action="library">← '+(lang==='es'?'Volver a las historias':'Back to stories')+'</button></section>';
}
function open(id,lang){const data=definitions[lang][id],dlg=document.getElementById('scrollGlossDialog');if(!data||!dlg)return;dlg.querySelector('#scrollGlossTitle').textContent=data[0];dlg.querySelector('#scrollGlossMeaning').textContent=data[1];dlg.showModal();dlg.querySelector('[data-scroll-close]').focus()}
window.ScrollGlossary={mark,popup,glossary,open};
})();
