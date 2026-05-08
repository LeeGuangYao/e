import { createRouter, createWebHistory } from "vue-router"
import { useUserStore } from "@/stores/useUserStore"
import { $t } from "@/i18n"
import loginRoutes from "./loginRoute"
import userRoutes from "./userRoute"
import homeRoutes from "./homeRoute"

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    ...loginRoutes,
    ...userRoutes,
    ...homeRoutes,
    {
      path: "/",
      redirect: "/home",
    },
  ],
})

router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()

  if (to.meta.title) {
    document.title = $t(to.meta.title as string)
  }

  if (to.meta.requiresAuth && !userStore.isLoggedIn) {
    next({ path: "/login", query: { redirect: to.fullPath } })
    return
  }

  if (to.meta.permission) {
    const required = to.meta.permission as string | string[]
    if (!userStore.hasPermission(required)) {
      next({ path: "/login" })
      return
    }
  }

  next()
})

export default router
