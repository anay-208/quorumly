import { notFound } from "next/navigation"

import { getMeetingBySlug } from "@/actions/create-meeting"
import { getResponses } from "@/actions/responses"
import { MeetingContent } from "@/components/meeting/meeting-content"

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

  const responses = await getResponses(data.meeting.id)

  return (
    <MeetingContent
      meeting={data.meeting}
      dates={data.dates}
      initialResponses={responses}
    />
  )
}
