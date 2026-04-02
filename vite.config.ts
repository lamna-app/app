import { fileURLToPath } from "node:url"

import tailwindcss from "@tailwindcss/vite"
import Icons from "unplugin-icons/vite"
import { defineConfig } from "vite"
import solid from "vite-plugin-solid"
import solidSvg from "vite-plugin-solid-svg"

const host = process.env.TAURI_DEV_HOST

export default defineConfig(async () => ({
  plugins: [solid(), tailwindcss(), solidSvg(), Icons({ compiler: "solid" })],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url))
    }
  },

  clearScreen: false,
  base: "/app",
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? {
          protocol: "ws",
          host,
          port: 1421
        }
      : undefined,
    watch: {
      ignored: ["**/src-tauri/**"]
    }
  }
}))
