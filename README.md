# ByMe Marketplace Web Prototype

Este proyecto es un prototipo Front (Vite + React) basado en el diseño de Figma.

## Requisitos

- Node.js LTS (recomendado 18+)

## Configuración de API (Auth)

Crea un archivo `.env` en la raíz (puedes partir de `.env.example`).

```bash
# Base URL del gateway de Auth
VITE_API_URL=http://localhost:3000/auth

# Alternativa (AWS API Gateway)
# VITE_API_URL=https://2xazk375c2.execute-api.us-east-1.amazonaws.com/auth
```

## Ejecutar en local

```bash
npm i
npm run dev
```

## Rutas principales

- `/login` (login)
- `/registro` (registro usuario)
- `/registro/profesional` (registro profesional)
- `/panel/usuario` (protegida)
- `/panel/profesional` (protegida)
- `/panel/admin` (protegida)
- `/perfil` (protegida; actualización de perfil)
