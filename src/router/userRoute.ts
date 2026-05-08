import type { RouteRecordRaw } from "vue-router"

const userRoutes: RouteRecordRaw[] = [
  {
    path: "/user",
    name: "User",
    redirect: "/user/profile",
    meta: {
      title: "user.profile",
      requiresAuth: true,
    },
    children: [
      {
        path: "profile",
        name: "UserProfile",
        component: () => import("@/views/login/login-page.vue"),
        meta: {
          title: "user.profile",
          requiresAuth: true,
        },
      },
      {
        path: "change-password",
        name: "UserChangePassword",
        component: () => import("@/views/login/login-page.vue"),
        meta: {
          title: "user.changePassword",
          requiresAuth: true,
        },
      },
    ],
  },
]

export default userRoutes
