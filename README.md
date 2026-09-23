# Estructura del Proyecto No Limits: Frontend & Backend

Este repositorio está organizado con separación modular de responsabilidades:

```text
Proyecto_Nolimits/
│
├── frontend/                   # FRONTEND (React 19 + TypeScript + Vite + Tailwind CSS)
│   ├── components/             # Componentes UI (Desktop, Widgets, Navbar, Botones Pixel)
│   ├── views/                  # Vistas del OS (Home, Catálogo, Detalle, Admin Sucursales)
│   ├── context/                # Estados globales (Auth, Carrito, Sucursal activa)
│   ├── routes/                 # Enrutamiento protegido por roles
│   ├── services/               # Conexión con Backend REST API
│   ├── types/                  # Tipados TypeScript compartidos
│   ├── index.css               # Sistema de diseño Y2K / Cyber-Goth
│   ├── main.tsx                # Punto de entrada de React
│   └── App.tsx                 # Contenedor raíz
│
├── backend/                    # BACKEND DEDICADO (Node.js + Express + TypeScript)
│   ├── src/
│   │   └── server.ts           # Servidor API REST (/api/products, /api/branches, etc.)
│   ├── package.json            # Dependencias del servidor backend
│   ├── tsconfig.json           # Configuración TypeScript del backend
│   └── .env.example            # Variables de entorno backend (puerto 5000, credenciales)
│
├── package.json                # Scripts principales (Frontend y Backend)
└── README.md
```

## Comandos para ejecutar en tu máquina local

1. **Instalar dependencias del proyecto:**
   ```bash
   npm install
   ```

2. **Iniciar el Frontend (React + Vite):**
   ```bash
   npm run dev
   ```
   *(Abre en `http://localhost:3000`)*

3. **Iniciar el Backend (API Express):**
   ```bash
   npm run dev:backend
   ```
   *(Abre en `http://localhost:5000/api`)*
