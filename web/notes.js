// SPDX-License-Identifier: MIT
(function(root){
  'use strict';
  var content=typeof module!=='undefined'&&module.exports?require('../content/notes.json'):root.BagelNoteContent;
  if(!content||!Array.isArray(content.list))throw Error('Load note-content.js before notes.js');
  var api={account:content.account,guide:content.guide,boundary:content.boundary,list:content.list,find:function(id){return api.list.filter(function(n){return n.id===id;})[0];}};
  root.BagelNotes=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
}(typeof window!=='undefined'?window:typeof global!=='undefined'?global:this));
