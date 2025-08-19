# 🍕 Foundry Pizza Ordering Application

A demo application built with **React + Vite + Palantir Foundry Ontology SDK (OSDK)**.  
It simulates a **pizza ordering workflow** — from browsing the menu, to adding items to a cart, placing an order, and updating inventory in real time.  

This project showcases how frontend apps can integrate with **Foundry Ontologies** using OSDK v2.1+ best practices.

---

## ✨ Features
- 📋 **Pizza Menu & Ingredients** – Built from `HemanthPizzaMenu` linked to `HemanthPizzaType`.  
- 🛒 **Cart System** – Add/remove pizzas with size & price options (`Home.tsx`, `Layout.tsx`).  
- 📦 **Order Placement** – Creates `HemanthOrderStatus` and `HemanthOrderDetails` objects.  
- 📊 **Inventory Management** – Deducts ingredients in real time via Ontology actions.  
- 🔗 **Ontology SDK Integration** – Uses `client.ts` for OSDK data fetching.  
- 🖼️ **Mock Mode** – Supports running locally without Foundry access.  
- 🔐 **Auth Callback** – OAuth flow handled in `AuthCallback.tsx`.  

---

## 🛠 Tech Stack
- **Frontend:** React + Vite + TypeScript  
- **Styling:** CSS Modules (`Home.module.css`, `Layout.module.css`)  
- **Backend/Data:** Palantir Foundry Ontology SDK (OSDK)  
- **Testing:** `env.test.ts`  
- **CI/CD:** GitHub Actions + Foundry CI  

---

## 📂 Project Structure
src/
components/ # UI components
hooks/ # Custom React hooks
model/ # Data models/types
pages/ # App pages
AuthCallback.tsx # Handles Foundry OAuth redirect
client.ts # OSDK client integration
env.test.ts # Env variable validation test
Home.tsx # Main pizza menu + cart
Layout.tsx # Layout wrapper
main.tsx # App entry point
vite-env.d.ts # Vite type definitions

---

## ▶️ Run Locally
Clone the repo and install dependencies:

```bash
git clone https://github.com/hemanth-sani/foundry-pizza-orders.git
cd foundry-pizza-orders
npm install
npm run dev
```
The app will be available at http://localhost:8080
.

🔑 Environment Variables

Create a .env file based on .env.example:
```
VITE_USE_MOCK=true
VITE_FOUNDRY_STACK_URL=https://your-foundry-stack
VITE_FOUNDRY_APP_ID=your-app-id
```

VITE_USE_MOCK=true → uses local mock data.

VITE_USE_MOCK=false → connects to Foundry (requires valid credentials).



🚀 CI/CD

A simple CI workflow can be added to validate builds on every push:
```
.github/workflows/ci.yml

name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run build
      - run: npm run lint --if-present
```

📘 Learnings

Building React apps with Foundry Ontology SDK (OSDK).

Linking Ontology objects (Pizza → PizzaType → Inventory).

Designing inventory-aware workflows with Ontology actions.

Using mock mode vs. real Foundry mode.