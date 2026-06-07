# 📋 Notice Board

A modern, responsive Notice Board web application with full CRUD (Create, Read, Update, Delete) support. Built with Next.js, Prisma, and Tailwind CSS.

![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

## Features

- ✅ Full CRUD operations on notices
- ✅ Urgent notices always sort above Normal (Prisma-level ordering)
- ✅ Red "Urgent" badge on urgent notice cards
- ✅ Shared Add/Edit form with pre-population
- ✅ Delete confirmation modal
- ✅ Server-side validation on all required fields
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Dark mode with glassmorphism UI

---

## 🚀 How to Run Locally

1. **Clone the repository**

   ```bash
   git clone https://github.com/kartikeya18-srivastava/Notice-Board.git
   cd Notice-Board
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory:

   ```env
   DATABASE_URL="mysql://user:password@host:port/dbname?ssl-mode=require"
   ```

   Use a hosted MySQL database (TiDB Cloud, PlanetScale, etc.) — **not SQLite**.

4. **Run database migrations**

   ```bash
   npx prisma migrate dev --name init
   ```

5. **Start the development server**

   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 💡 One Thing to Improve

**Image upload via Cloudinary** — Currently, image support is limited to pasting a URL. A natural improvement would be integrating Cloudinary (or a similar service) for drag-and-drop image uploads directly from the notice form. This would make the app significantly more user-friendly for non-technical users who don't have image URLs readily available.

---

## 🤖 AI Usage

I used **Claude (Anthropic)** to assist with:

- Scaffolding the initial Next.js Pages Router project structure
- Generating the Prisma schema and API route boilerplate
- Designing the Tailwind CSS component styles (glassmorphism cards, gradient hero)
- Writing server-side validation logic for the API routes

All code was reviewed, understood, and adapted to fit the project requirements. The overall architecture and design decisions were my own.

---

## Tech Stack

| Layer           | Technology           |
| --------------- | -------------------- |
| Framework       | Next.js 16 (Pages Router) |
| Database Access | Prisma ORM v6        |
| Database        | TiDB Cloud (MySQL)   |
| Styling         | Tailwind CSS v4      |
| Language        | TypeScript           |
| Hosting         | Vercel               |
