(function (root) {
  'use strict';
  var all = [
    {key:'purpose',short:'用途',title:'最想先打点什么？',hint:'挑一个最接近的就好。以后想打别的，还可以重新选。',pose:0,options:[
      {value:'small',label:'小摆件、小玩具',note:'先打点喜欢的小东西',icon:'toy',reply:'小摆件也可以用高配来打。空间和预算合适，就一起比较更多机型。'},
      {value:'home',label:'家里的实用小物',note:'收纳盒、支架、小配件',icon:'box',reply:'把常用项目说清楚，会更好比较同一预算内的机型。'},
      {value:'large',label:'大摆件、头盔一类',note:'希望尽量少拆件拼装',icon:'helmet',reply:'大件会更在意打印空间。先看大概大小，买前还要量具体模型。'},
      {value:'soft',label:'软的配件',note:'要能弯、能捏的那种',icon:'soft-case',reply:'软的配件先看具体耗材和送料兼容性，不用因为它是软的就默认买封闭机器。'},
      {value:'functional',label:'耐热、受力的零件',note:'有明确性能要求',icon:'gear',reply:'这类用途还得核具体材料和使用条件。我先给机型方向，材料细节放到后面看。'},
      {value:'unknown',label:'还没想好，先看看',note:'不用现在就确定项目',icon:'wonder',reply:'没关系。先按空间和预算比较，想好第一件作品后再核具体要求。'}
    ]},
    {key:'size',short:'大小',title:'第一件，大概有多大？',hint:'只凭感觉选。每件东西都要分别看长、宽、高。',pose:2,options:[
      {value:'small',label:'可乐罐这类小物',note:'常见330mL罐：高约12cm',icon:'can',reply:'先按小物方向看。可乐罐只是类比，机器能不能放下，要看模型的长、宽、高。'},
      {value:'medium',label:'手机长度的物件',note:'长度约15cm；高度另看',icon:'phone',reply:'像手机那么长，不等于手机那么薄。实际的宽度和高度，买前一起确认。'},
      {value:'large',label:'更长、更高的大件',note:'有一边可能超过18cm',icon:'large-box',reply:'我会先看更大的打印空间。头盔等大件也可能要拆件，别只比一条边。'},
      {value:'unknown',label:'现在还说不准',note:'先看方向，后面量模型',icon:'ruler',reply:'那就不把尺寸当作已确认。先看看两台的取舍，之后拿模型核长、宽、高。'}
    ]},
    {key:'color',short:'颜色',title:'想要哪种颜色效果？',hint:'下面是同一块名牌的做法示意，点一个试试。',pose:0,options:[
      {value:'single',label:'一次用一种颜色',note:'这次打蓝色，下次换白色',icon:'mono',reply:'单色也能换颜色，只是同一次先用一种。这样不用一开始就买自动换色设备。'},
      {value:'auto',label:'同一个作品，自动换色',note:'比如蓝底、白字一起打',icon:'auto',reply:'你想让机器在打印中自动换色。要搭配对应设备，也会多花一些时间和耗材。'},
      {value:'diy',label:'分开打，再拼或上色',note:'自己组装，或打印后涂色',icon:'diy',reply:'也可以不同颜色分开打、再拼起来，或自己涂色。先不用默认买自动换色设备。'},
      {value:'unknown',label:'先单色试试，再说',note:'给以后留一个比较入口',icon:'later',reply:'那就先按单色入门。以后想自动换色，再核对应配件和整套费用。'}
    ]},
    {key:'place',short:'位置',title:'准备把打印机放在哪里？',hint:'先选房间。独立卧室选“卧室”，平时办公的房间选“书房”；台面大小买前再量。',pose:3,options:[
      {value:'separate',label:'独立机器房间',note:'专门给机器用的房间',icon:'room-separate',reply:'有独立位置，比较方便安排。桌面和通风还要一起看。'},
      {value:'living',label:'客厅',note:'家人经常活动的地方',icon:'room-living',reply:'家人经常在这里，我们也把通风、声音和靠近机器的情况一起考虑。'},
      {value:'balcony',label:'阳台',note:'先看是否适合长期放电器',icon:'room-balcony',reply:'阳台要先看雨水、日晒和温湿度条件，不能只看有空位。'},
      {value:'bedroom',label:'卧室',note:'睡觉休息的房间',icon:'room-bedroom',reply:'不建议放在卧室。先换个不睡觉的位置，再比较机型。'},
      {value:'study',label:'书房',note:'经常工作、学习的地方',icon:'room-study',reply:'如果经常在这里工作，打印时段、通风和声音也要提前安排。'},
      {value:'unknown',label:'还没定',note:'先看看机型方向',icon:'room-unknown',reply:'先看机型方向，买前再帮它找个合适位置。'}
    ]},
    {key:'budget',short:'预算',title:'打算花多少钱开始？',hint:'想的是一整套：机器、需要的换色设备和第一批耗材。',pose:2,priceHelp:true,options:[
      {value:'under2',label:'2,000元以内',note:'先控制入坑花费',icon:'budget-1',reply:'先看低门槛机型。618记录只能帮你估方向，整套是否超预算还要看当次报价。'},
      {value:'2to4',label:'2,000～4,000元',note:'在空间和体验间取舍',icon:'budget-2',reply:'这个范围先比较常规尺寸的封闭路线，再看配置取舍。历史套装价不等于现在的成交价。'},
      {value:'4to8',label:'4,000～8,000元',note:'在这个预算里比较更多能力',icon:'budget-3',reply:'这个预算可以把X、H路线纳入比较。接近上限的套餐，还要留意耗材和摆放费用。'},
      {value:'over8',label:'8,000元以上',note:'也想看看高配',icon:'budget-4',reply:'可以一起比较H等高配路线。还要核你真正愿意花的上限，不能把“8千以上”当成无限预算。'},
      {value:'unknown',label:'还没定，先看参考价',note:'先看近期与历史参考',icon:'wonder',reply:'先看近期反馈和618历史参考，分清单机与套装。拿到自己的完整报价后，再决定预算。'}
    ]}
  ];
  var order=['place','budget','size','purpose','color'];
  all.sort(function(a,b){return order.indexOf(a.key)-order.indexOf(b.key);});
  var api={all:all,find:function(key){return all.filter(function(q){return q.key===key;})[0];},option:function(key,value){var q=api.find(key);return q&&q.options.filter(function(o){return o.value===value;})[0];}};
  root.BagelQuestions=api;
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
}(typeof window!=='undefined'?window:typeof global!=='undefined'?global:this));
