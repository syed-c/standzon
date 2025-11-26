import { NextRequest, NextResponse } from 'next/server';
import { activityLogAPI } from '@/lib/database/activityLogAPI';

export async function POST(request: NextRequest) {
  try {
    console.log('🔓 Admin logout requested');

    const { sessionId } = await request.json();

    // End the session if sessionId is provided
    if (sessionId) {
      const result = await activityLogAPI.endSession(sessionId);
      if (result.success) {
        console.log(`✅ Session ${sessionId} ended successfully. Duration: ${result.duration}s`);
      } else {
        console.error('❌ Failed to end session:', result.error);
      }
    }

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear the admin auth cookie
    response.cookies.set('admin_auth', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0, // Expire immediately
      path: '/'
    });

    console.log('✅ Admin logged out successfully');

    return response;

  } catch (error) {
    console.error('❌ Logout error:', error);
    return NextResponse.json({
      success: false,
      error: 'Internal server error during logout'
    }, { status: 500 });
  }
}