# API Endpoints

## Auth Routes

| Method | Endpoint             | Description       |
| ------ | -------------------- | ----------------- |
| POST   | `/api/auth/register` | Register new user |
| POST   | `/api/auth/login`    | Login user/admin  |

## Public Routes (No Auth Required)

| Method | Endpoint              | Description                  |
| ------ | --------------------- | ---------------------------- |
| GET    | `/api/admin/services` | Get all active services      |
| GET    | `/api/admin/gallery`  | Get all active gallery items |
| GET    | `/api/user/reviews`   | Get all active reviews       |

## User Routes (Auth Required)

| Method | Endpoint                                        | Description               |
| ------ | ----------------------------------------------- | ------------------------- |
| GET    | `/api/user/profile`                             | Get user profile          |
| PUT    | `/api/user/profile`                             | Update user profile       |
| POST   | `/api/user/reviews`                             | Create new review         |
| PUT    | `/api/user/reviews/:id`                         | Update own review         |
| DELETE | `/api/user/reviews/:id`                         | Delete own review         |
| GET    | `/api/user/appointments`                        | Get upcoming appointments |
| POST   | `/api/user/appointments`                        | Book new appointment      |
| PUT    | `/api/user/appointments/:id/reschedule`         | Request reschedule        |
| PUT    | `/api/user/appointments/:id/respond-reschedule` | Respond to reschedule     |
| PUT    | `/api/user/appointments/:id/cancel`             | Cancel appointment        |

## Admin Routes (Auth + Admin Required)

| Method | Endpoint                                 | Description               |
| ------ | ---------------------------------------- | ------------------------- |
| GET    | `/api/admin/profile`                     | Get admin profile         |
| PUT    | `/api/admin/profile`                     | Update admin profile      |
| PUT    | `/api/admin/profile/image`               | Update profile image      |
| POST   | `/api/admin/services`                    | Create service            |
| PUT    | `/api/admin/services/:id`                | Update service            |
| DELETE | `/api/admin/services/:id`                | Delete service            |
| POST   | `/api/admin/gallery`                     | Add gallery item          |
| PUT    | `/api/admin/gallery/:id`                 | Update gallery item       |
| DELETE | `/api/admin/gallery/:id`                 | Delete gallery item       |
| GET    | `/api/admin/availability`                | Get availability          |
| POST   | `/api/admin/availability/month`          | Set monthly schedule      |
| PUT    | `/api/admin/availability/day/:date`      | Update specific day       |
| GET    | `/api/admin/appointments`                | Get upcoming appointments |
| GET    | `/api/admin/appointments/history`        | Get past appointments     |
| PUT    | `/api/admin/appointments/:id/status`     | Update appointment status |
| PUT    | `/api/admin/appointments/:id/reschedule` | Request reschedule        |
