# 🚼 DevPulse

> A collaborative platform for software teams to report bugs, suggest features, and coordinate resolutions.

[![Live URL](https://img.shields.io/badge/Live_Deployment-Visit_Site-success?style=for-the-badge)](https://your-live-deployment-link.vercel.app)

---

## 🚀 Features

- **Role-Based Access Control (RBAC):** Users can be `contributor` or `maintainer` with specific access privileges.
- **Secure Authentication:** JWT-based stateless authentication with `bcrypt` password hashing.
- **Issue Management:** Create, Read, Update, and Delete bugs and feature requests.
- **Advanced Filtering & Sorting:** Fetch issues based sort by creation date.
- **Raw SQL Execution:** 100% native PostgreSQL queries without any ORM, Query Builders, or SQL JOINs.
- **Standardized API Responses:** Consistent success and error response structures across all endpoints.

---

## 🛠️ Technology Stack

| Technology       | Description                                  |
| ---------------- | -------------------------------------------- |
| **Node.js**      | Runtime environment (v24.x LTS)              |
| **TypeScript**   | Strictly typed programming language          |
| **Express.js**   | Modular backend web framework                |
| **PostgreSQL**   | Relational Database                          |
| **pg (node-pg)** | Native PostgreSQL driver for Raw SQL queries |
| **bcryptjs**     | Password hashing (salt rounds: 10)           |
| **jsonwebtoken** | Secure token generation and verification     |

---

## ⚙️ Setup Instructions

Follow these steps to run the project locally:

### 1. Clone the repository

```bash
git clone https://github.com/nurulaminsw/DevPulse-B7A2.git
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the Server

For development mode:

```bash
npm run dev
```

For production build:

```bash
npm run build
npm start
```

---

## 4. Database Schema Summary

### `users` Table

| Column Name  | Data Type | Constraints            | Description                         |
| ------------ | --------- | ---------------------- | ----------------------------------- |
| `id`         | Serial    | PRIMARY KEY            | Auto-incrementing unique identifier |
| `name`       | String    | NOT NULL               | Full display name                   |
| `email`      | String    | UNIQUE                 | Valid login address                 |
| `password`   | String    | NOT NULL               | Encrypted password hash             |
| `role`       | Enum      | default: `contributor` | Determines system access level      |
| `created_at` | Timestamp | Auto                   | Account creation time               |
| `updated_at` | Timestamp | Auto                   | Last update time                    |

### `issues` Table

| Column Name   | Data Type | Constraints               | Description                         |
| ------------- | --------- | ------------------------- | ----------------------------------- |
| `id`          | Serial    | PRIMARY KEY               | Auto-incrementing unique identifier |
| `title`       | String    | max: 150                  | Short descriptive headline          |
| `description` | Text      | min: 20                   | Detailed explanation                |
| `type`        | Enum      | `bug` / `feature_request` | Categorizes the entry               |
| `status`      | Enum      | default: `open`           | Current workflow state              |
| `reporter_id` | Integer   | NOT NULL                  | References the user who submitted   |
| `created_at`  | Timestamp | Auto                      | Issue creation time                 |
| `updated_at`  | Timestamp | Auto                      | Last update time                    |

---

## 5. API Endpoints List

### Authentication

| Method | Endpoint           | Access | Description                 |
| ------ | ------------------ | ------ | --------------------------- |
| `POST` | `/api/auth/signup` | Public | Register a new user         |
| `POST` | `/api/auth/login`  | Public | Authenticate user & get JWT |

### Issues

| Method   | Endpoint          | Access                        | Description                                   |
| -------- | ----------------- | ----------------------------- | --------------------------------------------- |
| `POST`   | `/api/issues`     | Authenticated                 | Create a new issue                            |
| `GET`    | `/api/issues`     | Public                        | Get all issues (Supports sorting & filtering) |
| `GET`    | `/api/issues/:id` | Public                        | Get details of a specific issue               |
| `PATCH`  | `/api/issues/:id` | `maintainer` or `contributor` | Update an issue                               |
| `DELETE` | `/api/issues/:id` | `maintainer` only             | Delete an issue                               |

---

_Developed with ❤️ for the DevPulse Assignment._
