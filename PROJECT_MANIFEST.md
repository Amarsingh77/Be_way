# BeWay Project Manifest & Technical Documentation

This document provides a comprehensive overview of the technology stack, design philosophy, and functional modules implemented in the **BeWay** circular luxury fashion platform.

## 🚀 Quick Tech Stack Overview
At a glance, BeWay is built using the **MERN-like** stack:
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (Mongoose)
- **AI/ML Integration**: TensorFlow.js

## 📋 Prerequisites
Before running or developing the project locally, ensure your system has the following:
- **Node.js** (v18.x or higher)
- **npm** (Node Package Manager) or **yarn**
- **MongoDB** (installed locally or an accessible MongoDB Atlas string)
- **Git** (for version control)

---

## 🏗 Core Technology Stack

### Frontend (Client-Side)
Building a high-performance, cinematic user experience.
- **Framework**: [React 19](https://react.dev/) with [Vite](https://vitejs.dev/) as the build tool.
- **Styling**: [Tailwind CSS 3.4](https://tailwindcss.com/) with a custom luxury design system.
- **Motion & Fluidity**: [Framer Motion](https://www.framer.com/motion/) for premium transitions and hover effects.
- **State Management**: [Zustand](https://docs.pmnd.rs/zustand) for lean and fast global authentication state.
- **Navigation**: [React Router 7](https://reactrouter.com/) for sophisticated declarative routing.
- **Iconography**: [Lucide React](https://lucide.dev/) for crisp, scalable vector icons.
- **Machine Learning**: [TensorFlow.js](https://www.tensorflow.org/js) with **MobileNet** for future AI-powered image curation.
- **Visualization**: [Recharts](https://recharts.org/) for rendering environmental impact metrics.
- **Feedback**: [React Hot Toast](https://react-hot-toast.com/) for elegant, non-intrusive notifications.

### Backend (Server-Side)
A robust, secure API layer focused on scalability and performance.
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5](https://expressjs.com/) (latest beta features for performance).
- **Database**: [MongoDB](https://www.mongodb.com/) via [Mongoose 9](https://mongoosejs.com/) ODM.
- **Authentication**: Native JWT (JSON Web Tokens) with `cookie-parser` for secure session management.
- **Security**: 
  - **Helmet**: Headers security.
  - **Bcryptjs**: High-salt password hashing.
  - **Rate Limiting**: To prevent brute force on authentication endpoints.
- **Media Handling**: [Multer](https://github.com/expressjs/multer) for stream-based multipart image contributions.

---

## 🎨 Design Philosophy: "Refined Luxury"

The aesthetic is designed to feel like an **Atelier's Workshop**—sophisticated, dark, and rooted in heritage.

### Visual Tokens
- **Palette**:
  - `Obsidian`: `#050505` (The infinite canvas)
  - `Champagne Gold`: `#D4AF37` (The highlight of excellence)
  - `Deep Moss`: `#1A2421` (The sustainability anchor)
- **Glassmorphism**: Subtle `backdrop-blur` and low-opacity borders (`white/0.05`) to create layered depth.
- **Typography**:
  - `Fraunces`: For bold, editorial headings.
  - `Inter`: For clear, functional body text.
  - `Cormorant Garamond`: For serif-styled, italicized narratives.

---

## 📦 Major Modules & Features

### 1. The Archives (Marketplace)
A gallery of pre-loved items with advanced filtering for category, condition, and circular type (Sell/Donate/Charity).

### 2. The Curator's Atelier (Dashboard)
A personalized workspace where users track their:
- **Collection**: Current listings.
- **Acquisitions**: Past orders.
- **Legacy**: Impact on CO2, water savings, and landfill diversion.

### 3. Circular Curation (Sell Flow)
A multi-step narrative builder for listing items, including AI-suggested pricing to ensure fairness and rapid circularity.

### 4. Identity & Residence (Profile)
A centralized hub for managing public identity, contact details, and security credentials (password updates).

### 5. Sustainability Tracker
An algorithm-driven module that converts clothing reuse into real-world metrics (Trees planted, Water liters saved, CO2 reduced).

---

## 🛠 Project Structure

```text
Be_way/
├── client/              # React / Vite Frontend
│   ├── src/
│   │   ├── components/  # Reusable UI Atoms & Molecules
│   │   ├── pages/       # High-level View Containers
│   │   ├── store/       # Zustand Global State
│   │   └── utils/       # API Interceptors & Helpers
├── server/              # Node.js / Express Backend
│   ├── controllers/     # Business Logic
│   ├── models/          # Mongoose Schema Definitions
│   ├── routes/          # API Endpoint Mapping
│   └── uploads/         # Static Media Assets
└── PROJECT_MANIFEST.md  # This documentation
```

---

> [!NOTE]
> This platform is built for **intentionality**. Every line of code serves the narrative of extending a garment's story through the BeWay collective.
