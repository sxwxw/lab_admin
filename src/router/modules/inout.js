import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/inout',
    component: Layout,
    redirect: '/inout/record',
    meta: { title: 'message.menu.inout.name', icon: 'el-icon-document-copy' },
    alwayShow: true,
    children: [
      {
        path: 'record',
        component: createNameComponent(() => import('@/views/main/inout/record/index.vue')),
        meta: { title: 'message.menu.inout.record', cache: false, roles: ['admin', 'editor'] }
      }
    ]
  }
]

export default route
