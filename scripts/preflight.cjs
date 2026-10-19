/* SPDX-License-Identifier: MIT */
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), child = require('child_process');
const root = path.resolve(__dirname, '..');
const errors = [], pending = [], optional = [];
const sha = p => crypto.createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const json = p => JSON.parse(fs.readFileSync(path.join(root,p),'utf8'));
const meta = json('licensing/publication.json'), map = json('licensing/asset-map.json'), notice = json('licensing/runtime-attribution.json');
const mit = fs.readFileSync(path.join(root,'LICENSE'),'utf8');
if(!mit.startsWith('MIT License\n')||!mit.includes('Permission is hereby granted, free of charge')) errors.push('MIT license text missing');
if(sha(path.join(root,'LICENSES/CC-BY-NC-4.0.txt'))!=='41003d4a74749c0220e33dd415042164b5a1093ed401f36277234f772d22d3d0') errors.push('CC license differs from official fetched text');
if(map.default_code_license!=='MIT'||notice.default_code_license!=='MIT') errors.push('Default code license mismatch');
if(meta.code_license!=='MIT'||meta.content_license!=='CC-BY-NC-4.0') errors.push('Selected scope mismatch');
for(const material of map.files){
  const p=path.join(root,material.path);
  if(!fs.existsSync(p)) {errors.push('Missing mapped source: '+material.path); continue;}
  if(material.sha256&&sha(p)!==material.sha256) errors.push('Stale source hash: '+material.path);
}
if(map.files.filter(m=>m.license==='CC-BY-NC-4.0').length!==11) errors.push('Expected 10 brand rasters plus one note data file');
if(map.files.filter(m=>m.license==='MIT').length!==9) errors.push('Expected 9 generic SVGs');
if(map.files.filter(m=>m.license==='LicenseRef-Bambu-Product-Images').length!==9)errors.push('Expected 9 separately attributed official product images');
if(!meta.official_image_sync || !meta.official_image_sync.public_source_inclusion_requested)errors.push('Official image inclusion must follow the owner request');
if(!notice.licenses['LicenseRef-Bambu-Product-Images'] || notice.licenses['LicenseRef-Bambu-Product-Images'].text!==fs.readFileSync(path.join(root,'LICENSES/Bambu-Product-Images.txt'),'utf8').replace(/\r\n/g,'\n'))errors.push('Third-party product-image notice missing or stale');
for(const name of fs.readdirSync(path.join(root,'web/assets'))){
  const source='web/assets/'+name;
  if(!map.files.some(m=>m.path===source))errors.push('Asset lacks per-file license coverage: '+source);
}
const audio=map.files.find(m=>m.path==='web/meow-data.js');
if(!audio||!audio.components.some(c=>c.license==='CC0-1.0'&&c.creator==='tuberatanka')) errors.push('Third-party CC0 exception missing');
if(notice.licenses.MIT.text!==mit||notice.licenses['CC-BY-NC-4.0'].text!==fs.readFileSync(path.join(root,'LICENSES/CC-BY-NC-4.0.txt'),'utf8')) errors.push('Runtime legal text stale');
if(notice.attribution.public_credit!==meta.public_credit||notice.attribution.xiaohongshu_profile_url!==meta.xiaohongshu_profile_url)errors.push('Attribution template stale');
if(!meta.public_credit) pending.push('PUBLIC_CREDIT: 最终公开署名待提供');
else if(mit.includes('[PUBLIC_ATTRIBUTION_PENDING]')||!mit.includes('Copyright (c) 2026 '+meta.public_credit)) errors.push('Copyright line not updated');
if(!meta.xiaohongshu_profile_url) optional.push('PROFILE_URL: 小红书主页链接未提供；使用已验证的GitHub账号及仓库来源署名');
else {try{const u=new URL(meta.xiaohongshu_profile_url);if(u.protocol!=='https:'||!['www.xiaohongshu.com','xiaohongshu.com'].includes(u.hostname)||!u.pathname.startsWith('/user/profile/'))errors.push('Expected supplied Xiaohongshu profile URL');}catch(_){errors.push('Invalid supplied profile URL');}}
if(meta.font_output_review.status==='excluded_from_public_source'&&meta.font_output_review.evidence){
  for(const f of meta.font_output_review.files){
    if(fs.existsSync(path.join(root,f))||map.files.some(m=>m.path===f))errors.push('Excluded raster still in public source: '+f);
  }
}else if(meta.font_output_review.status!=='verified_output_use'||!meta.font_output_review.evidence)pending.push('FONT_OUTPUT: 欢迎字层具体字体来源与输出使用复核待完成');
if(!meta.public_push_approved) pending.push('PUBLIC_PUSH: 实际公开推送尚未确认，本轮仅准备');
const tracked=child.spawnSync('git',['ls-files','-z'],{cwd:root,encoding:'utf8'});
if(tracked.status===0){
  const staged=tracked.stdout.split('\0').filter(Boolean);
  if(staged.some(f=>f.startsWith('skills/')))errors.push('Skill belongs in the separate bagel-printer-advisor repository');
  for(const f of staged)if(/^(?:private-assets|dist|output|node_modules|sources)\//.test(f)||/^web\/assets\/(?:welcome-hello|welcome-invite)\.png$/.test(f))errors.push('Private/generated file staged: '+f);
  for(const f of ['LICENSE','LICENSING.md','LICENSES/CC-BY-NC-4.0.txt','content/notes.json','licensing/asset-map.json','licensing/runtime-attribution.json','licensing/publication.json','scripts/preflight.cjs','scripts/update-license-notices.cjs'])if(!staged.includes(f))errors.push('Required source absent from Git index: '+f);
  for(const args of [['diff','--name-only'],['ls-files','--others','--exclude-standard']]){
    const drift=child.spawnSync('git',args,{cwd:root,encoding:'utf8'});
    if(drift.status!==0)errors.push('Cannot check source index drift');
    else if(drift.stdout.trim()) errors.push('Source changes not staged: '+drift.stdout.trim().split('\n').join(', '));
  }
}
else pending.push('GIT: 源码目录未初始化Git，导出后推送前需重新检查暂存文件');
const result={version:json('package.json').version,localPreparation:errors.length?'ERROR':'PASS',publication:errors.length?'ERROR':pending.length?'HOLD':'READY_FOR_PUSH',errors,pending,optional,remoteMutationPerformed:false};
console.log(JSON.stringify(result,null,2));
process.exitCode=errors.length?1:pending.length?2:0;
