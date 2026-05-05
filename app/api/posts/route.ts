import { getPostsByCategoryPaginated } from "@/components/lib/wp";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const perPage = 12;

  if (!slug) {
    return NextResponse.json({ error: "Missing slug" }, { status: 400 });
  }

  try {
    const { posts, totalPages, totalPosts } = await getPostsByCategoryPaginated(
      slug,
      page,
      perPage
    );

    return NextResponse.json({
      posts,
      totalPages,
      totalPosts,
      currentPage: page,
      hasMore: page < totalPages,
    });
  } catch (error) {
    console.error("Error fetching posts:", error);
    return NextResponse.json(
      { error: "Failed to fetch posts" },
      { status: 500 }
    );
  }
}