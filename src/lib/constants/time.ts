export const timeOptions = Array.from({ length: 24 }, (_, hour) => {
  const period = hour < 12 ? "AM" : "PM"
  const displayHour = hour % 12 === 0 ? 12 : hour % 12

  return {
    label: `${displayHour}:00 ${period}`,
    value: hour.toString(),
  }
})
