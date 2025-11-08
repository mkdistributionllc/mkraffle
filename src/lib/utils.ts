import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateString: string) {
  // Return empty string or fallback for invalid input
  if (!dateString || typeof dateString !== "string") {
    return "";
  }
  // Parse the date string
  const date = new Date(dateString);
  // Check if the date is valid
  if (isNaN(date.getTime())) {
    return "";
  }
  // Get the day and add ordinal suffix (1st, 2nd, 3rd, 4th)
  const day = date.getDate();
  const ordinalSuffix = getOrdinalSuffix(day);
  // Format the month, day, and year
  const month = new Intl.DateTimeFormat("en-US", { month: "long" }).format(date);
  const year = date.getFullYear();
  // Format the time (12-hour with AM/PM)
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
  // Combine into final format: "June 1st, 2023 4:13 PM"
  return `${month} ${day}${ordinalSuffix}, ${year} ${time}`;
}

function getOrdinalSuffix(day: number) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

