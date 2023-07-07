// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from "path"
export default defineNuxtConfig({
  typescript: {
    shim: false
  },
  alias: {
    "@": resolve(__dirname, "/")
  },
  css: ["~/assets/main.scss"],
  devtools: { enabled: true },
  
})
