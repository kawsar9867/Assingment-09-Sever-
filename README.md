# TutorSphere Server

The backend REST API server for the TutorSphere application.

## Technologies Used
- Node.js
- Express.js
- MongoDB Atlas
- JSON Web Token (JWT)
- Cors & Dotenv

## API Endpoints

### Auth Endpoint
- `POST /jwt` - Generate JWT access token for a user.

### Tutors Endpoints
- `GET /tutors` - Fetch all tutors (supports search by name query `search` and date filters `startDate`, `endDate`).
- `GET /tutors/limit` - Fetch top 6 tutors for home page banner/cards.
- `GET /tutors/:id` - Fetch details of a single tutor.
- `POST /tutors` (Private) - Add a new tutor session.
- `PUT /tutors/:id` (Private) - Edit tutor details.
- `DELETE /tutors/:id` (Private) - Delete a tutor session.

### Bookings Endpoints
- `POST /bookings` (Private) - Book a tutor session (decrements slot, enforces slot and session date restrictions).
- `GET /bookings` (Private) - Get all bookings for the logged-in student.
- `PATCH /bookings/:id` (Private) - Cancel a booking and mark it as cancelled.

## How to Run Locally
1. Run `npm install`
2. Create a `.env` file with `PORT` and `MONGODB_URI` and `ACCESS_TOKEN_SECRET`
3. Run `node index.js`
