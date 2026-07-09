# HSI Mini Project E Commerce API

A RESTful e‑commerce with product management, user authentication, and a shopping cart.  
Built as a mini project for HSI OJT following the 10-day/2 weeks guideline. Chosen project is Simple E-Commerce API that primarly focuses on creating and testing API routing.

## Tech Stack
- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** MongoDB Atlas (Mongoose 8)
- **Authentication:** JWT + bcryptjs
- **Validation:** express-validator
- **Deployment:** Render (free tier)

## Live URL
**https://hsi-ecommerceapi.onrender.com**

## Features
- User registration & login (JWT authentication)
- Products CRUD with validation
- Shopping cart per user (add, remove, update, clear)
- Order checkout with stock management
- Protected routes via JWT middleware
- Input validation with express-validator
- Request logging middleware

## Demo Data
- **Test user:** `demo@example.com` / `password123`
- **Products:** 6 seeded products across Electronics, Sports, Home, and Accessories
