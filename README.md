# Inventory Pro — Frontend

## Apps en un mismo proyecto Vite

- **Catálogo público** (Doc 5): `/`, `/productos`, `/producto/:slug`, `/categoria/:slug`, `/nosotros`, `/contacto`
- **Panel admin** (Doc 4): `/admin/*` + `/login`

## Desarrollo

```bash
cd frontend
cp .env.example .env.local
npm install
npm run dev
```

Requiere backend en `VITE_API_URL` (ej. `http://localhost:3000/api`).

## Adaptaciones Doc 5 → Doc 3

| Doc 5 | Backend Doc 3 |
|-------|----------------|
| `GET /api/public/producto/:slug` | `GET /api/public/productos/:slug` |
| `GET /api/public/relacionados/:id` | `GET /api/public/productos/:slug/relacionados` |
| Orden "más vendidos" | No existe en API → UI usa **Destacados** |

Categorías se cargan desde la API (no se inventan Llaveros/Promociones).

## Build

```bash
npm run build
```
