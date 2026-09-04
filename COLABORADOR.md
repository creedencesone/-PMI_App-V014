# Guía de Onboarding para Colaboradores

Bienvenido al proyecto PMI_App. Sigue estos pasos para configurar tu entorno de desarrollo.

## Prerrequisitos

- **Node.js 18+** (descarga desde [nodejs.org](https://nodejs.org))
- **Git** (descarga desde [git-scm.com](https://git-scm.com))
- Cuentas en:
  - **GitHub** — para acceso al repositorio
  - **Vercel** — para despliegues automáticos
  - **Supabase** — para las credenciales del backend

## Primeros pasos

```bash
git clone https://github.com/creedencesone/PMI_App-V014.git
cd PMI_App-V014
cp .env.example .env.local
npm install
npm run dev
```

1. Abre el archivo `.env.local` y rellena las credenciales de Supabase que te proporcionará el administrador del proyecto.
2. Accede a la aplicación en `http://localhost:5173`.

## Flujo de trabajo Git

- **Nunca hagas push directo a `main`.** Siempre trabaja en una rama de features.
- Crea una rama descriptiva para cada tarea:
  ```bash
  git checkout -b feature/nombre-descriptivo
  ```
- Cuando termines tu cambio, sube la rama y crea un **Pull Request (PR)** para que sea revisado y fusionado a `main`.

## Despliegue

- **Producción:** Cada push a `main` despliega automáticamente en Vercel.
- **Preview:** Cada PR genera un despliegue de preview en Vercel para revisión.

## Credenciales

- El archivo `.env.local` contiene las credenciales de Supabase. **Nunca lo subas al repositorio.**
- Si necesitas acceso a las credenciales, contacta al administrador del proyecto.
