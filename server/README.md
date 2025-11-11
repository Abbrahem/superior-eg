# SUPERIOR.EG Backend API

## 🚀 Quick Start

### Installation
```bash
cd server
npm install
```

### Environment Setup
Create `.env` file with:
```env
MONGODB_URI=mongodb+srv://admin_abrahem:abrahem88@cluster0.kp6lgym.mongodb.net/superior_store?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=superior_jwt_secret_key_2024_very_secure_random_string
PORT=5000
NODE_ENV=development

# Admin Default Credentials
ADMIN_EMAIL=admin@superior.eg
ADMIN_USERNAME=admin
ADMIN_PASSWORD=Superior123!
```

### Run Server
```bash
# Development
npm run dev

# Production
npm start
```

## 🔐 Default Admin Credentials
- **Email:** admin@superior.eg
- **Username:** admin
- **Password:** Superior123!

## 📚 API Endpoints

### Public Endpoints

#### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product

#### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/:id` - Get order by ID

#### Promo Codes
- `POST /api/promocodes/validate` - Validate promo code

#### Contact
- `POST /api/contact` - Submit contact message

### Admin Endpoints (Requires Authentication)

#### Authentication
- `POST /api/admin/login` - Admin login

#### Products Management
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `PATCH /api/admin/products/:id/toggle-sold-out` - Toggle sold out status

#### Orders Management
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status

#### Promo Codes Management
- `GET /api/promocodes` - Get all promo codes
- `POST /api/promocodes` - Create promo code
- `DELETE /api/promocodes/:id` - Delete promo code
- `PATCH /api/promocodes/:id/toggle` - Toggle promo code status

#### Contact Messages
- `GET /api/contact` - Get all contact messages
- `PATCH /api/contact/:id/read` - Mark message as read
- `DELETE /api/contact/:id` - Delete contact message

## 🗄️ Database Collections

### Products
```javascript
{
  name: String,
  price: Number,
  description: String,
  category: String, // HOODIES, T-SHIRTS, ACCESSORIES
  colors: [String],
  sizes: [String],
  images: [String], // base64 encoded
  soldOut: Boolean
}
```

### Orders
```javascript
{
  customerInfo: {
    name, email, phone, address, city, governorate
  },
  items: [{
    productId, name, price, color, size, quantity
  }],
  total: Number,
  promoCode: String,
  discount: Number,
  status: String // pending, processing, shipped, delivered, cancelled
}
```

### Promo Codes
```javascript
{
  code: String,
  discount: Number, // percentage
  expiresAt: Date,
  maxUses: Number,
  usedCount: Number,
  isActive: Boolean
}
```

## 🔒 Authentication
- JWT tokens with 24h expiration
- Admin roles: `admin`, `super_admin`
- Protected routes require `Authorization: Bearer <token>` header

## 🛡️ Security Features
- Helmet.js for security headers
- Rate limiting (100 requests per 15 minutes)
- CORS configuration
- Password hashing with bcrypt
- Input validation and sanitization

## 📊 Features
- Image storage as base64 (no file uploads needed)
- Promo code system with usage limits
- Order management with status tracking
- Contact form with admin dashboard
- Search and filtering for products
- Comprehensive error handling
- MongoDB indexes for performance