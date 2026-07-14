# BookStore MERN Stack Application

A premium, full-stack **BookStore** web application built using the MERN Stack (MongoDB, Express.js, React, Node.js) featuring modern glassmorphism design, user reviews, cart management, ordering, and a 7-day store reservation system.

---

## Features

### 🌟 Customer Experience
- **Interactive Home Catalog:** Real-time search, category filtering tags, and smooth hover animation book cards.
- **Product Details Page:** Comprehensive descriptions, stock status tracker, rating stars, and community reviews.
- **Dynamic Cart Manager:** Support for increasing/decreasing quantities, item deletion, and mixed-mode checkouts.
- **Mixed Purchase & Reservation Checkouts:**
  - **Purchase Mode:** Requires shipping address inputs, marked paid, and processed as an order.
  - **Reservation Mode:** Free checkout option allowing users to reserve items for local store pickup for up to 7 days.
- **Community Reviews System:** Logged-in users can rate books out of 5 and write feedback, updating average ratings instantly.
- **Personal Dashboard:** Track purchase history, order delivery statuses, and active reservations with pickup deadlines.

### 🛡️ Administrator Panel
- **Complete Inventory CRUD:** Add, edit, or remove books from the catalog via interactive forms.
- **Inventory Autocalculations:** Decrements inventory counts dynamically during orders and blocks purchase attempts exceeding stock limits.
- **Order Registry Tracker:** View all customer purchases and reservations, mark items as paid, or finalize delivery cycles.

---

## Tech Stack & Architecture

- **Frontend:** React.js, React Router DOM, Lucide Icons, and Custom Vanilla CSS (Glassmorphism design language).
- **Backend:** Node.js, Express.js REST APIs, Mongoose ODM.
- **Database:** MongoDB (Local instance or MongoDB Atlas).
- **Auth:** JSON Web Token (JWT) with cookies/header bearer verification and password hashing via `bcryptjs`.

---

## Software & Hardware Requirements

### Software Requirements
- **OS:** Windows 10/11, macOS, or Linux.
- **Node.js:** v16.0.0 or above (tested on v26.4.0).
- **MongoDB:** Locally running MongoDB Server (default: `mongodb://localhost:27017`) or Atlas connection string.
- **Package Manager:** npm v8.0.0 or above.

### Hardware Requirements
- **Processor:** Intel Core i5 (8th Gen or above) / AMD Ryzen 5 or better.
- **RAM:** 8 GB minimum (16 GB recommended).
- **Storage:** At least 1 GB free space.

---

## Installation & Running Locally

### Step 1: Clone the repository
```bash
git clone <repository-url>
cd bookstore
```

### Step 2: Configure Environment Variables
Create a `.env` file inside the `backend/` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bookstore
JWT_SECRET=supersecretkeychangeinproduction!
```

### Step 3: Populate Mock Data (Seeding)
Run the built-in database seed script to clear the database and add default users and 6 catalog books:
```bash
cd backend
npm run seed
```
*Seeding creates two mock users:*
- **Customer User:** `user@example.com` / password: `user123`
- **Admin User:** `admin@example.com` / password: `admin123`

### Step 4: Run the Backend Server
```bash
cd backend
npm start
```
The backend API server will run at `http://localhost:5000`.

### Step 5: Run the Frontend Dev Server
In a new terminal window:
```bash
cd frontend
npm install
npm run dev
```
The React frontend will be hosted at `http://localhost:5173`. Open it in your browser.
