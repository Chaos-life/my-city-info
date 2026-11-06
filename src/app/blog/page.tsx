import Link from "next/link";
import { getAllPosts } from "@/lib/posts";

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 text-slate-900">
      {/* 상단 헤더 */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 py-10 sm:px-8 sm:py-12">
          {/* 상단 네비게이션 */}
          <nav className="flex items-center justify-between mb-8 pb-4 border-b border-white/15">
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

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            📝 우리 동네 블로그
          </h1>
          <p className="mt-2 text-blue-100 text-base sm:text-lg">
            성남시의 유익한 행사와 생활 혜택 이야기를 쉽고 자세하게 전해드립니다.
          </p>
        </div>
      </header>

      {/* 블로그 글 목록 */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-12 sm:px-8">
        {posts.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100">
            <p className="text-slate-500 text-lg font-medium">
              아직 작성된 블로그 글이 없습니다.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)] hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                    <span className="bg-blue-50 text-blue-700 ring-1 ring-blue-600/20 text-xs font-bold px-3 py-1 rounded-full">
                      {post.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">
                      📅 {post.date}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-3 leading-snug">
                    {post.title}
                  </h2>

                  <p className="text-sm text-slate-600 leading-relaxed mb-6 line-clamp-3">
                    {post.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex flex-wrap gap-1.5">
                    {post.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <span className="text-sm font-bold text-emerald-600 group-hover:translate-x-1 transition-transform shrink-0 ml-2">
                    읽어보기 →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

