import type { RouteRecordRaw } from "vue-router"

const homeRoutes: RouteRecordRaw[] = [
  {
    path: "/home",
    name: "Home",
    component: () => import("@/views/home/home-page.vue"),
    meta: {
      title: "home.title",
      requiresAuth: true,
    },
  },
]

export default homeRoutes
