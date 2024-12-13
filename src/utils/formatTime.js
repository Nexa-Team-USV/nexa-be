export function formatTime(timeValue) {
  const time = new Date(timeValue);
  const tzOffset = (-1 * time.getTimezoneOffset()) / 60;
  return new Date(time.setHours(time.getHours() + tzOffset));
}
