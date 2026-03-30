export default function GuildIcon({ name }: { name: string }) {
  const letters = name.split(" ").map(word => word[0].toUpperCase())
  return (
    <div class="bg-light text-22l grid size-13.5 place-items-center font-semibold hover:rounded-2xl">
      {letters.slice(0, 4)}
    </div>
  )
}
