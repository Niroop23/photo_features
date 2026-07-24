# Photography Club Website (NITK)

Website for the Photography Club, NITK — a React frontend backed by Strapi CMS and an Express auth server.

## Project structure

```
photo_features/
├── src/              React frontend (Vite)
├── public/           Static assets
├── backend/          Strapi CMS (posts, categories, media)
├── node-server/      Express API (Google OAuth + JWT)
├── .env              Frontend env (Vite)
└── package.json      Frontend dependencies
```

| Service      | Port | Purpose                          |
| ------------ | ---- | -------------------------------- |
| Frontend     | 5173 | React UI (Vite dev server)       |
| Strapi       | 1337 | Content API & admin panel          |
| Auth server  | 5000 | Google login, JWT issue/verify     |

## Prerequisites

- Node.js 20+
- npm

## Environment setup

Each part of the repo has its own `.env` file (gitignored). Dummy values are pre-filled for local dev — replace secrets and the Google client ID before deploying.

### Root (frontend)

```env
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### `node-server/`

```env
PORT=5000
GOOGLE_CLIENT_ID=your-google-oauth-client-id   # must match frontend client ID
JWT_SECRET=your-jwt-secret
```

### `backend/` (Strapi)

See `backend/.env.example`. Minimum required:

```env
HOST=0.0.0.0
PORT=1337
APP_KEYS=key1,key2
API_TOKEN_SALT=...
ADMIN_JWT_SECRET=...
TRANSFER_TOKEN_SALT=...
JWT_SECRET=...
ENCRYPTION_KEY=...
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db
```

For Postgres, set `DATABASE_CLIENT=postgres` and uncomment the Postgres vars in `backend/.env`.

### Google OAuth

1. Create an OAuth 2.0 client in [Google Cloud Console](https://console.cloud.google.com/).
2. Add authorized JavaScript origins: `http://localhost:5173`
3. Copy the client ID into both root `.env` (`VITE_GOOGLE_CLIENT_ID`) and `node-server/.env` (`GOOGLE_CLIENT_ID`).

## Running locally

Open three terminals:

```bash
# 1. Strapi CMS
cd backend
npm install
npm run dev

# 2. Auth server
cd node-server
npm install
npm run dev

# 3. Frontend
npm install
npm run dev
```

- Site: http://localhost:5173
- Strapi admin: http://localhost:1337/admin
- Auth test page: http://localhost:5173/auth-test

## Scripts (frontend)

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start Vite dev server    |
| `npm run build` | Production build         |
| `npm run lint`  | Run ESLint               |
| `npm run preview` | Preview production build |

## Auth flow

1. User clicks Google Sign-In on the frontend (`@react-oauth/google`).
2. Frontend sends the Google ID token to `POST http://localhost:5000/api/auth/google`.
3. Auth server verifies the token, checks `@nitk.edu.in` email, and returns a JWT.
4. Protected routes use `Authorization: Bearer <token>` with `GET /api/auth/me`.

## Notes

- Lock files (`package-lock.json`) should be committed. Use npm consistently — remove `pnpm-lock.yaml` if you are not using pnpm.
- Strapi uploads live in `backend/public/uploads/` (gitignored except `.gitkeep`).
- Replace all dummy secrets in `.env` files before any deployment.
