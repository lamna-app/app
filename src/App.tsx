import "./App.css"
import ServerPicker from "./components/ServerPicker"
import { Guild } from "./types/basic"

export default function App() {
  const guild = {
    name: "Ducki's Hideout",
    created_at: "0",
    id: "0",
    owner_id: "0",
    icon_url: "https://itswilli.dev/milo.jpg"
  } satisfies Guild

  const guilds = new Array(48).fill(guild)
  return (
    <main>
      <ServerPicker guilds={guilds} />
    </main>
  )
}
