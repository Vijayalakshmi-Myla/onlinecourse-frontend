import { supabase } from './supabaseClient';

export async function getUserSession() {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession();

  if (error || !session) return null;

  const userId = session.user.id;
  const { data: userData } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', userId)
    .single();

    if (error) {
    console.error('User fetch error:', error);
    return null;
  }

  if (!userData) {
    console.warn('No matching user found in custom users table');
    return null;
  }



  return userData ? { ...userData, session } : null;
}
