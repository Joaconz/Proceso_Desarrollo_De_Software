# TPO – Frontend (React/Vite)
Este proyecto es el **frontend** del Trabajo Práctico Obligatorio (TPO) de la asignatura *Proceso de Desarrollo de Software* (UADE). Consume la API RESTful del backend y brinda una interfaz moderna, dinámica y visualmente atractiva para crear, buscar y gestionar partidos deportivos.
---
## 🚀 Tecnologías
| Área | Herramienta |
|------|-------------|
| **Framework** | React 18 + Vite |
| **Lenguaje** | TypeScript |
| **UI** | Shadcn UI components, CSS vanilla |
| **Estado** | `useState`, `useEffect`, React Context |
| **Peticiones** | `fetch` encapsulado en `src/services/api.ts` |
| **Testing** | Vitest + React Testing Library |
| **Lint/Format** | ESLint + Prettier |
| **Versionado** | Git |
---
## 🏗️ Arquitectura y patrones de UI
- **Component‑Based**: Cada pantalla está aislada en `src/pages/`.
- **Container‑Presentation**: Los *containers* gestionan datos; los componentes UI (`Button`, `Card`, `Modal`, `Badge`) son reutilizables.
- **State‑Driven UI**: Los botones de acción en `MatchDetail` se renderizan según el **estado del partido** y el **rol del usuario** (creador vs. participante).
- **Optimistic UI Updates**: Se actualiza el estado local antes de la respuesta del servidor para una mejor UX.
- **Responsive Design**: Layout flexible con CSS Grid/Flex y media queries.
---
## 📂 Estructura del proyecto
```
frontend/
├─ public/                # assets estáticos
├─ src/
│  ├─ assets/            # imágenes, íconos
│  ├─ components/        # UI genérica (Button, Card, Modal, …)
│  ├─ layouts/           # Layouts comunes (MainLayout, AuthLayout)
│  ├─ pages/             # Vistas principales (Dashboard, CreateMatch, MatchDetail, …)
│  ├─ services/
│  │   └─ api.ts         # wrapper de fetch con funciones CRUD de partidos
│  ├─ types/             # definiciones TypeScript (Match, User, Sport, …)
│  ├─ App.tsx            # router y providers globales
│  └─ main.tsx           # bootstrap Vite + ReactDOM
├─ vite.config.ts
├─ tsconfig.json
├─ eslint.config.js
└─ package.json
```
---
## 🛠️ Cómo arrancar el entorno de desarrollo
1. **Requisitos**: Node ≥ 20, npm ≥ 10 (o yarn/pnpm).
2. **Instalación**
```bash
git clone <repo‑url>
cd frontend
npm install   # o yarn install / pnpm i
```
3. **Ejecutar en modo desarrollo**
```bash
npm run dev   # Vite levanta http://localhost:5173
```
   - La aplicación se conecta a la API en `http://localhost:8080`. Cambia `VITE_API_URL` en `.env` si es necesario.
4. **Compilar para producción**
```bash
npm run build   # genera ./dist
```
5. **Ejecutar tests**
```bash
npm test        # Vitest + React Testing Library
```
---
## 📡 Integración con la API (frontend/src/services/api.ts)
| Acción | Función | Endpoint backend |
|--------|---------|-----------------|
| Crear partido | `createMatch(payload)` | `POST /api/partidos/crear` |
| Unirse a partido | `joinMatch(id, userId)` | `POST /api/partidos/{id}/unirse/{userId}` |
| Confirmar | `confirmMatch(id)` | `POST /api/partidos/{id}/confirmar` |
| Iniciar | `startMatch(id)` | `POST /api/partidos/{id}/iniciar` |
| Finalizar | `finishMatch(id)` | `POST /api/partidos/{id}/finalizar` |
| Cancelar | `cancelMatch(id)` | `POST /api/partidos/{id}/cancelar` |
| Abandonar | `leaveMatch(id, userId)` | `POST /api/partidos/{id}/abandonar/{userId}` |
| Editar | `editMatch(id, data)` | `PUT /api/partidos/{id}` |
| Listar partidos | `getMatches()` | `GET /api/partidos` |
| Detalle partido | `getMatchById(id)` | `GET /api/partidos/{id}` |
---
## 🎨 Diseño y experiencia de usuario
- **Estética premium**: colores corporativos, tipografía *Inter*, sombras suaves y micro‑animaciones.
- **Feedback visual**: banners de error/success, indicadores de carga y badges que muestran el estado del partido.
- **Accesibilidad**: atributos `aria-*`, foco visible y contraste adecuado.
---
## 📦 Deploy
El proyecto está listo para servir como aplicación estática (NGINX, Vercel, Netlify, etc.). Solo copia el contenido de `dist/` y asegura que `VITE_API_URL` apunte al backend productivo.
