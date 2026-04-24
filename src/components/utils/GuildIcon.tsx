export default function GuildIcon(props: { name: string }) {
  const letters = props.name
    .trim()
    .split(" ")
    .map(word => word[0].toUpperCase())

  return <span class="text-lg font-semibold">{letters.slice(0, 4).join("")}</span>
}
