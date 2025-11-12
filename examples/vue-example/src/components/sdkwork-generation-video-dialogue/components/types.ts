// 视频设置接口
export interface VideoSettings {
  title: string
  description: string
  resolution: '480p' | '720p' | '1080p' | '4K'
  format: 'mp4' | 'mov' | 'avi' | 'webm'
  backgroundMusic: '' | 'light' | 'warm' | 'inspiring' | 'romantic'
  addSubtitle: boolean
  addTransition: boolean
  loopMusic: boolean
}