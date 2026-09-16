# Boss Tours & Travels - Full-Stack Website & Dynamic Admin Panel

A high-converting, luxury-themed full-stack travel booking & car rental web application for **Boss Tours & Travels**, built with React, Vite, Tailwind CSS, Framer Motion, Node.js, Express, SQLite, JWT, and Google Ads conversion tracking.

---

## 🌟 Key Features

1. **Fully Animated Luxury Public Website**:
   - **Home**: Hero section, quick fare search calculator, services highlights, featured tour packages, fleet cars showcase, outstation routes directory, customer reviews.
   - **Services**: Detailed breakdown for Outstation Cabs, Spiritual Yatras (Shirdi, Trimbakeshwar, Ashtavinayak), Beach Trips (Goa), Corporate Rentals, Airport Transfers, and Wedding Fleet.
   - **Tour Packages**: Category-filterable packages with itineraries, duration, and direct reservation triggers.
   - **Luxury Fleet**: Car catalog (Swift Dzire, Maruti Ertiga, Toyota Innova Crysta, Tempo Traveller, Boss Luxury) with seating capacity, luggage, specs, and rates.
   - **Outstation Routes**: Searchable 30+ outstation route directory from Mumbai with estimated travel duration and distance.
   - **Interactive Booking**: Multi-step reservation form with instant fare calculation, reference code generation (`BT-XXXXXX`), and WhatsApp reference trigger.
   - **About & Contact**: Company story, counter metrics, direct phone hotline (+91 9272174699), WhatsApp chat, and lead inquiry form.

2. **Full SEO & SMO & Google Ads Integration**:
   - Primary SEO tags, Open Graph (Facebook/Instagram), Twitter Cards, and Schema.org JSON-LD for `TravelAgency` and `AutoRental`.
   - Built-in Google Ads Conversion Tracking helper (`src/config/googleAds.js`) tracking Phone Call Clicks, WhatsApp Clicks, Booking Submissions, and Lead Forms.

3. **Dynamic Admin Control Panel (`/admin`)**:
   - **Dashboard Overview**: Total revenue, total bookings, active fleet, customer leads count, recent bookings table.
   - **Bookings Manager**: Filter by status (Pending, Confirmed, Completed, Cancelled), update status live, delete bookings.
   - **Fleet Manager**: Add new cars, edit car specs/pricing/image, toggle availability, delete vehicles.
   - **Package Manager**: Add/Edit/Delete tour packages.
   - **User Manager**: Manage user accounts, promote/demote admin roles, delete accounts.
   - **Inquiry Manager**: View customer inquiries, update status, delete leads.

4. **Authentication**:
   - JWT token auth + Bcrypt password hashing.
   - Default Admin Credentials:
     - **Email**: `admin@bosstours.com`
     - **Password**: `admin123`

---

## 🚀 How to Run

### 1. Start Backend API Server
```bash
cd server
npm start
```
*Server runs on `http://localhost:5000` with SQLite database automatically initialized & pre-seeded.*

### 2. Start React Frontend
```bash
cd client
npm run dev
```
*App runs on `http://localhost:3000` with Vite HMR and API proxy.*

---

## 🛠️ Tech Stack
- **Frontend**: React 18, Vite, Tailwind CSS, Lucide React, Framer Motion, Axios, React Router v6.
- **Backend**: Node.js, Express, SQLite3, JSON Web Tokens (JWT), BcryptJS, CORS.
