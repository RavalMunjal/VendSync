<div align="center">

# 🚀 VendSync
**The Ultimate Procurement & Vendor Management ERP**

<p align="center">
  <img src="https://img.shields.io/badge/Odoo%20x%20Ksv%20Hackathon-Submission-FF6B6B?style=for-the-badge" alt="Hackathon Submission" />
  <img src="https://img.shields.io/badge/React_19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind" />
</p>

### 🔗 Live Links
**[Frontend (Vercel)](https://vend-sync-om12.vercel.app/login)** | **[Backend API Health (Render)](https://vendsync.onrender.com/api/health)**

*A production-grade, full-stack B2B procurement workflow solution.*

</div>

---

## 🎯 About the Project

**VendSync** is a centralized Procurement & Vendor Management ERP platform designed specifically for the **Odoo x Ksv Hackathon**. It eliminates manual procurement inefficiencies, enabling structured workflows, centralized vendor communication, and real-time procurement tracking — from RFQ creation to invoice generation.

### ⚠️ Problem Statement
- ❌ Fragmented email threads for vendor communication and negotiation.
- ❌ Messy Excel sheets for quotation comparison.
- ❌ No structured, multi-tier approval process.
- ❌ Zero visibility into procurement spending and vendor performance.

### 💡 The VendSync Solution
- ✅ **Digitizes the entire procurement lifecycle** in a single pane of glass.
- ✅ **Role-based access (RBAC)** for Admins, Managers, Procurement Officers, and Vendors.
- ✅ **Real-time analytical dashboard** for spending trends and KPIs.
- ✅ **Automated Purchase Orders & Invoices** with PDF export capabilities.

---

## ✨ Key Features

### 🏢 Vendor & Procurement Ecosystem
| Module | Description |
|---|---|
| 🔐 **RBAC Security** | JWT-based authentication with 4 distinct role types. |
| 🏢 **Vendor Portal** | Vendors can register, view assigned RFQs, and submit quotations independently. |
| 📋 **RFQ Management** | Multi-step Request For Quotation creation with item/quantity management. |
| 💬 **Quotation Engine** | Vendors submit, edit, and withdraw bids; buyers compare side-by-side. |
| ⚖️ **Smart Comparison** | Visual matrix for comparing quotations with lowest price auto-highlighting. |

### 📋 Workflows & Finance
| Module | Description |
|---|---|
| ✅ **Approval Workflow** | Structured Accept/Reject capabilities with remarks for internal managers. |
| 📦 **Purchase Orders** | Auto-generation of structured POs upon quotation approval. |
| 🧾 **Automated Invoices** | Professional invoice generation with embedded tax calculations. |
| 📄 **Export to PDF** | One-click download of POs and Invoices as formatted PDFs. |
| 📊 **Advanced Analytics** | Interactive charts (Recharts) detailing spending trends and system KPIs. |
| 📝 **Audit Trail** | Comprehensive activity logging tracking "who did what and when". |

---

## 🛠 Tech Stack

**Frontend Architecture:**
- **Core:** React 19, Vite, Javascript
- **Styling:** Tailwind CSS, Lucide React Icons
- **State & Routing:** React Router v7
- **Forms & Validation:** React Hook Form, Zod
- **Data Visualization:** Recharts
- **Networking:** Axios (with auth interceptors)

**Backend Architecture:**
- **Core:** Node.js, Express.js
- **Database:** MongoDB Atlas, Mongoose ODM
- **Authentication:** JWT, bcryptjs
- **Security:** Helmet, CORS, express-rate-limit
- **PDF Generation:** PDFKit

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js v18+
- MongoDB instance (local or Atlas)

### 1. Clone & Install
```bash
git clone https://github.com/RavalMunjal/VendSync.git
cd VendSync
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Set MONGO_URI, JWT_SECRET, etc in .env
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
# Ensure .env contains VITE_API_URL=http://localhost:5000/api
npm run dev
```

---

## 📡 API Architecture

The backend REST API is hosted at: `https://vendsync.onrender.com/api`

| Module | Base Route | Description |
|---|---|---|
| **Auth** | `/api/auth` | Register, Login, Get Current User |
| **Vendors** | `/api/vendors` | Manage vendor directory & performance stats |
| **RFQs** | `/api/rfqs` | Create, publish, compare, and award RFQs |
| **Quotations** | `/api/quotations` | Handle vendor bids |
| **Approvals** | `/api/approvals` | Manager-level authorization workflows |
| **POs** | `/api/purchase-orders` | Generate and track Purchase Orders |
| **Invoices** | `/api/invoices` | Generate, track, and pay Invoices |
| **Analytics** | `/api/analytics` | Fetch metrics for the dashboard |
| **Logs** | `/api/logs` | Comprehensive activity audit logs |

---

## 👥 User Roles & Demo Flow

The system supports a hierarchical structure:

1. **Admin:** Full system access.
2. **Manager:** Approves or rejects procurement requests and POs.
3. **Procurement Officer:** Creates RFQs, invites vendors, compares quotes, generates POs.
4. **Vendor:** Receives RFQs, submits price quotations, views approved POs.

### Demo Credentials (if seeded):
- **Admin:** `admin@bidflow.com` | `Admin@123`
- **Manager:** `manager@bidflow.com` | `Manager@123`
- **Procurement:** `officer@bidflow.com` | `Officer@123`
- **Vendor:** `vendor1@bidflow.com` | `Vendor@123` 
*(Note: Use actual user credentials from your database for the live demo)*

---

<div align="center">

### 🏆 Built for the Odoo x Ksv Hackathon 🏆

*Thank you to the judges and organizers for this amazing opportunity!*
⭐ Star this repo if you liked our project!

</div>