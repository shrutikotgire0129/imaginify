# ✨ Imaginify

### AI-Powered Image Transformation SaaS

Imaginify is a full-stack AI-powered image transformation platform that allows users to upload, transform, manage, and download images through a modern SaaS interface.

Built with **Next.js, TypeScript, MongoDB, Cloudinary, Clerk, and Stripe**, Imaginify combines AI-powered image manipulation with authentication, cloud image management, credit-based usage, and payments.

<p align="center">
  <a href="https://imaginify-six-gold.vercel.app/">
    <img src="https://img.shields.io/badge/Live%20Demo-Imaginify-8B5CF6?style=for-the-badge" alt="Live Demo" />
  </a>
  <a href="https://github.com/shrutikotgire0129/imaginify">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository" />
  </a>
</p>

---

## 📸 Preview

![Imaginify Home Page](./public/screenshots/home-page.png)

---

## 🚀 Features

### 🖼️ AI Image Transformations

Imaginify provides multiple image transformation capabilities through Cloudinary's image processing infrastructure.

- **Image Restoration** — Restore and enhance images
- **Generative Fill** — Extend images beyond their original boundaries
- **Object Removal** — Remove unwanted objects from images
- **Object Recoloring** — Change the color of selected objects
- **Background Removal** — Automatically remove image backgrounds

### 🔐 Authentication

Secure authentication and user management powered by Clerk.

- User sign up and sign in
- Protected application routes
- User-specific data
- Authenticated image management
- Secure access to application features

### 💳 Credit-Based Usage

Imaginify follows a credit-based SaaS model.

- Users have a credit balance
- Image transformations consume credits
- Credits are associated with individual users
- Users can purchase additional credits
- Credit usage is integrated into the transformation workflow

### 💰 Stripe Payments

Stripe is integrated to handle credit purchases.

- Secure checkout
- Credit purchase flow
- Stripe payment processing
- Payment-based credit management

### ☁️ Cloud Image Management

Cloudinary handles image upload, storage, delivery, and transformation.

- Image uploads
- Cloud-based image storage
- AI-powered transformations
- Optimized image delivery
- Transformed image management

### 📱 Responsive Interface

The application is designed to work across different screen sizes.

- Desktop
- Tablet
- Mobile

---

# 🎨 Image Transformations

## Image Restoration

Restore and enhance images using AI-powered image processing.

![Image Restoration](./public/screenshots/image-restore.png)

---

## Generative Fill

Extend an image beyond its original boundaries using generative image processing.

![Generative Fill](./public/screenshots/generative-fill.png)

---

## Object Removal

Remove unwanted objects from an image while maintaining the surrounding visual context.

![Object Removal](./public/screenshots/object-remove.png)

---

## Object Recoloring

Change the color of selected objects within an image.

![Object Recoloring](./public/screenshots/object-recolor.png)

---

## Background Removal

Remove the background from an image and isolate the main subject.

![Background Removal](./public/screenshots/bg-remove.png)

---

# 👤 User Profile

Users can manage their account and view their available image transformation credits.

![User Profile](./public/screenshots/profile.png)

---

# 💳 Buy Credits

Users can purchase additional credits through the integrated Stripe payment system.

![Buy Credits](./public/screenshots/buy-credits.png)

---

# 🛠️ Tech Stack

## Frontend

- **Next.js 16**
- **React 19**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

## Backend

- **Next.js Server Actions**
- **MongoDB**
- **Mongoose**

## Authentication

- **Clerk**

## Image Processing

- **Cloudinary**

## Payments

- **Stripe**

## Development Tools

- **Git**
- **GitHub**
- **ESLint**
- **VS Code**

---

# 🏗️ Application Architecture

```text
                         ┌──────────────────┐
                         │       User       │
                         └────────┬─────────┘
                                  │
                                  ▼
                         ┌──────────────────┐
                         │   Clerk Auth     │
                         └────────┬─────────┘
                                  │
                                  ▼
                    ┌──────────────────────────┐
                    │       Next.js App        │
                    │  React + Server Actions  │
                    └────────────┬─────────────┘
                                 │
                 ┌───────────────┼───────────────┐
                 │               │               │
                 ▼               ▼               ▼
          ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
          │   MongoDB   │ │ Cloudinary  │ │   Stripe    │
          │ + Mongoose  │ │    Images   │ │  Payments   │
          └─────────────┘ └─────────────┘ └─────────────┘

          