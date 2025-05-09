import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import swaggerUi, { serve } from 'swagger-ui-express';
import swaggerJSDoc from 'swagger-jsdoc';
import { Request, Response, NextFunction } from 'express';
import employeeRouter from './controller/employee.routes';
import employmentRouter from './controller/employment.routes';
import personRouter from './controller/person.routes';
import memberRouter from './controller/member.routes';
import regionRouter from './controller/region.routes';
import subscriptionRouter from './controller/subscription.routes';
import clubRouter from './controller/club.routes';
import enrollmentRouter from './controller/enrollment.routes';
import authRouter from './controller/auth.routes';
import searchRouter from './controller/search.routes';
import helmet from 'helmet';
import { csrfProtection, attachCsrfToken } from './middleware/csrf.middleware';
import { validateRequest } from './middleware/validation.middleware';
import { sqlInjectionProtection } from './middleware/sql-injection.middleware';
import { ssrfProtection } from './middleware/ssrf.middleware';
import crypto from 'crypto';

const app = express();

// Enhanced security with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", process.env.SCRIPT_SRC || ''],
      styleSrc: ["'self'", process.env.STYLE_SRC || ''],
      imgSrc: ["'self'", "data:", process.env.IMG_SRC || ''],
      connectSrc: ["'self'", ...(process.env.API_DOMAINS ? process.env.API_DOMAINS.split(',') : [])],
      fontSrc: ["'self'", process.env.FONT_SRC || ''],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      // Adding more security headers
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"],
      upgradeInsecureRequests: "'true'",
    },
    reportOnly: process.env.CSP_REPORT_ONLY === 'true',
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  noSniff: true,
  xssFilter: true,
}));

const port = process.env.APP_PORT || 3001;

// Configure CORS for security
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',') 
  : ['http://localhost:3000'];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token'],
  credentials: true,
  maxAge: 600 // Cache preflight requests for 10 minutes
}));

app.use(bodyParser.json({ limit: '100kb' })); // Limit request size to prevent DoS attacks

// Application-wide middlewares for security
app.use(validateRequest()); // XSS protection
app.use(sqlInjectionProtection()); // SQL injection protection
app.use(ssrfProtection()); // SSRF protection for all routes

// Generate a unique request ID for each request, helping with traceability
app.use((req, res, next) => {
  const requestId = crypto.randomBytes(16).toString('hex');
  req.headers['x-request-id'] = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
});

// Define a custom security response header
app.use((req, res, next) => {
  // Make it hard for attackers to determine what tech stack we're using
  res.removeHeader('X-Powered-By');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'accelerometer=(), camera=(), geolocation=(), microphone=()');
  next();
});

// Add a small random delay to responses to mitigate timing attacks
app.use((req, res, next) => {
  const delay = Math.floor(Math.random() * 20); // 0-20 ms delay
  setTimeout(next, delay);
});

// Simple endpoint for health check
app.get('/status', (req, res) => {
  res.json({ message: 'Back-end is running...' });
});

// For state-changing routes, attach CSRF protection middleware
// Public routes (no CSRF protection)
app.use('/auth/login', authRouter);
app.use('/auth/register', authRouter);
app.use('/auth/csrf-token', authRouter);

// Protected routes with CSRF protection
app.use('/auth', csrfProtection, authRouter);
app.use('/person', attachCsrfToken, csrfProtection, personRouter);
app.use('/member', attachCsrfToken, csrfProtection, memberRouter);
app.use('/region', attachCsrfToken, csrfProtection, regionRouter);
app.use('/subscription', attachCsrfToken, csrfProtection, subscriptionRouter);
app.use('/club', attachCsrfToken, csrfProtection, clubRouter);
app.use('/enrollment', attachCsrfToken, csrfProtection, enrollmentRouter);
app.use('/employment', attachCsrfToken, csrfProtection, employmentRouter);
app.use('/employee', attachCsrfToken, csrfProtection, employeeRouter);
app.use('/search', attachCsrfToken, csrfProtection, searchRouter);

// Swagger configuration
const swaggerOpts = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Subscription API',
      version: '1.0.0',
      description: 'A simple Express API for managing subscriptions',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./controller/*.routes.ts'],
};

try {
  const swaggerSpec = swaggerJSDoc(swaggerOpts);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
} catch (error) {
  console.log(error);
}

app.get('/', (req, res) => {
  res.redirect('/api-docs');
});

// Global error handler to prevent information leakage
app.use((err: Error, req: Request, res: Response, next: NextFunction): void => {
  console.error(`${req.headers['x-request-id']} - Error:`, err);
  
  // Don't expose error details in production
  const isProduction = process.env.NODE_ENV === 'production';
  
  res.status(400).json({
    status: 'error',
    message: isProduction ? 'An error occurred' : err.message,
    requestId: req.headers['x-request-id'],
  });
});

// Catch-all for undefined routes
app.use((req, res) => {
  res.status(404).json({ 
    status: 'error', 
    message: 'Resource not found',
    requestId: req.headers['x-request-id']
  });
});

app.listen(port, () => {
  console.log(`Back-end is running on port ${port}.`);
});