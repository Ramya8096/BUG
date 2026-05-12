# 🐞 BUGSPRINT — AI-Powered Bug Tracker

A modern, microservices-based bug tracking system with AI-powered features.

## 🚀 Getting Started

### 1. Prerequisites
- Java 17+
- Maven 3.8+
- PostgreSQL 16
- Google Gemini API Key

### 2. Database Setup
Create the following databases in PostgreSQL:
- `bugsprint_users`
- `bugsprint_projects`
- `bugsprint_bugs`
- `bugsprint_ai`
- `bugsprint_notifications`

You can use the [seed-data.sql](seed-data.sql) to populate initial data.

### 3. Backend Setup
1. Set the environment variable `GEMINI_API_KEY`.
2. Build the project:
   ```bash
   mvn clean install -DskipTests
   ```
3. Start services in this order:
   - `infrastructure/service-registry` (8761)
   - `infrastructure/config-server` (8888)
   - `infrastructure/api-gateway` (8080)
   - All other services in `services/`

### 4. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
2. Open `http://localhost:3000`.

## 🧠 AI Features
- **Auto-Classify**: Automatically predicts priority and category when a bug is reported.
- **Duplicate Detect**: (Logic skeleton in AI Service)
- **Smart Assign**: Suggests and assigns the best developer for a bug based on category.

## 🛠 Tech Stack
- **Backend**: Spring Boot 3, Spring Cloud, JWT, PostgreSQL, Flyway, OpenFeign.
- **Frontend**: React 18, Vite, Tailwind CSS, @hello-pangea/dnd (Kanban).
- **AI**: Google Gemini API.
