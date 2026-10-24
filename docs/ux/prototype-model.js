/* Local, disposable UX simulation. This is not a backend or an access-control boundary. */
(function (scope) {
  'use strict';
  const NOW = Date.parse('2026-10-24T12:00:00Z'); // Fixed demo clock: 17:00 in the club zone.
  const ZONE = 'Asia/Almaty';
  const clubs = [
    { id:'arena', name:'Cyber Arena', address:'Mangilik El Avenue · Yesil', zone:'Pro arena', type:'PC', gpu:'RTX 4070', display:'240 Hz', rate:1500, count:24, prefix:'P', tags:'Mechanical keyboard' },
    { id:'level', name:'Level Up', address:'Turan Avenue · Nura', zone:'Console lounge', type:'Console', gpu:'PlayStation 5', display:'4K OLED', rate:1200, count:10, prefix:'C', tags:'DualSense' },
    { id:'gg', name:'GG Center', address:'Abay Avenue · Saryarka', zone:'Classic zone', type:'PC', gpu:'RTX 3070', display:'144 Hz', rate:1000, count:8, prefix:'G', tags:'Mechanical keyboard' }
  ];
  function slot(date='2026-10-24', time='18:00', duration=2) {
    const start = Date.parse(`${date}T${time}:00+05:00`);
    return { date, time, duration:Number(duration), start, end:start + Number(duration)*3600000 };
  }
  function overlaps(a,b) { return a.start < b.end && b.start < a.end; }
  function club(id) { return clubs.find(c=>c.id===id); }
  function stationIds(id) { const c=club(id); return c ? Array.from({length:c.count},(_,i)=>`${c.prefix}${String(i+1).padStart(2,'0')}`) : []; }
  function validate(id, interval) {
    if (!club(id)) return 'Choose an available club.';
    if (!interval || !/^\d{4}-\d{2}-\d{2}$/.test(interval.date) || !/^\d{2}:\d{2}$/.test(interval.time) || !Number.isFinite(interval.start) || !Number.isFinite(interval.end)) return 'Choose a valid date, start time and duration.';
    if (new Date(interval.start+5*3600000).toISOString().slice(0,10)!==interval.date) return 'Choose a valid calendar date.';
    if (!Number.isFinite(interval.duration) || interval.duration<1) return 'Choose at least 1 hour. This is the illustrative club minimum.';
    if (interval.start<=NOW) return 'Choose a start after the demo clock: October 24, 17:00.';
    const opens=Date.parse(`${interval.date}T08:00:00+05:00`);
    const closes=Date.parse(`${interval.date}T00:00:00+05:00`)+24*3600000;
    if (interval.start<opens || interval.end>closes) return 'This demo club is open 08:00–24:00. Choose an interval within opening hours.';
    return '';
  }
  function createDemo() {
    const state={ bookings:[], maintenance:[], operations:new Map(), nextId:1043 };
    const initial=slot();
    const busy={arena:[4,8,13,17,19,22],level:[2,6,9],gg:[2,3,4,6,7,8]};
    const offline={arena:[7,11,15,18,21,24],level:[],gg:[]};
    for (const c of clubs) {
      for (const n of busy[c.id]) state.bookings.push({id:c.id==='arena'&&n===4?'CS-1042':`DEMO-${c.id}-${n}`,club:c.id,station:`${c.prefix}${String(n).padStart(2,'0')}`,owner:c.id==='arena'&&n===4?'demo-visitor':'demo-other',status:'CONFIRMED',...initial});
      for (const n of offline[c.id]) state.maintenance.push({club:c.id,station:`${c.prefix}${String(n).padStart(2,'0')}`,start:Date.parse('2026-10-23T19:00:00Z'),end:Date.parse('2026-10-24T19:00:00Z'),reason:'Scheduled equipment service'});
    }
    function stations(id, interval) {
      return stationIds(id).map(station=>({id:station,status:state.maintenance.some(b=>b.club===id&&b.station===station&&overlaps(b,interval))?'unavailable':state.bookings.some(b=>b.club===id&&b.station===station&&b.status==='CONFIRMED'&&overlaps(b,interval))?'reserved':'available'}));
    }
    function reserve(id, station, interval, key) {
      const fingerprint=JSON.stringify([id,station,interval.start,interval.end]);
      const previous=state.operations.get(key);
      if (previous) return previous.fingerprint===fingerprint?{ok:true,booking:previous.booking,replay:true}:{ok:false,code:'operation-conflict',message:'This operation already belongs to a different selection.'};
      const error=validate(id,interval);
      if (error) return {ok:false,code:'validation',message:error};
      const selected=stations(id,interval).find(s=>s.id===station);
      if (!selected || selected.status!=='available') return {ok:false,code:'conflict',message:'This station is no longer available for the selected interval.'};
      const booking={id:`CS-${state.nextId++}`,club:id,station,owner:'demo-visitor',status:'CONFIRMED',...interval};
      state.bookings.push(booking); state.operations.set(key,{fingerprint,booking});
      return {ok:true,booking,replay:false};
    }
    function cancel(id) {
      const booking=state.bookings.find(b=>b.id===id&&b.owner==='demo-visitor');
      if (!booking) return {ok:false,message:'This reservation is not available in your account.'};
      if (booking.status==='CANCELLED') return {ok:true,booking};
      if (booking.start<=NOW) return {ok:false,message:'The session has started. Contact the club for assistance.'};
      booking.status='CANCELLED'; return {ok:true,booking};
    }
    function block(id, station, interval, reason) {
      if (id!=='arena') return {ok:false,message:'This demo administrator is assigned to Cyber Arena only.'};
      const error=validate(id,interval);
      if (error) return {ok:false,message:error};
      if (!stationIds(id).includes(station)) return {ok:false,message:'Choose a station belonging to this club.'};
      if (!reason.trim()) return {ok:false,message:'Add a maintenance reason.'};
      if (state.bookings.some(b=>b.club===id&&b.station===station&&b.status==='CONFIRMED'&&overlaps(b,interval))) return {ok:false,message:'A confirmed booking overlaps this interval. No block was saved; the reservation remains unchanged.'};
      if (state.maintenance.some(b=>b.club===id&&b.station===station&&overlaps(b,interval))) return {ok:false,message:'This interval is already blocked. Choose another interval.'};
      state.maintenance.push({club:id,station,...interval,reason:reason.trim()}); return {ok:true};
    }
    return {state,stations,reserve,cancel,block,own:()=>state.bookings.filter(b=>b.owner==='demo-visitor'),operation:key=>state.operations.get(key)?.booking};
  }
  const api={NOW,ZONE,clubs,club,slot,overlaps,stationIds,validate,createDemo};
  if (typeof module!=='undefined'&&module.exports) module.exports=api;
  else scope.CyberSeatDemo=api;
})(typeof window!=='undefined'?window:globalThis);
