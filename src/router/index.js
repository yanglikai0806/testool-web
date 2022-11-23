import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [
  {
    path: "/login",
    component: Layout,
    children: [
      {
        path: "/login",
        // component: () => import("@/views/user/Login"),
        name: "登录页面",
      }
    ],
  },
  {
    path: '/',
    component: Layout,
    redirect: '/test_cases'
  },
  {
    path: '/task_plan',
    component: Layout,
    children: [
      {
        path: '/task_plan',
        component: () => import('@/views/test_plan/index')
      }
    ]
  },
  {
    path: '/test_cases',
    component: Layout,
    redirect:"/test_cases",
    children: [
      {
        path: '/test_cases',
        component: () => import('@/views/test_cases/index')
      },
    ]
  },
  {
    path: '/devices',
    component: Layout,
    redirect:"/devices",
    children: [
      {
        path: '/devices',
        component: () => import('@/views/devices/index')
      },
    ]
  },
  {
    path: '/device_remote',
    component: Layout,
    redirect:"/device_remote",
    children: [
      {
        path: '/device_remote',
        component: () => import('@/views/iframe_page/IframePage')
      },
    ]
  },
]

const createRouter = () =>
  new Router({
    mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    base: "/test",
    routes: constantRoutes
  })

const router = createRouter()

export default router
