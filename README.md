# TechSaarthi

TechSaarthi is a two-part web application with a React frontend and an Express/MongoDB backend. It includes user authentication, role-based signup for users/colleges/government, chat and notice features, cloud uploads, and AI/Vector search support via Pinecone and Google GenAI.

## Key Features

- User authentication and registration
- Role-based signup: user, college, government
- Chat functionality with socket support
- Notice creation and upload
- AI and vector search integrations
- Cloudinary uploads for media handling
- Redis support for caching and token handling

## Tech Stack

- Frontend: React, Vite, React Router, Redux Toolkit, Axios
- Backend: Node.js, Express, MongoDB, Mongoose
- Auth: JWT, bcrypt, cookies
- Real-time: Socket.IO
- Cloud: Cloudinary
- AI / Vector data: Pinecone, Google GenAI
- Cache / session: Redis

## Project Structure

```
TechSaarthi/
├── Backend/
│   ├── src/
│   │   ├── app.js
│   │   ├── server.js
│   │   ├── controller/
│   │   ├── db/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   └── utils/
│   └── package.json
├── Frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   ├── components/
│   │   ├── Layout/
│   │   ├── Pages/
│   │   ├── store/
│   │   ├── Styles/
│   │   └── assets/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
└── package.json
```

## Prerequisites

- Node.js 18+ or compatible
- npm 10+ or compatible
- MongoDB URI
- Redis server
- Cloudinary account with `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Google GenAI and Pinecone credentials if using AI features

## Setup

### Backend

1. Open a terminal in `Backend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `Backend/` with values similar to:
   ```env
   PORT=3000
   MONGODB_URI=<your-mongodb-uri>
   ACCESS_TOKEN_SECRET=<your-jwt-secret>
   REFRESH_TOKEN_SECRET=<your-refresh-token-secret>
   REDIS_URL=<your-redis-url>
   CLOUDINARY_CLOUD_NAME=<cloud-name>
   CLOUDINARY_API_KEY=<cloudinary-api-key>
   CLOUDINARY_API_SECRET=<cloudinary-api-secret>
   PINECONE_API_KEY=<pinecone-api-key>
   PINECONE_ENVIRONMENT=<pinecone-environment>
   GOOGLE_PROJECT_ID=<google-project-id>
   GOOGLE_LOCATION=<google-location>
   GOOGLE_MODEL=<google-model>
   ```
4. Start the backend server:
   ```bash
   npm run dev
   ```

### Frontend

1. Open a terminal in `Frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in `Frontend/` if needed:
   ```env
   VITE_API_BASE=http://localhost:3000
   ```
4. Start the frontend dev server:
   ```bash
   npm run dev
   ```

## Running the App

- Backend runs on `http://localhost:3000` by default
- Frontend runs on `http://localhost:5173` by default

## Available Backend Scripts

- `npm run dev` — run backend with nodemon
- `npm start` — run backend with Node

## Available Frontend Scripts

- `npm run dev` — start Vite development server
- `npm run build` — build production bundle
- `npm run preview` — preview production build locally
- `npm run lint` — run ESLint checks

## Notes

- The frontend and backend are separate packages. Install dependencies in both folders.
- If you use a browser proxy or CORS, confirm the backend `cors` settings in `Backend/src/app.js`.
- Replace placeholder secrets in `.env` before deployment.

## Contact

For any issues or further enhancements, update the backend routes, middleware, or frontend pages as needed based on the features in `Backend/src/` and `Frontend/src/`.
