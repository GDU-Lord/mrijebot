export function getLink(text: string, link: string | null) {
  if(!link) return text;
  return `<a href="${link}">${text}</a>`;
}