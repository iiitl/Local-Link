import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

const SERVER_API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function checkAuth() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;
  if (!token) return false;
  try {
    const res = await fetch(`${SERVER_API_BASE}/auth/me`, {
      method: 'GET',
      headers: { Cookie: `token=${token}` },
      cache: 'no-store'
    });
    return res.ok;
  } catch (e) {
    return false;
  }
}

export default async function RootPage() {
  const isLoggedIn = await checkAuth();

  if (isLoggedIn) {
    redirect('/home');
  } else {
    redirect('/landing');
  }
}
