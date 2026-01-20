import { supabase } from './supabase';
import { projectId } from '../utils/supabase/info';
import { User, Message, InviteCode, Topic } from '../types';

const SERVER_URL = `https://${projectId}.supabase.co/functions/v1/make-server-8e65bfeb`;

async function getHeaders() {
  const { data: { session } } = await supabase.auth.getSession();
  return {
    'Content-Type': 'application/json',
    'Authorization': session ? `Bearer ${session.access_token}` : '',
  };
}

export const api = {
  async validateInviteCode(code: string): Promise<{ valid: boolean; message?: string; inviteCode?: InviteCode }> {
    const response = await fetch(`${SERVER_URL}/invite-codes/${code}`);
    return response.json();
  },

  async signup(data: { email: string; password: string; name: string; language: string; inviteCode: string }) {
    const response = await fetch(`${SERVER_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const err = await response.json();
      throw new Error(err.error || 'Signup failed');
    }
    return response.json();
  },

  async getUserProfile(userId: string): Promise<User> {
    const headers = await getHeaders();
    const response = await fetch(`${SERVER_URL}/users/${userId}`, { headers });
    if (!response.ok) throw new Error('Failed to fetch profile');
    return response.json();
  },

  async updateUserProfile(userId: string, updates: Partial<User>): Promise<User> {
    const headers = await getHeaders();
    const response = await fetch(`${SERVER_URL}/users/${userId}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update profile');
    return response.json();
  },

  async getTopics(): Promise<Topic[]> {
    const headers = await getHeaders();
    const response = await fetch(`${SERVER_URL}/topics`, { headers });
    if (!response.ok) throw new Error('Failed to fetch topics');
    return response.json();
  },

  async getMessages(): Promise<Message[]> {
    const headers = await getHeaders();
    const response = await fetch(`${SERVER_URL}/messages`, { headers });
    if (!response.ok) throw new Error('Failed to fetch messages');
    return response.json();
  },

  async sendMessage(content: string, userId: string, userName: string): Promise<Message> {
    const headers = await getHeaders();
    const response = await fetch(`${SERVER_URL}/messages`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ content, userId, userName }),
    });
    if (!response.ok) throw new Error('Failed to send message');
    return response.json();
  },
  
  async updateMessage(id: string, updates: Partial<Message>): Promise<Message> {
    const headers = await getHeaders();
    const response = await fetch(`${SERVER_URL}/messages/${id}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update message');
    return response.json();
  }
};
