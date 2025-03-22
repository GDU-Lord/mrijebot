let idCounter = 0;

export default function getId() {
  return String(idCounter++);
}