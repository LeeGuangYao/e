import type { RouteRecordRaw } from "vue-router"

const loginRoutes: RouteRecordRaw[] = [
  {
    path: "/login",
    name: "Login",
    component: () => import("@/views/login/login-page.vue"),
    meta: {
      title: "login.title",
      requiresAuth: false,
    },
  },
]

export default loginRoutes
