import monstersJson from '../../../public/data/monsters.json';

export const dynamic = 'force-static';

export async function GET(request: Request) {
  return Response.json(monstersJson);
}
