# Photography Club Website (NITK)

## Quick Start

### 1. Clone the repository

``` bash
git clone <repo-url>
cd <repo-name>
```

## 2. Install dependencies

### Frontend

``` bash
npm install
```

### Strapi Backend

``` bash
cd backend
npm install
cd ..
```

### Auth Server

``` bash
cd node-server
npm install
cd ..
```

## 3. Configure environment variables

### Root `.env`

``` env
VITE_GOOGLE_CLIENT_ID=your-google-oauth-client-id
```

### `node-server/.env`

``` env
PORT=5000
GOOGLE_CLIENT_ID=your-google-oauth-client-id
JWT_SECRET=your-jwt-secret
```

### `backend/.env`

Copy `backend/.env.example` and update the required values.

## 4. Run the project

Open **three terminals**.

### Terminal 1 -- Strapi

``` bash
cd backend
npm run dev
```

### Terminal 2 -- Auth Server

``` bash
cd node-server
npm run dev
```

### Terminal 3 -- Frontend

``` bash
npm run dev
```
------------------------------------------------------------------------

# Common Issues

-   Run `npm install` in the frontend, `backend`, and `node-server`.
-   Ensure the frontend and auth server use the same Google OAuth Client
    ID.
