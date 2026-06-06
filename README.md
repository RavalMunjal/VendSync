# VendorBridge (VendSync)

### Procurement & Vendor Management ERP System

VendorBridge is a full-stack Procurement & Vendor Management ERP designed to streamline procurement workflows for organizations through a centralized and scalable platform.

The system enables organizations to manage vendors, create RFQs, receive quotations, compare vendors, process approvals, generate purchase orders, create invoices, and monitor procurement analytics in real time.

---

# 🚀 Features

## 🔐 Authentication & Authorization

* JWT Authentication
* Role-Based Access Control (RBAC)
* Secure Login / Signup
* Forgot Password
* Session Handling
* Protected Routes

---

## 📊 Dashboard

* Procurement Analytics
* Pending Approvals
* Active RFQs
* Recent Purchase Orders
* Invoice Statistics
* Quick Actions

---

## 🏢 Vendor Management

* Vendor Registration
* Vendor Categories
* GST Details
* Contact Management
* Vendor Status Tracking
* Search & Filters

---

## 📄 RFQ Management

* Create RFQs
* Product/Service Details
* Quantity Management
* File Attachments
* Deadline Selection
* Vendor Assignment

---

## 💰 Vendor Quotations

* Submit Quotations
* Delivery Timelines
* Pricing Details
* Editable Quotations
* Quotation Notes

---

## ⚖️ Quotation Comparison

* Side-by-Side Comparison
* Lowest Price Highlighting
* Delivery Comparison
* Vendor Ratings
* Sorting & Filtering

---

## ✅ Approval Workflow

* Multi-Level Approvals
* Approve / Reject Requests
* Approval Remarks
* Workflow Timeline
* Status Tracking

---

## 🧾 Purchase Orders & Invoices

* Auto-generated PO Numbers
* Invoice Generation
* Tax Calculations
* PDF Invoice Download
* Print Invoice
* Email Invoice to Vendors

---

## 🔔 Notifications & Activity Logs

* RFQ Notifications
* Approval Alerts
* Invoice Updates
* Audit Logs
* Activity Timeline

---

## 📈 Reports & Analytics

* Vendor Performance Analytics
* Spending Reports
* Procurement Trends
* Monthly Statistics
* Export Reports (PDF / Excel)

---

# 👥 User Roles

| Role                | Permissions                                             |
| ------------------- | ------------------------------------------------------- |
| Admin               | Manage users, vendors, analytics                        |
| Procurement Officer | Create RFQs, compare quotations, generate PO & invoices |
| Vendor              | Submit quotations, view RFQs & purchase orders          |
| Manager / Approver  | Approve or reject procurement requests                  |

---

# 🛠️ Tech Stack

## Frontend

* React.js
* React Router DOM
* Axios
* Redux Toolkit / Context API
* Tailwind CSS
* Material UI / ShadCN UI
* React Hook Form
* Yup Validation
* Recharts / Chart.js
* React Toastify
* Framer Motion

---

## Backend

* Node.js
* Express.js
* MongoDB
* Mongoose ODM
* JWT Authentication
* Bcrypt.js
* Nodemailer
* Multer
* PDFKit
* Cloudinary (Optional)
* Express Validator

---

## Database

* MongoDB Atlas

---

## Dev Tools

* Git & GitHub
* Postman
* VS Code
* Docker (Optional)
* Vercel / Netlify (Frontend Deployment)
* Render / Railway (Backend Deployment)

---

# 📁 Project Folder Structure

```bash
VendorBridge/
│
├── client/                     # Frontend
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/
│   │   │   ├── dashboard/
│   │   │   ├── forms/
│   │   │   └── tables/
│   │   │
│   │   ├── layouts/
│   │   ├── pages/
│   │   │   ├── auth/
│   │   │   ├── dashboard/
│   │   │   ├── vendors/
│   │   │   ├── rfq/
│   │   │   ├── quotations/
│   │   │   ├── approvals/
│   │   │   ├── invoices/
│   │   │   └── reports/
│   │   │
│   │   ├── redux/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── hooks/
│   │   ├── context/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/                     # Backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── utils/
│   ├── uploads/
│   ├── templates/
│   ├── logs/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── docs/
├── .env
├── .gitignore
├── README.md
└── docker-compose.yml
```

