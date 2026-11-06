TANUSH BUS RESERVATION WEBSITE
================================

HOW TO RUN
1. Extract the ZIP file.
2. Open the folder "Tanush_Bus_Reservation" in Visual Studio Code.
3. Open index.html.
4. Right-click and choose "Open with Live Server" (recommended), or open index.html in your browser.

FILES
- index.html : website page and sections
- style.css  : design and responsive layout
- script.js  : bus search, seat selection, booking and cancellation demo
- assets/tanush-bus-hero.jpg : cropped hero image from the image you supplied

PROJECT 13 DATABASE STRUCTURE
This front-end demo follows the Excel project's three main tables:
- passengers (passenger_id, name, email, phone, password)
- buses (bus_id, bus_no, source, destination, departure_time, total_seats, available_seats)
- bookings (booking_id, passenger_id, bus_id, booking_date, seat_no, fare, status)

IMPORTANT
This is a browser-based front-end demonstration. Bookings are saved in localStorage in the current browser.
It does not connect to MySQL/PHP or provide real payment processing or authentication.
The sample bus list and fares are demo data and can be edited in script.js.
Internet is needed for Google Fonts and the sample bus-card photos. The hero photo is stored locally.
