import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { claimUsername, addLink, deleteLink } from "./actions";
import { CopyButton } from "./components/copy-button";
import { ViewPageButton } from "./components/view-page-button";

export default async function Home() {
  const user = await currentUser();

  // Estado 1: Usuario no autenticado
  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
        {/* Hero radial glow */}
        <div className="hero-glow" />
        <div className="card max-w-md w-full text-center p-10 md:p-14 relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tight">
            Nodo
          </h1>
          <p className="text-[#6B7280] text-lg mb-10">
            Tu hub de links personales
          </p>
          <div className="flex flex-col gap-4">
            <SignInButton>
              <button className="w-full py-4 px-8 bg-[#FFDD00] text-black rounded-full font-semibold text-lg hover:bg-[#f5d400] transition-colors cursor-pointer">
                Iniciar sesión
              </button>
            </SignInButton>
            <SignUpButton>
              <button className="w-full py-4 px-8 bg-white text-black border border-[#E5E5E5] rounded-full font-semibold text-lg hover:bg-[#F7F7F7] transition-colors cursor-pointer">
                Crear cuenta
              </button>
            </SignUpButton>
          </div>
        </div>
      </main>
    );
  }

  // Buscar perfil en la base de datos
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: user.id },
    include: { links: true },
  });

  // Estado 2: Autenticado pero sin perfil en DB
  if (!dbUser) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 py-12 relative">
        <div className="fixed top-6 right-6">
          <UserButton />
        </div>
        {/* Hero radial glow */}
        <div className="hero-glow" />
        <div className="card max-w-md w-full p-10 md:p-14 relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 tracking-tight text-center">
            ¡Bienvenido!
          </h1>
          <p className="text-[#6B7280] text-lg mb-10 text-center">
            Elige tu username para continuar
          </p>
          <form action={claimUsername} className="w-full">
            <div className="mb-6">
              <label htmlFor="username" className="block text-sm font-semibold mb-3">
                Username
              </label>
              <div className="flex items-center bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5] px-4 py-4">
                <span className="text-[#6B7280] font-medium">nodo.app/</span>
                <input
                  type="text"
                  id="username"
                  name="username"
                  required
                  minLength={3}
                  pattern="^[a-zA-Z0-9_]+$"
                  placeholder="tu_username"
                  className="flex-1 bg-transparent outline-none text-black placeholder:text-[#9CA3AF] font-medium"
                />
              </div>
              <p className="text-sm text-[#6B7280] mt-3">
                Mínimo 3 caracteres. Solo letras, números y guión bajo.
              </p>
            </div>
            <button
              type="submit"
              className="w-full py-4 px-8 bg-[#FFDD00] text-black rounded-full font-semibold text-lg hover:bg-[#f5d400] transition-colors cursor-pointer"
            >
              Reclamar username
            </button>
          </form>
        </div>
      </main>
    );
  }

  // Estado 3: Autenticado con perfil en DB → Dashboard
  return (
    <main className="min-h-screen px-6 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Dashboard</h1>
          <UserButton />
        </header>

        <div className="card p-8 md:p-10 mb-6">
          <p className="text-xl md:text-2xl">
            ¡Hola, <span className="font-bold">@{dbUser.username}</span>!
          </p>
          <div className="flex items-center justify-between mt-2 gap-4">
            <p className="text-[#6B7280] text-lg">
              Tu perfil público:{" "}
              <span className="font-medium text-black">nodo.app/{dbUser.username}</span>
            </p>
            <div className="flex gap-2">
              <CopyButton username={dbUser.username} />
              <ViewPageButton username={dbUser.username} />
            </div>
          </div>
        </div>

        {/* Formulario para agregar link */}
        <div className="card p-8 md:p-10 mb-6">
          <h2 className="text-xl font-bold mb-6">Agregar link</h2>
          <form action={addLink} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-semibold mb-2">
                Título
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                placeholder="Mi sitio web"
                className="w-full bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5] px-4 py-4 outline-none focus:border-[#FFDD00] transition-colors"
              />
            </div>
            <div>
              <label htmlFor="url" className="block text-sm font-semibold mb-2">
                URL
              </label>
              <input
                type="url"
                id="url"
                name="url"
                required
                placeholder="https://ejemplo.com"
                className="w-full bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5] px-4 py-4 outline-none focus:border-[#FFDD00] transition-colors"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 px-8 bg-[#FFDD00] text-black rounded-full font-semibold text-lg hover:bg-[#f5d400] transition-colors cursor-pointer"
            >
              Agregar link
            </button>
          </form>
        </div>

        {/* Lista de links */}
        <div className="card p-8 md:p-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Tus links</h2>
            <span className="bg-[#F7F7F7] text-[#6B7280] px-4 py-2 rounded-full text-sm font-semibold">
              {dbUser.links.length}
            </span>
          </div>

          {dbUser.links.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-[#6B7280] text-lg">
                Aún no tienes links. ¡Agrega tu primer link arriba!
              </p>
            </div>
          ) : (
            <ul className="space-y-3">
              {dbUser.links.map((link) => (
                <li
                  key={link.id}
                  className="p-5 bg-[#F7F7F7] rounded-2xl border border-[#E5E5E5] flex items-center justify-between gap-4"
                >
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-black hover:text-[#6B7280] transition-colors flex-1 truncate"
                  >
                    {link.title}
                  </a>
                  <form action={deleteLink}>
                    <input type="hidden" name="linkId" value={link.id} />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-red-100 text-red-600 rounded-full text-sm font-semibold hover:bg-red-200 transition-colors cursor-pointer"
                    >
                      Eliminar
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
