/* DOM integration checks. Requires jsdom in an external QA directory (see README).
   Native dialog layout, real keyboard trapping and responsive rendering still need browser review. */
const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {JSDOM,VirtualConsole}=require(require.resolve('jsdom',{paths:[process.env.CYBERSEAT_QA_MODULES||process.cwd()]}));
const root=path.resolve(__dirname,'..');
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
function setup() {
  const errors=[]; const vc=new VirtualConsole(); vc.on('jsdomError',e=>errors.push(e));
  const dom=new JSDOM(fs.readFileSync(path.join(root,'prototype.html'),'utf8'),{runScripts:'outside-only',url:'https://cyberseat.invalid/prototype.html',pretendToBeVisual:true,virtualConsole:vc});
  const w=dom.window;
  w.scrollTo=()=>{}; w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.HTMLDialogElement.prototype.showModal=function(){this.setAttribute('open','');};
  w.HTMLDialogElement.prototype.close=function(){this.removeAttribute('open');this.dispatchEvent(new w.Event('close'));};
  for(const file of ['prototype-model.js','prototype.js']) w.eval(fs.readFileSync(path.join(root,file),'utf8'));
  const q=selector=>w.document.querySelector(selector);
  const click=selector=>{const el=q(selector);assert.ok(el,selector);assert.equal(el.disabled,false,selector+' enabled');el.click();assert.deepEqual(errors,[]);};
  const nav=view=>click(`[data-action="nav"][data-view="${view}"]`);
  return {dom,w,q,click,nav,errors,close:()=>w.close()};
}
test('all six pages render and current-page navigation stays in sync',()=>{
  const t=setup(); try {
    assert.equal(t.w.document.querySelectorAll('.venue-card').length,3);
    for(const view of ['bookings','events','schedule','insights','states','discover']) {t.nav(view);assert.ok(t.q('h1'));assert.equal(t.q('#desktop-nav [aria-current="page"]').dataset.view,view);}
    assert.deepEqual(t.errors,[]);
  }finally{t.close();}
});
test('PC/console filters and empty results are distinct and reversible',()=>{
  const t=setup();try{
    t.click('[data-type="Console"]');assert.equal(t.w.document.querySelectorAll('.venue-card').length,1);assert.match(t.q('#club-results').textContent,/Level Up/);
    t.q('#club-query').value='not a club';t.click('[data-type="All"]');assert.match(t.q('#club-results').textContent,/No matching/);
    t.click('[data-action="reset-filters"]');assert.equal(t.w.document.querySelectorAll('.venue-card').length,3);
    t.q('#club-query').value='"><img src=x onerror=alert(1)>';t.click('[data-type="All"]');assert.equal(t.q('#club-results img'),null);
  }finally{t.close();}
});
test('a booking requires a station; double confirmation creates a single result',async()=>{
  const t=setup();try{
    t.click('[data-action="open-booking"][data-club="arena"]');assert.equal(t.q('[data-action="review"]').disabled,true);
    assert.equal(t.q('[data-seat="P04"]').disabled,true);assert.equal(t.q('[data-seat="P07"]').disabled,true);
    t.click('[data-seat="P02"]');assert.equal(t.q('[data-seat="P02"]').getAttribute('aria-pressed'),'true');
    t.click('[data-action="review"]');t.click('[data-action="confirm"]');assert.equal(t.q('[data-action="confirm"]'),null);
    await wait(800);assert.match(t.q('#booking-title').textContent,/Game on/);assert.match(t.q('#booking-dialog').textContent,/CS-1043/);
    t.click('[data-action="go-bookings"]');assert.equal(t.w.document.querySelectorAll('.booking-record').length,2);assert.deepEqual(t.errors,[]);
  }finally{t.close();}
});
test('cancel requires confirmation and keeps the record in history',()=>{
  const t=setup();try{
    t.nav('bookings');t.click('[data-action="cancel-booking"]');t.click('[data-action="close-detail"]');assert.equal(t.w.document.querySelectorAll('.status.muted').length,0);
    t.click('[data-action="cancel-booking"]');t.click('[data-action="confirm-cancel"]');assert.match(t.q('#main').textContent,/Cancelled/);assert.match(t.q('#main').textContent,/CS-1042/);
  }finally{t.close();}
});
test('lost response reconciles the original operation without creating another',async()=>{
  const t=setup();try{
    t.nav('states');t.click('[data-state="unknown"]');t.click('[data-action="confirm"]');await wait(800);
    assert.match(t.q('#booking-title').textContent,/may already be saved/);assert.equal(t.q('[data-action="confirm"]'),null);
    t.click('[data-action="reconcile"]');assert.match(t.q('#booking-title').textContent,/Game on/);t.click('[data-action="go-bookings"]');assert.equal(t.w.document.querySelectorAll('.booking-record').length,2);
  }finally{t.close();}
});
test('conflict recovery disables the taken station and permits another',async()=>{
  const t=setup();try{
    t.nav('states');t.click('[data-state="conflict"]');t.click('[data-action="confirm"]');await wait(800);
    assert.match(t.q('#booking-title').textContent,/popular/);t.click('[data-action="recover-conflict"]');assert.equal(t.q('[data-seat="P01"]').disabled,true);
    t.click('[data-seat="P02"]');t.click('[data-action="review"]');t.click('[data-action="confirm"]');await wait(800);assert.match(t.q('#booking-title').textContent,/Game on/);
  }finally{t.close();}
});
for(const scenario of ['offline','session','server']) test(`${scenario} before saving creates no booking, then recovers`,async()=>{
  const t=setup();try{
    t.nav('states');t.click(`[data-state="${scenario}"]`);t.click('[data-action="confirm"]');await wait(800);
    assert.ok(t.q(`[data-action="recover-${scenario}"]`));t.click('[data-action="close-booking"]');t.nav('bookings');assert.equal(t.w.document.querySelectorAll('.booking-record').length,1);
  }finally{t.close();}
});
test('maintenance conflict leaves booking in place; a free interval can be blocked',()=>{
  const t=setup();try{
    t.nav('schedule');t.click('[data-action="maintenance"]');const form=t.q('#maintenance-form');
    form.dispatchEvent(new t.w.Event('submit',{bubbles:true,cancelable:true}));assert.match(t.q('#maintenance-feedback').textContent,/No block was saved/);
    t.q('[name="station"]').value='P02';form.dispatchEvent(new t.w.Event('submit',{bubbles:true,cancelable:true}));assert.match(t.q('#maintenance-feedback').textContent,/Demo block saved/);
    assert.match(t.q('#main .schedule').textContent,/Maintenance/);assert.deepEqual(t.errors,[]);
  }finally{t.close();}
});
test('invalid time feedback and guide/mobile-menu dialogs are reachable',()=>{
  const t=setup();try{
    t.nav('states');t.click('[data-state="validation"]');assert.equal(t.q('#search-error').hidden,false);
    t.click('[data-action="guide"]');assert.match(t.q('#detail-dialog').textContent,/No real reservation/);t.click('[data-action="close-detail"]');
    t.click('[data-action="mobile-menu"]');assert.equal(t.q('#navigation-dialog').open,true);t.click('#navigation-dialog [data-view="events"]');assert.equal(t.q('#navigation-dialog').open,false);assert.match(t.q('h1').textContent,/More playing/);
  }finally{t.close();}
});
