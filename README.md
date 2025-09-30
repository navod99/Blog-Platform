A modern, full-stack blog platform featuring user authentication, rich content management, and interactive social features. Built with Next.js, NestJS, and MongoDB.

# 🌟 Live Demo

Frontend: https://blog-platform-six-sandy.vercel.app/

Backend API: https://blog-platform-production-af5b.up.railway.app/

API Documentation: https://blog-platform-production-af5b.up.railway.app/api

# 🛠️ Tech Stack
## Frontend 
Framework: Next.js 15 (App Router)<br />
Language: TypeScript<br />
Styling: Tailwind CSS<br />
Rich Text Editor: React Quill<br />
State Management: Zustand<br />
Form Handling: React Hook Form<br />
Validation: Zod

## Backend
Framework: NestJS 11<br />
Language: TypeScript<br />
Database: MongoDB with Mongoose ODM<br />
Authentication: JWT (jsonwebtoken)<br />
Validation: class-validator & class-transformer<br />
Password Hashing: bcrypt<br />
API Documentation: Swagger

## DevOps & Deployment

Frontend Hosting: Vercel<br />
Backend Hosting: Railway <br />
Database Hosting: MongoDB Atlas<br />
Version Control: Git & GitHub

## 📋 Prerequisites
Before you begin, ensure you have the following installed:<br />

Node.js (v18 or higher)<br />
npm or yarn<br />
MongoDB (v6 or higher) - Local installation or MongoDB Atlas account<br />
Git<br />

# 🚀 Installation & Setup
## 1. Clone the Repository
## 2. Backend Setup
 Navigate to backend directory - cd blog-backend<br/>
 Install dependencies- npm install<br />
 Create environment file - .env <br />
 Edit .env with the configuration - (See Environment Variables section below) <br />
 Start development server <br /> - npm run start:dev<br/>
 The backend server will start on http://localhost:3000
## 3. Frontend Setup
 Navigate to frontend directory (from root) - cd blog-frontend<br/>
 Install dependencies - npm install
 Create environment file - .env
 Edit .env with the configuration - (See Environment Variables section below) <br />
 Start development server <br /> - npm run dev<br/>
 The frontend will start on http://localhost:3001

#  🔧 Environment Variables
## Backend (.env)
local db - DATABASE_URL=mongodb://localhost:27017/blog-platform <br/>
or for MongoDB Atlas:
DATABASE_URL=mongodb+srv://username:password@cluster.mongodb.net/blog-platform<br/>

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production<br/>
JWT_EXPIRATION=1d<br/>
JWT_REFRESH_SECRET=your-refresh-token-secret<br/>
JWT_REFRESH_EXPIRATION=7d<br/>

PORT=3000<br/>
NODE_ENV=development<br/>

CORS_ORIGIN=http://localhost:3001<br/>

## Frontend (.env)
NEXT_PUBLIC_API_URL=http://localhost:3000/api

🎯 Key Features Implemented

✅ User registration and authentication with JWT
✅ Protected routes and authorization guards
✅ Rich text editor for blog posts
✅ Draft and published post states
✅ Full CRUD operations for posts
✅ Commenting system with nested replies
✅ Like/unlike functionality
✅ Search and filter posts
✅ Pagination for posts and comments
✅ Responsive design
✅ API documentation with Swagger
✅ Input validation and error handling
✅ Database indexing for performance
