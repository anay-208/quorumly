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
  value?: string
  onValueChange?: (value: string) => void
  className?: string
  id?: string
}

export function TimezoneSelect({
  value,
  onValueChange,
  className,
  id = "timezone",
}: TimezoneSelectProps) {
  const [internalValue, setInternalValue] = useState(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
  )
  const selectedTimeZone = value ?? internalValue

  const timeZones = getSupportedTimeZones()

  return (
    <Select
      value={selectedTimeZone}
      onValueChange={(nextValue) => {
        if (value === undefined) {
          setInternalValue(nextValue)
        }
        onValueChange?.(nextValue)
      }}
    >
      <SelectTrigger className={className} id={id}>
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
