import monstersJson from '../../../../public/data/monsters.json';

export const dynamic = 'force-static';

export async function GET(request: Request, { params }: { params: Promise<{ name: string }> }) {
  const name = (await params).name;

  if (!name || typeof name !== 'string') {
    return new Response('Monster name is required.', { status: 400 });
  }

  const sanitizedName = name.replace(/-/g, ' ').replace(/_/g, ' ');
  const monster = monstersJson.monsters.find((mob) => mob.name.toLowerCase() === sanitizedName.toLowerCase());

  if (!monster) {
    return new Response(`Monster ${name} not found.`, { status: 404 });
  }

  return Response.json(monster);
}
