# Backend Deployment Guide for Render

## 🚀 Deployment Steps

### 1. **Prepare Your Repository**
- Ensure all files are committed to your Git repository
- Make sure you have the following files in your backend directory:
  - `package.json` (with proper start script)
  - `app.js` (main server file)
  - `config.js` (configuration file)
  - All route files in `/routes` directory
  - All model files in `/models` directory

### 2. **Environment Variables for Render**
Set these environment variables in your Render dashboard:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookwebsite
JWT_SECRET=your-super-secret-jwt-key-here
FRONTEND_URL=https://book-website-two.vercel.app
```

### 3. **Database Setup**
- Use MongoDB Atlas for cloud database
- Create a cluster and get your connection string
- Replace `username`, `password`, and `cluster` in the MONGODB_URI

### 4. **Render Configuration**
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Root Directory**: Leave empty (if backend is in root) or specify `backend`

### 5. **CORS Configuration**
The backend is configured to accept requests from:
- Development: `http://localhost:3000`, `http://localhost:5173`
- Production: Your frontend URL (set in FRONTEND_URL env var)

## 🔧 Local Development

### Install Dependencies
```bash
npm install
```

### Environment Setup
Create a `.env` file in the backend directory:
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/bookwebsite
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:3000
```

### Start Development Server
```bash
npm run dev
```

### Start Production Server
```bash
npm start
```

## 📋 Checklist Before Deployment

- [ ] All dependencies are in `package.json`
- [ ] Start script uses `node` (not `nodemon`)
- [ ] Environment variables are configured
- [ ] Database connection string is valid
- [ ] CORS is properly configured
- [ ] JWT secret is secure
- [ ] All routes are working locally

## 🐛 Troubleshooting

### Common Issues:
1. **Port Issues**: Render uses port 10000 by default
2. **Database Connection**: Ensure MongoDB Atlas is accessible
3. **CORS Errors**: Check FRONTEND_URL environment variable
4. **Build Failures**: Ensure all dependencies are in package.json

### Logs:
Check Render logs for detailed error messages and debugging information.
