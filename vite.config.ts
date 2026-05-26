import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import path from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Aliasing "framer" to a local no-op shim lets the same .tsx file
// work in this playground AND when pasted into Framer (where the
// real `framer` package resolves addPropertyControls + ControlType).
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      framer: path.resolve(__dirname, "src/shims/framer.ts"),
    },
  },
  server: {
    host: true,
    port: 5173,
  },
})
