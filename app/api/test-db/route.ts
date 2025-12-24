import { dbConnect } from '@/lib/db';

export async function GET() {
  try {
    const db = await dbConnect();
    const [rows] = await db.query('SELECT NOW() as time') as any[];
    db.end();

    return Response.json({ time: rows[0]?.time || 'N/A' });
  } catch (error: any) {
    return Response.json({ error: error?.message || 'Database connection failed' }, { status: 500 });
  }
}
