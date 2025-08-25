import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(request: NextRequest) {
  console.log('📁 File upload API called');

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string || 'general';

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }

    console.log('📄 File received:', file.name, 'Size:', file.size, 'Type:', file.type);

    // Validate file type
    const allowedTypes = [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File type not allowed. Please upload images, PDF, or Word documents.' 
        },
        { status: 400 }
      );
    }

    // Validate file size (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'File too large. Maximum size is 10MB.' 
        },
        { status: 400 }
      );
    }

    // Create upload directory structure
    const uploadDir = join(process.cwd(), 'public', 'uploads', type);
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const extension = file.name.split('.').pop();
    const fileName = `${timestamp}-${randomString}.${extension}`;
    const filePath = join(uploadDir, fileName);
    
    // Convert file to buffer and save
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    const fileUrl = `/uploads/${type}/${fileName}`;
    
    console.log('✅ File uploaded successfully:', fileUrl);

    return NextResponse.json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        fileName: fileName,
        originalName: file.name,
        fileUrl: fileUrl,
        fileSize: file.size,
        fileType: file.type,
        uploadedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ File upload error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'File upload failed',
      error: process.env.NODE_ENV === 'development' ? error : 'Upload error'
    }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'File upload API is working',
    supportedTypes: [
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp',
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ],
    maxSize: '10MB'
  });
}