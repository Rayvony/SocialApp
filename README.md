# SocialApp – Challenge Técnico Angular

## 🚀 Descripción

Aplicación web tipo red social desarrollada en Angular como parte de un challenge técnico.  
El objetivo es construir una experiencia funcional y mantenible que permita a los usuarios interactuar mediante publicaciones, comentarios y autenticación simulada.

---

## 🧩 Tecnologías utilizadas

- Angular (Standalone Components)
- Signals Store (@ngrx/signals)
- Tailwind CSS 4
- TypeScript (strict mode)
- Storybook (documentación de componentes)
- LocalStorage (persistencia)

---

## 🎯 Funcionalidades

### 🔐 Login

- Login con email y contraseña (simulado)
- Validaciones:
  - Email requerido y formato válido
  - Contraseña requerida (mínimo 6 caracteres)
- Login con Google (mock)
- Redirección automática al feed al autenticarse

---

### 📰 Feed

- Listado de publicaciones (mock inicial)
- Crear nuevos posts:
  - Texto
  - Imagen opcional
- Likes en posts
- Comentarios por post
- Actualización en tiempo real del feed
- Persistencia en localStorage
- Logout con redirección al login

---

### 👤 Perfil

- Visualización de perfil propio y de otros usuarios
- Edición del nombre de usuario
- Listado de posts del usuario
- Estadísticas (posts, likes, comentarios)

---

## 🧠 Manejo de estado

Se utilizó Signals Store (@ngrx/signals) para gestionar el estado global:

- AuthStore → usuario autenticado
- PostsStore → publicaciones
- CommentsStore → comentarios
- UiStore → UI (toasts, tema, sidebar)

Persistencia completa en localStorage.

---

## 🧱 Arquitectura

Se implementó una estructura basada en Atomic Design:

src/app/
core/
ui/ → Átomos (Button, Input, Icon)
molecules/ → Componentes compuestos
organism/ → Componentes complejos (PostCard, Layout)

pages/
login/
feed/
profile/

store/
auth/
posts/
comments/
ui/

### Características

- Standalone Components
- Separación clara de responsabilidades
- Reutilización de componentes
- Tipado estricto

---

## 🎨 UI / UX

- Diseño responsivo
- Sistema de diseño basado en variables CSS + Tailwind
- Dark mode
- Animaciones suaves
- Feedback visual (toasts, hover states, etc.)

---

## 📚 Storybook

Se documentaron los siguientes componentes:

- Formulario de Login
- Card de Publicación (PostCard)

### Ejecutar Storybook

ng run it-rock:storybook

---

## ⚙️ Instalación

git clone https://github.com/Rayvony/SocialApp/
cd socialapp
npm install

---

## 🧪 Desarrollo

ng serve

Aplicación disponible en:
http://localhost:4200

---

## 🚀 Build

ng build

---

## 🌐 Deploy

👉 URL: [Link al deploy](https://social-app-theta-lyart.vercel.app/login)

### Proceso

- Deploy realizado en Vercel
- Build automático desde GitHub
- Configuración para soportar rutas dinámicas (SPA fallback)

---

## 📌 Notas

- No se utiliza backend real
- Autenticación completamente mockeada
- Persistencia mediante localStorage
