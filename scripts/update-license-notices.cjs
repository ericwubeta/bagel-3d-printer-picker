/* SPDX-License-Identifier: MIT */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto');
const root = path.resolve(__dirname, '..');
const read = p => fs.readFileSync(path.join(root, p), 'utf8');
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(path.join(root, p))).digest('hex');
const publication = JSON.parse(read('licensing/publication.json'));
const preparedAt = publication.updated_at || publication.prepared_at;
const mit = read('LICENSE').replace(/^Copyright \(c\) 2026 .+$/m, 'Copyright (c) 2026 ' + (publication.public_credit || '[PUBLIC_ATTRIBUTION_PENDING]')).trimEnd()+'\n';
fs.writeFileSync(path.join(root,'LICENSE'),mit);
const cc = read('LICENSES/CC-BY-NC-4.0.txt');
if (!cc.startsWith('Attribution-NonCommercial 4.0 International') || !cc.includes('Section 8 -- Interpretation.')) throw Error('Unexpected CC license text');
const attribution = {public_credit: publication.public_credit, xiaohongshu_profile_url: publication.xiaohongshu_profile_url, status: publication.public_credit ? 'github_maintainer_attribution' : 'pending_user', project_title: '贝果陪你选 · 3D打印机', source_url: publication.repository_url};
const models = ['a1-mini','a1','a2l','p1s','p2s','x2d','h2s','h2d','h2c'];
const pngs = ['bagel-extra-poses.png','bagel-poses-soft-v02.png'].concat(Array.from({length:8},(_,i)=>'welcome-pose-'+i+'.png'));
const productImages = JSON.parse(read('licensing/product-images.json'));
const productNotice = read('LICENSES/Bambu-Product-Images.txt').replace(/\r\n/g,'\n');
const materials = models.map(id => ({path:'web/assets/'+id+'.svg',source_only:true,license:'MIT',creator:'project-authored generic schematic; retained as an unused source reference',sha256:sha('web/assets/'+id+'.svg')}));
for(const id of models){
  const source=productImages.files.find(item=>item.model_id===id);
  if(!source || sha(source.path)!==source.sha256)throw Error('Missing or stale official product image: '+id);
  materials.push(Object.assign({},source,{runtime_path:'assets/'+id+'.png',third_party_exception:'Bambu Lab/original rights retained; no MIT or CC BY-NC-4.0 license granted by this project.'}));
}
pngs.forEach(name => materials.push({path:'web/assets/'+name,runtime_path:'assets/'+name,license:'CC-BY-NC-4.0',creator:publication.public_credit,sha256:sha('web/assets/'+name),source:'Project AI-assisted artwork based on owner-supplied Bagel references; original references are excluded.',modifications:'Existing approved raster retained; CSS cropping/occlusion or animation composition as documented.',third_party_exception:null}));
materials.push({path:'content/notes.json',runtime_path:'note-content.js',license:'CC-BY-NC-4.0',creator:publication.public_credit,sha256:sha('content/notes.json'),source:'Project-authored excerpts of the Bagel account notes; third-party originals and friend source works are excluded.',modifications:'Data separated from the MIT API wrapper without changing text.'});
materials.push({path:'web/meow-data.js',components:[{scope:'JavaScript wrapper',license:'MIT'},{scope:'Base64 PCM audio',license:'CC0-1.0',creator:'tuberatanka',source_url:'https://freesound.org/people/tuberatanka/sounds/110011/',license_url:'https://creativecommons.org/publicdomain/zero/1.0/',pcm_sha256:'dd4041732e946010d20a401742edf4ac2150b79baffdbfa346318c001effdd5a',modifications:'Full clip decoded to mono 22050Hz 16-bit PCM, no trim/speed/pitch change; runtime gain 0.85. Not a recording of Bagel.'}]});
const map = {schemaVersion:1,prepared_at:preparedAt,default_code_license:'MIT',default_excludes:['content/notes.json','web/assets/*.png','audio payload in web/meow-data.js','generated note-content.js'],attribution,files:materials,not_present:['standalone Logo'],excluded_from_public_source:['private-assets/','owner original photos','friend reference works','raw research and interview files','font binaries'],license_texts:{MIT:'LICENSE','CC-BY-NC-4.0':'LICENSES/CC-BY-NC-4.0.txt','LicenseRef-Bambu-Product-Images':'LICENSES/Bambu-Product-Images.txt'},trademark_note:'Copyright permissions do not grant trademark, patent, publicity/privacy rights or endorsement.'};
const runtime = {schemaVersion:1,version:JSON.parse(read('package.json')).version,prepared_at:preparedAt,publication_status:publication.publication_status,default_code_license:'MIT',attribution,licenses:{MIT:{text:mit},'CC-BY-NC-4.0':{url:'https://creativecommons.org/licenses/by-nc/4.0/',legalcode_url:'https://creativecommons.org/licenses/by-nc/4.0/legalcode.en',text:cc},'CC0-1.0':{url:'https://creativecommons.org/publicdomain/zero/1.0/'},'LicenseRef-Bambu-Product-Images':{text:productNotice}},materials:materials.filter(m=>!m.source_only).map(m=>Object.assign({},m,{source_path:m.path,source_sha256:m.sha256||sha(m.path),path:m.runtime_path||'meow-data.js',sha256:m.path==='content/notes.json'?null:m.sha256||sha(m.path)})),local_asset_override_notice:'Explicit local replacements are not covered by the project licenses and must retain their own rights information.',pending_publication_fields:['public_credit','xiaohongshu_profile_url'].filter(k=>!publication[k]),font_output_review:publication.font_output_review};
for(const [file,value] of [['licensing/asset-map.json',map],['licensing/runtime-attribution.json',runtime]])fs.writeFileSync(path.join(root,file),JSON.stringify(value,null,2)+'\n');
console.log(JSON.stringify({materials:materials.length,attribution:attribution.status,publication:publication.publication_status}));
