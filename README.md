# TaskFlow - Task Management Application

A full-stack Task Management Application built with the MERN stack (MongoDB replaced with PostgreSQL), featuring JWT authentication, Redux state management, and Chart.js dashboard analytics.

![TaskFlow](https://via.placeholder.com/800x400/121316/ec751c?text=TaskFlow+Task+Management)

## 🚀 Features

- **Authentication**: JWT-based secure authentication with login and registration
- **Task Management**: Full CRUD operations for tasks
- **Task Properties**: Title, description, status (Todo/In Progress/Completed), priority (Low/Medium/High), due date
- **Dashboard Analytics**: Interactive charts using Chart.js showing task statistics
- **Search & Filtering**: Search tasks, filter by status/priority, sort options
- **Responsive Design**: Modern, glassmorphism UI that works on all devices
- **Form Validation**: Client and server-side validation
- **Error Handling**: Comprehensive error handling with toast notifications

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **Sequelize** - ORM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Redux Toolkit** - State management
- **React Router v6** - Routing
- **Chart.js + react-chartjs-2** - Data visualization
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **Lucide React** - Icons
- **React Hot Toast** - Notifications

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── index.js
│   │   │   ├── User.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── auth.js
│   │   │   └── tasks.js
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Loading.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ProtectedRoute.jsx
│   │   │   ├── TaskCard.jsx
│   │   │   ├── TaskFilters.jsx
│   │   │   └── TaskForm.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   └── Tasks.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── store/
│   │   │   ├── authSlice.js
│   │   │   ├── index.js
│   │   │   └── tasksSlice.js
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

## 🔧 Installation & Setup

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL (local or cloud like Supabase)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file from example:
```bash
cp .env.example .env
```

4. Configure your environment variables:
```env
# Database - Local PostgreSQL
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=your_password

# OR use Supabase (recommended for deployment)
DATABASE_URL=postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres

# JWT
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d

# Server
PORT=5000
NODE_ENV=development

# Frontend URL
FRONTEND_URL=http://localhost:5173
```

5. Start the server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```bash
cp .env.example .env
```

4. Configure API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

5. Start the development server:
```bash
npm run dev
```

## 🌐 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (Protected) |
| PUT | `/api/auth/profile` | Update profile (Protected) |

### Tasks (All Protected)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with filters) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/stats` | Get task statistics |

### Query Parameters for GET /api/tasks
- `status` - Filter by status (Todo, In Progress, Completed)
- `priority` - Filter by priority (Low, Medium, High)
- `search` - Search in title and description
- `sortBy` - Sort field (createdAt, dueDate, title, priority, status)
- `order` - Sort order (ASC, DESC)
- `page` - Page number
- `limit` - Items per page

## 🚀 Deployment

### Backend Deployment (Render/Railway)

1. Create a new Web Service on Render or Railway
2. Connect your GitHub repository
3. Set environment variables:
   - `DATABASE_URL` (Supabase connection string)
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN`
   - `NODE_ENV=production`
   - `FRONTEND_URL` (your deployed frontend URL)
4. Set build command: `npm install`
5. Set start command: `npm start`

### Frontend Deployment (Vercel)

1. Install Vercel CLI or use dashboard
2. Import your repository
3. Set root directory to `frontend`
4. Set environment variable:
   - `VITE_API_URL` (your deployed backend URL)
5. Deploy!

### Database Setup (Supabase)

1. Create a new project on [Supabase](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string (URI format)
4. Use this as your `DATABASE_URL`

## 📊 Screenshots

### Dashboard
- Task statistics with doughnut chart
- Priority distribution bar chart
- 7-day completion trend line chart
- Recent tasks list

### Tasks Page
- Task cards with status indicators
- Search and filter functionality
- Create/Edit task modals
- Pagination

### Authentication
- Clean login/register forms
- Form validation
- Password visibility toggle

## 🔒 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation and sanitization
- CORS configuration
- SQL injection prevention via Sequelize

## 📝 License

MIT License - feel free to use this project for learning or building your own applications!

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

---

Made with ❤️ using the MERN stack (with PostgreSQL)
