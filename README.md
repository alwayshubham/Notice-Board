# Notice Board Application

A production-ready, highly polished Notice Board application built using **Next.js 15 (Pages Router)**, **Prisma ORM**, **TypeScript**, and **Tailwind CSS**. 

## Features

- **Full CRUD Operations**: Create, Read, Update, and Delete notices.
- **Server & Client-Side Validation**: Built with Zod to enforce integrity and structure on notice attributes.
- **Database Persistence**: Powered by Prisma ORM and compatible with MySQL databases (like TiDB Cloud).
- **Optimized Sorting**: Notices are sorted server-side directly in the database query (Urgent priority first, then latest publish date).
- **Responsive Layout**: Designed for mobile (1 column), tablet (2 columns), and desktop (3 columns).
- **Toast Notifications**: Integrated with `react-hot-toast` for rich action feedback.
- **Modern UI**: Clean borders, glassmorphic header navigation, and smooth hover translations.

---

## Getting Started

### Prerequisites

- Node.js (v18.x or later recommended)
- npm or another package manager
- A MySQL-compatible database instance (e.g., TiDB Cloud, PlanetScale, Local MySQL)

### Installation

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Environment Variables**:
   Create a `.env` file in the root directory and specify your `DATABASE_URL`:
   ```env
   DATABASE_URL="mysql://username:password@host:port/database?sslaccept=strict"
   ```

3. **Generate Prisma Client**:
   Generate the Prisma Client code based on the schema:
   ```bash
   npx prisma generate
   ```

4. **Push Schema to the Database**:
   Push the schema directly to your MySQL database to create the required tables and enums:
   ```bash
   npx prisma db push
   ```

5. **Start Development Server**:
   Start the Next.js dev server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## Tech Stack & Architecture

- **Framework**: [Next.js 15 (Pages Router)](https://nextjs.org/)
- **ORM**: [Prisma ORM](https://www.prisma.io/)
- **Database**: MySQL (TiDB Cloud)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Validation**: [Zod](https://zod.dev/)
- **Notifications**: [React Hot Toast](https://react-hot-toast.com/)
- **Icons**: [Lucide React](https://lucide.dev/)

---

## Folder Structure

```text
├── prisma/
│   └── schema.prisma         # Prisma Schema Definition
├── lib/
│   ├── prisma.ts             # Prisma Client Singleton Utility
│   └── validators/
│       └── notice.ts         # Zod Validation Schema
├── components/
│   ├── Layout.tsx            # Global Navigation & Layout wrapper
│   ├── Badge.tsx             # Category & Priority tags
│   ├── NoticeCard.tsx        # Individual Notice card layout
│   ├── NoticeForm.tsx        # Reusable create/edit Form component
│   └── DeleteModal.tsx       # Delete confirmation overlay
├── pages/
│   ├── index.tsx             # Notice listing (Homepage)
│   ├── notices/
│   │   ├── create.tsx        # Create Notice Page
│   │   └── [id]/
│   │       └── edit.tsx      # Edit Notice Page
│   ├── api/
│   │   └── notices/
│   │       ├── index.ts      # GET (list) and POST (create) API
│   │       └── [id].ts       # PUT (update) and DELETE (delete) API
│   ├── _app.tsx              # App initialization & providers
│   └── _document.tsx         # HTML document base configuration
├── styles/
│   └── globals.css           # Tailwind CSS directives
└── README.md                 # Project documentation
```

---

## Deployment to Vercel

This project is optimized for deployment directly on **Vercel**.

1. Push your code repository to GitHub, GitLab, or Bitbucket.
2. Log in to [Vercel](https://vercel.com/) and click **New Project**.
3. Import your Notice Board repository.
4. Under **Environment Variables**, add:
   - `DATABASE_URL`: Your production MySQL connection string.
5. In the project settings, Vercel will automatically detect Next.js settings. 
6. Under the build options, you can use the default commands. Alternatively, configure the build script in `package.json` to automatically compile migrations:
   ```json
   "build": "prisma generate && next build"
   ```
7. Click **Deploy**. Vercel will build and provision your app.

---

## Future Improvements

1. **User Authentication & Roles**:
   - Integrate NextAuth.js or Clerk to protect notice creation/editing/deletion.
   - Separate access roles (e.g., Admins, Teachers, Students) so only authenticated administrators can publish or delete announcements.

2. **Rich Text Editor**:
   - Implement a rich text editor (like TipTap or Quill) in `NoticeForm` for notice bodies, allowing lists, bold text, and custom paragraph styling.

3. **Direct Image Uploads**:
   - Enable direct image file uploads using AWS S3, Cloudinary, or Vercel Blob instead of relying solely on external image URLs.

4. **Interactive Search & Text Filtering**:
   - Add a full-text search input to the home page filter bar to find notices by matching keywords in their titles or bodies.
