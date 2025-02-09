import { getServerFirestoreDb } from '@lib/services/firebase-admin-service';

export const dynamic = 'force-static';

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const mobId = (await params).name;
  const db = getServerFirestoreDb();

  if (!mobId || typeof mobId !== 'string') {
    return new Response('Monster name is required.', { status: 400 });
  }

  try {
    // Query Firestore for the monster by sanitized name
    const docRef = db.collection('monsters').doc(mobId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return new Response(`Monster ${mobId} not found.`, { status: 404 });
    }

    const monster = snapshot.data();
    return Response.json(monster);
  } catch (error) {
    console.error('Error fetching monster:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
