import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/setup',
    component: Layout,
    redirect: '/setup',
    meta: { title: 'message.menu.setup.name', icon: 'el-icon-document-copy' },
    children: [
      {
        path: 'setup',
        component: createNameComponent(() => import('@/views/main/setup/index.vue')),
        meta: { title: 'message.menu.setup.name', cache: false, roles: ['admin', 'editor'] }
      }
    ]
  }
]

export default route
