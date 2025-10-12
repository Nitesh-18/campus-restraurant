import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase.server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
  const { email, password, full_name, phone_number, address } = body || {};

    if (!email || !password) {
      return NextResponse.json({ error: 'email and password are required' }, { status: 400 });
    }

    // Create user using admin API and set email_confirm to true so no confirmation is required
    const { data: createData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      user_metadata: { full_name, phone_number, address },
      email_confirm: true,
    } as any);

    if (createError) {
      console.error('createUser error:', createError);
      return NextResponse.json({ error: createError.message }, { status: 500 });
    }

    const createdUser = (createData as any)?.user ?? (createData as any);

    // Upsert profile row
    if (createdUser?.id) {
      const { error: upsertError } = await supabaseAdmin
        .from('profiles')
        .upsert({ id: createdUser.id, full_name: full_name ?? null, phone_number: phone_number ?? null, address: address ?? null });

      if (upsertError) {
        console.error('profiles upsert error:', upsertError);
      }
    }

    return NextResponse.json({ ok: true, user: createdUser });
  } catch (err) {
    console.error('create-user-simple handler error:', err);
    return NextResponse.json({ error: 'internal error' }, { status: 500 });
  }
}
