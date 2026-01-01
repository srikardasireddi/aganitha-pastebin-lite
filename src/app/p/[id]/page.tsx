// src/app/p/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function ViewPaste({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  try {
    const paste = await prisma.paste.update({
      where: { id },
      data: { view_count: { increment: 1 } }
    });

    return (
      <div className="p-8 max-w-4xl mx-auto">
        <pre className="p-6 bg-white border rounded shadow-sm">{paste.content}</pre>
        <div className="mt-4 text-blue-600 font-bold text-xl">
          Views: {paste.view_count}
        </div>
      </div>
    );
  } catch (e) {
    notFound();
  }
}