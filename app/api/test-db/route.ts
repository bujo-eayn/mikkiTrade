import { dbConnect } from '@/lib/db';

export async function GET() {
  try {
    const db = await dbConnect();
    const [rows] = await db.query('SELECT NOW() as time');
    db.end();

    return Response.json({ time: rows[0].time });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
