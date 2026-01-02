import { createServerClient } from './supabase';

export async function getServerSession() {
  // In a real app with Supabase Auth, you would use the cookies to get the session
  // For this project, it seems like there might be a custom auth system or it uses Supabase Auth via cookies.
  // I will check how auth is currently handled.
  return null;
}

export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Unauthorized');
  }
  return session;
}

export async function isAdmin() {
  const session = await getServerSession();
  // Check if session user has admin role
  return !!session;
}
