const $ = (id) => document.getElementById(id);
const today = new Date();
$('journeyDate').min = today.toISOString().slice(0,10);
$('journeyDate').value = today.toISOString().slice(0,10);
$('year').textContent = today.getFullYear();

const routes = [
  {from:'Kurnool',to:'Hyderabad',time:'5h 30m',fare:399,bus:'Orange Express AC',depart:'10:30 PM',img:'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=900'},
  {from:'Kurnool',to:'Bangalore',time:'7h 45m',fare:599,bus:'South Star Sleeper',depart:'09:00 PM',img:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900'},
  {from:'Hyderabad',to:'Vijayawada',time:'4h 15m',fare:349,bus:'CityLine Travels',depart:'07:15 AM',img:'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=900'},
  {from:'Vijayawada',to:'Vizag',time:'6h 30m',fare:549,bus:'Coastal Comfort',depart:'08:45 PM',img:'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=900'}
];
let selectedBus = null;
let selectedSeat = null;
const getBookings = () => JSON.parse(localStorage.getItem('tanushBookings') || '[]');
const saveBookings = (items) => localStorage.setItem('tanushBookings', JSON.stringify(items));
function toast(message){const el=$('toast');el.textContent=message;el.classList.add('show');setTimeout(()=>el.classList.remove('show'),2600)}
function renderRoutes(){
  $('routeGrid').innerHTML = routes.map((r,i)=>`<article class="route-card"><div class="route-photo" style="background-image:url('${r.img}')"><span>Popular route</span></div><div class="route-info"><h3>${r.from} → ${r.to}</h3><div class="route-meta">◷ &nbsp;${r.time} &nbsp; • &nbsp; Daily</div><div class="route-bottom"><span class="fare">₹ ${r.fare}</span><button class="small-btn" onclick="quickBook(${i})">Book Now</button></div></div></article>`).join('');
}
function searchBuses(from,to,date){
  const matches=routes.filter(r=>r.from.toLowerCase()===from.toLowerCase()&&r.to.toLowerCase()===to.toLowerCase());
  $('resultsSection').hidden=false;
  $('resultsSubtitle').textContent=`${from} to ${to} • ${new Date(date+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}`;
  $('busResults').innerHTML=matches.length?matches.map((r,i)=>`<article class="bus-card"><div><h3>${r.bus}</h3><p>AC • Sleeper / Seater</p></div><div><strong>${r.depart}</strong><p>Departure</p></div><div><strong>${r.time}</strong><p>Journey duration</p></div><div><strong>₹ ${r.fare}</strong><p>Per seat</p></div><button class="small-btn" onclick="openSeats(${routes.indexOf(r)},'${date}')">Select Seats</button></article>`).join(''):`<p>No demo bus found for this route. Try Kurnool → Hyderabad, Kurnool → Bangalore, Hyderabad → Vijayawada or Vijayawada → Vizag.</p>`;
  $('resultsSection').scrollIntoView({behavior:'smooth'});
}
$('searchForm').addEventListener('submit',e=>{e.preventDefault();const from=$('source').value.trim(),to=$('destination').value.trim(),date=$('journeyDate').value;if(from.toLowerCase()===to.toLowerCase())return toast('Source and destination must be different.');searchBuses(from,to,date)});
$('swapBtn').addEventListener('click',()=>{const a=$('source').value;$ ('source').value=$('destination').value;$ ('destination').value=a});
window.quickBook=(i)=>{const r=routes[i];$('source').value=r.from;$('destination').value=r.to;$('journeyDate').value=today.toISOString().slice(0,10);searchBuses(r.from,r.to,$('journeyDate').value)};
window.openSeats=(index,date)=>{
  selectedBus=routes[index];selectedSeat=null;
  const booked=getBookings().filter(b=>b.bus===selectedBus.bus&&b.date===date).map(b=>b.seat);
  const seats=Array.from({length:20},(_,i)=>'S'+(i+1));
  $('dialogContent').innerHTML=`<h2>Choose Your Seat</h2><p>${selectedBus.bus} • ${selectedBus.from} to ${selectedBus.to} • ₹${selectedBus.fare}</p><div class="seat-grid">${seats.map(s=>`<button class="seat ${booked.includes(s)?'taken':''}" ${booked.includes(s)?'disabled':''} data-seat="${s}">${s}</button>`).join('')}</div><p id="seatSummary">Select one available seat to continue.</p><form id="passengerForm"><div class="form-grid"><label>Passenger name<input id="pName" required placeholder="Full name"></label><label>Email<input id="pEmail" type="email" required placeholder="Email address"></label><label>Phone<input id="pPhone" required pattern="[0-9]{10}" placeholder="10-digit phone"></label><label>Journey date<input value="${date}" disabled></label></div><button class="search-btn modal-action" type="submit">Confirm Booking • ₹${selectedBus.fare}</button></form>`;
  document.querySelectorAll('.seat:not(.taken)').forEach(btn=>btn.addEventListener('click',()=>{document.querySelectorAll('.seat').forEach(x=>x.classList.remove('selected'));btn.classList.add('selected');selectedSeat=btn.dataset.seat;$('seatSummary').textContent=`Selected seat: ${selectedSeat}`}));
  $('passengerForm').addEventListener('submit',e=>{e.preventDefault();if(!selectedSeat)return toast('Please select a seat first.');const booking={id:'TB'+Date.now().toString().slice(-7),name:$('pName').value,email:$('pEmail').value,phone:$('pPhone').value,bus:selectedBus.bus,from:selectedBus.from,to:selectedBus.to,date,seat:selectedSeat,fare:selectedBus.fare,status:'Confirmed'};const all=getBookings();all.push(booking);saveBookings(all);$('bookingDialog').close();toast('Booking confirmed! Your booking ID is '+booking.id);});
  $('bookingDialog').showModal();
};
$('myBookingsBtn').addEventListener('click',showBookings);
function showBookings(){
  const items=getBookings();
  $('dialogContent').innerHTML=`<h2>My Bookings</h2><p>Your bookings are saved in this browser on this device.</p>${items.length?items.map(b=>`<div class="booking-row"><strong>${b.from} → ${b.to} <button class="cancel-btn" onclick="cancelBooking('${b.id}')">Cancel</button></strong>${b.bus} • ${b.date} • Seat ${b.seat}<br>Passenger: ${b.name} • ₹${b.fare}<br><small>Booking ID: ${b.id} • ${b.status}</small></div>`).join(''):'<p>No bookings yet. Search a bus and reserve your seat.</p>'}`;
  $('bookingDialog').showModal();
}
window.cancelBooking=(id)=>{const items=getBookings().map(b=>b.id===id?{...b,status:'Cancelled'}:b);saveBookings(items);showBookings();toast('Booking status updated to Cancelled.')};
$('menuToggle').addEventListener('click',()=>$('mainNav').classList.toggle('open'));
document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>$('mainNav').classList.remove('open')));
renderRoutes();
