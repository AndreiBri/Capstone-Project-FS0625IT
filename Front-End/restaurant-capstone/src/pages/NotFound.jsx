export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-[#1C0127] px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <p className="text-5xl font-semibold text-[#DABFFF]">404</p>
        <h1 className="mt-4 text-5xl font-black tracking-tight text-[#DABFFF] sm:text-7xl">Pagina non trovata</h1>
        <p className="mt-6 text-lg font-medium text-[#DABFFF]/80 sm:text-xl/8">Ci dispiace, non siamo riusciti a trovare la pagina che stai cercando.</p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="/"
            className="rounded-2xl bg-[#A06CD5] px-6 py-3 text-base font-bold text-white shadow-lg shadow-[#A06CD5]/40 transition-all duration-300 hover:bg-[#8a5bc0] hover:shadow-2xl hover:shadow-[#A06CD5]/60 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#A06CD5]/50 focus:ring-offset-2 focus:ring-offset-[#1C0127]"
          >
            Torna alla Home
          </a>
        </div>
      </div>
    </main>
  );
}
