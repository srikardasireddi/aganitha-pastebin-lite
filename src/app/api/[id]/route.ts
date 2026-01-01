import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const testNowHeader = req.headers.get('x-test-now-ms');
    
    // Determine "now" (useful for Aganitha's automated testing)
    const now = (process.env.TEST_MODE === '1' && testNowHeader) 
      ? new Date(parseInt(testNowHeader)) 
      : new Date();

    const paste = await prisma.paste.findUnique({ where: { id } });

    if (!paste) {
      return NextResponse.json({ error: "Paste not found" }, { status: 404 });
    }

    // Check if the paste has expired
    if (paste.expires_at && paste.expires_at < now) {
      return NextResponse.json({ error: "Paste has expired" }, { status: 404 });
    }

    // Check if view limit is reached
    if (paste.max_views && paste.view_count >= paste.max_views) {
      return NextResponse.json({ error: "View limit reached" }, { status: 404 });
    }

    // Increment the view count in the database
    // Inside src/app/api/pastes/[id]/route.ts

const updated = await prisma.paste.update({
  where: { id },
  data: { view_count: { increment: 1 } } // This is the "Add 1" logic
});

    return NextResponse.json({
      content: updated.content,
      remaining_views: updated.max_views ? (updated.max_views - updated.view_count) : null,
      expires_at: updated.expires_at
    });

  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}