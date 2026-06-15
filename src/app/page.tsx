"use client"

import dynamic from "next/dynamic"
import { useState } from "react"

import {
  Field,
  FieldDescription,
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
import { Button } from "@/components/ui/button"

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

function getToOptions(fromValue: string) {
  if (!fromValue) {
    return timeOptions
  }

  const fromIndex = Number(fromValue)

  return [...timeOptions.slice(fromIndex + 1), timeOptions[0]]
}

export default function Home() {
  const [fromTime, setFromTime] = useState("")
  const [toTime, setToTime] = useState("")
  const [availableDates, setAvailableDates] = useState<Date[] | undefined>([])
  const toOptions = getToOptions(fromTime)

  return (
    <main className="w-full max-w-4xl mx-auto pt-10 px-4">
      <h1 className="text-4xl font-bold text-center mt-10  font-sans">Find the perfect time for your meeting</h1>

      <div className="w-full bg-white rounded-2xl border border-slate-200 p-4 mt-12 font-mono flex flex-col md:flex-row gap-6 md:gap-12">
      {/* Form for event name and show times */}
        <div className="space-y-4 md:flex-3">
          <Field>
            <FieldLabel  htmlFor="event-name">Event Name</FieldLabel>
            <Input
              id="event-name"
              type="text"
              placeholder="Meeting"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="show-times">Show Times</FieldLabel>
            <div className="flex flex-col gap-2 md:flex-row md:gap-4">
              
              <Select value={fromTime} onValueChange={(value) => {
                setFromTime(value)
                setToTime("")
              }}>
                <SelectTrigger className="w-[180px]" id="show-times-from">
                  <SelectValue placeholder="From" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {timeOptions.map((time) => (
                      <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
              <Select value={toTime} onValueChange={setToTime} disabled={!fromTime}>
                <SelectTrigger className="w-[180px]" id="show-times-to">
                  <SelectValue placeholder="To" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {toOptions.map((time) => (
                      <SelectItem key={time.value} value={time.value}>{time.label}</SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </Field>
          <Button className="mt-2" size={"lg"} disabled={!fromTime || !toTime}>Create Event</Button>
        </div>


        {/* Available Dates */}
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
    </main>
  );
}
