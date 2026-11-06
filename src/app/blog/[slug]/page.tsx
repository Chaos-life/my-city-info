import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getAllPosts, getPostBySlug } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getAllPosts();
  if (posts.length === 0) {
    return [{ slug: "_empty" }];
  }
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 text-slate-900">
      {/* 상단 헤더 */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 py-10 sm:px-8 sm:py-12">
          <nav className="flex items-center justify-between mb-6 pb-4 border-b border-white/15">
            <Link href="/" className="text-lg font-extrabold tracking-tight flex items-center gap-2">
              🏙️ 성남시 생활 정보
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="px-4 py-2 rounded-full text-sm font-semibold text-blue-100 hover:bg-white/10 transition-colors"
              >
                홈
              </Link>
              <Link
                href="/blog"
                className="px-4 py-2 rounded-full text-sm font-bold bg-white text-blue-700 shadow-sm"
              >
                블로그
              </Link>
            </div>
          </nav>

          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm font-medium mb-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
          >
            ← 블로그 목록으로 돌아가기
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <span className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-white/20 text-white">
              {post.category}
            </span>
            <span className="text-sm text-blue-100">📅 {post.date}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {post.title}
          </h1>
          {post.summary && (
            <p className="mt-3 text-blue-100 text-base sm:text-lg leading-relaxed">
              {post.summary}
            </p>
          )}
        </div>
      </header>

      {/* 본문 영역 */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 py-10 sm:px-8">
        <article className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

          <div className="prose prose-slate max-w-none prose-headings:font-extrabold prose-a:text-blue-600">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>

          {post.tags.length > 0 && (
            <div className="mt-10 pt-6 border-t border-slate-100 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100">
            <Link
              href="/blog"
              className="inline-block bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-colors"
            >
              ← 블로그 목록으로
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}