---

# 📦 Frontend Dependencies

```bash
npm install react-router-dom axios redux react-redux @reduxjs/toolkit react-hook-form yup @hookform/resolvers react-toastify framer-motion recharts jspdf html2canvas
```

### Tailwind CSS

```bash
npm install -D tailwindcss postcss autoprefixer
```

---

# 📦 Backend Dependencies

```bash
npm install express mongoose dotenv cors bcryptjs jsonwebtoken nodemailer multer pdfkit express-validator cookie-parser morgan helmet compression
```

### Dev Dependencies

```bash
npm install -D nodemon
```

---

# 🔐 Authentication Flow

1. User signs up or logs in
2. JWT token generated
3. Token stored securely
4. Protected routes validated via middleware
5. Role-based access enforced

---

# 🔄 Procurement Workflow

```text
1. Procurement Officer creates RFQ
2. Vendors receive invitations
3. Vendors submit quotations
4. Procurement team compares quotations
5. Approval workflow initiated
6. Approved quotation generates PO
7. Invoice generated from PO
8. Invoice printed or emailed
9. Activities logged in analytics
```

---

# 🗂️ Suggested MongoDB Collections

```text
users
vendors
rfqs
quotations
approvals
purchaseOrders
invoices
notifications
activityLogs
reports
```

---

# 🔌 API Modules

| Module        | Description               |
| ------------- | ------------------------- |
| Auth API      | Login, Signup, JWT        |
| Vendor API    | Vendor CRUD               |
| RFQ API       | RFQ Creation & Management |
| Quotation API | Vendor Quotations         |
| Approval API  | Workflow Approvals        |
| PO API        | Purchase Orders           |
| Invoice API   | Invoice Generation        |
| Analytics API | Reports & Statistics      |

---

# 📧 Invoice Email System

Using Nodemailer:

* Send invoices to vendors
* PDF attachment support
* Automated procurement emails

---

# 🧾 PDF Invoice Generation

Libraries:

* PDFKit
* jsPDF

Features:

* Download Invoice
* Print Invoice
* Email Invoice

---

# 📊 Analytics Dashboard

Includes:

* Procurement Trends
* Monthly Spending
* Vendor Performance
* Approval Statistics
* Purchase Order Metrics

---

# 🌐 Deployment

## Frontend

* Vercel
* Netlify

## Backend

* Render
* Railway
* AWS EC2

## Database

* MongoDB Atlas

---

# 🔒 Security Features

* Password Hashing
* JWT Authentication
* Input Validation
* Role-Based Authorization
* Secure API Middleware
* Environment Variables
* Rate Limiting

---

# 🚀 Future Enhancements

* Real-time Notifications (Socket.IO)
* AI Vendor Recommendation
* Multi-Tenant ERP Support
* Mobile App
* OCR Invoice Scanning
* E-Signature Approval
* SAP/ERP Integrations

---

# 📸 UI/UX Goals

* Modern ERP Interface
* Responsive Design
* Clean Dashboard
* Dynamic Tables
* Reusable Components
* Smooth User Experience

---

# 🧑‍💻 Installation Guide

## Clone Repository

```bash
git clone https://github.com/your-username/vendorbridge.git
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

---

## Backend Setup

```bash
cd server
npm install
npm run dev
```

---

# ⚙️ Environment Variables

## Backend `.env`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
CLIENT_URL=http://localhost:5173
```

---

# 📌 Project Vision

VendorBridge aims to modernize procurement operations by reducing manual workflows, increasing procurement transparency, improving vendor communication, and delivering a scalable ERP foundation for organizations.

---

# 👨‍💻 Developed By

Your Name
Full Stack Developer

---
