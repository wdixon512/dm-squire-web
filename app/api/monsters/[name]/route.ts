import { getServerFirestoreDb } from '@lib/services/firebase-admin-service';
import { sanitizeMonsterName } from '@lib/util/mobUtils';

export const dynamic = 'force-static';

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = (await params).name;
  const db = getServerFirestoreDb();

  if (!name || typeof name !== 'string') {
    return new Response('Monster name is required.', { status: 400 });
  }

  const safeDocId = sanitizeMonsterName(name);

  try {
    // Query Firestore for the monster by sanitized name
    const docRef = db.collection('monsters').doc(safeDocId);
    const snapshot = await docRef.get();

    if (!snapshot.exists) {
      return new Response(`Monster ${name} not found.`, { status: 404 });
    }

    const monster = snapshot.data();
    return Response.json(monster);
  } catch (error) {
    console.error('Error fetching monster:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}
