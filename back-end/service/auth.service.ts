import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import memberDb from '../repository/member.db';
import employeeDb from '../repository/employee.db';
import { Member } from '../model/member';
import { Employee } from '../model/employee';
import dotenv from 'dotenv';
import crypto from 'crypto';

// Load environment variables
dotenv.config();

// Secret key for JWT signing from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';
const JWT_ADMIN_EXPIRES_IN = process.env.JWT_ADMIN_EXPIRES_IN || '12h';
const SALT_ROUNDS = 10;

// Store reset tokens with expiry (in a production app, store these in a database)
const resetTokens = new Map<string, { email: string, userType: string, expiresAt: number }>();

/**
 * Authenticate a member
 */
const authenticateMember = async (email: string, password: string): Promise<{token: string, member: Member}> => {
  console.log(`[DEBUG] Attempting to authenticate member with email: ${email}`);
  
  // Find member by email
  const member = await memberDb.getMemberByEmail(email);
  if (!member) {
    console.log(`[DEBUG] Authentication failed: No member found with email: ${email}`);
    throw new Error('Invalid credentials');
  }
  
  console.log(`[DEBUG] Member found, verifying password for member ID: ${member.id}`);
  
  // Verify password
  if (!member.password) {
    console.log(`[DEBUG] Authentication failed: Member has no password stored`);
    throw new Error('Invalid credentials');
  }
  
  // Use the same bcrypt compare method as in employee authentication
  const passwordMatch = await bcrypt.compare(password, member.password);
  if (!passwordMatch) {
    console.log(`[DEBUG] Authentication failed: Password mismatch for member ID: ${member.id}`);
    throw new Error('Invalid credentials');
  }
  
  console.log(`[DEBUG] Authentication successful for member ID: ${member.id}`);

  // Generate token with clear role identifier
  const token = jwt.sign(
    { 
      id: member.id,
      email: member.person?.email,
      role: 'member',
      userType: 'member'
    }, 
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );

  // Remove password before returning
  const { password: _, ...memberWithoutPassword } = member;
  
  return {
    token,
    member: memberWithoutPassword as Member
  };
};

/**
 * Authenticate an employee
 */
const authenticateEmployee = async (email: string, password: string): Promise<{token: string, employee: Employee}> => {
  console.log(`[DEBUG] Attempting to authenticate employee with email: ${email}`);
  
  // Find employee by email
  const employee = await employeeDb.getEmployeeByEmail(email);
  if (!employee) {
    console.log(`[DEBUG] Authentication failed: No employee found with email: ${email}`);
    throw new Error('Invalid credentials');
  }
  
  console.log(`[DEBUG] Employee found, verifying password for employee ID: ${employee.id}, admin: ${employee.admin}`);
  
  // Verify password
  if (!employee.password) {
    console.log(`[DEBUG] Authentication failed: Employee has no password stored`);
    throw new Error('Invalid credentials');
  }
  
  const passwordMatch = await bcrypt.compare(password, employee.password);
  if (!passwordMatch) {
    console.log(`[DEBUG] Authentication failed: Password mismatch for employee ID: ${employee.id}`);
    throw new Error('Invalid credentials');
  }
  
  console.log(`[DEBUG] Authentication successful for employee ID: ${employee.id}`);

  // Generate token
  const token = jwt.sign(
    {
      id: employee.id,
      email: employee.person?.email,
      role: employee.admin ? 'admin' : 'employee',
      isAdmin: employee.admin,
      userType: 'employee'
    },
    JWT_SECRET,
    { expiresIn: employee.admin ? JWT_ADMIN_EXPIRES_IN : JWT_EXPIRES_IN }
  );

  // Remove password before returning
  const { password: _, ...employeeWithoutPassword } = employee;
  
  return {
    token,
    employee: employeeWithoutPassword as Employee
  };
};

/**
 * Register a new member
 */
const registerMember = async (memberData: Partial<Member>): Promise<Member> => {
  if (!memberData.password) {
    throw new Error('Password is required');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(memberData.password, SALT_ROUNDS);
  
  // Create member with hashed password
  const member = await memberDb.createMember({
    ...memberData,
    password: hashedPassword,
    username: memberData.person?.email || `user_${Date.now()}` // Add username field
  } as Partial<Member> & { username: string });
  
  // Remove password before returning
  const { password: _, ...memberWithoutPassword } = member;
  return memberWithoutPassword as Member;
};

/**
 * Verify a JWT token
 */
const verifyToken = (token: string): any => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    throw new Error('Invalid or expired token');
  }
};

/**
 * Generate a password reset token
 */
const generateResetToken = async (email: string, userType: 'member' | 'employee'): Promise<string> => {
  // Check if user exists
  let userExists = false;
  
  if (userType === 'member') {
    const member = await memberDb.getMemberByEmail(email);
    userExists = !!member;
  } else {
    const employee = await employeeDb.getEmployeeByEmail(email);
    userExists = !!employee;
  }
  
  if (!userExists) {
    throw new Error('No user found with that email address');
  }
  
  // Generate a secure random token
  const resetToken = crypto.randomBytes(32).toString('hex');
  
  // Store token with expiry (24 hours)
  resetTokens.set(resetToken, {
    email,
    userType,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  });
  
  return resetToken;
};

/**
 * Verify the password reset token
 */
const verifyResetToken = (token: string): { email: string, userType: string } => {
  const resetData = resetTokens.get(token);
  
  if (!resetData) {
    throw new Error('Invalid or expired reset token');
  }
  
  if (Date.now() > resetData.expiresAt) {
    // Clean up expired token
    resetTokens.delete(token);
    throw new Error('Reset token has expired');
  }
  
  return {
    email: resetData.email,
    userType: resetData.userType
  };
};

/**
 * Reset password using token
 */
const resetPassword = async (token: string, newPassword: string): Promise<boolean> => {
  const { email, userType } = verifyResetToken(token);
  
  // Hash the new password
  const hashedPassword = await bcrypt.hash(newPassword, SALT_ROUNDS);
  
  // Update password in the database
  if (userType === 'member') {
    const member = await memberDb.getMemberByEmail(email);
    if (!member) throw new Error('User not found');
    
    // Update member password
    if (!member.id) {
        throw new Error('Member ID is undefined');
    }
    await memberDb.updateMember(member.id, { password: hashedPassword });
  } else {
    const employee = await employeeDb.getEmployeeByEmail(email);
    if (!employee) throw new Error('User not found');
    
    // Update employee password
    if (!employee.id) {
        throw new Error('Employee ID is undefined');
    }
    await employeeDb.updateEmployee(employee.id, { password: hashedPassword });
  }
  
  // Remove the used token
  resetTokens.delete(token);
  
  return true;
};

export default {
  authenticateMember,
  authenticateEmployee,
  registerMember,
  verifyToken,
  generateResetToken,
  verifyResetToken,
  resetPassword
};