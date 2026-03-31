# OMS Frontend (Vite + React)

## Local Run
1. Install dependencies:
```bash
npm install
```
2. Create `.env` from `.env.example` and set:
```env
VITE_API_BASE_URL=http://localhost:8080/api
```
3. Start dev server:
```bash
npm run dev
```

## Deploy Frontend on Vercel
1. Push this `osm-frontend` folder to GitHub.
2. Open [Vercel](https://vercel.com) and click `Add New Project`.
3. Import your GitHub repo.
4. Set these values in Vercel project settings:
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. Add environment variable:
   - Key: `VITE_API_BASE_URL`
   - Value: `https://<your-backend-domain>/api`
6. Deploy.

Note: `vercel.json` already includes SPA rewrite so routes like `/dashboard` work on refresh.

## Backend Note
Vercel is best for frontend. Deploy Spring Boot backend separately (Render/Railway/EC2).

When backend is deployed, update backend CORS:
```properties
app.cors.allowed-origins=http://localhost:5173,https://<your-vercel-domain>
```
