"use client"

import { useForm } from "@tanstack/react-form"
import { format } from "date-fns"
import dynamic from "next/dynamic"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { createMeeting } from "@/app/actions/create-meeting"
import { TimezoneSelect } from "@/components/timezone-select"
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
import { createMeetingFormSchema } from "@/lib/schemas/create-meeting"

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

function getDefaultTimezone() {
  return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC"
}

const formSchema = createMeetingFormSchema

export default function Home() {
  const router = useRouter()
  const [submitError, setSubmitError] = useState<string | null>(null)
  const toOptions = getToOptions()

  const form = useForm({
    defaultValues: {
      eventName: "",
      description: "",
      fromTime: "",
      toTime: "",
      timezone: getDefaultTimezone(),
      availableDates: [] as Date[],
    },
    validators: {
      onSubmit: formSchema,
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)
      console.log(value)
      // const result = await createMeeting({
      //   ...value,
      //   availableDates: value.availableDates.map((date) =>
      //     format(date, "yyyy-MM-dd")
      //   ),
      // })

      // if (!result.success) {
      //   setSubmitError(result.error)
      //   return
      // }

      // router.push(`/m/${result.slug}`)
    },
  })

  return (
    <main className="w-full max-w-4xl mx-auto py-10 px-4 md:h-dvh md:relative">
      <h1 className="mt-10 text-center font-mono text-4xl font-bold">
        Find the perfect time for your meeting
      </h1>

      <form
        onSubmit={(event) => {
          event.preventDefault()
          form.handleSubmit()
        }}
        className="mt-12"
      >
        <div className="w-full rounded-2xl border border-slate-200 bg-white p-4 font-mono flex flex-col gap-6 md:flex-row md:gap-12 md:absolute md:inset-x-0 md:top-1/2 md:-translate-y-1/2">
          <div className="space-y-4 md:flex-3">
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
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                      aria-invalid={isInvalid}
                      autoComplete="off"
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

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

            <Field>
              <FieldLabel htmlFor="show-times-from">
                Show Times(Optional)
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
                          {toOptions.map((time) => (
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
                      Select the timezone in which you&apos;ve entered the &apos;Show Time&apos;
                      in.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>

            <form.Subscribe
              selector={(state) => ({
                isSubmitting: state.isSubmitting,
              })}
            >
              {({ isSubmitting }) => (
                <div className="space-y-2">
                  {submitError ? (
                    <p className="text-xs text-destructive" role="alert">
                      {submitError}
                    </p>
                  ) : null}
                  <Button
                    className="mt-2"
                    size="lg"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creating..." : "Create Event"}
                  </Button>
                </div>
              )}
            </form.Subscribe>
          </div>

          <div className="md:flex-2">
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
                      Select one or more dates when this time range should be
                      available.
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
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                )
              }}
            </form.Field>
          </div>
        </div>
      </form>
    </main>
  )
}
