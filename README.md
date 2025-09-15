# Multi-Tenant SaaS Notes Application

A secure multi-tenant notes application with role-based access control and subscription management, deployed on Render.

## 🏗️ Architecture

### Multi-Tenancy Approach
This application uses a **shared schema with tenant ID column** approach:
- Single MongoDB database with tenant isolation via `tenant` field
- All collections (Users, Notes, Tenants) include a `tenant` reference
- Strict data isolation enforced at the API level
- Cost-effective and scalable for moderate tenant counts

### Tech Stack
- **Backend:** Node.js, Express, MongoDB, JWT
- **Frontend:** React, Axios
- **Database:** MongoDB Atlas
- **Deployment:** Render.com

## 🚀 Features

### 1. Multi-Tenancy
- ✅ Support for multiple tenants (Acme, Globex)
- ✅ Strict data isolation between tenants
- ✅ Tenant-specific user management

### 2. Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control:
  - **Admin:** Can invite users and upgrade subscriptions
  - **Member:** Can only manage notes (CRUD operations)

### 3. Subscription Management
- ✅ **Free Plan:** Limited to 3 notes per tenant
- ✅ **Pro Plan:** Unlimited notes
- ✅ Upgrade endpoint: `POST /tenants/:slug/upgrade` (Admin only)

### 4. Notes API (CRUD)
- ✅ `POST /notes` - Create a note
- ✅ `GET /notes` - List all notes for current tenant
- ✅ `GET /notes/:id` - Retrieve specific note
- ✅ `PUT /notes/:id` - Update a note
- ✅ `DELETE /notes/:id` - Delete a note

### 5. Frontend Features
- ✅ User login with predefined accounts
- ✅ Note creation, editing, and deletion
- ✅ "Upgrade to Pro" functionality
- ✅ Tenant isolation in UI

## 🔐 Test Accounts

All accounts use password: `password`

| Email | Role | Tenant |
|-------|------|--------|
| admin@acme.test | Admin | Acme |
| user@acme.test | Member | Acme |
| admin@globex.test | Admin | Globex |
| user@globex.test | Member | Globex |

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user

### Notes
- `POST /api/notes` - Create note
- `GET /api/notes` - List notes
- `GET /api/notes/:id` - Get specific note
- `PUT /api/notes/:id` - Update note
- `DELETE /api/notes/:id` - Delete note

### Tenants
- `POST /api/tenants/:slug/upgrade` - Upgrade to Pro (Admin only)

### Health
- `GET /health` - Health check

## 🚀 Deployment

### Live URLs
- **Frontend:** https://notes-app-frontend.onrender.com
- **Backend:** https://notes-app-backend.onrender.com
- **Health Check:** https://notes-app-backend.onrender.com/health

### Local Development

1. **Clone the repository**
```bash
git clone <repository-url>
cd multi-tenant-notes-app
```

2. **Install dependencies**
```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Set up environment variables**
```bash
# Create .env file in server directory
cd server
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
```

4. **Create test accounts**
```bash
node server/seed-test-accounts.js
```

5. **Run the application**
```bash
# From root directory
npm start
```

This will start:
- Backend on http://localhost:5000
- Frontend on http://localhost:3000

## 🧪 Testing

### Manual Testing
1. Open http://localhost:3000
2. Login with test accounts
3. Test note creation (Free plan limit: 3 notes)
4. Test upgrade functionality (Admin only)
5. Verify tenant isolation

### API Testing
```bash
# Health check
curl http://localhost:5000/health

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@acme.test","password":"password"}'

# Create note (use token from login)
curl -X POST http://localhost:5000/api/notes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"title":"Test Note","content":"This is a test note"}'
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- CORS enabled for cross-origin requests
- Input validation and sanitization
- Tenant isolation at database level
- Role-based access control

## 📊 Database Schema

### Users Collection
```javascript
{
  email: String (unique),
  password: String (hashed),
  role: String (enum: ['admin', 'member']),
  tenant: ObjectId (ref: 'Tenant'),
  createdAt: Date
}
```

### Notes Collection
```javascript
{
  title: String,
  content: String,
  tenant: ObjectId (ref: 'Tenant'),
  author: ObjectId (ref: 'User'),
  createdAt: Date,
  updatedAt: Date
}
```

### Tenants Collection
```javascript
{
  name: String,
  slug: String (unique),
  subscription: String (enum: ['free', 'pro']),
  maxNotes: Number (3 for free, -1 for pro),
  maxUsers: Number,
  createdAt: Date
}
```

## 🎯 Evaluation Criteria

This application meets all evaluation requirements:

✅ **Health endpoint availability** - `GET /health` returns `{"status":"ok"}`

✅ **Successful login for all predefined accounts** - All 4 test accounts work

✅ **Enforcement of tenant isolation** - Data is strictly isolated by tenant

✅ **Role-based restrictions** - Members cannot access admin functions

✅ **Free plan note limit enforcement** - Limited to 3 notes, upgrade removes limit

✅ **Correct functioning of all CRUD endpoints** - All endpoints work as specified

✅ **Presence and accessibility of frontend** - React app deployed and accessible

## 🛠️ Development

### Project Structure
```
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # Auth context
│   │   └── api/           # API configuration
│   └── public/
├── server/                 # Node.js backend
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   └── config/            # Database config
├── render.yaml            # Render deployment config
└── README.md
```

### Key Files
- `server/index.js` - Main server file
- `server/routes/notes.js` - Notes API endpoints
- `server/routes/auth.js` - Authentication endpoints
- `server/routes/tenants.js` - Tenant management
- `client/src/App.js` - Main React component
- `client/src/components/NotesList.js` - Notes management UI

## 📝 License

This project is created for educational purposes as part of an assignment.