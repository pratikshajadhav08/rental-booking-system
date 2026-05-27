# StayFinder - Full Stack Rental Booking System

StayFinder is a MERN-style full-stack rental booking platform inspired by Airbnb. It supports three application layers: guests/users, hosts/owners, and admins.

## Project Status

This project is complete as a portfolio or academic full-stack rental booking system. It includes authentication, role-based routing, listing management, bookings, favorites, profile management, admin approval tools, dashboards, and a mock payment flow.

For production use, add real payment verification, file/image storage hardening, email/SMS notifications, automated tests, rate limiting, audit logs, and deployment security cleanup.

## Tech Stack

**Frontend**
- React
- Vite
- React Router
- Axios
- Tailwind CSS utility classes
- Lucide React icons
- React Datepicker

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs password hashing
- CORS

## Main Features

### Guest/User Layer
- Register and login as user
- Browse approved listings
- Search and filter stays
- View listing details
- Save favorites
- Book a stay with check-in/check-out dates
- Mock payment method selection
- View booking history
- Cancel bookings
- Update profile

### Host/Owner Layer
- Register and login as host
- Host dashboard
- Add property/listing
- View own properties
- Delete own properties
- View bookings for owned listings
- Update booking status
- Update profile

### Admin Layer
- Admin dashboard
- Manage users
- Change user roles
- Delete users
- View all listings
- Approve or reject host listings
- View all bookings
- View reviews
- View basic reports
- Update profile

### Shared Pages
- Home
- Listings
- Listing details
- About us
- Contact
- Profile
- Footer and role-aware navbar

## Folder Structure

```text
airbnb-clone/
  client/
    src/
      api/
      components/
      pages/
      utils/
    package.json
  server/
    config/
    controllers/
    middleware/
    models/
    routes/
    utils/
    package.json
    seed.js
```

## Environment Variables

Create `server/.env`:

```env
PORT=5001
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173

RAZORPAY_KEY_ID=optional_for_future_real_payment
RAZORPAY_KEY_SECRET=optional_for_future_real_payment
CLOUDINARY_CLOUD_NAME=optional_for_future_uploads
CLOUDINARY_API_KEY=optional_for_future_uploads
CLOUDINARY_API_SECRET=optional_for_future_uploads
```

Do not commit real secrets to a public repository.

## Installation

Install backend dependencies:

```bash
cd server
npm install
```

Install frontend dependencies:

```bash
cd ../client
npm install
```

## Run The Project

Start backend:

```bash
cd server
npm start
```

Start frontend:

```bash
cd client
npm run dev
```

Open:

```text
http://localhost:5173
```

Backend health check:

```text
http://localhost:5001/api/health
```

## Seed Demo Data

Run:

```bash
cd server
npm run seed
```

Demo accounts:

```text
Host:
email: host@stayfinder.com
password: password123

Admin:
email: admin@stayfinder.com
password: password123
```

You can register a normal user from the frontend.

## Important Routes

### Frontend Routes

```text
/                         User home
/login                    Login
/register                 Register
/listings                 Public listings
/listings/:id             Listing details
/favorites                User favorites
/bookings                 User bookings
/profile                  Profile settings
/about                    About us
/contact                  Contact

/host/dashboard           Host dashboard
/host/add-property        Add listing
/host/listings            Host properties
/host/bookings            Host bookings

/admin/dashboard          Admin dashboard
/admin/users              Manage users
/admin/listings           Manage listings
/admin/bookings           Manage bookings
/admin/reviews            Reviews
/admin/reports            Reports
```

### Backend API Routes

```text
/api/auth/register
/api/auth/login
/api/auth/profile

/api/listings
/api/listings/:id

/api/bookings
/api/bookings/my
/api/bookings/:id/status
/api/bookings/:id/cancel

/api/favorites/my
/api/favorites/:listingId

/api/host/dashboard
/api/host/properties
/api/host/bookings

/api/admin/dashboard
/api/admin/users
/api/admin/listings
/api/admin/bookings
/api/admin/reviews
/api/admin/reports
```

## Role Behavior

After login:

- User goes to the traveler home page.
- Host goes to the host dashboard.
- Admin goes to the admin dashboard.

The navbar changes automatically based on the logged-in role.

## Payment

The current project uses a mock payment flow. Users can choose:

- Card
- UPI
- Wallet
- Pay at property

The booking stores payment method and payment status. For production, integrate Razorpay order creation and server-side payment verification.

## Build

Frontend production build:

```bash
cd client
npm run build
```

## Known Production Improvements

- Add real Razorpay checkout and webhook/payment verification
- Add Cloudinary image uploads for property photos and avatars
- Add email notifications for booking confirmations
- Add review creation from completed bookings
- Add pagination for admin and listing pages
- Add test coverage
- Add request validation middleware
- Add rate limiting
- Add password reset
- Add deployment config for frontend and backend
- Rotate all exposed credentials before public release

## Author

StayFinder rental booking system.
