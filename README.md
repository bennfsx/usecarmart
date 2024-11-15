# Used Car Marketplace Application

A web-based platform for buying and selling used cars, featuring user roles (admin, seller, buyer, and agent), user reviews, and a streamlined BCE (Boundary, Controller, Entity) architecture. The application is divided into a React.js frontend and a Python backend using Flask, with Supabase as the database.

---

## Features

### Frontend
- Built with React.js and styled using Tailwind CSS.
- Login and registration functionality with JWT-based authentication.
- User roles: Admin, Seller, Buyer, and Agent.
- Features for buyers:
  - View, search, and favorite car listings.
  - Submit reviews for agents.
- Features for sellers:
  - Create, edit, and manage car listings.
  - Submit reviews for agents.
- User profile pages for viewing and editing personal information.
- Responsive and modern UI for seamless user experience.

### Backend
- Built with Python Flask following the **BCE (Boundary, Controller, Entity)** architecture.
  - **Boundary**: Handles HTTP requests (e.g., `registerBoundary.py`, `loginBoundary.py`, `favoriteBoundary.py`).
  - **Controller**: Contains business logic (e.g., `controller.py` for handling logic).
  - **Entity**: Interacts with the database (e.g., `userEntity.py`, `favorite.py`).
- User authentication with hashed passwords and role-based differentiation.
- RESTful API for:
  - User registration and login.
  - Fetching, creating, and updating car listings.
  - Managing reviews by agents.
  - Viewing and editing user profiles.
- Supabase used as the database for secure and scalable data management.

### Database
- Supabase (PostgreSQL) with tables for users, car listings, reviews, and favorites.
- JWT token generation for secure authentication.

---

## Technology Stack

### Frontend
- **Framework**: React.js
- **Styling**: Tailwind CSS
- **HTTP Client**: Axios

### Backend
- **Framework**: Flask
- **Database**: Supabase (PostgreSQL)
- **Architecture**: BCE (Boundary, Controller, Entity)
- **Authentication**: JWT with `pyjwt` library
- **Password Security**: Hashing using `bcrypt`

---

## Prerequisites

### System Requirements
- Node.js (for the frontend)
- Python 3.9 or higher (for the backend)
- Supabase account (for the database)

### Environment Variables
Create a `.env` file in the backend root directory with the following variables:
```plaintext
SUPABASE_URL=<your-supabase-url>
SUPABASE_KEY=<your-supabase-key>
SECRET_KEY=<your-secret-key>
