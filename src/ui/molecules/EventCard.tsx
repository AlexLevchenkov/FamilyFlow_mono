interface EventCardProps {
  day: number | string
  month: string
  title: string
  time: string
  color: string
}

export function EventCard({ day, month, title, time, color }: EventCardProps) {
  return (
    <article className="rounded-[15px] border border-[#efedf4] p-[11px] transition-all hover:-translate-y-[2px] hover:border-[#dcd6ed]">
      <div className="flex items-center gap-3">
        <div
          className="flex h-[48px] w-[43px] flex-none flex-col items-center justify-center rounded-[12px] text-[17px] font-black"
          style={{ color, backgroundColor: `${color}14` }}
        >
          <span className="text-[8px] tracking-[0.08em]">{month}</span>
          {day}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-extrabold">{title}</p>
          <p className="mt-1 text-xs font-bold text-[#9a98a9]">{time}</p>
        </div>
      </div>
    </article>
  )
}