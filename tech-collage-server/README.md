# Tech College Server API

Tech College backend server built with Node.js, Express.js, MongoDB (Mongoose), Multer and ImageKit.

## Features

- 🔐 JWT-based authentication
- 👨‍🏫 Teacher management (CRUD operations)
- 📰 News management (CRUD operations)
- 🖼️ Image upload to ImageKit
- 🛡️ Security middleware (Helmet, Rate Limiting)
- 📝 Request logging (Morgan)
- ⚡ Response compression
- 🔄 Database connection retry logic
- ✅ Global error handling

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- ImageKit account

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd tech-collage-server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Configure environment variables in `.env`:
```env
PORT=5000
NODE_ENV=production

MONGODB_URI=mongodb://your-mongodb-connection-string

JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=1d

ADMIN_USERNAME=your_admin_username
ADMIN_PASSWORD=your_strong_password

IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint

ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
```

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 5000 |
| `NODE_ENV` | Environment (development/production) | No | development |
| `MONGODB_URI` | MongoDB connection string | **Yes** | - |
| `JWT_SECRET` | JWT secret key | **Yes** (production) | - |
| `JWT_EXPIRES_IN` | JWT expiration time | No | 1d |
| `ADMIN_USERNAME` | Admin username | **Yes** (production) | admin |
| `ADMIN_PASSWORD` | Admin password | **Yes** (production) | password123 |
| `IMAGEKIT_PUBLIC_KEY` | ImageKit public key | **Yes** | - |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key | **Yes** | - |
| `IMAGEKIT_URL_ENDPOINT` | ImageKit URL endpoint | **Yes** | - |
| `ALLOWED_ORIGINS` | Comma-separated list of allowed CORS origins | No | localhost:3000,localhost:5173 |

## Running the Application

### Development
```bash
npm run dev
```

### Production
```bash
npm start
```

## API Endpoints

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### Logout
```http
POST /api/auth/logout
Authorization: Bearer <token>
```

### Teachers

All teacher endpoints require admin authentication.

- `GET /api/teachers` - Get all teachers
- `GET /api/teachers/:id` - Get teacher by ID
- `POST /api/teachers` - Create new teacher (with image)
- `PUT /api/teachers/:id` - Update teacher (image optional)
- `DELETE /api/teachers/:id` - Delete teacher

**Create Teacher Example:**
```http
POST /api/teachers
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "fullName": "John Doe",
  "subject": "Mathematics",
  "teacherImg": <file>
}
```

### News

All news endpoints require admin authentication.

- `GET /api/news` - Get all news
- `GET /api/news/:id` - Get news by ID
- `POST /api/news` - Create new news (with image)
- `PUT /api/news/:id` - Update news (image optional)
- `DELETE /api/news/:id` - Delete news

**Create News Example:**
```http
POST /api/news
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "News Title",
  "description": "News description",
  "img": <file>
}
```

## Security Features

- **Helmet**: Sets various HTTP headers for security
- **Rate Limiting**: 
  - General: 100 requests per 15 minutes per IP
  - Auth endpoints: 5 requests per 15 minutes per IP
- **CORS**: Configurable allowed origins
- **JWT**: Token-based authentication with blacklist support
- **Input Validation**: Request body validation
- **File Upload Limits**: 5MB max file size

## Error Handling

The API uses a global error handler that:
- Handles Mongoose validation errors
- Handles JWT errors
- Provides consistent error responses
- Logs errors in development mode

## File Upload

- Files are temporarily stored locally
- Uploaded to ImageKit
- Local files are automatically deleted after upload
- Supported formats: Images (jpg, png, gif, etc.)
- Max file size: 5MB

## Database

- MongoDB with Mongoose ODM
- Automatic connection retry (5 attempts with 5-second delay)
- Connection pool management
- Automatic reconnection on disconnect

## Logging

- **Development**: Detailed request logs (Morgan dev format)
- **Production**: Combined format with IP, date, method, etc.

## Project Structure

```
tech-collage-server/
├── config/
│   ├── db.js              # MongoDB connection
│   └── imagekit.js        # ImageKit configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── newsController.js  # News CRUD operations
│   └── teacherController.js # Teacher CRUD operations
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   ├── errorHandler.js    # Global error handler
│   └── upload.js          # File upload middleware
├── models/
│   ├── BlacklistToken.js  # Token blacklist model
│   ├── News.js            # News model
│   └── Teacher.js         # Teacher model
├── routes/
│   ├── authRoutes.js      # Auth routes
│   ├── newsRoutes.js      # News routes
│   └── teacherRoutes.js   # Teacher routes
├── uploads/               # Temporary file storage
├── .env.example           # Environment variables template
├── .gitignore
├── package.json
├── README.md
└── server.js              # Main server file
```

## Production Deployment Checklist

- [ ] Set all required environment variables
- [ ] Use strong `JWT_SECRET` (at least 32 characters)
- [ ] Use strong `ADMIN_PASSWORD`
- [ ] Configure `ALLOWED_ORIGINS` with production domains
- [ ] Set `NODE_ENV=production`
- [ ] Use production MongoDB connection string
- [ ] Configure ImageKit credentials
- [ ] Enable HTTPS
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy for MongoDB

## License

MIT

## Author

Tech College Development Team

