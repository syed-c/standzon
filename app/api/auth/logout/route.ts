import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    console.log('🔓 User logout requested');

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear the auth cookie
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    console.log('✅ User logged out successfully');

    return response;

  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during logout'
    }, { status: 500 });
  }
}