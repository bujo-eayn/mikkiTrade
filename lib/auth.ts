import { supabase } from './supabase';

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  fullName: string;
}

/**
 * Sign in with email and password
 */
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw error;
  }

  return data;
}

/**
 * Sign out the current user
 */
export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) {
    throw error;
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    throw error;
  }

  return session;
}

/**
 * Get the current user
 */
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();

  if (error) {
    throw error;
  }

  return user;
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Get user profile from database
 */
export async function getUserProfile(authId: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('auth_id', authId)
    .limit(1);  // Get first match instead of single() to avoid duplicate errors

  if (error) {
    throw error;
  }

  if (!data || data.length === 0) {
    throw new Error('No user profile found. Please contact your administrator.');
  }

  // Return the first (and should be only) result
  return data[0];
}

/**
 * Update user's last login timestamp
 */
export async function updateLastLogin(userId: string) {
  const { error } = await supabase
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', userId);

  if (error) {
    console.error('Failed to update last login:', error);
  }
}
