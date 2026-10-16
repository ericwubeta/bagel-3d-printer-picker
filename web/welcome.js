/* Approved Bagel keyposes at .75 speed, with a brief open-mouth hold for sound E. */
(function(root){
  'use strict';
  var state=null,audioContext=null,audioBuffer=null,soundOff=false,lastSound='idle';
  var speed=.75,baseDuration=8/3,holdStart=31/18,holdDuration=.75;
  var duration=baseDuration+holdDuration,soundStart=1.52;
  var schedule=[[0,0],[4,1],[6,2],[9,3],[12,4],[15,3],[18,4],[21,2],[24,1],[27,5],[31,6],[38,5],[42,7]];
  function reduced(){return !!(root.matchMedia&&root.matchMedia('(prefers-reduced-motion: reduce)').matches);}
  function stopSound(reason){
    if(!state||!state.sound)return;
    var node=state.sound,gain=state.soundGain;state.sound=null;state.soundGain=null;
    node.onended=null;
    try{node.stop();}catch(e){}
    try{node.disconnect();if(gain)gain.disconnect();}catch(e){}
    lastSound=reason||'stopped';
  }
  function dispose(){if(!state)return;state.dead=true;state.playId++;root.cancelAnimationFrame(state.raf);stopSound('stopped');state=null;}
  function load(file){return new Promise(function(resolve,reject){var img=new Image();img.onload=function(){resolve(img);};img.onerror=reject;img.src='./assets/'+file;});}
  function prepareAudio(){
    try{
      var C=root.AudioContext||root.webkitAudioContext;
      if(!C||!root.BagelMeowData)return {ready:false,error:'unavailable'};
      if(!audioContext)audioContext=new C();
      if(!audioBuffer){
        var d=root.BagelMeowData,raw=root.atob(d.base64);
        audioBuffer=audioContext.createBuffer(1,raw.length/2,d.sampleRate);
        var channel=audioBuffer.getChannelData(0);
        for(var i=0;i<channel.length;i++){var n=raw.charCodeAt(i*2)|(raw.charCodeAt(i*2+1)<<8);channel[i]=(n>=32768?n-65536:n)/32768;}
      }
      if(audioContext.state==='suspended')return {pending:Promise.resolve(audioContext.resume()).then(function(){return audioContext.state==='running';})};
      return {ready:audioContext.state==='running',error:'blocked'};
    }catch(e){return {ready:false,error:'unavailable'};}
  }
  function playSound(s,playId,delay){
    if(soundOff||!audioContext||!audioBuffer||state!==s||s.playId!==playId)return;
    try{
      var node=audioContext.createBufferSource(),gain=audioContext.createGain();
      node.buffer=audioBuffer;gain.gain.value=.85;node.connect(gain);gain.connect(audioContext.destination);
      s.sound=node;s.soundGain=gain;
      node.onended=function(){
        if(state!==s||s.dead||s.playId!==playId||s.sound!==node)return;
        s.sound=null;s.soundGain=null;node.disconnect();gain.disconnect();lastSound='ended';
      };
      node.start(audioContext.currentTime+delay);lastSound='scheduled';
    }catch(e){stopSound('blocked');lastSound='blocked';}
  }
  function mount(canvas){
    dispose();var ctx=null;try{ctx=canvas.getContext('2d');}catch(e){}
    if(!ctx)return false;
    var current={canvas:canvas,ctx:ctx,frames:[],ready:false,dead:false,raf:0,sound:null,soundGain:null,started:0,playId:0,elapsed:0,pose:0};state=current;
    Promise.all(Array.from({length:8},function(_,i){return load('welcome-pose-'+i+'.png');})).then(function(images){
      if(current.dead)return;current.frames=images;current.ready=true;if(reduced())draw(duration);else play(false);
    }).catch(function(){if(!current.dead){canvas.hidden=true;var fallback=document.getElementById('welcome-fallback');if(fallback)fallback.hidden=false;}});
    return true;
  }
  // Device-native lettering: no font binaries or pre-rendered third-party glyphs ship.
  function lettering(ctx,hello){
    ctx.save();ctx.textAlign='center';ctx.textBaseline='alphabetic';
    var gradient=ctx.createLinearGradient(100,25,535,220);
    gradient.addColorStop(0,'#2148BD');gradient.addColorStop(.58,'#3277B5');gradient.addColorStop(1,'#6663B4');ctx.fillStyle=gradient;
    if(hello){
      ctx.font='italic 700 96px serif';ctx.fillText('Hello!',322,128,576);
      ctx.font='700 58px sans-serif';ctx.fillText('欢迎光临！',322,219,576);
      ctx.strokeStyle='#91AFE4';ctx.lineWidth=4;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(209,153);ctx.bezierCurveTo(271,159,344,150,411,154);ctx.stroke();
    }else{
      ctx.font='700 58px sans-serif';ctx.fillText('一起来选',322,113,576);
      ctx.font='700 64px sans-serif';ctx.fillText('3D 打印机吧！',322,214,576);
    }
    ctx.restore();
  }
  function draw(time){
    if(!state||!state.ready)return;
    var s=state,mapped=time<=holdStart?time:time<=holdStart+holdDuration?holdStart:time-holdDuration;
    var originalFrame=Math.min(47,Math.floor(mapped*speed*24+1e-7)),cell=0;
    schedule.forEach(function(k){if(originalFrame>=k[0])cell=k[1];});
    s.elapsed=time;s.pose=cell;s.ctx.globalAlpha=1;s.ctx.fillStyle='#fff';s.ctx.fillRect(0,0,644,1272);s.ctx.drawImage(s.frames[cell],0,0,644,1272);
    if(time<.94){s.ctx.globalAlpha=Math.min(1,time/.10,Math.max(0,(.94-time)/.12));lettering(s.ctx,true);}
    else{s.ctx.globalAlpha=Math.min(1,(time-.94)/.12);lettering(s.ctx,false);}
    s.ctx.globalAlpha=1;
  }
  function play(withSound){
    if(!state||!state.ready)return false;
    root.cancelAnimationFrame(state.raf);stopSound('stopped');var s=state,playId=++s.playId;
    function valid(){return state===s&&!s.dead&&s.playId===playId;}
    function begin(audioReady,error){
      if(!valid())return;
      s.started=performance.now();
      if(withSound&&!soundOff){if(audioReady)playSound(s,playId,reduced()?0:soundStart);else lastSound=error||'blocked';}
      else if(withSound)lastSound='muted';
      if(reduced()){draw(duration);return;}
      draw(0);
      function frame(now){if(!valid())return;var t=(now-s.started)/1000;draw(Math.min(t,duration));if(t<duration)s.raf=root.requestAnimationFrame(frame);}
      s.raf=root.requestAnimationFrame(frame);
    }
    if(withSound&&!soundOff){
      var audio=prepareAudio();
      if(audio.pending){lastSound='unlocking';audio.pending.then(function(ok){begin(ok,'blocked');},function(){begin(false,'blocked');});}
      else begin(audio.ready,audio.error);
    }else begin(false);
    return true;
  }
  function mute(){soundOff=!soundOff;if(soundOff)stopSound('muted');return soundOff;}
  document.addEventListener('visibilitychange',function(){if(document.hidden&&state){state.playId++;root.cancelAnimationFrame(state.raf);stopSound('stopped');draw(duration);}});
  root.BagelWelcome={mount:mount,play:play,dispose:dispose,mute:mute,isMuted:function(){return soundOff;},status:function(){
    return {ready:!!(state&&state.ready),sound:lastSound,muted:soundOff,originalSpeed:speed,elapsed:state?state.elapsed:0,poseIndex:state?state.pose:null,timeline:{duration:duration,baseDuration:baseDuration,holdStart:holdStart,holdDuration:holdDuration,holdPose:6,soundStart:soundStart,soundDuration:root.BagelMeowData?root.BagelMeowData.duration:0,mouthOpenStart:1.5,mouthOpenEnd:7/3+holdDuration}};
  }};
}(window));
