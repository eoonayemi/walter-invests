export const refDate = (dateStr: string) => {
  let customDate = dateStr?.split("T")[0];
  customDate = customDate.split("-").reverse().join("-");
  return customDate;
};

export function getNextDay(dateString: string) {
  const date = new Date(dateString);
  const nextDay = new Date(date);
  nextDay.setDate(date.getDate() + 1);
  const nextDayStr = nextDay.toISOString();
  return refDate(nextDayStr);
}

export const refDateTime = (dateStr: string) => {
  const date = new Date(dateStr);
  const lagosTimeZone = "Africa/Lagos";
  const options = { timeZone: lagosTimeZone };
  let convertedDate = date.toLocaleString(options as never);
  convertedDate = convertedDate.split(", ")[0].split("/").join("-");
  const time = date.toLocaleString("en-US", options).split(", ")[1];
  console.log(convertedDate);
  const customDate = `${convertedDate} ${time}`;
  return customDate;
};

export function formatDate(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });
  const year = date.getFullYear();
  const suffix = getOrdinalSuffix(day);

  return `${day}${suffix} ${month}, ${year}`;
}

function getOrdinalSuffix(day: number) {
  const ones = day % 10;
  const tens = Math.floor(day / 10) % 10;

  if (tens === 1) {
    return "th";
  } else if (ones === 1) {
    return "st";
  } else if (ones === 2) {
    return "nd";
  } else if (ones === 3) {
    return "rd";
  } else {
    return "th";
  }
}
