interface EventCardProps {
  day: number | string
  month: string
  title: string
  time: string
  color: string
}

export function EventCard({ day, month, title, time, color }: EventCardProps) {
  return (
    <article className="rounded-[15px] border border-[#efedf4] p-3 transition-all hover:-translate-y-0.5 hover:border-[#dcd6ed]">
      <div className="flex items-center gap-3">
        <div
          className="flex h-12 w-11 flex-none flex-col items-center justify-center rounded-xl text-lg font-black"
          style={{ color, backgroundColor: `${color}14` }}
        >
          <span className="text-xs tracking-[0.08em]">{month}</span>
          {day}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold">{title}</p>
          <p className="mt-1 text-xs font-bold text-page-faint">{time}</p>
        </div>
      </div>
    </article>
  )
}