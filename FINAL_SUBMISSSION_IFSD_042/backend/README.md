Backend - AI Interview Practice

Quick start
1. Copy .env.example to .env and update MONGO_URI and other values.
2. Install dependencies: npm install
3. Run dev server: npm run dev (requires nodemon) or node server.js
4. Health check: GET /api/test
5. AI endpoint: POST /api/ai with JSON {question, transcript, time_allowed}
