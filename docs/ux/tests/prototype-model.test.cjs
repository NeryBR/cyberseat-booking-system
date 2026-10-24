// Tests of the disposable UI simulation, not real PostgreSQL/API/security tests.
const test=require('node:test');
const assert=require('node:assert/strict');
const M=require('../prototype-model.js');
test('initial interval has 12 available Arena stations; reserved and maintenance differ',()=>{
  const items=M.createDemo().stations('arena',M.slot());
  assert.equal(items.filter(s=>s.status==='available').length,12);
  assert.equal(items.find(s=>s.id==='P04').status,'reserved');
  assert.equal(items.find(s=>s.id==='P07').status,'unavailable');
});
test('selection creates exactly one station record; overlap rejected',()=>{
  const d=M.createDemo(), s=M.slot();
  assert.equal(d.reserve('arena','P02',s,'one').ok,true);
  assert.equal(d.reserve('arena','P02',M.slot('2026-10-24','19:00',2),'two').code,'conflict');
  assert.equal(d.state.bookings.filter(b=>b.station==='P02').length,1);
});
test('same operation replays one record; changed body is rejected',()=>{
  const d=M.createDemo(), a=d.reserve('arena','P02',M.slot(),'stable');
  const b=d.reserve('arena','P02',M.slot(),'stable');
  assert.equal(a.booking.id,b.booking.id); assert.equal(b.replay,true);
  assert.equal(d.reserve('arena','P03',M.slot(),'stable').code,'operation-conflict');
});
test('half-open adjacent intervals are allowed',()=>{
  const d=M.createDemo();
  assert.equal(d.reserve('arena','P02',M.slot(),'a').ok,true);
  assert.equal(d.reserve('arena','P02',M.slot('2026-10-24','20:00',2),'b').ok,true);
});
test('cancellation preserves history and releases only its interval',()=>{
  const d=M.createDemo(), a=d.reserve('arena','P02',M.slot(),'a').booking;
  assert.equal(d.cancel(a.id).ok,true); assert.equal(d.cancel(a.id).ok,true);
  assert.equal(d.own().find(b=>b.id===a.id).status,'CANCELLED');
  assert.equal(d.stations('arena',M.slot()).find(s=>s.id==='P02').status,'available');
  assert.equal(d.stations('arena',M.slot()).find(s=>s.id==='P07').status,'unavailable');
  assert.equal(d.reserve('arena','P02',M.slot(),'a').booking.status,'CANCELLED');
});
test('other visitor records cannot be cancelled through the demo own-record API',()=>{
  const d=M.createDemo(), foreign=d.state.bookings.find(b=>b.owner==='demo-other');
  assert.equal(d.cancel(foreign.id).ok,false);
  assert.equal(d.own().some(b=>b.owner!=='demo-visitor'),false);
});
test('started own booking cannot be cancelled',()=>{
  const d=M.createDemo(), b=d.own()[0]; b.start=M.NOW;
  assert.equal(d.cancel(b.id).ok,false); assert.equal(b.status,'CONFIRMED');
});
test('maintenance cannot overwrite a reservation or an existing block',()=>{
  const d=M.createDemo();
  assert.equal(d.block('arena','P04',M.slot(),'Monitor repair').ok,false);
  assert.equal(d.block('arena','P07',M.slot(),'Monitor repair').ok,false);
  assert.equal(d.own()[0].status,'CONFIRMED');
});
test('saved maintenance prevents a later booking; assigned club is checked',()=>{
  const d=M.createDemo();
  assert.equal(d.block('level','C01',M.slot(),'Repair').ok,false);
  assert.equal(d.block('arena','P02',M.slot(),'Repair').ok,true);
  assert.equal(d.reserve('arena','P02',M.slot(),'a').code,'conflict');
});
test('invalid, past, short, impossible and outside-hours intervals are rejected',()=>{
  for(const s of [M.slot('', '18:00',2),M.slot('2026-10-24','17:00',2),M.slot('2026-10-24','18:00',0),M.slot('2026-10-24','23:00',2),M.slot('2026-02-30','18:00',2)]) assert.notEqual(M.validate('arena',s),'');
  assert.notEqual(M.validate('missing',M.slot()),'');
  assert.equal(M.validate('arena',M.slot('2026-10-25','08:00',2)),'');
});
test('lost-response reconciliation refers to the saved original operation',()=>{
  const d=M.createDemo(), a=d.reserve('arena','P02',M.slot(),'lost').booking;
  assert.equal(d.operation('lost').id,a.id); assert.equal(d.operation('not-sent'),undefined);
  assert.equal(d.reserve('arena','P02',M.slot(),'lost').booking.id,a.id);
});
test('station identifiers must belong to the selected club',()=>{
  const d=M.createDemo();
  assert.equal(d.reserve('level','P02',M.slot(),'a').ok,false);
  assert.equal(d.reserve('level','C01',M.slot(),'b').ok,true);
});
