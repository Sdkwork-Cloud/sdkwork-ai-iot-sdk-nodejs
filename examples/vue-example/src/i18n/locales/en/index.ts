import common from './common'

export default {
  common,
  auth: {
    login: 'Login',
    register: 'Register',
    username: 'Username',
    password: 'Password',
    email: 'Email',
    usernamePlaceholder: 'Please enter username',
    passwordPlaceholder: 'Please enter password',
    emailPlaceholder: 'Please enter email',
    confirmPassword: 'Confirm Password',
    confirmPasswordPlaceholder: 'Please enter password again'
  },
  device: {
    device: 'Device',
    devices: 'Device List',
    searchPlaceholder: 'Search device name or ID',
    noDevices: 'No devices',
    online: 'Online',
    offline: 'Offline'
  },
  agent: {
    speakState: {
      IDLE: 'Waiting to speak',
      LISTENING: 'Listening...',
      SPEAKING: 'Speaking...'
    },
    create: {
      title: 'Create Agent',
      description: 'Customize your AI assistant with personalized role and voice',
      successMessage: 'Agent created successfully!',
      cancelMessage: 'Agent creation canceled'
    }
  }
}