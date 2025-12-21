import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ message: 'Logout success' });

  // Delete session
  res.cookies.delete('token');

  return res;
}
