import common from './common'

export default {
  common,
  auth: {
    login: '登录',
    register: '注册',
    username: '用户名',
    password: '密码',
    email: '邮箱',
    usernamePlaceholder: '请输入用户名',
    passwordPlaceholder: '请输入密码',
    emailPlaceholder: '请输入邮箱',
    confirmPassword: '确认密码',
    confirmPasswordPlaceholder: '请再次输入密码'
  },
  device: {
    device: '设备',
    devices: '设备列表',
    searchPlaceholder: '搜索设备名称或ID',
    noDevices: '暂无设备',
    online: '在线',
    offline: '离线'
  },
  agent: {
    speakState: {
      IDLE: '等待发言',
      LISTENING: '正在聆听...',
      SPEAKING: '正在说话中...'
    },
    create: {
      title: '创建智能体',
      description: '定制您的专属AI助手，配置个性化角色和声音',
      successMessage: '智能体创建成功！',
      cancelMessage: '已取消创建智能体'
    }
  }
}