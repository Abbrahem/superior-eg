# SUPERIOR.EG E-commerce Store

A modern, full-stack e-commerce platform built with React and Node.js.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB Atlas account
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd superior-store
```

2. **Install dependencies**
```bash
npm run install-all
```

3. **Setup environment variables**
Create `server/.env` file:
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

4. **Run the application**
```bash
npm run dev
```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## 🔐 Admin Access

**Default Admin Credentials:**
- **Email:** admin@superior.eg
- **Username:** admin
- **Password:** Superior123!

**Admin Panel:** http://localhost:3000/admin/login

## 📱 Features

### Customer Features
- Browse products by category
- Product search and filtering
- Shopping cart functionality
- Secure checkout process
- Promo code system
- Contact form
- Responsive design

### Admin Features
- Product management (CRUD)
- Order management
- Promo code creation and management
- Contact message handling
- Sales analytics dashboard
- Image upload with base64 compression

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI framework
- **React Router** - Navigation
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **SweetAlert2** - Notifications
- **Context API** - State management

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Helmet** - Security headers
- **Rate limiting** - DDoS protection

## 📊 Database Schema

### Collections
- **products** - Product catalog
- **orders** - Customer orders
- **promocodes** - Discount codes
- **admins** - Admin users
- **contactmessages** - Contact form submissions

## 🔒 Security Features

- JWT authentication with 24h expiration
- Password hashing with bcrypt
- Rate limiting (100 requests/15min)
- CORS protection
- Helmet security headers
- Input validation and sanitization
- Admin role-based access control

## 📁 Project Structure

```
superior-store/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── context/        # React context
│   │   ├── config/         # Configuration files
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── models/             # MongoDB models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── utils/              # Utility functions
│   ├── server.js           # Entry point
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Frontend (Netlify/Vercel)
```bash
cd client
npm run build
# Deploy the build folder
```

### Backend (Heroku/Railway)
```bash
cd server
# Set environment variables
# Deploy to your platform
```

## 📝 API Documentation

### Public Endpoints
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/orders` - Create order
- `POST /api/promocodes/validate` - Validate promo code
- `POST /api/contact` - Submit contact message

### Admin Endpoints (Protected)
- `POST /api/admin/login` - Admin login
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id/status` - Update order status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For support, email support@superior.eg or contact us through the website.