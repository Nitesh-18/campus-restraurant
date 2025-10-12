import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase.server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
  const { email, full_name, phone_number, address } = body || {};

    if (!email) {
      return NextResponse.json({ error: 'email is required' }, { status: 400 });
    }

    // Lookup the user by email using the service role client (list users and match email)
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) {
      console.error('listUsers error:', listError);
      return NextResponse.json({ error: listError.message }, { status: 500 });
    }

    const user = usersData?.users?.find((u: any) => u.email === email) as any;
    if (!user || !user.id) {
      console.warn('User not found for email:', email);
      return NextResponse.json({ error: 'user not found' }, { status: 404 });
    }

    // Upsert profile row using service role (bypasses RLS)
    const { error: upsertError } = await supabaseAdmin
      .from('profiles')
      .upsert({ id: user.id, full_name: full_name ?? null, phone_number: phone_number ?? null, address: address ?? null });

    if (upsertError) {
      console.error('profiles upsert error:', upsertError);
      return NextResponse.json({ error: upsertError.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('create-profile handler error:', err);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
