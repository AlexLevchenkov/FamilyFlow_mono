import { useStore } from "@store"

interface UserProps {
  role?: string
}

export const ProfileUser = ({ role = "Адміністратор" }: UserProps) => {
  const { auth } = useStore()
  const name = auth.user?.name?.trim() || "Олексій К."
  const initials = name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("uk-UA")

  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      {auth.user?.avatar ? (
        <img
          alt={name}
          className="size-10 shrink-0 rounded-full object-cover"
          src={auth.user.avatar}
        />
      ) : (
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[#dfe6ff] text-sm font-extrabold text-[#5267ca]">
          {initials}
        </div>
      )}
      <div className="min-w-0">
        <p className="truncate text-sm font-extrabold">{name}</p>
        <p className="text-xs text-[#9493a8]">{role}</p>
      </div>
    </div>
  )
}