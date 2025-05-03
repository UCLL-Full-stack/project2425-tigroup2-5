import apiClient from './apiClient';
import { Member } from '../types';

/**
 * Get all members - requires admin or employee access
 */
const getAllMembers = async (): Promise<Member[]> => {
  return apiClient.get<Member[]>('member');
};

/**
 * Get member by ID - requires either admin access or to be the member
 */
const getMemberById = async (id: number): Promise<Member> => {
  return apiClient.get<Member>(`member/${id}`);
};

/**
 * Create a new member - publicly accessible for registration
 */
const createMember = async (memberData: Partial<Member>): Promise<Member> => {
  return apiClient.post<Member>('member', memberData, { requireAuth: false });
};

/**
 * Update member - requires either admin access or to be the member
 */
const updateMember = async (id: number, memberData: Partial<Member>): Promise<Member> => {
  return apiClient.put<Member>(`member/${id}`, memberData);
};

/**
 * Delete member - requires admin access
 */
const deleteMember = async (id: number): Promise<void> => {
  return apiClient.delete<void>(`member/${id}`);
};

const memberService = {
  getAllMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember
};

export default memberService;