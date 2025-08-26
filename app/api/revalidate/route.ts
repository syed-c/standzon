import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const paths: string[] = Array.isArray(body?.paths)
      ? body.paths
      : typeof body?.path === 'string'
        ? [body.path]
        : [];

    if (!paths.length) {
      return NextResponse.json({ success: false, error: 'Missing path(s)' }, { status: 400 });
    }

    for (const p of paths) {
      try {
        revalidatePath(p);
      } catch {}
    }

    return NextResponse.json({ success: true, revalidated: paths });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Revalidation failed' }, { status: 500 });
  }
}


