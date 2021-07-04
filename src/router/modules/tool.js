/** When your routing table is too long, you can split it into small modules**/

import Layout from '@/layout'

// 工具一路径，后面再改名

const toolRouter = {
  path: '/tool',
  component: Layout,
  redirect: 'noRedirect',
  name: '工具',
  meta: {
    title: '工具',
    icon: 'json'
  },
  children: [
    {
      path: 'jsonFormat',
      component: () => import('@/views/tool/jsonFormat'),
      name: 'MixChart',
      meta: { title: '格式化工具', noCache: false }
    }
  ]
}

export default toolRouter
