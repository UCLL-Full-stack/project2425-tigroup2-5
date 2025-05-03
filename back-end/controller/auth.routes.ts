import express from 'express';
import authService from '../service/auth.service';
import { Request, Response } from 'express';
import { authRateLimiter } from '../middleware/rate-limiter.middleware';
import { Person } from '../model/person';

const router = express.Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Authenticate a user (member or employee)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               userType:
 *                 type: string
 *                 enum: [member, employee]
 *     responses:
 *       200:
 *         description: Authentication successful
 *       401:
 *         description: Authentication failed
 *       429:
 *         description: Too many login attempts
 */
router.post('/login', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email, password, userType } = req.body;
    
    console.log(`[AUTH] Login attempt: email=${email}, userType=${userType}`);
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    let result;
    if (userType === 'employee') {
      result = await authService.authenticateEmployee(email, password);
      return res.json({
        token: result.token,
        user: {
          id: result.employee.id,
          email: result.employee.person?.email,
          firstname: result.employee.person?.firstname,
          surname: result.employee.person?.surname,
          role: result.employee.admin ? 'admin' : 'employee',
          isAdmin: result.employee.admin
        }
      });
    } else {
      // Default to member login
      console.log(`[AUTH] Attempting member login for email: ${email}`);
      
        result = await authService.authenticateMember(email, password);
        console.log(`[AUTH] Member login successful for ID: ${result.member.id}`);
        return res.json({
          token: result.token,
          user: {
            id: result.member.id,
            email: result.member.person?.email,
            firstname: result.member.person?.firstname,
            surname: result.member.person?.surname,
            role: 'member'
          }
        });
      }
    } catch (error) {
    console.error('Login error:', error);
    return res.status(401).json({ message: 'Invalid credentials' });
  }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new member
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstname:
 *                 type: string
 *               surname:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member successfully registered
 *       400:
 *         description: Invalid input data
 *       429:
 *         description: Too many registration attempts
 */
router.post('/register', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { firstname, surname, email, password, phone } = req.body;
    
    if (!firstname || !surname || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if member with this email already exists
    const existingMember = await authService.authenticateMember(email, 'dummy-password').catch(() => null);
    if (existingMember) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const member = await authService.registerMember({
      password,
      person: {
          firstname,
          surname,
          email,
          phone,
          birthDate: undefined,
          validate: function (Person: { id: number; firstname: string; surname: string; email: string; phone: string; birthDate: Date; }): void {
              throw new Error('Function not implemented.');
          },
          equals: function ({ id, firstname, surname, email, phone, birthDate }: Person): boolean {
              throw new Error('Function not implemented.');
          },
          getAge: function (): number {
              throw new Error('Function not implemented.');
          }
      }
    });

    return res.status(201).json({
      message: 'Registration successful',
      member: {
        id: member.id,
        email: member.person?.email,
        firstname: member.person?.firstname,
        surname: member.person?.surname
      }
    });
    
  } catch (error: any) {
    console.error('Registration error:', error);
    return res.status(400).json({ message: error.message || 'Registration failed' });
  }
});

/**
 * @swagger
 * /auth/verify:
 *   get:
 *     summary: Verify JWT token
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 */
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const payload = authService.verifyToken(token);
    
    return res.json({ valid: true, user: payload });
    
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
});

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request a password reset
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               userType:
 *                 type: string
 *                 enum: [member, employee]
 *     responses:
 *       200:
 *         description: Password reset email sent (even if email doesn't exist for security)
 *       429:
 *         description: Too many requests
 */
router.post('/forgot-password', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { email, userType = 'member' } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    // Try to generate reset token
    try {
      const resetToken = await authService.generateResetToken(email, userType);
      
      // In a real application, you would send an email with the reset link
      // For this demo, we'll just return the token in the response
      // In production, NEVER return the token directly to the client
      
      // Log the reset token for development purposes only
      console.log(`Reset token for ${email}: ${resetToken}`);
      
      // URL that would be included in the email
      const resetUrl = `${process.env.FRONTEND_URL}/pages/reset-password?token=${resetToken}`;
      console.log(`Reset URL: ${resetUrl}`);
      
      // We would call an email service here
      // sendEmail(email, 'Password Reset', `Click the link to reset your password: ${resetUrl}`);
    } catch (error) {
      // We don't want to reveal whether an email exists in our system
      console.error('Error generating reset token:', error);
    }
    
    // Always return success to prevent email enumeration attacks
    return res.json({ 
      message: 'If a user with that email exists, a password reset link has been sent.' 
    });
    
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password using token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               token:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password successfully reset
 *       400:
 *         description: Invalid token or password
 *       429:
 *         description: Too many requests
 */
router.post('/reset-password', authRateLimiter, async (req: Request, res: Response) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }
    
    // Password validation
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    // Try to reset the password
    try {
      await authService.resetPassword(token, password);
      return res.json({ message: 'Password has been reset successfully' });
    } catch (error: any) {
      return res.status(400).json({ message: error.message || 'Failed to reset password' });
    }
    
  } catch (error) {
    console.error('Password reset error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;