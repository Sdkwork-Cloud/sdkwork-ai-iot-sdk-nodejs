// UI组件演示页面路由配置
export default {
  name: 'UI演示',
  path: '/ui',
  children: [
    {
      name: '弹窗演示',
      path: 'popup-demo',
      component: () => import('./popup-demo.vue'),
      meta: {
        title: 'Vant弹窗组件演示',
        requiresAuth: false
      }
    }
  ]
}