import type { RemoteAPI } from "@/remote/api"
declare const global: typeof globalThis & {
  shell: RemoteAPI
}
