"use client"

import dynamic from "next/dynamic"
import { type FormEvent, useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TimezoneSelect } from "@/components/timezone-select"

const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((mod) => mod.Calendar),
  { ssr: false }
)

const timeOptions = Array.from({ length: 24 }, (_, hour) => {
  const period = hour < 12 ? "AM" : "PM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12

  return {
    label: `${displayHour}:00 ${period}`,
    value: hour.toString(),
  }
})

function getToOptions() {
  return timeOptions
}

export default function Home() {
  const [eventName, setEventName] = useState("")
  const [eventNameTouched, setEventNameTouched] = useState(false)
  const [description, setDescription] = useState("")
  const [fromTime, setFromTime] = useState("")
  const [toTime, setToTime] = useState("")
  const [availableDates, setAvailableDates] = useState<Date[] | undefined>([])

  const trimmedEventName = eventName.trim()
  const showEventNameError = eventNameTouched && !trimmedEventName
  const toOptions = getToOptions()

  function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setEventNameTouched(true)

    if (!trimmedEventName) {
      return
    }
  }

  return (
    <main className="w-full max-w-4xl mx-auto pt-10 px-4">
      <h1 className="mt-10 text-center font-sans text-4xl font-bold">
        Find the perfect time for your meeting
      </h1>

      <form onSubmit={handleCreateEvent} className="mt-12">
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono flex flex-col gap-6 md:flex-row md:gap-12">
          <div className="space-y-4 md:flex-3">
            <Field>
              <FieldLabel htmlFor="event-name">Event Name</FieldLabel>
              <Input
                id="event-name"
                type="text"
                placeholder="Meeting"
                value={eventName}
                onChange={(event) => setEventName(event.target.value)}
                onBlur={() => setEventNameTouched(true)}
                aria-invalid={showEventNameError}
                required
              />
              <FieldError>
                {showEventNameError ? "Event name is required." : null}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel htmlFor="description">Description</FieldLabel>

              <Textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                placeholder="Add notes, agenda, or context"
              />
                            <FieldDescription className="text-xs text-slate-400">
                Optional details for guests.
              </FieldDescription>
            </Field>

            <Field>
              <FieldLabel htmlFor="show-times">Show Times(Optional)</FieldLabel>
              <div className="flex flex-col gap-2 md:flex-row md:gap-4">
                <Select
                  value={fromTime}
                  onValueChange={setFromTime}
                >
                  <SelectTrigger className="w-[180px]" id="show-times-from">
                    <SelectValue placeholder="From" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {timeOptions.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <Select value={toTime} onValueChange={setToTime}>
                  <SelectTrigger className="w-[180px]" id="show-times-to">
                    <SelectValue placeholder="To" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {toOptions.map((time) => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </Field>

            <Field>
               <FieldLabel htmlFor="timezone">Timezone </FieldLabel>

              <TimezoneSelect className="w-full md:w-[320px]" />
                            <FieldDescription className="text-xs text-slate-400">
                Select the timezone in which you&apos;ve entered the time in.
              </FieldDescription>
            </Field>

            <Button
              className="mt-2"
              size="lg"
              type="submit"
              disabled={!trimmedEventName}
            >
              Create Event
            </Button>
          </div>

          <div className="md:flex-2">
            <Field>
              <FieldLabel className="text-sm text-slate-500">Available Dates</FieldLabel>
              <FieldDescription className="text-xs text-slate-400">
                Select one or more dates when this time range should be available.
              </FieldDescription>
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                <Calendar
                  mode="multiple"
                  selected={availableDates}
                  onSelect={setAvailableDates}
                  className="mx-auto w-3/4 md:w-full"
                />
              </div>
            </Field>
          </div>
        </div>
      </form>
    </main>
  )
}
