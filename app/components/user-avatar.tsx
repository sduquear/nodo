type UserAvatarProps = {
  imageUrl?: string | null
  name: string
  size?: "sm" | "lg"
}

export function UserAvatar({ imageUrl, name, size = "sm" }: UserAvatarProps) {
  const initial = name[0].toUpperCase()
  
  const sizeClasses = size === "lg" 
    ? "w-24 h-24 text-4xl" 
    : "w-16 h-16 text-2xl"

  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={`${sizeClasses} rounded-full shadow-lg object-cover`}
      />
    )
  }

  return (
    <div className={`${sizeClasses} rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center font-bold text-white shadow-lg`}>
      {initial}
    </div>
  )
}
