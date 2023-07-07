import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/home/index.vue'
import Service from '@/views/service/index.vue'
import ServiceOne from '@/views/service/children/service-one.vue'
import ServiceTwo from '@/views/service/children/service-two.vue'
import Policy from '@/views/policy/index.vue'
import PolicyDetail from '@/views/policy/detail.vue'
import Personal from '@/views/personal/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home
    },
    {
      path: '/service',
      name: 'service',
      redirect: '/service/serviceOne', // 嵌套路由的重定向
      component: Service,
      // 通过 children 属性嵌套声明子级路由规则
      // 注意：子路由的path不要以/开头
      children: [
        {
          path: 'serviceOne',
          component: ServiceOne
        },
        {
          path: 'serviceTwo',
          component: ServiceTwo
        }
      ]
    },
    {
      path: '/policy',
      name: 'policy',
      component: Policy
    },
    {
      path: '/policyDetail',
      name: 'policyDetail',
      component: PolicyDetail
    },
    {
      path: '/personal',
      name: 'personal',
      component: Personal
    }
  ]
})

export default router
