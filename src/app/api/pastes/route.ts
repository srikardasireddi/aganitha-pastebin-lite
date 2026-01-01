import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { nanoid } from 'nanoid';

export async function POST(req: NextRequest) {
  try {
    const { content, ttl_seconds, max_views } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    // Generate a unique 10-character ID
    const id = nanoid(10);
    
    // Calculate expiry date if ttl is provided
    const expiresAt = ttl_seconds 
      ? new Date(Date.now() + ttl_seconds * 1000) 
      : null;

    // Save to Neon via Prisma
    const paste = await prisma.paste.create({
      data: {
        id,
        content,
        max_views: max_views || null,
        expires_at: expiresAt,
      }
    });

    const host = req.headers.get('host');
    return NextResponse.json({
      id: paste.id,
      url: `http://${host}/p/${paste.id}`
    }, { status: 201 });

  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}