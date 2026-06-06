# 🏆 BidFlow — Procurement & Vendor Management ERP

<div align="center">

![BidFlow Banner](https://img.shields.io/badge/BidFlow-ERP%20Platform-6366F1?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xMiAyTDIgN2wxMCA1IDEwLTV6Ii8+PC9zdmc+)

![React](https://img.shields.io/badge/React_18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**A production-grade, full-stack Procurement & Vendor Management ERP built for modern organizations.**

[Live Demo](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [User Roles](#-user-roles)
- [Workflow](#-workflow)
- [Screenshots](#-screenshots)
- [Team](#-team)

---

## 🎯 About the Project

**BidFlow** is a centralized Procurement & Vendor Management ERP platform that eliminates manual procurement inefficiencies. It enables structured workflows, centralized vendor communication, and real-time procurement tracking — from RFQ creation to invoice generation.

### Problem it Solves
- ❌ Manual emails for vendor communication
- ❌ Excel sheets for quotation comparison
- ❌ No structured approval process
- ❌ Zero visibility into procurement spending

### What BidFlow Does
- ✅ Digitizes the entire procurement lifecycle
- ✅ Role-based access for all stakeholders
- ✅ Real-time dashboard with analytics
- ✅ Auto-generated POs and invoices with PDF export

---

## ✨ Features

### Core Features
| Feature | Description |
|---|---|
| 🔐 **Auth & Roles** | JWT-based login with 4 role types |
| 🏢 **Vendor Management** | Register, track, rate, and manage vendors |
| 📋 **RFQ Creation** | Multi-step RFQ with item management & vendor assignment |
| 💬 **Quotation System** | Vendors submit, edit, and withdraw quotations |
| ⚖️ **Quotation Comparison** | Side-by-side comparison with lowest price highlighting |
| ✅ **Approval Workflow** | Structured approve/reject with remarks & timeline |
| 📦 **Purchase Orders** | Auto-generated POs from approved quotations |
| 🧾 **Invoice Generation** | Professional invoices with GST calculation |
| 📄 **PDF Export** | Download invoice as PDF |
| 📊 **Analytics Dashboard** | Charts, KPIs, spending trends |
| 📝 **Activity Logs** | Full audit trail of all procurement actions |
| 🌙 **Dark / Light Mode** | Persistent theme toggle |

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 + Vite | UI framework + fast build tool |
| Tailwind CSS | Utility-first styling |
| React Router DOM v6 | Client-side routing |
| Axios | HTTP client with interceptors |
| Recharts | Analytics charts |
| React Hook Form + Zod | Form handling + validation |
| React Hot Toast | Toast notifications |
| Lucide React | Icon library |
| jsPDF + html2canvas | PDF generation |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express.js | REST API server |
| MongoDB + Mongoose | Database + ODM |
| JWT + bcryptjs | Authentication + password hashing |
| express-validator | Input validation |
| Helmet + CORS | Security headers |
| Morgan | HTTP request logging |
| express-rate-limit | Rate limiting |
| Nodemailer | Email service |
| PDFKit | Server-side PDF generation |

---

## 📁 Project Structure

```
bidflow/
├── 📁 bidflow-frontend/
│   ├── src/
│   │   ├── api/              → Axios instance + all API functions
│   │   ├── components/
│   │   │   ├── layout/       → Sidebar, Navbar, Layout
│   │   │   ├── ui/           → StatCard, Modal, Badge, Skeleton, Table
│   │   │   └── charts/       → SpendBarChart, CategoryDonutChart
│   │   ├── context/          → AuthContext (JWT + role)
│   │   ├── hooks/            → useAuth, useFetch
│   │   ├── pages/
│   │   │   ├── auth/         → LoginPage
│   │   │   ├── dashboard/    → DashboardPage
│   │   │   ├── vendors/      → VendorsPage, VendorDetailPage
│   │   │   ├── rfqs/         → RFQsPage, CreateRFQ, Compare
│   │   │   ├── quotations/   → QuotationsPage
│   │   │   ├── approvals/    → ApprovalsPage
│   │   │   ├── purchase-orders/ → POsPage, PODetailPage
│   │   │   ├── invoices/     → InvoicesPage, InvoiceDetailPage
│   │   │   ├── users/        → UsersPage (Admin)
│   │   │   ├── analytics/    → AnalyticsPage
│   │   │   ├── logs/         → LogsPage
│   │   │   └── settings/     → SettingsPage
│   │   ├── routes/           → ProtectedRoute, RoleRoute
│   │   ├── utils/            → formatCurrency, formatDate
│   │   └── App.jsx
│   ├── .env
│   └── package.json
│
└── 📁 bidflow-backend/
    ├── src/
    │   ├── config/           → db.js
    │   ├── models/           → User, Vendor, RFQ, Quotation,
    │   │                        Approval, PurchaseOrder, Invoice, ActivityLog
    │   ├── controllers/      → All business logic
    │   ├── routes/           → All Express routers
    │   ├── middleware/        → auth, role, validate, errorHandler, rateLimiter
    │   └── utils/            → generateNumber, activityLogger, emailService, pdfGenerator
    ├── server.js
    ├── .env
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier works)
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/bidflow.git
cd bidflow
```

### 2. Setup Backend

```bash
cd bidflow-backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Setup Frontend

```bash
cd bidflow-frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

Frontend runs on: `http://localhost:5173`

### 4. Seed Demo Data (For judges / demo)

```bash
cd bidflow-backend
npm run seed
```

This creates all demo users, vendors, RFQs, quotations, approvals, POs, and invoices instantly.

---

## 🔐 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/bidflow?appName=Cluster0

JWT_SECRET=bidflow_super_secret_jwt_key_2024
JWT_EXPIRES_IN=7d

CLIENT_URL=http://localhost:5173

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=BidFlow <your@gmail.com>

NODE_ENV=development
```

### Frontend `.env`

```env
VITE_API_URL=http://localhost:5000
```

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Response Format (Always)
```json
{ "success": true, "data": {}, "message": "Action completed" }
{ "success": false, "error": "Error message", "code": 403 }
```

### Endpoints Overview

| Module | Base Route | Methods |
|---|---|---|
| Auth | `/api/auth` | POST register, POST login, GET me |
| Users | `/api/users` | Full CRUD (Admin) |
| Vendors | `/api/vendors` | Full CRUD + stats |
| RFQs | `/api/rfqs` | Full CRUD + publish/close/compare/award |
| Quotations | `/api/quotations` | Submit/edit/withdraw |
| Approvals | `/api/approvals` | Approve/reject workflow |
| Purchase Orders | `/api/purchase-orders` | Generate/send/acknowledge |
| Invoices | `/api/invoices` | Generate/send/PDF/mark-paid |
| Analytics | `/api/analytics` | Dashboard + trends + reports |
| Activity Logs | `/api/logs` | Full audit trail |

### Health Check
```
GET /api/health
→ { "success": true, "message": "BidFlow API running" }
```

---

## 👤 User Roles

| Role | Access |
|---|---|
| **Admin** | Full access — users, vendors, analytics, all modules |
| **Procurement Officer** | Create RFQ, compare quotes, generate PO & invoice |
| **Manager** | Approve/reject procurement requests, monitor workflows |
| **Vendor** | Submit quotations, track RFQ status, view own POs |

### Demo Credentials (after `npm run seed`)

| Role | Email | Password |
|---|---|---|
| Admin | admin@bidflow.com | Admin@123 |
| Manager | manager@bidflow.com | Manager@123 |
| Procurement Officer | officer@bidflow.com | Officer@123 |
| Vendor | vendor1@bidflow.com | Vendor@123 |

---

## 🔄 Workflow

```
1. 👷 Procurement Officer creates an RFQ
        ↓
2. 📧 Vendors receive notification & submit quotations
        ↓
3. ⚖️  Officer compares quotations side-by-side
        ↓
4. ✅ Officer selects best quote → sends for approval
        ↓
5. 👔 Manager approves/rejects with remarks
        ↓
6. 📦 Officer generates Purchase Order (auto PO number)
        ↓
7. 🧾 Invoice generated from PO (auto Invoice number)
        ↓
8. 📄 Invoice downloaded as PDF / sent via email
        ↓
9. 📊 All activities tracked in logs & analytics
```

---

## 🗄️ Database Models

```
User          → Authentication & role management
Vendor        → Vendor profiles & ratings
RFQ           → Request for Quotation with line items
Quotation     → Vendor bids on RFQs
Approval      → Approval workflow records
PurchaseOrder → Generated from approved quotations
Invoice       → Generated from purchase orders
ActivityLog   → Full audit trail of all actions
```

---

## 📊 Key Metrics Tracked

- Total procurement spend (monthly trend)
- Vendor performance (orders, spend, rating)
- RFQ to PO conversion rate
- Pending approvals count
- Spending by vendor category
- Invoice payment status

---

## 🏗️ Architecture Highlights

- **Role-based middleware** on every protected route
- **Pre-save hooks** for auto GST & total calculations
- **Sequential number generation** for PO/Invoice (PO-202506-0001)
- **Promise.all** on dashboard for parallel DB queries
- **Activity logging** on every create/update/delete/approve
- **Global error handler** — consistent error format
- **Rate limiting** — 10 req/15min on auth, 100 req/15min on API

---

## 🤝 Team

| Name | Role |
|---|---|
| Your Name | Full Stack Developer |

---

## 📄 License

This project was built for a **Hackathon**. All rights reserved.

---

<div align="center">

**Built with ❤️ for Hackathon 2026**

⭐ Star this repo if you found it helpful!
#thankyou all of you for watching my project


</div>