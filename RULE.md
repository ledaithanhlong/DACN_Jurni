# JURNI WEB APPLICATION DEVELOPMENT RULES

> **Version:** 1.0.0  
> **Last Updated:** 2026-01-27  
> **Purpose:** Quy chuẩn phát triển cho các dự án web tương tự Jurni

---

## MỤC LỤC

1. [Kiến trúc dự án](#1-kiến-trúc-dự-án)
2. [Design System](#2-design-system)
3. [Frontend Standards](#3-frontend-standards)
4. [Backend Standards](#4-backend-standards)
5. [Database Standards](#5-database-standards)
6. [API Standards](#6-api-standards)
7. [Authentication & Authorization](#7-authentication--authorization)
8. [UI/UX Guidelines](#8-uiux-guidelines)
9. [Performance & Optimization](#9-performance--optimization)
10. [Testing & Quality Assurance](#10-testing--quality-assurance)
11. [Deployment & DevOps](#11-deployment--devops)
12. [Documentation Standards](#12-documentation-standards)

---

## 1. KIẾN TRÚC Dự ÁN

### 1.1 Cấu trúc thư mục

```
project-root/
├── frontend/                 # React + Vite application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page-level components
│   │   ├── routes/          # Routing configuration
│   │   ├── data/            # Mock data & constants
│   │   ├── styles.css       # Global styles & Tailwind
│   │   └── main.jsx         # Application entry point
│   ├── public/              # Static assets
│   └── package.json
│
├── backend/                  # Node.js + Express API
│   ├── src/
│   │   ├── config/          # Configuration files
│   │   ├── controllers/     # Request handlers
│   │   ├── models/          # Database models (Sequelize)
│   │   ├── routes/          # API route definitions
│   │   ├── middlewares/     # Custom middleware
│   │   ├── migrations/      # Database migrations
│   │   ├── services/        # Business logic layer
│   │   ├── socket/          # WebSocket handlers
│   │   └── server.js        # Server entry point
│   └── package.json
│
├── RULE.md                   # This file
├── README.md                 # Project documentation
├── DATABASE_SETUP.md         # Database setup guide
└── QUICK_SETUP.bat          # Quick setup script
```

### 1.2 Tech Stack Bắt Buộc

#### Frontend
- **Framework:** React 18.3+ với Vite
- **Routing:** React Router DOM v6+
- **Styling:** TailwindCSS 3.4+
- **Icons:** Lucide React
- **HTTP Client:** Axios
- **Authentication:** Clerk React
- **Real-time:** Socket.io Client

#### Backend
- **Runtime:** Node.js (LTS version)
- **Framework:** Express.js
- **ORM:** Sequelize
- **Database:** MySQL 8.0+
- **Authentication:** Clerk Express + JWT
- **Real-time:** Socket.io
- **Security:** Helmet, CORS
- **File Upload:** Multer + Cloudinary

---

## 2. DESIGN SYSTEM

### 2.1 Color Palette

> [!IMPORTANT]
> **Sử dụng CHÍNH XÁC các màu sau để đảm bảo tính nhất quán**

#### Primary Colors
```css
/* Blue Palette - Màu chủ đạo */
--primary-dark: #0D47A1;      /* Xanh đậm - Headers, CTAs */
--primary-medium: #1976D2;     /* Xanh vừa - Links, buttons */
--primary-light: #42A5F5;      /* Xanh nhạt - Hover states */

/* Orange Palette - Màu nhấn */
--accent-primary: #FF6B35;     /* Cam chính - Primary actions */
--accent-secondary: #FF9800;   /* Cam phụ - Prices, highlights */
--accent-light: #FFE8E0;       /* Cam nhạt - Hover backgrounds */
```

#### Background Colors
```css
/* Background Hierarchy */
--bg-white: #FFFFFF;           /* Main background */
--bg-blue-1: #F0F7FF;          /* Xanh rất nhạt #1 */
--bg-blue-2: #E3F2FD;          /* Xanh nhạt #2 */
--bg-blue-3: #E8F4FD;          /* Xanh nhạt #3 */
--bg-blue-4: #F5FAFF;          /* Xanh rất nhạt #4 */
```

#### Text Colors
```css
--text-primary: #212121;       /* Body text */
--text-secondary: #757575;     /* Secondary text */
--text-disabled: #BDBDBD;      /* Disabled states */
```

#### Border Colors
```css
--border-light: #BBDEFB;       /* Light borders */
--border-medium: #90CAF9;      /* Medium borders */
--border-dark: #64B5F6;        /* Dark borders */
```

### 2.2 Typography

```css
/* Font Family */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 
             'Helvetica Neue', sans-serif;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */

/* Font Weights */
--font-normal: 400;
--font-semibold: 600;
--font-bold: 700;
```

### 2.3 Spacing System

```css
/* Sử dụng hệ thống spacing của Tailwind */
/* 0.25rem increments: 1, 2, 3, 4, 5, 6, 8, 10, 12, 16, 20, 24 */

/* Common Patterns */
--spacing-section: 2rem;        /* py-8 - Section spacing */
--spacing-card: 1.5rem;         /* p-6 - Card padding */
--spacing-element: 1rem;        /* gap-4 - Element gaps */
```

### 2.4 Border Radius

```css
/* Consistent Border Radius */
--radius-sm: 4px;
--radius-md: 8px;     /* STANDARD - Sử dụng cho hầu hết elements */
--radius-lg: 12px;
--radius-full: 9999px; /* Pills, badges */
```

### 2.5 Shadows

```css
/* Shadow Hierarchy */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## 3. FRONTEND STANDARDS

### 3.1 Component Structure

> [!TIP]
> **Tổ chức components theo nguyên tắc Single Responsibility**

#### Component Categories

```
components/
├── layout/              # Layout components (Header, Footer, Sidebar)
├── common/              # Shared components (Button, Input, Card)
├── features/            # Feature-specific components
└── [ComponentName].jsx  # Root-level reusable components
```

#### Component Template

```jsx
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

/**
 * ComponentName - Brief description
 * @param {Object} props - Component props
 * @param {string} props.title - Title text
 */
export default function ComponentName({ title, children }) {
  const [state, setState] = useState(null);

  useEffect(() => {
    // Side effects
  }, []);

  return (
    <div className="component-wrapper">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

ComponentName.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node,
};

ComponentName.defaultProps = {
  children: null,
};
```

### 3.2 Styling Guidelines

#### Tailwind CSS Best Practices

```jsx
// ✅ GOOD - Sử dụng Tailwind utilities
<div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition">
  <h3 className="text-xl font-bold text-blue-900">Title</h3>
</div>

// ❌ BAD - Inline styles (chỉ dùng khi cần dynamic values)
<div style={{ padding: '24px', backgroundColor: 'white' }}>
  <h3 style={{ fontSize: '20px', fontWeight: 'bold' }}>Title</h3>
</div>

// ✅ ACCEPTABLE - Inline styles cho dynamic values
<div 
  className="rounded-lg p-6"
  style={{ backgroundColor: dynamicColor }}
>
  Content
</div>
```

#### Hover States

```jsx
// Pattern 1: Tailwind hover utilities
<button className="bg-blue-600 hover:bg-blue-700 transition">
  Click me
</button>

// Pattern 2: JavaScript hover handlers (cho complex interactions)
<div
  className="border rounded-lg p-4 transition"
  style={{ borderColor: '#BBDEFB' }}
  onMouseEnter={(e) => {
    e.currentTarget.style.borderColor = '#FF6B35';
    e.currentTarget.style.backgroundColor = '#FFE8E0';
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.borderColor = '#BBDEFB';
    e.currentTarget.style.backgroundColor = '#FFFFFF';
  }}
>
  Hover me
</div>
```

### 3.3 State Management

#### Local State
```jsx
// ✅ GOOD - useState cho component-level state
const [isOpen, setIsOpen] = useState(false);
const [formData, setFormData] = useState({ name: '', email: '' });
```

#### API State
```jsx
// ✅ GOOD - Fetch data với error handling
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchData = async () => {
    try {
      const response = await axios.get(`${API}/endpoint`);
      setData(response.data);
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err.message);
      // Fallback to mock data
      setData(mockData);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);
```

### 3.4 Routing Standards

```jsx
// routes/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/hotels" element={<HotelsPage />} />
        
        {/* Protected routes */}
        <Route 
          path="/bookings" 
          element={
            <ProtectedRoute>
              <BookingsPage />
            </ProtectedRoute>
          } 
        />
        
        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### 3.5 Environment Variables

```bash
# .env
VITE_API_URL=http://localhost:5000/api
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxx
VITE_SOCKET_URL=http://localhost:5000
```

```jsx
// Usage
const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
```

---

## 4. BACKEND STANDARDS

### 4.1 Controller Pattern

```javascript
// controllers/resource.controller.js
import { Resource } from '../models/index.js';

/**
 * Get all resources
 * @route GET /api/resources
 */
export const getAllResources = async (req, res) => {
  try {
    const resources = await Resource.findAll({
      order: [['createdAt', 'DESC']],
    });
    
    res.status(200).json(resources);
  } catch (error) {
    console.error('Error fetching resources:', error);
    res.status(500).json({ 
      message: 'Error fetching resources',
      error: error.message 
    });
  }
};

/**
 * Get resource by ID
 * @route GET /api/resources/:id
 */
export const getResourceById = async (req, res) => {
  try {
    const { id } = req.params;
    const resource = await Resource.findByPk(id);
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.status(200).json(resource);
  } catch (error) {
    console.error('Error fetching resource:', error);
    res.status(500).json({ 
      message: 'Error fetching resource',
      error: error.message 
    });
  }
};

/**
 * Create new resource
 * @route POST /api/resources
 */
export const createResource = async (req, res) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json(resource);
  } catch (error) {
    console.error('Error creating resource:', error);
    res.status(500).json({ 
      message: 'Error creating resource',
      error: error.message 
    });
  }
};

/**
 * Update resource
 * @route PUT /api/resources/:id
 */
export const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const [updated] = await Resource.update(req.body, {
      where: { id }
    });
    
    if (!updated) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    const updatedResource = await Resource.findByPk(id);
    res.status(200).json(updatedResource);
  } catch (error) {
    console.error('Error updating resource:', error);
    res.status(500).json({ 
      message: 'Error updating resource',
      error: error.message 
    });
  }
};

/**
 * Delete resource
 * @route DELETE /api/resources/:id
 */
export const deleteResource = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Resource.destroy({
      where: { id }
    });
    
    if (!deleted) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    res.status(200).json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error('Error deleting resource:', error);
    res.status(500).json({ 
      message: 'Error deleting resource',
      error: error.message 
    });
  }
};
```

### 4.2 Route Pattern

```javascript
// routes/resource.routes.js
import express from 'express';
import { 
  getAllResources, 
  getResourceById, 
  createResource, 
  updateResource, 
  deleteResource 
} from '../controllers/resource.controller.js';
import { requireAuth } from '../middlewares/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllResources);
router.get('/:id', getResourceById);

// Protected routes
router.post('/', requireAuth, createResource);
router.put('/:id', requireAuth, updateResource);
router.delete('/:id', requireAuth, deleteResource);

export default router;
```

### 4.3 Model Pattern (Sequelize)

```javascript
// models/Resource.js
export default (sequelize, DataTypes) => {
  const Resource = sequelize.define('Resource', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    status: {
      type: DataTypes.ENUM('active', 'inactive', 'archived'),
      defaultValue: 'active',
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
  }, {
    tableName: 'resources',
    timestamps: true,
    underscored: true,
  });

  Resource.associate = (models) => {
    // Define associations
    Resource.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'creator',
    });
  };

  return Resource;
};
```

### 4.4 Error Handling

```javascript
// middlewares/errorHandler.js
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // Sequelize validation errors
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({
      message: 'Validation error',
      errors: err.errors.map(e => ({
        field: e.path,
        message: e.message,
      })),
    });
  }

  // Sequelize unique constraint errors
  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(409).json({
      message: 'Resource already exists',
      field: err.errors[0].path,
    });
  }

  // Default error
  res.status(err.status || 500).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
```

---

## 5. DATABASE STANDARDS

### 5.1 Naming Conventions

```sql
-- Table names: plural, snake_case
CREATE TABLE users (...);
CREATE TABLE hotel_bookings (...);

-- Column names: snake_case
id, user_id, created_at, first_name

-- Foreign keys: [table]_id
user_id, hotel_id, booking_id

-- Indexes: idx_[table]_[column]
idx_users_email, idx_bookings_user_id

-- Constraints: [type]_[table]_[column]
pk_users_id, fk_bookings_user_id, uq_users_email
```

### 5.2 Migration Pattern

```javascript
// migrations/YYYYMMDDHHMMSS-create-resource.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('resources', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    user_id: {
      type: Sequelize.STRING,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
    },
  });

  // Add indexes
  await queryInterface.addIndex('resources', ['user_id']);
  await queryInterface.addIndex('resources', ['created_at']);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('resources');
}
```

### 5.3 Seeder Pattern

```javascript
// seeders/YYYYMMDDHHMMSS-demo-resources.js
export async function up(queryInterface, Sequelize) {
  await queryInterface.bulkInsert('resources', [
    {
      name: 'Resource 1',
      description: 'Description 1',
      price: 99.99,
      status: 'active',
      user_id: 'user_xxxxx',
      created_at: new Date(),
      updated_at: new Date(),
    },
    // ... more records
  ]);
}

export async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('resources', null, {});
}
```

---

## 6. API STANDARDS

### 6.1 RESTful API Design

```
GET    /api/resources          # List all resources
GET    /api/resources/:id      # Get single resource
POST   /api/resources          # Create resource
PUT    /api/resources/:id      # Update resource (full)
PATCH  /api/resources/:id      # Update resource (partial)
DELETE /api/resources/:id      # Delete resource
```

### 6.2 Response Format

```javascript
// Success Response
{
  "data": [...],
  "message": "Success",
  "timestamp": "2026-01-27T12:00:00Z"
}

// Error Response
{
  "error": {
    "message": "Resource not found",
    "code": "RESOURCE_NOT_FOUND",
    "status": 404
  },
  "timestamp": "2026-01-27T12:00:00Z"
}

// Validation Error Response
{
  "error": {
    "message": "Validation failed",
    "code": "VALIDATION_ERROR",
    "status": 400,
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2026-01-27T12:00:00Z"
}
```

### 6.3 Pagination

```javascript
// Request
GET /api/resources?page=1&limit=10&sort=created_at&order=desc

// Response
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

### 6.4 Filtering & Search

```javascript
// Request
GET /api/resources?status=active&search=keyword&minPrice=100&maxPrice=500

// Implementation
export const getAllResources = async (req, res) => {
  const { status, search, minPrice, maxPrice, page = 1, limit = 10 } = req.query;
  
  const where = {};
  
  if (status) where.status = status;
  if (search) {
    where[Op.or] = [
      { name: { [Op.like]: `%${search}%` } },
      { description: { [Op.like]: `%${search}%` } },
    ];
  }
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price[Op.gte] = minPrice;
    if (maxPrice) where.price[Op.lte] = maxPrice;
  }
  
  const resources = await Resource.findAndCountAll({
    where,
    limit: parseInt(limit),
    offset: (parseInt(page) - 1) * parseInt(limit),
    order: [['created_at', 'DESC']],
  });
  
  res.json({
    data: resources.rows,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total: resources.count,
      totalPages: Math.ceil(resources.count / limit),
    },
  });
};
```

---

## 7. AUTHENTICATION & AUTHORIZATION

### 7.1 Clerk Integration

```javascript
// Backend - middlewares/auth.middleware.js
import { clerkClient } from '@clerk/express';

export const requireAuth = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    req.userId = userId;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

export const requireAdmin = async (req, res, next) => {
  try {
    const { userId } = req.auth;
    const user = await clerkClient.users.getUser(userId);
    
    if (user.publicMetadata.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden' });
    }
    
    next();
  } catch (error) {
    res.status(403).json({ message: 'Access denied' });
  }
};
```

```jsx
// Frontend - Protected Route
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';

export default function ProtectedRoute({ children }) {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
}
```

### 7.2 Role-Based Access Control

```javascript
// User roles hierarchy
const ROLES = {
  USER: 'user',
  MODERATOR: 'moderator',
  ADMIN: 'admin',
  SUPER_ADMIN: 'super_admin',
};

// Permission middleware
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    const { userId } = req.auth;
    const user = await clerkClient.users.getUser(userId);
    const userRole = user.publicMetadata.role || ROLES.USER;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: 'Insufficient permissions' });
    }
    
    next();
  };
};

// Usage
router.delete('/users/:id', requireRole([ROLES.ADMIN, ROLES.SUPER_ADMIN]), deleteUser);
```

---

## 8. UI/UX GUIDELINES

### 8.1 Component Patterns

#### Card Component
```jsx
// ✅ STANDARD Card Pattern
<div 
  className="border rounded-lg bg-white p-5 shadow-sm hover:shadow-lg transition"
  style={{ borderRadius: '8px', borderColor: '#BBDEFB' }}
>
  <h3 className="text-lg font-bold" style={{ color: '#0D47A1' }}>
    Card Title
  </h3>
  <p className="text-sm mt-2" style={{ color: '#212121' }}>
    Card description
  </p>
</div>
```

#### Button Patterns
```jsx
// Primary Button
<button 
  className="px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition"
  style={{ backgroundColor: '#FF6B35', borderRadius: '8px' }}
>
  Primary Action
</button>

// Secondary Button
<button 
  className="px-5 py-2 rounded-lg font-semibold border transition hover:bg-blue-50"
  style={{ color: '#0D47A1', borderColor: '#0D47A1', borderRadius: '8px' }}
>
  Secondary Action
</button>

// Text Button
<a 
  href="#" 
  className="text-sm font-semibold transition hover:opacity-80"
  style={{ color: '#FF6B35' }}
>
  Text Link →
</a>
```

#### Section Header Pattern
```jsx
<div className="flex items-center justify-between mb-4">
  <div>
    <h2 className="text-xl font-bold" style={{ color: '#0D47A1' }}>
      Section Title
    </h2>
    <p className="text-sm mt-1" style={{ color: '#212121' }}>
      Section description
    </p>
  </div>
  <a
    href="/see-more"
    className="text-sm font-semibold transition hover:opacity-80"
    style={{ color: '#FF6B35' }}
  >
    See all →
  </a>
</div>
```

### 8.2 Responsive Design

```jsx
// Mobile-first approach
<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
  {/* Content */}
</div>

// Breakpoints
// sm: 640px
// md: 768px
// lg: 1024px
// xl: 1280px
// 2xl: 1536px
```

### 8.3 Loading States

```jsx
// Skeleton Loading
{loading ? (
  <div className="animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
  </div>
) : (
  <div>{content}</div>
)}

// Spinner Loading
{loading && (
  <div className="flex justify-center items-center py-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
  </div>
)}
```

### 8.4 Empty States

```jsx
{data.length === 0 && (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">📭</div>
    <h3 className="text-lg font-semibold text-gray-700 mb-2">
      No items found
    </h3>
    <p className="text-sm text-gray-500 mb-4">
      Try adjusting your filters or search terms
    </p>
    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg">
      Clear Filters
    </button>
  </div>
)}
```

### 8.5 Form Validation

```jsx
const [errors, setErrors] = useState({});

const validateForm = (data) => {
  const newErrors = {};
  
  if (!data.email) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(data.email)) {
    newErrors.email = 'Email is invalid';
  }
  
  if (!data.password) {
    newErrors.password = 'Password is required';
  } else if (data.password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  }
  
  return newErrors;
};

// In form
<div>
  <input
    type="email"
    className={`border rounded-lg px-4 py-2 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
    value={formData.email}
    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
  />
  {errors.email && (
    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
  )}
</div>
```

---

## 9. PERFORMANCE & OPTIMIZATION

### 9.1 Code Splitting

```jsx
// Lazy load pages
import { lazy, Suspense } from 'react';

const HotelsPage = lazy(() => import('./pages/HotelsPage'));
const FlightsPage = lazy(() => import('./pages/FlightsPage'));

// In routes
<Suspense fallback={<LoadingSpinner />}>
  <Routes>
    <Route path="/hotels" element={<HotelsPage />} />
    <Route path="/flights" element={<FlightsPage />} />
  </Routes>
</Suspense>
```

### 9.2 Image Optimization

```jsx
// Use Cloudinary transformations
const optimizedImageUrl = (url, width = 800) => {
  if (!url || !url.includes('cloudinary')) return url;
  
  return url.replace('/upload/', `/upload/w_${width},f_auto,q_auto/`);
};

// Usage
<img 
  src={optimizedImageUrl(hotel.image_url, 400)} 
  alt={hotel.name}
  loading="lazy"
  className="w-full h-48 object-cover"
/>
```

### 9.3 Memoization

```jsx
import { useMemo, useCallback } from 'react';

// Memoize expensive calculations
const sortedData = useMemo(() => {
  return data.sort((a, b) => a.price - b.price);
}, [data]);

// Memoize callbacks
const handleClick = useCallback(() => {
  console.log('Clicked');
}, []);
```

### 9.4 Database Query Optimization

```javascript
// ✅ GOOD - Include only needed fields
const hotels = await Hotel.findAll({
  attributes: ['id', 'name', 'price', 'image_url'],
  include: [{
    model: Location,
    attributes: ['city', 'country'],
  }],
  limit: 10,
});

// ❌ BAD - Fetching all fields
const hotels = await Hotel.findAll({
  include: [Location],
});
```

---

## 10. TESTING & QUALITY ASSURANCE

### 10.1 Manual Testing Checklist

> [!WARNING]
> **Kiểm tra các điểm sau trước khi deploy**

- [ ] Tất cả forms có validation
- [ ] Error states được hiển thị đúng
- [ ] Loading states hoạt động
- [ ] Responsive trên mobile, tablet, desktop
- [ ] Authentication flow hoạt động
- [ ] API error handling
- [ ] Browser compatibility (Chrome, Firefox, Safari, Edge)
- [ ] Performance (Lighthouse score > 80)

### 10.2 Code Review Checklist

- [ ] Code tuân thủ naming conventions
- [ ] Không có console.log trong production code
- [ ] Không có hardcoded values (sử dụng env variables)
- [ ] Error handling đầy đủ
- [ ] Comments cho logic phức tạp
- [ ] No unused imports/variables
- [ ] Consistent formatting

---

## 11. DEPLOYMENT & DEVOPS

### 11.1 Environment Setup

```bash
# Development
npm run dev          # Frontend (Vite dev server)
npm run dev          # Backend (Nodemon)

# Production Build
npm run build        # Frontend
npm start            # Backend

# Database
npm run db:migrate   # Run migrations
npm run db:seed      # Seed database
```

### 11.2 Environment Variables

```bash
# Backend .env
NODE_ENV=production
PORT=5000
DATABASE_URL=mysql://user:pass@host:3306/dbname
CLERK_SECRET_KEY=sk_live_xxxxx
CLOUDINARY_URL=cloudinary://xxxxx
JWT_SECRET=your-secret-key

# Frontend .env
VITE_API_URL=https://api.yourdomain.com/api
VITE_CLERK_PUBLISHABLE_KEY=pk_live_xxxxx
```

### 11.3 CORS Configuration

```javascript
// server.js
import cors from 'cors';

const allowedOrigins = [
  'http://localhost:5173',
  'https://yourdomain.com',
  'https://www.yourdomain.com',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
}));
```

---

## 12. DOCUMENTATION STANDARDS

### 12.1 Code Comments

```javascript
/**
 * Calculate total price with discount
 * @param {number} basePrice - Original price
 * @param {number} discountPercent - Discount percentage (0-100)
 * @returns {number} Final price after discount
 */
function calculateDiscountedPrice(basePrice, discountPercent) {
  return basePrice * (1 - discountPercent / 100);
}
```

### 12.2 API Documentation

```javascript
/**
 * @route   GET /api/hotels/:id
 * @desc    Get hotel by ID
 * @access  Public
 * @param   {string} id - Hotel ID
 * @returns {Object} Hotel object
 * @throws  {404} Hotel not found
 * @throws  {500} Server error
 */
```

### 12.3 README Structure

```markdown
# Project Name

## Description
Brief project description

## Tech Stack
- Frontend: React + Vite + TailwindCSS
- Backend: Node.js + Express + Sequelize
- Database: MySQL

## Installation
1. Clone repository
2. Install dependencies
3. Setup database
4. Configure environment variables
5. Run application

## Project Structure
Brief overview of folder structure

## Available Scripts
List of npm scripts

## Environment Variables
Required environment variables

## Contributing
Contribution guidelines

## License
License information
```

---

## 📌 QUICK REFERENCE

### Color Quick Reference
- **Primary Blue:** `#0D47A1`
- **Primary Orange:** `#FF6B35`
- **Background:** `#FFFFFF`, `#F0F7FF`, `#E3F2FD`
- **Text:** `#212121`
- **Border:** `#BBDEFB`

### Border Radius Standard
- **All elements:** `8px` (rounded-lg)

### Spacing Standard
- **Section padding:** `py-8` (2rem)
- **Card padding:** `p-6` (1.5rem)
- **Element gaps:** `gap-4` (1rem)

### Button Standard
```jsx
<button 
  className="px-5 py-2 rounded-lg text-white font-semibold shadow-md hover:opacity-90 transition"
  style={{ backgroundColor: '#FF6B35', borderRadius: '8px' }}
>
  Action
</button>
```

---

## 🔄 VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-01-27 | Initial release |

---

##  SUPPORT

Nếu có thắc mắc về quy chuẩn này, vui lòng tham khảo:
- Project README.md
- DATABASE_SETUP.md
- Existing codebase examples

---

> **Note:** Quy chuẩn này là living document và sẽ được cập nhật theo thời gian dựa trên feedback và best practices mới.
