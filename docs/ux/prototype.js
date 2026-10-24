/* Browser-only interaction for the ECR-9 design prototype. No network or storage. */
(function () {
  'use strict';
  const M=window.CyberSeatDemo, demo=M.createDemo();
  const $=id=>document.getElementById(id);
  const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const paths={
    grid:'M3 3h7v7H3z M14 3h7v7h-7z M3 14h7v7H3z M14 14h7v7h-7z',
    ticket:'M4 5h16v5a2 2 0 0 0 0 4v5H4v-5a2 2 0 0 0 0-4z M15 5v3 M15 11v2 M15 16v3',
    calendar:'M7 3v4 M17 3v4 M4 10h16 M5 5h14a1 1 0 0 1 1 1v14H4V6a1 1 0 0 1 1-1 M8 14h2 M14 14h2',
    monitor:'M3 4h18v13H3z M8 21h8 M12 17v4',
    chart:'M4 3v18h17 M8 16v-4 M13 16V8 M18 16V5',
    layers:'M12 3 2 8l10 5 10-5z M2 12l10 5 10-5 M2 16l10 5 10-5',
    pin:'M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 1 1 14 0 M12 7a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
    clock:'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18 M12 7v5l3 2',
    search:'M10 3a7 7 0 1 0 0 14 7 7 0 1 0 0-14 M15 15l6 6',
    arrow:'M4 12h15 M14 6l6 6-6 6',
    back:'M20 12H5 M10 6l-6 6 6 6',
    check:'m5 12 4 4L19 6',
    shield:'m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z m-4 9 3 3 5-6',
    users:'M9 4a3 3 0 1 0 0 6 3 3 0 1 0 0-6 M3 20v-3a6 6 0 0 1 12 0v3 M17 4a3 3 0 0 1 0 6 M18 14a5 5 0 0 1 3 4v2',
    bolt:'m13 2-8 12h6l-1 8 9-13h-7z',
    close:'m6 6 12 12 M18 6 6 18',
    help:'M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18 M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4 M12 16v.1',
    menu:'M4 6h16 M4 12h16 M4 18h16',
    sort:'M4 7h16 M7 12h10 M10 17h4',
    wifi:'M3 8a15 15 0 0 1 18 0 M6 12a10 10 0 0 1 12 0 M9 16a5 5 0 0 1 6 0 M12 20v.1',
    alert:'m12 3 10 18H2z M12 9v5 M12 17v.1',
    settings:'M4 7h16 M4 17h16 M8 4v6 M16 14v6',
    'arrow-up-right':'M6 18 18 6 M6 6h12v12'
  };
  const I=name=>`<svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="${paths[name]||paths.grid}"></path></svg>`;
  const image='assets/gaming-lounge.png';
  const money=value=>`₸${Number(value).toLocaleString('en-US')}`;
  const dateLabel=date=>new Intl.DateTimeFormat('en-GB',{day:'numeric',month:'short',year:'numeric',timeZone:M.ZONE}).format(new Date(`${date}T12:00:00+05:00`));
  const endTime=s=>new Intl.DateTimeFormat('en-GB',{hour:'2-digit',minute:'2-digit',hourCycle:'h23',timeZone:M.ZONE}).format(s.end);
  const zone='Asia/Almaty (UTC+05:00)';
  let view='discover', filter={query:'',type:'All',date:'2026-10-24',time:'18:00',duration:2};
  let booking=null, operationCounter=1, pendingTimer=null, searchTimer=null, toastTimer=null;
  let bookingReturn=null, detailReturn=null, navigationReturn=null;
  const navItems=[['discover','grid','Discover'],['bookings','ticket','My bookings'],['events','calendar','Events'],['schedule','monitor','Club schedule'],['insights','chart','Insights'],['states','layers','Interface states']];
  function button(label,action,style='',attrs='') { return `<button type="button" class="btn ${style}" data-action="${action}" ${attrs}>${label}</button>`; }
  function notice(title,text,type='',icon='help') { return `<div class="notice ${type}">${I(icon)}<div><strong>${title}</strong>${text}</div></div>`; }
  function heading(kicker,title,subtitle,extra='') { return `<div class="page-heading"><div><div class="page-eyebrow"><span></span>${kicker}</div><h1>${title}</h1><p class="subtitle">${subtitle}</p></div>${extra}</div>`; }
  function navMarkup(mobile=false) {
    const items=mobile?navItems.slice(0,3):navItems;
    return items.map(([id,icon,label],i)=>`${!mobile&&i===3?'<div class="nav-label">CLUB STUDIO · DEMO ROLE</div>':''}<button class="${mobile?'':'nav-item'}" data-action="nav" data-view="${id}" ${view===id?'aria-current="page"':''}>${I(icon)}<span>${label}</span>${!mobile&&id==='bookings'?`<span class="nav-count">${demo.own().filter(b=>b.status==='CONFIRMED').length}</span>`:''}</button>`).join('')+(mobile?`<button data-action="mobile-menu">${I('menu')}<span>More</span></button>`:'');
  }
  function updateNav() { $('desktop-nav').innerHTML=navMarkup(); $('mobile-nav').innerHTML=navMarkup(true); $('breadcrumb-current').textContent=navItems.find(i=>i[0]===view)[2]; }
  function announce(text) { $('announcer').textContent=text; }
  function toast(text) { clearTimeout(toastTimer); $('toast').textContent=text; $('toast').classList.add('show'); toastTimer=setTimeout(()=>$('toast').classList.remove('show'),3500); }
  function navigate(next,focus=true) {
    if (!navItems.some(i=>i[0]===next)) next='discover';
    clearTimeout(searchTimer); view=next; updateNav();
    $('main').innerHTML=({discover:discoverView,bookings:bookingsView,events:eventsView,schedule:scheduleView,insights:insightsView,states:statesView}[view])();
    if (view==='discover') renderClubs();
    if (focus) { $('main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'}); }
    announce(`${navItems.find(i=>i[0]===view)[2]} page`);
  }
  function searchForm() {
    return `<form class="search-form" id="search-form" novalidate>
      <div class="search-field">${I('search')}<label><span>CLUB OR NEIGHBOURHOOD</span><input id="club-query" name="query" placeholder="Explore Astana" value="${esc(filter.query)}" autocomplete="off" aria-label="Club or neighbourhood"></label></div>
      <div class="search-field">${I('calendar')}<label><span>WHEN</span><input type="date" id="visit-date" name="date" min="2026-10-24" value="${esc(filter.date)}" aria-label="Visit date" aria-describedby="search-error"></label></div>
      <div class="search-field">${I('clock')}<label><span>START TIME</span><select id="visit-time" name="time" aria-label="Start time">${Array.from({length:16},(_,i)=>`${String(i+8).padStart(2,'0')}:00`).map(t=>`<option ${t===filter.time?'selected':''}>${t}</option>`).join('')}</select></label></div>
      <div class="search-field">${I('bolt')}<label><span>PLAY FOR</span><select id="visit-duration" name="duration" aria-label="Session duration">${[1,2,3,4].map(d=>`<option value="${d}" ${d===filter.duration?'selected':''}>${d} hour${d>1?'s':''}</option>`).join('')}</select></label></div>
      <button type="submit" class="btn">Find a spot ${I('arrow')}</button>
    </form><div id="search-error" class="form-error" role="alert" hidden></div>`;
  }
  function discoverView() {
    return heading('Make time for play','Find your next spot.','The right setup. The right people. Your kind of game.',`<button class="text-button" data-action="guide">How it works ${I('arrow-up-right')}</button>`)+`
      <section class="hero" aria-label="Discover gaming clubs"><img class="hero-photo" src="${image}" alt="Violet-lit gaming lounge with high-performance PC stations"><div class="hero-content"><div class="hero-kicker">A better place to play</div><h2>Good games.<br><em>Great company.</em></h2><p>Your next session deserves a great setup.<br>Discover gaming clubs and make it yours.</p>${button(`Find my station ${I('arrow')}`,'hero-search')}</div><div class="hero-stamp">${I('monitor')}<span><strong>Built for your next session</strong><small>PC arenas & console lounges</small></span></div></section>
      ${searchForm()}
      <section aria-labelledby="clubs-title"><div class="section-heading"><h2 id="clubs-title">Places to play</h2><span class="count" id="club-count">3 clubs</span><button class="text-button" data-action="reset-filters">Reset filters ${I('arrow-up-right')}</button></div><div class="catalogue-toolbar"><div class="segmented" aria-label="Station type">${['All','PC','Console'].map(t=>`<button data-action="filter-type" data-type="${t}" aria-pressed="${filter.type===t}">${t==='All'?'All spaces':t}</button>`).join('')}</div><span class="sort-note">${I('sort')}Curated for your session</span></div><div id="club-results" aria-live="polite"></div></section>
      <div class="support-strip">${[['shield','Your spot, clearly confirmed','A reservation ID after confirmation.'],['users','Keep your squad close','Choose a seat near your friends.'],['clock','Plans changed? No problem.','Cancel before your session starts.']].map(([i,t,p])=>`<div class="support-item"><div class="support-icon">${I(i)}</div><div><strong>${t}</strong><p>${p}</p></div></div>`).join('')}</div>`;
  }
  function readFilter() {
    if (!$('search-form')) return;
    filter={...filter,query:$('club-query').value,date:$('visit-date').value,time:$('visit-time').value,duration:Number($('visit-duration').value)};
  }
  function currentSlot() { return M.slot(filter.date,filter.time,filter.duration); }
  function renderClubs() {
    const interval=currentSlot(), error=M.validate('arena',interval);
    $('search-error').hidden=!error; $('search-error').textContent=error;
    for (const id of ['visit-date','visit-time','visit-duration']) $(id).setAttribute('aria-invalid',String(!!error));
    const matches=M.clubs.filter(c=>(filter.type==='All'||c.type===filter.type)&&`${c.name} ${c.address} ${c.gpu}`.toLowerCase().includes(filter.query.trim().toLowerCase()));
    $('club-count').textContent=`${matches.length} club${matches.length===1?'':'s'}`;
    if (error) { $('club-results').innerHTML=empty('Choose a valid session',esc(error),'clock','Edit session','edit-search'); return; }
    $('club-results').innerHTML=matches.length?`<div class="venue-grid">${matches.map(c=>{
      const free=demo.stations(c.id,interval).filter(s=>s.status==='available').length;
      return `<article class="venue-card"><div class="venue-image"><img src="${image}" alt="" loading="lazy"><span class="venue-type">${c.type==='PC'?'PC GAMING':'CONSOLE LOUNGE'}</span><span class="venue-zone">${I('monitor')}${c.zone}</span></div><div class="venue-body"><div class="venue-title-row"><h3>${c.name}</h3><span class="availability ${free<4?'limited':''}">${free?`${free} available`:'Fully booked'}</span></div><p class="venue-address">${I('pin')}${c.address}</p><div class="specs"><span class="spec">${I('bolt')}${c.gpu}</span><span class="spec">${I('monitor')}${c.display}</span><span class="spec">${c.type==='PC'?'Pro peripherals':'DualSense'}</span></div><div class="venue-bottom"><span class="price">${money(c.rate)}<small> / hour</small></span>${button(`Choose a spot ${I('arrow-up-right')}`,'open-booking','',`data-club="${c.id}" ${free?'':'disabled'}`)}</div></div></article>`;
    }).join('')}</div>`:empty('No matching spaces','Try another club name, neighbourhood or station type.','search','Clear filters','reset-filters');
  }
  function empty(title,text,icon,label,action) { return `<div class="empty-state">${I(icon)}<h3>${title}</h3><p>${text}</p>${label?button(label,action,'secondary'):''}</div>`; }
  function bookingRecord(b) {
    const c=M.club(b.club), cancelled=b.status==='CANCELLED';
    return `<article class="panel booking-record"><img class="booking-record-image" src="${image}" alt=""><div><span class="status ${cancelled?'muted':''}">${cancelled?'Cancelled':'Confirmed'}</span><h3>${c.name} <span style="color:var(--muted);font-weight:400">/ ${b.station}</span></h3><div class="booking-meta"><span>${I('calendar')}${dateLabel(b.date)}</span><span>${I('clock')}${b.time}–${endTime(b)}</span><span>${money(c.rate*b.duration)}</span></div><p class="fine-print">${zone}</p></div><div class="booking-actions"><span class="record-id">${esc(b.id)}</span>${button('View details','booking-details','quiet',`data-id="${esc(b.id)}"`)}${!cancelled?button('Cancel booking','cancel-booking','quiet',`data-id="${esc(b.id)}"`):''}</div></article>`;
  }
  function bookingsView() {
    const own=demo.own(), upcoming=own.filter(b=>b.status==='CONFIRMED'&&b.end>M.NOW), history=own.filter(b=>b.status==='CANCELLED'||b.end<=M.NOW);
    return heading('Your next session','Your plans. All in one place.','Your confirmed spots and a little room for the next one.',button('Explore clubs ↗','discover','secondary'))+`
      <div class="section-heading"><h2>Upcoming</h2><span class="count">${upcoming.length}</span></div><div class="stack">${upcoming.length?upcoming.map(bookingRecord).join(''):empty('Your next session is waiting','Find a club, pick a station and make some plans.','ticket','Find a spot','discover')}</div>
      <div class="section-heading section-gap"><h2>History</h2><span class="count">${history.length}</span></div><div class="stack">${history.length?history.map(bookingRecord).join(''):empty('A fresh start','Completed and cancelled reservations will stay here.','clock','','')}</div><p class="fine-print">Demo account only. Changes last until this page is reloaded. Cancellation is available before the session starts; no fee or refund is modelled.</p>`;
  }
  const events=[{id:'strike',name:'Weekend<br>Strike Cup',title:'Weekend Strike Cup',game:'CS2 · TOURNAMENT',date:'2026-10-26',time:'12:00',club:'Cyber Arena',text:'A day of close rounds, big plays and good company. Club-published event · 16 teams.'},{id:'mix',name:'Friday<br>Night Mix',title:'Friday Night Mix',game:'VALORANT · COMMUNITY',date:'2026-10-30',time:'19:00',club:'Level Up',text:'Meet the local community and settle in for the evening. Club-published informational event.'}];
  function eventsView() {
    return heading('On the calendar','Less scrolling. More playing.','A few good reasons to get the squad together.')+`<div class="event-grid">${events.map((e,i)=>`<article class="event-card"><div class="event-art ${i?'violet':''}"><span class="small-kicker">${e.game}</span><h2>${e.name}</h2></div><div class="event-body"><span class="event-date">${I('calendar')}${dateLabel(e.date)} · ${e.time}</span><p>${e.club} · ${zone}<br>${e.text}</p>${button('Explore event ↗','event','secondary',`data-id="${e.id}"`)}</div></article>`).join('')}</div><p class="fine-print">Events are informational. Participation, registration and payment are handled by the organiser outside this prototype.</p>`;
  }
  function scheduleView() {
    const hours=[16,17,18,19,20,21];
    return heading('Club studio','A clear view of your floor.','Assigned club: Cyber Arena · October 24, 2026 · '+zone,button(`${I('settings')} Block interval`,'maintenance'))+`
      <div class="panel"><div class="section-heading"><h2>Station schedule</h2><span class="status purple">Club administrator · demo</span></div><div class="schedule-wrap"><table class="schedule"><caption class="sr-only">Cyber Arena station schedule on October 24, in Asia/Almaty time</caption><thead><tr><th scope="col">Station</th>${hours.map(h=>`<th scope="col">${h}:00</th>`).join('')}</tr></thead><tbody>${['P01','P02','P03','P04','P07','P08'].map(station=>`<tr><th scope="row">${station}</th>${hours.map(h=>{const s=demo.stations('arena',M.slot('2026-10-24',`${h}:00`,1)).find(s=>s.id===station);return `<td class="${s.status==='reserved'?'booked':s.status==='unavailable'?'maintenance':'open'}">${s.status==='reserved'?'Reserved':s.status==='unavailable'?'Maintenance':'Available'}</td>`;}).join('')}</tr>`).join('')}</tbody></table></div><div class="legend section-gap"><span><i></i>Available</span><span><i class="busy-key"></i>Reserved</span><span><i class="offline-key"></i>Maintenance / unavailable</span></div></div><div class="section-gap">${notice('Protect the sessions already booked','Maintenance must not overwrite a confirmed reservation. Try blocking P04 from 18:00 to 19:00 to explore the conflict.','', 'shield')}</div><p class="fine-print">The studio demonstrates an assigned-club role. Actual authentication and server-side permissions are not implemented.</p>`;
  }
  function insightsView() {
    const values=[52,66,61,79,92,100,76];
    return heading('Club studio','See the bigger picture.','Cyber Arena · Illustrative report · Oct 1 00:00–Oct 24 00:00, 2026 (end exclusive)')+`
      <div class="metrics">${[['Reservations','184','175 confirmed + 9 cancelled','ticket'],['Scheduled utilisation','71%','Illustrative period total · Oct 1–23','chart'],['Cancellations','9','9 / 184 = 4.89%','clock']].map(([t,v,n,i])=>`<div class="metric"><div class="metric-top">${t}${I(i)}</div><div class="metric-value">${v}</div><div class="metric-note">${n}</div></div>`).join('')}</div>
      <div class="dashboard-grid"><section class="panel"><div class="section-heading"><h2>Daily utilisation</h2><span class="status purple">Illustrative week</span></div><div class="chart" role="img" aria-label="Illustrative daily utilisation: Monday 52%, Tuesday 66%, Wednesday 61%, Thursday 79%, Friday 92%, Saturday 100%, Sunday 76%">${values.map((v,i)=>`<div class="chart-col"><b>${v}%</b><div class="chart-bar" style="height:${v*1.5}px"></div><span>${['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}</span></div>`).join('')}</div><p class="formula">The chart is an example week, separate from the period total. All values are design fixtures.</p></section><section class="panel"><div class="section-heading"><h2>What the numbers mean</h2></div><p class="formula"><strong>Scheduled utilisation</strong><br>Confirmed occupied station-minutes divided by available station-minutes after maintenance, multiplied by 100.</p><p class="formula">Cancelled bookings are excluded from occupied minutes. Time is clipped to the selected period in ${zone}.</p>${notice('Designed, not measured','These figures do not represent real users, attendance, revenue or executed experiments.','','chart')}</section></div>`;
  }
  function statesView() {
    const states=[['loading','Loading','A pending request is different from an empty result. Your selection stays in place.','clock'],['empty','No matching spaces','Helpful empty results invite you to change the filters.','search'],['validation','Invalid time','Field errors explain what needs to change before continuing.','alert'],['conflict','Station just taken','Choose another station or time. A conflicting reservation is not created.','users'],['offline','Offline before sending','Nothing was sent. Keep the selection and refresh availability after reconnecting.','wifi'],['unknown','Response not received','The outcome is unknown. Check the same operation before submitting again.','help'],['server','Temporary server failure','A failed request offers a retry and a readable reference.','monitor'],['session','Session expired','Sign in again, then recheck availability before confirming.','shield'],['normal','You’re booked','A clear reservation identifier and a next step to your bookings.','check']];
    return heading('Every state matters','No dead ends. Just a next step.','Explore the exceptional states without changing your browser connection.')+`<div class="state-grid">${states.map(([id,t,p,i])=>`<article class="state-card">${id==='loading'?'<div class="spinner" aria-hidden="true"></div>':I(i)}<h3>${t}</h3><p>${p}</p><button class="text-button" data-action="try-state" data-state="${id}">Try this state ${I('arrow-up-right')}</button></article>`).join('')}</div><p class="fine-print">All responses here are simulated locally. These are UI examples, not evidence of backend concurrency, security or network testing.</p>`;
  }
  function header(title,close='close-detail') { return `<div class="dialog-header"><span class="small-kicker">${title}</span><button class="icon-button" data-action="${close}" aria-label="Close dialog">${I('close')}</button></div>`; }
  function showDetail(title,content) {
    if (!$('detail-dialog').open) detailReturn=document.activeElement;
    $('detail-dialog').innerHTML=header('CYBERSEAT / A LITTLE MORE DETAIL')+`<div class="dialog-body"><h2 id="detail-title" tabindex="-1">${title}</h2>${content}</div>`;
    if (!$('detail-dialog').open) $('detail-dialog').showModal();
    $('detail-title').focus({preventScroll:true});
  }
  function closeDetail() { $('detail-dialog').close(); }
  function showGuide() {
    showDetail('Your next session, in a few clicks.',`<p class="subtitle">Welcome to CyberSeat · Interactive design prototype v2.0</p><ol class="guide-list"><li><span class="guide-number">01</span><span><b>Find your space.</b><br>Search a club, select a date, start time and duration.</span></li><li><span class="guide-number">02</span><span><b>Choose one station.</b><br>The floor plan shows available, reserved and unavailable places.</span></li><li><span class="guide-number">03</span><span><b>Make it yours.</b><br>Review the session, confirm it, then find it in My bookings.</span></li><li><span class="guide-number">04</span><span><b>Explore the edges.</b><br>Use Interface states or the collapsed demo controls to try conflicts and recovery.</span></li></ol>${notice('A local simulation','No real reservation is made. There is no backend, login, payment or saved personal data. Changes reset on reload. The fixed demo clock is October 24, 2026, 17:00 in '+zone+'.','','help')}<p class="fine-print">Venue names, specifications, prices and minimum duration are illustrative. The generated venue image is atmosphere art, not evidence of a real club. Club studio uses a demonstrative administrator role.</p><div class="dialog-actions">${button('Let’s explore','close-detail')}</div>`);
  }
  function summaryRows(b,includeId=false) {
    const c=M.club(b.club);
    return `<dl class="summary-rows">${includeId?`<div class="summary-row"><dt>Reservation</dt><dd>${esc(b.id)}</dd></div>`:''}<div class="summary-row"><dt>Club</dt><dd>${c.name}</dd></div><div class="summary-row"><dt>Station</dt><dd>${esc(b.station||'Choose a station')}</dd></div><div class="summary-row"><dt>Date</dt><dd>${dateLabel(b.date)}</dd></div><div class="summary-row"><dt>Session</dt><dd>${b.time}–${endTime(b)} · ${b.duration}h</dd></div><div class="summary-row"><dt>Time zone</dt><dd>${zone}</dd></div></dl>`;
  }
  function openBooking(clubId='arena',scenario='normal') {
    readFilter();
    const interval=currentSlot(), error=M.validate(clubId,interval);
    if (error) { navigate('discover'); $('visit-date').focus(); return; }
    bookingReturn=document.activeElement;
    booking={club:clubId,...interval,station:null,step:'select',scenario,operation:`demo-operation-${operationCounter++}`,result:null,conflictSimulated:false};
    $('booking-dialog').showModal(); renderBooking();
  }
  function closeBooking() {
    // A submitted local operation is allowed to finish, even if the dialog closes.
    $('booking-dialog').close();
  }
  function demoControls() {
    return `<details class="demo-controls"><summary>Prototype controls · simulate a response</summary><label>Next confirmation<select id="demo-scenario" aria-label="Demo response">${[['normal','Confirm normally'],['conflict','Another visitor takes this station'],['offline','Offline before sending'],['unknown','Response lost after saving'],['server','Server failure before saving'],['session','Session expires before sending']].map(([id,t])=>`<option value="${id}" ${booking.scenario===id?'selected':''}>${t}</option>`).join('')}</select></label></details>`;
  }
  function renderBooking() {
    if (!$('booking-dialog').open) return;
    const c=M.club(booking.club); let body='';
    if (booking.step==='select') {
      const stations=demo.stations(c.id,booking);
      const chosen=stations.find(s=>s.id===booking.station);
      if (chosen?.status!=='available') booking.station=null;
      body=`<h2 id="booking-title" tabindex="-1">Your setup. Your seat.</h2><p class="subtitle">${c.name} · ${dateLabel(booking.date)} · ${booking.time}–${endTime(booking)} · ${zone}</p><div class="booking-layout"><section><div class="floor-plan"><div class="floor-label"><span>${c.zone}</span><span>${I('monitor')} ${c.type}</span></div><div class="floor-grid" aria-label="Choose one station">${stations.map(s=>`<button class="seat ${s.status==='reserved'?'busy':s.status==='unavailable'?'offline':''}" data-action="seat" data-seat="${s.id}" aria-label="${s.id}, ${s.status}${s.id===booking.station?', selected':''}" aria-pressed="${s.id===booking.station}" ${s.status==='available'?'':'disabled'}>${I(c.type==='PC'?'monitor':'grid')}<strong>${s.id}</strong><small>${s.id===booking.station?'Selected':s.status==='available'?'Available':s.status==='reserved'?'Reserved':'Unavailable'}</small></button>`).join('')}</div><div class="floor-entry">Entrance / lounge</div></div><div class="legend"><span><i></i>Available</span><span><i class="selected-key"></i>Selected</span><span><i class="busy-key"></i>Reserved</span><span><i class="offline-key"></i>Unavailable</span></div><p class="fine-print">One station per booking. Friends can reserve nearby stations separately.</p></section><aside class="selection-card"><span class="small-kicker">YOUR NEXT SESSION</span><h3>${booking.station||'Pick your spot'}</h3><p class="subtitle">${c.name} · ${c.zone}</p>${summaryRows(booking)}<div class="specs"><span class="spec">${c.gpu}</span><span class="spec">${c.display}</span></div><div class="total-row"><span>Estimated total</span><strong>${money(c.rate*booking.duration)}</strong></div>${button(`Review session ${I('arrow')}`,'review','full-width',!booking.station?'disabled':'')}<p class="fine-print">Availability is checked again at confirmation. Payment is outside this flow.</p></aside></div>${demoControls()}`;
    } else if (booking.step==='review') {
      body=`<h2 id="booking-title" tabindex="-1">One more look. Then you’re in.</h2><p class="subtitle">Check your session before confirming.</p><div class="booking-layout"><section>${summaryRows(booking)}${notice('A little flexibility','You can cancel before '+booking.time+'. The record stays in your history. No cancellation fee is modelled.','','clock')}</section><aside class="selection-card"><span class="small-kicker">YOUR SESSION</span><h3>${c.name}</h3><p class="subtitle">${booking.station} · ${c.gpu} · ${c.display}</p><div class="total-row section-gap"><span>Estimated total</span><strong>${money(c.rate*booking.duration)}</strong></div>${button('Confirm reservation','confirm')}<p class="fine-print">This local demo simulates the final availability check. It does not make a real reservation.</p></aside></div><div class="dialog-actions">${button(`${I('back')} Change station`,'back-to-seats','quiet')}</div>${demoControls()}`;
    } else if (booking.step==='pending') {
      body=result('Checking your spot…','We’re confirming this station and time. Please wait; you don’t need to submit again.','clock','',true);
    } else if (booking.step==='success') {
      body=result('You’re booked. Game on.',`${c.name} · ${booking.station}<br>Your demo reservation is confirmed.`, 'check',summaryRows(booking.result,true)+`<div class="dialog-actions">${button('View my bookings','go-bookings')}${button('Keep exploring','finish-discover','quiet')}</div>`);
    } else {
      const responses={
        conflict:['That spot just got popular.','Someone else reserved this station before confirmation. No reservation was created for you. Choose another station or time.','users',button('Choose another station','recover-conflict')+button('Change time','change-time','quiet')],
        offline:['You’re offline. Your plan isn’t lost.','Nothing was sent. Your station and time are retained. Reconnect, then refresh availability before confirming.','wifi',button('Reconnect & refresh','recover-offline')+button('Keep selection & close','close-booking','quiet')],
        unknown:['Your booking may already be saved.','We didn’t receive the response. Check this same operation before trying again; a missing response does not mean the booking failed.','help',button('Check booking status','reconcile')],
        server:['A short pause. Then back to play.','We couldn’t complete this demo request. No reservation was saved. Try again with your current selection. Reference: CS-503-DEMO.','monitor',button('Try again','recover-server')+button('Change time','change-time','quiet')],
        session:['Let’s get you signed in again.','Your demo session expired before submission. Continue as the demo visitor, then refresh availability before confirming.','shield',button('Continue as demo visitor','recover-session')]
      };
      const [title,text,icon,actions]=responses[booking.step]||responses.server;
      body=result(title,text,icon,`<div class="dialog-actions">${actions}</div>`,false,true);
    }
    $('booking-dialog').innerHTML=header(`CYBERSEAT / ${booking.step==='select'?'01 · CHOOSE A STATION':booking.step==='review'?'02 · REVIEW YOUR SESSION':'03 · RESERVATION STATUS'}`,'close-booking')+`<div class="dialog-body">${body}</div>`;
    $('booking-title').focus({preventScroll:true}); announce($('booking-title').textContent);
  }
  function result(title,text,icon,extra='',pending=false,warning=false) {
    return `<section class="result-screen">${pending?'<div class="spinner" style="margin:0 auto 26px" aria-hidden="true"></div>':`<div class="result-symbol ${warning?'warning':''}">${I(icon)}</div>`}<h2 id="booking-title" tabindex="-1">${title}</h2><p>${text}</p>${extra}</section>`;
  }
  function submitBooking() {
    if (!booking || booking.step!=='review') return;
    const operation=booking; operation.step='pending'; renderBooking();
    pendingTimer=setTimeout(()=>{
      const scenario=operation.scenario;
      if (scenario==='offline'||scenario==='session'||scenario==='server') operation.step=scenario;
      else {
        if (scenario==='conflict'&&!operation.conflictSimulated) {
          demo.state.bookings.push({id:'DEMO-CONCURRENT-'+operation.operation,owner:'demo-other',club:operation.club,station:operation.station,status:'CONFIRMED',date:operation.date,time:operation.time,duration:operation.duration,start:operation.start,end:operation.end});
          operation.conflictSimulated=true;
        }
        const response=demo.reserve(operation.club,operation.station,operation,operation.operation);
        if (!response.ok) operation.step=response.code==='conflict'?'conflict':'server';
        else { operation.result=response.booking; operation.step=scenario==='unknown'?'unknown':'success'; }
      }
      if (booking===operation) renderBooking();
      if (!$('booking-dialog').open&&operation.step==='unknown') toast('Demo response was lost. Open My bookings to check the saved result.');
      else if (!$('booking-dialog').open&&operation.step==='success') toast('Demo reservation confirmed. Find it in My bookings.');
      updateNav(); if (view==='bookings'||view==='schedule') navigate(view,false);
    },700);
  }
  function showBookingDetails(id) {
    const b=demo.own().find(x=>x.id===id); if (!b) return;
    showDetail(b.status==='CANCELLED'?'The record stays. The spot is released.':'Your session is set.',`<span class="status ${b.status==='CANCELLED'?'muted':''}">${b.status==='CANCELLED'?'Cancelled':'Confirmed'}</span>${summaryRows(b,true)}<div class="total-row"><span>Estimated total</span><strong>${money(M.club(b.club).rate*b.duration)}</strong></div><p class="fine-print">A local demonstration, not a real reservation. ${b.status==='CANCELLED'?'Other bookings and maintenance may still affect availability.':'Cancel before '+b.time+'. Payment is outside this flow.'}</p><div class="dialog-actions">${button('Close','close-detail','secondary')}</div>`);
  }
  function cancellation(id) {
    const b=demo.own().find(x=>x.id===id); if (!b) return;
    showDetail('Plans change. Cancel this session?',`${summaryRows(b,true)}${notice('Keep the record, release the spot','Cancellation is available before '+b.time+'. The booking remains in your history. Other availability restrictions still apply.','','clock')}<div id="cancel-error" class="form-error" role="alert"></div><div class="dialog-actions">${button('Keep reservation','close-detail','secondary')}${button('Confirm cancellation','confirm-cancel','danger',`data-id="${esc(b.id)}"`)}</div>`);
  }
  function maintenanceForm() {
    showDetail('A little downtime. A better setup.',`<p class="subtitle">Block a station in your assigned club: Cyber Arena.</p><form id="maintenance-form" class="section-gap" novalidate><div class="form-grid"><label class="form-label">Station<select name="station" aria-label="Maintenance station">${M.stationIds('arena').map(s=>`<option ${s==='P04'?'selected':''}>${s}</option>`).join('')}</select></label><label class="form-label">Date<input type="date" name="date" value="2026-10-24" min="2026-10-24"></label><label class="form-label">Start<input type="time" name="time" value="18:00"></label><label class="form-label">Duration<select name="duration"><option value="1">1 hour</option><option value="2">2 hours</option></select></label><label class="form-label" style="grid-column:1/-1">Reason<textarea name="reason" maxlength="200" placeholder="e.g. Monitor repair">Monitor repair</textarea></label></div><p class="fine-print">${zone}. Existing confirmed bookings are protected.</p><div id="maintenance-feedback" class="section-gap" aria-live="polite"></div><div class="dialog-actions">${button('Keep schedule','close-detail','quiet')}<button class="btn" type="submit">Review & save demo block</button></div></form>`);
  }
  function tryState(id) {
    if (id==='loading') { navigate('discover'); search(true); return; }
    if (id==='empty') { filter.query='No matching demo club'; navigate('discover'); return; }
    if (id==='validation') { filter.time='08:00'; navigate('discover'); return; }
    filter={...filter,date:'2026-10-24',time:'18:00',duration:2};
    const free=demo.stations('arena',currentSlot()).find(s=>s.status==='available');
    if (!free) { toast('No available demo station. Reload to reset the example data.'); return; }
    openBooking('arena',id); booking.station=free.id; booking.step='review'; renderBooking();
  }
  function search(isLoadingDemo=false) {
    clearTimeout(searchTimer); readFilter();
    const error=M.validate('arena',currentSlot());
    if (error) { renderClubs(); $('visit-date').focus(); return; }
    $('club-results').innerHTML=`<div class="venue-grid" role="status" aria-label="Checking availability">${Array.from({length:3},()=>'<div class="loading-card"><div class="skeleton"></div><div class="skeleton"></div><div class="skeleton"></div></div>').join('')}</div>`;
    announce('Checking demo availability');
    searchTimer=setTimeout(()=>{ if (view==='discover') { renderClubs(); announce('Demo availability updated'); } },isLoadingDemo?1800:450);
  }
  function mobileMenu() {
    navigationReturn=document.activeElement;
    $('navigation-dialog').innerHTML=header('YOUR NEXT LEVEL','close-navigation')+navMarkup(); $('navigation-dialog').showModal();
  }
  document.addEventListener('click',event=>{
    const el=event.target.closest('[data-action]'); if (!el||el.disabled) return;
    const a=el.dataset.action;
    if (a==='nav') { if ($('navigation-dialog').open) $('navigation-dialog').close(); navigate(el.dataset.view); }
    else if (a==='discover') { if ($('detail-dialog').open) closeDetail(); navigate('discover'); }
    else if (a==='guide') showGuide();
    else if (a==='mobile-menu') mobileMenu();
    else if (a==='close-navigation') $('navigation-dialog').close();
    else if (a==='close-detail') closeDetail();
    else if (a==='close-booking') closeBooking();
    else if (a==='hero-search'||a==='edit-search') { $('visit-date').focus(); $('search-form').scrollIntoView({block:'center',behavior:'smooth'}); }
    else if (a==='reset-filters') { filter={query:'',type:'All',date:'2026-10-24',time:'18:00',duration:2}; navigate('discover',false); $('club-query').focus(); }
    else if (a==='filter-type') { readFilter(); filter.type=el.dataset.type; for (const b of document.querySelectorAll('[data-action="filter-type"]')) b.setAttribute('aria-pressed',String(b===el)); renderClubs(); }
    else if (a==='open-booking') openBooking(el.dataset.club);
    else if (a==='seat') { booking.station=el.dataset.seat; renderBooking(); const selected=$('booking-dialog').querySelector(`[data-seat="${booking.station}"]`); if (selected) selected.focus({preventScroll:true}); }
    else if (a==='review') { if (!booking.station) return; booking.step='review'; renderBooking(); }
    else if (a==='back-to-seats') { booking.step='select'; renderBooking(); }
    else if (a==='confirm') submitBooking();
    else if (a==='go-bookings') { closeBooking(); navigate('bookings'); }
    else if (a==='finish-discover') { closeBooking(); navigate('discover'); }
    else if (a==='change-time') { closeBooking(); navigate('discover'); $('visit-date').focus(); }
    else if (a==='reconcile') { const record=demo.operation(booking.operation); if (record) { booking.result=record; booking.step='success'; renderBooking(); } else announce('The operation is still being checked. No new reservation has been submitted.'); }
    else if (a.startsWith('recover-')) { booking.scenario='normal'; booking.step=a==='recover-server'?'review':'select'; if (a==='recover-conflict') { booking.station=null; booking.operation=`demo-operation-${operationCounter++}`; } renderBooking(); }
    else if (a==='booking-details') showBookingDetails(el.dataset.id);
    else if (a==='cancel-booking') cancellation(el.dataset.id);
    else if (a==='confirm-cancel') { const response=demo.cancel(el.dataset.id); if (!response.ok) $('cancel-error').textContent=response.message; else { closeDetail(); navigate('bookings'); toast(`${el.dataset.id} cancelled. The record is in your history.`); } }
    else if (a==='event') { const e=events.find(x=>x.id===el.dataset.id); showDetail(e.title,`<span class="status purple">${e.game}</span><p class="section-gap">${e.text}</p><p class="subtitle">${dateLabel(e.date)} · ${e.time}<br>${e.club} · ${zone}</p><div class="section-gap">${notice('Contact the club organiser','Ask '+e.club+' for participation details. Registration and payment are outside CyberSeat’s informational event calendar.','','calendar')}</div><div class="dialog-actions">${button('Back to events','close-detail','secondary')}</div>`); }
    else if (a==='maintenance') maintenanceForm();
    else if (a==='try-state') tryState(el.dataset.state);
  });
  document.addEventListener('submit',event=>{
    if (event.target.id==='search-form') { event.preventDefault(); search(); }
    if (event.target.id==='maintenance-form') {
      event.preventDefault(); const values=new FormData(event.target);
      const interval=M.slot(String(values.get('date')),String(values.get('time')),Number(values.get('duration')));
      const response=demo.block('arena',String(values.get('station')),interval,String(values.get('reason')));
      $('maintenance-feedback').innerHTML=response.ok?notice('Demo block saved','This interval is now unavailable in the local floor plan. Reloading resets it.','success','check'):notice('The schedule stays protected',esc(response.message),'warning','shield');
      if (response.ok) { event.target.querySelector('[type="submit"]').disabled=true; if (view==='schedule') navigate('schedule',false); }
    }
  });
  document.addEventListener('change',event=>{ if (event.target.id==='demo-scenario'&&booking) booking.scenario=event.target.value; });
  $('booking-dialog').addEventListener('close',()=>{ if (bookingReturn?.isConnected) bookingReturn.focus({preventScroll:true}); });
  $('detail-dialog').addEventListener('close',()=>{ if (detailReturn?.isConnected) detailReturn.focus({preventScroll:true}); });
  $('navigation-dialog').addEventListener('close',()=>{ if (navigationReturn?.isConnected) navigationReturn.focus({preventScroll:true}); });
  window.addEventListener('hashchange',()=>{ if (location.hash==='#discover') navigate('discover'); });
  for (const node of document.querySelectorAll('[data-icon]')) node.innerHTML=I(node.dataset.icon);
  navigate('discover',false);
})();
