import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/pages',
    component: Layout,
    redirect: '/pages/userManagement',
    meta: { title: 'message.menu.page.name', icon: 'el-icon-document-copy' },
    alwayShow: true,
    children: [
      {
        path: 'userManagement',
        component: createNameComponent(() => import('@/views/main/pages/userManagement/index.vue')),
        meta: { title: 'message.menu.page.userManagement', cache: false, roles: ['admin', 'editor'] }
      },
      {
        path: 'userTypeManagement',
        component: createNameComponent(() => import('@/views/main/pages/userTypeManagement/index.vue')),
        meta: { title: 'message.menu.page.userTypeManagement', cache: true, roles: ['admin'] }
      },
      {
        path: 'visitorManagement',
        component: createNameComponent(() => import('@/views/main/pages/visitorManagement/index.vue')),
        meta: { title: 'message.menu.page.visitorManagement', cache: true }
      },
      {
        path: 'unitManagement',
        component: createNameComponent(() => import('@/views/main/pages/unitManagement/index.vue')),
        meta: { title: 'message.menu.page.unitManagement', cache: true }
      },
      {
        path: 'classgroup',
        component: createNameComponent(() => import('@/views/main/pages/classgroup/index.vue')),
        meta: { title: 'message.menu.page.classgroup', cache: true }
      },
      {
        path: 'todo',
        component: createNameComponent(() => import('@/views/main/pages/todo/index.vue')),
        meta: { title: 'message.menu.page.todo', cache: true }
      }
    ]
  }
]

export default route
