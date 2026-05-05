import { PostCard } from "./post-card";

interface PostsGridProps {
  posts: any[];
  title?: string;
}

export function PostsGrid({ posts, title = "Mais Artigos" }: PostsGridProps) {
  if (!posts.length) return null;

  return (
    <div className="mb-16">
      <h3 className="text-2xl font-black uppercase italic mb-8 border-b border-white/10 pb-4">
        {title}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}