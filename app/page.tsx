import { currentUser } from "@clerk/nextjs/server";
import { SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import prisma from "@/lib/prisma";
import { claimUsername } from "./actions";

export default async function Home() {
  const user = await currentUser();

  // Estado 1: Usuario no autenticado
  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-4">Nodo</h1>
        <p className="text-gray-600 mb-8">Tu hub de links personales</p>
        <div className="flex gap-4">
          <SignInButton>
            <button className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 cursor-pointer">
              Sign In
            </button>
          </SignInButton>
          <SignUpButton>
            <button className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 cursor-pointer">
              Sign Up
            </button>
          </SignUpButton>
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
      <main className="min-h-screen flex flex-col items-center justify-center p-8">
        <div className="absolute top-4 right-4">
          <UserButton />
        </div>
        <h1 className="text-3xl font-bold mb-2">¡Bienvenido!</h1>
        <p className="text-gray-600 mb-8">Elige tu username para continuar</p>
        <form action={claimUsername} className="w-full max-w-sm">
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username
            </label>
            <div className="flex items-center">
              <span className="text-gray-500 mr-1">nodo.app/</span>
              <input
                type="text"
                id="username"
                name="username"
                required
                minLength={3}
                pattern="^[a-zA-Z0-9_]+$"
                placeholder="tu_username"
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Mínimo 3 caracteres. Solo letras, números y guión bajo.
            </p>
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium cursor-pointer"
          >
            Claim Username
          </button>
        </form>
      </main>
    );
  }

  // Estado 3: Autenticado con perfil en DB → Dashboard
  return (
    <main className="min-h-screen p-8">
      <header className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <UserButton />
      </header>
      <div className="bg-white rounded-lg shadow p-6">
        <p className="text-lg">
          ¡Hola, <span className="font-semibold">@{dbUser.username}</span>!
        </p>
        <p className="text-gray-600 mt-2">
          Tu perfil público: nodo.app/{dbUser.username}
        </p>
        <div className="mt-6">
          <h2 className="font-semibold mb-2">Tus links ({dbUser.links.length})</h2>
          {dbUser.links.length === 0 ? (
            <p className="text-gray-500">Aún no tienes links. ¡Agrega tu primer link!</p>
          ) : (
            <ul className="space-y-2">
              {dbUser.links.map((link) => (
                <li key={link.id} className="p-3 bg-gray-50 rounded-lg">
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {link.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
