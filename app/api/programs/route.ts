import { getPrograms } from "@/lib/wp";

export async function GET() {
  try {
    const programs = await getPrograms();
    return Response.json(programs);
  } catch (error) {
    console.error('Programs API error:', error);
    return Response.json(
      { error: 'Failed to fetch programs' },
      { status: 500 }
    );
  }
}