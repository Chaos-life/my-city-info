import Link from "next/link";
import { notFound } from "next/navigation";
import cityData from "../../../../public/data/city-info.json";

// 정적 배포(Cloudflare Pages)를 위해 모든 항목의 상세 페이지 주소를 미리 만들어 둡니다.
export function generateStaticParams() {
  return cityData.items.map((item) => ({
    id: item.id,
  }));
}

export default async function InfoDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  // 주소창의 id와 일치하는 행사/혜택 정보를 찾습니다.
  const item = cityData.items.find((entry) => entry.id === id);

  if (!item) {
    notFound();
  }

  const isEvent = item.category === "행사";

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 text-slate-900">
      {/* 상단 헤더 */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-4xl mx-auto px-5 py-10 sm:px-8 sm:py-12">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white text-sm font-medium mb-6 bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full backdrop-blur-sm transition-colors"
          >
            ← 목록으로 돌아가기
          </Link>

          <div className="flex items-center gap-3 mb-3">
            <span
              className={`text-xs font-bold px-3.5 py-1.5 rounded-full ${
                isEvent
                  ? "bg-sky-400/25 text-sky-100 border border-sky-300/30"
                  : "bg-indigo-400/25 text-indigo-100 border border-indigo-300/30"
              }`}
            >
              {isEvent ? "🎈 행사 · 축제" : "🎁 지원금 · 혜택"}
            </span>
          </div>

          {/* 1. 행사/혜택 이름 (크게) */}
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
            {item.name}
          </h1>
          <p className="mt-3 text-blue-100 text-base sm:text-lg leading-relaxed">
            {item.summary}
          </p>
        </div>
      </header>

      {/* 상세 정보 본문 */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-5 py-10 sm:px-8">
        <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 space-y-8 relative overflow-hidden">
          {/* 상단 포인트 컬러 바 */}
          <div
            className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${
              isEvent ? "from-sky-400 to-blue-600" : "from-blue-600 to-indigo-600"
            }`}
          />

          {/* 2. 기간, 장소, 대상 핵심 요약 박스 */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 rounded-2xl p-5 border border-slate-100">
            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                <span>📅</span> 기간
              </div>
              <div className="text-sm sm:text-base font-bold text-blue-700">
                {item.startDate} ~ {item.endDate}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                <span>📍</span> {isEvent ? "장소" : "신청처"}
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-800">
                {item.location}
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-2xs">
              <div className="text-xs font-bold text-slate-400 mb-1 flex items-center gap-1.5">
                <span>🎯</span> 대상
              </div>
              <div className="text-sm sm:text-base font-bold text-slate-800">
                {item.target}
              </div>
            </div>
          </section>

          {/* 3. 상세 설명 전문 */}
          <section className="space-y-4">
            <h2 className="text-xl font-extrabold text-slate-900 border-b border-slate-100 pb-3">
              상세 내용 안내
            </h2>
            <div className="text-slate-700 leading-relaxed whitespace-pre-line text-base bg-slate-50/50 p-6 rounded-2xl border border-slate-100">
              {item.description}
            </div>
          </section>

          {/* 4. 하단 버튼 영역 (원본 사이트 링크 + 목록으로 돌아가기) */}
          <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white text-base font-bold py-4 px-6 rounded-xl shadow-md shadow-emerald-600/20 transition-colors"
            >
              자세히 보기 (원본 사이트) →
            </a>
            <Link
              href="/"
              className="sm:w-48 text-center bg-slate-100 hover:bg-slate-200 text-slate-700 text-base font-semibold py-4 px-6 rounded-xl transition-colors"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </main>

      {/* 하단 푸터 */}
      <footer className="bg-white border-t border-slate-200/80 mt-16">
        <div className="max-w-4xl mx-auto px-5 py-8 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>
            <p className="font-bold text-slate-800 text-base">🏙️ 성남시 생활 정보</p>
            <p className="text-xs mt-1 text-slate-400">
              본 사이트의 정보는 공공데이터포털(data.go.kr) 자료를 기반으로 제공됩니다.
            </p>
          </div>
          <div className="text-xs bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80">
            마지막 업데이트: <span className="font-bold text-blue-600">{cityData.lastUpdated}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

