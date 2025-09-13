# Multi-Tenant SaaS Notes Application

A full-stack MERN application that provides multi-tenant note management with role-based access control and subscription feature gating.

## 🏗️ Architecture

### Multi-Tenancy Approach: Shared Schema with Tenant ID

This application uses the **shared schema with tenant ID** approach for multi-tenancy:

- **Single Database**: One MongoDB database serves all tenants
- **Tenant Isolation**: Each document includes a `tenant` field that references the tenant
- **Data Segregation**: All queries are filtered by tenant ID to ensure strict data isolation
- **Scalability**: Easy to scale and maintain while providing strong tenant separation

### Technology Stack

- **Frontend**: React 18, React Router, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Deployment**: Vercel
- **Database**: MongoDB Atlas (recommended for production)

## 🚀 Features

### Multi-Tenancy
- ✅ Support for multiple tenants (Acme, Globex)
- ✅ Strict data isolation between tenants
- ✅ Tenant-specific user management
- ✅ Tenant-based subscription management

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin, Member)
- ✅ Secure password hashing with bcryptjs
- ✅ Protected routes and API endpoints

### Subscription Management
- ✅ **Free Plan**: Limited to 3 notes per tenant
- ✅ **Pro Plan**: Unlimited notes
- ✅ Admin-only upgrade endpoint
- ✅ Real-time subscription status updates

### Notes Management
- ✅ Full CRUD operations for notes
- ✅ Tenant-isolated note storage
- ✅ Real-time note limit enforcement
- ✅ Rich text content support

### Frontend Features
- ✅ Modern, responsive UI
- ✅ Real-time authentication state management
- ✅ Intuitive note creation and editing
- ✅ Subscription upgrade interface
- ✅ Error handling and user feedback

## 📋 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Notes
- `POST /api/notes` - Create a new note
- `GET /api/notes` - List all notes for current tenant
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Tenants
- `GET /api/tenants/:slug` - Get tenant information
- `POST /api/tenants/:slug/upgrade` - Upgrade to Pro plan (Admin only)

### Users
- `GET /api/users` - Get all users for current tenant (Admin only)
- `POST /api/users/invite` - Invite new user to tenant (Admin only)

### Health Check
- `GET /health` - Application health status

## 🔐 Test Accounts

All test accounts use the password: `password`

| Email | Role | Tenant | Subscription |
|-------|------|--------|-------------|
| admin@acme.test | Admin | Acme | Free |
| user@acme.test | Member | Acme | Free |
| admin@globex.test | Admin | Globex | Free |
| user@globex.test | Member | Globex | Free |

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- Vercel CLI (for deployment)

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd multi-tenant-notes-app
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Set up environment variables**
   
   Create `server/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/notes-app
   JWT_SECRET=your-super-secret-jwt-key-here
   NODE_ENV=development
   PORT=5000
   ```

   Create `client/.env.local`:
   ```env
   REACT_APP_API_URL=http://localhost:5000
   ```

4. **Seed the database**
   ```bash
   cd server
   node seed.js
   ```

5. **Start the development servers**
   ```bash
   npm run dev
   ```

   This will start:
   - Backend server on `http://localhost:5000`
   - Frontend on `http://localhost:3000`

## 🚀 Deployment on Vercel

### Backend Deployment

1. **Deploy backend to Vercel**
   ```bash
   cd server
   vercel --prod
   ```

2. **Set environment variables in Vercel dashboard**
   - `MONGODB_URI`: Your MongoDB Atlas connection string
   - `JWT_SECRET`: A secure random string
   - `NODE_ENV`: production

3. **Note the backend URL** (e.g., `https://your-backend.vercel.app`)

### Frontend Deployment

1. **Update API URL**
   ```bash
   cd client
   echo "REACT_APP_API_URL=https://your-backend.vercel.app" > .env.production
   ```

2. **Deploy frontend to Vercel**
   ```bash
   vercel --prod
   ```

3. **Update CORS settings** in `server/index.js` with your frontend URL

### Database Setup

1. **Create MongoDB Atlas cluster** (recommended for production)
2. **Update MONGODB_URI** in Vercel environment variables
3. **Run seed script** to create test data:
   ```bash
   cd server
   node seed.js
   ```

## 🔒 Security Features

### Multi-Tenant Data Isolation
- Every database query includes tenant filtering
- Users can only access data from their own tenant
- API endpoints validate tenant ownership
- No cross-tenant data leakage possible

### Authentication Security
- JWT tokens with 7-day expiration
- Secure password hashing with bcryptjs
- Protected API routes with middleware
- CORS configuration for production

### Role-Based Access Control
- **Admin**: Can upgrade subscriptions, invite users, view all users
- **Member**: Can only manage notes within their tenant
- API endpoints enforce role-based permissions

## 📊 Database Schema

### Tenant Collection
```javascript
{
  name: String,           // "Acme", "Globex"
  slug: String,           // "acme", "globex"
  subscription: String,   // "free", "pro"
  noteLimit: Number,      // 3 for free, -1 for pro (unlimited)
  createdAt: Date
}
```

### User Collection
```javascript
{
  email: String,          // Unique email
  password: String,       // Hashed password
  role: String,           // "admin", "member"
  tenant: ObjectId,       // Reference to Tenant
  createdAt: Date
}
```

### Note Collection
```javascript
{
  title: String,          // Note title
  content: String,        // Note content
  tenant: ObjectId,       // Reference to Tenant
  author: ObjectId,       // Reference to User
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing the Application

### Automated Test Validation

The application is designed to pass automated test scripts that verify:

1. **Health endpoint availability** - `GET /health`
2. **Successful login** for all predefined accounts
3. **Tenant isolation** - Data from one tenant is not accessible to another
4. **Role-based restrictions** - Members cannot access admin functions
5. **Free plan note limit enforcement** - Limited to 3 notes
6. **Pro plan upgrade** - Removes note limit after upgrade
7. **CRUD operations** - All note endpoints function correctly
8. **Frontend accessibility** - UI is accessible and functional

### Manual Testing Steps

1. **Login with test accounts**
2. **Create notes** (test free plan limit)
3. **Verify tenant isolation** (login with different tenant)
4. **Test role restrictions** (member vs admin)
5. **Upgrade to Pro** (admin only)
6. **Verify unlimited notes** after upgrade

## 🔧 Configuration

### Environment Variables

#### Backend (server/.env)
```env
MONGODB_URI=mongodb://localhost:27017/notes-app
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
PORT=5000
```

#### Frontend (client/.env.local)
```env
REACT_APP_API_URL=http://localhost:5000
```

### CORS Configuration

The application is configured to allow CORS for:
- Development: `http://localhost:3000`
- Production: Your deployed frontend URL

## 📝 API Usage Examples

### Login
```bash
curl -X POST https://your-backend.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.test","password":"password"}'
```

### Create Note
```bash
curl -X POST https://your-backend.vercel.app/api/notes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Note","content":"Note content here"}'
```

### Upgrade to Pro
```bash
curl -X POST https://your-backend.vercel.app/api/tenants/acme/upgrade \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN"
```

## 🐛 Troubleshooting

### Common Issues

1. **CORS errors**: Update CORS origin in `server/index.js`
2. **Database connection**: Verify MongoDB URI and network access
3. **JWT errors**: Check JWT_SECRET is set correctly
4. **Build failures**: Ensure all dependencies are installed

### Debug Mode

Enable debug logging by setting `NODE_ENV=development` in your environment variables.

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions, please create an issue in the repository or contact the development team.

---

**Note**: This application is designed for evaluation purposes and includes test data. For production use, implement additional security measures, monitoring, and error handling as needed.
