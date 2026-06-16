"use client"

import { useState } from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function getSupportedTimeZones() {
  if (typeof Intl.supportedValuesOf === "function") {
    return Intl.supportedValuesOf("timeZone")
  }

  return ["UTC"]
}

type TimezoneSelectProps = {
  onValueChange?: (value: string) => void
  className?: string
}

export function TimezoneSelect({
  onValueChange,
  className,
}: TimezoneSelectProps) {
  const [selectedTimeZone, setSelectedTimeZone] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  )

  const timeZones = getSupportedTimeZones()

  return (
    <Select
      value={selectedTimeZone}
      onValueChange={(value) => {
        setSelectedTimeZone(value)
        onValueChange?.(value)
      }}
    >
      <SelectTrigger className={className} id="timezone">
        <SelectValue placeholder="Select timezone" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {timeZones.map((timeZone) => (
            <SelectItem key={timeZone} value={timeZone}>
              {timeZone}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
