import { notFound } from "next/navigation"

import { getMeetingBySlug } from "@/actions/create-meeting"

function formatHour(hour: number) {
  const period = hour < 12 ? "AM" : "PM"
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}:00 ${period}`
}

function formatDate(dateStr: string) {
  const date = new Date(`${dateStr}T00:00:00`)

  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

export default async function MeetingPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getMeetingBySlug(slug)

  if (!data) {
    notFound()
  }

  const { meeting, dates } = data

  return (
    <main className="w-full max-w-4xl mx-auto py-10 px-4">
      <h1 className="mt-10 text-center font-mono text-4xl font-bold">
        {meeting.eventName}
      </h1>

      {meeting.description ? (
        <p className="mt-4 text-center font-mono text-slate-500">
          {meeting.description}
        </p>
      ) : null}

      <div className="mt-12 w-full rounded-2xl border border-slate-200 bg-white p-6 font-mono">
        <div className="flex flex-wrap gap-6">
          <div className="space-y-1">
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Time Range
            </p>
            <p className="text-sm">
              {formatHour(meeting.showFromHour)} &ndash;{" "}
              {formatHour(meeting.showToHour)}
            </p>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-slate-400 uppercase tracking-wide">
              Timezone
            </p>
            <p className="text-sm">{meeting.timezone}</p>
          </div>
        </div>

        <div className="mt-8 space-y-1">
          <p className="text-xs text-slate-400 uppercase tracking-wide">
            Available Dates
          </p>
          <ul className="mt-2 space-y-1">
            {dates
              .sort(
                (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
              )
              .map((d) => (
                <li key={d.id} className="text-sm">
                  {formatDate(d.date)}
                </li>
              ))}
          </ul>
        </div>
      </div>
    </main>
  )
}
