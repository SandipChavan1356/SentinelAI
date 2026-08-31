import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

export function timeAgo(date: string | undefined): string {
  if (!date) return "—";
  return dayjs(date).fromNow();
}

export function fullTimestamp(date: string | undefined): string {
  if (!date) return "—";
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
}

export function clockTime(date: string | undefined): string {
  if (!date) return "—:—:—";
  return dayjs(date).format("HH:mm:ss");
}

export function duration(start: string | undefined, end: string | undefined): string {
  if (!start || !end) return "—";
  const ms = dayjs(end).diff(dayjs(start));
  if (ms < 0) return "—";
  const mins = Math.floor(ms / 60000);
  if (mins < 60) return `${mins}m`;
  const hrs = Math.floor(mins / 60);
  const remMins = mins % 60;
  if (hrs < 24) return `${hrs}h ${remMins}m`;
  const days = Math.floor(hrs / 24);
  return `${days}d ${hrs % 24}h`;
}

export function initialsOf(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
