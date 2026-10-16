(function(root){
 'use strict';
 function room(v){
  var b='<rect x="26" y="22" width="166" height="106" rx="3" fill="#E9EFF4"/><path d="M26 128H205" stroke="#6F9FB4" stroke-width="2"/><rect x="39" y="34" width="41" height="43" fill="#fff" stroke="#6F9FB4"/><path d="M59 34v43M39 55h41" stroke="#6F9FB4"/>';
  if(v==='bedroom')b+='<path d="M91 89h78q9 0 9 9v18H85V92q0-12 13-12h18v9" fill="#D5E3E9" stroke="#6F9FB4" stroke-width="2"/><path d="M85 116v11m93-11v11" stroke="#6F9FB4" stroke-width="3"/><circle cx="186" cy="30" r="16" fill="#fff"/><path d="M176 20l20 20m0-20l-20 20" stroke="#A64D47" stroke-width="3"/>';
  else if(v==='balcony')b+='<path d="M36 94h144m-139 0v34m23-34v34m23-34v34m23-34v34m23-34v34m23-34v34" stroke="#6F9FB4" stroke-width="3"/><circle cx="167" cy="34" r="12" fill="#D5AE6B"/><path d="M193 44l-5 9m-3 10l-5 9" stroke="#6F9FB4" stroke-width="3"/>';
  else if(v==='living')b+='<rect x="89" y="74" width="85" height="36" rx="7" fill="#D5E3E9" stroke="#6F9FB4"/><path d="M85 92h10v25h-10m83-25h10v25h-10M103 74v30m51-30v30" stroke="#6F9FB4" stroke-width="2"/>';
  else if(v==='study')b+='<path d="M91 83h90v7H91m6 0v37m78-37v37" fill="#D5E3E9" stroke="#6F9FB4" stroke-width="2"/><rect x="120" y="46" width="43" height="28" rx="2" fill="#fff" stroke="#6F9FB4"/><path d="M141 74v9M97 66h9v17h-9m-8-22h6v22h-6" stroke="#6F9FB4" stroke-width="3"/>';
  else if(v==='separate')b+='<path d="M95 89h87v7H95m5 0v32m75-32v32" fill="#D5E3E9" stroke="#6F9FB4" stroke-width="2"/><rect x="115" y="48" width="42" height="41" fill="#2451C7" rx="2"/><rect x="122" y="56" width="28" height="25" fill="#fff"/><circle cx="166" cy="70" r="7" fill="#D5E3E9"/>';
  else b+='<text x="138" y="91" text-anchor="middle" font-size="53" fill="#2451C7">?</text>';
  return b;
 }
 function draw(key,v){var b='';
  if(key==='place')b=room(v);
  else if(key==='color'){
   b='<rect x="43" y="50" width="146" height="64" rx="9" fill="#2451C7"/><circle cx="54" cy="82" r="3" fill="#16399B"/><circle cx="178" cy="82" r="3" fill="#16399B"/><text x="117" y="95" font-size="42" font-weight="700" text-anchor="middle" fill="'+(v==='auto'?'#fff':'#3360D0')+'">BE</text>';
   if(v==='diy')b='<rect x="43" y="68" width="146" height="55" rx="9" fill="#2451C7"/><text x="117" y="45" font-size="40" font-weight="700" text-anchor="middle" fill="#fff" stroke="#6F9FB4" stroke-width=".8">BE</text><path d="M83 51v12m68-12v12m-71-4l3 4 3-4m62 0l3 4 3-4" stroke="#6F9FB4" fill="none" stroke-width="2"/>';
   if(v==='auto')b+='<path d="M87 22h60m-5-5l5 5-5 5" stroke="#6F9FB4" stroke-width="2" fill="none"/><circle cx="78" cy="22" r="9" fill="#2451C7"/><circle cx="156" cy="22" r="9" fill="#fff" stroke="#6F9FB4"/>';
  }else if(key==='size'){
   b='<path d="M28 129h173M34 125v8m28-8v8m28-8v8m28-8v8m28-8v8m28-8v8" stroke="#6F9FB4" stroke-width="2"/>';
   if(v==='small')b+='<rect x="90" y="38" width="43" height="83" rx="5" fill="#D5E3E9" stroke="#6F9FB4"/><ellipse cx="111" cy="39" rx="21" ry="5" fill="#fff" stroke="#6F9FB4"/><rect x="90" y="65" width="43" height="28" fill="#2451C7"/><path d="M157 36v86m-5-86h10m-10 86h10" stroke="#6F9FB4"/><text x="170" y="83" font-size="14" fill="#2451C7">约12cm</text>';
   else if(v==='medium')b+='<rect x="89" y="21" width="48" height="101" rx="7" fill="#D5E3E9" stroke="#6F9FB4"/><rect x="94" y="29" width="38" height="81" rx="3" fill="#fff"/><path d="M109 34h9M159 21v101m-5-101h10m-10 101h10" stroke="#6F9FB4"/><text x="170" y="75" font-size="14" fill="#2451C7">约15cm</text>';
   else if(v==='large')b+='<path d="M63 37l62-22 58 23v66l-64 22-56-25Z" fill="#D5E3E9" stroke="#6F9FB4"/><path d="M63 37l57 24 63-23M120 61v65" fill="none" stroke="#6F9FB4"/><text x="63" y="150" font-size="13" fill="#2451C7">长、宽、高分别看</text>';
   else b+='<path d="M65 64l88-34 12 34-88 34Z" fill="#D5E3E9" stroke="#6F9FB4"/><text x="111" y="61" text-anchor="middle" font-size="29" fill="#2451C7">?</text>';
  }else if(key==='footprint')b='<path d="M23 110h204v9H23m8 0v31m188-31v31" fill="#D5E3E9" stroke="#6F9FB4"/><rect x="62" y="31" width="63" height="79" fill="#2451C7"/><rect x="72" y="45" width="43" height="50" fill="#fff"/><circle cx="156" cy="69" r="17" fill="#D5E3E9" stroke="#6F9FB4"/><path d="M156 86v24M39 15h156M218 24v71" fill="none" stroke="#6F9FB4"/><path d="M125 44q45 11 17 52" fill="none" stroke="#6F9FB4" stroke-dasharray="3 4"/><text x="74" y="14" font-size="12" fill="#2451C7">料架与操作空间</text>';
  else if(key==='budget')b='<path d="M52 73h140v54H52Z" fill="#D5E3E9" stroke="#6F9FB4"/><path d="M60 82h124v34H60Z" fill="#fff"/><text x="122" y="108" text-anchor="middle" font-size="26" fill="#2451C7">'+({under2:'≤2000','2to4':'2000–4000','4to8':'4000–8000',over8:'8000+',unknown:'先看参考'}[v]||'整套费用')+'</text><ellipse cx="92" cy="62" rx="18" ry="6" fill="#D5E3E9" stroke="#6F9FB4"/><ellipse cx="127" cy="48" rx="18" ry="6" fill="#D5E3E9" stroke="#6F9FB4"/>';
  else if(key==='purpose'){
   if(v==='home')b='<path d="M69 49l53-21 51 22v60l-54 22-50-22Z" fill="#D5E3E9" stroke="#6F9FB4"/><path d="M69 49l50 22 54-21M119 71v61" stroke="#6F9FB4" fill="none"/>';
   else if(v==='large')b='<path d="M74 89q-17-61 39-68t67 53l-7 25-38 12-10 23-44-10Z" fill="#D5E3E9" stroke="#6F9FB4"/><path d="M86 69l71-13-6 25-64 12Z" fill="#2451C7"/>';
   else if(v==='soft')b='<path d="M70 24q23 18 42 6l33-9q12 0 17 12l22 70q-2 15-16 18l-42 15q-16 4-24-14Z" fill="#D5E3E9" stroke="#6F9FB4"/><path d="M93 46q20 11 39 0l18-4 19 64-44 13Z" fill="#fff" stroke="#6F9FB4"/>';
   else if(v==='functional')b='<path d="M95 23h34l7 15 17 1 14 25-8 17 6 17-20 25-17-5-16 14-25-13-16 3-16-26 11-16-4-18 19-15Z" fill="#D5E3E9" stroke="#6F9FB4"/><circle cx="109" cy="80" r="22" fill="#fff" stroke="#2451C7" stroke-width="6"/>';
   else if(v==='unknown'||!v)b='<text x="119" y="114" text-anchor="middle" font-size="100" fill="#6F9FB4">?</text>';
   else b='<path d="M77 55l-4-32 30 22M128 45l30-22-3 35" fill="#D5E3E9" stroke="#6F9FB4"/><ellipse cx="115" cy="78" rx="44" ry="36" fill="#D5E3E9"/><circle cx="99" cy="73" r="5" fill="#2451C7"/><circle cx="131" cy="73" r="5" fill="#2451C7"/><path d="M108 88l7 7 7-7" fill="#DFA6A8"/>';
  }
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 160" role="img" aria-label="选择图解">'+b+'</svg>';
 }
 root.BagelDiagrams={draw:draw};
}(window));
