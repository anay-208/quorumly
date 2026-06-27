"use client"

import { useCallback, useRef } from "react"

import { cn } from "@/lib/utils"

export type TimeSlot = {
  hour: number
  minute: number
}

export type SelectedSlots = Set<string>

export function slotKey(date: string, hour: number, minute: number) {
  return `${date}T${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`
}

export function parseSlotKey(key: string) {
  const [date, time] = key.split("T")
  const [hour, minute] = time.split(":").map(Number)
  return { date, hour, minute }
}

export function formatHour(hour: number, minute: number) {
  const period = hour < 12 ? "AM" : "PM"
  const display = hour % 12 === 0 ? 12 : hour % 12
  return `${display}:${String(minute).padStart(2, "0")} ${period}`
}

function generateTimeSlots(fromHour: number, toHour: number): TimeSlot[] {
  const slots: TimeSlot[] = []
  for (let h = fromHour; h <= toHour; h++) {
    slots.push({ hour: h, minute: 0 })
    if (h < toHour) {
      slots.push({ hour: h, minute: 30 })
    }
  }
  return slots
}

type AvailabilityGridProps = {
  dates: { id: string; date: string }[]
  fromHour: number
  toHour: number
  selectedSlots: SelectedSlots
  onToggle: (key: string) => void
  onClear: () => void
  onHover: (key: string | null) => void
  peopleBySlot: Record<string, string[]>
  readOnly?: boolean
}

export function AvailabilityGrid({
  dates,
  fromHour,
  toHour,
  selectedSlots,
  onToggle,
  onClear,
  onHover,
  peopleBySlot,
  readOnly = false,
}: AvailabilityGridProps) {
  const isDraggingRef = useRef(false)
  const dragModeRef = useRef<"select" | "deselect" | null>(null)
  const visitedKeysRef = useRef(new Set<string>())

  const timeSlots = generateTimeSlots(fromHour, toHour)

  const handlePointerDown = useCallback(
    (key: string) => {
      if (readOnly) return
      isDraggingRef.current = true
      dragModeRef.current = selectedSlots.has(key) ? "deselect" : "select"
      visitedKeysRef.current = new Set([key])
      onToggle(key)
    },
    [selectedSlots, onToggle, readOnly]
  )

  const handlePointerEnter = useCallback(
    (key: string) => {
      onHover(key)
      if (readOnly || !isDraggingRef.current || !dragModeRef.current) return

      if (visitedKeysRef.current.has(key)) return
      visitedKeysRef.current.add(key)
      onToggle(key)
    },
    [onHover, onToggle, readOnly]
  )

  const handleKeyDown = useCallback(
    (key: string, e: React.KeyboardEvent) => {
      if (readOnly) return
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault()
        onToggle(key)
      }
    },
    [readOnly, onToggle]
  )

  const endDrag = useCallback(() => {
    isDraggingRef.current = false
    dragModeRef.current = null
    visitedKeysRef.current = new Set()
  }, [])

  const sortedDates = [...dates].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  )

  return (
    <div
      className="overflow-auto rounded-xl border border-slate-200 bg-white p-3 select-none"
      onPointerUp={() => { if (!readOnly) endDrag() }}
      onPointerLeave={() => { if (!readOnly) { endDrag(); onHover(null) } }}
    >
      <div className="flex select-none sticky top-0 z-20 bg-white pb-2">
        <div className="w-12 shrink-0" />
        <div className="flex flex-1 min-w-0 bg-slate-200 rounded-t-md overflow-hidden" style={{ gap: "1px" }}>
          {sortedDates.map((d) => {
            const date = new Date(`${d.date}T00:00:00`)
            return (
              <div
                key={d.id}
                className="flex-1 min-w-0 bg-white px-1 py-1 text-center text-xs font-medium text-slate-500"
              >
                <div>
                  {date.toLocaleDateString("en-US", { weekday: "short" })}
                </div>
                <div>
                  {date.toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex flex-col bg-slate-200 rounded-b-md overflow-hidden" style={{ gap: "1px" }}>
        {timeSlots.map((slot) => (
          <div key={`${slot.hour}-${slot.minute}`} className="flex" style={{ gap: "1px" }}>
            <div className="sticky left-0 z-10 w-12 shrink-0 bg-white py-1 pr-2 text-right text-xs text-slate-400">
              {formatHour(slot.hour, slot.minute)}
            </div>
            {sortedDates.map((d) => {
              const key = slotKey(d.date, slot.hour, slot.minute)
              const isSelected = selectedSlots.has(key)
              const people = peopleBySlot[key]
              const count = people?.length ?? 0

              let cellClass: string
              let cellStyle: React.CSSProperties | undefined

              if (isSelected) {
                cellClass = "hover:brightness-90"
                cellStyle = { backgroundColor: "#216e39" }
              } else if (readOnly && count > 0) {
                const level =
                  count <= 1
                    ? "#9be9a8"
                    : count <= 2
                      ? "#40c463"
                      : count <= 3
                        ? "#30a14e"
                        : "#216e39"
                cellStyle = { backgroundColor: level }
                cellClass = "hover:brightness-90"
              } else {
                cellClass = readOnly ? "bg-white" : "bg-white hover:bg-[#9be9a8]"
                cellStyle = undefined
              }

              return (
                <div
                  key={key}
                  role="button"
                  tabIndex={readOnly ? -1 : 0}
                  aria-label={`${formatHour(slot.hour, slot.minute)} on ${new Date(`${d.date}T00:00:00`).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}`}
                  aria-pressed={isSelected}
                  className={cn("flex-1 min-w-0 transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-green-500", cellClass)}
                  style={cellStyle}
                  onPointerDown={(e) => { e.preventDefault(); handlePointerDown(key); }}
                  onPointerEnter={() => handlePointerEnter(key)}
                  onKeyDown={(e) => handleKeyDown(key, e)}
                >
                  <div className={cn("h-6", readOnly ? "" : "cursor-pointer")} />
                </div>
              )
            })}
          </div>
        ))}
      </div>

      {selectedSlots.size > 0 && !readOnly && (
        <div className="flex items-center justify-end gap-2 pt-3">
          <p className="text-xs text-slate-500">
            {selectedSlots.size} slot{selectedSlots.size !== 1 ? "s" : ""}{" "}
            selected
          </p>
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-red-500 hover:text-red-600"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  )
}
