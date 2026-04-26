# Smart Bookmark App

A modern, real-time bookmark manager built with Next.js and Supabase.
Users can securely sign in using Google OAuth, save bookmarks, edit or delete them, and see updates reflected instantly across tabs.

---

## 🚀 Live Demo

Deployed on Vercel.

---

## 📌 What The Project Does

Smart Bookmark App allows users to:

* Sign in using Google OAuth (no email/password)
* Add bookmarks (title + URL)
* Edit existing bookmarks
* Delete bookmarks with confirmation
* View bookmarks in real-time
* Experience infinite scroll (cursor-based pagination)
* Use the app securely with Row Level Security (RLS)

Each user can only see their own bookmarks.

---

## 🧰 Tech Stack

### Frontend

* **Next.js (App Router)**
* **TypeScript**
* **Tailwind CSS**
* **shadcn/ui**
* **Lucide Icons**
* **Sonner (Toast notifications)**

### Backend (BaaS)

* **Supabase**

  * Authentication (Google OAuth)
  * PostgreSQL Database
  * Row Level Security (RLS)
  * Realtime subscriptions

### Deployment

* **Vercel**

---

## 🏗 Architecture Overview

* App Router with protected routes
* Server-side session validation using Supabase SSR
* Cursor-based infinite scrolling (no offset pagination)
* Real-time updates using Supabase `postgres_changes`
* Secure database access using RLS policies
* Optimistic UI updates for better UX

---

```sql
alter table bookmarks replica identity full;
```

After enabling this, DELETE events propagated correctly.

---


## 🔐 Security Considerations

* Row Level Security (RLS) enforced at database level
* No service-role key exposed to frontend
* OAuth handled securely via Supabase

---

## 🎯 Conclusion

This project demonstrates:

* Secure authentication flows
* Realtime data synchronization
* Scalable pagination strategy
* Proper database security via RLS
* Clean UI architecture with modern design patterns

Built as a production-ready full-stack assignment using industry best practices.

---
