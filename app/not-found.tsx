import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
      <div className="bg-white rounded-3xl shadow-sm border border-[#E5E5E5] p-10 md:p-14 max-w-md w-full text-center">
        <h1 className="text-6xl md:text-7xl font-bold mb-4 tracking-tight">
          404
        </h1>
        <p className="text-[#6B7280] text-lg mb-10">
          Oops, esta página no existe o fue movida.
        </p>
        <Link
          href="/"
          className="inline-block w-full py-4 px-8 bg-[#FFDD00] text-black rounded-full font-semibold text-lg hover:bg-[#f5d400] transition-colors"
        >
          Ir al inicio
        </Link>
      </div>
    </main>
  );
}
