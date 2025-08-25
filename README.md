# 🎤 Voice Task Tracker

A **voice-first task tracker** built with **React + Vite** and styled using **Ant Design**.  
Easily add, edit, and manage your tasks with a modern, responsive interface.

---

## 🚀 Features
- ✅ Add, edit, and toggle tasks  
- 🎙️ Voice-first experience  
- 🎨 Styled with Ant Design  
- 🌍 Deployed on **GitHub Pages**  

---

## 🛠️ Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/karan98mehta/voice-task-tracker.git
cd voice-task-tracker
````

### 2. Install dependencies

Make sure you have [Node.js](https://nodejs.org/) (>=16) installed.

```bash
npm install
```

### 3. Run the app locally

```bash
npm run dev
```

This will start a local dev server (default: [http://localhost:5173](http://localhost:5173)).

---

## 🏗️ Build for Production

```bash
npm run build
```

This will generate a `dist` folder with optimized production assets.

---

## 🌍 Deployment (GitHub Pages)

This project is configured for **GitHub Pages deployment** using `gh-pages`.

1. Update **vite.config.js** with the correct repo name:

   ```js
   import { defineConfig } from "vite";
   import react from "@vitejs/plugin-react";

   export default defineConfig({
     plugins: [react()],
     base: "/voice-task-tracker/",
   });
   ```

2. Deploy with:

   ```bash
   npm run deploy
   ```

This will:

* Build the project (`vite build`)
* Publish the `dist` folder to the `gh-pages` branch

✅ Your site will be live at:
👉 `https://karan98mehta.github.io/voice-task-tracker/`

---

## 📂 Project Structure

```
voice-task-tracker/
├── public/          # Static assets
├── src/             # React components and app logic
│   ├── components/  # UI components (TaskCard, etc.)
│   ├── hooks/       # Custom hooks (if any)
|   ├── utils/       # utility func (if any)
│   └── App.jsx      # Root component
├── vite.config.js   # Vite configuration
├── package.json     # Project dependencies & scripts
└── README.md        # Documentation
```

---

## 🧑‍💻 Tech Stack

* ⚛️ [React](https://react.dev/)
* ⚡ [Vite](https://vitejs.dev/)
* 🎨 [Ant Design](https://ant.design/)
* 🚀 [gh-pages](https://www.npmjs.com/package/gh-pages)

---
