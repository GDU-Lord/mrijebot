export function getDate(date: Date, time: boolean = false) {

  return `${toTwoDigits(date.getDate())}.${toTwoDigits(date.getMonth()+1)}.${date.getFullYear()}, ${toTwoDigits(date.getHours())}:${toTwoDigits(date.getMinutes())}`;

}

export function toTwoDigits(n: number) {
  if(n < 10) return "0" + n;
  return String(n).slice(0, 2);
}