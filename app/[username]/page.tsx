import { notFound } from "next/navigation"
import Link from "next/link"
import { clerkClient } from "@clerk/nextjs/server"
import prisma from "@/lib/prisma"
import { UserAvatar } from "@/app/components/user-avatar"

type Props = {
  params: Promise<{ username: string }>
}

export default async function ProfilePage({ params }: Props) {
  const { username } = await params

  const user = await prisma.user.findUnique({
    where: { username },
    include: { links: true },
  })

  if (!user) {
    notFound()
  }

  // Get the Clerk user to obtain the profile picture
  const client = await clerkClient()
  const clerkUser = await client.users.getUser(user.clerkId)

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 flex flex-col items-center justify-center py-12 px-4">
      {/* Profile card */}
      <div className="card w-full max-w-md text-center">
        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <UserAvatar
            imageUrl={clerkUser.imageUrl}
            name={user.name || user.username}
            size="lg"
          />
        </div>

        {/* Username & Name */}
        <h1 className="text-2xl font-bold text-gray-900 mb-1">
          {user.name || user.username}
        </h1>
        <p className="text-gray-500 text-sm mb-8">@{user.username}</p>

        {/* Links */}
        <div className="space-y-3">
          {user.links.length > 0 ? (
            user.links.map((link) => (
              <a
                key={link.id}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full bg-[#F7F7F7] hover:bg-[#EFEFEF] text-gray-800 font-medium py-4 px-6 rounded-xl text-center transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
              >
                {link.title}
              </a>
            ))
          ) : (
            <p className="text-gray-400 py-8">
              No hay links todavía
            </p>
          )}
        </div>
      </div>

      {/* Create your own - outside the card */}
      <div className="mt-8">
        <Link
          href="/"
          className="text-white/60 hover:text-white text-sm transition-colors duration-200 flex items-center gap-2"
        >
          <span>✨</span>
          <span>Create your own</span>
        </Link>
      </div>
    </div>
  )
}
