import type { NavigationGuard } from 'vue-router'
export type MiddlewareKey = never
declare module "../../node_modules/.pnpm/nuxt@3.16.2_@netlify+blobs@8.2.0_@parcel+watcher@2.5.1_@types+node@22.15.2_db0@0.3.2_io_fc574b9fd0305058ff36cef4ebbb307f/node_modules/nuxt/dist/pages/runtime/composables" {
  interface PageMeta {
    middleware?: MiddlewareKey | NavigationGuard | Array<MiddlewareKey | NavigationGuard>
  }
}