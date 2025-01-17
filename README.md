# Sanchez Barber Shop Management System

## Overview

A full-stack web application for managing a barber shop's appointments, services, and customer interactions. The system provides a seamless experience for both customers and administrators, featuring a modern, responsive design with a gold and black theme.

## Key Features

### User Features

- **Authentication**: Secure user registration and login system
- **Appointment Management**:
  - Book new appointments with preferred time slots
  - View upcoming and past appointments
  - Reschedule or cancel existing appointments
  - Receive status updates on appointments
- **Reviews & Feedback**:
  - Submit reviews for completed services
  - View other customers' reviews
  - Edit or remove own reviews

### Admin/Barber Features

- **Appointment Control**:
  - View and manage all appointments
  - Accept or reject appointment requests
  - Handle reschedule requests
  - Mark appointments as completed
- **Schedule Management**:
  - Set daily availability
  - Block off dates/times
  - Manage working hours
- **Service Management**:
  - Add/edit available services
  - Set pricing and duration
  - Enable/disable services
- **Gallery Management**:
  - Upload work samples
  - Manage portfolio images
  - Showcase haircut styles

### Additional Features

- Real-time availability updates
- Responsive design for mobile and desktop
- Intuitive booking interface
- Automated email notifications
- User-friendly dashboard interfaces

## Technology Stack

### Frontend

- React 18 with TypeScript
- Vite for build tooling
- State Management:
  - Zustand for global state
  - TanStack Query (React Query) for server state
- Routing: React Router DOM
- UI Components:
  - FullCalendar for scheduling
  - React Select for enhanced dropdowns
  - React Icons
- Styling: SASS/SCSS
- HTTP Client: Axios
- Date Management:
  - Date-fns
  - Day.js

### Backend

- Node.js with Express
- MongoDB with Mongoose ODM
- Authentication:
  - JWT (jsonwebtoken)
  - bcryptjs for password hashing
- Image Upload:
  - Cloudinary
  - Multer
- Validation: Express Validator
- Development Tools:
  - Morgan for logging
  - CORS for cross-origin requests
  - dotenv for environment variables

This application streamlines the barber shop management process while providing a professional and user-friendly experience for both customers and administrators.
