import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // Gallery upload via Supabase storage
  try {
    const { getServerSupabase } = await import('@/lib/supabase');
    const supabase = getServerSupabase();
    if (!supabase) {
      return NextResponse.json({ success: false, error: 'Supabase not configured' }, { status: 500 });
    }

    let formData;
    try {
      formData = await request.formData();
    } catch (formError) {
      return NextResponse.json({ success: false, error: 'Invalid form data' }, { status: 400 });
    }

    const file = formData.get('file') as File | null;
    const scope = (formData.get('scope') as string) || 'general';

    if (!file) {
      return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
    }

    const allowed = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ success: false, error: `Unsupported image type: ${file.type}` }, { status: 400 });
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ success: false, error: `File too large` }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = file.name.split('.').pop() || 'jpg';
    const path = `${scope}/${new Date().toISOString().slice(0,10)}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const bucket = process.env.SUPABASE_GALLERY_BUCKET || 'gallery';

    const { data: uploadData, error: uploadError } = await supabase.storage.from(bucket).upload(path, buffer, {
      contentType: file.type,
      upsert: false,
    });

    if (uploadError) {
      return NextResponse.json({ success: false, error: `Upload failed: ${uploadError.message}` }, { status: 500 });
    }

    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(path);
    const publicUrl = pub?.publicUrl || '';

    if (!publicUrl) {
      return NextResponse.json({ success: false, error: 'Failed to get public URL' }, { status: 500 });
    }

    const host = request.headers.get('host') || 'localhost:3000';
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const proxiedUrl = `${protocol}://${host}/api/media/${bucket}/${path}`;

    return NextResponse.json({ success: true, url: proxiedUrl, directUrl: publicUrl, path });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e?.message || 'Upload failed' }, { status: 500 });
  }
}