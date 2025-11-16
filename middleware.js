import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function middleware(req) {
  const { data } = await supabase.auth.getUser();
  const user = data?.user;

  const url = req.nextUrl.clone();
  const pathname = url.pathname;

  // Public routes that don’t require login
  const publicRoutes = ['/', '/login', '/register'];

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Redirect to login if not authenticated
  if (!user) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  // Fetch user role from Supabase
  const { data: userData } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single();

  const role = userData?.role;

  // Role-based route protection
  if (pathname.startsWith('/admin') && role !== 'admin') {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (pathname.startsWith('/instructor') && !['instructor', 'admin'].includes(role)) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Apply middleware only to these routes
export const config = {
  matcher: ['/admin/:path*', '/instructor/:path*', '/dashboard/:path*'],
};
