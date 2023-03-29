import Layout from '@/layout/index.vue'
import { createNameComponent } from '../createNode'
const route = [
  {
    path: '/infomation',
    component: Layout,
    redirect: '/infomation/faceinfo',
    meta: { title: 'message.menu.infomation.name', icon: 'el-icon-document-copy' },
    alwayShow: true,
    children: [
      {
        path: 'faceinfo',
        component: createNameComponent(() => import('@/views/main/infomation/faceinfo/index.vue')),
        meta: { title: 'message.menu.infomation.faceinfo', cache: false, roles: ['admin', 'editor'] }
      },
      {
        path: 'fingerinfo',
        component: createNameComponent(() => import('@/views/main/infomation/fingerinfo/index.vue')),
        meta: { title: 'message.menu.infomation.fingerinfo', cache: true, roles: ['admin'] }
      }
    ]
  }
]

export default route
