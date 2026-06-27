"use client"

import dynamic from "next/dynamic"

import { timeOptions } from "@/lib/constants/time"
import { TimezoneSelect } from "@/components/timezone-select"
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
import type { CreateMeetingForm } from "@/components/home/use-create-meeting-form"

const Calendar = dynamic(
  () => import("@/components/ui/calendar").then((mod) => mod.Calendar),
  { ssr: false }
)

export function EventNameField({ form }: { form: CreateMeetingForm }) {
  return (
    <form.Field name="eventName">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Event Name</FieldLabel>
            <Input
              id={field.name}
              name={field.name}
              type="text"
              placeholder="Meeting"
              value={field.state.value}
              onBlur={field.handleBlur}
              onChange={(event) => field.handleChange(event.target.value)}
              aria-invalid={isInvalid}
              autoComplete="off"
            />
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    </form.Field>
  )
}

export function DescriptionField({ form }: { form: CreateMeetingForm }) {
  return (
    <form.Field name="description">
      {(field) => (
        <Field>
          <FieldLabel htmlFor={field.name}>Description</FieldLabel>
          <Textarea
            id={field.name}
            name={field.name}
            value={field.state.value}
            onBlur={field.handleBlur}
            onChange={(event) => field.handleChange(event.target.value)}
            rows={4}
            placeholder="Add notes, agenda, or context"
          />
          <FieldDescription className="text-xs text-slate-400">
            Optional details for guests.
          </FieldDescription>
        </Field>
      )}
    </form.Field>
  )
}

export function TimeRangeField({ form }: { form: CreateMeetingForm }) {
  return (
    <Field>
      <FieldLabel htmlFor="show-times-from">
        Show Times
      </FieldLabel>
      <div className="flex flex-col gap-2 md:flex-row md:gap-4">
        <form.Field name="fromTime">
          {(field) => (
            <Select
              name={field.name}
              value={field.state.value}
              onValueChange={field.handleChange}
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
          )}
        </form.Field>
        <form.Field name="toTime">
          {(field) => (
            <Select
              name={field.name}
              value={field.state.value}
              onValueChange={field.handleChange}
            >
              <SelectTrigger className="w-[180px]" id="show-times-to">
                <SelectValue placeholder="To" />
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
          )}
        </form.Field>
      </div>
    </Field>
  )
}

export function TimezoneField({ form }: { form: CreateMeetingForm }) {
  return (
    <form.Field name="timezone">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel htmlFor={field.name}>Timezone</FieldLabel>
            <TimezoneSelect
              id={field.name}
              className="w-full md:w-[320px]"
              value={field.state.value}
              onValueChange={field.handleChange}
            />
            <FieldDescription className="text-xs text-slate-400">
              Select the timezone in which you&apos;ve entered the &apos;Show
              Time&apos; in.
            </FieldDescription>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    </form.Field>
  )
}

export function AvailableDatesField({ form }: { form: CreateMeetingForm }) {
  return (
    <form.Field name="availableDates">
      {(field) => {
        const isInvalid =
          field.state.meta.isTouched && !field.state.meta.isValid

        return (
          <Field data-invalid={isInvalid}>
            <FieldLabel className="text-sm text-slate-500">
              Available Dates
            </FieldLabel>
            <FieldDescription className="text-xs text-slate-400">
              Select one or more dates when this time range should be available.
            </FieldDescription>
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-3">
              <Calendar
                mode="multiple"
                selected={field.state.value}
                onSelect={(dates) => {
                  field.handleChange(dates ?? [])
                  field.handleBlur()
                }}
                className="mx-auto w-3/4 md:w-full"
              />
            </div>
            {isInvalid && <FieldError errors={field.state.meta.errors} />}
          </Field>
        )
      }}
    </form.Field>
  )
}
