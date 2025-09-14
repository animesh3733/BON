# BON Rewards Backend System

A simple Node.js and MongoDB backend that simulates a credit card reward system, where users receive mock gift card rewards for consistently paying their last 3 bills on time.

---

## Features

- User management
- Bill management with amount and payment method tracking
- Bill payment processing
- Reward generation based on timely payments
- Modular structure using Express routers and controllers
- Validation utilities and UUID-based unique identifiers
- Centralized logging with Winston

---

## Technologies Used

- Node.js
- Express.js
- MongoDB (native driver)
- UUID for unique identifiers
- Winston for logging

---

## Getting Started

### Prerequisites

- Node.js (v16+ recommended)
- Access to a MongoDB instance (local or cloud)

### Installation

1. Clone the repository:

git clone <repo-url>
cd bon-rewards-backend

text

2. Install dependencies:

npm install

text

3. Configure MongoDB connection string via environment variable:

Create a `.env` file or set environment variable `MONGO_URI`:

MONGODB_URI=your-mongodb-connection-string

text

4. Start MongoDB server if using local MongoDB:

mongod


5. Run the server:

node app.js


The server will listen on port 3000 by default.

---

## Project Structure

/
├── app.js # Main Express application setup
├── db.js # MongoDB connection and reusable database functions
├── utils.js # Utility functions (validation, logging)
├── controller/
│ ├── user.js
│ └── bill.js
├── routes/
│ ├── user.js
│ └── bill.js
├── package.json
└── README.md


---

## Logging

- Logging is handled via **Winston**, outputting structured info and error messages with timestamps.
- Logging setup and helper functions are centralized in `utils.js`.
- Logs provide insights into operations and failures for easier debugging.

---

## Validation

- The system validates required fields on incoming requests for robustness.
- Missing required fields trigger informative error responses.

---

## Reward System Overview

- The system verifies if the user's last three bills were paid on time (on or before due dates).
- Rewards are issued only when this condition is met and prevents duplicate rewards for the same set of payments.
- The reward is a mock gift card (default: "$10 Amazon Gift Card") issued and tracked internally.

---

## Extensibility Notes

- Easily extendable to handle more complex bill data fields or business rules.
- Ready to integrate authentication or real payment processing.
- Can add support for advanced logging destinations or formats.
- Designed for clear modular growth and maintainability.

---

## Environment Variables

- `MONGO_URI`: MongoDB connection string (must be set to connect database).
- `PORT`: Port for the server

---

## License

MIT License

---

Contributions, feedback, and issues are welcome to improve the project further.