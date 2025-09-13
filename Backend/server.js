require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');
const cookieParser = require('cookie-parser');
const fileUpload = require('express-fileupload');
const path = require('path');
const os = require('os');
const fs = require('fs');

// Initialize Express app
const app = express();
const server = http.createServer(app);

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};
connectDB();

// Security middleware
// app.use(helmet({
//   crossOriginEmbedderPolicy: false, // Keep false for now
// }));

// Configure CORS
const allowedOrigins = [
  'http://localhost:3000', // Local development
  'https://event-ticketing-o6r7.vercel.app', // Vercel deployment
  'https://event-ticketing-frontend.vercel.app', // Alternative Vercel URL
  'https://event-ticketing.vercel.app', // Another possible Vercel URL
  'https://*.vercel.app' // Allow any Vercel subdomain
];

app.use(cors({
  origin: function (origin, callback) {
    console.log('CORS request from origin:', origin);
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) {
      console.log('CORS: Allowing request with no origin');
      return callback(null, true);
    }
    
    // Check if origin is in allowed list
    if (allowedOrigins.includes(origin)) {
      console.log('CORS: Allowing origin:', origin);
      return callback(null, true);
    }
    
    // Check if origin matches Vercel pattern
    if (origin.includes('.vercel.app')) {
      console.log('CORS: Allowing Vercel origin:', origin);
      return callback(null, true);
    }
    
    console.log('CORS: Blocking origin:', origin);
    console.log('CORS: Allowed origins:', allowedOrigins);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  exposedHeaders: ['Content-Type', 'Authorization']
}));

// Set Cross-Origin-Resource-Policy and Cross-Origin-Embedder-Policy globally
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'credentialless');
  next();
});

// Serve static files from the uploads directory with proper headers
app.use('/uploads', (req, res, next) => {
  const origin = req.headers.origin;
  if (origin === 'http://localhost:3000' || origin === 'http://localhost:5173') {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  next();
}, express.static(path.join(__dirname, 'uploads')));

// File upload middleware
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: os.tmpdir(),
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB max file size
  abortOnLimit: true
}));

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());

// Rate limiting - more permissive for development
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // More requests allowed in development
  message: 'Too many requests from this IP, please try again later',
  standardHeaders: true,
  legacyHeaders: false
});

// Apply rate limiting to all routes
app.use('/api/', limiter);

// Body and cookie parsers (moved after fileUpload)
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

// Static files
// app.use('/uploads', express.static(path.resolve(__dirname, 'uploads')));

// Static files (if needed)
app.use(express.static(path.join(__dirname, 'public')));

// Socket.IO for real-time updates
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3000', 'http://localhost:5173'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept']
  },
  transports: ['websocket', 'polling'],
  pingTimeout: 60000,
});

io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });

  // Handle custom events
  socket.on('joinEventRoom', (eventId) => {
    socket.join(`event_${eventId}`);
    console.log(`User joined event room: event_${eventId}`);
  });

  socket.on('leaveEventRoom', (eventId) => {
    socket.leave(`event_${eventId}`);
    console.log(`User left event room: event_${eventId}`);
  });
});

// Make io accessible in routes
app.set('io', io);

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/payments', require('./routes/paymentRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/users', require('./routes/userRoutes'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Temporary route to test image serving directly
app.get('/test-image', (req, res) => {
  const imagePath = path.resolve(__dirname, 'uploads', 'events', '1749490281867-v1.jpg');
  res.sendFile(imagePath, (err) => {
    if (err) {
      console.error('Error sending test image:', err);
      res.status(500).send('Error loading test image.');
    }
  });
});

// Dedicated route for serving event images
// app.get('/uploads/events/:filename', (req, res) => {
//   const filename = req.params.filename;
//   const imagePath = path.join(__dirname, 'uploads', 'events', filename);

//   // Check if file exists
//   if (!fs.existsSync(imagePath)) {
//     return res.status(404).json({ message: 'Image not found' });
//   }

//   // Read file and convert to base64
//   fs.readFile(imagePath, (err, data) => {
//     if (err) {
//       console.error('Error reading image:', err);
//       return res.status(500).json({ message: 'Error reading image' });
//     }

//     // Convert to base64
//     const base64Image = `data:image/jpeg;base64,${data.toString('base64')}`;

//     // Set headers
//     res.setHeader('Content-Type', 'application/json');
//     res.setHeader('Access-Control-Allow-Origin', '*');

//     // Send base64 data
//     res.json({ imageData: base64Image });
//   });
// });

// Handle 404
app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server`
  });
});

// Error handling middleware (should be last)
app.use(require('./middleware/errorHandler'));

// Start server
const PORT = process.env.PORT || 5001; // Changed to port 5001 to avoid conflicts
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
  console.error('UNHANDLED REJECTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.error(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});