import Link from "next/link";
import cityData from "../../public/data/city-info.json";

export default function Home() {
  // 카테고리별로 행사와 혜택을 쉽게 분류합니다.
  const events = cityData.items.filter((item) => item.category === "행사");
  const benefits = cityData.items.filter((item) => item.category === "혜택");

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/80 text-slate-900">
      {/* 1. 상단 히어로 헤더 (입체적인 그라데이션 적용) */}
      <header className="relative overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-indigo-700 text-white shadow-lg">
        {/* 배경 장식용 은은한 빛 효과 */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-sky-400/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-5 py-12 sm:px-8 sm:py-16">
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md border border-white/20 text-blue-50 text-xs font-semibold px-3.5 py-1.5 rounded-full mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-sky-300 animate-pulse" />
            우리 동네 알짜 소식통
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
            성남시 생활 정보
          </h1>
          <p className="mt-3 text-blue-100 text-base sm:text-lg max-w-xl font-normal leading-relaxed">
            놓치기 아까운 우리 동네 축제부터 든든한 지원금 혜택까지,
            <br className="hidden sm:inline" /> 가장 빠르고 깔끔하게 확인하세요.
          </p>

          {/* 요약 통계 배지 */}
          <div className="mt-8 flex flex-wrap gap-3">
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5 flex items-center gap-2.5">
              <span className="text-lg">🎈</span>
              <span className="text-xs text-blue-100">이번 달 행사</span>
              <span className="text-sm font-bold text-white">{events.length}건</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-2xl px-4 py-2.5 flex items-center gap-2.5">
              <span className="text-lg">🎁</span>
              <span className="text-xs text-blue-100">지원금·혜택</span>
              <span className="text-sm font-bold text-white">{benefits.length}건</span>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-5 py-12 sm:px-8 space-y-16">
        {/* 2. 이번 달 행사/축제 카드 목록 */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                Events & Festivals
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <span>🎈 이번 달 행사 · 축제</span>
              </h2>
            </div>
            <span className="bg-blue-50 text-blue-700 border border-blue-200 text-xs font-bold px-3 py-1.5 rounded-full">
              총 {events.length}개
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {events.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(37,99,235,0.12)] hover:-translate-y-1.5 hover:border-blue-200 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* 카드 상단 포인트 컬러 바 */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-sky-400 to-blue-600" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                    <span className="bg-sky-50 text-sky-700 ring-1 ring-sky-600/20 text-xs font-bold px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-sm sm:text-base font-bold text-blue-700 bg-blue-50 border border-blue-100 px-3.5 py-1.5 rounded-xl">
                      📅 {item.startDate} ~ {item.endDate}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors mb-2.5 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.summary}
                  </p>
                </div>

                <div>
                  <div className="bg-slate-50/90 rounded-2xl p-4 space-y-2 text-xs text-slate-600 mb-4 border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">📍</span>
                      <span className="font-semibold text-slate-500 w-10 shrink-0">장소</span>
                      <span className="font-medium text-slate-800 truncate">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400">👥</span>
                      <span className="font-semibold text-slate-500 w-10 shrink-0">대상</span>
                      <span className="font-medium text-slate-800 truncate">{item.target}</span>
                    </div>
                  </div>

                  <Link
                    href={`/info/${item.id}`}
                    className="block w-full text-center bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold py-3.5 rounded-xl shadow-md shadow-emerald-600/20 transition-colors duration-200"
                  >
                    상세 정보 보기 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. 지원금/혜택 정보 카드 목록 */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-slate-200 pb-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Benefits & Subsidies
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 flex items-center gap-2">
                <span>🎁 놓치면 아까운 지원금 · 혜택</span>
              </h2>
            </div>
            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold px-3 py-1.5 rounded-full">
              총 {benefits.length}개
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {benefits.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-3xl p-7 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 hover:shadow-[0_20px_40px_rgba(79,70,229,0.12)] hover:-translate-y-1.5 hover:border-indigo-200 transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                {/* 카드 상단 포인트 컬러 바 */}
                <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 to-indigo-600" />

                <div>
                  <div className="flex items-center justify-between gap-2 mb-4 pt-1">
                    <span className="bg-indigo-50 text-indigo-700 ring-1 ring-indigo-600/20 text-xs font-bold px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-lg">
                      {item.startDate} ~ {item.endDate}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2.5 leading-snug">
                    {item.name}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    {item.summary}
                  </p>
                </div>

                <div>
                  <div className="bg-indigo-50/40 rounded-2xl p-4 space-y-2.5 text-xs text-slate-600 mb-5 border border-indigo-100/60">
                    <div className="flex items-center gap-2">
                      <span>🏛️</span>
                      <span className="font-semibold text-slate-500 w-12 shrink-0">신청처</span>
                      <span className="font-medium text-slate-800">{item.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>🎯</span>
                      <span className="font-semibold text-slate-500 w-12 shrink-0">지원대상</span>
                      <span className="font-bold text-indigo-900">{item.target}</span>
                    </div>
                  </div>

                  <Link
                    href={`/info/${item.id}`}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm font-semibold py-3.5 rounded-xl shadow-md shadow-blue-500/20 transition-all duration-200"
                  >
                    신청 방법 확인하기 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 4. 하단 푸터 */}
      <footer className="bg-white border-t border-slate-200/80 mt-20">
        <div className="max-w-5xl mx-auto px-5 py-10 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div>
            <p className="font-bold text-slate-800 text-base">🏙️ 성남시 생활 정보</p>
            <p className="text-xs mt-1 text-slate-400">
              본 사이트의 정보는 공공데이터포털(data.go.kr) 자료를 기반으로 제공됩니다.
            </p>
          </div>
          <div className="text-xs bg-slate-50 px-4 py-2 rounded-full border border-slate-200/80 shadow-2xs">
            마지막 업데이트: <span className="font-bold text-blue-600">{cityData.lastUpdated}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
